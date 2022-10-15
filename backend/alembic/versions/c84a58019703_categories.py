"""categories

Revision ID: c84a58019703
Revises: 85d6a7294cde
Create Date: 2022-10-15 16:42:08.273776

"""
from alembic import op
import sqlalchemy as sa
import fastapi_users_db_sqlalchemy


# revision identifiers, used by Alembic.
revision = "c84a58019703"
down_revision = "85d6a7294cde"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "categories",
        sa.Column("id", fastapi_users_db_sqlalchemy.GUID(), nullable=False),
        sa.Column("title", sa.String(length=64), nullable=False),
        sa.Column("image_id", fastapi_users_db_sqlalchemy.GUID(), nullable=False),
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
        sa.ForeignKeyConstraint(
            ["image_id"],
            ["images.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_categories_title"),
        "categories",
        ["title"],
        unique=True,
    )


def downgrade():
    op.drop_index(op.f("ix_categories_title"), table_name="categories")
    pass
