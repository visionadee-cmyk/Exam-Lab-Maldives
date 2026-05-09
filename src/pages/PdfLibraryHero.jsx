import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, BookOpen, CheckCircle, XCircle, RefreshCw, Crown, 
  Zap, Target, Award, Users, ArrowRight, Star, Shield, Clock
} from 'lucide-react';
import { cn } from '../utils/cn';

const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '',
    description: 'Access past papers for practice',
    icon: FileText,
    color: 'gray',
    features: [
      { text: 'View Question Papers', included: true },
      { text: 'All Exam Boards (Cambridge, Edexcel)', included: true },
      { text: 'O Level & A Level Papers', included: true },
      { text: 'Search & Filter Papers', included: true },
      { text: 'View Mark Schemes (Answers)', included: false },
      { text: 'Practice Mode with Reset', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'answers',
    name: 'With Answers',
    price: 25,
    period: '/subject',
    description: 'One-time payment per subject',
    icon: CheckCircle,
    color: 'blue',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'View Mark Schemes', included: true },
      { text: 'Check Correct Answers', included: true },
      { text: 'Understand Marking Points', included: true },
      { text: 'Self-Assessment', included: true },
      { text: 'Practice Mode with Reset', included: false },
    ],
    cta: 'Unlock Answers',
    popular: false,
  },
  {
    id: 'full',
    name: 'Full Access',
    price: 50,
    period: '/subject',
    description: 'Complete subject access forever',
    icon: Crown,
    color: 'purple',
    features: [
      { text: 'Everything in Answers', included: true },
      { text: 'Practice Mode', included: true },
      { text: 'Reset & Retry Papers', included: true },
      { text: 'Track Your Progress', included: true },
      { text: 'Detailed Analytics', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Go Full Access',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Monthly',
    price: 150,
    period: '/month/subject',
    icon: Zap,
    color: 'amber',
    description: 'Unlimited practice & resets',
    features: [
      { text: 'Everything in Full Access', included: true },
      { text: 'Unlimited Paper Resets', included: true },
      { text: 'New Papers Added Weekly', included: true },
      { text: 'Early Access to New Content', included: true },
      { text: 'Expert Doubt Solving', included: true },
      { text: 'Cancel Anytime', included: true },
    ],
    cta: 'Go Pro',
    popular: false,
  },
];

const STATS = [
  { value: '6,600+', label: 'Past Papers' },
  { value: '50+', label: 'Subjects' },
  { value: '15+', label: 'Years of Papers' },
  { value: '100%', label: 'Verified Answers' },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Comprehensive Coverage',
    description: 'Access papers from Cambridge IGCSE, AS & A-Level, and more exam boards.',
  },
  {
    icon: Target,
    title: 'Smart Filtering',
    description: 'Filter by subject, board, year, and paper type (QP/MS) to find exactly what you need.',
  },
  {
    icon: CheckCircle,
    title: 'Verified Answers',
    description: 'All mark schemes are verified and include detailed marking points.',
  },
  {
    icon: RefreshCw,
    title: 'Practice Mode',
    description: 'Reset papers unlimited times to practice until you master every topic.',
  },
  {
    icon: Award,
    title: 'Track Progress',
    description: 'See your improvement over time with detailed analytics and statistics.',
  },
  {
    icon: Users,
    title: 'Used by Students',
    description: 'Join thousands of students acing their exams with Exam Lab Maldives.',
  },
];

export function PdfLibraryHero() {
  const navigate = useNavigate();
  const [manifest, setManifest] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetch('/pdf-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(() => setManifest({ OLEVEL: {}, ALEVEL: {} }));
  }, []);

  const stats = useMemo(() => {
    if (!manifest) return STATS;
    
    let totalPapers = 0;
    let subjects = new Set();
    let boards = new Set();
    
    Object.values(manifest).forEach(levels => {
      Object.values(levels).forEach(boardData => {
        Object.entries(boardData).forEach(([subject, files]) => {
          subjects.add(subject);
          totalPapers += files.length;
        });
      });
    });
    
    return [
      { value: `${totalPapers.toLocaleString()}+`, label: 'Past Papers' },
      { value: `${subjects.size}+`, label: 'Subjects' },
      { value: '15+', label: 'Years of Papers' },
      { value: '100%', label: 'Verified Answers' },
    ];
  }, [manifest]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (plan.id === 'free') {
      navigate('/pdf-library/view');
    } else {
      alert(`Payment integration coming soon! Selected: ${plan.name} - ${plan.price} MVR${plan.period}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              #1 Exam Resource in Maldives
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Past Papers Library
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access thousands of verified past exam papers. Practice with real questions from Cambridge, Edexcel, and more.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pdf-library/view')}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                View Free Papers
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg border border-gray-200 flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5 text-amber-500" />
                Unlock Full Access
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Ace Your Exams</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources to help you practice effectively and achieve top grades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All prices in Maldivian Rufiyaa (MVR).
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl p-6 transition-all hover:shadow-xl',
                  plan.popular 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-4 ring-blue-600 ring-offset-2' 
                    : 'bg-white border border-gray-200'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-sm font-bold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    plan.popular ? 'bg-white/20' : 'bg-blue-100'
                  )}>
                    <plan.icon className={cn('w-5 h-5', plan.popular ? 'text-white' : 'text-blue-600')} />
                  </div>
                  <div>
                    <h3 className={cn('font-bold text-lg', plan.popular ? 'text-white' : 'text-gray-900')}>
                      {plan.name}
                    </h3>
                    <p className={cn('text-sm', plan.popular ? 'text-blue-100' : 'text-gray-500')}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className={cn('text-4xl font-bold', plan.popular ? 'text-white' : 'text-gray-900')}>
                    {plan.price === 0 ? 'Free' : `${plan.price} MVR`}
                  </span>
                  {plan.price > 0 && (
                    <span className={cn('text-sm', plan.popular ? 'text-blue-100' : 'text-gray-500')}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <CheckCircle className={cn('w-5 h-5 flex-shrink-0', plan.popular ? 'text-green-300' : 'text-green-500')} />
                      ) : (
                        <XCircle className={cn('w-5 h-5 flex-shrink-0', plan.popular ? 'text-white/40' : 'text-gray-300')} />
                      )}
                      <span className={cn(
                        'text-sm',
                        feature.included 
                          ? (plan.popular ? 'text-white' : 'text-gray-700')
                          : (plan.popular ? 'text-white/50' : 'text-gray-400')
                      )}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={cn(
                    'w-full py-3 px-4 rounded-xl font-semibold transition-all',
                    plan.popular 
                      ? 'bg-white text-blue-600 hover:bg-blue-50' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">24/7 Access</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              <span className="text-sm">Easy Cancellations</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Ace Your Exams?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of students in Maldives who are already using Exam Lab to achieve top grades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/pdf-library/view')}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Start Free Now
            </button>
            <button
              onClick={() => navigate('/subjects')}
              className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all border border-gray-700"
            >
              Explore All Subjects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
