CREATE TABLE z_archive_users () INHERITS (users);
CREATE TABLE z_archive_products () INHERITS (products);
CREATE TABLE z_archive_product_images () INHERITS (product_images);
CREATE TABLE z_archive_product_size_quantities () INHERITS (product_size_quantities);
CREATE TABLE z_archive_sizes () INHERITS (sizes);
CREATE TABLE z_archive_banners () INHERITS (banners);
CREATE TABLE z_archive_images () INHERITS (images);
CREATE TABLE z_archive_categories () INHERITS (categories);
CREATE TABLE z_archive_carts () INHERITS (carts);
CREATE TABLE z_archive_orders () INHERITS (orders);
CREATE TABLE z_archive_order_items () INHERITS (order_items);

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
                    , TG_TABLE_SCHEMA, 'z_archive_' || TG_TABLE_NAME)
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
