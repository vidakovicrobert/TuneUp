<template>
    <v-card>
        <v-container>
            <v-card-title>Favorite Songs</v-card-title>
            <v-list>
                <v-list-item v-for="(song, index) in getFavoriteSongs()" :key="index">
                    <v-list-item-content>
                        <v-row>
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
                            <v-col cols="1">
                                <v-btn icon :class="{ 'purple--text': isFavorite(song.id) }"
                                    @click.stop="toggleFavorite(song.id)">
                                    <v-icon>{{ isFavorite(song.id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                                </v-btn>

                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-container>
    </v-card>
</template>
  
<script>
export default {
    name: 'Favorites',

    props: {
        list: Array,
        favorites: Array
    },
    methods: {
        getFavoriteSongs() {
            return this.list.filter(song => this.favorites.includes(song.id));
        },
        toggleFavorite(songId) {
            // Access the toggleFavorite method from the parent component
            this.$emit('toggle-favorite', songId);
        },
        isFavorite(songId) {
            // Access the isFavorite method from the parent component
            return this.favorites.includes(songId);
        }
    },
};
</script>