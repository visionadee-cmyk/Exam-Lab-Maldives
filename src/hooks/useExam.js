import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useExam(userId) {
  const [currentExam, setCurrentExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            submitExam();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startExam = useCallback((questions, durationMinutes) => {
    const exam = {
      id: `exam_${Date.now()}`,
      questions,
      startTime: new Date().toISOString(),
      duration: durationMinutes * 60
    };
    
    setCurrentExam(exam);
    setTimeLeft(exam.duration);
    setAnswers({});
    setIsActive(true);
    setResults(null);
    
    return exam;
  }, []);

  const answerQuestion = useCallback((questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const submitExam = useCallback(async () => {
    if (!currentExam) return null;
    
    setIsActive(false);
    
    const endTime = new Date().toISOString();
    const timeTaken = currentExam.duration - timeLeft;
    
    // Calculate results
    let correct = 0;
    let totalScore = 0;
    const questionResults = currentExam.questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = checkAnswer(q, userAnswer);
      if (isCorrect) correct++;
      
      const score = isCorrect ? (q.marks || 1) : 0;
      totalScore += score;
      
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        score,
        maxScore: q.marks || 1
      };
    });
    
    const results = {
      examId: currentExam.id,
      userId,
      startTime: currentExam.startTime,
      endTime,
      timeTaken,
      totalQuestions: currentExam.questions.length,
      correctAnswers: correct,
      totalScore,
      maxPossibleScore: currentExam.questions.reduce((sum, q) => sum + (q.marks || 1), 0),
      questionResults,
      percentage: Math.round((correct / currentExam.questions.length) * 100)
    };
    
    setResults(results);
    
    // Save to Firestore
    try {
      await addDoc(collection(db, 'results'), results);
    } catch (err) {
      console.error('Failed to save results:', err);
    }
    
    return results;
  }, [currentExam, answers, timeLeft, userId]);

  const checkAnswer = (question, userAnswer) => {
    if (!userAnswer) return false;
    
    switch (question.type) {
      case 'mcq':
        return userAnswer === question.correctAnswer;
      case 'short_answer':
      case 'structured':
        // For text answers, do case-insensitive comparison
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      case 'calculation':
        // Allow small numerical differences
        const userNum = parseFloat(userAnswer);
        const correctNum = parseFloat(question.correctAnswer);
        return Math.abs(userNum - correctNum) < 0.01;
      default:
        return false;
    }
  };

  const pauseExam = () => setIsActive(false);
  const resumeExam = () => setIsActive(true);

  return {
    currentExam,
    answers,
    timeLeft,
    isActive,
    results,
    startExam,
    answerQuestion,
    submitExam,
    pauseExam,
    resumeExam
  };
}
