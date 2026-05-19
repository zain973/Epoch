const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { authenticateToken } = require('./middleware');
require('dotenv').config();

const app = express();
app.use(express.json());

const db = new Pool({ connectionString: process.env.DATABASE_URL });

// Helper to convert titles into URL-safe strings
const slugify = (text) => text.toString().toLowerCase().trim().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');

// ==========================================
// 1. USER & IDENTITY MANAGEMENT
// ==========================================

// Feature 1: Register a new user
app.post('/api/users/register', async (req, res) => {
  const { username, email, password, is_author } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, is_author) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
      [username, email, passwordHash, is_author || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Username or Email structural duplication error.' });
  }
});

// Feature 2: Login user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid login criteria.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    
    // Track Logging internally
    await db.query('INSERT INTO auth_logs (user_id, action) VALUES ($1, $2)', [user.id, 'LOGIN']);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature 3: Logout user
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await db.query('INSERT INTO auth_logs (user_id, action) VALUES ($1, $2)', [req.user.id, 'LOGOUT']);
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature 4: Update author biography
app.patch('/api/users/profile', authenticateToken, async (req, res) => {
  const { bio } = req.body;
  try {
    const result = await db.query('UPDATE users SET bio = $1 WHERE id = $2 RETURNING id, username, bio', [bio, req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. CONTENT & PUBLISHING
// ==========================================

// Feature 5: Create a new article
app.post('/api/articles', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const slug = `${slugify(title)}-${Date.now()}`;
    const result = await db.query(
      "INSERT INTO articles (author_id, title, slug, content, status) VALUES ($1, $2, $3, $4, 'published') RETURNING *",
      [req.user.id, title, slug, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature 6: Link tags to article
app.post('/api/articles/:id/tags', authenticateToken, async (req, res) => {
  const { tag_id } = req.body;
  const articleId = req.params.id;
  try {
    const countRes = await db.query('SELECT COUNT(*) FROM article_tags WHERE article_id = $1', [articleId]);
    if (parseInt(countRes.rows[0].count) >= 5) {
      return res.status(400).json({ error: 'Tag assignment limit maxed out (Limit: 5)' });
    }
    await db.query('INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [articleId, tag_id]);
    res.json({ message: 'Tag linked successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature 7: View article details & Feature 20: Increment view count
app.get('/api/articles/:slug', async (req, res) => {
  try {
    // Feature 20: Atomic execution inside the look-up workflow
    await db.query('UPDATE articles SET view_count = view_count + 1 WHERE slug = $1', [req.params.slug]);

    const result = await db.query(
      'SELECT a.*, u.username, u.bio FROM articles a JOIN users u ON a.author_id = u.id WHERE a.slug = $1',
      [req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Article not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature 8: Update article
app.put('/api/articles/:id', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await db.query(
      'UPDATE articles SET title = $1, content = $2 WHERE id = $3 AND author_id = $4 RETURNING *',
      [title, content, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(403).json({ error: 'Unauthorized modify action or missing row.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature 9: Delete article
app.delete('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM articles WHERE id = $1 AND author_id = $2 RETURNING *', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(403).json({ error: 'Unauthorized delete action or missing row.' });
    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// TRACK A CLASSICAL FEED (CRITICAL)
// ==========================================

// **Global Chronological Feed**
// Overrides personalized features by querying globally across database state using published timestamps
app.get('/api/feed/classical', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.id, a.title, a.slug, a.content, a.view_count, a.published_at, u.username as author_name 
       FROM articles a 
       JOIN users u ON a.author_id = u.id 
       ORDER BY a.published_at DESC 
       LIMIT 20`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. DIVERSITY ENGINE (MOCK LOGIC FOR TRACK A COMPATIBILITY)
// ==========================================

// Feature 10: Log user interaction
app.post('/api/interactions/log', authenticateToken, async (req, res) => {
  const { article_id, type, reading_time_seconds } = req.body;
  try {
    await db.query('INSERT INTO interactions (user_id, article_id, type, reading_time_seconds) VALUES ($1, $2, $3, $4)', 
      [req.user.id, article_id, type, reading_time_seconds || 0]);
    res.json({ message: 'Interaction saved.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Feature 11: Identify user's primary interest
app.get('/api/analytics/user-bias', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT tag_id FROM interactions JOIN article_tags USING(article_id) WHERE user_id = $1 GROUP BY tag_id ORDER BY COUNT(*) DESC LIMIT 1`,
      [req.user.id]
    );
    res.json({ primary_tag_bias: result.rows[0] ? result.rows[0].tag_id : null, tracking_type: 'Classical System Fallback' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Feature 12: Generate contrarian feed (Static proxy pass for Track A)
app.get('/api/feed/pivot', async (req, res) => {
  try {
    const result = await db.query('SELECT id, title, slug FROM articles ORDER BY RANDOM() LIMIT 5');
    res.json({ configuration: "Track A Active: Uniform Random Sampling substitution used.", items: result.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Feature 13: Define tag mapping rules
app.post('/api/admin/tags/map', authenticateToken, async (req, res) => {
  res.json({ status: "Action bypassed: Subsystem omitted in classical running models." });
});

// ==========================================
// 4. ENGAGEMENT & CURATION
// ==========================================

// Feature 14: Bookmark an article
app.post('/api/bookmarks', authenticateToken, async (req, res) => {
  const { article_id } = req.body;
  try {
    await db.query('INSERT INTO bookmarks (user_id, article_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.user.id, article_id]);
    res.json({ message: 'Article bookmarked.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Feature 15: Remove bookmark
app.delete('/api/bookmarks/:article_id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM bookmarks WHERE user_id = $1 AND article_id = $2', [req.user.id, req.params.article_id]);
    res.json({ message: 'Bookmark cleared.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Feature 16: Like an article
app.post('/api/interactions/like', authenticateToken, async (req, res) => {
  const { article_id } = req.body;
  try {
    await db.query("INSERT INTO interactions (user_id, article_id, type) VALUES ($1, $2, 'like')", [req.user.id, article_id]);
    res.json({ message: 'Article liked.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 5. DISCOVERY & ANALYTICS
// ==========================================

// Feature 17: Search articles by tag
app.get('/api/tags/:tag_name/articles', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.* FROM articles a 
       JOIN article_tags at ON a.id = at.article_id 
       JOIN tags t ON t.id = at.tag_id 
       WHERE t.name = $1`, [req.params.tag_name]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Feature 18: Generate Diversity Score
app.get('/api/users/me/diversity-index', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT COUNT(DISTINCT tag_id) FROM interactions JOIN article_tags USING(article_id) WHERE user_id = $1`, [req.user.id]
    );
    res.json({ user_id: req.user.id, baseline_score: parseInt(result.rows[0].count || 0) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Feature 19: View trending articles (Global view-count calculation)
app.get('/api/articles/trending', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM articles ORDER BY view_count DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Track A Core online on port ${PORT}`));
