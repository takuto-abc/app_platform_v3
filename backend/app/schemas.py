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

# Iconスキーマ
class IconBase(BaseModel):
    name: str
    image_url: str


class IconCreate(BaseModel):
    name: str
    image_url: str

class IconRead(IconBase):
    id: int
    image_url: str
    block_id: int

    class Config:
        orm_mode = True


# Blockスキーマ
class BlockBase(BaseModel):
    tag_name: str



class BlockCreate(BaseModel):
    tag_name: str

class BlockRead(BlockBase):
    id: int
    project_id: int
    icons: List[IconRead] = []

    class Config:
        orm_mode = True


# Projectスキーマ
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_posted: Optional[bool] = None


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    tags: List[str]  # ブロックの代わりに単純なタグ名のリスト



class ProjectRead(ProjectBase):
    id: int
    blocks: List[BlockRead] = []

    class Config:
        orm_mode = True

class ProjectUpdate(BaseModel):
    name: str
    description: Optional[str]
    tags: List[str]  