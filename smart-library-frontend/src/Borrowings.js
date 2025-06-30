import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ userID: '', bookID: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBorrowings();
    fetchUsers();
    fetchBooks();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/borrowings');
      setBorrowings(res.data);
    } catch (err) {
      console.error('Error fetching borrowings:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/borrow', form);
      setForm({ userID: '', bookID: '' });
      fetchBorrowings();
    } catch (err) {
      console.error('Error borrowing:', err);
      setError('Failed to borrow. Please check the IDs or availability.');
    }
  };

  const handleReturn = async (borrowID) => {
    try {
      await axios.put(`http://localhost:5000/return/${borrowID}`);
      fetchBorrowings();
    } catch (err) {
      console.error('Error returning:', err);
    }
  };

  return (
    <div className="mb-4">
      <h2>📚 Borrowings Management</h2>
      <form className="form-inline mb-3" onSubmit={handleBorrow}>
        <div className="form-group mr-2">
          <select
            name="userID"
            value={form.userID}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">-- Select User --</option>
            {users.map(u => (
              <option key={u.userID} value={u.userID}>
                {u.name} ({u.userID})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mr-2">
          <select
            name="bookID"
            value={form.bookID}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">-- Select Book --</option>
            {books.map(b => (
              <option key={b.bookID} value={b.bookID}>
                {b.title} ({b.bookID})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Borrow
        </button>
      </form>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {borrowings.map(b => (
          <li key={b.borrowID} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>ID {b.borrowID}</strong> — User: {b.userID} — Book: {b.bookID} — Date: {b.borrowDate}
              {b.returnDate && <span className="badge badge-success ml-2">Returned: {b.returnDate}</span>}
            </div>
            {!b.returnDate && (
              <button className="btn btn-success btn-sm" onClick={() => handleReturn(b.borrowID)}>
                Return
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Borrowings;