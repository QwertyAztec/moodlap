import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOxrnzsrs49dz_u0rjIzCJC78mItlDG9I",
  authDomain: "cosychristmas-journal.firebaseapp.com",
  projectId: "cosychristmas-journal",
  storageBucket: "cosychristmas-journal.firebasestorage.app",
  messagingSenderId: "933608715568",
  appId: "1:933608715568:web:d2bc4a430568dabf9004f5",
  measurementId: "G-5CFNJJ4ZKY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);