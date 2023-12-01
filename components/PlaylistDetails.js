import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { getPlaylistSongs, addSongToPlaylist } from '../services/playlists-service';
import { getAuth } from 'firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PlaylistDetails = ({ route, navigation }) => {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { playlistId } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const loadSongs = async () => {
      if (user && playlistId) {
        const loadedSongs = await getPlaylistSongs(user.uid, playlistId);
        setSongs(loadedSongs);
      }
    };
    loadSongs();
  }, [playlistId, user]);

  const searchSongs = async () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Search Error', 'Please enter a search term.');
      return;
    }
    const options = {
      method: 'GET',
      url: 'https://shazam-api6.p.rapidapi.com/shazam/search_track/',
      params: { query: searchQuery, limit: '10' },
      headers: {
        'X-RapidAPI-Key': 'ae41750b50msh389a7b6e1203026p127800jsnc1c3b5dbac79',
        'X-RapidAPI-Host': 'shazam-api6.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data && response.data.result && response.data.result.tracks) {
        setSearchResults(response.data.result.tracks.hits);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error during song search:', error);
      Alert.alert('Search Error', 'An error occurred during the song search.');
    }
  };

  const addSongToPlaylistHandler = async (song) => {
    try {
      const songData = {
        title: song.heading.title,
        artist: song.heading.subtitle,
        cover: song.images.default,
        previewUrl: song.stores.apple.previewurl,
      };

      await addSongToPlaylist(user.uid, playlistId, songData);
      setSongs([...songs, songData]);
      Alert.alert('Success', 'Song added to playlist.');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      Alert.alert('Error', 'There was a problem adding the song to the playlist.');
    }
  };

  const removeSongFromPlaylistHandler = async (songId, index) => {
    try {
        const isRemoved = await removeSongFromPlaylist(user.uid, playlistId, songId);
        if (isRemoved) {
            const updatedSongs = songs.filter((_, idx) => idx !== index);
            setSongs(updatedSongs);
            Alert.alert('Success', 'Song removed from playlist.');
        }
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      Alert.alert('Error', 'There was a problem removing the song from the playlist.');
    }
};

  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for songs"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.button} onPress={searchSongs}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((song, index) => (
          <View key={index} style={styles.songItem}>
            <Text style={styles.songTitle}>
              {song.heading.title} - {song.heading.subtitle}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => addSongToPlaylistHandler(song)}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.playlistContainer}>
        <Text style={styles.playlistTitle}>Playlist</Text>
        {songs.map((song, index) => (
          <View key={index} style={styles.playlistSongContainer}>
            <Text style={styles.playlistSong}>
              {song.title} - {song.artist}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  resultsContainer: {
    marginBottom: 16,
  },
  songItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 16,
    color: '#333',
    width: '80%',
  },
  playlistContainer: {
    marginTop: 16,
  },
  playlistTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  playlistSong: {
    fontSize: 18,
    color: 'white',
    paddingVertical: 8,
  },
  backButton: {
    padding: 10,
  },
  playlistSongContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default PlaylistDetails;
