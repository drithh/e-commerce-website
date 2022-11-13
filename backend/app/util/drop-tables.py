from app import db
from app.core.logger import logger


def drop_tables():
    # remove all data from archive table

    with db.SessionLocal() as session:
        table_names = session.execute(
            "SELECT table_name FROM information_schema.tables WHERE table_name NOT LIKE 'z_archive_%' AND table_schema='public'"
        ).fetchall()
        for table_name in table_names:
            logger.info(f"Dropping table {table_name[0]}")
            session.execute(f"DROP TABLE {table_name[0]} CASCADE")
        session.commit()


if __name__ == "__main__":
    drop_tables()
