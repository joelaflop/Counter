var firebase = require("firebase/app");
var auth = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDSSrr36DZUSlf8RWXh3-ICTsNk8b32INk",
  authDomain: "counter-1589c.firebaseapp.com",
  databaseURL: "https://counter-1589c.firebaseio.com",
  projectId: "counter-1589c",
  storageBucket: "counter-1589c.appspot.com",
  messagingSenderId: "4535620226",
  appId: "1:4535620226:web:21580c420b49f925b81a9b",
  measurementId: "G-D7ZNG0G3HD"
};

firebase.initializeApp(firebaseConfig);

module.exports = {
    signup: function (email, password){
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message)
        // ...
      });
   },

   login: function (email, password){
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message)
        // ...
      });
   }
};
