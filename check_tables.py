import pyodbc

conn = pyodbc.connect(
    'DRIVER={ODBC Driver 18 for SQL Server};'
    'SERVER=192.168.1.201;'
    'DATABASE=IE_LOGS_DB;'
    'UID=minnal_admin;'
    'PWD=Minn@l!@#$5;'
    'TrustServerCertificate=yes'
)

cursor = conn.cursor()
cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'")
tables = [row[0] for row in cursor.fetchall()]
print('Existing tables:')
for table in tables:
    print(f'  - {table}')
