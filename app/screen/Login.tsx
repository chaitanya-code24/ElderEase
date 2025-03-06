import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {FIREBASE_AUTH} from '../../firebaseconfig'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '@/utils/UserContext';

const LoginScreen = ({ navigation }: any) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const {fetchUserData} = useUser();
  const signIn = async () =>{
    setLoading(true);
    try{
      const response = await signInWithEmailAndPassword(auth, email, password);

      //getting uid of the user
      const firebaseUser = response.user;
      const uid = firebaseUser.uid;
      await fetchUserData(uid); //setting uid to usercontext
      console.log('Firebase UID:', uid);

      console.log(response);
      alert("login Success");  
    } catch (error:any) {
      alert("SignIn Failed: "+error.message)
    } finally{
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email} // Controlled input
        onChangeText={setEmail} // Updates state when the text changes
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password} // Controlled input
        onChangeText={setPassword} // Updates state when the text changes

      />

      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.text}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#F6735F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  textContainer: {
    flexDirection: 'row',  // Align the text in a row
    alignItems: 'center',  // Vertically align the text and the link
    marginTop: 20,  // Add space above the text
  },
  linkText: {
    fontSize: 14,
    color: '#00483D', // Green color
    textDecorationLine: 'underline', // Underlined text
  },
});

export default LoginScreen;
