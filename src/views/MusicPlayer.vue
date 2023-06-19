<template>
    <div>
        <audio :src="song.songSrc" preload="auto" autoplay ref="audioPlayer"></audio>
        <v-card height="640px">
            <v-container class="py-8">
                <v-row align="center" justify="space-between">
                    <v-col cols="3" class="">
                        <v-btn color="red" icon @click="goback" rounded>
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                    </v-col>
                    <!-- TODO search button -->
                    <v-col cols="2">
                        <v-btn icon :class="{ 'purple--text': checkFavorite(song.id) }"
                            @click.stop="toggleFavorite(song.id)">
                            <v-icon>{{ checkFavorite(song.id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" sm="9" md="9">
                        <v-img class="rounded" :src="song.src" style="max-height: 100%;" contain />
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="12">
                        <div class="text-center">
                            <p class="purple--text">{{ song.name }}</p>
                            <p class="grey--text text--darken-1">{{ song.artistName }} - {{ song.albumName }}</p>
                            <p class="grey--text text--darken-1">{{ song.year }}</p>
                        </div>
                    </v-col>
                    <v-col cols="3" class="text-center">
                        <v-btn color="" @click="previous" rounded>
                            <v-icon>mdi-skip-previous</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="3" class="text-center">
                        <v-btn color="" @click="togglePlay" rounded>
                            <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="3" class="text-center">
                        <v-btn color="" @click="next" rounded>
                            <v-icon>mdi-skip-next</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <favorites :list="list" @toggle-favorite="toggleFavorite" />
    </div>
</template>
    
    
<script>
import Favorites from './Favorites.vue';
import { db, auth } from '@/firebase'; // Adjust the path based on your project structure
import { collection, doc, getDoc, setDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';

export default {
    data() {
        return {
            isPlaying: true,
            currentSongIndex: 0,
            localFavorites: [], // New local data property for favorites
        }
    },
    name: 'MusicPlayer',
    components: {
        Favorites
    },
    computed: {
        isFavorite() {
            return this.checkFavorite(this.song.id);
        },

    },
    created() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const userFavoritesRef = collection(doc(db, 'users', user.uid), 'favorites');
                onSnapshot(userFavoritesRef, (snapshot) => {
                    if (!snapshot.empty) {
                        this.localFavorites = snapshot.docs.map((doc) => doc.data());
                    }
                });
            } else {
                this.favorites = [];
            }
        });
    },
    props: {
        song: {
            type: Object,
            default: () => ({
                id: 0,
                name: '',
                artistName: '',
                albumName: '',
                year: '',
                src: '',
                songSrc: ''
            }),
        },
        favorites: {
            type: Array,
            default: () => [],
        },
        list: {
            type: Array,
            default: () => [],
        },

    },
    emits: ['goback', 'next', 'previous', 'toggle-favorite'],
    methods: {
        goback() {
            this.$emit('goback');
        },
        togglePlay() {
            if (this.isPlaying) {
                this.$refs.audioPlayer.pause();
            } else {
                this.$refs.audioPlayer.play();
            }

            this.isPlaying = !this.isPlaying;
        },
        next() {
            this.$emit('next');
        },
        previous() {
            this.$emit('previous');
        },
        async toggleFavorite(songId) {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const favoritesDocRef = doc(collection(userDocRef, 'favorites'), songId);
                const isFavorite = await this.checkFavorite(songId);

                if (isFavorite) {
                    deleteDoc(favoritesDocRef)
                        .then(() => {
                            console.log('Removed from favorites successfully');
                            this.localFavorites = this.localFavorites.filter((song) => song.id !== songId);
                            this.$emit('toggle-favorite', this.localFavorites); // Emit updated favorites array
                        })
                        .catch((error) => {
                            console.error('Error removing from favorites:', error);
                        });
                } else {
                    setDoc(favoritesDocRef, {})
                        .then(() => {
                            console.log('Added to favorites successfully');
                            this.localFavorites.push(this.song);
                            this.$emit('toggle-favorite', this.localFavorites); // Emit updated favorites array
                        })
                        .catch((error) => {
                            console.error('Error adding to favorites:', error);
                        });
                }
            } else {
                console.error('User is not authenticated');
            }
        },
        async checkFavorite(songId) {
            const user = auth.currentUser;
            if (user) {
                const favoritesDocRef = doc(db, 'users', user.uid, 'favorites', songId);
                const docSnapshot = await getDoc(favoritesDocRef);
                return docSnapshot.exists();
            } else {
                return false;
            }
        },
    },
}

</script>
    
<style></style>