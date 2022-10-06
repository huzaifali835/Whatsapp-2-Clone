import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJLAsaVyTk0eyd6TQvepV3SFlEy1LnQjo",
    authDomain: "whatsapp-2-clone-5bc63.firebaseapp.com",
    projectId: "whatsapp-2-clone-5bc63",
    storageBucket: "whatsapp-2-clone-5bc63.appspot.com",
    messagingSenderId: "866809205089",
    appId: "1:866809205089:web:51f0c22731cdbce3a9b520",
    measurementId: "G-KX7M8DFMG8"
  };
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider};