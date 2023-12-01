import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this package is installed
import { AuthContext } from '../AuthContext';

const Account = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleSignOut = () => {
    // Sign out logic here
    setUser(null);
  };

  return (
    <View style={styles.container}>
      <Icon name="user-circle" size={100} color="white" style={styles.icon} />
      <Text style={styles.emailText}>{user ? user.email : 'Guest'}</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e', // Dark background
  },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white', // White text color
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  signOutButton: {
    backgroundColor: '#FF6347', // Button color
    padding: 10,
    borderRadius: 5,
    shadowColor: 'white', // Button glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white', // Button text color
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  }
});

export default Account;
