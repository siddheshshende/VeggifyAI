import express from "express";
import cors from "cors";
import { marked } from "marked";
import dotenv from "dotenv";
import OpenAI from "openai";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/config/firebase.js";
import { collection, addDoc } from "firebase/firestore";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to validate OpenAI API key
async function validateOpenAI() {
  try {
    await openai.models.list();
    console.log(" OpenAI API key is valid");
    return true;
  } catch (error) {
    console.error(" OpenAI API key validation failed:", error.message);
    return false;
  }
}

async function fetchDocument(userId) {
  if (!userId) throw new Error("UserId is required");
  console.log(" Fetching user preferences from Firebase...");
  try {
    const userDocRef = doc(db, "Demographics", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      console.log(` User document found for ID: ${userId}`);
      return userDoc.data();
    } else {
      console.log(` No user document found for ID: ${userId}`);
      return {};
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return {};
  }
}

// Function to save the generated recipe to Firebase
const saveRecipeToFirebase = async (userId, recipeContent) => {
  try {
    const docRef = await addDoc(collection(db, "Recipes"), {
      userId,
      content: recipeContent,
      createdAt: new Date(),
    });
    console.log("Recipe saved with ID:", docRef.id);
    return docRef.id; // ✅ Return recipe ID for bookmarking
  } catch (error) {
    console.error("Error saving recipe:", error);
    return null;
  }
};

//  Recipe generation endpoint (Streaming)
app.get("/recipestream", async (req, res) => {
  console.log(" Received request to /recipestream");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Get query parameters
  const { ingredients, mealType, cuisine, cookingTime, complexity, userId } =
    req.query;

  if (!ingredients || !mealType || !cuisine || !cookingTime || !complexity) {
    console.error(" Missing required parameters", {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
    });
    res.status(400).send(" Missing required query parameters");
    return;
  }
  console.log(" Parameters validated:", {
    ingredients,
    mealType,
    cuisine,
    cookingTime,
    complexity,
  });

  try {
    const isValidAPI = await validateOpenAI();
    if (!isValidAPI) {
      res.status(500).send(" Invalid OpenAI API configuration");
      return;
    }

    let userPreferences = {};
    try {
      if (userId) {
        userPreferences = await fetchDocument(userId);
      }
    } catch (error) {
      console.error(" Error fetching user preferences:", error);
    }

    const promptContent = `
     You are a professional chef and nutrition expert. Your goal is to generate a detailed, easy-to-follow recipe that:  
- Uses **only the provided ingredients**.  
- Considers any **allergies** or **chronic diseases** and tailors the recipe for **optimal health benefits**.  
- Highlights **fresh and vibrant flavors** while ensuring **nutritional balance**.  

### **Recipe Details:**
- **Ingredients**: ${ingredients}  
- **Meal Type**: ${mealType}  
- **Cuisine**: ${cuisine}  
- **Cooking Time**: ${cookingTime}  
- **Complexity**: ${complexity}  
${
  userPreferences.Allergies
    ? `- **Allergies**: ${userPreferences.Allergies.join(", ")}`
    : ""
}  
${
  userPreferences.ChronicDiseases
    ? `- **Chronic Diseases**: ${userPreferences.ChronicDiseases.join(", ")}`
    : ""
}  

### ** Additional Guidelines:**
1. **Provide a culturally authentic recipe name.**  
2. **List all preparation & cooking steps in a unordered list format.**  
3. **Ensure the dish is balanced, safe, and beneficial for health conditions/allergies.**  
4. **Explain how the selected ingredients benefit the given health conditions.**  
5. **Format the response in Markdown for clarity.**  
    `;

    console.log(" Prompt created for API.");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptContent }],
      stream: true,
    });

    console.log(" OpenAI completion stream started");

    let accumulatedContent = "";

    req.on("close", () => {
      console.log(" Client disconnected, stopping response.");
      res.end();
    });

    //  Process OpenAI Streaming Response
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        accumulatedContent += content;

        // Ensure full sentences before sending
        if (/[.!?]\s*$/.test(content) || content.includes("\n")) {
          res.write(
            `data: ${JSON.stringify(marked(accumulatedContent.trim()))}\n\n`
          );
          accumulatedContent = "";
        }
      }
    }

