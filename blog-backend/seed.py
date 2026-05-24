"""
Run this once to populate the database with 20 sample articles and a demo user.

    python seed.py
"""
import json
from database import init_db, engine
from models import User, Article, Interaction
from sqlmodel import Session
import hashlib


def hash_password(p: str) -> str:
    return hashlib.sha256(p.encode()).hexdigest()


SAMPLE_ARTICLES = [
    {
        "title": "Getting Started with FastAPI & Next.js",
        "content": """FastAPI is one of the fastest Python frameworks available today. Combined with Next.js on the frontend, you get a full-stack powerhouse. 

In this article we'll walk through setting up both, connecting them via a REST API, and deploying the stack to production.

## Why Choose This Stack?
FastAPI leverages modern Python features like type hints and async-await out of the box, offering blazing fast performance matching Go and Node.js. 

Next.js provides an incredibly seamless developer experience with React Server Components, making SSR and Static Site Generation a breeze.

* Blazing fast execution times
* Automated interactive OpenAPI documentation
* Strict type-safety with Pydantic
* Unified build system and routing

> "The combination of Python's raw developer speed and Next.js's deployment-ready static exports is a cheat code for modern startups."

Prepare your editor, configure your virtual environment, and let's build the future of brand portal design.""",
        "author": "Yashwanth K",
        "tags": ["fastapi", "nextjs", "python"],
    },
    {
        "title": "Tailwind CSS Tips Every Developer Should Know",
        "content": """Tailwind CSS has completely transformed how we style web applications. Here are 10 underrated utilities that will level up your UI game.

From custom arbitrary values to group-hover states and the clamp() trick for fluid typography without media queries, we cover it all.

## Tip 1: The Power of Group-Hover
Ever wanted to trigger styling on a child element when hovering over its parent container? Simply mark the parent with the class `group` and trigger child highlights using `group-hover:text-amber-600`.

## Tip 2: Dynamic Font Sizing
Instead of writing complex CSS media breakpoints, use dynamic utility clamps to keep your typography fluid across mobile, tablet, and ultra-wide screens:

```css
font-size: clamp(2rem, 5vw, 5rem);
```

We guarantee these utilities will reduce your style debt and clean up your components immediately!""",
        "author": "Priya M",
        "tags": ["tailwind", "css", "frontend"],
    },
    {
        "title": "PostgreSQL vs MongoDB: Which Should You Pick in 2025?",
        "content": """The database decision can make or break your project architecture. We compare PostgreSQL and MongoDB across five key dimensions.

We analyze query flexibility, horizontal scaling, schema design, ecosystem support, and cloud-managed pricing structures.

## Structured vs Unstructured Data
PostgreSQL offers absolute, strict relational schema enforcement, ACID guarantees, and robust JSONB support for semi-structured fields.

MongoDB shines in rapid prototyping, document-centric hierarchical storage, and seamless sharding across multiple server grids.

* Choose PostgreSQL if transactional integrity and relational queries are essential.
* Choose MongoDB if your schema is highly dynamic and undergoes quick iteration.

Let's inspect the query performance metrics in our next section.""",
        "author": "Arjun R",
        "tags": ["databases", "postgres", "mongodb"],
    },
    {
        "title": "Understanding React Server Components",
        "content": """React Server Components (RSC) fundamentally change how we think about data fetching in Next.js. No more useEffect waterfalls!

Fetch directly in the component, on the server, with zero client-side JS overhead. Here's what you need to know to migrate.

## The Core Concept
By running components strictly on the server, RSC lets you query databases and securely fetch API payloads without leaking secret tokens to client bundles.

> "Server Components represent a monumental paradigm shift, bringing back the simplicity of classical MPA rendering while preserving React's rich interactive nature."

We migrate our sample dashboard in our follow-up tutorial step-by-step.""",
        "author": "Sneha T",
        "tags": ["react", "nextjs", "performance"],
    },
    {
        "title": "Docker for Developers: A Practical Guide",
        "content": """Containerisation is no longer optional for modern dev workflows. Learn how to Dockerize your FastAPI + Next.js app seamlessly.

Wire them together with Docker Compose, and ship a reproducible environment your entire team can spin up instantly.

## The docker-compose.yml Structure
By containerizing your services, you isolate environments and guarantee that if it runs on your local machine, it will run identically on production AWS or Google Cloud.

```yaml
version: '3.8'
services:
  backend:
    build: ./blog-backend
    ports:
      - "8000:8000"
  frontend:
    build: ./blog-frontend
    ports:
      - "3000:3000"
```

Let's boot our containers and verify network links in real time.""",
        "author": "Rahul V",
        "tags": ["docker", "devops", "deployment"],
    },
    {
        "title": "Building a REST API with Python FastAPI in 30 Minutes",
        "content": """FastAPI's automatic OpenAPI docs, Pydantic validation, and async-first design make it a absolute joy to work with.

This guide walks you through creating a production-ready CRUD API with CORS middleware in under 100 lines of code.

## The Main Script
Mounting routers and wiring database session dependencies is extremely direct:

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "operational"}
```

With Pydantic schemas, validation errors are caught automatically before they ever reach your database session!""",
        "author": "Yashwanth K",
        "tags": ["fastapi", "python", "api"],
    },
    {
        "title": "Echoes of Ajanta: The Spiritual Tapestry of Ancient Caves",
        "content": """Deep within the basalt cliffs of Maharashtra lies the Ajanta cave complex, an ancient marvel of rock-cut architecture.

For centuries, Buddhist monks carved these sanctuaries, painting elaborate murals that capture the serene essence of Buddhist lore and royal heritage.

## The Mural Technique
The painters used organic plaster layers mixed with clay, dung, and lime, sketching detailed dynamic figures with natural mineral pigments.

* Deep ochre from clay
* Lapis Lazuli from Afghanistan
* Vivid green from local silicate minerals

These cave ceilings echo the timeless devotion of artists whose spiritual tapestries continue to inspire awe and cultural pride today.""",
        "author": "Aravind S",
        "tags": ["culture", "heritage", "history", "art"],
    },
    {
        "title": "Weaving Time: The Legacy of Varanasi's Silk Artisans",
        "content": """Varanasi, one of the oldest living cities in the world, is the spiritual heart of India. Among its narrow alleys, a ancient craft thrives.

Varanasi's silk weavers use handloom shuttles to weave gold and silver threads into highly intricate Banarasi silk sarees.

> "A single Banarasi saree is a months-long conversation between the handloom master, the jacquard cards, and the raw silk warp."

Passing down patterns across generations, Varanasi's silk weavers preserve a rich cultural vocabulary that outlasts modern digital fast-fashion.""",
        "author": "Meera Iyer",
        "tags": ["culture", "heritage", "storytelling"],
    },
    {
        "title": "The Typography of Luxury: Crafting Editorial Identity",
        "content": """Typography is the silent voice of design. In high-end editorial and premium branding, font choices carry absolute weight.

Serifs reflect heritage and trust, whereas modern sans-serifs communicate clean simplicity and technical progress.

## Serif vs Sans-Serif Dialogue
The visual interplay between a classical serif heading (like Lora or Garamond) and a clean sans-serif body (like Inter or DM Sans) creates an editorial contrast.

* Serif: Evokes history, high-fashion, and literary depth.
* Sans-Serif: Delivers highly readable, crisp modern grids.

Let's study the spacing rules and kerning tables that define luxury magazines.""",
        "author": "Elena Rostova",
        "tags": ["design", "branding", "style"],
    },
    {
        "title": "Minimalism in Motion: The Next Phase of Brand Strategy",
        "content": """As digital channels multiply, brands are stripping away visual noise. Minimalism has emerged as a strategic necessity.

A premium brand strategy focuses on distilling value propositions into clean colors, curated typography, and bold negative space.

## The Power of Restraint
When you remove distractions, you elevate the core brand message. Spacing is not empty; it is a canvas designed to direct attention.

> "True minimalism is not the absence of design. It is the absolute presence of clarity and purpose."

Let's dissect case studies of leading startup brands that achieved astronomical conversions by simplifying their homepages.""",
        "author": "Marcus Thorne",
        "tags": ["design", "branding", "strategy"],
    },
    {
        "title": "Brutalist Whispers: Spacing, Light, and Concrete",
        "content": """Brutalist architecture, once controversial, is undergoing a profound cultural and editorial renaissance.

Brutalism exposes raw materials, celebrating structural honesty, heavy monolithic volumes, and the dynamic play of natural sunlight on concrete.

## Spacing and Shadows
Brutalist spacing creates massive visual voids. Sunlight hitting concrete surfaces creates shadows that evolve throughout the day, transforming heavy stone structures into living art.

We explore Spawning brutalist libraries and modern concrete designs in our urban architectural survey.""",
        "author": "Hiroshi Tanaka",
        "tags": ["architecture", "design", "style"],
    },
    {
        "title": "The Renaissance of Muralism: Reclaiming Public Canvases",
        "content": """Across global cities, street art is migrating from the underground into premium public design commissions.

Modern muralism reclaims public walls, turning drab concrete landscapes into vibrant visual canvases that tell local stories of heritage and struggle.

## Engaging Communities
By depicting local history and traditional folklore, public murals foster community belonging and build open-air galleries accessible to everyone.

* Reclaims forgotten industrial zones
* Drives local tourism and outdoor galleries
* Elevates traditional storytelling in modern cities

Let's meet the visual artists leading this global outdoor gallery renaissance.""",
        "author": "Carlos Fuentes",
        "tags": ["art", "culture", "heritage"],
    },
    {
        "title": "Chasing the Golden Hour: Narrative Filmmaking on Location",
        "content": """In cinema, the Golden Hour—the short window just before sunset—offers a natural, soft, golden light that cannot be replicated.

Filmmakers and photographers plan location shoots down to the minute to capture this warm cinematic glow.

> "Golden hour light wraps subjects in a natural warmth, adding emotional weight and high-end visual luxury to the screen."

We share scheduling spreadsheets and camera exposure tables designed to capture the perfect cinematic golden frames.""",
        "author": "Sarah Jenkins",
        "tags": ["photography", "storytelling"],
    },
    {
        "title": "The Silent Lens: Capturing Untold Portraits of Rural India",
        "content": """Folk photography is the art of documenting local communities with dignity, moving past generic travel clichés.

The silent lens captures candid moments of traditional life—the concentration of a Banarasi weaver, or the focus of a cave restorer.

## Creating Visual Trust
Great portraiture requires deep patience. Spending days building relationships ensures subjects feel comfortable, revealing their authentic character to the lens.

Let's study the framing, depth-of-field, and lighting setups used in our documentary catalog.""",
        "author": "Kabir Das",
        "tags": ["photography", "culture", "storytelling"],
    },
    {
        "title": "Digital Art and the Preservation of Lost Folklore",
        "content": """As oral traditions fade, digital illustrators and animators are stepping in to preserve historical folklore.

Using digital painting, 3D modeling, and interactive storytelling, artists recreate ancient myths for a new generation of readers.

## Preserving Visual Heritage
Digital archives preserve historical folklore under open-access databases. We interview creative directors blending ancient murals with futuristic neural art pipelines.

Let's inspect how interactive media keeps traditional folklore dynamically alive.""",
        "author": "Sunita Rao",
        "tags": ["culture", "folklore", "art", "digital"],
    },
    {
        "title": "The Evolution of Creative Agencies: Madison Ave to Decentralized Hubs",
        "content": """Creative agency structures have changed dramatically. The classical corporate hierarchy of Madison Avenue is giving way.

Modern storytelling hubs blend decentralized networks of film directors, visual strategists, and digital engineers.

## Agility and Vision
By removing layers of corporate overhead, decentralized creative networks deliver premium startup campaigns with unmatched speed and bold artistic vision.

* Focuses budgets on actual production and film assets
* Gathers bespoke talent for specific brand strategy targets
* Fosters creative ownership across global networks

Let's chart the future of strategic storytelling.""",
        "author": "Oliver Vance",
        "tags": ["branding", "strategy", "history"],
    },
    {
        "title": "Sacred Geometry: Mathematical Patterns in Temple Architecture",
        "content": """Ancient temple builders did not just build walls; they built physical diagrams of the cosmos using sacred geometry.

From the temple spires of Khajuraho to South Indian Gopurams, architecture reflects precise mathematical proportions and fractal designs.

## Fractal Architecture
The spires repeat identical miniature spires, creating a highly organized geometric fractal that elevates the structure towards the heavens.

We map these complex geometric blueprints using modern drafting software in our heritage study.""",
        "author": "Dr. Rajesh Verma",
        "tags": ["architecture", "heritage", "history"],
    },
    {
        "title": "The Art of Storytelling in Modern Interactive Media",
        "content": """Storytelling is no longer a one-way street. Interactive digital media, websites, and immersive platforms let readers shape the narrative.

By integrating parallax scrolls, glassmorphism UI elements, and interactive triggers, we turn readers into active explorers.

> "Interactive design bridges the gap between passive reading and active, immersive brand engagement."

Let's analyze the UX layout principles that keep readers hooked for hours.""",
        "author": "Tessa Cole",
        "tags": ["storytelling", "digital", "art"],
    },
    {
        "title": "Unearthing the Past: Lessons from Indus Valley Heritage",
        "content": """The cities of Harappa and Mohenjo-daro, active over four thousand years ago, are monuments to ancient urban planning.

These heritage sites featured advanced underground drainage grids, structured grid networks, and comfortable brick homes.

## Lessons for Modern Cities
The Indus Valley civilization proves that luxury lies in civic intelligence—clean water, public spaces, and highly organized urban spacing.

Let's study the brick layouts and civil planning strategies that modern architects can borrow.""",
        "author": "Dr. Amit Sharma",
        "tags": ["history", "heritage", "culture"],
    },
    {
        "title": "Visual Poetry: Shifting Colors and Textures in Post-Modern Art",
        "content": """Post-modern art strips away literal objects, exploring how pure texture and color gradients elicit emotional responses.

By layering thick organic materials, mineral pigments, and gold foil, painters turn canvases into tactile visual poetry.

## The Visual Impact
Tactile layers catch ambient gallery lights differently throughout the day, ensuring the artwork remains dynamic and alive to the viewer.

We review the latest post-modern abstract collections appearing in contemporary galleries.""",
        "author": "Sophia Loren",
        "tags": ["art", "design", "style"],
    },
]


def seed():
    init_db()
    with Session(engine) as session:
        # Demo user
        from sqlmodel import select
        existing_user = session.exec(select(User).where(User.email == "demo@devlog.com")).first()
        if not existing_user:
            session.add(User(name="Demo User", email="demo@devlog.com", hashed_password=hash_password("password123")))
            print("[SUCCESS] Demo user created: demo@devlog.com / password123")

        # Sample articles - CLEAN DELETE first to ensure we seed exactly the 20 rich articles
        existing_articles = session.exec(select(Article)).all()
        if existing_articles:
            print(f"[RESET] Deleting {len(existing_articles)} old articles to make room for new database seed...")
            for art in existing_articles:
                session.delete(art)
            session.commit()

        # Seed new articles
        for a in SAMPLE_ARTICLES:
            session.add(Article(
                title=a["title"],
                content=a["content"],
                author=a["author"],
                tags=json.dumps(a["tags"]),
            ))
        print(f"[SUCCESS] {len(SAMPLE_ARTICLES)} sample articles successfully seeded in SQLite database!")

        session.commit()
        print("[SUCCESS] Database seeded successfully!")


if __name__ == "__main__":
    seed()
