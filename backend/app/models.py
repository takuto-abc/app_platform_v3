from sqlalchemy import Column, Integer, String, JSON
from .database import Base

# Post クラス
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)

# Project クラス
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)  # プロジェクトID
    name = Column(String, index=True)  # プロジェクト名
    description = Column(String)  # プロジェクトの説明
    content = Column(JSON)  # JSON形式で詳細情報を管理
