const express = require('express');
const router = express.Router();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Bookmarks route
router.get('/api/bookmarks', authenticate, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id }).execPopulate();
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add bookmark route
router.post('/api/bookmarks', authenticate, async (req, res) => {
  try {
    const newBookmark = new Bookmark({
      title: req.body.title,
      url: req.body.url,
      category: req.body.category,
      userId: req.user.id,
    });
    const savedBookmark = await newBookmark.save();
    res.json(savedBookmark);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete bookmark route
router.delete('/api/bookmarks/:id', authenticate, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id).execPopulate();
    if (bookmark) {
      await bookmark.destroy();
      res.json({ message: 'Bookmark deleted successfully' });
    } else {
      res.status(404).json({ message: 'Bookmark not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
