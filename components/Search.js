import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const search = async () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Search Error', 'Please enter a search term.');
      return;
    }
    
    const options = {
      method: 'GET',
      url: 'https://shazam-api6.p.rapidapi.com/shazam/search_track/',
      params: { query: searchQuery, limit: '10' },
      headers: {
        'X-RapidAPI-Key': 'ae41750b50msh389a7b6e1203026p127800jsnc1c3b5dbac79', // Replace with your actual API key
        'X-RapidAPI-Host': 'shazam-api6.p.rapidapi.com'
      }
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


  const playSong = (song) => {
    // Construct a song object with the expected structure
    const songData = {
      title: song.heading.title,
      artist: song.heading.subtitle,
      cover: song.images.default, // Ensure this path is correct according to the API response
      previewUrl: song.stores.apple.previewurl // Ensure this path is correct according to the API response
    };

    navigation.navigate('MusicPlayer', { song: songData });
  };


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for songs"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.button} onPress={search}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((song, index) => (
          <View key={index} style={styles.songItem}>
            <Text style={styles.songTitle}>
              {song.heading.title} - {song.heading.subtitle}
            </Text>
            <TouchableOpacity style={styles.playButton} onPress={() => playSong(song)}>
              <FontAwesome name="play" size={24} color="black" />
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
  playButton: {
    // Remove backgroundColor, borderRadius, width, and height for a simple icon
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, // Adjust padding as needed
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
});

export default Search;
