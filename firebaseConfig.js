// firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_X1xdsp73fxVFk_btjkROuwL_viW7ng0",
  authDomain: "sangeetapp-92b64.firebaseapp.com",
  projectId: "sangeetapp-92b64",
  storageBucket: "sangeetapp-92b64.appspot.com",
  messagingSenderId: "312834062900",
  appId: "1:312834062900:web:544c257b7e0a3f9959a861"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);