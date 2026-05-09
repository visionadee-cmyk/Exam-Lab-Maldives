import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, BookOpen, CheckCircle, XCircle, RefreshCw, Crown, 
  Zap, Target, Award, Users, ArrowRight, Star, Shield, Clock, LogIn, UserPlus,
  Mail, Phone, MessageCircle
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
      navigate('/pdf-library');
    } else {
      alert(`Payment integration coming soon! Selected: ${plan.name} - ${plan.price} MVR${plan.period}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header with Logo and Auth Buttons */}
          <div className="flex justify-between items-center mb-8">
            {/* Logo and Name */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Exam Lab Maldives" 
                className="w-12 h-12 rounded-xl"
              />
              <div>
                <span className="text-xl font-bold" style={{ color: '#111827' }}>Exam Lab</span>
                <span className="text-xl font-bold ml-1" style={{ color: '#2563EB' }}>Maldives</span>
              </div>
            </Link>
            
            {/* Auth Buttons */}
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                style={{ backgroundColor: 'white', color: '#2563EB', border: '2px solid #2563EB' }}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                style={{ backgroundColor: '#2563EB', color: 'white' }}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              #1 Exam Resource in Maldives
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#111827' }}>
              Exam Lab <span style={{ color: '#2563EB' }}>Maldives</span>
            </h1>
            <p className="text-lg mb-6" style={{ color: '#1E40AF' }}>
              Your complete exam preparation companion. Access thousands of verified past papers, 
              practice with answers, and track your progress to ace your O-Level & A-Level exams.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl md:text-3xl font-bold" style={{ color: '#2563EB' }}>{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/pdf-library')}
                className="px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#2563EB', color: 'white' }}
              >
                View Free Papers
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: 'white', color: '#111827', border: '2px solid #E5E7EB' }}
              >
                <Crown className="w-5 h-5" style={{ color: '#F59E0B' }} />
                Upgrade
              </button>
            </div>
            </div>

            {/* Right - Illustration */}
            <div className="hidden lg:block">
              <img 
                src="/storyset/Exams-cuate.png" 
                alt="Exam Preparation" 
                className="w-full h-auto max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Ace Your Exams</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources to help you practice effectively and achieve top grades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl border hover:shadow-lg transition-all" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#DBEAFE' }}>
                  <feature.icon className="w-6 h-6" style={{ color: '#2563EB' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>{feature.title}</h3>
                <p style={{ color: '#6B7280' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#111827' }}>Simple, Transparent Pricing</h2>
            <p className="max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              Choose the plan that fits your needs. All prices in Maldivian Rufiyaa (MVR).
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-2xl p-6 transition-all hover:shadow-xl border"
                style={{ 
                  backgroundColor: plan.popular ? '#2563EB' : '#FFFFFF',
                  borderColor: plan.popular ? '#2563EB' : '#E5E7EB',
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-sm font-bold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: plan.popular ? 'rgba(255,255,255,0.2)' : '#DBEAFE' }}>
                    <plan.icon className="w-5 h-5" style={{ color: plan.popular ? 'white' : '#2563EB' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: plan.popular ? 'white' : '#111827' }}>
                      {plan.name}
                    </h3>
                    <p className="text-sm" style={{ color: plan.popular ? 'rgba(255,255,255,0.8)' : '#6B7280' }}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: plan.popular ? 'white' : '#111827' }}>
                    {plan.price === 0 ? 'Free' : `${plan.price} MVR`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm" style={{ color: plan.popular ? 'rgba(255,255,255,0.8)' : '#6B7280' }}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: plan.popular ? '#86EFAC' : '#10B981' }} />
                      ) : (
                        <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: plan.popular ? 'rgba(255,255,255,0.4)' : '#D1D5DB' }} />
                      )}
                      <span className="text-sm" style={{ color: feature.included ? (plan.popular ? 'white' : '#374151') : (plan.popular ? 'rgba(255,255,255,0.6)' : '#9CA3AF') }}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all"
                  style={{ 
                    backgroundColor: plan.popular ? 'white' : '#2563EB',
                    color: plan.popular ? '#2563EB' : 'white'
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6" style={{ color: '#6B7280' }}>
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
      <div className="py-16" style={{ backgroundColor: '#111827' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Ace Your Exams?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of students in Maldives who are already using Exam Lab to achieve top grades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pdf-library"
              className="px-8 py-4 rounded-xl font-semibold transition-all"
              style={{ backgroundColor: '#2563EB', color: 'white' }}
            >
              Start Free Now
            </Link>
            <Link
              to="/subjects"
              className="px-8 py-4 rounded-xl font-semibold transition-all border"
              style={{ backgroundColor: '#1F2937', color: 'white', borderColor: '#374151' }}
            >
              Explore All Subjects
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#111827' }}>Contact Us</h2>
          <p className="mb-8" style={{ color: '#6B7280' }}>
            Have questions? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="mailto:retey.ay@hotmail.com"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
              style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}
            >
              <Mail className="w-5 h-5" />
              retey.ay@hotmail.com
            </a>
            <a 
              href="https://wa.me/9609795529"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
              style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
            >
              <MessageCircle className="w-5 h-5" />
              +960 9795529
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6" style={{ backgroundColor: '#111827' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Developed by <span className="text-white font-medium">Retts Web Dev</span> • 
            Powered by <span className="text-white font-medium">Hawaain Brothers Pvt Ltd</span>
          </p>
        </div>
      </div>
    </div>
  );
}
