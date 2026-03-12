from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(
    title="AI Network Guardian API",
    description="Backend services for the AI Network Guardian Deep Learning IDS",
    version="1.0.0"
)

# Configure CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "GuardianOS Core API",
        "timestamp": time.time()
    }

from api.routes import router
app.include_router(router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "modules": {
            "ml_engine": "standby",
            "packet_sniffer": "offline",
            "database": "disconnected"
        }
    }

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
