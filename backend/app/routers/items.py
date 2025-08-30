from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session
from app.db import get_session
from app.models import Item
from app.schemas import ItemCreate, ItemRead, ItemUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/items", tags=["items"])

@router.get("", response_model=List[ItemRead])
def list_items(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return session.exec(select(Item).offset(skip).limit(limit)).all()

@router.post("", response_model=ItemRead)
def create_item(payload: ItemCreate, session: Session = Depends(get_session), user=Depends(get_current_user)):
    item = Item(**payload.model_dump())
    session.add(item); session.commit(); session.refresh(item)
    return item

@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    if not item: raise HTTPException(404, "Item not found")
    return item

@router.put("/{item_id}", response_model=ItemRead)
def update_item(item_id: int, payload: ItemUpdate, session: Session = Depends(get_session), user=Depends(get_current_user)):
    item = session.get(Item, item_id)
    if not item: raise HTTPException(404, "Item not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    session.add(item); session.commit(); session.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_item(item_id: int, session: Session = Depends(get_session), user=Depends(get_current_user)):
    item = session.get(Item, item_id)
    if not item: raise HTTPException(404, "Item not found")
    session.delete(item); session.commit()
    return {"ok": True}