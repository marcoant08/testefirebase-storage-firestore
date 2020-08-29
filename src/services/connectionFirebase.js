import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "***********************",
  authDomain: "***********************",
  databaseURL: "***********************",
  projectId: "***********************",
  storageBucket: "***********************",
  messagingSenderId: "***********************",
  appId: "***********************",
  measurementId: "***********************",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  //firebase.firestore();
  //firebase.auth();
  //firebase.storage();
}

export default firebase;
