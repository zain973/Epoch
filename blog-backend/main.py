
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers.auth import router as auth_router
from routers.articles import router as articles_router
from routers.interactions import router as interactions_router

app = FastAPI(title="Epoch Creative API")

@app.on_event("startup")
async def startup_event():
    init_db()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test route
@app.get("/")
def home():
    return {"message": "Backend running"}

# Wire up routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(articles_router, prefix="/api/articles", tags=["articles"])
app.include_router(interactions_router, prefix="/api/interactions", tags=["interactions"])