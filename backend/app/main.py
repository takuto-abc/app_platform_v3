from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import Post, Project
from app.schemas import PostCreate, PostRead, ProjectCreate, ProjectRead

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

# /projects エンドポイント
@app.get("/projects", response_model=list[ProjectRead])
def read_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@app.post("/projects", response_model=ProjectRead)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(name=project.name, description=project.description, content=project.content)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@app.get("/projects/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# データのシーディング
@app.post("/seed-projects")
def seed_projects(db: Session = Depends(get_db)):
    seed_data = [
        {
            "name": "旅行",
            "description": "旅行のスケジュールを管理するプロジェクト",
            "content": {
                "blocks": [
                    {
                        "tag_name": "移動経路",
                        "icons": [
                            {"name": "Google Map", "image_url": "https://example.com/google-map.png"},
                            {"name": "Booking.com", "image_url": "https://example.com/booking.png"},
                        ],
                    },
                    {
                        "tag_name": "日程管理",
                        "icons": [
                            {"name": "Google Calendar", "image_url": "https://example.com/calendar.png"},
                        ],
                    },
                ]
            },
        },
        {
            "name": "就職活動",
            "description": "就職活動を管理するプロジェクト",
            "content": {
                "blocks": [
                    {
                        "tag_name": "企業リスト",
                        "icons": [
                            {"name": "企業A", "image_url": "https://example.com/company-a.png"},
                            {"name": "企業B", "image_url": "https://example.com/company-b.png"},
                        ],
                    },
                ]
            },
        },
    ]

    for project_data in seed_data:
        project = Project(
            name=project_data["name"],
            description=project_data["description"],
            content=project_data["content"],
        )
        db.add(project)
    db.commit()
    return {"message": "Projects seeded successfully"}
