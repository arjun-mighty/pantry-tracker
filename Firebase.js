// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxQp0YPtNfFJfdAyyVCTQx4fzsOnSMLOA",
  authDomain: "inventory-management-38138.firebaseapp.com",
  projectId: "inventory-management-38138",
  storageBucket: "inventory-management-38138.appspot.com",
  messagingSenderId: "956806491951",
  appId: "1:956806491951:web:f599e40f2405c0730ebbda",
  measurementId: "G-EZ7VXKJXFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};