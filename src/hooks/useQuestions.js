import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../services/firebase';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchQuestions = useCallback(async (filters = {}, pageSize = 20) => {
    setLoading(true);
    setError(null);
    
    try {
      let q = collection(db, 'questions');
      const constraints = [];
      
      if (filters.subject) {
        constraints.push(where('subjectId', '==', filters.subject));
      }
      if (filters.topic) {
        constraints.push(where('topic', '==', filters.topic));
      }
      if (filters.difficulty) {
        constraints.push(where('difficulty', '==', filters.difficulty));
      }
      if (filters.type) {
        constraints.push(where('type', '==', filters.type));
      }
      if (filters.year) {
        constraints.push(where('year', '==', filters.year));
      }
      
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(pageSize));
      
      if (filters.cursor) {
        constraints.push(startAfter(filters.cursor));
      }
      
      q = query(q, ...constraints);
      
      const snapshot = await getDocs(q);
      const questionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setQuestions(questionsData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      return questionsData;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addQuestion = async (questionData) => {
    try {
      const docRef = await addDoc(collection(db, 'questions'), {
        ...questionData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...questionData };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateQuestion = async (id, updates) => {
    try {
      const docRef = doc(db, 'questions', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await deleteDoc(doc(db, 'questions', id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    questions,
    loading,
    error,
    lastDoc,
    fetchQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion
  };
}
