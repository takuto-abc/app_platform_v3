from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

# Post クラス
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    is_posted = Column(Boolean, nullable=False, default=False)  # 新しいカラム


    # リレーション
    blocks = relationship("Block", back_populates="project", cascade="all, delete-orphan")


class Block(Base):
    __tablename__ = "blocks"

    id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))

    # リレーション
    project = relationship("Project", back_populates="blocks")
    icons = relationship("Icon", back_populates="block", cascade="all, delete-orphan")


class Icon(Base):
    __tablename__ = "icons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id", ondelete="CASCADE"))
    is_deleted = Column(Boolean, nullable=False, default=False)  # 論理削除のフラグ

    # リレーション
    block = relationship("Block", back_populates="icons")
