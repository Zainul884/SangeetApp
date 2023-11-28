import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Button, Alert } from 'react-native';
import axios from 'axios';
import { getPlaylistSongs, addSongToPlaylist } from '../services/playlists-service';
import { getAuth } from 'firebase/auth';

const PlaylistDetails = ({ route }) => {
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
          'X-RapidAPI-Host': 'shazam-api6.p.rapidapi.com'
        }
      };
  
      try {
        const response = await axios.request(options);
        if (response.data && response.data.result && response.data.result.tracks) {
          setSearchResults(response.data.result.tracks.hits); // Update this line to match Shazam's response format
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
        previewUrl: song.stores.apple.previewurl
      };
  
      await addSongToPlaylist(user.uid, playlistId, songData);
      setSongs([...songs, songData]);
      Alert.alert('Success', 'Song added to playlist.');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      Alert.alert('Error', 'There was a problem adding the song to the playlist.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for songs"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={searchSongs} />

      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((song, index) => (
          <View key={song.key} style={styles.songItem}>
            <Text>
              {song.heading.title} - {song.heading.subtitle}
            </Text>
            <Button title="Add to Playlist" onPress={() => addSongToPlaylistHandler(song)} />
          </View>
        ))}
      </ScrollView>

      {/* Displaying the list of songs in the playlist */}
      <View style={styles.playlistContainer}>
        <Text style={styles.playlistTitle}>Playlist:</Text>
        {songs.map((song, index) => (
          <Text key={index} style={styles.playlistSong}>
            {song.title} - {song.artist}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  resultsContainer: {
    marginBottom: 10,
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

export default PlaylistDetails;
