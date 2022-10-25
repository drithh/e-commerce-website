"""soft delete

Revision ID: 9b7f9e3d9069
Revises: e9f0fccb167b
Create Date: 2022-10-17 08:52:38.709803

"""
from alembic import op
import sqlalchemy as sa
import fastapi_users_db_sqlalchemy


# revision identifiers, used by Alembic.
revision = "9b7f9e3d9069"
down_revision = "e9f0fccb167b"
branch_labels = None
depends_on = None


def upgrade():
    # drop all tables in database

    sql_file = open("sql/update_at.sql", "r")
    sql = sql_file.read()
    op.execute(sql)

    sql_file = open("sql/soft_delete.sql", "r")
    sql = sql_file.read()
    op.execute(sql)
    # commit

    pass


def downgrade():
    pass
