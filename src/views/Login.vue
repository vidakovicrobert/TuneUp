<template>
    <v-card>
        <v-container fill-height fluid class="background">
            <v-row align="center" justify="center">
                <v-col align="center" justify="center" cols="12">
                    <v-card class="card-border" outlined>
                        <v-card-title align="left">Login</v-card-title>
                        <v-card-subtitle align="left">
                            Please log in
                        </v-card-subtitle>
                        <v-card-text>
                            <v-form @submit.prevent="login">
                                <v-text-field v-model="username" dense color="purple" label="Username"
                                    :rules="[rules.required, rules.email]" outlined></v-text-field>

                                <v-text-field v-model="password" dense color="purple" label="Password"
                                    :append-icon="showIcon ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required]"
                                    :type="showIcon ? 'text' : 'password'" @click:append="showIcon = !showIcon"
                                    outlined></v-text-field>

                                <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a>
                                <v-btn type="submit" color="purple lighten-2" block class="mt-2">Log in</v-btn>
                                <p class="text-body-2">Don't have an account? <a href="/Register">Sign Up</a></p>

                            </v-form>
                            <v-btn type="submit" color="purple lighten-2" @click="logout" block class="mt-2">Log
                                out</v-btn>
                        </v-card-text>
                        {{ store.current_user }}
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
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
            rules: {
                required: (value) => !!value || "Required.",
                email: (v) =>
                    !v ||
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid",
            },
            showIcon: false,
        };
    },
    methods: {
        async logout() {
            try {
                let response = await signOut(auth);
                console.log("SIGN OUT", response);
            } catch (error) {
                // Handle logout error
                console.error(error);
            }
        },
        async login() {
            try {
                let response = await signInWithEmailAndPassword(auth, this.username, this.password)
                console.log("SIGN IN", response);
            } catch (error) {
                // Handle login error
                console.error(error);
            }
        }
    }
};
</script>

<style>
.card-border {
    padding: 2%;
}

.card-text-border {
    padding: 2.5%;
}

.card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.btn-right-margin {
    margin-right: 2%;
}
</style>