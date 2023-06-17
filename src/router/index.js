import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import MusicPlayer from '../views/MusicPlayer.vue';
import SongList from '../views/SongList.vue';
import Favorites from '../views/Favorites.vue';
import Register from '../views/Register.vue';

Vue.use(VueRouter);

const auth = getAuth();

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            requiresAuth: false, // Set to false because login page doesn't require authentication
        },
    },
    {
        path: '/musicplayer',
        name: 'musicPlayer',
        component: MusicPlayer,
        meta: {
            requiresAuth: true, // Set to true for routes that require authentication
        },
    },
    {
        path: '/songlist',
        name: 'songList',
        component: SongList,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            requiresAuth: false,
        },
    },
];

const router = new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !auth.currentUser) {
        // If the route requires authentication and the user is not logged in, redirect to the login page
        next('/');
    } else {
        // Otherwise, allow the user to proceed to the requested route
        next();
    }
});

export default router;