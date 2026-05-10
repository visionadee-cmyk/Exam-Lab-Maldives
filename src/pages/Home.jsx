import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search,
  Flame,
  Calendar,
  BookOpen,
  FileText,
  Brain,
  Bookmark,
  ChevronRight,
  Clock,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import { cn } from '../utils/cn';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'olevel', name: 'O Level', icon: BookOpen, color: 'from-emerald-500 to-teal-600', count: '12 Subjects' },
  { id: 'alevel', name: 'A Level', icon: Award, color: 'from-violet-500 to-purple-600', count: '8 Subjects' },
  { id: 'revision', name: 'Revision Notes', icon: FileText, color: 'from-amber-500 to-orange-600', count: '200+ Notes' },
  { id: 'mock', name: 'Mock Exams', icon: Target, color: 'from-rose-500 to-pink-600', count: '50+ Exams' },
  { id: 'ai', name: 'AI Practice', icon: Brain, color: 'from-blue-500 to-cyan-600', count: 'Smart Quiz' },
  { id: 'saved', name: 'Saved Papers', icon: Bookmark, color: 'from-indigo-500 to-blue-600', count: 'My Collection' },
];

export function Home() {
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pdf-library?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const upcomingExams = [
    { name: 'Biology Paper 2', date: 'May 15, 2026', daysLeft: 5 },
    { name: 'Chemistry Paper 4', date: 'May 20, 2026', daysLeft: 10 },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search papers, topics, questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </form>

      {/* Continue Studying */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-5 text-white">
          <h3 className="font-semibold mb-3">Continue Studying</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Last session: Biology Unit 3</p>
              <p className="font-medium mt-1">Question 12 of 50</p>
            </div>
            <Link 
              to="/practice" 
              className="px-4 py-2 bg-white text-primary-700 rounded-lg font-medium text-sm"
            >
              Continue
            </Link>
          </div>
        </div>
      )}

      {/* Daily Streak & Upcoming Exams Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Daily Streak */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-xs text-gray-500">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Upcoming</p>
              <p className="text-xs text-gray-500">{upcomingExams[0].name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>{upcomingExams[0].daysLeft} days left</span>
          </div>
        </div>
      </div>

      {/* Main Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore</h2>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.id === 'olevel' ? '/subjects?level=OLEVEL' : 
                    cat.id === 'alevel' ? '/subjects?level=ALEVEL' :
                    cat.id === 'saved' ? '/progress' : '/subjects'}
                className={cn(
                  'relative overflow-hidden rounded-2xl p-5 text-white',
                  'bg-gradient-to-br',
                  cat.color
                )}
              >
                <Icon className="w-8 h-8 mb-3 opacity-90" />
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm opacity-80">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      {isAuthenticated && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">{userData?.stats?.totalQuestions || 0}</p>
            <p className="text-xs text-gray-500">Questions</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <Target className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">{userData?.stats?.examsTaken || 0}</p>
            <p className="text-xs text-gray-500">Exams</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <Award className="w-5 h-5 text-amber-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">{userData?.plan || 'Free'}</p>
            <p className="text-xs text-gray-500">Plan</p>
          </div>
        </div>
      )}

      {/* Popular Subjects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Popular Subjects</h2>
          <Link to="/subjects" className="text-primary-600 text-sm font-medium flex items-center">
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {SUBJECTS.slice(0, 6).map((subject) => (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="flex-shrink-0 bg-white rounded-xl p-4 border border-gray-100 w-36"
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2', subject.color)}>
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="font-medium text-gray-900 text-sm truncate">{subject.name}</p>
              <p className="text-xs text-gray-500">{subject.code}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA for non-authenticated */}
      {!isAuthenticated && (
        <div className="bg-gray-900 rounded-2xl p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">Start Your Exam Prep</h3>
          <p className="text-gray-400 text-sm mb-4">Join thousands of students achieving their best grades</p>
          <div className="flex gap-3">
            <Link to="/signup" className="flex-1 bg-primary-600 py-2.5 rounded-lg font-medium">
              Sign Up Free
            </Link>
            <Link to="/login" className="flex-1 bg-gray-800 py-2.5 rounded-lg font-medium">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
