from fastapi import APIRouter

from api.v1 import health, patients, predict, records, login, users

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(health.router, tags=["health"])
api_router.include_router(
    patients.router,
    prefix="/patients",
    tags=["patients"]
)
api_router.include_router(
    predict.router,
    prefix="/predict",
    tags=["prediction"]
)
api_router.include_router(
    records.router,
    prefix="/records",
    tags=["records"]
)
