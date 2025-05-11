from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    total = Column(Float, nullable=False)
    invoice_number = Column(String, nullable=True)

    sender_name = Column(String, nullable=False)
    sender_address = Column(String, nullable=False)
    sender_postal_code = Column(String, nullable=False)
    sender_city = Column(String, nullable=False)
    sender_country = Column(String, nullable=False)
    sender_email = Column(String, nullable=False)
    sender_phone = Column(String, nullable=False)

    recipient_name = Column(String, nullable=False)
    recipient_address = Column(String, nullable=False)
    recipient_postal_code = Column(String, nullable=False)
    recipient_city = Column(String, nullable=False)
    recipient_country = Column(String, nullable=False)
    recipient_email = Column(String, nullable=False)
    recipient_phone = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    issue_date = Column(Date, nullable=True)
    due_date = Column(Date, nullable=True)
    currency = Column(String, default="EUR", nullable=False)

    # Plačilni podatki
    bank_name = Column(String, nullable=True)
    bank_account_name = Column(String, nullable=True)
    bank_account_number = Column(String, nullable=True)
    reference = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    payment_terms = Column(String, nullable=True)

    # Popust in poštnina
    discount_percent = Column(Float, default=0.0)
    shipping = Column(Float, default=0.0)

    # Relacija s postavkami
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)

    description = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)  # Cena že vključuje DDV
    tax_rate = Column(Float, default=0.0)  # V odstotkih (npr. 22.0 za 22%)

    invoice = relationship("Invoice", back_populates="items")
