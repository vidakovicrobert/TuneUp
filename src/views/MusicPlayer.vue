<template>
    <v-card height="615px" style="background-color: #171717;">
        <audio :src="song.songSrc" preload="auto" autoplay ref="audioPlayer"
            @timeupdate="currentTime = $event.target.currentTime; progress = ($event.target.currentTime / duration) * 100"
            @loadedmetadata="duration = $event.target.duration"></audio>
        <v-container>
            <v-row align="center" justify="space-between">
                <v-col cols="3" class="">
                    <v-btn color="red" icon @click="goback" rounded>
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="2">
                    <v-btn icon color="purple" :class="{ 'purple--text': isFavorite(song.id) }"
                        @click.stop="toggleFavorite(song.id)">
                        <v-icon>{{ isFavorite(song.id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
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
            <v-row align="center" justify="center">
                <v-col cols="12">
                    <div class="text-center">
                        <p class="purple--text">{{ song.name }}</p>
                        <p class="grey--text text--darken-1">{{ song.artistName }} - {{ song.albumName }}</p>
                        <p class="grey--text text--darken-1">{{ song.year }}</p>
                    </div>
                </v-col>
                <v-col cols="3" class="text-center">
                    <v-btn small @click="previous" rounded>
                        <v-icon>mdi-skip-previous</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="3" class="text-center">
                    <v-btn @click="togglePlay" rounded>
                        <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="3" class="text-center">
                    <v-btn small @click="next" rounded>
                        <v-icon>mdi-skip-next</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-center">
                    <v-btn icon small @click="toggleSlider">
                        <v-icon>mdi-volume-high</v-icon>
                    </v-btn>
                    <v-slider v-if="showSlider" v-model="volume" max="50" min="0"></v-slider>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-slider v-model="progress" max="100" min="0" class="progress-slider" @change="updateProgress">
                        <template #prepend>
                            <div>{{ formatTime(currentTime) }}</div>
                        </template>
                        <template #append>
                            <div>{{ formatTime(duration) }}</div>
                        </template>
                    </v-slider>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
    
<script>
import { db, auth } from '@/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export default {
    data() {
        return {
            isPlaying: true,
            currentSongIndex: 0,
            localFavorites: [],
            showSlider: false,
            volume: 50,
            currentTime: 0,
            duration: 0,
            audio: 0,
            progress: 0,

        }
    },
    name: 'MusicPlayer',
    watch: {
        volume(newVolume) {
            this.$refs.audioPlayer.volume = newVolume / 50;
        },
    },
    computed: {
        mergedFavorites() {
            return [...this.favorites, ...this.localFavorites];
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
                this.localFavorites = [];
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

            this.$refs.audioPlayer.volume = this.volume / 50;
        },
        next() {
            this.$emit('next');
        },
        previous() {
            this.$emit('previous');

        },
        toggleSlider() {
            this.showSlider = !this.showSlider;
        },
        async toggleFavorite(songId) {
            const user = auth.currentUser;
            if (user) {
                const favoritesDocRef = doc(db, 'users', user.uid, 'favorites', songId);
                const isFavorite = await this.checkFavorite(songId);

                if (isFavorite) {
                    deleteDoc(favoritesDocRef)
                        .then(() => {
                            console.log('Removed from favorites successfully');
                            this.localFavorites = this.localFavorites.filter((song) => song.id !== songId);
                        })
                        .catch((error) => {
                            console.error('Error removing from favorites:', error);
                        });
                } else {
                    const songData = {
                        id: this.song.id,
                        name: this.song.name,
                        artistName: this.song.artistName,
                        albumName: this.song.albumName,
                        year: this.song.year,
                        src: this.song.src,
                        songSrc: this.song.songSrc
                    };

                    setDoc(favoritesDocRef, songData)
                        .then(() => {
                            console.log('Added to favorites successfully');
                            this.localFavorites.push(songData);
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
                const favoritesCollectionRef = collection(db, 'users', user.uid, 'favorites');
                const favoritesSnapshot = await getDocs(favoritesCollectionRef);
                this.localFavorites = favoritesSnapshot.docs.map((doc) => doc.data());
                return this.localFavorites.some((song) => song.id === songId);
            } else {
                return false;
            }
        },
        updateFavorites(favorites) {
            // Emit the updated favorites array to the parent component
            this.$emit('toggle-favorite', favorites);
        },
        isFavorite(songId) {
            return this.mergedFavorites.some((song) => song.id === songId);
        },
        updateProgress(value) {
            this.progress = value;
            const maxDuration = this.duration;
            this.$refs.audioPlayer.currentTime = (maxDuration * value) / 100;
        },
        formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },
        setDuration() {
            if (this.$refs.audioPlayer) {
                this.duration = this.$refs.audioPlayer.duration;
            }
        }
    },
}

</script>
    
<style></style>