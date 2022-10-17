"""soft delete

Revision ID: 9b7f9e3d9069
Revises: a02e28de5f6e
Create Date: 2022-10-17 08:52:38.709803

"""
from alembic import op
import sqlalchemy as sa
import fastapi_users_db_sqlalchemy


# revision identifiers, used by Alembic.
revision = "9b7f9e3d9069"
down_revision = "a02e28de5f6e"
branch_labels = None
depends_on = None


def upgrade():
    sql_file = open("app/deps/archive_soft_delete.sql", "r")
    sql = sql_file.read()
    op.execute(sql)
    # commit

    pass


def downgrade():
    pass
