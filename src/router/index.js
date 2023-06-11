import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import MusicPlayer from '../views/MusicPlayer.vue';
import SongList from '../views/SongList.vue';
import Favorites from '../views/Favorites.vue';
import Register from '../views/Register.vue';

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
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
];

const router = new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL
});

export default router;