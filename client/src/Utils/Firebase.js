
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXm5zDa_sGXzATpXmQ-Z-Uoq0X6xNmVhE",
  authDomain: "oportunest.firebaseapp.com",
  projectId: "oportunest",
  storageBucket: "oportunest.appspot.com",
  messagingSenderId: "1083136022214",
  appId: "1:1083136022214:web:318b85958a10782378e9c7",
  measurementId: "G-4WVZCVH7XR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {storage,analytics}
