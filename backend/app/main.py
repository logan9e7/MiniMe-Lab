"""MiniMe Lab application composition root.

Keep business rules in feature routers; preserve existing API contracts.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import allowed_origins
from app.learning import router as learning_router
from app.science import router as science_router
from app.discover import router as discover_router
from app.quiz import router as quiz_router
from app.modules.periods.router import router as periods_router
from app.modules.fertility.router import router as fertility_router
from app.modules.pregnancy.router import router as pregnancy_router
from app.modules.genetics.router import router as genetics_router

def create_app() -> FastAPI:
    app = FastAPI(title="MiniMe Lab", version="0.3.0", docs_url="/docs", redoc_url=None)
    app.add_middleware(CORSMiddleware, allow_origins=allowed_origins(),
                       allow_methods=["GET", "POST"], allow_headers=["Content-Type"])

    @app.middleware("http")
    async def security_headers(request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response

    @app.get("/health")
    def health():
        return {"status": "ok"}

    for router in (learning_router, science_router, discover_router, quiz_router,
                   periods_router, fertility_router, pregnancy_router, genetics_router):
        app.include_router(router)
    return app

app = create_app()
