import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // ... any other user data
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  const updateFavorites = async (newFavorites) => {
    console.log("Updating favorites:", newFavorites);
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  

  return (
    <AuthContext.Provider value={{ user, setUser, favorites, updateFavorites }}>
      {children}
    </AuthContext.Provider>
  );
};
