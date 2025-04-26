// const express = require('express');
// const router = express.Router();
// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware to authenticate requests
// const authenticate = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   next();
// };

// // Shopping list route
// router.get('/api/shoppinglist', authenticate, async (req, res) => {
//   try {
//     const items = await ShoppingItem.find({ userId: req.user.id }).execPopulate();
//     res.json(items);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Add item route
// router.post('/api/shoppinglist', authenticate, async (req, res) => {
//   try {
//     const newItem = new ShoppingItem({ item: req.body.item, userId: req.user.id });
//     const savedItem = await newItem.save();
//     res.json(savedItem);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Delete item route
// router.delete('/api/shoppinglist/:id', authenticate, async (req, res) => {
//   try {
//     const item = await ShoppingItem.findById(req.params.id).execPopulate();
//     if (item) {
//       await item.destroy();
//       res.json({ message: 'Item deleted successfully' });
//     } else {
//       res.status(404).json({ message: 'Item not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.use(express.json());
// app.use(router);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
