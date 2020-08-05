import * as firebase from "firebase";
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB9Y-LXYOSanoqtrf96n7JsIFy4_75NMTQ",
    authDomain: "bullet-journal-d10dc.firebaseapp.com",
    databaseURL: "https://bullet-journal-d10dc.firebaseio.com",
    projectId: "bullet-journal-d10dc",
    storageBucket: "bullet-journal-d10dc.appspot.com",
    messagingSenderId: "842027935278",
    appId: "1:842027935278:web:783484d8d01ac52306e1bf",
    measurementId: "G-TX3T2J9KLL"
};
 {/* // Initialize Firebase */}
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export default db;

