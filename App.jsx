import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './AuthContext';
import Home from './components/Home';
import MusicPlayer from './components/MusicPlayer';
import Playlists from './components/Playlists';
import PlaylistDetails from './components/PlaylistDetails'; // Import PlaylistDetails
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account'; 
import './firebaseConfig'; 

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
            <Stack.Screen name="PlaylistDetails" component={PlaylistDetails} />
            <Stack.Screen name="Account" component={Account} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
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
