<template>
  <v-app>
    <v-app-bar app color dark>

      <!--<v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>-->

      <v-toolbar-title>TuneUp</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn value="login" to="/">
        <span>Login</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>

      <v-btn value="songlist" to="/songlist">
        <span>Song List</span>
        <v-icon>mdi-playlist-music</v-icon>
      </v-btn>

      <v-btn value="favorites" to="/favorites">
        <span>Favorites</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <router-view class="phone-screen" :list="list" :favorites="favorites" @song-selected="updateList" />
    </v-main>
    <!--
    <v-card>
      <v-bottom-navigation v-model="activePage" dark>

        <v-btn value="login" to="/">
          <span>Login</span>
          <v-icon>mdi-login</v-icon>
        </v-btn>

        <v-btn value="songlist" to="/songlist">
          <span>Song List</span>
          <v-icon>mdi-playlist-music</v-icon>
        </v-btn>

        <v-btn value="favorites" to="/favorites">
          <span>Favorites</span>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

      </v-bottom-navigation>
    </v-card>
    -->
  </v-app>
</template>  

<script>
import { RouterView } from 'vue-router';
import store from "@/store"
import { onAuthStateChanged, auth } from "@/firebase"
import { list } from 'firebase/storage';

onAuthStateChanged(auth, user => {
  console.log("PROMJENA KORISNIKA", user)
  store.current_user = user?.email;
})

export default {
  name: 'App',

  data: () => ({
    activePage: '/',
    favorites: [],
    list: []
  }),
  methods: {
    updateList(song) {
      this.list = [song];
    },
  },
  components: {
    RouterView,

  },
}
</script>

<style>
.phone-screen {
  background-color: #000;
  width: 360px;
  /* Adjust the width as needed */
  height: 640px;
  /* Adjust the height as needed */
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
