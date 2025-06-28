import mysql.connector
from datetime import date, timedelta

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Kate1234_.",
    database="library_system"
)
cursor = conn.cursor()

cursor.execute("SET FOREIGN_KEY_CHECKS=0;")

cursor.execute("TRUNCATE TABLE borrowings;")  # πρώτα οι εξαρτώμενοι πίνακες

# Ενεργοποίηση πάλι των foreign key checks
cursor.execute("SET FOREIGN_KEY_CHECKS=1;")

conn.commit()

borrowings = [
    (1, 'user1', 1, date.today() - timedelta(days=7), date.today() - timedelta(days=1)),
    (2, 'user2', 2, date.today() - timedelta(days=3), None),
    (3, 'user3', 3, date.today(), None)
]

for borrowing in borrowings:
    cursor.execute("""
        INSERT INTO borrowings (borrowID, userID, bookID, borrowDate, returnDate)
        VALUES (%s, %s, %s, %s, %s)
    """, borrowing)

conn.commit()
cursor.close()
conn.close()

print("Borrowings added successfully!")