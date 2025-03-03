import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const RecipeDisplay = ({ text }) => {
  if (!text) {
    return <p className="text-gray-500">No recipe generated yet.</p>;
  }

//headings if not available 
let updatedText = text.trim(); 

if (!/Ingredients:/.test(updatedText)) {
  updatedText = `Ingredients:\n\n${updatedText}`;
}
if (!/Preparation:/.test(updatedText)) {
  updatedText += `\n\nPreparation:\n\n`;
}

// Ensure at least one of "Cooking Steps:" or "Instructions:" exists
if (!/Cooking Steps:/.test(updatedText) && !/Instructions:/.test(updatedText)) {
  updatedText += `\n\nInstructions:\n\n`;
}

  // Clean and format text
  const formattedText = updatedText
  .replace(/["']{1,}/g, "") // Remove excessive quotes
  .replace(/\n{3,}/g, "\n\n") // Limit consecutive newlines to two
  .replace(/(Ingredients:|Preparation:|Cooking Steps:|Instructions:|Preparation Steps:|Health Benefits:)/g, "\n> $1\n") // Add Markdown headers
  .replace(/-\s*/g, "\n- ") // Ensure each ingredient starts on a new line
  .replace(/(\\n)+/g, '\n') // Normalize newlines
  .replace(/(?<=\S)\n(?=\S)/g, '  \n') // Markdown-friendly line breaks
  .trim(); // Remove leading/trailing whitespace

  const finalText = formattedText
  .replace(/<ol[^>]*>/g, "<ul>")
  .replace(/<\/ol>/g, "</ul>");
  
  console.log("Text:", updatedText);
  console.log("Formatted Text:", formattedText);
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Recipe</h2>
      <ReactMarkdown
        className="prose max-w-none prose-lg"
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {formattedText}
      </ReactMarkdown>
    </div>
  );
};

export default RecipeDisplay;


//marked and react-markdown library is used to render markdown text in the RecipeDisplay component.