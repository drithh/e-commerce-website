"""images

Revision ID: 7a8b0983b313
Revises: c84a58019703
Create Date: 2022-10-15 16:42:12.659568

"""
from alembic import op
import sqlalchemy as sa
import fastapi_users_db_sqlalchemy


# revision identifiers, used by Alembic.
revision = "7a8b0983b313"
down_revision = "c84a58019703"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "images",
        sa.Column("id", fastapi_users_db_sqlalchemy.GUID(), nullable=False),
        sa.Column("name", sa.String(length=64), nullable=False),
        sa.Column("image_url", sa.String(length=64), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "deleted_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    pass


def downgrade():
    op.drop_table("images")
    pass
