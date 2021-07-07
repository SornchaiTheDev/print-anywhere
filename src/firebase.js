import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7HuqjFUCza_kfz2wKMc58js_9riexAP0",
  authDomain: "smte-printanywhere.firebaseapp.com",
  projectId: "smte-printanywhere",
  storageBucket: "smte-printanywhere.appspot.com",
  messagingSenderId: "222080332666",
  appId: "1:222080332666:web:4b6b6e03b8496efad59cc3",
};

export default !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
export const firestore = firebase.firestore;

export const auth = firebase.auth;
export const storage = firebase.storage;
export const googleAuth = new firebase.auth.GoogleAuthProvider();
