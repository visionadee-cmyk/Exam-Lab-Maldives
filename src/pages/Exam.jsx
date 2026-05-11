import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { Timer } from '../components/Timer';
import { useExam } from '../hooks/useExam';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Trophy,
  Clock,
  FileText
} from 'lucide-react';
import { cn } from '../utils/cn';
import { formatTime } from '../utils/formatters';
import { useQuestions } from '../hooks/useQuestions';

// Questions loaded from Firestore only - no demo data

export function Exam() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subject, mode } = location.state || {};
  const { fetchQuestions } = useQuestions();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const loadQuestions = async () => {
      const filters = {};
      if (subject) filters.subject = subject;
      const data = await fetchQuestions(filters, 20);
      setQuestions(data);
    };
    loadQuestions();
  }, [subject, fetchQuestions]);

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

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
    setExamFinished(true);
    setShowResults(true);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const calculateScore = () => {
    let score = 0;
    let correct = 0;
    
    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer) {
        let isCorrect = false;
        if (q.type === 'mcq') {
          isCorrect = answer === q.correctAnswer;
        } else {
          isCorrect = answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
        }
        if (isCorrect) {
          correct++;
          score += q.marks || 1;
        }
      }
    });
    
    return { score, correct };
  };

  const { score, correct } = showResults ? calculateScore() : { score: 0, correct: 0 };
  const percentage = Math.round((score / totalMarks) * 100);
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <h1 className="text-xl font-bold text-gray-900">Loading exam...</h1>
          <p className="text-sm text-gray-600 mt-2">
            Please wait while we load your questions.
          </p>
          <div className="mt-4">
            <button
              onClick={() => navigate('/subjects')}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Subjects
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-primary-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Complete!</h1>
          <p className="text-gray-600 mb-8">
            You have finished your exam. Here's how you performed:
          </p>

          {/* Score */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">{score}</div>
              <div className="text-sm text-primary-700">Score</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{percentage}%</div>
              <div className="text-sm text-green-700">Percentage</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {correct}/{questions.length}
              </div>
              <div className="text-sm text-blue-700">Correct</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="text-3xl font-bold text-amber-600">
                {formatTime(timeTaken)}
              </div>
              <div className="text-sm text-amber-700">Time Taken</div>
            </div>
          </div>

          {/* Grade */}
          <div className="mb-8">
            <div className={cn(
              'inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold',
              percentage >= 80 ? 'bg-green-100 text-green-800' :
              percentage >= 60 ? 'bg-blue-100 text-blue-800' :
              percentage >= 40 ? 'bg-amber-100 text-amber-800' :
              'bg-red-100 text-red-800'
            )}>
              Grade: {percentage >= 90 ? 'A*' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : percentage >= 40 ? 'E' : 'U'}
            </div>
          </div>

          {/* Question Review */}
          <div className="text-left mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Question Review</h3>
            <div className="space-y-4">
              {questions.map((q, index) => {
                const answer = answers[q.id];
                let isCorrect = false;
                if (answer) {
                  if (q.type === 'mcq') {
                    isCorrect = answer === q.correctAnswer;
                  } else {
                    isCorrect = answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                  }
                }
                
                return (
                  <div 
                    key={q.id}
                    className={cn(
                      'flex items-center p-3 rounded-lg',
                      isCorrect ? 'bg-green-50 border border-green-200' : 
                      answer ? 'bg-red-50 border border-red-200' : 
                      'bg-gray-50 border border-gray-200'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                      isCorrect ? 'bg-green-500 text-white' :
                      answer ? 'bg-red-500 text-white' :
                      'bg-gray-300 text-white'
                    )}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                       answer ? <AlertCircle className="w-5 h-5" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Question {index + 1}</p>
                      <p className="text-sm text-gray-600">
                        {q.marks} marks • {q.topic}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        'font-semibold',
                        isCorrect ? 'text-green-600' : answer ? 'text-red-600' : 'text-gray-500'
                      )}>
                        {isCorrect ? `+${q.marks}` : answer ? '0' : 'NA'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => navigate('/subjects')} 
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Subjects
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              <FileText className="w-4 h-4 mr-1" />
              Take Another Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 pb-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                navigate('/subjects');
              }
            }}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Exit Exam
          </button>
          
          <Timer 
            seconds={timeLeft} 
            onTimeUp={handleTimeUp}
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">O Level Exam Simulation</h1>
            <p className="text-sm text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">
              {answeredCount} answered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <QuestionCard
        question={questions[currentIndex]}
        index={currentIndex}
        userAnswer={answers[questions[currentIndex]?.id]}
        onAnswer={handleAnswer}
        showResult={false}
        isExamMode={true}
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
              onClick={() => {
                if (confirm('Are you sure you want to submit your exam?')) {
                  handleSubmit();
                }
              }}
              className="btn-success"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Submit Exam
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

      {/* Question Navigator */}
      <div className="mt-6 card">
        <p className="text-sm font-medium text-gray-700 mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                idx === currentIndex ? 'bg-primary-600 text-white' :
                answers[q.id] ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
