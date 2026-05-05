Epoch Digital Publishing Platform
Track A: The Classic model
Database: PostgreSQL


-- PostgreSQL Database Dump for Epoch (Track A: The Classic Model)
-- Goal: High-performance CRUD and chronological global feed indexing.

-- 1. USERS TABLE
-- Handles author profiles and reader accounts.
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ARTICLES TABLE
-- Core content storage. author_id links to users.user_id logically.
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TAGS TABLE
-- Defines categories for the publishing platform.
CREATE TABLE IF NOT EXISTS tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(30) UNIQUE NOT NULL
);

-- 4. ARTICLE_TAGS TABLE
-- Junction table for many-to-many relationships between articles and tags.
CREATE TABLE IF NOT EXISTS article_tags (
    mapping_id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL
);

-- 5. PERFORMANCE INDEXES
-- Critical for the 'Fast Chronological Feed' requirement.
CREATE INDEX idx_feed_latest ON articles(published_at DESC);
CREATE INDEX idx_feed_trending ON articles(view_count DESC);
CREATE INDEX idx_article_lookup ON articles(slug);

-- ---------------------------------------------------------
-- DUMMY DATA INSERTIONS (3 Authors, 10 Articles)
-- ---------------------------------------------------------

-- Insert 3 Authors
INSERT INTO users (username, email, password_hash, is_verified) VALUES 
('jordan_tech', 'jordan@epoch.dev', 'argon2_hash_1', TRUE),
('sara_writes', 'sara@epoch.dev', 'argon2_hash_2', TRUE),
('marcus_news', 'marcus@epoch.dev', 'argon2_hash_3', FALSE);

-- Insert Primary Tags
INSERT INTO tags (tag_name) VALUES 
('Engineering'), ('Design'), ('Product'), ('Future'), ('Tutorial');

-- Insert 10 Articles
INSERT INTO articles (author_id, title, slug, content, view_count, published_at) VALUES 
(1, 'Scaling PostgreSQL for Millions', 'scaling-postgres', 'Content for scaling...', 540, '2026-05-01 08:00:00'),
(2, 'The Ethics of Digital Design', 'ethics-digital-design', 'Content for ethics...', 1200, '2026-05-01 09:30:00'),
(1, 'Rust vs Go in 2026', 'rust-vs-go-2026', 'Content for rust-go...', 890, '2026-05-02 10:15:00'),
(3, 'Global Launch Success', 'global-launch-success', 'Content for launch...', 3000, '2026-05-02 11:00:00'),
(2, 'Typography in Minimalism', 'typography-minimalism', 'Content for design...', 450, '2026-05-03 14:00:00'),
(1, 'CI/CD Best Practices', 'cicd-best-practices', 'Content for devops...', 670, '2026-05-03 16:45:00'),
(3, 'Market Trends This Week', 'market-trends-week', 'Content for business...', 2100, '2026-05-04 09:00:00'),
(2, 'User Research 101', 'user-research-101', 'Content for ux...', 320, '2026-05-04 13:20:00'),
(1, 'Edge Computing Explained', 'edge-computing', 'Content for infrastructure...', 110, '2026-05-05 08:45:00'),
(3, 'The Rise of Local LLMs', 'local-llms-rise', 'Content for AI...', 4500, '2026-05-05 10:30:00');

-- Map Articles to Tags
INSERT INTO article_tags (article_id, tag_id) VALUES 
(1, 1), (2, 2), (3, 1), (4, 3), (5, 2), (6, 1), (7, 3), (8, 2), (9, 1), (10, 4);
