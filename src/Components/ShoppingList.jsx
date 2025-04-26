import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShoppingList = () => {
  // const [items, setItems] = useState([]);
  // const [newItem, setNewItem] = useState('');

  // useEffect(() => {
  //   // Fetch shopping list data when the component mounts
  //   const fetchItems = async () => {
  //     try {
  //       const response = await axios.get('/api/shoppinglist');
  //       setItems(response.data);
  //     } catch (error) {
  //       console.error('Error fetching shopping list:', error);
  //     }
  //   };

  //   fetchItems();
  // }, []);

  // const addItem = () => {
  //   // Add a new item to the shopping list
  //   axios.post('/api/shoppinglist', { item: newItem })
  //     .then(() => {
  //       setItems([...items, { id: response.data.id, item: newItem }]);
  //       setNewItem('');
  //     })
  //     .catch((error) => {
  //       console.error('Error adding item:', error);
  //     });
  // };

  // const deleteItem = (id) => {
  //   // Delete an item from the shopping list
  //   axios.delete(`/api/shoppinglist/${id}`)
  //     .then(() => {
  //       setItems(items.filter((item) => item.id !== id));
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting item:', error);
  //     });
  // };

  return (
    <div className="shopping-list-page">
      <h1>Shopping List</h1>
    </div>
  );
};

export default ShoppingList;

      // <input
      //   type="text"
      //   placeholder="Add a new item"
      //   value={newItem}
      //   onChange={(e) => setNewItem(e.target.value)}
      // />
      // <button onClick={addItem}>Add Item</button>
      // <ul>
      //   {items.map((item) => (
      //     <li key={item.id}>
      //       {item.item}
      //       <button onClick={() => deleteItem(item.id)}>Delete</button>
      //     </li>
      //   ))}
      // </ul>