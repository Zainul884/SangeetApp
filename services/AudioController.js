// AudioController.js
import Sound from 'react-native-sound';

let globalSound = null;

export const loadSound = (url, callback) => {
  globalSound?.release();
  globalSound = new Sound(url, null, (error) => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
    callback?.(globalSound);
  });
};

export const playSound = () => {
  globalSound?.play((success) => {
    if (!success) {
      console.log('Playback failed due to audio decoding errors');
    }
  });
};

export const pauseSound = () => {
  if (globalSound?.isPlaying()) {
    globalSound.pause();
  }
};

export const stopSound = () => {
  globalSound?.stop();
};
