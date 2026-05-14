import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

// Questions loaded from Firestore only - no demo data

export function Practice() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, topic, mode } = location.state || {};
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { loading, fetchQuestions } = useQuestions();

  useEffect(() => {
    // Load questions from Firestore
    const loadQuestions = async () => {
      const filters = {};
      if (subject) filters.subject = subject;
      if (topic) filters.topic = topic;
      
      const data = await fetchQuestions(filters, 10);
      setQuestions(data);
    };
    
    loadQuestions();
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
          isCorrect = answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
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

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No questions available. Please try again.</p>
        <button onClick={() => navigate('/subjects')} className="btn-primary mt-4">
          Back to Subjects
        </button>
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
            You scored {score} out of {questions.reduce((sum, q) => sum + (q.marks || 1), 0)} marks
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
                {Math.round((score / questions.reduce((sum, q) => sum + (q.marks || 1), 0)) * 100)}%
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
