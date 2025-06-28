import React, { useState } from "react";

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
    <div className="w-full md:w-1/2 max-w-2xl mt-5 sm:mt-10 border rounded-lg overflow-hidden shadow-lg">
      <div className="p-4">
        <div className="font-bold text-3xl sm:text-4xl mb-2">Recipe Generator</div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="ingredients">
            Ingredients
          </label>
          <input
            className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
            id="ingredients"
            type="text"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="mealType">
            Meal Type
          </label>
          <input
            className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
            id="mealType"
            type="text"
            placeholder="Enter meal type e.g. lunch, breakfast"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="cuisine">
            Cuisine Preference
          </label>
          <input
            className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
            id="cuisine"
            type="text"
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="cookingTime">
            Cooking Time
          </label>
          <input
            className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
            id="cookingTime"
            type="text"
            placeholder="e.g. 30 minutes"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="complexity">
            Complexity
          </label>
          <input
            className="w-full py-2 md:py-4 pl-2.5 md:pl-5 border border-gray-300 rounded-lg"
            id="complexity"
            type="text"
            placeholder="e.g. beginner, advanced, intermediate"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          />
        </div>
        <div className="place-self-center">
          <button
            className="!bg-blue-700 hover:!bg-blue-900 transition-colors ease-in-out duration-300 text-white font-bold py-2 px-4 rounded-lg"
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

export default RecipeCard;

// import React, { useState } from "react";

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
//     <div className="w-full h-full border rounded-lg overflow-hidden shadow-lg">
//       <div className="px-6 py-4">
//         <div className="font-bold text-xl mb-2">Recipe Generator</div>
//         <div className="mb-4">
//           <label className="block text-gray-700  font-medium mb-2" htmlFor="ingredients">
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
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="mealType">
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
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="cuisine">
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
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="cookingTime">
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
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="complexity">
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
//             className="!bg-blue-700 hover:!bg-blue-900 transition-colors ease-in-out  duration-300  text-white font-bold py-2 px-4 rounded-lg "
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
// export default RecipeCard;