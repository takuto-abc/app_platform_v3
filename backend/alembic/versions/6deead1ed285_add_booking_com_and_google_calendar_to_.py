"""Add Booking.com and Google Calendar to Icons table

Revision ID: 6deead1ed285
Revises: 5874c3f42346
Create Date: 2024-12-19 10:28:28.696532

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session



# revision identifiers, used by Alembic.
revision = '6deead1ed285'
down_revision = '5874c3f42346'
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    # 新しいアイコンを挿入
    new_icons = [
        {"id": 2, "name": "Booking.com", "image_url": "https://pbs.twimg.com/profile_images/1323220178574938113/SZK83dEL_400x400.jpg", "block_id": 1},
        {"id": 8, "name": "Google Calendar", "image_url": "https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_16_2x.png", "block_id": 4},
    ]

    try:
        session.execute(
            sa.text("""
            INSERT INTO icons (id, name, image_url, block_id) 
            VALUES (:id, :name, :image_url, :block_id)
            """),
            new_icons
        )
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def downgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    # 挿入したアイコンを削除
    try:
        session.execute(
            sa.text("""
            DELETE FROM icons WHERE id IN (2, 8)
            """)
        )
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()