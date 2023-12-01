import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const ArtistDetailScreen = ({ route }) => {
  const { artist } = route.params;

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: artist.cover }} style={styles.imageBackground}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{artist.name}</Text>
        </View>
      </ImageBackground>
      <Text style={styles.description}>{artist.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});

export default ArtistDetailScreen;
