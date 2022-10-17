from typing import AsyncGenerator, Generator

from sqlalchemy import event
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm.query import Query

from app.db import SessionLocal, async_session_maker


def get_db() -> Generator:
    db = None
    try:
        db = SessionLocal(future=True)
        yield db
    finally:
        if db is not None:
            db.close()


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:

        @event.listens_for(Query, "before_compile", retval=True)
        def no_deleted(query):
            for desc in query.column_descriptions:
                entity = desc["entity"]
                if entity:
                    query = query.filter(entity.name != "admin")
            return query

        yield session
        await session.close()
