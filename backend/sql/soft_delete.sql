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
                    , TG_TABLE_SCHEMA, 'z_archive_' || TG_TABLE_NAME)
        USING OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'deleted_at' AND table_name NOT LIKE 'z_archive_%'
    LOOP
        EXECUTE format('CREATE TRIGGER trigger_archive_record
                    AFTER UPDATE OF deleted_at OR DELETE ON %I
                    FOR EACH ROW EXECUTE PROCEDURE archive_record()', t,t);
    END loop;
END;
$$ language 'plpgsql';
