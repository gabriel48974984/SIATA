// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBUIwdeGpoDCnavYt1j1TVhGOUAcGiMDk",
  authDomain: "siata-cb02e.firebaseapp.com",
  projectId: "siata-cb02e",
  storageBucket: "siata-cb02e.firebasestorage.app",
  messagingSenderId: "255856485143",
  appId: "1:255856485143:web:a8e520196448b689230d52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;