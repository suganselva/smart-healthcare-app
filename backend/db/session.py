from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import settings

# Use the URL object directly (not str()) to safely handle special chars in password
db_url = settings.SQLALCHEMY_DATABASE_URI

engine = create_engine(db_url, pool_pre_ping=True, pool_recycle=300)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