// Send any remaining content
if (accumulatedContent) {
  const recipeId = await saveRecipeToFirestore(
    userId,
    accumulatedContent.trim()
  );
  res.write(
    `data: ${JSON.stringify({
      recipeId,
      content: marked(accumulatedContent.trim()),
    })}\n\n`
  );
}

    res.write("data: [And its done]\n\n");
    console.log(" Recipe generation complete");
  } catch (error) {
    console.error(" Error in recipe generation:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  } finally {
    res.end();
    console.log(" Response ended");
  }
});

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipeRef = doc(db, "Recipes", req.params.id);
    const recipeDoc = await getDoc(recipeRef);

    if (!recipeDoc.exists()) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ content: recipeDoc.data().content });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/health", (req, res) => {
  console.log(" Health check endpoint hit");
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await validateOpenAI();
});

/*import express from 'express'; 
import cors from 'cors';
import { marked } from 'marked';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../src/config/firebase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


async function validateOpenAI() {
  try {
    await openai.models.list();
    console.log('OpenAI API key is valid');
    return true;
  } catch (error) {
    console.error('OpenAI API key validation failed:', error.message);
    return false;
  }
}

// Fetch user document from Firebase
async function fetchDocument(userId) {
  if (!userId) throw new Error("UserId is required");
  console.log("fetched documents from user ");
  try {
    const userDocRef = doc(db, "Demographics", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      console.log(`User document found for ID: ${userId}`);
      return userDoc.data();
    } else {
      console.log(`No user document found for ID: ${userId}`);
      return {};
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw new Error("Failed to fetch user data");
  }
}

// Recipe generation endpoint
app.get('/recipestream', async (req, res) => {
  console.log("Received request to /recipestream");

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Get query parameters
  const { ingredients, mealType, cuisine, cookingTime, complexity, userId } = req.query;

  // Validate required parameters
  if (!ingredients || !mealType || !cuisine || !cookingTime || !complexity) {
    console.error("Required parameters are missing", { ingredients, mealType, cuisine, cookingTime, complexity });
    res.status(400).send("Missing required query parameters");
    return;
  }
  console.log("Parameters validated", { ingredients, mealType, cuisine, cookingTime, complexity });

  try {
    // Validate OpenAI API key
    const isValidAPI = await validateOpenAI();
    if (!isValidAPI) {
      res.status(500).send("Invalid OpenAI API configuration");
      return;
    }

    console.log("OpenAI API is valid, fetching user preferences");
    const userPreferences = userId ? await fetchDocument(userId) : {};

    const promptContent = [
      `You are a professional chef and recipe creator. Please generate a detailed, easy-to-follow recipe that is safe, considers the user's health conditions and allergies and highlights fresh and vibrant flavors.`,
      `Provide a recipe using these details:`,
      `Ingredients: ${ingredients}`,
      `Meal Type: ${mealType}`,
      `Cuisine: ${cuisine}`,
      `Cooking Time: ${cookingTime}`,
      `Complexity: ${complexity}`,
      userPreferences.Allergies ? `Allergies: ${userPreferences.Allergies.join(', ')}` : '',
      userPreferences.ChronicDiseases ? `Chronic Diseases: ${userPreferences.ChronicDiseases.join(', ')}` : '',
      `Please include:`,
      `1. A suitable name in the local language based on the cuisine.`,
      `2. Detailed preparation and cooking steps.`,
      `3. Only use the ingredients provided.`,
      `4. Highlight fresh and vibrant flavors in the recipe.`
    ].filter(Boolean).join('');

    console.log("Prompt content created for OpenAI:", promptContent);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptContent }],
      stream: true,
    });

    console.log("OpenAI completion stream started");

    let accumulatedContent = "";

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        accumulatedContent += content;
    
        // Check if we have a complete sentence before sending
        if (content.endsWith('.') || content.endsWith('\n')) {
          res.write(`data: ${JSON.stringify(accumulatedContent.trim())}\n\n`);
          accumulatedContent = ""; // Reset for next chunk
        }
      }
    }
    
    // Send any remaining content
    if (accumulatedContent) {
      res.write(`data: ${JSON.stringify(accumulatedContent.trim())}\n\n`);
    }

    res.write('data: [And its done]\n\n');
    console.log("Recipe generation complete");
  } catch (error) {
    console.error("Error in recipe generation:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  } finally {
    res.end();
    console.log("Response ended");
  }

  req.on("close", () => {
    console.log("Client connection closed");
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check endpoint hit");
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await validateOpenAI();
});
*/
