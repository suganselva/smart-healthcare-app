import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'healthcare.db')

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('ALTER TABLE medical_records ADD COLUMN prescription TEXT')
    conn.commit()
    print("Successfully added prescription column to medical_records table.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("Column already exists.")
    else:
        print(f"Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
