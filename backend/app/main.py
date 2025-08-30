from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from app.auth import router as auth_router
from app.routers.items import router as items_router

app = FastAPI(title="Simple Backend", version="1.1.0")

# 开发期放开跨域，线上建议白名单你的前端域名
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/", tags=["health"])
def root():
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(items_router)

@app.on_event("startup")
def on_startup():
    init_db()