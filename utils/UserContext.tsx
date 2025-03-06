import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the user data
type Meal = {
  mealType: string;
  meal: string;
  recipe: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  mealTime: string;
  servingSize: string;
};

type DayMealPlan = {
  day: string;
  meals: Meal[];
};

type MealPlan = {
  week: DayMealPlan[];
};

type UserData = {
  uid: string;
  phoneNo: string;
  email: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  healthIssues: string;
  allergies: string;
  cuisines: string;
  goal: string;
  doctorNo: string;
  extraInfo: string;
  birthDate: string;
  activityLevel: string;
  dietaryRestrictions: string;
  mealPreferences: string;
  mealPlan: MealPlan;
};


type UserContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  fetchUserData: (uid: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  // Function to fetch user data (e.g., from your backend)
  const fetchUserData = async (uid: string) => {
    try {
      // Replace with your API call logic
      const response = await fetch(`http://192.168.1.3:5001/user/${uid}`);
      const data: UserData = await response.json();
     
      setUser(data);
      console.log('User data fetched:', data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

