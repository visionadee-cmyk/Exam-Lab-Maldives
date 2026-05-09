import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDruhILEw7xD-lruMJbpBC8S_EZavLr24I",
  authDomain: "exam-lab-mv.firebaseapp.com",
  projectId: "exam-lab-mv",
  storageBucket: "exam-lab-mv.firebasestorage.app",
  messagingSenderId: "593133464131",
  appId: "1:593133464131:web:0b646a000e1e553b4a42f6",
  measurementId: "G-VLZ2P3MWXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
