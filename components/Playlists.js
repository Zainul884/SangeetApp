
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getUserPlaylists, getPlaylistSongs, addPlaylist } from '../services/playlists-service';
import { getAuth } from 'firebase/auth';

const Playlists = ({ navigation }) => {
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    const loadPlaylists = async () => {
        if (user) {
            const loadedPlaylists = await getUserPlaylists(user.uid);
            setPlaylists(loadedPlaylists);
        }
    };

    useEffect(() => {
        loadPlaylists();
    }, [user?.uid]);

    const createNewPlaylist = async () => {
        if (newPlaylistName && user) {
            try {
                const playlistId = await addPlaylist(user.uid, { name: newPlaylistName });
                const newPlaylist = { id: playlistId, name: newPlaylistName };
                setPlaylists([...playlists, newPlaylist]);
                setNewPlaylistName('');
            } catch (error) {
                console.error("Error creating playlist:", error);
            }
        }
    };

    const playPlaylist = async (playlistId) => {
      if (user) {
        const songs = await getPlaylistSongs(user.uid, playlistId);
        navigation.navigate('MusicPlayer', { songs: songs });
      }
    };
  

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Playlists</Text>
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
                    <View key={index} style={styles.playlistRow}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PlaylistDetails', { playlistId: playlist.id })}
                        >
                            <Text style={styles.playlistItem}>{playlist.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => playPlaylist(playlist.id)}>
                            <FontAwesome name="play-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
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
        marginVertical: 10,
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
        marginRight: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    playlistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    playlistItem: {
        fontSize: 16,
    },
});

export default Playlists;
