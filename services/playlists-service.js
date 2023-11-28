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

// Function to delete a specific playlist
export async function deletePlaylist(userId, playlistId) {
    await deleteDoc(doc(db, "users", userId, "playlists", playlistId));
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

// Function to delete a song from a playlist
export async function deleteSongFromPlaylist(userId, playlistId, songId) {
    await deleteDoc(doc(db, "users", userId, "playlists", playlistId, "songs", songId));
}
