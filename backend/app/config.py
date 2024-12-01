# backend/app/config.py
import os
from dotenv import load_dotenv
from pathlib import Path

# .env ファイルのパスを指定（config.py の親ディレクトリの親ディレクトリ）
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Please check your .env file.")
