import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import MusicPlayer from '../views/MusicPlayer.vue';
import SongList from '../views/SongList.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/musicplayer',
        name: 'musicPlayer',
        component: MusicPlayer
    },
    {
        path: '/songlist',
        name: 'songList',
        component: SongList
    },

];

const router = new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL
});

export default router;