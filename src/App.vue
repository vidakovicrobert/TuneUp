<template>
  <v-app>
    <v-app-bar app color dark>

      <v-toolbar-title>TuneUp</v-toolbar-title>

      <v-spacer></v-spacer>
      <!--
      <v-btn value="login" to="/">
        <span>Login</span>
      </v-btn>

      <v-btn value="register" to="/register">
        <span>Register</span>
      </v-btn>

      <v-btn value="songlist" to="/songlist">
        <span>Song List</span>
      </v-btn>

      <v-btn value="favorites" to="/favorites">
        <span>Favorites</span>
      </v-btn>

      <v-spacer></v-spacer>
      -->
    </v-app-bar>
    <v-spacer></v-spacer>
    <v-main>
      <router-view class="phone-screen" :list="list" @song-selected="updateList" />
    </v-main>

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
  height: 640px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>