import { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { SUBJECTS, QUESTION_TYPES, DIFFICULTY_LEVELS } from '../data/subjects';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  Search,
  Filter,
  Image as ImageIcon,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../utils/cn';

export function Admin() {
  const [activeTab, setActiveTab] = useState('questions');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  const { questions, loading, addQuestion, updateQuestion, deleteQuestion } = useQuestions();

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
          <p className="text-gray-600">Manage questions, users, and system settings</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['questions', 'users', 'subjects', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm capitalize',
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

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

      {/* Other Tabs Placeholder */}
      {activeTab === 'users' && (
        <div className="card p-8 text-center">
          <p className="text-gray-500">User management coming soon</p>
        </div>
      )}
      {activeTab === 'subjects' && (
        <div className="card p-8 text-center">
          <p className="text-gray-500">Subject management coming soon</p>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="card p-8 text-center">
          <p className="text-gray-500">System settings coming soon</p>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <AddQuestionModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddQuestion}
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
