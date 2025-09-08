import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "departmental-chat",
  "appId": "1:270173256612:web:d4c369d06c9ac79b2b1f31",
  "storageBucket": "departmental-chat.firebasestorage.app",
  "apiKey": "AIzaSyCzOsRXi0-Bei87yry9WtJ1sTo4ZkOlxfY",
  "authDomain": "departmental-chat.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "270173256612"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
