import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkGzoKt3BJzLhQlC5uTlTxc6unmCxUwg4",
  authDomain: "attendease-1daa2.firebaseapp.com",
  projectId: "attendease-1daa2",
  storageBucket: "attendease-1daa2.firebasestorage.app",
  messagingSenderId: "915572404192",
  appId: "1:915572404192:web:bafba4664e0745064d8585",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
