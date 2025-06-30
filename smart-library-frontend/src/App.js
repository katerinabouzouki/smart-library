import React from 'react';
import './css/global.css';
import AddBookForm from './AddBookForm';
import BookList from './BookList';
import SearchBooks from './SearchBooks';
import UserList from './UserList';
import Borrowings from './Borrowings';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container">
      <h1>📖 Smart Library</h1>
      <SearchBooks />
      <AddBookForm />
      <BookList />
      <UserList />
      <Borrowings />
    </div>
  );
}

export default App;