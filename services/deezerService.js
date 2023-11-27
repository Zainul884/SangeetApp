// deezerService.js
import axios from 'axios';

const fetchTrackById = async (trackId) => {
  const options = {
    method: 'GET',
    url: `https://deezerdevs-deezer.p.rapidapi.com/track/${trackId}`,
    headers: {
      'X-RapidAPI-Key': 'ae41750b50msh389a7b6e1203026p127800jsnc1c3b5dbac79', 
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchTrackById;
