"""Add 投資 project and update existing content

Revision ID: fb7c3a0c4bc7
Revises: 91e16f007348
Create Date: 2024-12-13 12:15:21.333710

"""
from alembic import op
from sqlalchemy.orm import Session
from backend.app.models import Project

# revision identifiers, used by Alembic.
revision = 'fb7c3a0c4bc7'
down_revision = '91e16f007348'
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    # 更新データ
    updated_data = [
        {
            "id": 1,
            "content": {
                "blocks": [
                    {
                        "tag_name": "移動経路",
                        "icons": [
                            {
                                "name": "Google Map",
                                "image_url": "https://www.google.com/maps/about/images/home/home-maps-icon.svg"
                            },
                            {
                                "name": "Booking.com",
                                "image_url": "https://www.booking.com/favicon.ico"
                            }
                        ]
                    },
                    {
                        "tag_name": "計画",
                        "icons": [
                            {
                                "name": "Notion",
                                "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg"
                            },
                            {
                                "name": "Google Document",
                                "image_url": "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": 2,
            "content": {
                "blocks": [
                    {
                        "tag_name": "企業リスト",
                        "icons": [
                            {
                                "name": "サポーターズ",
                                "image_url": "https://supporterz.jp/favicon.ico"
                            },
                            {
                                "name": "Wantedly",
                                "image_url": "https://www.wantedly.com/favicon.ico"
                            }
                        ]
                    },
                    {
                        "tag_name": "進捗管理",
                        "icons": [
                            {
                                "name": "Notion",
                                "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg"
                            },
                            {
                                "name": "Google Calendar",
                                "image_url": "https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_16_2x.png"
                            }
                        ]
                    }
                ]
            }
        }
    ]

    # 新しいプロジェクト "投資"
    new_project = Project(
        name="投資",
        description="投資に関する情報を管理するプロジェクト",
        content={
            "blocks": [
                {
                    "tag_name": "市場情報",
                    "icons": [
                        {
                            "name": "Yahooファイナンス",
                            "image_url": "https://s.yimg.jp/images/top/favicon/favicon.ico"
                        },
                        {
                            "name": "日経新聞",
                            "image_url": "https://www.nikkei.com/favicon.ico"
                        },
                        {
                            "name": "SBI証券",
                            "image_url": "https://www.sbisec.co.jp/favicon.ico"
                        }
                    ]
                }
            ]
        }
    )

    # データ更新処理
    for data in updated_data:
        project = session.query(Project).filter(Project.id == data["id"]).first()
        if project:
            project.content = data["content"]

    # 新しいプロジェクトを追加
    session.add(new_project)
    session.commit()


def downgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    # 新しいプロジェクト "投資" を削除
    project_to_delete = session.query(Project).filter(Project.name == "投資").first()
    if project_to_delete:
        session.delete(project_to_delete)

    # "進捗管理" タグを ID 2 から削除
    project_to_update = session.query(Project).filter(Project.id == 2).first()
    if project_to_update:
        content = project_to_update.content
        if "blocks" in content:
            content["blocks"] = [
                block for block in content["blocks"]
                if block["tag_name"] != "進捗管理"
            ]
            project_to_update.content = content

    session.commit()
