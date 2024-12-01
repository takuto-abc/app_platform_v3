# backend/alembic/env.py
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
from pathlib import Path
import sys

# プロジェクトルートを `sys.path` に追加
sys.path.append(str(Path(__file__).resolve().parents[2]))

# .env ファイルを読み込む
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parents[2] / 'backend' / '.env'
load_dotenv(dotenv_path=env_path)

from backend.app.config import DATABASE_URL
from backend.app.models import Base

# Alembic Config オブジェクトを取得
config = context.config

# ロギングの設定
fileConfig(config.config_file_name)

# ターゲットメタデータ
target_metadata = Base.metadata

# DATABASE_URL の確認
print(f"DATABASE_URL: {DATABASE_URL}")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Please check your .env file.")

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = DATABASE_URL
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"}
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        {"sqlalchemy.url": DATABASE_URL},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
