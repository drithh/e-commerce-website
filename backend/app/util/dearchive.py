from app import db


def dearhived():
    # remove all data from archive table

    with db.SessionLocal() as session:
        table_names = session.execute(
            "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'z_archive_%' AND table_schema='public'"
        ).fetchall()
        for table_name in table_names:
            session.execute(f"DELETE FROM {table_name[0]}")
        session.commit()


if __name__ == "__main__":
    dearhived()
