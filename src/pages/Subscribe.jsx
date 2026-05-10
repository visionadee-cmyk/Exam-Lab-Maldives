import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CreditCard, BookOpen, Crown, Zap, ArrowLeft, Send } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';
import { SUBJECTS } from '../data/subjects';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: BookOpen,
    color: 'gray',
    features: [
      '✅ Limited past papers (1-2 years)',
      '✅ View PDFs',
      '✅ Basic practice mode (5 questions)',
      '✅ Basic bookmarking',
      '❌ Unlimited answers',
      '❌ Full paper access',
      '❌ Exam analytics',
      '❌ Offline mode',
      '❌ AI checking',
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 99,
    icon: Zap,
    color: 'blue',
    popular: true,
    period: '/month',
    features: [
      '✅ Full access to all papers',
      '✅ Mark schemes',
      '✅ Unlimited practice',
      '✅ Save answers',
      '✅ Subject progress tracking',
      '✅ No ads',
      '✅ Dark mode',
      '✅ Offline downloads',
    ]
  },
  {
    id: 'premium',
    name: 'Premium AI',
    price: 249,
    icon: Crown,
    color: 'purple',
    period: '/month',
    features: [
      '✅ Everything in Standard',
      '✅ AI answer checking',
      '✅ Predicted grades',
      '✅ Weak-topic analysis',
      '✅ Smart revision plans',
      '✅ Timed mock exams',
      '✅ Performance graphs',
      '✅ AI tutor/chat assistant',
      '✅ Personalized recommendations',
    ]
  },
];

const LIFETIME_PLANS = [
  {
    id: 'single',
    name: 'Single Subject',
    price: 199,
    description: 'One subject forever',
    subjects: ['Biology', 'Chemistry', 'Physics', 'Math']
  },
  {
    id: 'science',
    name: 'Science Bundle',
    price: 499,
    description: 'Biology + Chemistry + Physics',
  },
  {
    id: 'full',
    name: 'Full O Level',
    price: 999,
    description: 'All O Level subjects',
  },
];

