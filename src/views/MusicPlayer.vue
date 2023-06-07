<template>
    <v-card height="640px">
        <audio :src="song.songSrc" preload="auto" autoplay ref="audioPlayer" />
        <v-container class="py-8">
            <v-row align="center" justify="space-between">
                <v-btn color="red" @click="goback" rounded>
                    <v-icon>mdi-arrow-left</v-icon>
                    <!-- TODO search button -->
                </v-btn>
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
</template>
  
  
<script>
export default {
    data() {
        return {
            isPlaying: true
        }
    },
    name: 'MusicPlayer',
    props: {
        song: {
            id: Number,
            name: String,
            artistName: String,
            albumName: String,
            year: Number,
            src: String,
            songSrc: String
        },
    },
    emits: ['goback', 'next', 'previous'],
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
        }
    }
}
</script>
  
<style></style>