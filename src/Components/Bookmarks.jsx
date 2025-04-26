import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Bookmarks = ({ userId }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('/api/bookmarks', { params: { userId } });

        const bookmarkedRecipes = await Promise.all(
          response.data.map(async (bookmark) => {
            const recipeResponse = await axios.get(`/api/recipes/${bookmark.recipeId}`);
            return { id: bookmark.recipeId, content: recipeResponse.data.content };
          })
        );

        setBookmarks(bookmarkedRecipes);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, [userId]);

  const deleteBookmark = async (id) => {
    try {
      await axios.delete(`/api/bookmarks/${id}`);
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <div className="bookmarks-page">
      <h1>Bookmarked Recipes</h1>
      {bookmarks.length === 0 ? <p>No bookmarks yet.</p> : (
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="recipe-card">
              <div dangerouslySetInnerHTML={{ __html: bookmark.content }} />
              <button onClick={() => deleteBookmark(bookmark.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmarks;
