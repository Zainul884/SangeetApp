import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getUserPlaylists, getPlaylistSongs, addPlaylist, deletePlaylist, removeSongFromPlaylist } from '../services/playlists-service';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';


const Playlists = () => {
  const navigation = useNavigation();
  const { favorites } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const loadPlaylists = async () => {
      if (user) {
        const loadedPlaylists = await getUserPlaylists(user.uid);
        setPlaylists(loadedPlaylists);
      }
    };
    loadPlaylists();
  }, [user?.uid]);

  const createNewPlaylist = async () => {
    if (newPlaylistName && user) {
      try {
        const playlistId = await addPlaylist(user.uid, {name: newPlaylistName});
        const newPlaylist = {id: playlistId, name: newPlaylistName};
        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName('');
      } catch (error) {
        console.error('Error creating playlist:', error);
      }
    }
  };

  const playPlaylist = async playlistId => {
    if (user) {
      const songs = await getPlaylistSongs(user.uid, playlistId);
      navigation.navigate('MusicPlayer', {songs: songs});
    }
  };

  const removePlaylist = async playlistId => {
    if (!user || !playlistId) return;
    try {
      await deletePlaylist(user.uid, playlistId);
      const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId);
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error('Error in removePlaylist method:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>Your Playlists</Text>

      <View style={styles.createPlaylist}>
        <TextInput
          style={styles.input}
          placeholder="Enter Playlist Name"
          placeholderTextColor="#888"
          value={newPlaylistName}
          onChangeText={text => setNewPlaylistName(text)}
        />
        <TouchableOpacity style={styles.button} onPress={createNewPlaylist}>
          <FontAwesome name="plus" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.playlistContainer}>
        {/* Favorites Playlist */}
        <View style={styles.playlistRow}>
          <TouchableOpacity
            style={styles.playlistButton}
            onPress={() => navigation.navigate('MusicPlayer', {songs: favorites})}
          >
            <Text style={styles.playlistItem}>Favorites</Text>
          </TouchableOpacity>
          <FontAwesome name="play-circle" size={28} style={styles.icon} />
        </View>

        {playlists.map((playlist, index) => (
          <View key={index} style={styles.playlistRow}>
            <TouchableOpacity
              style={styles.playlistButton}
              onPress={() => navigation.navigate('PlaylistDetails', { playlistId: playlist.id })}
            >
              <Text style={styles.playlistItem}>{playlist.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playPlaylist(playlist.id)}>
              <FontAwesome name="play-circle" size={28} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removePlaylist(playlist.id)}>
              <Text style={styles.deleteIcon}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={35} color="black" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MusicPlayer')}>
          <FontAwesome name="headphones" size={35} color="black" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <FontAwesome name="search" size={35} color="black" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Playlists')}>
          <FontAwesome name="list-ul" size={35} color="black" style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // Dark background
    paddingTop: 20,
  },
  backButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white', // White text color
    textAlign: 'center',
    marginVertical: 20,
  },
    createPlaylist: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: 'white',
        marginRight: 10,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    playlistContainer: {
        paddingHorizontal: 10,
    },
    playlistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    playlistButton: {
        flex: 1,
    },
    playlistItem: {
      fontSize: 18,
      color: 'white',
      textShadowColor: 'rgba(255, 255, 255, 0.8)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
    deleteIcon: {
      fontSize: 24,
      color: 'white', 
      paddingHorizontal: 10,
      paddingVertical: 5,
      textShadowColor: 'rgba(255, 255, 255, 0.8)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
    songsDropdown: {
        padding: 10,
        backgroundColor: '#f0f0f0'
    },
    songItem: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 5
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 10,
    },
    navIcon: {
      color: 'white', 
      fontSize: 35, 
      textShadowColor: 'rgba(255, 255, 255, 0.8)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
    icon: {
      color: 'white',
      textShadowColor: 'rgba(255, 255, 255, 0.8)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
});

export default Playlists;
