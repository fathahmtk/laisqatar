import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TO MAKE THIS WORK IN PRODUCTION:
// 1. Go to console.firebase.google.com
// 2. Create a new project "Lais Qatar"
// 3. Add a Web App
// 4. Copy the config object below and replace the process.env variables or paste directly
// 5. Enable "Authentication" > "Email/Password"
// 6. Enable "Firestore Database" > Start in Test Mode

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyD-PLACEHOLDER-KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "lais-qatar.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "lais-qatar",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "lais-qatar.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;