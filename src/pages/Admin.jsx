import { useState, useEffect } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { SUBJECTS, QUESTION_TYPES, DIFFICULTY_LEVELS } from '../data/subjects';
import { db } from '../services/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  Search,
  Users,
  CreditCard,
  Settings,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Mail,
  MoreVertical
} from 'lucide-react';
import { cn } from '../utils/cn';

const PRICING_PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['View Question Papers'] },
  { id: 'answers', name: 'With Answers', price: 25, features: ['View Mark Schemes', 'Check Answers'] },
  { id: 'full', name: 'Full Access', price: 50, features: ['Practice Mode', 'Unlimited Resets'] },
  { id: 'pro', name: 'Pro Monthly', price: 150, features: ['Unlimited Everything', 'Priority Support'] },
];

export function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState('all');
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  const { questions, loading: questionsLoading, addQuestion, updateQuestion, deleteQuestion } = useQuestions();

  useEffect(() => {
    loadUsers();
    loadPayments();
    loadPaymentRequests();
  }, []);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A',
          lastLogin: data?.lastLogin ? new Date(data.lastLogin).toLocaleDateString() : 'N/A'
        };
      });
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
    }
    setLoading(false);
  };

  const loadPayments = async () => {
    try {
      const paymentsRef = collection(db, 'payments');
      const snapshot = await getDocs(paymentsRef);
      const paymentsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data?.date ? new Date(data.date).toLocaleDateString() : 'N/A'
        };
      });
      setPayments(paymentsData);
    } catch (err) {
      console.error('Error loading payments:', err);
      setPayments([]);
    }
  };

  const loadPaymentRequests = async () => {
    try {
      const requestsRef = collection(db, 'paymentRequests');
      const snapshot = await getDocs(requestsRef);
      const requestsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : 'N/A'
        };
      });
      setPaymentRequests(requestsData);
    } catch (err) {
      console.error('Error loading payment requests:', err);
      setPaymentRequests([]);
    }
  };

  const approvePaymentRequest = async (request) => {
    try {
      // Update user access
      const userRef = doc(db, 'users', request.userId);
      await updateDoc(userRef, {
        plan: request.plan,
        subjects: request.subjects,
        updatedAt: serverTimestamp()
      });
      
      // Update request status
      const requestRef = doc(db, 'paymentRequests', request.id);
      await updateDoc(requestRef, {
        status: 'approved',
        approvedAt: serverTimestamp()
      });

      // Add to payments history
      await addDoc(collection(db, 'payments'), {
        userId: request.userId,
        userEmail: request.userEmail,
        userName: request.userName,
        plan: request.planName,
        subject: request.subjects.join(', '),
        amount: request.amount,
        date: serverTimestamp(),
        status: 'completed'
      });

      loadPaymentRequests();
      loadUsers();
      loadPayments();
      alert(`Access granted to ${request.userName}!`);
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Failed to approve request');
    }
  };

  const updateUserAccess = async (userId, updates) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() });
      loadUsers();
      setShowAccessModal(false);
    } catch (err) {
      console.error('Error updating user:', err);
      // Update local state for demo
      setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
      setShowAccessModal(false);
    }
  };

  const deleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        loadUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const activeSubscribers = users.filter(u => u.plan !== 'free').length;

  // Demo questions for the admin view
  const demoAdminQuestions = [
    {
      id: '1',
      type: 'mcq',
      subjectId: 'mathematics',
      topic: 'Algebra',
      difficulty: 'medium',
      text: 'Solve for x: 2x + 5 = 13',
      marks: 2,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'calculation',
      subjectId: 'physics',
      topic: 'Mechanics',
      difficulty: 'hard',
      text: 'Calculate the force required to accelerate a 2kg mass at 5 m/s²',
      marks: 3,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      type: 'structured',
      subjectId: 'chemistry',
      topic: 'Organic Chemistry',
      difficulty: 'medium',
      text: 'Explain the process of fractional distillation',
      marks: 5,
      createdAt: '2024-01-13'
    }
  ];

  const handleAddQuestion = async (questionData) => {
    try {
      await addQuestion(questionData);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add question:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id);
      } catch (err) {
        console.error('Failed to delete question:', err);
      }
    }
  };

  const filteredQuestions = demoAdminQuestions.filter(q => {
    if (filterSubject !== 'all' && q.subjectId !== filterSubject) return false;
    if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, payments, and subscriptions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Crown className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeSubscribers}</p>
              <p className="text-sm text-gray-600">Active Subscribers</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue} MVR</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'requests', label: 'Requests', icon: CreditCard },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'questions', label: 'Questions', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 capitalize',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      {(activeTab === 'users' || activeTab === 'payments') && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const plan = PRICING_PLANS.find(p => p.id === user.plan);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          user.plan === 'free' && 'bg-gray-100 text-gray-800',
                          user.plan === 'answers' && 'bg-blue-100 text-blue-800',
                          user.plan === 'full' && 'bg-purple-100 text-purple-800',
                          user.plan === 'pro' && 'bg-amber-100 text-amber-800'
                        )}>
                          {plan?.name || 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.subjects?.includes('all') ? 'All Subjects' : 
                           user.subjects?.length > 0 ? user.subjects.join(', ') : 'None'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => { setSelectedUser(user); setShowAccessModal(true); }}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          title="Manage Access"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Requests Table */}
      {activeTab === 'requests' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No pending payment requests
                    </td>
                  </tr>
                ) : (
                  paymentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                        <div className="text-sm text-gray-500">{request.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.planName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {request.subjects?.includes('all') ? 'All Subjects' : request.subjects?.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.amount} MVR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          request.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                          request.status === 'approved' && 'bg-green-100 text-green-800',
                          request.status === 'rejected' && 'bg-red-100 text-red-800'
                        )}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'pending' && (
                          <button 
                            onClick={() => approvePaymentRequest(request)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Approve & Grant Access"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Table */}
      {activeTab === 'payments' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                      <div className="text-sm text-gray-500">{payment.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {payment.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.amount} MVR
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        payment.status === 'completed' && 'bg-green-100 text-green-800',
                        payment.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                        payment.status === 'failed' && 'bg-red-100 text-red-800'
                      )}>
                        {payment.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                         payment.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> :
                         <XCircle className="w-3 h-3 mr-1" />}
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filters */}
      {activeTab === 'questions' && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="input sm:w-48"
            >
              <option value="all">All Subjects</option>
              {SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        </div>
      )}

      {/* Questions Table */}
      {activeTab === 'questions' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions.map((question) => {
                  const subject = SUBJECTS.find(s => s.id === question.subjectId);
                  return (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {question.text}
                        </div>
                        <div className="text-xs text-gray-500">
                          {question.topic}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{subject?.name || question.subjectId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {question.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          question.difficulty === 'easy' && 'bg-green-100 text-green-800',
                          question.difficulty === 'medium' && 'bg-yellow-100 text-yellow-800',
                          question.difficulty === 'hard' && 'bg-red-100 text-red-800'
                        )}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {question.marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setEditingQuestion(question)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {activeTab === 'questions' && showAddModal && (
        <AddQuestionModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddQuestion}
        />
      )}

      {/* User Access Modal */}
      {showAccessModal && selectedUser && (
        <UserAccessModal 
          user={selectedUser}
          onClose={() => { setShowAccessModal(false); setSelectedUser(null); }}
          onSave={(updates) => updateUserAccess(selectedUser.id, updates)}
        />
      )}
    </div>
  );
}

function AddQuestionModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    type: 'mcq',
    subjectId: '',
    topic: '',
    difficulty: 'medium',
    text: '',
    marks: 1,
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    steps: ['']
  });

  const [activeStep, setActiveStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const selectedSubject = SUBJECTS.find(s => s.id === formData.subjectId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Add New Question</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Basic Info */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="label">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {selectedSubject && (
                  <div>
                    <label className="label">Topic</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                      className="input"
                      required
                    >
                      <option value="">Select Topic</option>
                      {selectedSubject.topics.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Question Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="input"
                    >
                      {QUESTION_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      className="input"
                    >
                      {DIFFICULTY_LEVELS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: parseInt(e.target.value)})}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Question Text</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                    className="input"
                    rows={4}
                    required
                    placeholder="Enter your question here..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Answer Options */}
            {activeStep === 2 && (
              <div className="space-y-4">
                {formData.type === 'mcq' && (
                  <>
                    <label className="label">Answer Options</label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === option}
                          onChange={() => setFormData({...formData, correctAnswer: option})}
                          className="w-4 h-4 text-primary-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData({...formData, options: newOptions});
                          }}
                          className="input flex-1"
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}
                  </>
                )}

                {formData.type !== 'mcq' && (
                  <div>
                    <label className="label">Correct Answer</label>
                    <textarea
                      value={formData.correctAnswer}
                      onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                      className="input"
                      rows={3}
                      required
                      placeholder="Enter the correct answer..."
                    />
                  </div>
                )}

                <div>
                  <label className="label">Explanation</label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                    className="input"
                    rows={4}
                    placeholder="Explain the solution..."
                  />
                </div>

                <div>
                  <label className="label">Solution Steps</label>
                  {formData.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-500 w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const newSteps = [...formData.steps];
                          newSteps[index] = e.target.value;
                          setFormData({...formData, steps: newSteps});
                        }}
                        className="input flex-1"
                        placeholder={`Step ${index + 1}`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, steps: [...formData.steps, '']})}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Step
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={activeStep === 1 ? onClose : () => setActiveStep(1)}
                className="btn-secondary"
              >
                {activeStep === 1 ? 'Cancel' : 'Back'}
              </button>
              
              {activeStep === 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="btn-primary"
                  disabled={!formData.subjectId || !formData.text}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Question
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UserAccessModal({ user, onClose, onSave }) {
  const [plan, setPlan] = useState(user.plan || 'free');
  const [subjects, setSubjects] = useState(user.subjects || []);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin || false);

  const availableSubjects = SUBJECTS.map(s => s.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ plan, subjects, isAdmin });
  };

  const toggleSubject = (subject) => {
    if (subjects.includes(subject)) {
      setSubjects(subjects.filter(s => s !== subject));
    } else {
      setSubjects([...subjects, subject]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Manage User Access</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">User Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="label">Subscription Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="input"
              >
                {PRICING_PLANS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.price > 0 ? `- ${p.price} MVR` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Subject Access</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableSubjects.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      subjects.includes(subject) || subjects.includes('all')
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                    )}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSubjects(subjects.includes('all') ? [] : ['all'])}
                className={cn(
                  'mt-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  subjects.includes('all')
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                )}
              >
                All Subjects
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="isAdmin" className="text-sm font-medium text-gray-900">
                Make this user an Admin
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
