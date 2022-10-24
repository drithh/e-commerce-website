DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'deleted_at' AND table_name NOT LIKE 'z_archive_%'
    LOOP
        EXECUTE format('CREATE TABLE %I
                    (CHECK (deleted_at IS NOT NULL))
                    INHERITS(%I)', 'z_archive_' || t ,t);
    END loop;
END;
$$ language 'plpgsql';

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


CREATE OR REPLACE FUNCTION dearchive_record()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        EXECUTE format('INSERT INTO %I.%I SELECT $1.*'
                    , TG_TABLE_SCHEMA, substring(TG_TABLE_NAME from 11)) USING OLD;
        EXECUTE format('UPDATE %I.%I SET deleted_at = NULL WHERE id = $1', TG_TABLE_SCHEMA, substring(TG_TABLE_NAME from 11)) USING OLD.id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns WHERE table_name LIKE 'z_archive_%'
    LOOP
        EXECUTE format('CREATE OR REPLACE TRIGGER trigger_dearchive_record
                    AFTER DELETE ON %I
                    FOR EACH ROW EXECUTE PROCEDURE dearchive_record()', t,t);
    END loop;
END;
$$ language 'plpgsql';
