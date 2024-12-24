"""Add is_posted column to projects

Revision ID: 7f91848c80d4
Revises: 6efa129b0053
Create Date: 2024-12-24 12:31:04.819388

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7f91848c80d4'
down_revision = '6efa129b0053'
branch_labels = None
depends_on = None

def upgrade():
    # is_posted カラムを追加（デフォルト値として False を設定）
    op.add_column('projects', sa.Column('is_posted', sa.Boolean(), nullable=False, server_default='0'))

    # server_default=None を削除（SQLiteでは不要）
    # ### end Alembic commands ###

def downgrade():
    # is_posted カラムを削除
    op.drop_column('projects', 'is_posted')
