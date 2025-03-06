import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ProgressBar } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import axios from "axios";
import { useUser } from '@/utils/UserContext';


const FormScreen = ({ navigation, route }: any) => {
  const { email, uid } = route.params;

  const [progress, setProgress] = useState(0.0625);
  const [currentStep, setCurrentStep] = useState(0);

  // Input values
  const [phoneNo, setPhoneNo] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [healthIssues, setHealthIssues] = useState('');
  const [allergies, setAllergies] = useState('');
  const [cuisines, setCuisines] = useState('');
  const [goal, setGoal] = useState('');
  const [doctorNo, setDoctorNo] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [mealPreferences, setMealPreferences] = useState('');

  const [loading, setLoading] = useState(false);
  const {fetchUserData} = useUser();

  const handleNext = async () => {
    if (currentStep < 15) {
      setCurrentStep(currentStep + 1);
      setProgress((currentStep + 1) / 16);
    } else {
      const userData = {
        uid,
        phoneNo,
        email,
        name,
        age,
        weight,
        height,
        gender,
        healthIssues,
        allergies,
        cuisines,
        goal,
        doctorNo,
        extraInfo,
        birthDate,
        activityLevel,
        dietaryRestrictions,
        mealPreferences,
      };

      setLoading(true);
      console.log(userData)
      try {
        const response = await axios.post('http://192.168.1.3:5001/register', userData);
        console.log("API Response:", response.data);// Log API response
        await fetchUserData(uid);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainTab' }],
          })
        );
      } catch (error:any) {
        
        console.error('Error inserting data:', error.response ? error.response.data : error.message);
      }
    }
    ;

  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} color="#4CAF50" style={styles.progressBar} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Submitting your data...</Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {currentStep === 0 && (
            <>
              <Text style={styles.label}>Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Phone no"
                value={phoneNo}
                onChangeText={setPhoneNo}
              />
            </>
          )}
          {currentStep === 1 && (
            <>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </>
          )}
          {currentStep === 3 && (
            <>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your height"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </>
          )}
          {currentStep === 4 && (
            <>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your weight"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </>
          )}
          {currentStep === 5 && (
            <>
              <Text style={styles.label}>Gender</Text>
              <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </>
          )}
          {currentStep === 6 && (
            <>
              <Text style={styles.label}>Health Issues</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter any health issues"
                value={healthIssues}
                onChangeText={setHealthIssues}
              />
            </>
          )}
          {currentStep === 7 && (
            <>
              <Text style={styles.label}>Allergies</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter any allergies"
                value={allergies}
                onChangeText={setAllergies}
              />
            </>
          )}
          {currentStep === 8 && (
            <>
              <Text style={styles.label}>Cuisines</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your preferred cuisines"
                value={cuisines}
                onChangeText={setCuisines}
              />
            </>
          )}
          {currentStep === 9 && (
            <>
              <Text style={styles.label}>Goal</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your goal"
                value={goal}
                onChangeText={setGoal}
              />
            </>
          )}
          {currentStep === 10 && (
            <>
              <Text style={styles.label}>Doctor's Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter doctor's number"
                value={doctorNo}
                onChangeText={setDoctorNo}
              />
            </>
          )}
          {currentStep === 11 && (
            <>
              <Text style={styles.label}>Extra Info</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter any extra information"
                value={extraInfo}
                onChangeText={setExtraInfo}
              />
            </>
          )}
          {currentStep === 12 && (
            <>
              <Text style={styles.label}>Birth Date</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your birth date"
                value={birthDate}
                onChangeText={setBirthDate}
              />
            </>
          )}
          {currentStep === 13 && (
            <>
              <Text style={styles.label}>Activity Level</Text>
              <Picker selectedValue={activityLevel} onValueChange={setActivityLevel} style={styles.picker}>
                <Picker.Item label="Select Activity Level" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Moderate" value="moderate" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </>
          )}
                    {currentStep === 14 && (
            <>
              <Text style={styles.label}>Dietary Restrictions</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter dietary restrictions"
                value={dietaryRestrictions}
                onChangeText={setDietaryRestrictions}
              />
            </>
          )}
          {currentStep === 15 && (
            <>
              <Text style={styles.label}>Meal Preferences</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter meal preferences"
                value={mealPreferences}
                onChangeText={setMealPreferences}
              />
            </>
          )}
        </View>
      )}

      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>
          {currentStep < 15 ? 'Next' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F6735F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default FormScreen;
