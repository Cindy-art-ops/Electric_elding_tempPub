from typing import Optional
from pydantic import BaseModel

# Auth
class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Items
class ItemBase(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None

class ItemCreate(ItemBase):
    name: str
    price: float

class ItemRead(ItemBase):
    id: int
    name: str
    price: float
    class Config: from_attributes = True

class ItemUpdate(ItemBase):
    pass