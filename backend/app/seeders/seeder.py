from faker import Faker

from app import db
from app.core.logger import logger
from app.seeders.banner_seeder import banner_seed
from app.seeders.cart_seeder import cart_seed
from app.seeders.category_seeder import category_seed
from app.seeders.image_seeder import image_seed
from app.seeders.order_item_seeder import order_item_seed
from app.seeders.order_seeder import order_seed
from app.seeders.product_image_seeder import product_image_seed
from app.seeders.product_seeder import product_seed
from app.seeders.product_size_quantity_seeder import product_size_quantity_seed
from app.seeders.size_seeder import size_seed
from app.seeders.user_seeder import user_seed
from app.seeders.wishlist_seeder import wishlist_seed

banners_urls = [
    "banners/banner-1.webp",
    "banners/banner-2.webp",
    "banners/banner-3.webp",
]


product_items = [
    {
        "category": "shirts",
        "item": [
            {
                "name": "Men Japanese Tree Shirt",
                "price": 160000,
            },
            {
                "name": "Cordudoy Solid Shirt",
                "price": 230000,
            },
            {
                "name": "Men Picture Print Shirt",
                "price": 180000,
            },
            {
                "name": "Random Baroque Shirt",
                "price": 160000,
            },
            {
                "name": "Button Up Cordudoy Shirt",
                "price": 210000,
            },
            {
                "name": "Block Patched Shirt",
                "price": 250000,
            },
            {
                "name": "Sunflower Print Shirt",
                "price": 230000,
            },
            {
                "name": "Argyle Figure Shirt",
                "price": 150000,
            },
            {
                "name": "Figure Graphic Through Shirt",
                "price": 160000,
            },
            {
                "name": "Men Leopard Print Shirt",
                "price": 140000,
            },
        ],
    },
    {
        "category": "t-shirts",
        "item": [
            {
                "name": "Skeleteon Tee",
                "price": 90000,
            },
            {
                "name": "Cactus Slogan Graphic Tee",
                "price": 120000,
            },
            {
                "name": "Slogan Graphic Oversizde Tee",
                "price": 140000,
            },
            {
                "name": "Slogan Graphic Round Tee",
                "price": 110000,
            },
            {
                "name": "Reflective ExpressionTee",
                "price": 150000,
            },
            {
                "name": "Cat Tee",
                "price": 90000,
            },
            {
                "name": "Dazy Star Tee",
                "price": 110000,
            },
            {
                "name": "Teddy Bear Tee",
                "price": 120000,
            },
            {
                "name": "Galaxy Print Tee",
                "price": 120000,
            },
            {
                "name": "Cow Tee",
                "price": 80000,
            },
        ],
    },
    {
        "category": "sandals",
        "item": [
            {
                "name": "Cartoon Shark Slides",
                "price": 180000,
            },
            {
                "name": "Sole Thong Sandals",
                "price": 120000,
            },
            {
                "name": "Straw Pompom Sandals",
                "price": 250000,
            },
            {
                "name": "Decor Strap Sandals",
                "price": 340000,
            },
            {
                "name": "Color Ankle Sandals",
                "price": 130000,
            },
            {
                "name": "Bow Decor Sandals",
                "price": 60000,
            },
            {
                "name": "Minimalist Sling Back Sandals",
                "price": 90000,
            },
            {
                "name": "Floral Pattern Sandals",
                "price": 280000,
            },
            {
                "name": "Minimalist Fuzzy Sandals",
                "price": 150000,
            },
            {
                "name": "Open Toe Massage Slides",
                "price": 180000,
            },
        ],
    },
    {
        "category": "sneakers",
        "item": [
            {
                "name": "Men Skate Shoes",
                "price": 410000,
            },
            {
                "name": "Halloween Pumpkin Running Shoes",
                "price": 300000,
            },
            {
                "name": "Colorblock Chunky Sneakers",
                "price": 340000,
            },
            {
                "name": "Front Canvas Shoes",
                "price": 240000,
            },
            {
                "name": "All Over Print Shoes",
                "price": 280000,
            },
            {
                "name": "Neon Yellow Shoes",
                "price": 190000,
            },
            {
                "name": "Metallic Skate Shoes",
                "price": 330000,
            },
            {
                "name": "Plant Wedge Sneakers",
                "price": 350000,
            },
            {
                "name": "Hollow Out Shoes",
                "price": 220000,
            },
            {
                "name": "Graffiti Print Shoes",
                "price": 290000,
            },
        ],
    },
    {
        "category": "angkle-boots",
        "item": [
            {
                "name": "Zipper Side Combat Boots",
                "price": 380000,
            },
            {
                "name": "Side Zip Suedette Booties",
                "price": 300000,
            },
            {
                "name": "Buckle Decor Boots",
                "price": 250000,
            },
            {
                "name": "Faux Suede Boots",
                "price": 390000,
            },
            {
                "name": "Letter Detail Wedge Boots",
                "price": 290000,
            },
            {
                "name": "Minimalist Zipper Boots",
                "price": 270000,
            },
            {
                "name": "Ruched Detail Boots",
                "price": 340000,
            },
            {
                "name": "Leopard Head Boots",
                "price": 310000,
            },
            {
                "name": "Braided Textured Chelsea Boots",
                "price": 460000,
            },
            {
                "name": "Chunky Snow Boots",
                "price": 510000,
            },
        ],
    },
    {
        "category": "trousers",
        "item": [
            {
                "name": "Leather Straight Leg Pants",
                "price": 310000,
            },
            {
                "name": "Elastic Waist Wide Leg Pants",
                "price": 200000,
            },
            {
                "name": "High Waist Flap Pocket Cargo Pants",
                "price": 220000,
            },
            {
                "name": "Flap Pocket Cord Pants",
                "price": 300000,
            },
            {
                "name": "Flap Pocket Drawstring Hem Cargo Pants",
                "price": 250000,
            },
            {
                "name": "High Waist Plicated Detail Pants",
                "price": 310000,
            },
            {
                "name": "High Waist Slant Pocket Fold Pleated Pants",
                "price": 400000,
            },
            {
                "name": "High Waist Plicated Detail Cargo Pants",
                "price": 330000,
            },
            {
                "name": "Drawstring Waist Wide Leg Pants",
                "price": 340000,
            },
            {
                "name": "Slant Pocket Cord Straight Leg Pants",
                "price": 300000,
            },
        ],
    },
    {
        "category": "pullovers",
        "item": [
            {
                "name": "High Neck Drop Shoulder Fleece Sweatshirt",
                "price": 200000,
            },
            {
                "name": "Solid Drop Shoulder Oversized Sweatshirt Without Tee",
                "price": 250000,
            },
            {
                "name": "Quarter Zip Drop Shoulder Sweater",
                "price": 450000,
            },
            {
                "name": "Solid Drop Shoulder Sweater",
                "price": 300000,
            },
            {
                "name": "Mock Neck Drop Shoulder Sweater",
                "price": 500000,
            },
            {
                "name": "Men Block Striped Pattern Drop Shoulder Sweater",
                "price": 400000,
            },
            {
                "name": "Men Geo & Stripe Pattern Drop Shoulder Sweater Without Tee",
                "price": 470000,
            },
            {
                "name": "Men Argyle Pattern Drop Shoulder Sweater",
                "price": 400000,
            },
            {
                "name": "Men Colorblock Drop Shoulder Drawstring Hooded Sweater Without Tee",
                "price": 560000,
            },
            {
                "name": "Men Stripe Pattern Ribbed Knit Sweater",
                "price": 360000,
            },
        ],
    },
    {
        "category": "dresses",
        "item": [
            {
                "name": "Cowl Neck Solid Slip Dress",
                "price": 230000,
            },
            {
                "name": "Solid Cami Dress",
                "price": 265000,
            },
            {
                "name": "Split Thigh Tank Dress",
                "price": 140000,
            },
            {
                "name": "Allover Floral Print Tie Front Shirred Ruffle Trim Dress",
                "price": 233000,
            },
            {
                "name": "Solid Scoop Neck Split Thigh Dress",
                "price": 210000,
            },
            {
                "name": "Floral Print Puff Sleeve Tie Side Wrap Dress",
                "price": 400000,
            },
            {
                "name": "Solid Rib-knit Bodycon Dress",
                "price": 80000,
            },
            {
                "name": "Ditsy Floral Print Ruffle Hem Dress",
                "price": 300000,
            },
            {
                "name": "Solid A-line Dress",
                "price": 360000,
            },
            {
                "name": "Ruffle Hem Puff Sleeve Dress",
                "price": 300000,
            },
        ],
    },
    {
        "category": "coats",
        "item": [
            {
                "name": "Raglan Sleeve Zip Up Teddy Coat",
                "price": 670000,
            },
            {
                "name": "Drop Shoulder Dual Pockets Teddy Coat",
                "price": 500000,
            },
            {
                "name": "Drop Shoulder Pocket Patched Teddy Coat",
                "price": 670000,
            },
            {
                "name": "Dual Pocket Drop Shoulder Teddy Coat",
                "price": 500000,
            },
            {
                "name": "Lapel Neck Single Breasted Teddy Coat",
                "price": 480000,
            },
            {
                "name": "Extended Sizes Men Single Breasted Slant Pocket Coat",
                "price": 740000,
            },
            {
                "name": "Men Buffalo Plaid Pattern Flap Pocket Coat",
                "price": 515000,
            },
            {
                "name": "Men Zip Up Drawstring Hooded 2 In 1 Coat",
                "price": 480000,
            },
            {
                "name": "Men Buffalo Plaid Print Zip Up Coat Without Hoodie",
                "price": 480000,
            },
            {
                "name": "Men Plaid & Letter Graphic Flap Pocket Zipper Coat",
                "price": 550000,
            },
        ],
    },
    {
        "category": "bags",
        "item": [
            {
                "name": "Mini Floral Embroidered Metal Lock Flap Straw Bag",
                "price": 150000,
            },
            {
                "name": "Patch Detail Bucket Bag",
                "price": 250000,
            },
            {
                "name": "Minimalist Large Capacity Bucket Bag",
                "price": 100000,
            },
            {
                "name": "Floral Pattern Square Bag",
                "price": 95000,
            },
            {
                "name": "Buckle Detail Bucket Bag",
                "price": 300000,
            },
            {
                "name": "Men Hook-and-loop Fastener Flap Messenger Bag",
                "price": 265000,
            },
            {
                "name": "Men Letter Patch Decor Casual Daypack",
                "price": 358000,
            },
            {
                "name": "Men Large Capacity Flap Square Bag",
                "price": 400000,
            },
            {
                "name": "Men Minimalist Flap Messenger Bag",
                "price": 200000,
            },
            {
                "name": "Men Letter Patch Cartoon Decor Messenger Bag",
                "price": 310000,
            },
        ],
    },
]

