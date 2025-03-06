// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMupwMpCbWJqc81st9ApXFJqPqoDw6XdA",
  authDomain: "elderease-5a703.firebaseapp.com",
  projectId: "elderease-5a703",
  storageBucket: "elderease-5a703.firebasestorage.app",
  messagingSenderId: "1043126649213",
  appId: "1:1043126649213:web:f06c24aa376e0130408c14",
  measurementId: "G-11VBBJGT4M"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
