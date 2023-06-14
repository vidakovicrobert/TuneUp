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

            <v-container v-if="userSongs.length > 0 || selectedFile">
                <v-list>
                    <h3 class="purple--text mt-6">Added Songs</h3>
                    <v-list-item v-for="(song, songIndex) in userSongs" :key="song.id"
                        @click="playSong(list.length + songIndex)">
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

                </v-list>
            </v-container>
        </div>
        <div v-if="isPlayerVisible">
            <MusicPlayer :song="list[currentSongIndex]" :favorites="favorites" @goback="isPlayerVisible = !isPlayerVisible"
                @next="playNext" @previous="playPrevious" />
        </div>
    </v-card>
</template>  

<script>
import { collection, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject, storage, getStorage } from '@/firebase';
import 'firebase/compat/firestore';
import MusicPlayer from './MusicPlayer.vue';


export default {
    name: 'SongList',
    created() {
        const storedSongs = JSON.parse(localStorage.getItem('userSongs'));
        if (storedSongs) {
            this.userSongs = storedSongs;
        }
    },
    data() {
        return {
            isPlayerVisible: false,
            currentSongIndex: 0,
            favorites: [],
            list: [
                {
                    id: 'predefined-1',
                    name: 'Cheap Thrills',
                    artistName: 'Adam Lambert',
                    albumName: 'Everything',
                    year: 2021,
                    src: `https://source.unsplash.com/random/400x400?date=1`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample2.mp3`
                },
                {
                    id: 'predefined-2',
                    name: 'Lean on',
                    artistName: 'Adam Levine',
                    albumName: 'Going Down',
                    year: 2001,
                    src: `https://source.unsplash.com/random/400x400?date=2`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample3.mp3`
                },
                {
                    id: 'predefined-3',
                    name: 'Counting Stars',
                    artistName: 'Adam Hart',
                    albumName: 'Spice It Up',
                    year: 2013,
                    src: `https://source.unsplash.com/random/400x400?date=3`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample1.mp3`
                }
            ],
            userSongs: [],
            selectedFile: null,
            dialog: false,
            expanded: false,
        }
    },
    methods: {
        playSong(index) {
            this.$emit('song-selected', this.list[index]);
            this.currentSongIndex = index;
            this.isPlayerVisible = true;
        },
        playNext() {
            if (this.currentSongIndex < this.list.length - 1) {
                this.currentSongIndex += 1;
            } else {
                this.currentSongIndex = 0;
            }
        },
        playPrevious() {
            if (this.currentSongIndex != 0) {
                this.currentSongIndex -= 1;
            } else {
                this.currentSongIndex = this.list.length - 1;
            }
        },


        // FIX not deleting document !!!

        removeSong(songId) {
            const songIndex = this.userSongs.findIndex((song) => song.id === songId);
            if (songIndex === -1) return;

            const song = this.userSongs[songIndex];
            this.userSongs.splice(songIndex, 1);
            localStorage.setItem('userSongs', JSON.stringify(this.userSongs));

            // Delete the song file from Firebase Storage
            const storageRef = ref(storage, `songs/${songId}/${song.file.name}`);
            deleteObject(storageRef)
                .then(() => {
                    console.log('File deleted successfully');

                    // Delete the Firestore document
                    const songDocRef = doc(db, 'songs', songId);
                    console.log('Deleting Firestore document:', songDocRef.path);
                    deleteDoc(songDocRef)
                        .then(() => {
                            console.log('Firestore document deleted successfully');
                        })
                        .catch((error) => {
                            console.error('Error deleting Firestore document:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error deleting file:', error);
                });
        },

        addSong() {
            // Check if a file is selected
            if (!this.selectedFile) {
                return;
            }

            const newSong = {
                id: 'user-' + Date.now(),
                name: 'New Song',
                artistName: 'Artist',
                albumName: 'Album',
                year: 2023,
                src: 'https://source.unsplash.com/random/400x400?date=new',
                songSrc: 'https://example.com/new-song.mp3',
                file: this.selectedFile,
            };

            // Update the userSongs array and store it in browser storage
            this.userSongs.push(newSong);
            localStorage.setItem('userSongs', JSON.stringify(this.userSongs));

            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `songs/${newSong.id}/${newSong.file.name}`);
            uploadBytes(storageRef, newSong.file)
                .then(() => {
                    console.log('File uploaded successfully');

                    // Get the download URL of the uploaded file
                    getDownloadURL(storageRef)
                        .then((downloadURL) => {
                            newSong.file = {
                                name: newSong.file.name,
                                downloadURL: downloadURL,
                            };

                            // Clear the selected file after successful submission
                            this.selectedFile = null;

                            // Add the new song to Firestore
                            const songsCollection = collection(db, 'songs');
                            addDoc(songsCollection, newSong)
                                .then(() => {
                                    console.log('New song added to Firestore');
                                })
                                .catch((error) => {
                                    console.error('Error adding song:', error);
                                });
                        })
                        .catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        },

        submitFile() {
            if (this.selectedFile) {
                const newSong = {
                    id: 'user-' + Date.now(),
                    name: this.selectedFile.name.replace(/^\d+\.\s*/, "").replace(/\.[^.]+$/, ""),
                    artistName: '',
                    albumName: '',
                    year: null,
                    src: 'https://source.unsplash.com/random/400x400?date=new',
                    songSrc: 'https://example.com/new-song.mp3',
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

                                // Clear the selected file after successful submission
                                this.selectedFile = null;

                                // Add the new song to Firestore
                                const songsCollection = collection(db, 'songs');
                                addDoc(songsCollection, newSong)
                                    .then(() => {
                                        console.log('New song added to Firestore');

                                        // Update the userSongs array and store it in browser storage
                                        this.userSongs.push(newSong);
                                        localStorage.setItem('userSongs', JSON.stringify(this.userSongs));
                                    })
                                    .catch((error) => {
                                        console.error('Error adding song:', error);
                                    });
                            })
                            .catch((error) => {
                                console.error('Error getting download URL:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', error);
                    });
            }
            this.dialog = false;

        }

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