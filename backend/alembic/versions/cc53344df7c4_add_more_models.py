"""add more models

Revision ID: cc53344df7c4
Revises: e3096b6780d9
Create Date: 2022-10-15 11:16:41.542057

"""
from alembic import op
import sqlalchemy as sa
import fastapi_users_db_sqlalchemy


# revision identifiers, used by Alembic.
revision = "cc53344df7c4"
down_revision = "e3096b6780d9"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "sizes",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("size", sa.String(length=1), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "banners",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("title", sa.String(length=64), nullable=False),
        sa.Column(
            "image_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["image_id"],
            ["images.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "orders",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("address", sa.String(length=64), nullable=False),
        sa.Column("city", sa.String(length=64), nullable=False),
        sa.Column("shipping_price", sa.Integer(), nullable=False),
        sa.Column(
            "user_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "products",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("title", sa.String(length=64), nullable=False),
        sa.Column("brand", sa.String(length=64), nullable=False),
        sa.Column("product_detail", sa.String(length=128), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.Column("condition", sa.String(length=64), nullable=False),
        sa.Column(
            "category_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["categories.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "product_images",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "image_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.Column(
            "product_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["image_id"],
            ["images.id"],
        ),
        sa.ForeignKeyConstraint(
            ["product_id"],
            ["products.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "product_size_quantities",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column(
            "product_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.Column(
            "size_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["product_id"],
            ["products.id"],
        ),
        sa.ForeignKeyConstraint(
            ["size_id"],
            ["sizes.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "carts",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column(
            "user_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.Column(
            "product_size_quantity_id",
            fastapi_users_db_sqlalchemy.generics.GUID(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["product_size_quantity_id"],
            ["product_size_quantities.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "order_items",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
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
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column(
            "order_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.Column(
            "product_size_quantity_id",
            fastapi_users_db_sqlalchemy.generics.GUID(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["order_id"],
            ["orders.id"],
        ),
        sa.ForeignKeyConstraint(
            ["product_size_quantity_id"],
            ["product_size_quantities.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("order_items")
    op.drop_table("carts")
    op.drop_table("product_size_quantities")
    op.drop_table("product_images")
    op.drop_table("products")
    op.drop_table("orders")
    op.drop_table("banners")
    op.drop_table("sizes")
    # ### end Alembic commands ###
