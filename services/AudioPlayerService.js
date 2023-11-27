import TrackPlayer from 'react-native-track-player';

const Capability = {
  Play: TrackPlayer.CAPABILITY_PLAY,
  PlayFromId: TrackPlayer.CAPABILITY_PLAY_FROM_ID,
  PlayFromSearch: TrackPlayer.CAPABILITY_PLAY_FROM_SEARCH,
  Pause: TrackPlayer.CAPABILITY_PAUSE,
  // Add other capabilities as needed
};

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.PlayFromId,
      // Add other capabilities you want to enable
    ],
  });
};

export { setupPlayer, Capability };
