/*import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import sanitizeHtml from 'sanitize-html';

const RecipeCard = ({ onSubmit, userId }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [complexity, setComplexity] = useState("");

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
      userId,
    };
    onSubmit(recipeData);
    console.log("Recipe data submitted: ", recipeData);
  };

  return (
    <div className="w-[400px] h-[565px] border rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Recipe Generator</div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredients">
            Ingredients
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ingredients"
            type="text"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mealType">
            Meal Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="mealType"
            type="text"
            placeholder="Enter meal type e.g. lunch, breakfast"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuisine">
            Cuisine Preference
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="cuisine"
            type="text"
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cookingTime">
            Cooking Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="cookingTime"
            type="text"
            placeholder="e.g. 30 minutes"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complexity">
            Complexity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="complexity"
            type="text"
            placeholder="e.g. beginner, advanced, intermediate"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          />
        </div>
        <div className="px-6 py-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Generate Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

function Recipes() {
  const [userId, setUserId] = useState(null);
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");

  const eventSourceRef = useRef(null);

  useEffect(() => {
    return () => closeEventStream();
  }, []);

  useEffect(() => {
    if (recipeData) {
      initializeEventStream();
    }
  }, [recipeData]);

  const initializeEventStream = () => {
    const queryParams = new URLSearchParams(recipeData).toString();
    const url = `http://localhost:3001/recipestream?${queryParams}`;

    eventSourceRef.current = new EventSource(url);

    const chunks = []; // Initialize an array to store incoming chunks
    eventSourceRef.current.onmessage = (event) => {
      if (event.data === '[And its done]') {
        const completeContent = chunks.join("");
        console.log("Complete Recipe:", completeContent); // Debug: Log the complete content
        setRecipeText(sanitizeHtml(completeContent));
        closeEventStream();
        return;
      }
      
      console.log("Received chunk:", event.data); // Debug: Log each chunk
      chunks.push(event.data);
    };
    
    

    eventSourceRef.current.onerror = (event) => {
      console.error("Error in event stream(non-critical):", event);
      closeEventStream();
    };
  };

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  async function onSubmit(data) {
    setRecipeText('');
    setRecipeData(data);
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <div className="flex flex-row my-4 gap-2 justify-center pt-[10vh]">
        <RecipeCard onSubmit={onSubmit} userId={userId} />
        <div className="w-[400px] h-[565px] text-xs text-gray-600 p-4 border rounded-lg shadow-xl overflow-y-auto">
  <div dangerouslySetInnerHTML={{ __html: recipeText }} />
</div>

      </div>
    </div>
  );
}

export default Recipes;
*/

import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import RecipeDisplay from './RecipeDisplay'; 

const RecipeCard = ({ onSubmit, userId }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [complexity, setComplexity] = useState("");

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
      userId,
    };
    onSubmit(recipeData);
    console.log("Recipe data submitted: ", recipeData);
  };

  return (
    <div className="w-[400px] h-[565px] border rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Recipe Generator</div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredients">
            Ingredients
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ingredients"
            type="text"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mealType">
            Meal Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="mealType"
            type="text"
            placeholder="Enter meal type e.g. lunch, breakfast"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuisine">
            Cuisine Preference
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="cuisine"
            type="text"
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cookingTime">
            Cooking Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="cookingTime"
            type="text"
            placeholder="e.g. 30 minutes"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complexity">
            Complexity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="complexity"
            type="text"
            placeholder="e.g. beginner, advanced, intermediate"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          />
        </div>
        <div className="place-self-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Generate Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

function Recipes() {
  const [userId, setUserId] = useState(null);
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");

  const eventSourceRef = useRef(null);

  useEffect(() => {
    return () => closeEventStream();
  }, []);

  useEffect(() => {
    if (recipeData) {
      initializeEventStream();
    }
  }, [recipeData]);

  const initializeEventStream = () => {
    const queryParams = new URLSearchParams(recipeData).toString();
    const url = `http://localhost:3001/recipestream?${queryParams}`;

    eventSourceRef.current = new EventSource(url);

    const chunks = [];
    eventSourceRef.current.onmessage = (event) => {
      if (event.data === '[And its done]') {
        const completeContent = chunks.join("");
        console.log("Complete Recipe:", completeContent);
        setRecipeText(completeContent);  // ✅ No need for sanitizeHtml
        closeEventStream();
        return;
      }

      console.log("Received chunk:", event.data);
      chunks.push(event.data);
    };

    eventSourceRef.current.onerror = (event) => {
      console.error("Error in event stream(non-critical):", event);
      closeEventStream();
    };
  };

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  async function onSubmit(data) {
    setRecipeText('');
    setRecipeData(data);
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <div className="flex flex-row my-4 gap-2 justify-center pt-[10vh]">
        <RecipeCard onSubmit={onSubmit} userId={userId} />
        <div className="w-[400px] h-[565px] text-xs text-gray-600 p-4 border rounded-lg shadow-xl overflow-y-auto">
          <RecipeDisplay text={recipeText} />  
        </div>
      </div>
    </div>
  );
}

export default Recipes;
