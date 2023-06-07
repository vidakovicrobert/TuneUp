<template>
    <v-card>
        <div class="d-flex align-center justify-center" style="margin: 10px; height: 100vh">
            <v-sheet width="400" class="mx-auto">
                <v-form fast-fail @submit.prevent="login">

                    <v-text-field v-model="username" :rules="nameRules" label="Username" required></v-text-field>

                    <v-text-field v-model="password" label="Password"></v-text-field>
                    <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a>

                    <v-btn type="submit" color="primary" block class="mt-2">Sign in</v-btn>

                </v-form>

                <div class="mt-2">
                    <p class="text-body-2">Don't have an account? <a href="#">Sign Up</a></p>
                </div>
                <div class="mt-2">
                    <v-btn type="submit" color="primary" @click="logout" block class="mt-2">Log out</v-btn>
                </div>
                {{ store.current_user }}

            </v-sheet>
        </div>
    </v-card>
</template>
 
<script>
import { signInWithEmailAndPassword, signOut } from "@/firebase"
import { auth } from "@/firebase";
import store from "@/store";

export default {
    name: 'Login',
    data() {
        return {
            username: 'bob@test.com',
            password: '123456',
            store: store,
            nameRules: [ // Define the nameRules property
                v => !!v || 'Username is required',
            ],
        };
    },
    methods: {
        async logout() {
            let response = await signOut(auth);
            console.log("SIGN OUT", response)
        },
        async login() {
            let response = await signInWithEmailAndPassword(auth, this.username, this.password)
            console.log("SIGN IN", response)
        }
    },
};
</script>

<style></style>