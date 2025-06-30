import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Kate1234_.",
    database="library_system"
)
cursor = conn.cursor()
# Foreign key checks deactivation
cursor.execute("SET FOREIGN_KEY_CHECKS=0;")

cursor.execute("TRUNCATE TABLE borrowings;")  # first dependent tables
cursor.execute("TRUNCATE TABLE users;")       # second table users

# Foreign key checks activation
cursor.execute("SET FOREIGN_KEY_CHECKS=1;")

conn.commit()

users = [
    ('user1', 'John Murphy', 'john@example.com'),
    ('user2', 'Sandra Hauge', 'sandra@example.com'),
    ('user3', 'Jerry Martin', 'jerry@example.com')
]

for user in users:
    cursor.execute("""
        INSERT INTO users (userID, name, email)
        VALUES (%s, %s, %s)
    """, user)

conn.commit()
cursor.close()
conn.close()

print("Users added successfully!")