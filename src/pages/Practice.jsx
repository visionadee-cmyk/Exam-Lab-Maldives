import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { useQuestions } from '../hooks/useQuestions';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { cn } from '../utils/cn';
import { LAST_PRACTICE_SUBJECT_KEY, defaultPracticeSubjectId } from '../lib/practicePrefs';
import { getAllBiologyPracticeQuestions } from '../data/biologyPracticePool';

// Questions: Firestore for most subjects; bundled JSON for biology IGCSE (reliable offline / empty DB).

function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickBiologyPracticeQuestions(topic, count = 10) {
  const all = getAllBiologyPracticeQuestions();
  if (!all.length) return [];
  let pool = all;
  if (topic?.trim()) {
    const t = topic.trim().toLowerCase();
    const narrowed = all.filter((q) => (q.text || '').toLowerCase().includes(t));
    if (narrowed.length) pool = narrowed;
  }
  return shuffleCopy(pool).slice(0, count);
}

export function Practice() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectId: subjectFromPath } = useParams();
  const [searchParams] = useSearchParams();
  const { topic, mode } = location.state || {};
  const subjectFromState = location.state?.subject;
  const subjectFromQuery = searchParams.get('subject');
  const subjectFromStorage =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(LAST_PRACTICE_SUBJECT_KEY)
      : null;
  const subject =
    subjectFromState ??
    subjectFromPath ??
    subjectFromQuery ??
    subjectFromStorage ??
    defaultPracticeSubjectId();

  useEffect(() => {
    if (subject) {
      try {
        window.localStorage.setItem(LAST_PRACTICE_SUBJECT_KEY, subject);
      } catch {
        /* ignore quota / private mode */
      }
    }
  }, [subject]);
  
  /** null = still loading; [] = none; otherwise question list */
  const [questions, setQuestions] = useState(null);
  const [usedBiologyFallback, setUsedBiologyFallback] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { fetchQuestions } = useQuestions();

  useEffect(() => {
    let cancelled = false;

    const loadQuestions = async () => {
      setQuestions(null);
      setUsedBiologyFallback(false);

      // Biology IGCSE: always use bundled JSON (Firestore may be empty; avoids async race wiping questions).
      if (subject === 'biology_igcse') {
        const local = pickBiologyPracticeQuestions(topic, 10);
        if (!cancelled) {
          setQuestions(local);
          setUsedBiologyFallback(false);
        }
        return;
      }

      const filters = {};
      if (subject) filters.subject = subject;
      if (topic) filters.topic = topic;

      const data = await fetchQuestions(filters, 10);
      if (cancelled) return;

      if (data.length > 0) {
        setQuestions(data);
        setUsedBiologyFallback(false);
        return;
      }

      // Firestore empty / offline: still show practice using bundled Biology (0610) pool
      const fallback = pickBiologyPracticeQuestions(topic, 10);
      if (!cancelled) {
        setQuestions(fallback.length > 0 ? fallback : []);
        setUsedBiologyFallback(fallback.length > 0);
      }
    };

    loadQuestions();
    return () => {
      cancelled = true;
    };
  }, [subject, topic, mode, fetchQuestions]);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    let totalScore = 0;
    
    questions.forEach(q => {
      if (!q) return;
      const answer = answers[q.id];
      if (answer) {
        let isCorrect = false;
        if (q.type === 'mcq') {
          isCorrect = answer === q.correctAnswer;
        } else {
          const expected = String(q.correctAnswer ?? '').toLowerCase().trim();
          const got = String(answer).toLowerCase().trim();
          isCorrect = got === expected;
        }
        if (isCorrect) {
          correct++;
          totalScore += q.marks || 1;
        }
      }
    });
    
    setScore(totalScore);
    setShowResults(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
    setScore(0);
  };

  const totalMarks =
    Array.isArray(questions) && questions.length > 0
      ? questions.reduce((sum, q) => sum + (q?.marks || 1), 0)
      : 0;

  const currentQuestion = Array.isArray(questions) ? questions[currentIndex] : undefined;
  const progress =
    Array.isArray(questions) && questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;
  const answeredCount = Object.keys(answers).length;

  if (questions === null) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4" />
        <p className="text-sm">Loading questions…</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 max-w-md mx-auto space-y-4">
        <p>No questions available. Try Biology practice (works offline) or pick another subject.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate('/practice/biology_igcse')}
            className="btn-primary"
          >
            Biology IGCSE practice
          </button>
          <button type="button" onClick={() => navigate('/subjects')} className="btn-secondary">
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/subjects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Exit Practice
        </button>

        {usedBiologyFallback && (
          <p className="text-sm text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
            No questions in the online bank for this subject yet. Showing sample{' '}
            <strong>Cambridge IGCSE Biology (0610)</strong> questions from the app library.
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {topic || 'Mixed Topics'} Practice
            </h1>
            <p className="text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">
              {answeredCount} of {questions.length} answered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {!showResults ? (
        <>
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            userAnswer={answers[currentQuestion?.id]}
            onAnswer={(answer) => currentQuestion && handleAnswer(answer)}
            showResult={false}
            isExamMode={false}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                'btn-secondary',
                currentIndex === 0 && 'opacity-50 cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-2">
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="btn-success"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Results */
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Complete!</h2>
          <p className="text-gray-600 mb-6">
            You scored {score} out of {Math.max(1, totalMarks)} marks
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {answeredCount}
              </div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((score / Math.max(1, totalMarks)) * 100)}%
              </div>
              <div className="text-sm text-green-700">Accuracy</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {questions.length}
              </div>
              <div className="text-sm text-blue-700">Questions</div>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <button onClick={handleRestart} className="btn-secondary">
              <RotateCcw className="w-4 h-4 mr-1" />
              Try Again
            </button>
            <button 
              onClick={() => navigate('/subjects')} 
              className="btn-primary"
            >
              More Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
