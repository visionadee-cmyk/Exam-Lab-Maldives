import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Clock, CheckCircle, AlertCircle, ChevronRight, ChevronLeft,
  Eye, Brain, FileText, Layers, Bookmark, ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn';

// Format part ID like "1a_i" → "1(a)(i)"
function formatPartNumber(partId) {
  const letterRomanMatch = partId.match(/^(\d+)([a-z])_([ivx]+)$/);
  if (letterRomanMatch) {
    const [, num, letter, roman] = letterRomanMatch;
    return `${num}(${letter})(${roman})`;
  }

  const letterOnlyMatch = partId.match(/^(\d+)([a-z])$/);
  if (letterOnlyMatch) {
    const [, num, letter] = letterOnlyMatch;
    return `${num}(${letter})`;
  }

  return partId;
}

const MODES = [
  { id: 'practice', name: 'Practice Mode', icon: Brain, color: 'bg-green-500', desc: 'Instant feedback & hints' },
  { id: 'exam', name: 'Exam Mode', icon: FileText, color: 'bg-amber-500', desc: 'Timed, no hints' },
  { id: 'view', name: 'View PDF', icon: Eye, color: 'bg-blue-500', desc: 'Read only' },
  { id: 'topics', name: 'Topic Extraction', icon: Layers, color: 'bg-purple-500', desc: 'Filter by topic' },
];

