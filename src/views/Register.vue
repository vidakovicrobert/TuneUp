<template>
    <v-card>
        <v-container fill-height fluid class="background">
            <v-row align="center" justify="center">
                <v-col align="center" justify="center" cols="12">
                    <v-card class="card-border" width="600px" outlined>
                        <v-card-title align="left">Register</v-card-title>
                        <v-card-subtitle align="left">
                            Please register.
                        </v-card-subtitle>
                        <v-card-text>
                            <v-form v-model="valid">
                                <v-text-field v-model="username" dense label="Username" clearble type="text" color="purple"
                                    :rules="[rules.required]" outlined></v-text-field>
                                <v-text-field v-model="email" dense label="Email" clearble type="text" color="purple"
                                    :rules="[rules.required, rules.email]" outlined></v-text-field>
                                <v-text-field v-model="password" dense label="Password" color="purple" clearble
                                    :append-icon="showIcon ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]"
                                    :type="showIcon ? 'text' : 'password'" @click:append="showIcon = !showIcon"
                                    outlined></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="card-actions">
                            <v-btn class="btn-right-margin" @click="clearFormData" color="red darken-3" outlined>
                                CLEAR
                            </v-btn>
                            <v-btn :disabled="isButtonDisabled" outlined @click="registerUser" color="purple">
                                OK
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { doc, auth, db, setDoc, createUserWithEmailAndPassword } from "@/firebase.js";
export default {
    name: "Registration",
    components: {},
    watch: {
        valid: function (isValid) {
            this.isButtonDisabled = isValid != true;
        },
    },
    data() {
        return {
            isButtonDisabled: false,
            valid: true,
            username: null,
            email: null,
            password: null,
            showIcon: false,
            rules: {
                required: (value) => !!value || "Required",
                min: (v) => v?.length >= 7 || "Min 7 characters",
                email: (v) =>
                    !v ||
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid",
            },
        };
    },
    created() { },
    mounted() { },
    destroyed() { },
    methods: {
        clearFormData() {
            this.username = null;
            this.email = null;
            this.password = null;
        },
        postActionMoveToView() {
            this.$router.push({ path: "/songlist" });
        },
        async saveAdditionalData(user, email, username) {
            await setDoc(doc(db, "users", email), {
                Email: email,
                UserName: username,
                AuthorisationType: "USER",
            });
        },
        registerUser() {
            //debugger;
            const email = this.email;
            const password = this.password;
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    //debugger;
                    const user = userCredential.user;
                    const username = this.username;
                    this.saveAdditionalData(user, email, username);
                    this.postActionMoveToView();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error, errorCode, errorMessage);
                });
        },
    },
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
