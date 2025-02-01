import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC10FGUZ3iNyNmdEHd9_9NMxCdmu7MMH2M",
  authDomain: "subb-97a31.firebaseapp.com",
  projectId: "subb-97a31",
  storageBucket: "subb-97a31.firebasestorage.app",
  messagingSenderId: "853479142934",
  appId: "1:853479142934:web:a17307e5834081d77f6737",
  measurementId: "G-QE5BB00H8G",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default firestore;
