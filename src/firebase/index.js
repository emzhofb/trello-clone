import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC4ZSAccR0YHcd-lLDRbMBMbb4v6gU75o0",
    authDomain: "ourtrello.firebaseapp.com",
    databaseURL: "https://ourtrello.firebaseio.com",
    projectId: "ourtrello",
    storageBucket: "ourtrello.appspot.com",
    messagingSenderId: "333841976878"
};

firebase.initializeApp(config);

export default firebase;