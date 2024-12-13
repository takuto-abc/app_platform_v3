from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import DATABASE_URL, engine, SessionLocal, Base
from app.models import Post, Project
from app.schemas import PostCreate, PostRead, ProjectRead

# データベーステーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS の設定
origins = [
    "http://localhost:3000",  # フロントエンドが動作しているURL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベースセッション取得用依存関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# /posts エンドポイント
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

@app.get("/projects", response_model=list[ProjectRead])
def read_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects

@app.get("/projects/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project





        