import pyodbc

# Connect to master database to create new database
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

# Check if database exists
cursor.execute("SELECT name FROM sys.databases WHERE name = 'IE_LOGS_DJANGO'")
if cursor.fetchone():
    print('Database IE_LOGS_DJANGO already exists')
else:
    # Create database
    cursor.execute("CREATE DATABASE IE_LOGS_DJANGO")
    print('Database IE_LOGS_DJANGO created successfully')

cursor.close()
conn.close()
