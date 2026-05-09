import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  BarChart3, 
  Clock, 
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import { cn } from '../utils/cn';

export function Home() {
  const { isAuthenticated, userData } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Practice Questions',
      description: 'Access thousands of past paper questions from O Level and A Level exams.'
    },
    {
      icon: Clock,
      title: 'Exam Simulation',
      description: 'Experience real exam conditions with timed practice sessions.'
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      description: 'Monitor your performance and identify areas for improvement.'
    },
    {
      icon: Target,
      title: 'Topic Focus',
      description: 'Practice specific topics and master them one by one.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left - Text */}
          <div className="text-center lg:text-left">
            <img 
              src="/logo.png" 
              alt="Exam Lab MV" 
              className="w-24 h-24 mx-auto lg:mx-0 mb-6 object-contain"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Master Your Exams with{' '}
          <span className="text-primary-600">Exam Lab MV</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          The ultimate practice platform for O Level and A Level students in the Maldives. 
          Practice with real past papers, track your progress, and achieve your best grades.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/subjects" className="btn-primary text-lg px-8 py-3">
              Start Practicing
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </>
          )}
        </div>
          </div>
          
          {/* Right - Illustration */}
          <div className="hidden lg:block">
            <img 
              src="/storyset/Online learning-amico.png" 
              alt="Online Learning" 
              className="w-full h-auto max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Stats for logged in users */}
      {isAuthenticated && userData?.stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {userData.stats.totalQuestions || 0}
            </div>
            <div className="text-sm text-gray-600">Questions Attempted</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {userData.stats.correctAnswers || 0}
            </div>
            <div className="text-sm text-gray-600">Correct Answers</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600 mb-1">
              {userData.stats.examsTaken || 0}
            </div>
            <div className="text-sm text-gray-600">Exams Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {userData.stats.practiceSessions || 0}
            </div>
            <div className="text-sm text-gray-600">Practice Sessions</div>
          </div>
        </section>
      )}

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Exam Lab MV?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subjects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Subjects</h2>
          <Link to="/subjects" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="card hover:shadow-md transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white', subject.color)}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {subject.name}
                    </h3>
                    <span className="text-xs font-bold text-gray-400">
                      {subject.code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {subject.topics.length} topics
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      subject.board?.includes('IGCSE') && 'bg-emerald-100 text-emerald-700',
                      subject.board?.includes('Edexcel') && 'bg-blue-100 text-blue-700',
                      subject.board?.includes('Cambridge IAL') && 'bg-teal-100 text-teal-700'
                    )}>
                      {subject.board}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center py-12">
          <Award className="w-16 h-16 mx-auto mb-4 text-primary-200" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Excel in Your Exams?
          </h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Join thousands of students preparing for their O Level and A Level exams. 
            Start practicing today and achieve the grades you deserve.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
          >
            Create Free Account
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </section>
      )}
    </div>
  );
}
