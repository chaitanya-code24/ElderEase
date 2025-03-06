import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FIREBASE_AUTH } from '../../firebaseconfig';
import { useUser } from '@/utils/UserContext';
import { ProgressBar } from 'react-native-paper';

const MainPage = ({ navigation }: any) => {
  function getTodayDay() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[new Date().getDay()];
  }

  const { user } = useUser();
  const [caloriesCounter, setCaloriesCounter] = useState(0);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(0);
  const [consumedMeals, setConsumedMeals] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (user?.mealPlan) {
      const todayDay = getTodayDay();
      const todayMealPlan = user.mealPlan.week.find((day: { day: string }) => day.day === todayDay);
      
      if (todayMealPlan) {
        const totalCalories = todayMealPlan.meals.reduce((sum: number, meal: any) => sum + parseInt(meal.nutritionalInfo.calories), 0);
        setDailyCalorieGoal(totalCalories);
      }
    }
  }, [user]);

  if (!user || !user.mealPlan) {
    return <Text style={styles.error}>No meal plan available</Text>;
  }

  const todayDay = getTodayDay();
  const todayMealPlan = user.mealPlan.week.find((day: { day: string }) => day.day === todayDay);

  if (!todayMealPlan) {
    return <Text style={styles.error}>No meal data available for {todayDay}</Text>;
  }

  const addToCounter = (index: number, meal: { nutritionalInfo: { calories: string } }) => {
    if (consumedMeals.has(index)) return;

    setCaloriesCounter((prev) => prev + parseInt(meal.nutritionalInfo.calories));
    setConsumedMeals(new Set([...consumedMeals, index]));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
  <View style={styles.profileIconsContainer}>
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.profileIcon}>
      <Ionicons name="person-circle-outline" size={50} color="#333" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notificationIcon}>
      <Ionicons name="notifications-outline" size={32} color="#333" />
    </TouchableOpacity>
  </View>

  <View style={styles.greetingSection}>
    <Text style={styles.greeting}>{user?.name}👋</Text>
    <Text style={styles.profileMessage}>Take care of your body. It’s the only place you have to live.</Text>
  </View>
</View>

      <View style={styles.card}>
        <Text style={styles.title}>
          Count your <Text style={styles.bold}>Daily Calories</Text>
        </Text>

        <View style={styles.calorieRow}>
          <Text style={styles.calories}>{caloriesCounter}</Text>
          <Text style={styles.kcal}>KCAL <Text style={styles.bold}>LEFT</Text></Text>
        </View>

        <ProgressBar 
          progress={dailyCalorieGoal > 0 ? Math.min(caloriesCounter / dailyCalorieGoal, 1) : 0} 
          color="#F6735F" 
          style={styles.progressBar} 
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={styles.subtitle}>Meal Plan</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Meal')}>
          <Text style={{ color: '#F6735F', fontWeight: 'bold' }}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mealPlanCard}>
        {todayMealPlan.meals.map((meal: any, index: number) => (
          <View key={index} style={styles.mealItem}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealType}>{meal.mealType}</Text>
          <Text style={styles.mealTime}>{meal.mealTime}</Text>
        </View>
        <Text style={styles.mealText}>{meal.meal}</Text>
        <View style={styles.mealInfoRow}>
          <Text style={styles.mealText}>{meal.nutritionalInfo.calories} kcal</Text>
          <Text style={styles.mealText}>{meal.servingSize}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, consumedMeals.has(index) && styles.disabledButton]}
          onPress={() => addToCounter(index, meal)}
          disabled={consumedMeals.has(index)}
        >
          <Text style={styles.buttonText}>{consumedMeals.has(index) ? "Added" : "Add"}</Text>
        </TouchableOpacity>
          </View>
        ))}
            </View>
    </ScrollView>
  );
};

const ProfilePage = () => {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileHeader}>Profile</Text>
      <Text style={styles.profileContent}>This is the profile page.</Text>
    </View>
  );
};
const Notifications = () => (
  <View style={styles.notificationContainer}>
    <Text style={styles.notificationText}>No new notifications</Text>
  </View>
);
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={MainPage} />
      <Drawer.Screen name="Profile" component={ProfilePage} />
      <Drawer.Screen name="Notifications" component={Notifications} />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  card: { backgroundColor: '#00483D', padding: 20, borderRadius: 20, width: '100%', height: 190, justifyContent: 'center', marginBottom: 20 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '500', marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  calorieRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 },
  calories: { color: '#FFFFFF', fontSize: 58, fontWeight: 'bold' },
  kcal: { paddingBottom: 10, fontSize: 18, color: '#FFFFFF', marginLeft: 0 },
  progressBar: { height: 25, borderRadius: 12, backgroundColor: '#A0B1A0' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  mealPlanCard: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 12, elevation: 4, marginVertical: 10 },
  mealItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  mealType: { fontSize: 18, fontWeight: 'bold' },
  mealText: { fontSize: 16, color: '#555' },
  addButton: { marginTop: 8, backgroundColor: '#F6735F', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#A0A0A0' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { fontSize: 18, fontWeight: 'bold', color: 'red', textAlign: 'center', marginTop: 20 },
  profileSection: { marginBottom: 10 },
  profileIcon: { marginRight: 10 },
  greetingSection: { flex: 1 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  profileMessage: { marginTop:10,fontSize: 16, color: '#888' },
  profileContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  profileHeader: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  profileContent: { fontSize: 16, color: '#666', marginTop: 10 },
  profileIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginLeft: 230,  // Keeps it on the left side of the profile picture
  },
  notificationContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notificationText: { fontSize: 18, color: '#333' },
  mealInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealTime: { fontSize: 16, color: '#555' },

  progressContainer: { marginBottom: 10 },
  progressLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  
});

export default App;
