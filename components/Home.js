// Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ImageBackground } from 'react-native';

import axios from 'axios';

const Home = ({ navigation }) => {
  const [topSongs, setTopSongs] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchTopSongsFromSpotify();
    fetchRelatedArtistsFromSpotify();
    fetchPlaylistsFromSpotify();
  }, []);

  const fetchTopSongsFromSpotify = async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/recommendations/',
      params: {
        limit: '10',
        seed_tracks: '0c6xIDDpzE81m2q797ordA',
        seed_artists: '4NHQUGzhtTLFvgF5SZesLK',
        seed_genres: 'classical,country'
      },
      headers: {
        'X-RapidAPI-Key': 'ae41750b50msh389a7b6e1203026p127800jsnc1c3b5dbac79',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const recommendations = response.data.tracks;
      const formattedSongs = recommendations.map((track) => ({
        id: track.id,
        title: track.name,
        cover: track.album.images[0].url,
        preview: track.preview_url // Add preview URL here
      }));
      setTopSongs(formattedSongs);
    } catch (error) {
      console.error('Error fetching top songs from Spotify:', error);
    }
  };

  const fetchRelatedArtistsFromSpotify = async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/artist_related/',
      params: { id: '2w9zwq3AktTeYYMuhMjju8' },
      headers: {
        'X-RapidAPI-Key': 'ae41750b50msh389a7b6e1203026p127800jsnc1c3b5dbac79',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const artists = response.data.artists;
      const formattedArtists = artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        cover: artist.images[0].url,
        genres: artist.genres.join(', '), // Combining genres
        spotifyUrl: artist.external_urls.spotify // Storing Spotify URL
      }));
      setRelatedArtists(formattedArtists);
    } catch (error) {
      console.error('Error fetching related artists from Spotify:', error);
    }
  };

  const fetchPlaylistsFromSpotify = async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/playlist_tracks/',
      params: {
        id: '37i9dQZF1DX4Wsb4d7NKfP',
        offset: '0',
        limit: '100'
      },
      headers: {
        'X-RapidAPI-Key': 'ae41750b50msh389a7b6e1203026p127800jsnc1c3b5dbac79',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const playlistData = response.data.items.map(item => ({
        id: item.track.id,
        title: item.track.name,
        cover: item.track.album.images[0].url,
        preview: item.track.preview_url
      }));
      setPlaylists(playlistData);
    } catch (error) {
      console.error('Error fetching playlists from Spotify:', error);
    }
  };


  const navigateToProfile = () => {
    console.log('Available routes:', navigation.getState());
    navigation.navigate('Account');
  };
  
  

  return (

    <ImageBackground
    source={require('../images/home.png')} // Replace with the correct path to your gradient image
    style={styles.container}
    resizeMode="cover"
  >

    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateToProfile}>
          <FontAwesome name="user-circle-o" size={30} color="white"/>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <HorizontalList title="Top Songs" data={topSongs} navigation={navigation} type="song" />
        <HorizontalList title="Related Artists" data={relatedArtists} navigation={navigation} type="artist" />
        <HorizontalList title="Playlists" data={playlists} navigation={navigation} type="playlist" />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MusicPlayer')}>
          <FontAwesome name="headphones" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <FontAwesome name="search" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Playlists')}>
          <FontAwesome name="bars" style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
}

const HorizontalList = ({ title, data, navigation, type }) => {
  const handlePress = (item) => {
    if (type === 'song') {
      navigation.navigate('MusicPlayer', { song: item });
    } else if (type === 'playlist') {
      navigation.navigate('MusicPlayer', { songs: data });
    } else if (type === 'artist') {
      navigation.navigate('ArtistDetailScreen', { artist: item });
    }
  };

  if (!Array.isArray(data) || data.length === 0) {
    return <Text style={styles.noDataText}>No data available for {title}</Text>;
  }

  return (
    <View style={styles.horizontalList}>
      <Text style={styles.listTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handlePress(item)}
          >
            <View style={styles.listItem}>
              <Image source={{ uri: item.cover }} style={styles.listItemCover} />
              <Text style={styles.itemTitle}>
                {type === 'artist' ? item.name : item.title}
              </Text>
              {type === 'artist' && <Text style={styles.itemDescription}>{item.description}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // Dark background
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align items to the end of the container
    alignItems: 'center',
    padding: 10,
    paddingTop: 40, // Adjusted for StatusBar
    backgroundColor: 'transparent',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Text color for visibility on dark background
  },
  scrollView: {
    flex: 1,
  },
  horizontalList: {
    marginBottom: 20,
  },

  listItem: {
    width: 130,
    height: 130,
    marginRight: 10,
    borderRadius: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929', // Dark background for list item
    shadowColor: 'white', // Color of the glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, // Full opacity for a strong glow effect
    shadowRadius: 15, // Increased radius for a wider glow
    elevation: 5,
    borderColor: 'white', // White border to enhance the glowing effect
    borderWidth: 1,
  },
  listItemCover: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemTitle: {
    position: 'absolute',
    bottom: 10,
    left: 5,
    right: 5,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'white',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  navIcon: {
    color: 'white', // Set the icon color to white
    fontSize: 35,    // Increase the icon size
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Change color to white
    marginBottom: 10,
  },
});


export default Home;
