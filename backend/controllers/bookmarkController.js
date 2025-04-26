const express = require('express');
const router = express.Router();
const { collection, addDoc, getDoc, doc, deleteDoc, query, where, getDocs } = require('firebase/firestore');
const { db } = require('../config/firebase'); 

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// 📌 Route to GET all bookmarked recipes for a user
router.get('/api/bookmarks', authenticate, async (req, res) => {
  try {
    const bookmarksRef = collection(db, "Bookmarks");
    const q = query(bookmarksRef, where("userId", "==", req.user.id));
    const querySnapshot = await getDocs(q);

    const bookmarks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      recipeId: doc.data().recipeId
    }));

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 📌 Route to ADD a bookmark (save recipeId)
router.post('/api/bookmarks', authenticate, async (req, res) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ message: 'Missing recipe ID' });
    }

    const newBookmark = await addDoc(collection(db, "Bookmarks"), {
      recipeId,
      userId: req.user.id
    });

    res.json({ id: newBookmark.id, recipeId });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 📌 Route to DELETE a bookmark
router.delete('/api/bookmarks/:id', authenticate, async (req, res) => {
  try {
    const bookmarkRef = doc(db, "Bookmarks", req.params.id);
    await deleteDoc(bookmarkRef);
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
