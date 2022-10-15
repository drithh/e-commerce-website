"""users

Revision ID: 85d6a7294cde
Revises: b4137085d7fb
Create Date: 2022-10-15 16:41:37.993582

"""
from alembic import op
import sqlalchemy as sa
import fastapi_users_db_sqlalchemy


# revision identifiers, used by Alembic.
revision = "85d6a7294cde"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", fastapi_users_db_sqlalchemy.GUID(), nullable=False),
        sa.Column("name", sa.String(length=64), nullable=False),
        sa.Column("email", sa.String(length=64), nullable=False),
        sa.Column("hashed_password", sa.String(length=72), nullable=False),
        sa.Column("phone_number", sa.String(length=64), nullable=False),
        sa.Column("address", sa.String(length=64), nullable=False),
        sa.Column("city", sa.String(length=64), nullable=False),
        sa.Column("balance", sa.Integer(), nullable=False),
        sa.Column("salt", sa.String(length=64), nullable=False),
        sa.Column("is_admin", sa.Boolean(), nullable=False),
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
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
    pass
