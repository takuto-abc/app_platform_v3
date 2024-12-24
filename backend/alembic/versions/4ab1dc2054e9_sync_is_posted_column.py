"""Sync is_posted column

Revision ID: 4ab1dc2054e9
Revises: 7f91848c80d4
Create Date: 2024-12-24 12:39:42.667552

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = '4ab1dc2054e9'
down_revision = '7f91848c80d4'
branch_labels = None
depends_on = None

def upgrade():
    # 既に最新の状態なので操作は不要
    pass

def downgrade():
    # インデックス削除が必要な場合のみ記載
    op.drop_index(op.f('ix_projects_name'), table_name='projects')
    op.drop_index(op.f('ix_projects_id'), table_name='projects')


