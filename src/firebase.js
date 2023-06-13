// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import { doc, addDoc, getDoc, setDoc, getCount, getFirestore, collection } from 'firebase/firestore'
import { getAuth, updatePassword, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, confirmPasswordReset, beforeAuthStateChanged, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBwubyyKwxkkAS5vghTPM7ZeNPlnAwoJQI",
    authDomain: "tuneup-eb6c7.firebaseapp.com",
    projectId: "tuneup-eb6c7",
    storageBucket: "tuneup-eb6c7.appspot.com",
    messagingSenderId: "981825808225",
    appId: "1:981825808225:web:3d8f2744edce082da80720",
    measurementId: "G-5ZK9RDN551"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage();
const db = getFirestore(app);
const analytics = getAnalytics(app);

export {
    app, auth,
    storage,
    getAuth,
    db,
    doc,
    getDoc,
    setDoc,
    addDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    ref,
    uploadBytes,
    getDownloadURL,
    signOut,
    updatePassword,
}
