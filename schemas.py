from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date


class PartyInfo(BaseModel):
    name: str
    address: str
    postal_code: str
    city: str
    country: str
    #tax_number: Optional[str] = None
    #registration_number: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class InvoiceItemCreate(BaseModel):
    description: str
    quantity: int
    unit_price: float  # Cena z že vključenim davkom
    tax_rate: Optional[float] = 0  # V odstotkih, npr. 22.0 za 22%


class InvoiceItemOut(InvoiceItemCreate):
    id: int

    class Config:
        from_attributes = True


class InvoiceCreate(BaseModel):
    invoice_number: Optional[str] = None
    customer_name: str
    total: float
    items: List[InvoiceItemCreate]
    issuer: PartyInfo
    receiver: PartyInfo
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    currency: str = "EUR"

    bank_name: Optional[str] = None
    bank_account_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    reference: Optional[str] = None
    notes: Optional[str] = None
    payment_terms: Optional[str] = None

    discount_percent: Optional[float] = 0.0  # Popust na celotni znesek v %
    shipping: Optional[float] = 0.0  # Poštnina v EUR


class InvoiceOut(BaseModel):
    id: int
    invoice_number: Optional[str] = None
    customer_name: str
    total: float
    items: List[InvoiceItemOut]
    issuer: PartyInfo
    receiver: PartyInfo
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    currency: str = "EUR"

    bank_name: Optional[str] = None
    bank_account_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    reference: Optional[str] = None
    notes: Optional[str] = None
    payment_terms: Optional[str] = None

    discount_percent: Optional[float] = 0.0
    shipping: Optional[float] = 0.0

    class Config:
        from_attributes = True
