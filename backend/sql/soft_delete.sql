-- Create Archive Table
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'deleted_at' AND table_name NOT LIKE 'z_archive_%' AND table_name NOT LIKE 'wishlists'
    LOOP
        EXECUTE format('CREATE TABLE %I
                    (CHECK (deleted_at IS NOT NULL))
                    INHERITS(%I)', 'z_archive_' || t ,t);
    END loop;
END;
$$ language 'plpgsql';

-- Create Function to Archive
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

-- Create Trigger to Archive
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'deleted_at' AND table_name NOT LIKE 'z_archive_%' AND table_name NOT LIKE 'wishlists'
    LOOP
        EXECUTE format('CREATE TRIGGER trigger_archive_record
                    AFTER UPDATE OF deleted_at OR DELETE ON %I
                    FOR EACH ROW EXECUTE PROCEDURE archive_record()', t,t);
    END loop;
END;
$$ language 'plpgsql';

-- Create Function to Restore from Archive
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

-- Create Trigger to Restore from Archive
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

-- Implement Full Text Search Function
-- ALTER TABLE products
-- ADD search tsvector
-- GENERATED ALWAYS AS (
--   setweight(to_tsvector('simple',title), 'A')  || ' ' ||
--   setweight(to_tsvector('english',brand), 'B') :: tsvector

-- ) stored;


-- CREATE index idx_search ON products USING GIN(search);

-- CREATE OR REPLACE FUNCTION search_questions(term TEXT)
-- returns table(
--   id UUID,
--   title TEXT,
--   rank REAL
-- )
-- as
-- $$

-- SELECT id, title,
--   ts_rank(search, websearch_to_tsquery('english',term)) +
--   ts_rank(search, websearch_to_tsquery('simple',term)) as rank
-- FROM products
-- WHERE search @@ websearch_to_tsquery('english',term)
-- OR search @@ websearch_to_tsquery('simple',term)
-- ORDER BY rank DESC;

-- $$ language SQL;

 ALTER TABLE products
 ADD search TEXT
 GENERATED ALWAYS AS (
    coalesce(title, '') || ' ' || coalesce(brand, '')
 ) stored;

CREATE INDEX products_searchable_text_trgm_gist_idx on PRODUCTS
  USING GIST(search  gist_trgm_ops(siglen=256));

CREATE OR REPLACE FUNCTION search_products(term TEXT)
returns table(
  id UUID,
  title TEXT,
  score REAL
)
as
$$

WITH term AS (SELECT term AS q)
SELECT id, title,
      1 - (term.q <<-> search) AS score
FROM products p , term
WHERE term.q <% (search)
ORDER BY term.q <<-> (search) LIMIT 10;
$$ language SQL;
