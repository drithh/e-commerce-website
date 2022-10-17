CREATE TABLE z_archive_users (CHECK (deleted_at IS NOT NULL)) INHERITS (users);
CREATE TABLE z_archive_products (CHECK (deleted_at IS NOT NULL)) INHERITS (products);
CREATE TABLE z_archive_product_images (CHECK (deleted_at IS NOT NULL)) INHERITS (product_images);
CREATE TABLE z_archive_product_size_quantities (CHECK (deleted_at IS NOT NULL)) INHERITS (product_size_quantities);
CREATE TABLE z_archive_sizes (CHECK (deleted_at IS NOT NULL)) INHERITS (sizes);
CREATE TABLE z_archive_banners (CHECK (deleted_at IS NOT NULL)) INHERITS (banners);
CREATE TABLE z_archive_images (CHECK (deleted_at IS NOT NULL)) INHERITS (images);
CREATE TABLE z_archive_categories (CHECK (deleted_at IS NOT NULL)) INHERITS (categories);
CREATE TABLE z_archive_carts (CHECK (deleted_at IS NOT NULL)) INHERITS (carts);
CREATE TABLE z_archive_orders (CHECK (deleted_at IS NOT NULL)) INHERITS (orders);
CREATE TABLE z_archive_order_items (CHECK (deleted_at IS NOT NULL)) INHERITS (order_items);

CREATE OR REPLACE FUNCTION archive_record()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND NEW.deleted_at IS NOT NULL) THEN
        EXECUTE format('DELETE FROM %I.%I WHERE id = $1', TG_TABLE_SCHEMA, TG_TABLE_NAME) USING OLD.id;
        RETURN OLD;
    END IF;
    IF (TG_OP = 'DELETE') THEN
        IF (OLD.deleted_at IS NULL) THEN
            OLD.deleted_at := now();
        END IF;
        EXECUTE format('INSERT INTO %I.%I SELECT $1.*'
                    , TG_TABLE_SCHEMA, '_archive_' || TG_TABLE_NAME)
        USING OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soft_delete_users
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_products
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON products
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_product_images
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON product_images
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_product_size_quantities
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON product_size_quantities
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_sizes
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON sizes
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_banners
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON banners
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_images
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON images
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_categories
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON categories
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_carts
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON carts
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_orders
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON orders
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();

CREATE TRIGGER soft_delete_order_items
    AFTER
        UPDATE OF deleted_at
        OR DELETE
    ON order_items
    FOR EACH ROW
    EXECUTE PROCEDURE archive_record();
