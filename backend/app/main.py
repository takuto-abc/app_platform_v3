from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import Post, Project, Block, Icon
from app.schemas import (
    PostCreate,
    PostRead,
    ProjectCreate,
    ProjectRead,
    BlockCreate,
    BlockRead,
    IconCreate,
    IconRead,
)

# データベーステーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS の設定
origins = ["http://localhost:3000"]

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
# @app.get("/posts", response_model=list[PostRead])
# def read_posts(db: Session = Depends(get_db)):
#     return db.query(Post).all()


# @app.post("/posts", response_model=PostRead)
# def create_post(post: PostCreate, db: Session = Depends(get_db)):
#     new_post = Post(title=post.title, content=post.content)
#     db.add(new_post)
#     db.commit()
#     db.refresh(new_post)
#     return new_post


# /projects エンドポイント
@app.get("/projects", response_model=list[ProjectRead])
def read_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


@app.post("/projects", response_model=ProjectRead)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(name=project.name, description=project.description)
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


@app.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, project: ProjectCreate, db: Session = Depends(get_db)):
    existing_project = db.query(Project).filter(Project.id == project_id).first()
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")
    existing_project.name = project.name
    existing_project.description = project.description
    db.commit()
    db.refresh(existing_project)
    return existing_project



# /blocks エンドポイント
@app.get("/projects/{project_id}/blocks", response_model=list[BlockRead])
def read_blocks(project_id: int, db: Session = Depends(get_db)):
    blocks = db.query(Block).filter(Block.project_id == project_id).all()
    if not blocks:
        raise HTTPException(status_code=404, detail="Blocks not found for the project")
    return blocks


@app.post("/projects/{project_id}/blocks", response_model=BlockRead)
def create_block(project_id: int, block: BlockCreate, db: Session = Depends(get_db)):
    new_block = Block(tag_name=block.tag_name, project_id=project_id)
    db.add(new_block)
    db.commit()
    db.refresh(new_block)
    return new_block


# /icons エンドポイント
# 論理削除されていないものだけを取得（フラグ=False）
@app.get("/blocks/{block_id}/icons", response_model=list[IconRead])
def read_icons(block_id: int, db: Session = Depends(get_db)):
    icons = db.query(Icon).filter(Icon.block_id == block_id).all()
    if not icons:
        raise HTTPException(status_code=404, detail="Icons not found for the block")
    return icons


@app.post("/blocks/{block_id}/icons", response_model=IconRead)
def create_icon(block_id: int, icon: IconCreate, db: Session = Depends(get_db)):
    new_icon = Icon(name=icon.name, image_url=icon.image_url, block_id=block_id)
    db.add(new_icon)
    db.commit()
    db.refresh(new_icon)
    return new_icon


# ここをDBから削除ではなく、論理削除に変更
@app.delete("/blocks/{block_id}/icons/{icon_id}", response_model=IconRead)
def delete_icon(block_id: int, icon_id: int, db: Session = Depends(get_db)):
    icon = db.query(Icon).filter(Icon.id == icon_id, Icon.block_id == block_id).first()
    if not icon:
        raise HTTPException(status_code=404, detail="Icon not found")
    db.delete(icon)
    db.commit()
    return icon


@app.get("/icons/validate")
def validate_icon(name: str, db: Session = Depends(get_db)):
    icons = db.query(Icon).filter(Icon.name.ilike(f"%{name}%")).all()
    if not icons:
        raise HTTPException(status_code=404, detail="No icons found")
    return icons