import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Test login
print("Testing login...")
login_response = requests.post(
    f"{BASE_URL}/users/login",
    json={"email": "student@hostel.com", "password": "student123"}
)

print(f"Login status: {login_response.status_code}")
print(f"Login response: {login_response.json()}")

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"\nToken: {token[:50]}...")
    
    # Test getting current user
    print("\nTesting /users/me with token...")
    headers = {"Authorization": f"Bearer {token}"}
    user_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
    
    print(f"User endpoint status: {user_response.status_code}")
    print(f"User response: {user_response.json()}")
else:
    print("Login failed!")
