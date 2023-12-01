import { db } from "../firebaseConfig"; 
import { collection, getDocs, addDoc, query, deleteDoc, doc } from "firebase/firestore";

// Function to get all playlists for a specific user
export async function getUserPlaylists(userId) {
    const playlists = [];
    const q = query(collection(db, "users", userId, "playlists"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        playlists.push({ id: doc.id, ...doc.data() });
    });
    return playlists;
}

// Function to add a new playlist for a user
export async function addPlaylist(userId, playlist) {
    const docRef = await addDoc(collection(db, "users", userId, "playlists"), playlist);
    return docRef.id;
}

export async function deletePlaylist(userId, playlistId) {
    console.log(`Attempting to delete playlist with ID ${playlistId} for user ${userId}`);
    try {
        await deleteDoc(doc(db, "users", userId, "playlists", playlistId));
        console.log(`Playlist ${playlistId} deleted successfully`);
    } catch (error) {
        console.error(`Error deleting playlist ${playlistId}:`, error);
    }
}

// Function to get all songs in a specific playlist
export async function getPlaylistSongs(userId, playlistId) {
    const songs = [];
    const q = query(collection(db, "users", userId, "playlists", playlistId, "songs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        songs.push({ id: doc.id, ...doc.data() });
    });
    return songs;
}

// Function to add a song to a specific playlist
export async function addSongToPlaylist(userId, playlistId, song) {
    const docRef = await addDoc(collection(db, "users", userId, "playlists", playlistId, "songs"), song);
    return docRef.id;
}
export async function removeSongFromPlaylist(userId, playlistId, songId) {
    const songDocPath = `users/${userId}/playlists/${playlistId}/songs/${songId}`;
    console.log(`Attempting to remove song at path: ${songDocPath}`);
    
    try {
        await deleteDoc(doc(db, songDocPath));
        console.log(`Song removed successfully from path: ${songDocPath}`);
        return true; // Indicate success
    } catch (error) {
        console.error(`Error removing song from path ${songDocPath}:`, error);
        return false; // Indicate failure
    }
}
