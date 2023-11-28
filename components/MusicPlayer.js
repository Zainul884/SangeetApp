// MusicPlayer.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

Sound.setCategory('Playback');

const MusicPlayer = ({ route, navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [volume, setVolume] = useState(1.0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);

  const albumDetails = route.params?.album;
  const songDetails = route.params?.song || (albumDetails ? albumDetails.tracks[0] : null);

  useEffect(() => {
    // Determine the source of tracks (album, single song, or playlist)
    let sourceTracks = songDetails || albumDetails?.tracks || route.params?.songs;
    
    if (sourceTracks) {
      setTracks(Array.isArray(sourceTracks) ? sourceTracks : [sourceTracks]);
      setTrackIndex(0);
      loadTrack(Array.isArray(sourceTracks) ? sourceTracks[0] : sourceTracks, true);
    }

    return () => {
      if (sound) {
        sound.release();
        setSound(null);
      }
    };
  }, [route.params]);
  

  const loadTrack = (track, shouldPlay = false) => {
    console.log('Attempting to load track:', track.title);
    const previewUrl = track?.previewUrl || track?.preview;
    console.log('Preview URL:', previewUrl);
  
    if (previewUrl) {
      console.log('Initializing sound object...');
      const newSound = new Sound(previewUrl, null, (error) => {
        if (error) {
          console.error('Failed to load the sound', error);
          return;
        }
        console.log(`Track loaded successfully: ${track.title}`);
        setSound(newSound);
        newSound.setVolume(volume);
        console.log('Sound object set and volume adjusted');
  
        if (shouldPlay) {
          console.log('Playing sound...');
          newSound.play((success) => {
            if (!success) {
              console.error('Playback failed due to audio decoding errors');
            } else {
              console.log('Playback successful');
            }
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      });
    } else {
      console.error('No preview URL found for the track:', track.title);
    }
  };
  
  

  const togglePlayPause = () => {
    console.log('Toggling play/pause. Current isPlaying:', isPlaying);
    if (sound) {
      console.log('Sound object exists:', sound);
      
      if (isPlaying) {
        console.log('Pausing playback');
        sound.pause();
      } else {
        console.log('Starting playback');
        sound.play(() => {
          console.log('Playback completed');
          setIsPlaying(false);
        });
      }
      
      setIsPlaying(!isPlaying);
    } else {
      console.error('No sound object found to play/pause.');
    }
  };
  


  const handleNextTrack = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
      loadTrack(tracks[trackIndex + 1], true);
    }
  };

  const handlePreviousTrack = () => {
    if (trackIndex > 0) {
      setTrackIndex(trackIndex - 1);
      loadTrack(tracks[trackIndex - 1], true);
    }
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
      const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
      setTracks(shuffledTracks);
      setTrackIndex(0);
      loadTrack(shuffledTracks[0], true);
    } else {
      if (albumDetails?.tracks) {
        setTracks(albumDetails.tracks);
        setTrackIndex(0);
        loadTrack(albumDetails.tracks[0], true);
      }
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (sound) {
      sound.setVolume(newVolume);
    }
  };

  const navigateBack = () => {
    sound?.stop();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateBack}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.songInfo}>
          <Text style={styles.nowPlaying}>Now Playing</Text>
          <Text style={styles.songTitle}>{tracks[trackIndex]?.title || 'No Track Selected'}</Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <FontAwesome name="heart-o" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: tracks[trackIndex]?.cover || 'default_cover.jpg' }} style={styles.songImage} />

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleShuffle}>
          <FontAwesome name={isShuffled ? "random" : "retweet"} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePreviousTrack}>
          <MaterialIcons name="skip-previous" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextTrack}>
          <MaterialIcons name="skip-next" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVolume(volume > 0 ? 0 : 1.0)}>
          <FontAwesome name={volume > 0 ? "volume-up" : "volume-off"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  songInfo: {
    alignItems: 'center',
  },
  nowPlaying: {
    fontSize: 12,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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

export default MusicPlayer;

