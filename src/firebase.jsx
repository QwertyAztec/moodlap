import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOxrnzsrs49dz_u0rjIzCJC78mItlDG9I",
  authDomain: "cosychristmas-journal.firebaseapp.com",
  projectId: "cosychristmas-journal",
  storageBucket: "cosychristmas-journal.firebasestorage.app",
  messagingSenderId: "933608715568",
  appId: "1:933608715568:web:d2bc4a430568dabf9004f5",
  measurementId: "G-5CFNJJ4ZKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics only works in production
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app };
