import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.AI_MODEL || "google/gemini-2.0-flash";

export async function generateItinerary(budget, days, startingCity, destinationCity, vibe) {
  const prompt = `
  You are an expert budget travel planner for students in India.
  User Profile: Wants to travel from ${startingCity} to ${destinationCity} for ${days} days with a total budget of ₹${budget}. The preferred vibe is ${vibe}.
  
  Generate a highly realistic and detailed day-by-day itinerary. Because the budget is tight (₹${budget}), you MUST recommend real budget options:
  - Real train names and approximate numbers (e.g., sleeper class or general to save money).
  - Specific cheap budget hostels or dharamshalas (e.g., Zostel, local guest houses).
  - Specific famous street food spots and local cheap dhabas.

   Return ONLY a valid JSON object with the following schema:
  {
    "tripDetails": {
      "destination": "String (Suggested destination city matching the vibe and budget from starting city)",
      "totalEstimatedCost": Number
    },
    "transportation": {
      "outbound": "String (e.g., 12952 Mumbai Rajdhani sleeper class approx ₹500)",
      "return": "String"
    },
    "accommodation": "String (e.g., Hosteller, ₹400/night)",
    "dailyItinerary": [
      {
        "day": Number,
        "theme": "String",
        "activities": [
          { "title": "String", "imageSearchTerm": "String (2-3 concise keywords for Unsplash, e.g. 'Manali SolangValley')" }
        ],
        "food": [
          { "title": "String", "imageSearchTerm": "String (2-3 concise keywords for Unsplash, e.g. 'Delhi Paratha')" }
        ],
        "dailyCost": Number
      }
    ],
    "thingsToCarry": ["String (List 8-12 items specific to the destination climate and terrain)"]
  }
  
  IMPORTANT: For imageSearchTerm, provide 2-3 VERY CONCISE keywords (Destination + Place Name). Example: 'Mumbai Gateway', 'Delhi RedFort'.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173", // Optional for OpenRouter
        "X-Title": "BudgetPacker" // Optional for OpenRouter
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": [
          { "role": "system", "content": "You are a professional travel planner. Respond only with valid JSON." },
          { "role": "user", "content": prompt }
        ],
        "response_format": { "type": "json_object" },
        "max_tokens": 2000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter API Error:', data);
      throw new Error(data.error?.message || "AI Service unavailable");
    }

    const responseText = data.choices[0].message.content;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}

export async function chatAboutItinerary(itinerary, chatHistory, userMessage) {
  const prompt = `
  You are a helpful travel assistant.
  The user has the following itinerary:
  ${JSON.stringify(itinerary)}

  The user just said: "${userMessage}"
  
  If they are saying something like "train ticket nahi mila", suggest an alternative transport and provide an updated itinerary.
  Return ONLY a valid JSON object matching the exact schema as the original itinerary, but with your updates applied.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": [
          ...chatHistory.map(m => ({ role: m.role, content: m.content })),
          { "role": "user", "content": prompt }
        ],
        "response_format": { "type": "json_object" },
        "max_tokens": 2000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter API Error:', data);
      throw new Error(data.error?.message || "AI Service unavailable");
    }

    const responseText = data.choices[0].message.content;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error updating itinerary:", error);
    throw new Error("Failed to update itinerary. Please try again.");
  }
}
