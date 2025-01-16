"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loginuser, setLoginUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setLoginUser(userSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setLoginUser(null);
      }
      setLoading(false); // Mark loading as complete
    });
    return unsubscribe;
  }, []);

  const addUser = async (
    user,
    name,
    email,
    branch,
    batch,
    division,
    rollNumber
  ) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.user.uid);

      const subjects = [
        "EM-IV",
        "AT",
        "OS",
        "UL",
        "PL",
        "MPL",
        "NL",
        "COA",
        "CNND",
      ];

      const attendance = subjects.map((subject) => ({
        subject,
        total: 0,
        attended: 0,
      }));

      const savedUser = await setDoc(
        userRef,
        {
          uid: user.user.uid,
          name,
          email,
          branch,
          batch,
          division,
          rollNumber,
          attendance,
        },
        { merge: true }
      );
      setLoginUser(savedUser);
      console.log("User added successfully");
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  const signUp = async (
    email,
    password,
    name,
    division,
    batch,
    branch,
    rollNumber
  ) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    await addUser(user, name, email, branch, batch, division, rollNumber);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = () => {
    return signOut(auth);
  };

  return {
    loginuser,
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    addUser,
  };
}
