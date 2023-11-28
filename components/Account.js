// AccountScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContext'; // Adjust the path as necessary

const AccountScreen = () => {
  const { user, setUser } = useContext(AuthContext);
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Update the user state to null after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account Page</Text>
      <Text>Email: {user?.email}</Text> {/* Display the user's email */}
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default AccountScreen;
