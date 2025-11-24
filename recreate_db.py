import pyodbc

# Connect to master database
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 18 for SQL Server};'
    'SERVER=192.168.1.201;'
    'DATABASE=master;'
    'UID=minnal_admin;'
    'PWD=Minn@l!@#$5;'
    'TrustServerCertificate=yes'
)
conn.autocommit = True
cursor = conn.cursor()

try:
    # Drop database if exists
    cursor.execute("DROP DATABASE IF EXISTS IE_LOGS_DJANGO")
    print('Old database dropped')
    
    # Create fresh database
    cursor.execute("CREATE DATABASE IE_LOGS_DJANGO")
    print('Fresh database IE_LOGS_DJANGO created successfully')
except Exception as e:
    print(f'Error: {e}')
finally:
    cursor.close()
    conn.close()
