import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchBooks() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setError('');
    }
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error while searching", err);
      setError('An error occurred. Please check the connection to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          placeholder="Search by title, author or genre..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Search</button>
      </form>

      {loading && <p>🔎 Search...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && query && results.length === 0 && (
        <p>No books found: <strong>{query}</strong></p>
      )}

      <ul>
        {results.map(book => (
          <li key={book.bookID}>
            <strong>{book.title}</strong> — {book.author} ({book.genre}, {book.yearPublished})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBooks;