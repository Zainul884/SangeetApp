import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../AuthContext';

Sound.setCategory('Playback');

const MusicPlayer = ({ route, navigation }) => {
  const { favorites, updateFavorites } = useContext(AuthContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [volume, setVolume] = useState(1.0);
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volumeSliderAnimation] = useState(new Animated.Value(0));
  const [trackPosition, setTrackPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  const albumDetails = route.params?.album;
  const songDetails = route.params?.song || (albumDetails ? albumDetails.tracks[0] : null);

  useEffect(() => {
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

  useEffect(() => {
    setIsFavorite(favorites.includes(tracks[trackIndex]?.id));
  }, [favorites, trackIndex, tracks]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTrackPosition();
    }, 1000);

    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  const loadTrack = (track, shouldPlay = false) => {
    const previewUrl = track?.previewUrl || track?.preview;
  
    if (sound) {
      sound.stop(() => {
        sound.release();
        setSound(null);
        initializeNewTrack(track, previewUrl, shouldPlay);
        if (shouldPlay) {
          setIsPlaying(true); // Update state here
        }
      });
    } else {
      initializeNewTrack(track, previewUrl, shouldPlay);
      if (shouldPlay) {
        setIsPlaying(true); // Update state here
      }
    }
  };
  

  const initializeNewTrack = (track, previewUrl, shouldPlay) => {
    if (previewUrl) {
      const newSound = new Sound(previewUrl, null, (error) => {
        if (error) {
          return;
        }
  
        setSound(newSound);
        newSound.setVolume(volume);
        setTrackDuration(newSound.getDuration());
  
        if (shouldPlay) {
          newSound.play((success) => {
            if (!success) {
              setIsPlaying(false);
            }
            // No need to set isPlaying here as it's set in loadTrack
          });
        }
      });
    }
  };
  
  const updateTrackPosition = () => {
    if (sound && isPlaying) {
      sound.getCurrentTime((position) => {
        setTrackPosition(position);
      });
    }
  };

  const togglePlayPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
      } else {
        // Assume playback will start, update UI immediately
        setIsPlaying(true);
        sound.play((success) => {
          if (!success) {
            console.error('Playback failed due to audio decoding errors');
            // Revert UI if playback fails
            setIsPlaying(false);
          }
        });
      }
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

  const toggleVolumeControl = () => {
    setIsVolumeControlVisible(!isVolumeControlVisible);
    Animated.timing(volumeSliderAnimation, {
      toValue: isVolumeControlVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onSeek = (value) => {
    const seekPosition = trackDuration * value;
    if (sound) {
      sound.setCurrentTime(seekPosition);
      setTrackPosition(seekPosition);
    }
  };

  const navigateBack = () => {
    sound?.stop();
    navigation.goBack();
  };

  const toggleFavorite = () => {
    const currentSong = tracks[trackIndex];
    const isFavorited = favorites.some(song => song.id === currentSong.id);
    const newFavorites = isFavorited
      ? favorites.filter(song => song.id !== currentSong.id)
      : [...favorites, currentSong];

    updateFavorites(newFavorites);
  };

  const formatTime = (seconds) => {
    const pad = (num, size) => ('000' + num).slice(size * -1);
    const time = parseFloat(seconds).toFixed(0);
    const minutes = Math.floor(time / 60);
    const secondsLeft = time - minutes * 60;
  
    return pad(minutes, 2) + ':' + pad(secondsLeft, 2);
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateBack}>
          <MaterialIcons name="arrow-back" size={35} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.songInfo}>
          <Text style={styles.nowPlaying}>Now Playing</Text>
          <Text style={styles.songTitle}>{tracks[trackIndex]?.title || 'No Track Selected'}</Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite}>
          <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color="black" style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: tracks[trackIndex]?.cover || 'default_cover.jpg' }} style={styles.songImage} />

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleShuffle}>
          <FontAwesome name={isShuffled ? "random" : "retweet"} size={30} color="black" style={styles.icon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePreviousTrack}>
          <MaterialIcons name="skip-previous" size={30} color="black" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <FontAwesome name={isPlaying ? "pause" : "play"} size={30} color="black" style={styles.icon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextTrack}>
          <MaterialIcons name="skip-next" size={30} color="black" style={styles.icon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleVolumeControl}>
          <FontAwesome name={volume > 0 ? "volume-up" : "volume-off"} size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>

        {/* Track Progress Slider */}
        <View style={styles.trackProgressContainer}>
      <Text style={styles.timerText}>{formatTime(trackPosition)}</Text>
      <Slider
        style={styles.trackProgressSlider}
        minimumValue={0}
        maximumValue={1}
        value={trackPosition / trackDuration}
        onValueChange={onSeek}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
        thumbTintColor="#FFFFFF"
      />
      <Text style={styles.timerText}>{formatTime(trackDuration)}</Text>
    </View>

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

  {/* Volume Control Drop-Up */}
  <Animated.View style={[styles.volumeControl, {
        height: volumeSliderAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 80] // Adjust height as needed
        })
      }]}>
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="white"
          maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
          thumbTintColor="white"
        />
      </Animated.View>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
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
    color: 'white', // White text for visibility
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // White text for visibility
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
    paddingVertical: 10,
  },
  // Modify the icons color and add a glow effect
  icon: {
    color: 'white',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  volumeSlider: {
    width: '100%',
    height: 40,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    paddingBottom: 20,
  },
  navIcon: {
    color: 'white',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  volumeControl: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  },
  trackProgressSlider: {
    width: '100%',
    height: 40,
    marginTop: 10,
    backgroundColor: '#1e1e1e', // Adjust the background color as needed
    borderRadius: 10, // Rounded corners for a distinct look
    shadowColor: '#FFFFFF', // White shadow for a glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  trackProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 12,
  },
  trackProgressSlider: {
    flex: 1,
    marginHorizontal: 5, // Add space around the slider
  },
});

export default MusicPlayer;
