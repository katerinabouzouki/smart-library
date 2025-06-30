from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import date
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Login settings for MySQL
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

@app.route('/books', methods=['GET'])
def get_books():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM books")
    rows = cur.fetchall()
    print("Books:", rows) 
    books = []
    for row in rows:
        books.append({
            'bookID': row[0],
            'title': row[1],
            'genre': row[2],
            'yearPublished': row[3],
            'authorID': row[4],
            'author': row[5]
        })
    return jsonify(books)

@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    title = data.get('title')
    genre = data.get('genre')
    year = data.get('yearPublished')
    authorID = data.get('authorID')
    author = data.get('author')

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO books (title, genre, yearPublished, authorID, author) VALUES (%s, %s, %s, %s, %s)",
        (title, genre, year, authorID, author)
    )
    mysql.connection.commit()
    return jsonify({'message': 'Book added successfully!'}), 201

@app.route('/users', methods=['GET'])
def get_users():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users")
    rows = cur.fetchall()
    users = []
    for row in rows:
        users.append({
            'userID': row[0],
            'name': row[1],
            'email': row[2],
            'registrationDate': row[3].isoformat()
        })
    return jsonify(users)


@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    userID = data.get('userID')
    name = data.get('name')
    email = data.get('email')

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE userID=%s OR email=%s", (userID, email))
    existing = cur.fetchone()
    if existing:
        return jsonify({'error': 'UserID or email already exists'}), 400
    
    cur.execute("INSERT INTO users (userID, name, email) VALUES (%s, %s, %s)", (userID, name, email))
    mysql.connection.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/users/<userID>', methods=['PUT'])
def update_user(userID):
    data = request.json
    name = data.get('name')
    email = data.get('email')

    cur = mysql.connection.cursor()
    cur.execute("UPDATE users SET name=%s, email=%s WHERE userID=%s", (name, email, userID))
    mysql.connection.commit()
    return jsonify({'message': 'User updated successfully'})

@app.route('/users/<userID>', methods=['DELETE'])
def delete_user(userID):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM users WHERE userID=%s", (userID,))
    mysql.connection.commit()
    return jsonify({'message': 'User deleted successfully'})

@app.route('/borrow', methods=['POST'])
def borrow_book():
    data = request.json
    userID = data.get('userID')
    bookID = data.get('bookID')
    borrowDate = data.get('borrowDate') or date.today().isoformat()

    cur = mysql.connection.cursor()
    try:
        cur.execute("""
            INSERT INTO borrowings (userID, bookID, borrowDate)
            VALUES (%s, %s, %s)
        """, (userID, bookID, borrowDate))
        mysql.connection.commit()
        return jsonify({'message': 'Book borrowed successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/borrowings', methods=['GET'])
def get_borrowings():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT borrowID, userID, bookID, borrowDate, returnDate FROM borrowings
    """)
    rows = cur.fetchall()
    result = []
    for row in rows:
        result.append({
            'borrowID': row[0],
            'userID': row[1],
            'bookID': row[2],
            'borrowDate': row[3].isoformat(),
            'returnDate': row[4].isoformat() if row[4] else None
        })
    return jsonify(result)

@app.route('/return/<int:borrowID>', methods=['PUT'])
def return_book(borrowID):
    return_date = date.today().isoformat()

    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE borrowings
        SET returnDate = %s
        WHERE borrowID = %s
    """, (return_date, borrowID))
    mysql.connection.commit()
    return jsonify({'message': 'Book returned successfully'})

@app.route('/search', methods=['GET'])
def search_books():
    query = request.args.get('query', '')
    cur = mysql.connection.cursor()
    
    sql = """
        SELECT b.bookID, b.title, b.genre, b.yearPublished, b.authorID, a.name AS author
        FROM books b
        JOIN authors a ON b.authorID = a.authorID
        WHERE b.title LIKE %s OR a.name LIKE %s OR b.genre LIKE %s
    """
    like_query = f"%{query}%"
    cur.execute(sql, (like_query, like_query, like_query))
    rows = cur.fetchall()
    
    books = []
    for row in rows:
        books.append({
            'bookID': row[0],
            'title': row[1],
            'genre': row[2],
            'yearPublished': row[3],
            'authorID': row[4],
            'author': row[5]
        })
    
    return jsonify(books)

if __name__ == '__main__':
    app.run(debug=True)