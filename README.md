# Generator_Racunov

This project provides a web-based invoice generator with API endpoints for creating and rendering invoices as HTML or PDF.

---

## Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/mpokorn/Generator_Racunov.git
cd Generator_Racunov
```

### 2. Start the Application with Docker Compose

```bash
docker-compose up --build
```

This will build and launch both the backend (FastAPI) and frontend (React with NGINX) services.

---

## Access the Application

- API Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Frontend: [http://localhost](http://localhost)

Make sure Docker is installed and running before executing the commands above.

---

## API Documentation

See [`API_documentation.md`](API.md) for detailed info about each available endpoint.