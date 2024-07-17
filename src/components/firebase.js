// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAr1V-aQO5PTR2lTFR5WrMbQhJAQMsj93k",
  authDomain: "nextv-4dc37.firebaseapp.com",
  projectId: "nextv-4dc37",
  storageBucket: "nextv-4dc37.appspot.com",
  messagingSenderId: "300090406657",
  appId: "1:300090406657:web:7e486426073e0cbc7ecd00",
  measurementId: "G-WVZBCPVSFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();



const db = getFirestore(app);

export { db };





