from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import tasks

app = FastAPI(
    title="Ascendra AI Engine",
    description="FastAPI LangGraph service for dynamic game content generation",
    version="1.0.0"
)

# Allow internal gateway communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be locked down to Node Gateway IP in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "OK", "service": "AI Engine"}