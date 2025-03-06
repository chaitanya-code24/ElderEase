import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '@/utils/UserContext';

export default function MealPlan() {
  const { user } = useUser();
  
  if (!user || !user.mealPlan) {
    return <Text style={styles.error}>No meal plan available</Text>;
  }

  const todayDay = getTodayDay();
  const todayMealPlan = user.mealPlan.week.find(day => day.day === todayDay);

  if (!todayMealPlan) {
    return <Text style={styles.error}>No meal data available for {todayDay}</Text>;
  }

  return (
    <ScrollView style={styles.container} 
    contentContainerStyle={{ flexGrow: 1 }} 
    showsVerticalScrollIndicator={false} >
      <Text style={styles.header}>Meal Plan 🍎 - {todayDay}</Text>

      {todayMealPlan.meals.map((meal, index) => {
        // Alternate between green and orange based on index
        const cardStyle = index % 2 === 0 ? styles.greenCard : styles.orangeCard;

        return (
          <View key={index} style={styles.mealCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.mealType}>{meal.mealType}</Text>
              <Text style={styles.calories}>{meal.nutritionalInfo.calories} Cals</Text>
            </View>
            <Text style={styles.time}>{meal.mealTime}</Text>
            <View style={[styles.mealDetails, cardStyle]}>
              <Text style={styles.mealTitle}>{meal.meal}</Text>
              <Text style={styles.subTitle}>Recipe</Text>
              <Text style={styles.content}>{meal.recipe}</Text>
              <Text style={styles.subTitle}>Ingredients</Text>
              <Text style={styles.content}>{meal.ingredients.join(", ")}</Text>
              <Text style={styles.subTitle}>Nutrition</Text>
              <Text style={styles.content}>
                Calories: {meal.nutritionalInfo.calories}, Protein: {meal.nutritionalInfo.protein}, Carbs: {meal.nutritionalInfo.carbs}, Fat: {meal.nutritionalInfo.fat}, Fiber: {meal.nutritionalInfo.fiber}
              </Text>
              <Text style={styles.subTitle}>Serving Size</Text>
              <Text style={styles.content}>{meal.servingSize}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// Function to get today's weekday name
function getTodayDay() {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[new Date().getDay()];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  mealCard: {
    marginBottom: 25,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  time: {
    fontSize: 14,
    color: '#777',
    marginVertical: 4,
  },
  mealDetails: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 12,
  },
  content: {
    fontSize: 15,
    color: '#FFF',
  },
  greenCard: {
    backgroundColor: '#00483D', // Green color
  },
  orangeCard: {
    backgroundColor: '#F6735F', // Orange color
  },
});
