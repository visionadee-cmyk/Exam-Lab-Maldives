import { useState } from 'react';
import { cn } from '../utils/cn';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle,
  Calculator,
  Image as ImageIcon,
  AlignLeft,
  CircleDot,
  List,
  TrendingUp
} from 'lucide-react';

const typeIcons = {
  mcq: CircleDot,
  short_answer: AlignLeft,
  structured: List,
  calculation: Calculator,
  graph: TrendingUp,
  image: ImageIcon
};

export function QuestionCard({ 
  question, 
  index, 
  userAnswer, 
  onAnswer, 
  showResult = false,
  isExamMode = false 
}) {
  if (!question) return null;

  const [showSolution, setShowSolution] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const TypeIcon = typeIcons[question.type] || AlignLeft;
  const hasAnswered = userAnswer !== undefined && userAnswer !== '';
  const isCorrect = showResult && question.correctAnswer === userAnswer;
  const isWrong = showResult && hasAnswered && !isCorrect;

  const handleMCQSelect = (option) => {
    if (!showResult) {
      onAnswer?.(option);
    }
  };

  const handleTextAnswer = (value) => {
    if (!showResult) {
      onAnswer?.(value);
    }
  };

  return (
    <div className={cn(
      'card transition-all duration-200',
      isCorrect && 'border-green-500 ring-1 ring-green-500',
      isWrong && 'border-red-500 ring-1 ring-red-500'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-lg font-semibold text-sm">
            {index + 1}
          </span>
          <div className="flex items-center space-x-2">
            <TypeIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {question.type?.replace('_', ' ')}
            </span>
          </div>
          {question.difficulty && (
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              question.difficulty === 'easy' && 'bg-green-100 text-green-700',
              question.difficulty === 'medium' && 'bg-yellow-100 text-yellow-700',
              question.difficulty === 'hard' && 'bg-red-100 text-red-700'
            )}>
              {question.difficulty}
            </span>
          )}
        </div>
        {question.marks && (
          <span className="text-sm text-gray-500">
            {question.marks} mark{question.marks > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-4">
        <p className="text-gray-900 font-medium leading-relaxed">
          {question.text ?? question.question}
        </p>
      </div>

      {/* Images */}
      {question.images && question.images.length > 0 && (
        <div className="mb-4 space-y-2">
          {question.images.map((image, imgIndex) => (
            <div key={imgIndex} className="relative">
              {!imageLoaded && (
                <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <img
                src={image.url || image}
                alt={`Question ${index + 1} image ${imgIndex + 1}`}
                className={cn(
                  'w-full rounded-lg border border-gray-200',
                  !imageLoaded && 'hidden'
                )}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tables */}
      {question.table && (
        <div className="mb-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                {question.table.headers.map((header, i) => (
                  <th key={i} className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Answer Input */}
      <div className="mt-4">
        {question.type === 'mcq' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, optIndex) => {
              const isSelected = userAnswer === option;
              const isCorrectOption = showResult && option === question.correctAnswer;
              
              return (
                <button
                  key={optIndex}
                  onClick={() => handleMCQSelect(option)}
                  disabled={showResult}
                  className={cn(
                    'w-full flex items-center space-x-3 p-3 rounded-lg border-2 text-left transition-all',
                    isSelected && !showResult && 'border-primary-500 bg-primary-50',
                    !isSelected && !showResult && 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                    isCorrectOption && 'border-green-500 bg-green-50',
                    isSelected && !isCorrect && showResult && 'border-red-500 bg-red-50'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300',
                    isCorrectOption && 'border-green-500 bg-green-500',
                    isSelected && !isCorrect && showResult && 'border-red-500 bg-red-500'
                  )}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="flex-1 text-gray-700">{option}</span>
                  {isCorrectOption && showResult && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {isSelected && !isCorrect && showResult && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {(question.type === 'short_answer' || question.type === 'structured' || question.type === 'calculation') && (
          <div className="space-y-2">
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleTextAnswer(e.target.value)}
              disabled={showResult}
              placeholder="Type your answer here..."
              rows={question.type === 'structured' ? 6 : 3}
              className={cn(
                'input resize-none',
                isCorrect && 'border-green-500 focus:border-green-500 focus:ring-green-500',
                isWrong && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
            {showResult && (
              <div className={cn(
                'p-3 rounded-lg',
                isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              )}>
                <div className="flex items-center space-x-2 font-medium">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Incorrect</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-sm">
                  Correct answer: {question.correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Solution Toggle */}
      {(showResult || !isExamMode) && question.explanation && (
        <div className="mt-4">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {showSolution ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Solution</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show Solution</span>
              </>
            )}
          </button>
          
          {showSolution && (
            <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {question.explanation}
              </p>
              {question.steps && question.steps.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-blue-900 mb-2">Step-by-step solution:</h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    {question.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
