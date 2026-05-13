"""One-time script to create the first admin/doctor user in the database."""
import sys
sys.path.insert(0, ".")

from core.config import settings
from core.security import get_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import User

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
db = Session()

try:
    existing = db.query(User).filter(User.email == "doctor@healthcare.com").first()
    if existing:
        print(f"User already exists: {existing.email} (ID: {existing.id})")
    else:
        hashed = get_password_hash("Doctor123")
        user = User(
            email="doctor@healthcare.com",
            hashed_password=hashed,
            full_name="Dr. Admin",
            is_active=True,
            is_superuser=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"User created! ID: {user.id}, Email: {user.email}")
except Exception as e:
    db.rollback()
    print(f"Error: {e}")
finally:
    db.close()
