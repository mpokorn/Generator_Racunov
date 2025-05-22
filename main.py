from fastapi import FastAPI
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import SessionLocal, init_db
from routers import invoices
from models import Invoice
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import asyncio
import os

# Inicialna aplikacija (brez versioninga)
app = FastAPI(title="Invoice Generator API")



# Templating za HTML render (HTML račun)
templates = Jinja2Templates(directory="templates")

# Router za vse API funkcije
app.include_router(invoices.router, prefix="/api")

# HTML pogled na račun (če se uporablja neposredno)
@app.get("/invoice/{invoice_id}", include_in_schema=True)
async def view_invoice(invoice_id: int, request):
    async with SessionLocal() as db:
        result = await db.execute(
            select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == invoice_id)
        )
        invoice = result.scalar_one_or_none()
        if not invoice:
            return FileResponse("static/notfound.html")
    return templates.TemplateResponse("invoice_view.html", {"request": request, "invoice": invoice})

# PDF izpis računa (za test brez verzioniranih poti)
@app.get("/invoice/{invoice_id}/pdf", include_in_schema=True)
async def get_invoice_pdf(invoice_id: int):
    async with SessionLocal() as db:
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

# Frontend: serviraj React build mapo
frontend_path = os.path.join(os.path.dirname(__file__), "frontend", "build")
#app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Inicializacija baze ob zagonu
print("Inicializacija baze...")

async def _init():
    await init_db()
    print("Baza ustvarjena.")

asyncio.create_task(_init())
