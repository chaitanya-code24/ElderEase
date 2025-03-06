import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import getMeal from './llm.js';  // Your function to generate meal plan
import User from './UserDetails.js';  // MongoDB User Model
import { getGroqChatCompletion } from './chatllm.js'; // LLM integration

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection URL from environment variables
const mongourl = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(mongourl)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

// Register route to handle user registration and meal plan generation
app.post('/register', async (req, res) => {
  try {
    // Destructure user data from the request body
    const { 
      uid, phoneNo, email, name, age, weight, height, gender, 
      healthIssues, allergies, cuisines, goal, doctorNo, extraInfo, 
      birthDate, activityLevel, dietaryRestrictions, mealPreferences 
    } = req.body;

    console.log("Received data:", req.body);

    // Validation to ensure required fields are present
    if (!uid || !email || !name || !age || !weight || !height || !gender) {
      return res.status(400).send({ status: "error", message: "Missing required fields" });
    }

    // Check if the user already exists
    const oldUser = await User.findOne({ $or: [{ email: email }, { uid: uid }] });
    if (oldUser) {
      return res.status(409).send({ status: "error", message: "User already exists!" });
    }

    // Generate the meal plan using the getMeal function
    console.log("Generating meal plan...");
    let mealPlan;
    try {
      mealPlan = await getMeal({ 
        age, weight, height, gender, healthIssues, allergies, cuisines, 
        goal, activityLevel, dietaryRestrictions, mealPreferences 
      });

      if (!mealPlan) throw new Error("Meal plan generation failed");

      console.log("Meal plan generated successfully.");
    } catch (error) {
      return res.status(500).send({ status: "error", message: "Meal plan generation failed", error: error.message });
    }

    // Create or update the user record in the database
    const createdUser = await User.findOneAndUpdate(
      { uid: uid }, 
      { 
        phoneNo, email, name, age, weight, height, gender, healthIssues, allergies, 
        cuisines, goal, doctorNo, extraInfo, birthDate, activityLevel, dietaryRestrictions, 
        mealPreferences, mealPlan 
      },
      { new: true, upsert: true }
    );

    console.log("User created successfully");

    // Respond with success message and the generated meal plan
    res.status(201).send({ status: "ok", message: "User Created and Meal Plan Generated", mealPlan });

  } catch (error) {
    // Catch any errors and respond with error message
    console.error("Error:", error);
    res.status(500).send({ status: "error", message: "Internal Server Error", error: error.message });
  }
});



// Fetch user details and meal plan
app.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});



// Chat endpoint for LLM response
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ status: "error", message: "Message is required" });
    }

    const response = await getGroqChatCompletion(message);

    res.status(200).json({ status: "ok", reply: response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ status: "error", message: "Failed to get LLM response", error: error.message });
  }
});

// Start the Express server
app.listen(5001, '0.0.0.0', () => console.log("Server started on 0.0.0.0:5001"));
