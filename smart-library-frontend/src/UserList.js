import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ userID: '', name: '', email: '' });
  const [editingUserID, setEditingUserID] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Σφάλμα φόρτωσης χρηστών:', err);
      setError('Αποτυχία φόρτωσης χρηστών');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserID) {
        await axios.put(`http://localhost:5000/users/${editingUserID}`, form);
      } else {
        await axios.post('http://localhost:5000/users', form);
      }
      setForm({ userID: '', name: '', email: '' });
      setEditingUserID(null);
      fetchUsers();
    } catch (err) {
      console.error('Σφάλμα:', err);
      setError(err.response?.data?.error || 'Αποτυχία αποθήκευσης');
    }
  };

  const handleEdit = (user) => {
    setForm({
      userID: user.userID,
      name: user.name,
      email: user.email
    });
    setEditingUserID(user.userID);
  };

  const handleDelete = async (userID) => {
    if (!window.confirm('Είσαι σίγουρος ότι θες να διαγράψεις τον χρήστη;')) return;
    try {
      await axios.delete(`http://localhost:5000/users/${userID}`);
      fetchUsers();
    } catch (err) {
      console.error('Σφάλμα διαγραφής:', err);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>👤 Users Mangement</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          name="userID"
          placeholder="ID"
          value={form.userID}
          onChange={handleChange}
          disabled={!!editingUserID}
        />
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit">{editingUserID ? 'Storage' : 'Submit'}</button>
        {editingUserID && (
          <button type="button" onClick={() => {
            setForm({ userID: '', name: '', email: '' });
            setEditingUserID(null);
          }}>
            Ακύρωση
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {users.map(user => (
          <li key={user.userID}>
            <strong>{user.name}</strong> ({user.email}) — ID: {user.userID}
            <button onClick={() => handleEdit(user)} style={{ marginLeft: '1rem' }}>✏️</button>
            <button onClick={() => handleDelete(user.userID)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;