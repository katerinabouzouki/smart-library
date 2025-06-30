import React, { useEffect, useState } from 'react';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (books.length === 0) return <p>No books found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📚 Book List</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Author ID</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.bookID}>
              <td>{book.bookID}</td>
              <td>{book.title}</td>
              <td>{book.genre}</td>
              <td>{book.yearPublished}</td>
              <td>{book.authorID}</td>
              <td>{book.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;