export function Subscribe() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(userData?.plan || 'free');
  const [selectedLevel, setSelectedLevel] = useState(userData?.level || 'all');
  const [selectedSubjects, setSelectedSubjects] = useState(userData?.subjects || []);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentPlan = PLANS.find(p => p.id === selectedPlan);
  const subjectCount = selectedSubjects.includes('all') ? 'All' : selectedSubjects.length;
  const totalPrice = currentPlan?.price || 0;

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'paymentRequests'), {
        userId: user.uid,
        userEmail: user.email,
        userName: userData?.name || user.displayName || 'Unknown',
        plan: selectedPlan,
        planName: currentPlan?.name,
        level: selectedLevel,
        subjects: selectedSubjects,
        amount: totalPrice,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your subscription request has been sent. We will verify and activate your access within 24 hours.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2">Payment Details:</p>
            <p className="font-semibold text-gray-900">{totalPrice} MVR</p>
            <p className="text-sm text-gray-500">Plan: {currentPlan?.name}</p>
            <p className="text-sm text-gray-500">Subjects: {selectedSubjects.join(', ')}</p>
          </div>
          <Link to="/home" className="btn-primary w-full">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/home" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Choose Your Plan</h1>
              <p className="text-sm text-gray-600">Select a plan and subjects to get started</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Plan Banner */}
        {userData?.plan && userData.plan !== 'free' && (
          <div className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90">Current Plan</p>
            <p className="text-2xl font-bold">{PLANS.find(p => p.id === userData.plan)?.name || 'Free'}</p>
            <p className="text-sm opacity-90 mt-1">
              Subjects: {userData.subjects?.includes('all') ? 'All Subjects' : userData.subjects?.join(', ') || 'None'}
            </p>
          </div>
        )}

        {/* Plan Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    'relative p-6 rounded-xl border-2 text-left transition-all',
                    isSelected 
                      ? plan.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                        plan.color === 'purple' ? 'border-purple-500 bg-purple-50' :
                        'border-amber-500 bg-amber-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    plan.color === 'blue' ? 'bg-blue-100' :
                    plan.color === 'purple' ? 'bg-purple-100' :
                    'bg-amber-100'
                  )}>
                    <Icon className={cn(
                      'w-6 h-6',
                      plan.color === 'blue' ? 'text-blue-600' :
                      plan.color === 'purple' ? 'text-purple-600' :
                      'text-amber-600'
                    )} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {plan.price === 0 ? 'Free' : `${plan.price} MVR`}
                    {plan.period && <span className="text-sm font-normal text-gray-500">{plan.period}</span>}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={cn(
                        "flex items-start gap-2 text-sm",
                        feature.includes('✅') ? "text-green-600" : "text-gray-400"
                      )}>
                        <Check className={cn(
                          "w-4 h-4 mt-0.5 flex-shrink-0",
                          feature.includes('✅') ? "text-green-500" : "text-gray-300"
                        )} />
                        {feature.replace(/✅|❌/, '').trim()}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>

        {/* One-Time Purchases */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">One-Time Purchases (Lifetime)</h2>
          <p className="text-sm text-gray-600 mb-4">Perfect for students who want permanent access to specific subjects</p>
          <div className="grid md:grid-cols-3 gap-4">
            {LIFETIME_PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  'relative p-6 rounded-xl border-2 text-left transition-all',
                  selectedPlan === plan.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {plan.price} MVR <span className="text-sm font-normal text-gray-500">lifetime</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Choose Level</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedLevel('OLEVEL')}
              className={cn(
                'flex-1 p-6 rounded-xl border-2 text-center transition-all',
                selectedLevel === 'OLEVEL'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <h3 className="text-lg font-bold text-gray-900">O Level</h3>
              <p className="text-sm text-gray-600">Cambridge & Edexcel</p>
            </button>
            <button
              onClick={() => setSelectedLevel('ALEVEL')}
              className={cn(
                'flex-1 p-6 rounded-xl border-2 text-center transition-all',
                selectedLevel === 'ALEVEL'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <h3 className="text-lg font-bold text-gray-900">A Level</h3>
              <p className="text-sm text-gray-600">Cambridge & Edexcel</p>
            </button>
            <button
              onClick={() => setSelectedLevel('all')}
              className={cn(
                'flex-1 p-6 rounded-xl border-2 text-center transition-all',
                selectedLevel === 'all'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <h3 className="text-lg font-bold text-gray-900">Both</h3>
              <p className="text-sm text-gray-600">O Level & A Level</p>
            </button>
          </div>
        </div>

        {/* Subject Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Choose Subjects</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-wrap gap-3 mb-4">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => toggleSubject(subject.name)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedSubjects.includes(subject.name)
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'
                  )}
                >
                  {subject.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedSubjects(selectedSubjects.includes('all') ? [] : ['all'])}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedSubjects.includes('all')
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'
              )}
            >
              Select All Subjects
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Order Summary</h2>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Plan</span>
            <span className="font-medium text-gray-900">{currentPlan?.name}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Level</span>
            <span className="font-medium text-gray-900">
              {selectedLevel === 'all' ? 'Both O Level & A Level' : 
               selectedLevel === 'OLEVEL' ? 'O Level' : 'A Level'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Subjects</span>
            <span className="font-medium text-gray-900">
              {selectedSubjects.includes('all') ? 'All Subjects' : 
               selectedSubjects.length > 0 ? selectedSubjects.join(', ') : 'None selected'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Price per Subject</span>
            <span className="font-medium text-gray-900">{totalPrice} MVR</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">{totalPrice} MVR</span>
          </div>
          
          {user ? (
            <button
              onClick={handleSubmit}
              disabled={loading || selectedSubjects.length === 0}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          ) : (
            <Link to="/login" className="block w-full btn-primary py-3 text-center">
              Sign In to Subscribe
            </Link>
          )}
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Payment request will be reviewed and processed within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
