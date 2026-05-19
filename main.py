from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the clean Track A compliant routers
from users import router as users_router
from articles import router as articles_router
from discovery import router as discovery_router

app = FastAPI(
    title="Epoch Chronological Publishing Engine",
    description="Non-algorithmic, shared community publishing platform adhering to Swiss Minimalism.",
    version="1.0.0"
)

# =====================================================================
# CORS MIDDLEWARE SETUP
# =====================================================================
# Ensures your Next.js frontend (Timeline Ribbon) can talk to this backend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# ROUTER BINDINGS
# =====================================================================
# Structural identity tracking & publishing permissions
app.include_router(users_router)

# The core Timeline Engine (Strict chronological descending GET / POST)
app.include_router(articles_router)

# Discovery tools: Archive lookbacks ("This Time Yesterday" query tool)
app.include_router(discovery_router)


# =====================================================================
# ROOT TIMELINE STATUS
# =====================================================================
@app.get("/", tags=["Root Timeline Gateway"])
async def root_gateway_index():
    """
    Returns global system health status indicators.
    """
    return {
        "status": "online",
        "system_name": "Epoch",
        "sorting_engine": "Strict Chronological (Latest First)",
        "documentation_path": "/docs"
    }
