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
        // console.log("Complete Recipe:", completeContent);
        setRecipeText(completeContent);
        closeEventStream();
        return;
      }

      // console.log("Received chunk:", event.data);
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