import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to remove HTML tags
const stripHtmlTags = (str) => str.replace(/<[^>]*>/g, "");

// Optional: Extract title from specific HTML structure
const extractTitle = (line) => {
  const match = line.match(/<\/strong>\s*([^<]+)/i);
  return match ? match[1].trim() : stripHtmlTags(line);
};

const RecipeDisplay = ({ text, userId, generatedRecipeId }) => {
  const [isBookmarking, setIsBookmarking] = useState(false);

  if (!text) {
    return (
      <p className="text-gray-500 text-base text-center mt-4">
        No recipe generated yet...
      </p>
    );
  }

  // Format the raw recipe text
  let updatedText = text.trim();

  if (!/Ingredients:/.test(updatedText)) {
    updatedText = `Ingredients:\n\n${updatedText}`;
  }
  if (!/Preparation:/.test(updatedText)) {
    updatedText += `\n\nPreparation:\n\n`;
  }
  if (
    !/Cooking Steps:/.test(updatedText) &&
    !/Instructions:/.test(updatedText)
  ) {
    updatedText += `\n\nInstructions:\n\n`;
  }

  const formattedText = updatedText
    .replace(/["']{1,}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(
      /(Ingredients:|Preparation:|Cooking Steps:|Instructions:|Preparation Steps:|Health Benefits:)/g,
      "\n> $1\n"
    )
    .replace(/-\s*/g, "\n- ")
    .replace(/(\\n)+/g, "\n")
    .replace(/(?<=\S)\n(?=\S)/g, "  \n")
    .trim();

  const finalText = formattedText
    .replace(/<ol[^>]*>/g, "<ul>")
    .replace(/<\/ol>/g, "</ul>");

  const addBookmark = async () => {
    if (!text) {
      toast.error("No recipe to bookmark");
      return;
    }

    setIsBookmarking(true);
    try {
      const titleLine = finalText.split("\n")[0] || "";
      const cleanedTitle = extractTitle(titleLine) || "Untitled Recipe";

      await addDoc(collection(db, "bookmarks"), {
        userId,
        recipeId: generatedRecipeId || Date.now().toString(),
        recipeText: finalText,
        title: cleanedTitle,
        createdAt: serverTimestamp(),
      });

      toast.success("Recipe bookmarked successfully!");
    } catch (error) {
      console.error("Error bookmarking recipe:", error);
      toast.error("Failed to bookmark recipe");
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-gray-900 ">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Recipe</h2>
      <ReactMarkdown
        className="prose max-w-none prose-lg"
        rehypePlugins={[rehypeRaw, rehypeSanitize]}>
        {finalText}
      </ReactMarkdown>
      <button
        className={`bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg text-base text-center m-4 ${
          isBookmarking ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={addBookmark}
        disabled={isBookmarking}>
        {isBookmarking ? "Bookmarking..." : "Bookmark Recipe"}
      </button>
    </div>
  );
};

export default RecipeDisplay;
