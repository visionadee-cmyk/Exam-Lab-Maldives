import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Crown, 
  LogOut, 
  Settings,
  BookOpen,
  CreditCard,
  ChevronRight,
  Award,
  Clock,
  Target
} from 'lucide-react';
import { cn } from '../utils/cn';

const PLANS = [
  { id: 'free', name: 'Free', price: 0 },
  { id: 'answers', name: 'With Answers', price: 25 },
  { id: 'full', name: 'Full Access', price: 50 },
  { id: 'pro', name: 'Pro Monthly', price: 150 },
];

export function Profile() {
  const { user, userData, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentPlan = PLANS.find(p => p.id === userData?.plan) || PLANS[0];

  const menuItems = [
    { icon: BookOpen, label: 'My Subjects', value: userData?.subjects?.length || 0, path: '/subjects' },
    { icon: Target, label: 'Questions Answered', value: userData?.stats?.totalQuestions || 0, path: '/progress' },
    { icon: Award, label: 'Exams Completed', value: userData?.stats?.examsTaken || 0, path: '/progress' },
    { icon: Clock, label: 'Practice Sessions', value: userData?.stats?.practiceSessions || 0, path: '/progress' },
  ];

  const settingsItems = [
    { icon: CreditCard, label: 'Subscription', value: currentPlan.name, path: '/subscribe' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{userData?.name || user?.displayName || 'Student'}</h2>
            <p className="text-primary-100 text-sm">{user?.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Crown className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">{currentPlan.name} Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className="bg-white rounded-xl p-4 border border-gray-100"
            >
              <Icon className="w-5 h-5 text-primary-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Subscription Card */}
      <Link 
        to="/subscribe" 
        className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Upgrade Plan</p>
            <p className="text-sm text-gray-500">Unlock more features</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Link>

      {/* Settings Menu */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                'flex items-center justify-between p-4 hover:bg-gray-50',
                index !== settingsItems.length - 1 && 'border-b border-gray-100'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              {item.value && (
                <span className="text-sm text-gray-500">{item.value}</span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          Exam Lab MV v1.0 • Developed by Retts Web Dev
        </p>
      </div>
    </div>
  );
}
