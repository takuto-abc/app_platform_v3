from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import desc
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


# /projects エンドポイント -----------------------------------------------------------------------------------------

@app.get("/projects", response_model=list[ProjectRead])
def read_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


@app.post("/projects", response_model=ProjectRead)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    # プロジェクトを作成
    new_project = Project(name=project.name, description=project.description)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # ブロックを作成
    for tag_name in project.tags:
        new_block = Block(tag_name=tag_name, project_id=new_project.id)
        db.add(new_block)

    db.commit()  # 全てのブロックが保存されてからコミット

    # プロジェクトを再取得して関連付けられたブロックを含めたデータを返す
    return db.query(Project).filter(Project.id == new_project.id).first()




@app.get("/projects/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 削除されていないアイコンのみを含む形でブロックをフィルタリング
    filtered_blocks = []
    for block in project.blocks:
        filtered_icons = [icon for icon in block.icons if not icon.is_deleted]
        block.icons = filtered_icons  # フィルタ済みアイコンをセット
        filtered_blocks.append(block)
    project.blocks = filtered_blocks

    return project



@app.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, project: ProjectCreate, db: Session = Depends(get_db)):
    # プロジェクトを取得
    existing_project = db.query(Project).filter(Project.id == project_id).first()
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # プロジェクト情報を更新
    existing_project.name = project.name
    existing_project.description = project.description

    # データベースへコミット
    db.commit()
    db.refresh(existing_project)
    return existing_project


@app.delete("/projects/{project_id}", response_model=ProjectRead)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # 関連するブロックとアイコンも削除
    db.query(Icon).filter(Icon.block_id.in_(
        db.query(Block.id).filter(Block.project_id == project_id)
    )).delete(synchronize_session=False)
    
    db.query(Block).filter(Block.project_id == project_id).delete(synchronize_session=False)
    
    # プロジェクトを削除
    db.delete(project)
    db.commit()
    return project


@app.put("/projects/{project_id}/post", response_model=ProjectRead)
def post_project(project_id: int, db: Session = Depends(get_db)):
    # プロジェクトを取得
    existing_project = db.query(Project).filter(Project.id == project_id).first()
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # 投稿状態を更新
    existing_project.is_posted = True
    db.commit()
    db.refresh(existing_project)
    return existing_project





# /blocks エンドポイント -----------------------------------------------------------------------------------------

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


@app.delete("/projects/{project_id}/blocks/{block_id}", response_model=BlockRead)
def delete_block(project_id: int, block_id: int, db: Session = Depends(get_db)):
    block = db.query(Block).filter(Block.id == block_id, Block.project_id == project_id).first()
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")
    
    # ブロックを削除
    db.delete(block)
    db.commit()
    return block




# /icons エンドポイント -----------------------------------------------------------------------------------------

# 論理削除されていないものだけを取得（フラグ=False）
@app.get("/blocks/{block_id}/icons", response_model=list[IconRead])
def read_icons(block_id: int, db: Session = Depends(get_db)):
    icons = db.query(Icon).filter(Icon.block_id == block_id, Icon.is_deleted == False).all()
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
    # 論理削除
    icon.is_deleted = True
    db.commit()
    return icon


# アイコン検索
@app.get("/icons/validate")
def validate_icon(name: str, db: Session = Depends(get_db)):
    icons = db.query(Icon).filter(Icon.name.ilike(f"%{name}%")).all()
    if not icons:
        raise HTTPException(status_code=404, detail="No icons found")
    return icons


# 棒グラフ
@app.get("/analytics/icon-usage", response_model=list[dict])
def get_icon_usage(db: Session = Depends(get_db)):
    usage_data = (
        db.query(Icon.name, Icon.image_url, func.count(Icon.id).label("usage_count"))
        .filter(Icon.is_deleted == False)
        .group_by(Icon.name, Icon.image_url)
        .order_by(desc("usage_count"))
        .all()
    )
    result = [
        {"name": row[0], "image_url": row[1], "usage_count": row[2]}
        for row in usage_data
    ]
    return result


# 投稿されているプロジェクトを取得
@app.get("/projects/posted", response_model=list[ProjectRead])
def read_posted_projects(db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.is_posted == True).all()
