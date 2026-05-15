import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function profileFromAuthUser(currentUser) {
  return {
    name: currentUser.displayName || 'Student',
    email: currentUser.email || '',
    userType: 'student',
    plan: 'free',
    subjects: [],
    stats: {
      totalQuestions: 0,
      correctAnswers: 0,
      examsTaken: 0,
      practiceSessions: 0
    }
  };
}

/** Load Firestore profile; create if missing. Caller should await getIdToken() first. */
export async function loadOrCreateUserProfile(currentUser) {
  const userRef = doc(db, 'users', currentUser.uid);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  const fallback = {
    ...profileFromAuthUser(currentUser),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  await setDoc(userRef, fallback, { merge: true });
  return fallback;
}
