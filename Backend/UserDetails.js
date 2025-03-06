// UserDetails.js (ES module syntax)
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  gender: { type: String, required: true },
  healthIssues: { type: String },
  allergies: { type: String },
  cuisines: { type: String },
  goal: { type: String },
  doctorNo: { type: String, required: true },
  extraInfo: { type: String },
  birthDate: { type: String },
  activityLevel: { type: String },
  dietaryRestrictions: { type: String },
  mealPreferences: { type: String },
  mealPlan:{type: Object}
});

// Export the model as a default export
export default mongoose.model('personal_details', userSchema);
