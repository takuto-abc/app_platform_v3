from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session
from backend.app.models import Project

# revision identifiers, used by Alembic.
revision = 'c492447c2be9'
down_revision = 'c9b9de26557a'  # 修正: 直前のrevision IDを設定
branch_labels = None
depends_on = None


def upgrade():
    # シーディング処理
    bind = op.get_bind()
    session = Session(bind=bind)

    seed_data = [
        {
            "name": "旅行",
            "description": "旅行のスケジュールを管理するプロジェクト",
            "content": {
                "blocks": [
                    {
                        "tag_name": "移動経路",
                        "icons": [
                            {"name": "Google Map", "image_url": "https://example.com/google-map.png"},
                            {"name": "Booking.com", "image_url": "https://example.com/booking.png"},
                        ],
                    },
                ]
            },
        },
        {
            "name": "就職活動",
            "description": "就職活動を管理するプロジェクト",
            "content": {
                "blocks": [
                    {
                        "tag_name": "企業リスト",
                        "icons": [
                            {"name": "企業A", "image_url": "https://example.com/company-a.png"},
                            {"name": "企業B", "image_url": "https://example.com/company-b.png"},
                        ],
                    },
                ]
            },
        },
    ]

    for project_data in seed_data:
        project = Project(
            name=project_data["name"],
            description=project_data["description"],
            content=project_data["content"],
        )
        session.add(project)
    session.commit()

def downgrade():
    # データを削除する処理
    bind = op.get_bind()
    session = Session(bind=bind)
    session.query(Project).delete()
    session.commit()