category_items = []
product_urls = []
for product_item in product_items:
    category_items.append(product_item["category"])
    for item in product_item["item"]:
        for i in range(1, 3):
            product_urls.append(
                f"products/{product_item['category']}/{item['name'].replace(' ', '-').lower()}-{i}.webp"
            )


def seed():

    fake = Faker("id_ID")
    with db.SessionLocal() as session:

        logger.info("Seeding Table Users")
        user_id = user_seed(fake, session)

        logger.info("Seeding Table Images")
        banner_image_id = image_seed(fake, session, banners_urls)
        product_image_id = image_seed(fake, session, product_urls)

        logger.info("Seeding Table Sizes")
        size_id = size_seed(fake, session)
        session.commit()

        logger.info("Seeding Table Categories")
        category_id = category_seed(fake, session, category_items)

        logger.info("Seeding Table Banners")
        banner_seed(fake, session, banner_image_id)
        session.commit()

        # change product_items category to category_id
        for product_item in product_items:
            product_item["category"] = category_id[
                category_items.index(product_item["category"])
            ]

        logger.info("Seeding Table Products")
        product_id = product_seed(fake, session, product_items)
        session.commit()

        logger.info("Seeding Table Product Images")
        product_image_seed(fake, session, product_id, product_image_id)

        logger.info("Seeding Table Product Sizes")
        product_size_quantity_id = product_size_quantity_seed(
            fake, session, product_id, size_id
        )

        logger.info("Seeding Table Whistlists")
        wishlist_seed(fake, session, user_id, product_id)

        logger.info("Seeding Table Orders")
        order_id = order_seed(fake, session, user_id)
        session.commit()

        logger.info("Seeding Table Order Items")
        order_item_seed(fake, session, order_id, product_size_quantity_id)

        logger.info("Seeding Table Carts")
        cart_seed(fake, session, user_id, product_size_quantity_id)
        session.commit()


def delete():
    with db.SessionLocal() as session:
        session.execute("DELETE FROM carts")
        session.execute("DELETE FROM order_items")
        session.execute("DELETE FROM orders")
        session.execute("DELETE FROM product_size_quantities")
        session.execute("DELETE FROM product_images")
        session.execute("DELETE FROM products")
        session.execute("DELETE FROM banners")
        session.execute("DELETE FROM categories")
        session.execute("DELETE FROM sizes")
        session.execute("DELETE FROM images")
        session.execute("DELETE FROM wishlists")
        session.execute("DELETE FROM users")
        session.commit()


if __name__ == "__main__":
    delete()
    seed()
