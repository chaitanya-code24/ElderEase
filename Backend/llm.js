import Groq from "groq-sdk";

// Initialize the Groq API client with a hardcoded API key
const groq = new Groq({
  apiKey: "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", // ⚠ Hardcoded API key
});



export async function getGroqChatCompletion(userDetails) {
  try {
    // Inject user details dynamically into the prompt
    const prompt = `
      You are a professional nutrition guide who creates meal plans for elders.
      Generate a full weekly meal plan (Sunday to Saturday) based on the following user details:

      Age: ${userDetails.age}
      Weight: ${userDetails.weight} kg
      Height: ${userDetails.height} cm
      Gender: ${userDetails.gender}
      Health Issues: ${userDetails.healthIssues}
      Allergies: ${userDetails.allergies}
      Meal Preferences: ${userDetails.mealPreferences}
      Dietary Restrictions: ${userDetails.dietaryRestrictions}
      Goal: ${userDetails.goal}
      Activity Level: ${userDetails.activityLevel}
      Cuisine Preferences: ${userDetails.cuisines}

      **Requirements:**
      - 4 meals for a day Breakfast, Lunch, Snacks, Dinner.
      - Accommodate health concerns (e.g., high blood pressure, diabetes, arthritis), dietary restrictions, and avoid allergens.
      - Ensure meals are high in fiber, antioxidants, healthy fats, and protein, with balanced portions.
      - Recipes should be easy to prepare with simple ingredients.
      - Include food which is mostly indian dont add food like turkey, beef and any other foreign food products. based on user preferences while ensuring they meet dietary needs.

      **Return only JSON output, without any additional text.** The JSON structure should be:

      {
        "week": [
          {
            "day": "Sunday",
            "meals": [
              {
                "mealType": "Breakfast",
                "meal": "Meal name",
                "recipe": "Recipe instructions",
                "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
                "nutritionalInfo": {
                  "calories": "Calories",
                  "protein": "Protein",
                  "carbs": "Carbohydrates",
                  "fat": "Fat",
                  "fiber": "Fiber"
                },
                "servingSize": "Serving Size",
                "mealTime": "Meal Time"
              }
            ]
          }
        ]
      }
    `;

    // Make API request to Groq LLM
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    let output = response.choices[0]?.message?.content?.trim() || "";

    // Extract JSON safely
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]); // Parse the extracted JSON
    } else {
      console.error("LLM Response (invalid JSON):", output);
      throw new Error("Invalid JSON output from LLM");
    }
  } catch (error) {
    console.error("Error fetching meal plan:", error.message);
    return { error: "Failed to generate meal plan." };
  }
}

// Main function to get meal plan
export default async function getMeal(userDetails) {
  const mealPlan = await getGroqChatCompletion(userDetails);
  console.log(mealPlan);
  return mealPlan;
}
