#!/usr/bin/env python3
"""Test all IE LOGS functionalities"""
import requests

def test_admin_login_logout():
    print("=" * 60)
    print("TEST 1: ADMIN LOGIN & LOGOUT")
    print("=" * 60)
    
    session = requests.Session()
    
    # Test login
    print("\n[1] Testing admin login...")
    response = session.post("http://192.168.0.223:8080/api/auth/login/", 
                            json={"username": "admin", "password": "admin123"})
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   User: {data['user']['username']}")
        print(f"   Email: {data['user']['email']}")
        print("   ✓ Login successful!")
        
        # Test /me endpoint
        print("\n[2] Testing /api/auth/me/ endpoint...")
        me_response = session.get("http://192.168.0.223:8080/api/auth/me/")
        print(f"   Status: {me_response.status_code}")
        if me_response.status_code == 200:
            print("   ✓ Session is working!")
        else:
            print("   ✗ Session failed!")
        
        # Test logout
        print("\n[3] Testing logout...")
        csrf_token = session.cookies.get("csrftoken", "")
        logout_response = session.post("http://192.168.0.223:8080/api/auth/logout/",
                                       headers={"X-CSRFToken": csrf_token})
        print(f"   Status: {logout_response.status_code}")
        if logout_response.status_code == 200:
            print("   ✓ Logout successful!")
        else:
            print(f"   ✗ Logout failed: {logout_response.text}")
        
        # Verify session is gone
        print("\n[4] Verifying session is cleared...")
        me_after = session.get("http://192.168.0.223:8080/api/auth/me/")
        print(f"   Status: {me_after.status_code}")
        if me_after.status_code in [403, 401]:
            print("   ✓ Session cleared correctly!")
        else:
            print("   ✗ Session still active!")
    else:
        print(f"   ✗ Login failed: {response.text}")
    
    print("\n" + "=" * 60)

def test_normal_user_login():
    print("\nTEST 2: NORMAL USER LOGIN (john.doe)")
    print("=" * 60)
    
    session = requests.Session()
    
    print("\n[1] Testing normal user login...")
    response = session.post("http://192.168.0.223:8080/api/auth/login/", 
                            json={"username": "john.doe", "password": "password123"})
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   User: {data['user']['username']}")
        print(f"   Role: {data['user']['role']}")
        print(f"   Team: {data['user']['team']}")
        print("   ✓ Login successful!")
    else:
        print(f"   ✗ Login failed: {response.text}")
    
    print("\n" + "=" * 60)

def test_team_lead_login():
    print("\nTEST 3: TEAM LEAD LOGIN (jane.smith)")
    print("=" * 60)
    
    session = requests.Session()
    
    print("\n[1] Testing team lead login...")
    response = session.post("http://192.168.0.223:8080/api/auth/login/", 
                            json={"username": "jane.smith", "password": "password123"})
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   User: {data['user']['username']}")
        print(f"   Role: {data['user']['role']}")
        print(f"   Team: {data['user']['team']}")
        print("   ✓ Login successful!")
    else:
        print(f"   ✗ Login failed: {response.text}")
    
    print("\n" + "=" * 60)

def test_api_endpoints():
    print("\nTEST 4: API ENDPOINTS")
    print("=" * 60)
    
    session = requests.Session()
    
    # Login first
    session.post("http://192.168.0.223:8080/api/auth/login/", 
                json={"username": "admin", "password": "admin123"})
    
    # Test lookup data
    print("\n[1] Testing /api/lookup-data/ endpoint...")
    response = session.get("http://192.168.0.223:8080/api/lookup-data/")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✓ Lookup data endpoint working!")
    else:
        print("   ✗ Lookup data endpoint failed!")
    
    # Test my projects
    print("\n[2] Testing /api/get-logs/ endpoint...")
    response = session.get("http://192.168.0.223:8080/api/get-logs/")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Projects count: {data.get('count', 0)}")
        print("   ✓ My projects endpoint working!")
    else:
        print("   ✗ My projects endpoint failed!")
    
    # Test team projects
    print("\n[3] Testing /api/get-team-projects/ endpoint...")
    response = session.get("http://192.168.0.223:8080/api/get-team-projects/")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Projects count: {data.get('count', 0)}")
        print("   ✓ Team projects endpoint working!")
    else:
        print("   ✗ Team projects endpoint failed!")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    print("\n")
    print("*" * 60)
    print("*" + " " * 58 + "*")
    print("*" + "  IE LOGS - COMPREHENSIVE FUNCTIONALITY TEST".center(58) + "*")
    print("*" + " " * 58 + "*")
    print("*" * 60)
    print("\n")
    
    test_admin_login_logout()
    test_normal_user_login()
    test_team_lead_login()
    test_api_endpoints()
    
    print("\n")
    print("*" * 60)
    print("*" + " " * 58 + "*")
    print("*" + "  ALL TESTS COMPLETED".center(58) + "*")
    print("*" + " " * 58 + "*")
    print("*" * 60)
    print("\n")
