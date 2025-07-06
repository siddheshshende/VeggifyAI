import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRXDbXRLMbssvlk-WJ5pO0lEaE1fYuAgw",
  authDomain: "veggify-399c8.firebaseapp.com",
  projectId: "veggify-399c8",
  storageBucket: "veggify-399c8.firebasestorage.app",
  messagingSenderId: "741361749522",
  appId: "1:741361749522:web:050724584be736299612cb",
  measurementId: "G-ZS0MHJHXMT"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// https://veggify-399c8-default-rtdb.firebaseio.com/