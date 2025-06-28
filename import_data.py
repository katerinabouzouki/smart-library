import csv
import mysql.connector

# Σύνδεση με τη βάση
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Kate1234_.",  # άλλαξέ το
    database="library_system",
    charset="utf8mb4"
)
cursor = conn.cursor()

cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
cursor.execute("TRUNCATE TABLE books;")
cursor.execute("TRUNCATE TABLE authors;")
cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
conn.commit()

# Ανάγνωση του books.csv
with open("books.csv", mode="r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    authors_set = {}
    author_id_counter = 1

    # Πρώτα περνάμε τους συγγραφείς
    for row in reader:
        author_name = row["authors"].strip()
        if author_name not in authors_set:
            authors_set[author_name] = author_id_counter
            cursor.execute("INSERT INTO authors (authorID, name) VALUES (%s, %s)", (author_id_counter, author_name))
            author_id_counter += 1

    conn.commit()

# Δεύτερη ανάγνωση για εισαγωγή βιβλίων
with open("books.csv", mode="r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    book_id_counter = 1
    for row in reader:
        title = row["title"]
        genre = row["categories"]
        yearPublished = int(row["published_year"]) if row["published_year"].isdigit() else None
        author = row["authors"].strip()
        authorID = authors_set[author]

        cursor.execute("""
            INSERT INTO books (bookID, title, genre, yearPublished, authorID, author)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (book_id_counter, title, genre, yearPublished, authorID, author))
        book_id_counter += 1

conn.commit()
cursor.close()
conn.close()

print("Η εισαγωγή ολοκληρώθηκε επιτυχώς!")