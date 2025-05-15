from fastapi import APIRouter, Depends, status, Request
from fastapi.responses import Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

from database import get_db
from models import Invoice, InvoiceItem
from schemas import InvoiceCreate, InvoiceOut, PartyInfo

router = APIRouter(prefix="/invoices", tags=["Invoices"])
templates = Jinja2Templates(directory="templates")

@router.options("/", include_in_schema=False)
async def options_handler():
    return Response(status_code=200)

@router.api_route("/", methods=["POST", "OPTIONS"], response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
@router.api_route("", methods=["POST", "OPTIONS"], response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
async def create_invoice(invoice: InvoiceCreate, db: AsyncSession = Depends(get_db)):
    discount = invoice.discount_percent or 0.0
    shipping = invoice.shipping or 0.0

    # Izračuni
    subtotal = 0.0
    total_tax = 0.0
    for item in invoice.items:
        line_total_with_tax = item.quantity * item.unit_price
        line_total_without_tax = line_total_with_tax / (1 + item.tax_rate / 100)
        line_tax = line_total_with_tax - line_total_without_tax
        subtotal += line_total_without_tax
        total_tax += line_tax

    discount_amount = subtotal * (discount / 100)
    total = subtotal - discount_amount + total_tax + shipping

    new_invoice = Invoice(
        customer_name=invoice.customer_name,
        invoice_number=invoice.invoice_number,
        total=total,
        sender_name=invoice.issuer.name,
        sender_address=invoice.issuer.address,
        sender_postal_code=invoice.issuer.postal_code,
        sender_city=invoice.issuer.city,
        sender_country=invoice.issuer.country,
        sender_email=invoice.issuer.email,
        sender_phone=invoice.issuer.phone,
        recipient_name=invoice.receiver.name,
        recipient_address=invoice.receiver.address,
        recipient_postal_code=invoice.receiver.postal_code,
        recipient_city=invoice.receiver.city,
        recipient_country=invoice.receiver.country,
        recipient_email=invoice.receiver.email,
        recipient_phone=invoice.receiver.phone,
        issue_date=invoice.issue_date,
        due_date=invoice.due_date,
        currency=invoice.currency,
        bank_name=invoice.bank_name,
        bank_account_name=invoice.bank_account_name,
        bank_account_number=invoice.bank_account_number,
        reference=invoice.reference,
        notes=invoice.notes,
        payment_terms=invoice.payment_terms,
        discount_percent=discount,
        shipping=shipping
    )
    db.add(new_invoice)
    await db.flush()

    for item in invoice.items:
        db.add(InvoiceItem(
            invoice_id=new_invoice.id,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            tax_rate=item.tax_rate
        ))

    await db.commit()

    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == new_invoice.id)
    )
    full_invoice = result.scalar_one()

    return InvoiceOut(
        id=full_invoice.id,
        customer_name=full_invoice.customer_name,
        total=full_invoice.total,
        items=full_invoice.items,
        issuer=PartyInfo(
            name=full_invoice.sender_name,
            address=full_invoice.sender_address,
            postal_code=full_invoice.sender_postal_code,
            city=full_invoice.sender_city,
            country=full_invoice.sender_country,
            email=full_invoice.sender_email,
            phone=full_invoice.sender_phone
        ),
        receiver=PartyInfo(
            name=full_invoice.recipient_name,
            address=full_invoice.recipient_address,
            postal_code=full_invoice.recipient_postal_code,
            city=full_invoice.recipient_city,
            country=full_invoice.recipient_country,
            email=full_invoice.recipient_email,
            phone=full_invoice.recipient_phone
        ),
        issue_date=full_invoice.issue_date,
        due_date=full_invoice.due_date,
        currency=full_invoice.currency,
        bank_name=full_invoice.bank_name,
        bank_account_name=full_invoice.bank_account_name,
        bank_account_number=full_invoice.bank_account_number,
        reference=full_invoice.reference,
        notes=full_invoice.notes,
        payment_terms=full_invoice.payment_terms,
        discount_percent=full_invoice.discount_percent,
        shipping=full_invoice.shipping
    )

@router.get("/", response_model=list[InvoiceOut])
async def list_invoices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items))
    )
    invoices = result.scalars().all()
    return [
        InvoiceOut(
            id=inv.id,
            customer_name=inv.customer_name,
            total=inv.total,
            items=inv.items,
            issuer=PartyInfo(
                name=inv.sender_name,
                address=inv.sender_address,
                postal_code=inv.sender_postal_code,
                city=inv.sender_city,
                country=inv.sender_country,
                email=inv.sender_email,
                phone=inv.sender_phone
            ),
            receiver=PartyInfo(
                name=inv.recipient_name,
                address=inv.recipient_address,
                postal_code=inv.recipient_postal_code,
                city=inv.recipient_city,
                country=inv.recipient_country,
                email=inv.recipient_email,
                phone=inv.recipient_phone
            ),
            issue_date=inv.issue_date,
            due_date=inv.due_date,
            currency=inv.currency,
            bank_name=inv.bank_name,
            bank_account_name=inv.bank_account_name,
            bank_account_number=inv.bank_account_number,
            reference=inv.reference,
            notes=inv.notes,
            payment_terms=inv.payment_terms,
            discount_percent=inv.discount_percent,
            shipping=inv.shipping
        ) for inv in invoices
    ]

@router.get("/{invoice_id}/pdf")
async def get_invoice_pdf(invoice_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        return Response(status_code=404)

    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template("invoice1.html")
    html_out = template.render(invoice=invoice)

    pdf = HTML(string=html_out).write_pdf()

    return Response(content=pdf, media_type="application/pdf", headers={
        "Content-Disposition": f"inline; filename=invoice_{invoice_id}.pdf"
    })

@router.get("/{invoice_id}/html")
async def view_invoice_html(invoice_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        return Response(status_code=404)
    return templates.TemplateResponse("invoice_view.html", {"request": request, "invoice": invoice})
