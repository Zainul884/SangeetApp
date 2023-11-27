import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Clear AsyncStorage for testing purposes
    // AsyncStorage.clear(); // Uncomment this line for testing

    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('onAuthStateChanged triggered', firebaseUser); // Debugging line
      if (firebaseUser) {
        // User is signed in, update state and AsyncStorage
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // ... any other user data you want to store
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('User signed in, data saved to AsyncStorage'); // Debugging line
      } else {
        // User is signed out, update state and clear AsyncStorage
        setUser(null);
        await AsyncStorage.removeItem('user');
        console.log('User signed out, data cleared from AsyncStorage'); // Debugging line
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
