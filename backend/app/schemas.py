from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Post スキーマ
class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class PostRead(PostBase):
    id: int

    class Config:
        orm_mode = True

# Project スキーマ
class ProjectBase(BaseModel):
    name: str
    description: str
    content: Optional[Dict[str, Any]]  # JSON形式で詳細情報を管理

class ProjectCreate(ProjectBase):
    pass

class ProjectRead(ProjectBase):
    id: int

    class Config:
        orm_mode = True
