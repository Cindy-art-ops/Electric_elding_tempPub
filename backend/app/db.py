import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args, pool_pre_ping=True)

def init_db() -> None:
    """开发期可用；上生产后建议用 Alembic 管理迁移。"""
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session