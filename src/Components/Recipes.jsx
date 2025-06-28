import React, { useEffect, useRef, useState } from "react";
import RecipeDisplay from './RecipeDisplay';
import RecipeCard from './RecipeCard';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

function Recipes() {
  const [userId, setUserId] = useState(null);
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");
  const [generatedRecipeId, setGeneratedRecipeId] = useState(null);
  
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
        setRecipeText(completeContent);
        closeEventStream();
        return;
      }

      console.log("Received chunk:", event.data);
      chunks.push(event.data);

      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.recipeId) {
          setGeneratedRecipeId(parsedData.recipeId);
        }
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
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
    <div className="RecipeContainer ">
      <div className="flex flex-col md:flex-row gap-3 justify-center 3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-10">
        <RecipeCard onSubmit={onSubmit} userId={userId}/>
        <div className="w-full md:w-1/2 max-w-2xl mt-5 sm:mt-10 text-gray-600 p-4 text-xs border rounded-lg break-words shadow-xl overflow-y-auto max-h-[650px]">
          <RecipeDisplay
            text={recipeText}
            userId={userId}
            generatedRecipeId={generatedRecipeId}
          />
        </div>
      </div>
    </div>
  );
}

export default Recipes;


// import React, { useEffect, useRef, useState } from "react";
// import RecipeDisplay from './RecipeDisplay'; 
// import { onAuthStateChanged } from 'firebase/auth';
// import { getAuth } from 'firebase/auth';

// const RecipeCard = ({ onSubmit, userId }) => {
//   const [ingredients, setIngredients] = useState("");
//   const [mealType, setMealType] = useState("");
//   const [cuisine, setCuisine] = useState("");
//   const [cookingTime, setCookingTime] = useState("");
//   const [complexity, setComplexity] = useState("");

//   const handleSubmit = () => {
//     const recipeData = {
//       ingredients,
//       mealType,
//       cuisine,
//       cookingTime,
//       complexity,
//       userId,
//     };
//     onSubmit(recipeData);
//     console.log("Recipe data submitted: ", recipeData);
//   };


//   return (
//     <div className="w-full md:w-1/2 border rounded-lg overflow-hidden shadow-lg ">
//       <div className="p-4">
//         <div className="font-bold text-2xl sm:text-3xl mb-3">Recipe Generator</div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="ingredients">
//             Ingredients
//           </label>
//           <input
//             className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
//             id="ingredients"
//             type="text"
//             placeholder="Enter ingredients"
//             value={ingredients}
//             onChange={(e) => setIngredients(e.target.value)}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="mealType">
//             Meal Type
//           </label>
//           <input
//             className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
//             id="mealType"
//             type="text"
//             placeholder="Enter meal type e.g. lunch, breakfast"
//             value={mealType}
//             onChange={(e) => setMealType(e.target.value)}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="cuisine">
//             Cuisine Preference
//           </label>
//           <input
//             className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
//             id="cuisine"
//             type="text"
//             placeholder="e.g., Italian, Mexican"
//             value={cuisine}
//             onChange={(e) => setCuisine(e.target.value)}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="cookingTime">
//             Cooking Time
//           </label>
//           <input
//             className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
//             id="cookingTime"
//             type="text"
//             placeholder="e.g. 30 minutes"
//             value={cookingTime}
//             onChange={(e) => setCookingTime(e.target.value)}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="complexity">
//             Complexity
//           </label>
//           <input
//             className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
//             id="complexity"
//             type="text"
//             placeholder="e.g. beginner, advanced, intermediate"
//             value={complexity}
//             onChange={(e) => setComplexity(e.target.value)}
//           />
//         </div>
//         <div className="place-self-center">
//           <button
//             className="bg-blue-700 hover:bg-blue-900 transition-colors ease-in-out  duration-300  text-white font-bold py-2 px-4 rounded-lg "
//             type="button"
//             onClick={handleSubmit}
//           >
//             Generate Recipe
//           </button>
//         </div>
//       </div>
  

//     </div>
    
//   );
// };

// function Recipes() {
//   const [userId, setUserId] = useState(null);
//   const [recipeData, setRecipeData] = useState(null);
//   const [recipeText, setRecipeText] = useState("");
//   const [generatedRecipeId, setGeneratedRecipeId] = useState(null);
  
//   const eventSourceRef = useRef(null);

//   useEffect(() => {
//     return () => closeEventStream();
//   }, []);

//   useEffect(() => {
//     if (recipeData) {
//       initializeEventStream();
//     }
//   }, [recipeData]);

//   const initializeEventStream = () => {
//     const queryParams = new URLSearchParams(recipeData).toString();
//     const url = `http://localhost:3001/recipestream?${queryParams}`;

//     eventSourceRef.current = new EventSource(url);

//     const chunks = [];
//     eventSourceRef.current.onmessage = (event) => {
//       if (event.data === '[And its done]') {
//         const completeContent = chunks.join("");
//         console.log("Complete Recipe:", completeContent);
//         setRecipeText(completeContent);  // ✅ No need for sanitizeHtml
//         closeEventStream();
//         return;
//       }

//       console.log("Received chunk:", event.data);
//       chunks.push(event.data);

//         // Parse the JSON data to get the recipeId
//   try {
//     const parsedData = JSON.parse(event.data);
//     if (parsedData.recipeId) {
//       setGeneratedRecipeId(parsedData.recipeId);
//     }
//   } catch (error) {
//     console.error("Error parsing event data:", error);
//   }
//     };

//     eventSourceRef.current.onerror = (event) => {
//       console.error("Error in event stream(non-critical):", event);
//       closeEventStream();
//     };
//   };

//   const closeEventStream = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//   };

//   async function onSubmit(data) {
//     setRecipeText('');
//     setRecipeData(data);
//   }

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUserId(user ? user.uid : null);
//     });
//     return () => unsubscribe();
//   }, []);

  
//   return (
//     <div className="App-RecipeContainer">
//       <div className="flex flex-col md:flex-row gap-3 justify-center ml-4 sm:ml-8 mr-4 sm:mr-8 mb-4 sm:mb-8">
//         <RecipeCard onSubmit={onSubmit} userId={userId} />
//         <div className="w-full md:w-1/2   text-gray-600 p-4 border rounded-lg shadow-xl overflow-y-auto">
//           <RecipeDisplay   text={recipeText} 
//             userId={userId} 
//             generatedRecipeId={generatedRecipeId} />  
//         </div>
//       </div>
//       <div>
//   </div>

//     </div>
//   );
// }

// export default Recipes;