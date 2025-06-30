import React, { useState } from 'react';

function AddBookForm() {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    yearPublished: '',
    authorID: '',
    author: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    fetch('http://localhost:5000/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: formData.title,
        genre: formData.genre,
        year_published: formData.yearPublished,
        author_id: formData.authorID,
        author: formData.author
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Σφάλμα κατά την προσθήκη');
        return res.json();
      })
      .then(data => {
        setMessage('📚 Το βιβλίο προστέθηκε με επιτυχία!');
        setFormData({ title: '', genre: '', yearPublished: '', authorID: '', author: '' });
      })
      .catch(err => {
        setMessage(`❌ Σφάλμα: ${err.message}`);
      });
  };

  return (
    <div style={{ padding: '2rem', marginBottom: '2rem', borderBottom: '1px solid #ccc' }}>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Genre: </label>
          <input name="genre" value={formData.genre} onChange={handleChange} required />
        </div>
        <div>
          <label>Published Year: </label>
          <input name="yearPublished" type="number" value={formData.yearPublished} onChange={handleChange} />
        </div>
        <div>
          <label>Author ID: </label>
          <input name="authorID" type="number" value={formData.authorID} onChange={handleChange} required />
        </div>
        <div>
          <label>Author: </label>
          <input name="author"  value={formData.author} onChange={handleChange} required />
        </div>
        <button type="submit">📥 Submit</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default AddBookForm;