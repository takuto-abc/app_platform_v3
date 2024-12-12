from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# .env ファイルを読み込む
load_dotenv()

# 環境変数から DATABASE_URL を取得（デフォルトは dev.db）
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# エンジンの作成
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
