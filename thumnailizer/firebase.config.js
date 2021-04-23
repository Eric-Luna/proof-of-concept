import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

console.log({env: process.env})

const config = {
  apiKey: "AIzaSyCt7gbz5zRKBTL6dt2PI-vp34iowkjt0qU",
  authDomain: "imgrszr-dc5dd.firebaseapp.com",
  projectId: "imgrszr-dc5dd",
  storageBucket: "imgrszr-dc5dd.appspot.com",
  messagingSenderId: "31675348623",
  appId: "1:31675348623:web:6e10abe4183dab3dd022fa",
  measurementId: "G-3QF1V1SFJ0"
}

try {
  firebase.initializeApp(config);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

export const app = firebase.app();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export default firebase;
