from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(sa_column=Column(String(64), unique=True, index=True, nullable=False))
    password_hash: str

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=100)
    price: float
    description: Optional[str] = None
