import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0RYZGqx4VfOb3-z-v6mgx54z_SWRxvic",
  authDomain: "exam-lab-maldives.firebaseapp.com",
  projectId: "exam-lab-maldives",
  storageBucket: "exam-lab-maldives.firebasestorage.app",
  messagingSenderId: "814228758812",
  appId: "1:814228758812:web:239677fa1da62517145ad9",
  measurementId: "G-XL1EK68TW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
