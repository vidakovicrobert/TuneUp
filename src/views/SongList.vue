<template>
    <v-card>
        <div v-if="!isPlayerVisible">
            <v-container class="py-8">
                <v-row align="center" justify="center">
                    <v-dialog v-model="dialog" :max-width="expanded ? '800px' : '350px'">
                        <template v-slot:activator="{ on, attrs }">
                            <v-col cols="8">
                                <v-btn color="red darken-2" icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-playlist-plus</v-icon>
                                </v-btn>
                            </v-col>
                        </template>

                        <v-card class="card-border" outlined>
                            <v-card-title>Add a Song</v-card-title>
                            <v-card-text>
                                <v-file-input v-model="selectedFile" label="Select File" color="gray" outlined
                                    dense></v-file-input>
                                <v-btn color="purple lighten-2" @click="submitFile">Submit</v-btn>
                            </v-card-text>

                        </v-card>
                    </v-dialog>

                    <v-col cols="4">
                        <span class="purple--text">Music App</span>
                    </v-col>
                    <!-- TODO hamburger menu i dodaci -->

                </v-row>
            </v-container>
            <v-container>
                <v-list>
                    <v-list-item v-for="(song, songIndex) in list" :key="song.id" @click="playSong(songIndex)">
                        <v-row align="center">
                            <v-col cols="2">
                                <v-img :src="song.src" height="60" contain></v-img>
                            </v-col>
                            <v-col cols="9">
                                <v-list-item-content>
                                    <v-list-item-title class="purple--text">{{ song.name }}</v-list-item-title>
                                    <v-list-item-subtitle class="grey--text text--darken-1">{{ song.artistName }} - {{
                                        song.albumName }} ({{ song.year }})</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-container>

            <v-container>
                <v-list>
                    <template v-if="userSongs.length">
                        <h3 class="purple--text mt-6">Added Songs</h3>
                        <v-list-item v-for="(song, songIndex) in userSongs" :key="song.id"
                            @click="playUserSong(list.length + songIndex)">
                            <v-row align="center">
                                <v-col cols="2">
                                    <v-img :src="song.src" height="60" contain></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <v-list-item-content>
                                        <v-list-item-title class="purple--text">{{ song.name }}</v-list-item-title>
                                        <v-list-item-subtitle class="grey--text text--darken-1">{{ song.artistName }} - {{
                                            song.albumName }} ({{ song.year }})</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-col>
                                <v-col cols="4">
                                    <v-btn color="error" icon x-small @click.stop="removeSong(song.id)">
                                        <v-icon>mdi-delete-outline</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </template>
                </v-list>
            </v-container>
        </div>
        <div v-if="isPlayerVisible">
            <MusicPlayer :song="selectedUserSong" @goback="isPlayerVisible = !isPlayerVisible" @next="playNext"
                @previous="playPrevious" />
        </div>
    </v-card>
</template>  

<script>
import { collection, doc, addDoc, onSnapshot, deleteDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject, storage } from '@/firebase';
import MusicPlayer from './MusicPlayer.vue';


