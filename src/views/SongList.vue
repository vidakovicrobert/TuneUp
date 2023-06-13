<template>
    <v-card height="640px">
        <div v-if="!isPlayerVisible">
            <v-container class="py-8">
                <v-row align="center" justify="end">
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
                <h2 class="purple--text mt-6">Added Songs</h2>
                <v-list>
                    <v-list-item v-for="(song, songIndex) in userSongs" :key="song.id"
                        @click="playSong(list.length + songIndex)">
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
                    <!-- Display the added song -->
                    <v-list-item v-if="selectedFile">
                        <v-row align="center">
                            <v-col cols="2">
                                <v-img :src="selectedFile.src" height="60" contain></v-img>
                            </v-col>
                            <v-col cols="9">
                                <v-list-item-content>
                                    <v-list-item-title class="purple--text">{{ selectedFile.name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-container>
            <v-file-input v-model="selectedFile" label="Select File" outlined dense></v-file-input>
            <v-btn color="primary" @click="submitFile">Submit</v-btn>

        </div>
        <div v-if="isPlayerVisible">
            <MusicPlayer :song="list[currentSongIndex]" :favorites="favorites" @goback="isPlayerVisible = !isPlayerVisible"
                @next="playNext" @previous="playPrevious" />
        </div>
    </v-card>
</template>  

<script>
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase.js';
import { ref, uploadBytes, getDownloadURL, storage, getStorage } from '@/firebase';
import 'firebase/compat/firestore';
import MusicPlayer from './MusicPlayer.vue';


export default {
    name: 'SongList',
    data() {
        return {
            isPlayerVisible: false,
            currentSongIndex: 0,
            favorites: [],
            list: [
                {
                    id: 1,
                    name: 'Cheap Thrills',
                    artistName: 'Adam Lambert',
                    albumName: 'Everything',
                    year: 2021,
                    src: `https://source.unsplash.com/random/400x400?date=1`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample2.mp3`
                },
                {
                    id: 2,
                    name: 'Lean on',
                    artistName: 'Adam Levine',
                    albumName: 'Going Down',
                    year: 2001,
                    src: `https://source.unsplash.com/random/400x400?date=2`,
                    songSrc: `https://filesamples.com/samples/audio/mp3/sample3.mp3`
                },
                {
                    id: 3,
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
        addSong() {
            const newSong = {
                id: this.userSongs.length + 1,
                name: 'New Song',
                artistName: 'Artist',
                albumName: 'Album',
                year: 2023,
                src: 'https://source.unsplash.com/random/400x400?date=new',
                songSrc: '',
                file: this.selectedFile,
            };

            // Add the new song to userSongs array and Firestore
            this.userSongs.push(newSong);
            const songsCollection = collection(db, 'songs');
            addDoc(songsCollection, newSong)
                .then(() => console.log('New song added to Firestore'))
                .catch((error) => console.error('Error adding song:', error));

            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `songs/${newSong.id}/${newSong.file.name}`);
            uploadBytes(storageRef, newSong.file)
                .then(() => console.log('File uploaded successfully'))
                .catch((error) => console.error('Error uploading file:', error));
            // Clear the selected file after successful submission
            this.selectedFile = null;
        },

        submitFile() {
            if (this.selectedFile) {
                const newSong = {
                    id: this.userSongs.length + 1,
                    name: this.selectedFile.name.replace(/^\d+\.\s*/, "").replace(/\.[^.]+$/, ""), // Extract the file name without the extension
                    artistName: '',
                    albumName: '',
                    year: null, //new Date().getFullYear(),
                    src: 'https://source.unsplash.com/random/400x400?date=new',
                    songSrc: '',
                };

                // Upload the file to Firebase Storage
                const storageRef = ref(storage, `songs/${newSong.id}/${this.selectedFile.name}`);
                uploadBytes(storageRef, this.selectedFile)
                    .then(() => {
                        console.log('File uploaded successfully');

                        // Get the download URL of the uploaded file
                        getDownloadURL(storageRef)
                            .then((downloadURL) => {
                                newSong.file = downloadURL;

                                // Add the new song to Firestore
                                const songsCollection = collection(db, 'songs');
                                addDoc(songsCollection, newSong)
                                    .then(() => {
                                        console.log('New song added to Firestore');

                                        // Clear the selected file after successful submission
                                        this.selectedFile = null;

                                        // Update userSongs array with the new song
                                        this.userSongs.push(newSong);
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
        }
    },
    components: {
        MusicPlayer,
    },
}
</script>