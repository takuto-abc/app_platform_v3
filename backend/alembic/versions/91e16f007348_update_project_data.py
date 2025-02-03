from alembic import op
from sqlalchemy.orm import Session
from backend.app.models import Project

revision = '91e16f007348'
down_revision = 'c822077cbad5'
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
                                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Booking.com_logo.svg/1200px-Booking.com_logo.svg.png"
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
                                "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_Docs_icon_%282020%29.svg"
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
                    }
                ]
            }
        }
    ]

    # データ更新処理
    for data in updated_data:
        project = session.query(Project).filter(Project.id == data["id"]).first()
        if project:
            project.content = data["content"]
    session.commit()

def downgrade():
    pass  # 必要であればダウングレード処理を記述