import firebase from 'firebase';
// https://www.gstatic.com/firebasejs/${JSCORE_VERSION}/firebase.js

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBez9bqDiQtnJ_U06KeNCcOTnow4ND_6ks",
  authDomain: "instagram-clone-189.firebaseapp.com",
  projectId: "instagram-clone-189",
  storageBucket: "instagram-clone-189.appspot.com",
  messagingSenderId: "513380219247",
  appId: "1:513380219247:web:0d595aca7d9bf92e13909a",
  measurementId: "G-P90JMCJML1"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};

