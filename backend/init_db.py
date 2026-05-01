"""
Database initialization script.
Run this to create tables and add sample data.
"""
from backend.db.database import engine, SessionLocal
from backend.db.models import Base, User, Complaint
from backend.core.auth import get_password_hash

def init_db():
    """Create all tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully!")

def seed_data():
    """Add sample users for testing."""
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already has users. Skipping seed data.")
            return
        
        # Create admin user
        admin = User(
            email="admin@hostel.com",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
        
        # Create student user
        student = User(
            email="student@hostel.com",
            hashed_password=get_password_hash("student123"),
            role="student"
        )
        db.add(student)
        
        db.commit()
        print("✓ Sample users created:")
        print("  Admin: admin@hostel.com / admin123")
        print("  Student: student@hostel.com / student123")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    seed_data()
    print("\n✓ Database initialization complete!")
