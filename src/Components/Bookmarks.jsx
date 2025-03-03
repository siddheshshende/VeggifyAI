import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    category: '',
  });

  useEffect(() => {
    // Fetch bookmarks data when the component mounts
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('/api/bookmarks');
        setBookmarks(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, []);

  const addBookmark = () => {
    // Add a new bookmark
    axios.post('/api/bookmarks', newBookmark)
      .then(() => {
        setBookmarks([...bookmarks, { id: response.data.id, ...newBookmark }]);
        setNewBookmark({
          title: '',
          url: '',
          category: '',
        });
      })
      .catch((error) => {
        console.error('Error adding bookmark:', error);
      });
  };

  const deleteBookmark = (id) => {
    // Delete a bookmark
    axios.delete(`/api/bookmarks/${id}`)
      .then(() => {
        setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting bookmark:', error);
      });
  };

  return (
    <div className="bookmarks-page">
      <h1>Bookmarks</h1>
      <input
        type="text"
        placeholder="Bookmark Title"
        value={newBookmark.title}
        onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="URL"
        value={newBookmark.url}
        onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        value={newBookmark.category}
        onChange={(e) => setNewBookmark({ ...newBookmark, category: e.target.value })}
      />
      <button onClick={addBookmark}>Add Bookmark</button>
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <a href={bookmark.url} target="_blank">{bookmark.title}</a>
            <p>Category: {bookmark.category}</p>
            <button onClick={() => deleteBookmark(bookmark.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookmarks;
