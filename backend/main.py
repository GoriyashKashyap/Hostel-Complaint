import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.api.routers import complaints, users, settings as settings_router

try:
    import psycopg2
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

# Load environment variables
load_dotenv()

def test_postgres_connection():
    """
    Test direct PostgreSQL connection if credentials are provided.
    This is optional and used for verification.
    """
    if not PSYCOPG2_AVAILABLE:
        print("Direct Postgres connection skipped (psycopg2 not installed).")
        return

    try:
        # Pydantic settings are preferred, but we support loose env vars for this check
        user = os.getenv("user") or os.getenv("DB_USER")
        password = os.getenv("password") or os.getenv("DB_PASSWORD")
        host = os.getenv("host") or os.getenv("DB_HOST")
        port = os.getenv("port") or os.getenv("DB_PORT")
        dbname = os.getenv("dbname") or os.getenv("DB_NAME")
        
        if not all([user, password, host, port, dbname]):
            print("Direct Postgres connection skipped (missing env vars).")
            return

        connection = psycopg2.connect(
            user=user,
            password=password,
            host=host,
            port=port,
            dbname=dbname
        )
        print("Direct Postgres Connection successful!")
        
        cursor = connection.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        print("Database Time:", result)
        
        cursor.close()
        connection.close()
        print("Direct Postgres Connection closed.")
    except Exception as e:
        print(f"Direct Postgres Connection failed: {e}")

# Run the connection test on import (or startup)
test_postgres_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.[0-9]+\.[0-9]+|10\.[0-9]+\.[0-9]+\.[0-9]+)(:[0-9]+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(complaints.router, prefix=f"{settings.API_V1_STR}/complaints", tags=["complaints"])
app.include_router(settings_router.router, prefix=f"{settings.API_V1_STR}/settings", tags=["settings"])

@app.get("/")
def root():
    return {"message": "Welcome to Smart Hostel Issue Reporting System API"}