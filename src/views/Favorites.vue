<template>
    <v-card style="background-color: black;" dark>
        <v-container class="background">
            <v-row align="center" justify="space-between">
                <v-col cols="auto">
                    <v-card-title><span class="purple--text">Favorite Songs</span></v-card-title>
                </v-col>
            </v-row>
            <v-card class="card-border" outlined v-if="favorites.length > 0">
                <v-list align="left" style="max-height: 500px; overflow-y: auto; overflow-x: hidden;">
                    <v-list-item v-for="song in favorites" :key="song.id">
                        <v-row align="center">
                            <v-col cols="2">
                                <v-img :src="song.src" height="60" contain></v-img>
                            </v-col>
                            <v-col cols="5">
                                <v-list-item-content>
                                    <v-list-item-title class="purple--text">{{ song.name }}</v-list-item-title>
                                    <v-list-item-subtitle class="grey--text text--darken-1">{{ song.artistName }} - {{
                                        song.albumName }} ({{ song.year }})</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-col>
                            <v-col cols="2">
                                <v-btn icon x-small :class="{ 'purple--text': isFavorite(song.id) }"
                                    @click="removeFromFavorites(song.id)">
                                    <v-icon>{{ isFavorite(song.id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-card>
            <v-card v-else>
                <v-card-text>No favorite songs found.</v-card-text>
            </v-card>
        </v-container>
    </v-card>
</template>
  
<script>
import { db, auth } from '@/firebase';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

export default {
    name: 'Favorites',
    data() {
        return {
            favorites: [],
        };
    },
    created() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const userFavoritesRef = collection(db, 'users', user.uid, 'favorites');
                onSnapshot(userFavoritesRef, (snapshot) => {
                    if (!snapshot.empty) {
                        this.favorites = snapshot.docs.map((doc) => doc.data());
                    }
                });
            } else {
                this.favorites = [];
            }
        });
    },
    methods: {
        removeFromFavorites(songId) {
            const user = auth.currentUser;
            if (user) {
                const favoritesDocRef = doc(db, 'users', user.uid, 'favorites', songId);
                deleteDoc(favoritesDocRef)
                    .then(() => {
                        // Remove the song from the favorites array
                        this.favorites = this.favorites.filter((song) => song.id !== songId);
                        console.log('Removed from favorites successfully');
                    })
                    .catch((error) => {
                        console.error('Error removing from favorites:', error);
                    });
            } else {
                console.error('User is not authenticated');
            }
        },
        isFavorite(songId) {
            return this.favorites.some((song) => song.id === songId);
        },
    },
};
</script>