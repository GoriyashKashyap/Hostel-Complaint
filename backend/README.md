
# Smart Hostel Issue Reporting System - Backend

This is the backend API for the Smart Hostel Issue Reporting System, built with FastAPI and Supabase.

## Features

- User Authentication (Supabase Auth)
- Role-based Access Control (Student vs Admin)
- Complaint Management (Create, Read, Update)
- Mock ML Service for Category & Urgency Prediction

## Setup

1. **Clone the repository**

2. **Install Dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Environment Variables**
   Copy `.env.example` to `.env` and update settings:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Update `SECRET_KEY`, `DATABASE_URL`, and `BACKEND_CORS_ORIGINS` (include your frontend URL).

4. **Database Setup**
   If you are using Supabase/Postgres, run the SQL commands in `backend/schema.sql` to set up the tables and security policies.

## Running the App

```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`.
Documentation is available at `http://localhost:8000/docs`.

## API Endpoints

- `POST /api/v1/complaints/`: Create a new complaint (Student)
- `GET /api/v1/complaints/me`: Get my complaints (Student)
- `GET /api/v1/complaints/`: Get all complaints (Admin) - Supports filtering
- `PATCH /api/v1/complaints/{id}`: Update complaint status (Admin)
- `GET /api/v1/users/me`: Get current user info
