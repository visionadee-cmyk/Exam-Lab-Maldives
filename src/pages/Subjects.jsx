import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { O_LEVEL_SUBJECTS, A_LEVEL_PEARSON_SUBJECTS, A_LEVEL_CAMBRIDGE_SUBJECTS, EXAM_BOARDS } from '../data/subjects';
import { FileText } from 'lucide-react';
import { 
  BookOpen, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Briefcase,
  Monitor,
  Microscope,
  TrendingUp,
  BookMarked,
  Languages,
  Plane
} from 'lucide-react';
import { cn } from '../utils/cn';

const iconMap = {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  Briefcase,
  Monitor,
  Microscope,
  TrendingUp,
  BookMarked,
  Languages,
  Plane
};

const boardColors = {
  [EXAM_BOARDS.CAMBRIDGE_IGCSE]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [EXAM_BOARDS.PEARSON_EDEXCEL_IAL]: 'bg-blue-100 text-blue-700 border-blue-200',
  [EXAM_BOARDS.CAMBRIDGE_IAL]: 'bg-teal-100 text-teal-700 border-teal-200'
};

export function Subjects() {
  const [level, setLevel] = useState('o');

  const subjects = useMemo(() => {
    if (level === 'o') return O_LEVEL_SUBJECTS;
    return [...A_LEVEL_PEARSON_SUBJECTS, ...A_LEVEL_CAMBRIDGE_SUBJECTS];
  }, [level]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Subject</h1>
        <p className="text-gray-600">Select a subject to start practicing</p>
      </div>

      <div className="flex justify-center mb-6">
        <Link
          to="/pdf-library"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5" />
          See All PDFs
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setLevel('o')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              level === 'o' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            O Level
          </button>
          <button
            type="button"
            onClick={() => setLevel('a')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              level === 'a' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            A Level
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          
          return (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="group relative overflow-hidden card hover:shadow-lg transition-all duration-300"
            >
              {/* Background gradient */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity',
                subject.color
              )} />
              
              <div className="relative">
                {/* Icon */}
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
                  subject.color
                )}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {subject.name}
                  </h2>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {subject.code}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {subject.board}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {subject.topics.slice(0, 2).map((topic) => (
                    <span 
                      key={topic}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                    >
                      {topic}
                    </span>
                  ))}
                  {subject.topics.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                      +{subject.topics.length - 2} topics
                    </span>
                  )}
                </div>

                {/* Exam Board Badge */}
                <div className="flex items-center gap-2">
                  <span 
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded-md border',
                      boardColors[subject.board] || 'bg-gray-100 text-gray-700 border-gray-200'
                    )}
                  >
                    {subject.board}
                  </span>
                </div>

                {/* Arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg 
                    className="w-5 h-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="card bg-blue-50 border-blue-100 mt-8">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How to Practice</h3>
            <p className="text-sm text-blue-800">
              Select a subject to see available topics. You can practice by topic or take full exam papers. 
              Your progress is tracked automatically to help you identify weak areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
