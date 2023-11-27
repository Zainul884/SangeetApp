// Playlists.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Playlists = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const createNewPlaylist = () => {
    if (newPlaylistName) {
      setPlaylists([...playlists, newPlaylistName]);
      setNewPlaylistName('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { /* Navigate to settings */ }}>
        <FontAwesome name="cog" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Playlists</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search songs and playlists"
      />
      <View style={styles.createPlaylist}>
        <TextInput
          style={styles.input}
          placeholder="Enter playlist name"
          value={newPlaylistName}
          onChangeText={(text) => setNewPlaylistName(text)}
        />
        <TouchableOpacity style={styles.button} onPress={createNewPlaylist}>
          <Text>Create</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {playlists.map((playlist, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('PlaylistDetails', { playlist })}
          >
            <Text style={styles.playlistItem}>{playlist}</Text>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBar: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  createPlaylist: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  playlistItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Playlists;
