from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import engine, SessionLocal, Base
from .models import Post
from .schemas import PostCreate, PostRead

# データベーステーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI()

# データベースセッション取得用依存関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/posts", response_model=list[PostRead])
def read_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

@app.post("/posts", response_model=PostRead)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    new_post = Post(title=post.title, content=post.content)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
