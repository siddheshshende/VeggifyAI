import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShoppingList() {
  const [uid, setUid] = useState(null);
  const [itemInput, setItemInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [categoryInput, setCategoryInput] = useState("Vegetables");
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemQuantity, setEditItemQuantity] = useState("");

  // Categories for shopping items
  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Protein",
    "Dairy",
    "Spices",
    "Other",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchShoppingList(user.uid);
      } else {
        setUid(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchShoppingList = async (userId) => {
    try {
      setIsLoading(true);
      const listDocRef = doc(db, "ShoppingList", userId);
      const listDoc = await getDoc(listDocRef);

      if (listDoc.exists()) {
        const data = listDoc.data();
        setShoppingList(data.items || []);
      } else {
        setShoppingList([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch shopping list.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!itemInput.trim()) {
      toast.error("Please enter an item name.");
      return;
    }

    try {
      const newItem = {
        name: itemInput.trim(),
        quantity: quantityInput.trim() || "1",
        category: categoryInput,
        id: Date.now().toString(),
        completed: false,
      };

      const updatedList = [...shoppingList, newItem];
      setShoppingList(updatedList);
      setItemInput("");
      setQuantityInput("");

      // Save to Firestore
      const listDocRef = doc(db, "ShoppingList", uid);
      await setDoc(listDocRef, { items: updatedList }, { merge: true });
      toast.success("Item added to shopping list!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item.");
    }
  };

  const handleRemoveItem = async (idToRemove) => {
    try {
      const updatedList = shoppingList.filter((item) => item.id !== idToRemove);
      setShoppingList(updatedList);

      // Update Firestore
      const listDocRef = doc(db, "ShoppingList", uid);
      await setDoc(listDocRef, { items: updatedList }, { merge: true });
      toast.success("Item removed from shopping list!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item.");
    }
  };

  const toggleItemCompletion = async (idToToggle) => {
    try {
      const updatedList = shoppingList.map((item) =>
        item.id === idToToggle ? { ...item, completed: !item.completed } : item
      );

      setShoppingList(updatedList);

      // Update Firestore
      const listDocRef = doc(db, "ShoppingList", uid);
      await setDoc(listDocRef, { items: updatedList }, { merge: true });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update item status.");
    }
  };

  // Edit item functions
  const startEditingItem = (item) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemQuantity(item.quantity);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditItemName("");
    setEditItemQuantity("");
  };

  const saveItemEdit = async () => {
    if (!editItemName.trim()) {
      toast.error("Item name cannot be empty");
      return;
    }

    try {
      const updatedList = shoppingList.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              name: editItemName.trim(),
              quantity: editItemQuantity.trim() || "1",
            }
          : item
      );

      setShoppingList(updatedList);

      // Update Firestore
      const listDocRef = doc(db, "ShoppingList", uid);
      await setDoc(listDocRef, { items: updatedList }, { merge: true });

      toast.success("Item updated successfully!");
      cancelEditing(); // Reset edit mode
    } catch (error) {
      console.log(error);
      toast.error("Failed to update item.");
    }
  };

  // Group items by category
  const groupedItems = {};
  categories.forEach((category) => {
    groupedItems[category] = shoppingList.filter(
      (item) => item.category === category
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading your shopping list...
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="flex justify-center items-center h-64">
        Please log in to view your shopping list.
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="pt-[5vh] font-bold text-3xl sm:text-4xl">
        Shopping List
      </div>

      {/* Add Item Form */}
      <div className="mt-8 mb-8 p-6 border rounded-md shadow-sm">
        <h3 className="text-xl font-medium mb-4">Add New Item</h3>
        <form onSubmit={handleAddItem} className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Item Name</label>
            <input
              type="text"
              value={itemInput}
              onChange={(e) => setItemInput(e.target.value)}
              placeholder="Item name"
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Quantity</label>
            <input
              type="text"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              placeholder="e.g. 2, 500g, 1 bunch"
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Category</label>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="border p-2 rounded">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="self-end">
            <button
              type="submit"
              className="bg-[#2E8B57] text-white px-4 py-2 rounded hover:bg-[#1e6b47] transition duration-300">
              Add Item
            </button>
          </div>
        </form>
      </div>

      {/* Shopping List Items by Category */}
      {shoppingList.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          Your shopping list is empty. Add some items above!
        </div>
      ) : (
        <div>
          {categories.map(
            (category) =>
              groupedItems[category].length > 0 && (
                <div key={category} className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{category}</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Item</th>
                          <th className="text-left p-3">Quantity</th>
                          <th className="text-right p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedItems[category].map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3 flex items-center">
                              {editingItemId === item.id ? (
                                <input
                                  type="text"
                                  value={editItemName}
                                  onChange={(e) =>
                                    setEditItemName(e.target.value)
                                  }
                                  className="border p-1 rounded w-full"
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() =>
                                      toggleItemCompletion(item.id)
                                    }
                                    className="mr-3"
                                    title="Item Completed"
                                  />
                                  <span
                                    className={
                                      item.completed
                                        ? "line-through text-gray-400"
                                        : ""
                                    }>
                                    {item.name}
                                  </span>
                                </>
                              )}
                            </td>
                            <td className="p-3">
                              {editingItemId === item.id ? (
                                <input
                                  type="text"
                                  value={editItemQuantity}
                                  onChange={(e) =>
                                    setEditItemQuantity(e.target.value)
                                  }
                                  className="border p-1 rounded w-full"
                                />
                              ) : (
                                <span
                                  className={
                                    item.completed ? "text-gray-400" : ""
                                  }>
                                  {item.quantity}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {editingItemId === item.id ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={saveItemEdit}
                                    className="text-green-600 font-medium">
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="text-gray-500 font-medium">
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() => startEditingItem(item)}
                                    className="text-blue-500 font-medium"
                                    title="Edit Item">
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 font-bold"
                                    title="Remove Item">
                                    x
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}

export default ShoppingList;
