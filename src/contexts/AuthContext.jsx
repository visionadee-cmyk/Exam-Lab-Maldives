import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import {
  loadOrCreateUserProfile,
  profileFromAuthUser
} from '../lib/userProfile';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Auth session only — avoid async Firestore work inside onAuthStateChanged (IDB race).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserData(null);
        setProfileError(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Profile load runs in a separate effect when uid is known.
  useEffect(() => {
    if (!user?.uid) return;

    let cancelled = false;
    setLoading(true);
    setProfileError(null);

    (async () => {
      try {
        await user.getIdToken();
        if (cancelled) return;

        const data = await loadOrCreateUserProfile(user);
        if (!cancelled) {
          setUserData(data);
          setProfileError(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load user profile:', err);
        setProfileError(err?.code || err?.message || 'profile-load-failed');
        // Keep app usable when rules/network fail (practice uses local JSON).
        setUserData({
          ...profileFromAuthUser(user),
          _profileOffline: true
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await result.user.getIdToken();
      await setDoc(
        doc(db, 'users', result.user.uid),
        { lastLogin: new Date().toISOString() },
        { merge: true }
      );
    }
    return result;
  };

  const signup = async (email, password, name, userType = 'student') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, { displayName: name });

    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      userType,
      plan: 'free',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      subjects: [],
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        examsTaken: 0,
        practiceSessions: 0
      }
    });

    return result;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin =
    userData?.userType === 'admin' || user?.email === 'retey.ay@hotmail.com';

  const value = {
    user,
    userData,
    loading,
    profileError,
    login,
    signup,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
