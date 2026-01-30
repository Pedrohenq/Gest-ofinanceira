import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCTkkfwnCYVaS5_Tkk_xunTR9pmpy47FN0",
  authDomain: "gestaofinanceira-312a1.firebaseapp.com",
  projectId: "gestaofinanceira-312a1",
  storageBucket: "gestaofinanceira-312a1.firebasestorage.app",
  messagingSenderId: "680507133940",
  appId: "1:680507133940:web:9ecc477d2917d5f56773a1",
  measurementId: "G-LZR9S8EYMV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Analytics (opcional, só funciona em produção)
if (typeof window !== 'undefined') {
  try {
    getAnalytics(app);
  } catch (error) {
    console.log('Analytics não disponível:', error);
  }
}
