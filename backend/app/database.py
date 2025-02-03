from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# .env ファイルを読み込む（backend ディレクトリ内にある場合、必要に応じてパスを指定）
load_dotenv()

# 環境変数から DATABASE_URL を取得（未設定の場合は SQLite の dev.db を利用）
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# SQLite 用のオプションかどうか判定
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
