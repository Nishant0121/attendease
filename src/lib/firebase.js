import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkGzoKt3BJzLhQlC5uTlTxc6unmCxUwg4",
  authDomain: "attendease-1daa2.firebaseapp.com",
  projectId: "attendease-1daa2",
  storageBucket: "attendease-1daa2.firebasestorage.app",
  messagingSenderId: "915572404192",
  appId: "1:915572404192:web:bafba4664e0745064d8585",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
