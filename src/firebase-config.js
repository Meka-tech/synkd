// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9bE8ZvCUOIIge5oj2rmGnzacVr2VjqUo",
  authDomain: "my-project-62629sy.firebaseapp.com",
  projectId: "my-project-62629sy",
  storageBucket: "my-project-62629sy.appspot.com",
  messagingSenderId: "1012060094862",
  appId: "1:1012060094862:web:59e979a833f95d7135a4df",
  measurementId: "G-EZ1YFRD1KV"
};

// Initialize Firebase
let app;
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
}
export const fireStoreDb = getFirestore(app);
