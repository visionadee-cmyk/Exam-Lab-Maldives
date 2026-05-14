import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home,
  BookOpen,
  Brain,
  BarChart3,
  User,
  LogOut,
  Crown,
  Settings,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { defaultPracticeSubjectId } from '../lib/practicePrefs';

export function Layout() {
  const { user, userData, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const bottomNavItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/subjects', label: 'Subjects', icon: BookOpen },
    { path: '/pdf-library', label: 'PDFs', icon: FileText },
    { path: '/practice', label: 'Practice', icon: Brain },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/practice') {
      return location.pathname === '/practice' || location.pathname.startsWith('/practice/');
    }
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - Minimal */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src="/logo.png" alt="Exam Lab MV" className="w-8 h-8 object-contain" />
            <span className="font-bold text-gray-900">Exam Lab MV</span>
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="p-2 text-gray-500">
              <Settings className="w-5 h-5" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex justify-around h-16">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const to = item.path === '/practice' ? `/practice/${defaultPracticeSubjectId()}` : item.path;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-2',
                  active ? 'text-primary-600' : 'text-gray-400'
                )}
              >
                <Icon className={cn('w-6 h-6', active && 'fill-primary-100')} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
