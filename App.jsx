// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './AuthContext';
import Home from './components/Home';
import MusicPlayer from './components/MusicPlayer';
import Playlists from './components/Playlists';
import Login from './components/Login';
import './firebaseConfig'; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="MusicPlayer" component={MusicPlayer} />
            <Stack.Screen name="Playlists" component={Playlists} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
