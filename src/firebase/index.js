import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyASLFi6zkSwCd7BuurIgX85t0oOoyRXwLs",
    authDomain: "chat-app-7d08b.firebaseapp.com",
    projectId: "chat-app-7d08b",
    storageBucket: "chat-app-7d08b.appspot.com",
    messagingSenderId: "327559083858",
    appId: "1:327559083858:web:828ca674b8cfe31a99ec8b",
    measurementId: "G-TBGGERBBGM"
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export {
    db,
    auth
}
export default firebaseApp;