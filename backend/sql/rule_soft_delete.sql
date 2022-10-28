-- WHEN USER DELETED
CREATE OR REPLACE RULE users AS ON DELETE TO users DO INSTEAD (
  UPDATE users SET deleted_at = now() WHERE id = OLD.id;
);
CREATE OR REPLACE RULE users_cascade AS ON UPDATE TO users WHERE NEW.deleted_at IS NOT NULL DO ALSO (
    UPDATE carts SET deleted_at = NEW.deleted_at WHERE carts.user_id = OLD.id;
    UPDATE orders SET deleted_at = NEW.deleted_at WHERE orders.user_id = OLD.id;
);

-- WHEN ORDER DELETED
CREATE OR REPLACE RULE orders AS ON DELETE TO orders DO INSTEAD (
  UPDATE orders SET deleted_at = now() WHERE id = OLD.id;
);
CREATE OR REPLACE RULE orders_cascade AS ON UPDATE TO orders WHERE NEW.deleted_at IS NOT NULL DO ALSO (
    UPDATE order_items SET deleted_at = NEW.deleted_at WHERE order_items.order_id = OLD.id;
);

-- WHEN ORDER ITEM DELETED
CREATE OR REPLACE RULE order_items AS ON DELETE TO order_items DO INSTEAD (
    UPDATE order_items SET deleted_at = now() WHERE id = OLD.id
);

-- WHEN CART DELETED
CREATE OR REPLACE RULE carts AS ON DELETE TO carts DO INSTEAD (
  UPDATE carts SET deleted_at = now() WHERE id = OLD.id;
);

-- WHEN CATEGORY DELETED
CREATE OR REPLACE RULE categories AS ON DELETE TO categories DO INSTEAD (
  UPDATE categories SET deleted_at = now() WHERE id = OLD.id;
);
CREATE OR REPLACE RULE categories_cascade AS ON UPDATE TO categories WHERE NEW.deleted_at IS NOT NULL DO ALSO (
    UPDATE products SET deleted_at = NEW.deleted_at WHERE products.category_id = OLD.id;
);

-- WHEN PRODUCT DELETED
CREATE OR REPLACE RULE products AS ON DELETE TO products DO INSTEAD (
  UPDATE products SET deleted_at = now() WHERE id = OLD.id;
);
CREATE OR REPLACE RULE products_cascade AS ON UPDATE TO products WHERE NEW.deleted_at IS NOT NULL DO ALSO (
    UPDATE product_images SET deleted_at = NEW.deleted_at WHERE product_images.product_id = OLD.id;
    UPDATE product_size_quantities SET deleted_at = NEW.deleted_at WHERE product_size_quantities.product_id = OLD.id;
);

-- WHEN PRODUCT IMAGE DELETED
CREATE OR REPLACE RULE product_images AS ON DELETE TO product_images DO INSTEAD (
  UPDATE product_images SET deleted_at = now() WHERE id = OLD.id;
);

-- WHEN PRODUCT SIZE QUANTITY DELETED
CREATE OR REPLACE RULE product_size_quantities AS ON DELETE TO product_size_quantities DO INSTEAD (
  UPDATE product_size_quantities SET deleted_at = now() WHERE id = OLD.id;
);
CREATE OR REPLACE RULE product_size_quantities_cascade AS ON UPDATE TO product_size_quantities WHERE NEW.deleted_at IS NOT NULL DO ALSO (
    UPDATE carts SET deleted_at = NEW.deleted_at WHERE carts.product_size_quantity_id = OLD.id;
    UPDATE order_items SET deleted_at = NEW.deleted_at WHERE order_items.product_size_quantity_id = OLD.id;
);

-- WHEN SIZE DELETED
CREATE OR REPLACE RULE sizes AS ON DELETE TO sizes DO INSTEAD (
  UPDATE sizes SET deleted_at = now() WHERE id = OLD.id;
);
CREATE OR REPLACE RULE sizes_cascade AS ON UPDATE TO sizes WHERE NEW.deleted_at IS NOT NULL DO ALSO (
    UPDATE product_size_quantities SET deleted_at = NEW.deleted_at WHERE product_size_quantities.size_id = OLD.id;
);

-- WHEN BANNER DELETED
CREATE OR REPLACE RULE banners AS ON DELETE TO banners DO INSTEAD (
  UPDATE banners SET deleted_at = now() WHERE id = OLD.id;
);

-- WHEN IMAGE DELETED
CREATE OR REPLACE RULE images AS ON DELETE TO images DO INSTEAD (
  UPDATE images SET deleted_at = now() WHERE id = OLD.id;
);
CREATE OR REPLACE RULE images_cascade AS ON UPDATE TO images WHERE NEW.deleted_at IS NOT NULL DO ALSO (
    UPDATE banners SET deleted_at = NEW.deleted_at WHERE banners.image_id = OLD.id;
    UPDATE categories SET deleted_at = NEW.deleted_at WHERE categories.image_id = OLD.id;
    UPDATE product_images SET deleted_at = NEW.deleted_at WHERE product_images.image_id = OLD.id;
);
