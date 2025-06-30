# Smart Library

A minimal library management system built with:

- React (frontend)
- Flask (backend)
- MySQL (database)

## Features

- Search books by title, author or genre
- Add new books
- Manage users
- Handle borrowings and returns

## Import the database using:
CREATE DATABASE library_system;

CREATE TABLE authors (
	  authorID INT,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    PRIMARY KEY (authorID)
);

CREATE TABLE books (
	  bookID INT,
    title VARCHAR(255),
    author VARCHAR(255),
    genre VARCHAR(100),
    yearPublished INT,
    authorID INT,
    FOREIGN KEY (authorID) REFERENCES authors(authorID),
    PRIMARY KEY (bookID)
);

CREATE TABLE users (
	  userID VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    registrationDate DATE DEFAULT (CURRENT_DATE),
    PRIMARY KEY (userID)
);

CREATE TABLE borrowings (
	  borrowID INT,
    userID VARCHAR(100),
    bookID INT,
    borrowDate DATE DEFAULT (CURRENT_DATE),
    returnDate DATE,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (bookID) REFERENCES books(bookID),
    CONSTRAINT uniqueBorrow UNIQUE(userID, bookID, borrowDate)
);

INSERT INTO users (userID, name, email, registrationDate)
VALUES 
('user1', 'John Murphy', 'john@example.com', '2025-06-28'),
('user2', 'Sandra Hauge', 'sandra@example.com', '2025-06-28'),
('user3', 'Jerry Martin', 'jerry@example.com', '2025-06-28');

In your terminal, run:
mysql -u root -p library_system < database/library_system.sql

### Backend (Flask)

In your terminal, run:
cd smart-library-backend
python app.py

### Frontend (React)
In your terminal, run:
cd smart-library-frontend
npm install
npm start


