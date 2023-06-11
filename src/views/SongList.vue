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
        </div>
        <div v-if="isPlayerVisible">
            <MusicPlayer :song="list[currentSongIndex]" @goback="isPlayerVisible = !isPlayerVisible" @next="playNext"
                @previous="playPrevious" />
        </div>
    </v-card>
</template>  

<script>
import 'firebase/compat/firestore';
import MusicPlayer from './MusicPlayer.vue';


export default {
    data() {
        return {
            isPlayerVisible: false,
            currentSongIndex: 0,
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
    },
    components: {
        MusicPlayer,
    },
    name: 'SongList'
}
</script>