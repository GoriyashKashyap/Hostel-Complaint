"""
Database initialization script - simplified version.
Run this to create tables and add sample data.
"""
import sys
import os
import sqlite3
from datetime import datetime

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def init_db():
    """Create database and tables."""
    db_path = "backend/hostel_issues.db"
    
    print("Creating database and tables...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            role TEXT DEFAULT 'student',
            full_name TEXT,
            semester TEXT,
            branch TEXT,
            phone TEXT,
            hostel TEXT,
            room TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create complaints table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            hostel TEXT NOT NULL,
            block TEXT,
            category TEXT,
            status TEXT DEFAULT 'Pending',
            urgency_score INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    conn.commit()
    print("✓ Tables created successfully!")

    # Add missing columns if the database already exists
    cursor.execute("PRAGMA table_info(users)")
    existing_columns = {row[1] for row in cursor.fetchall()}
    new_columns = {
        "full_name": "TEXT",
        "semester": "TEXT",
        "branch": "TEXT",
        "phone": "TEXT",
        "hostel": "TEXT",
        "room": "TEXT",
    }
    for column_name, column_type in new_columns.items():
        if column_name not in existing_columns:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")
    
    # Check if users exist
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    
    if count > 0:
        print(f"Database already has {count} users.")
    else:
        # Import bcrypt for password hashing
        try:
            import bcrypt
            
            # Create admin user
            admin_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute(
                "INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)",
                ("admin@hostel.com", admin_password, "admin")
            )
            
            # Create student user
            student_password = bcrypt.hashpw("student123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute(
                "INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)",
                ("student@hostel.com", student_password, "student")
            )
            
            conn.commit()
            print("✓ Sample users created:")
            print("  Admin: admin@hostel.com / admin123")
            print("  Student: student@hostel.com / student123")
            
        except Exception as e:
            print(f"Error creating users: {e}")
            conn.rollback()
    
    conn.close()
    print("\n✓ Database initialization complete!")

if __name__ == "__main__":
    init_db()
