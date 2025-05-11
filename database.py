from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite+aiosqlite:///invoices.db"

engine = create_async_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

from sqlalchemy import inspect

async def init_db(drop_all: bool = False):
    from models import Invoice, InvoiceItem  # mora biti ZNOTRAJ funkcije

    async with engine.begin() as conn:
        if drop_all:
            await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    print("📋 Registrirane tabele:", Base.metadata.tables.keys())



async def get_db():
    async with SessionLocal() as session:
        yield session
