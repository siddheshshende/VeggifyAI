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

// Goals route
router.get('/api/goals', authenticate, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).execPopulate();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add goal route
router.post('/api/goals', authenticate, async (req, res) => {
  try {
    const newGoal = new Goal({ goal: req.body.goal, userId: req.user.id });
    const savedGoal = await newGoal.save();
    res.json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete goal route
router.delete('/api/goals/:id', authenticate, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id).execPopulate();
    if (goal) {
      await goal.destroy();
      res.json({ message: 'Goal deleted successfully' });
    } else {
      res.status(404).json({ message: 'Goal not found' });
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