export default {
    name: 'SongList',
    created() {
        const storedSongs = JSON.parse(localStorage.getItem('userSongs'));
        if (storedSongs) {
            this.userSongs = storedSongs;
        }
        this.$on('song-selected', (song) => {
            this.selectedUserSong = song;
        });

        // Get the currently authenticated user
        const user = auth.currentUser;

        if (user) {
            // Get a reference to the "songs" collection of the user's document
            const userSongsCollectionRef = collection(doc(db, 'users', user.uid), 'songs');

            // Listen for real-time updates to the user's songs
            onSnapshot(userSongsCollectionRef, (snapshot) => {
                this.userSongs = snapshot.docs.map((doc) => doc.data());
            });
        }
    },
    data() {
        return {
            isPlayerVisible: false,
            currentSongIndex: 0,
            list: [
                {
                    id: '1',
                    name: 'Cheap Thrills',
                    artistName: 'Adam Lambert',
                    albumName: 'Everything',
                    year: 2021,
                    src: `https://source.unsplash.com/random/400x400?date=1`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample2.mp3`
                },
                {
                    id: '2',
                    name: 'Lean on',
                    artistName: 'Adam Levine',
                    albumName: 'Going Down',
                    year: 2001,
                    src: `https://source.unsplash.com/random/400x400?date=2`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample3.mp3`
                },
                {
                    id: '3',
                    name: 'Counting Stars',
                    artistName: 'Adam Hart',
                    albumName: 'Spice It Up',
                    year: 2013,
                    src: `https://source.unsplash.com/random/400x400?date=3`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample1.mp3`
                },
            ],
            userSongs: [],
            selectedUserSong: null,
            selectedFile: null,
            dialog: false,
            expanded: false,
        }
    },
    methods: {
        playUserSong(index) {
            const userSongIndex = index - this.list.length;
            const selectedSong = this.userSongs[userSongIndex];

            this.currentSongIndex = index;
            this.isPlayerVisible = true;

            this.$emit('song-selected', selectedSong);
            // Stop any previously playing audio
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.audio.removeEventListener('ended', this.playNext);
            }

            // Create a new audio object and set the source
            this.audio = new Audio(selectedSong.songSrc);

            // Add an event listener to handle the end of playback
            this.audio.addEventListener('ended', this.playNext);

        },
        playSong(index) {
            this.$emit('song-selected', this.list[index]);
            this.currentSongIndex = index;
            this.isPlayerVisible = true;
        },
        playNext() {
            if (this.currentSongIndex < this.list.length + this.userSongs.length - 1) {
                this.currentSongIndex += 1;
            } else {
                this.currentSongIndex = 0;
            }

            if (this.currentSongIndex >= this.list.length) {
                const userSongIndex = this.currentSongIndex - this.list.length;
                this.selectedUserSong = this.userSongs[userSongIndex];
                this.$emit('song-selected', this.selectedUserSong);
            } else {
                this.selectedUserSong = null;
                this.$emit('song-selected', this.list[this.currentSongIndex]);
            }
        },
        playPrevious() {
            if (this.currentSongIndex != 0) {
                this.currentSongIndex -= 1;
            } else {
                this.currentSongIndex = this.list.length + this.userSongs.length - 1;
            }

            if (this.currentSongIndex >= this.list.length) {
                const userSongIndex = this.currentSongIndex - this.list.length;
                this.selectedUserSong = this.userSongs[userSongIndex];
                this.$emit('song-selected', this.selectedUserSong);
            } else {
                this.selectedUserSong = null;
                this.$emit('song-selected', this.list[this.currentSongIndex]);
            }
        },
        addSong(song) {
            // Update the userSongs array and store it in browser storage
            this.userSongs.push(song);
            localStorage.setItem('userSongs', JSON.stringify(this.userSongs));

            // Get the currently authenticated user
            const user = auth.currentUser; // Get the current user from `auth.currentUser`

            if (user) {
                // Get a reference to the user's document
                const userDocRef = doc(db, 'users', user.uid);

                // Add the new song to the "songs" subcollection of the user's document
                const songDocRef = doc(collection(userDocRef, 'songs'), song.id);
                setDoc(songDocRef, song)
                    .then(() => {
                        console.log('Song added successfully');
                    })
                    .catch((error) => {
                        console.error('Error adding song:', error);
                    });
            } else {
                console.error('User is not authenticated');
            }
        },
        submitFile() {
            if (!this.selectedFile) {
                return;
            }

            const newSong = {
                id: 'song-' + Date.now(),
                name: this.selectedFile.name.replace(/^\d+\.\s*/, "").replace(/\.[^.]+$/, ""),
                artistName: '',
                albumName: '',
                year: null,
                src: 'https://source.unsplash.com/random/400x400?date',
                songSrc: '', // Initialize songSrc
                file: this.selectedFile,
            };

            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `songs/${newSong.id}/${this.selectedFile.name}`);
            uploadBytes(storageRef, this.selectedFile)
                .then(() => {
                    console.log('File uploaded successfully');

                    // Get the download URL of the uploaded file
                    getDownloadURL(storageRef)
                        .then((downloadURL) => {
                            newSong.file = {
                                name: this.selectedFile.name,
                                downloadURL: downloadURL,
                            };

                            // Assign the download URL to songSrc
                            newSong.songSrc = downloadURL;

                            console.log('Added song:', newSong.name, newSong.songSrc);

                            // Clear the selected file after successful submission
                            this.selectedFile = null;

                            this.addSong(newSong);
                            this.dialog = false;
                        })
                        .catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        },

        // FIXED !!! 
        removeSong(songId) {
            // Get the currently authenticated user
            const user = auth.currentUser; // Get the current user from `auth.currentUser`

            if (user) {
                // Get a reference to the user's document
                const userDocRef = doc(db, 'users', user.uid);

                // Get a reference to the song document
                const songDocRef = doc(collection(userDocRef, 'songs'), songId);

                // Delete the song document
                deleteDoc(songDocRef)
                    .then(() => {
                        console.log('Firestore document deleted successfully');

                        // Remove the song from the userSongs array
                        this.userSongs = this.userSongs.filter((song) => song.id !== songId);
                        localStorage.setItem('userSongs', JSON.stringify(this.userSongs));
                    })
                    .catch((error) => {
                        console.error('Error deleting Firestore document:', error);
                    });
            } else {
                console.error('User is not authenticated'); // Handle the case when the user is not authenticated
            }
        },

    },
    components: {
        MusicPlayer,
    },
}
</script>

<style>
.card-border {
    padding: 2%;
}

.card-text-border {
    padding: 2.5%;
}

.card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.btn-right-margin {
    margin-right: 2%;
}
</style>