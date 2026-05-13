from fastapi import APIRouter
from typing import Dict

router = APIRouter()


@router.get("/")
def health_check() -> Dict[str, str]:
    """
    Root endpoint for health checks.
    """
    return {"status": "ok", "message": "Backend API is running properly."}
