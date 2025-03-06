import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the Groq API client
const groq = new Groq({
  apiKey: process.env.GROQ_API, // Make sure this is correctly set in .env
});

export async function getGroqChatCompletion(userMessage) {
  try {
    // Ensure groq is initialized
    if (!groq || !groq.chat) {
      throw new Error("Groq API client is not initialized correctly.");
    }

    // Call the Groq API
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "You are a Health, Fitness, and Diet Expert specializing in elderly care. Your goal is to provide personalized meal plans, fitness advice, and health tips while ensuring recommendations are safe, scientifically backed, and aligned with geriatric guidelines in short."
        },
        { 
          role: "user", 
          content: userMessage 
        }
      ]
    });

    return chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process your request.";
  } catch (error) {
    console.error("Groq API error:", error);
    return "I'm experiencing issues. Please try again later.";
  }
}