export function Paper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paper, subject } = location.state || {};
  
  const [mode, setMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAnswer, setShowAnswer] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [showModeMenu, setShowModeMenu] = useState(false);

  useEffect(() => {
    if (mode === 'exam' && paper?.timeMinutes) {
      setTimeLeft(paper.timeMinutes * 60);
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode]);

  if (!paper || !subject) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Paper Not Found</h1>
        <button onClick={() => navigate('/subjects')} className="btn-primary mt-4">
          Back to Subjects
        </button>
      </div>
    );
  }

  // Mode Selection Screen
  if (!mode) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{paper.session}</h1>
          <p className="text-gray-600">{paper.code} • {paper.unit}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="bg-white rounded-xl p-4 border border-gray-100 text-left hover:border-primary-200 transition-colors"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', m.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            <strong>{paper.questions.length}</strong> questions • 
            <strong> {paper.totalMarks}</strong> marks • 
            <strong> {paper.timeMinutes}</strong> min
          </p>
        </div>
      </div>
    );
  }

  const question = paper.questions[currentQuestion];

  const handleAnswerChange = (partId, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${question.id}_${partId}`]: value
    }));
  };

  const toggleShowAnswer = (partId) => {
    setShowAnswer(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  const handleNext = () => {
    if (currentQuestion < paper.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let totalMarks = 0;
    let earnedMarks = 0;

    paper.questions.forEach(q => {
      q.parts.forEach(part => {
        totalMarks += part.marks;
        const userAnswer = answers[`${q.id}_${part.id}`]?.toString().toLowerCase().trim();
        
        if (part.type === 'mcq') {
          if (userAnswer === part.answer.toLowerCase()) {
            earnedMarks += part.marks;
          }
        } else {
          if (userAnswer && part.keywords) {
            const hasKeyword = part.keywords.some(keyword => 
              userAnswer.includes(keyword.toLowerCase())
            );
            if (hasKeyword) {
              earnedMarks += part.marks;
            }
          }
        }
      });
    });

    return { totalMarks, earnedMarks, percentage: Math.round((earnedMarks / totalMarks) * 100) };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const score = calculateScore();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMode(null)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        
        <div className="flex items-center gap-3">
          {timeLeft !== null && mode === 'exam' && (
            <div className={cn('px-3 py-1 rounded-lg text-sm font-medium', timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100')}>
              <Clock className="w-4 h-4 inline mr-1" />
              {formatTime(timeLeft)}
            </div>
          )}
          <div className="text-sm font-medium text-gray-700">
            {currentQuestion + 1}/{paper.questions.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-primary-600 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentQuestion + 1) / paper.questions.length) * 100}%` }}
        />
      </div>

      {showResults ? (
        /* Results View */
        <div className="card">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paper Complete!</h2>
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {score.percentage}%
            </div>
            <p className="text-gray-600">
              You scored {score.earnedMarks} out of {score.totalMarks} marks
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Review Your Answers</h3>
            {paper.questions.map((q, qIndex) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Question {q.number}</h4>
                {q.parts.map(part => {
                  const userAnswer = answers[`${q.id}_${part.id}`];
                  const correctAnswer = part.answer;
                  
                  let isCorrect = false;
                  if (part.type === 'mcq') {
                    isCorrect = userAnswer?.toLowerCase() === correctAnswer.toLowerCase();
                  } else {
                    isCorrect = userAnswer && part.keywords?.some(keyword => 
                      userAnswer.toLowerCase().includes(keyword.toLowerCase())
                    );
                  }

                  // Find option text for MCQ
                  const userOption = part.type === 'mcq' && part.options?.find(o => o.id === userAnswer);
                  const correctOption = part.type === 'mcq' && part.options?.find(o => o.id === correctAnswer);

                  return (
                    <div key={part.id} className="ml-4 mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                          {formatPartNumber(part.id)}
                        </span>
                        <p className="text-sm text-gray-700">{part.text}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Your answer:</span> 
                            {userAnswer ? (
                              part.type === 'mcq' ? (
                                <span className="ml-1">{userOption ? `${userOption.id}. ${userOption.text}` : userAnswer}</span>
                              ) : (
                                <span className="ml-1">{userAnswer}</span>
                              )
                            ) : (
                              <span className="text-gray-400 ml-1">Not answered</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Expected:</span> 
                            {part.type === 'mcq' && correctOption ? (
                              <span className="ml-1">{correctOption.id}. {correctOption.text}</span>
                            ) : (
                              <span className="ml-1">{correctAnswer}</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">Marks: {isCorrect ? part.marks : 0}/{part.marks}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button onClick={() => navigate(-1)} className="btn-primary">
              Back to Subject
            </button>
          </div>
        </div>
      ) : (
        /* Question View */
        <div className="card">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Question {question.number}
              </h2>
              <span className="text-sm font-medium text-gray-500">
                {question.totalMarks} marks
              </span>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-800 whitespace-pre-line">{question.question}</p>
            </div>
            {question.image && (
              <div className="mt-4">
                <img 
                  src={question.image} 
                  alt={`Question ${question.number} diagram`}
                  className="max-w-full h-auto rounded-lg border border-gray-200 block"
                />
              </div>
            )}
          </div>

          {/* Answer inputs */}
          <div className="space-y-6">
            {question.parts.map(part => (
              <div key={part.id} className="border-l-4 border-primary-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    {formatPartNumber(part.id)}
                  </span>
                  <span className="text-sm text-gray-500">({part.marks} marks)</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {part.text}
                </label>
                {part.image && (
                  <div className="mb-3">
                    <img 
                      src={part.image} 
                      alt={`Part ${formatPartNumber(part.id)} diagram`}
                      className="max-w-full h-auto rounded-lg border border-gray-200 block"
                    />
                  </div>
                )}
                
                {part.type === 'mcq' && part.options ? (
                  <div className="space-y-2">
                    {part.options.map(option => (
                      <label key={option.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name={`${question.id}_${part.id}`}
                          value={option.id}
                          checked={answers[`${question.id}_${part.id}`] === option.id}
                          onChange={(e) => handleAnswerChange(part.id, e.target.value)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="font-medium text-gray-900">{option.id}.</span>
                        <span className="text-gray-700">{option.text}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[`${question.id}_${part.id}`] || ''}
                    onChange={(e) => handleAnswerChange(part.id, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={cn(
                'flex items-center px-4 py-2 rounded-lg',
                currentQuestion === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {currentQuestion + 1} of {paper.questions.length}
            </div>

            {currentQuestion === paper.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Submit Paper
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
      )}
    </div>
  );
}
