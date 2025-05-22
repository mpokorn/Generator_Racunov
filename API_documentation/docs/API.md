# 📘 API Documentation

---

## POST /api/invoices

Creates a new invoice. The request body must be in JSON format and follow this structure:

### Example Request Body

```json
{
  "invoice_number": "string",
  "customer_name": "string",
  "total": 0,
  "items": [
    {
      "description": "string",
      "quantity": 0,
      "unit_price": 0,
      "tax_rate": 0
    }
  ],
  "issuer": {
    "name": "string",
    "address": "string",
    "postal_code": "string",
    "city": "string",
    "country": "string",
    "email": "user@example.com",
    "phone": "string"
  },
  "receiver": {
    "name": "string",
    "address": "string",
    "postal_code": "string",
    "city": "string",
    "country": "string",
    "email": "user@example.com",
    "phone": "string"
  },
  "issue_date": "string",
  "due_date": "string",
  "currency": "string",
  "bank_name": "string",
  "bank_account_name": "string",
  "bank_account_number": "string",
  "reference": "string",
  "notes": "string",
  "payment_terms": "string",
  "discount_percent": 0,
  "shipping": 0
}
```

---

## GET /api/invoices/{invoice_id}/pdf

Returns the PDF version of the selected invoice.

### 🔸 Path Parameter

```json
{
  "invoice_id": 1
}
```

### 🔸 Successful Response (200 OK)

Returns a PDF file.  
Content-Type: `application/pdf`

### Validation Error (422)

Returned if `invoice_id` is missing or not a valid integer:

```json
{
  "detail": [
    {
      "loc": ["path", "invoice_id"],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}
```

---

## GET /api/invoices/{invoice_id}/html

Returns an HTML-rendered page of the selected invoice. This is meant for browser display.

### Path Parameter

```json
{
  "invoice_id": 1
}
```

### Successful Response (200 OK)

Returns an HTML page.  
Content-Type: `text/html`

### Validation Error (422)

Returned if `invoice_id` is missing or not a valid integer:

```json
{
  "detail": [
    {
      "loc": ["path", "invoice_id"],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}
```