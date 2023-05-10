import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDlrJXmE5rbOb749PjLDEOTFA3uqkbVCDk",
    authDomain: "diplomadocuc.firebaseapp.com",
    projectId: "diplomadocuc",
    storageBucket: "diplomadocuc.appspot.com",
    messagingSenderId: "686319701314",
    appId: "1:686319701314:web:9b9509c020f10bbebd4cdb",
    measurementId: "G-KYTLZ2ESYJ"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore();
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


export const signInGoogle = async () => {
    await signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem('user', JSON.stringify(result))
    }).catch((error) => {
      localStorage.setItem('error', error)
    })
  }



  export const crearEmailPassword = async (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
      const user = userCredential.user;
    
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error)
    });
  }

  export const loginEmailPassword = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)

  .then((userCredential) => {
    localStorage.setItem('correo', userCredential.user.email);
    window.location.reload();
  })
  .catch((error) => {
    localStorage.setItem('error', error);
    window.location.reload();
  });
}






 
