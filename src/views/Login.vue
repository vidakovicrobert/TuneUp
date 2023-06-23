<template>
    <v-card style="background-color: black;" dark>
        <v-container class="background">
            <v-row align="center" justify="center">
                <v-col cols="auto">
                    <v-card-title><span class="purple--text">TuneUp</span></v-card-title>
                </v-col>
                <v-col align="center" justify="center" cols="12">
                    <v-card class="card-border" outlined>
                        <v-card-title align="left">Login</v-card-title>
                        <v-card-subtitle align="left">
                            Please log in
                        </v-card-subtitle>
                        <v-card-text>
                            <v-form @submit.prevent="login">
                                <v-text-field v-model="username" dense color="purple" label="Email"
                                    :rules="[rules.required, rules.email]" outlined></v-text-field>

                                <v-text-field v-model="password" dense color="purple" label="Password"
                                    :append-icon="showIcon ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required]"
                                    :type="showIcon ? 'text' : 'password'" @click:append="showIcon = !showIcon"
                                    outlined></v-text-field>

                                <a href="#" class="text-body-2 font-weight-regular" @click="forgotPassword">Forgot
                                    Password?</a>
                                <v-btn type="submit" color="purple lighten-2" block class="mt-2">Log in</v-btn>
                                <p class="text-body-2">Don't have an account? <a href="/register">Register</a></p>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "@/firebase"
import { auth } from "@/firebase.js";
import store from "@/store";

export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
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
        async login() {
            try {
                let response = await signInWithEmailAndPassword(auth, this.username, this.password)
                console.log("SIGN IN", response);
                this.$router.push("/songlist");
            } catch (error) {
                // Handle login error
                console.error(error);
            }
        },
        async forgotPassword() {
            try {
                await sendPasswordResetEmail(auth, this.username);
                console.log("Password reset email sent successfully.");
                // Show a notification or redirect to a confirmation page
            } catch (error) {
                // Handle error sending password reset email
                console.error(error);
            }
        },
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