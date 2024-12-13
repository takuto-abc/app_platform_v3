"""Recreate projects, blocks, and icons tables with seed data

Revision ID: 5874c3f42346
Revises: fb7c3a0c4bc7
Create Date: 2024-12-13 16:02:36.611164

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision = '5874c3f42346'
down_revision = 'fb7c3a0c4bc7'
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    # 既存のテーブルを削除
    op.drop_table("icons", if_exists=True)
    op.drop_table("blocks", if_exists=True)
    op.drop_table("projects", if_exists=True)

    # 新しいテーブルを作成
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=True),
    )

    op.create_table(
        "blocks",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("tag_name", sa.String, nullable=False),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("projects.id", ondelete="CASCADE")),
    )

    op.create_table(
        "icons",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("image_url", sa.String, nullable=False),
        sa.Column("block_id", sa.Integer, sa.ForeignKey("blocks.id", ondelete="CASCADE")),
    )

    # シードデータを挿入
    projects = [
        {"id": 1, "name": "旅行", "description": "旅行のスケジュールを管理するプロジェクト"},
        {"id": 2, "name": "就職活動", "description": "就職活動を管理するプロジェクト"},
        {"id": 3, "name": "投資", "description": "投資に関する情報を管理するプロジェクト"},
    ]
    blocks = [
        {"id": 1, "tag_name": "移動経路", "project_id": 1},
        {"id": 2, "tag_name": "計画", "project_id": 1},
        {"id": 3, "tag_name": "企業リスト", "project_id": 2},
        {"id": 4, "tag_name": "進捗管理", "project_id": 2},
        {"id": 5, "tag_name": "市場情報", "project_id": 3},
    ]
    icons = [
        {"id": 1, "name": "Google Map", "image_url": "https://www.google.com/maps/about/images/home/home-maps-icon.svg", "block_id": 1},
        {"id": 2, "name": "Booking.com", "image_url": "https://pbs.twimg.com/profile_images/1323220178574938113/SZK83dEL_400x400.jpg", "block_id": 1},
        {"id": 3, "name": "Notion", "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg", "block_id": 2},
        {"id": 4, "name": "Google Document", "image_url": "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico", "block_id": 2},
        {"id": 5, "name": "サポーターズ", "image_url": "https://assets.st-note.com/production/uploads/images/79785302/profile_9f9f53350f4903f0c1f60dcba01296f8.jpeg?width=104&height=104&dpr=2&crop=1:1,smart", "block_id": 3},
        {"id": 6, "name": "Wantedly", "image_url": "https://www.wantedly.com/favicon.ico", "block_id": 3},
        {"id": 7, "name": "Notion", "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg", "block_id": 4},
        {"id": 8, "name": "Google Calendar", "image_url": "https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_16_2x.png", "block_id": 4},
        {"id": 9, "name": "Yahooファイナンス", "image_url": "https://pbs.twimg.com/profile_images/1466224659163090946/ZetKXbbB_400x400.png", "block_id": 5},
        {"id": 10, "name": "日経新聞", "image_url": "https://www.nikkei.com/favicon.ico", "block_id": 5},
        {"id": 11, "name": "SBI証券", "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SBI_SECURITIES_Logo.svg/302px-SBI_SECURITIES_Logo.svg.png", "block_id": 5},
    ]

    session.execute(sa.text("INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)"), projects)
    session.execute(sa.text("INSERT INTO blocks (id, tag_name, project_id) VALUES (:id, :tag_name, :project_id)"), blocks)
    session.execute(sa.text("INSERT INTO icons (id, name, image_url, block_id) VALUES (:id, :name, :image_url, :block_id)"), icons)
    session.commit()

def downgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    # テーブル削除
    op.drop_table("icons")
    op.drop_table("blocks")
    op.drop_table("projects")
