import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  BookOpen,
  Calendar,
  ChevronDown,
  Filter
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import { cn } from '../utils/cn';
import { getGrade } from '../utils/formatters';

// Demo data for charts
const performanceData = [
  { name: 'Week 1', score: 65, target: 70 },
  { name: 'Week 2', score: 72, target: 70 },
  { name: 'Week 3', score: 68, target: 70 },
  { name: 'Week 4', score: 78, target: 70 },
  { name: 'Week 5', score: 82, target: 70 },
  { name: 'Week 6', score: 85, target: 70 },
];

const subjectDistribution = [
  { name: 'Mathematics', value: 35, color: '#3b82f6' },
  { name: 'Physics', value: 25, color: '#8b5cf6' },
  { name: 'Chemistry', value: 20, color: '#22c55e' },
  { name: 'Accounting', value: 10, color: '#f59e0b' },
  { name: 'Business', value: 7, color: '#6366f1' },
  { name: 'ICT', value: 3, color: '#06b6d4' },
];

const topicPerformance = [
  { name: 'Algebra', score: 85, total: 100 },
  { name: 'Geometry', score: 72, total: 100 },
  { name: 'Trigonometry', score: 68, total: 100 },
  { name: 'Calculus', score: 55, total: 100 },
  { name: 'Statistics', score: 78, total: 100 },
];

const recentActivity = [
  { id: 1, type: 'exam', subject: 'Mathematics', score: 85, total: 100, date: '2024-01-15', duration: 45 },
  { id: 2, type: 'practice', subject: 'Physics', score: 12, total: 15, date: '2024-01-14', duration: 20 },
  { id: 3, type: 'practice', subject: 'Chemistry', score: 8, total: 10, date: '2024-01-13', duration: 15 },
  { id: 4, type: 'exam', subject: 'Accounting', score: 72, total: 100, date: '2024-01-12', duration: 60 },
  { id: 5, type: 'practice', subject: 'Mathematics', score: 15, total: 20, date: '2024-01-11', duration: 25 },
];

const weakAreas = [
  { topic: 'Calculus', subject: 'Mathematics', accuracy: 55, questions: 20 },
  { topic: 'Quantum Physics', subject: 'Physics', accuracy: 48, questions: 15 },
  { topic: 'Organic Chemistry', subject: 'Chemistry', accuracy: 52, questions: 25 },
];

export function Progress() {
  const { userData } = useAuth();
  const [timeRange, setTimeRange] = useState('6weeks');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const totalQuestions = userData?.stats?.totalQuestions || 245;
  const correctAnswers = userData?.stats?.correctAnswers || 186;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100) || 76;
  const examsTaken = userData?.stats?.examsTaken || 12;
  const practiceSessions = userData?.stats?.practiceSessions || 48;

  const grade = getGrade(accuracy);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
          <p className="text-gray-600">Track your learning journey and identify areas for improvement</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="input py-2 text-sm"
          >
            <option value="1week">Last Week</option>
            <option value="1month">Last Month</option>
            <option value="6weeks">Last 6 Weeks</option>
            <option value="3months">Last 3 Months</option>
          </select>
          
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input py-2 text-sm"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-primary-600" />
            <span className={cn('text-sm font-bold', grade.color)}>{grade.grade}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
          <div className="text-sm text-gray-600">Overall Accuracy</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
          <div className="text-sm text-gray-600">Questions Attempted</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{examsTaken}</div>
          <div className="text-sm text-gray-600">Exams Completed</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{practiceSessions}</div>
          <div className="text-sm text-gray-600">Practice Sessions</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Your Score" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#10b981" name="Target" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Time by Subject</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Topic Performance */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">Topic Performance - Mathematics</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" name="Score %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weak Areas */}
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-red-900">Areas Needing Improvement</h3>
        </div>
        <div className="space-y-3">
          {weakAreas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{area.topic}</p>
                <p className="text-sm text-gray-600">{area.subject}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  'font-bold',
                  area.accuracy < 50 ? 'text-red-600' : 'text-amber-600'
                )}>
                  {area.accuracy}%
                </p>
                <p className="text-sm text-gray-500">{area.questions} questions</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  activity.type === 'exam' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                )}>
                  {activity.type === 'exam' ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {activity.type === 'exam' ? 'Exam' : 'Practice'} - {activity.subject}
                  </p>
                  <p className="text-sm text-gray-500">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {activity.date} • <Clock className="w-3 h-3 inline mr-1" />
                    {activity.duration} min
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  'font-bold',
                  (activity.score / activity.total) >= 0.7 ? 'text-green-600' : 
                  (activity.score / activity.total) >= 0.5 ? 'text-amber-600' : 'text-red-600'
                )}>
                  {activity.score}/{activity.total}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.round((activity.score / activity.total) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
