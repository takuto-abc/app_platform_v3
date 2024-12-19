"""Add is_deleted column to icons table

Revision ID: 6efa129b0053
Revises: 6deead1ed285
Create Date: 2024-12-19 13:22:24.199701

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = '6efa129b0053'
down_revision = '6deead1ed285'
branch_labels = None
depends_on = None

def upgrade():
    # icons テーブルに is_deleted カラムを追加
    op.add_column('icons', sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='0'))

def downgrade():
    # icons テーブルから is_deleted カラムを削除
    op.drop_column('icons', 'is_deleted')

