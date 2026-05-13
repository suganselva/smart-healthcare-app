from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from api import api_router
from db.session import engine
from db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    try:
        Base.metadata.create_all(bind=engine)  # type: ignore
        print("OK: Database tables created / verified.")
        
        # Auto-create admin user natively inside backend
        from db.session import SessionLocal
        from models.user import User
        from core.security import get_password_hash
        
        db = SessionLocal()
        try:
            existing_user = db.query(User).filter(User.email == "doctor@healthcare.com").first()
            if not existing_user:
                admin = User(
                    email="doctor@healthcare.com",
                    hashed_password=get_password_hash("password123"), # Default password for production testing!
                    full_name="Dr. Admin",
                    is_active=True,
                    is_superuser=True
                )
                db.add(admin)
                db.commit()
                print("OK: Auto-created default doctor@healthcare.com user!")
        except Exception as e:
            db.rollback()
            print("WARN: Failed to auto-create user:", e)
        finally:
            db.close()
    except Exception as e:
        print(f"WARN:  Could not connect to database on startup: {e}")
    yield  # App runs here

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set all CORS enabled origins
cors_origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
if settings.FRONTEND_URL:
    cors_origins.append(settings.FRONTEND_URL.rstrip('/'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # This ensures that even on a 500 internal error, we return CORS headers
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "error_type": type(exc).__name__},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to A Smart Healthcare Application API", "status": "Ready"}

@app.get("/debug/setup")
def debug_setup():
    """Forces user creation during a GET request so you can see exact errors on screen."""
    from db.session import engine, SessionLocal
    from db.base import Base
    from models.user import User
    from core.security import get_password_hash
    
    logs = []
    
    # 1. Test DB Engine
    try:
        Base.metadata.create_all(bind=engine)  # type: ignore
        logs.append("OK: Tables verified.")
    except Exception as e:
        return {"error_type": "Database Connection Failed", "detail": str(e), "logs": logs}
        
    # 2. Test User Creation
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "doctor@healthcare.com").first()
        if existing:
            logs.append(f"OK: User already exists (ID: {existing.id}). Password hash starts with: {existing.hashed_password[:10]}")
        else:
            admin = User(
                email="doctor@healthcare.com",
                hashed_password=get_password_hash("password123"),
                full_name="Dr. Admin",
                is_active=True,
                is_superuser=True
            )
            db.add(admin)
            db.commit()
            logs.append("OK: User successfully created right now! Password is 'password123'")
            
    except Exception as e:
        db.rollback()
        return {"error_type": "User Creation Failed", "detail": str(e), "logs": logs}
    finally:
        db.close()
        
    return {"status": "success", "logs": logs, "next_step": "Try logging in with doctor@healthcare.com and password123"}
