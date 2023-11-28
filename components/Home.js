/// Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [topSongs, setTopSongs] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);

  useEffect(() => {
    fetchTopSongsFromSpotify();
    fetchRelatedArtistsFromSpotify();
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

  const navigateToProfile = () => {
    console.log('Available routes:', navigation.getState());
    navigation.navigate('Account');
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Home</Text>
        <TouchableOpacity onPress={navigateToProfile}>
          <FontAwesome name="user-circle-o" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <HorizontalList title="Top Songs" data={topSongs} navigation={navigation} type="song" />
        <HorizontalList title="Related Artists" data={relatedArtists} navigation={navigation} type="artist" />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MusicPlayer')}>
          <FontAwesome name="headphones" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Playlists')}>
          <FontAwesome name="list-ul" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const HorizontalList = ({ title, data, navigation, type }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <Text style={styles.noDataText}>No data available for {title}</Text>;
  }

 const handlePress = (item) => {
  if (type === 'song') {
    navigation.navigate('MusicPlayer', { song: item });
  } else if (type === 'artist' && item.spotifyUrl) {
    // Open Spotify URL for the artist
    Linking.openURL(item.spotifyUrl);
  }
};




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
            <Text style={styles.itemTitle}>{type === 'song' ? item.title : item.name}</Text>
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
    backgroundColor: 'white',
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  horizontalList: {
    marginBottom: 20,
  },
  listItem: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemTitle: {
    position: 'absolute',
    bottom: 10,
    left: 5,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
});

export default Home;