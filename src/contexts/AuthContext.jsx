import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch additional user data from Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            const fallbackUserData = {
              name: currentUser.displayName || 'Student',
              email: currentUser.email || '',
              userType: 'student',
              createdAt: new Date().toISOString(),
              subjects: [],
              stats: {
                totalQuestions: 0,
                correctAnswers: 0,
                examsTaken: 0,
                practiceSessions: 0
              }
            };
            await setDoc(userRef, fallbackUserData, { merge: true });
            setUserData(fallbackUserData);
          }
        } catch (err) {
          console.error('Failed to load user profile:', err);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const signup = async (email, password, name, userType = 'student') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    await updateProfile(result.user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      userType,
      createdAt: new Date().toISOString(),
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

  const isAdmin = userData?.userType === 'admin';

  const value = {
    user,
    userData,
    loading,
    login,
    signup,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
