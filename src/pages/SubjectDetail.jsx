import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBJECTS, QUESTION_TYPES } from '../data/subjects';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import biologyWbi11Jan2019Unit1 from '../data/papers/biology-wbi11-jan2019-unit1.json';
import biologyWbi11May2019Unit1 from '../data/papers/biology-wbi11-may2019-unit1.json';
import biologyWbi11Oct2019Unit1 from '../data/papers/biology-wbi11-oct2019-unit1.json';
import biologyWbi11Jan2020Unit1 from '../data/papers/biology-wbi11-jan2020-unit1.json';
import biologyWbi11Oct2020Unit1 from '../data/papers/biology-wbi11-oct2020-unit1.json';
import biologyWbi12Jun2019Unit2 from '../data/papers/biology-wbi12-jun2019-unit2.json';
import biologyWbi12Oct2019Unit2 from '../data/papers/biology-wbi12-oct2019-unit2.json';
import biologyWbi12Jan2020Unit2 from '../data/papers/biology-wbi12-jan2020-unit2.json';
import biologyWbi12May2020Unit2 from '../data/papers/biology-wbi12-may2020-unit2.json';
import biologyWbi13Jun2019Unit3 from '../data/papers/biology-wbi13-jun2019-unit3.json';
import biologyWbi13Oct2019Unit3 from '../data/papers/biology-wbi13-oct2019-unit3.json';
import biology06102021Unit1June from '../data/papers/biology-0610-2021-unit1-june-ms.json';
import biology06102021Unit1November from '../data/papers/biology-0610-2021-unit1-november-ms.json';
import biology06102021Unit2June from '../data/papers/biology-0610-2021-unit2-june-ms.json';
import biology06102021Unit2November from '../data/papers/biology-0610-2021-unit2-november-ms.json';
import biology06102021Unit3June from '../data/papers/biology-0610-2021-unit3-june-ms.json';
import biology06102021Unit3November from '../data/papers/biology-0610-2021-unit3-november-ms.json';
import biology06102021Unit6June from '../data/papers/biology-0610-2021-unit6-june-ms.json';
import biology06102021Unit6November from '../data/papers/biology-0610-2021-unit6-november-ms.json';
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  Clock, 
  Target, 
  ChevronRight,
  GraduationCap,
  Calculator,
  Atom,
  FlaskConical,
  Briefcase,
  Monitor,
  Microscope,
  TrendingUp,
  BookMarked,
  Languages,
  Plane,
  FileText,
  ExternalLink,
  FileQuestion,
  StickyNote,
  BarChart3,
  FlaskConical as MockIcon
} from 'lucide-react';
import { cn } from '../utils/cn';

const iconMap = {
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Briefcase,
  Monitor,
  Microscope,
  TrendingUp,
  BookMarked,
  Languages,
  Plane,
  GraduationCap
};

const TABS = [
  { id: 'papers', label: 'Papers', icon: FileText },
  { id: 'topics', label: 'Topics', icon: FileQuestion },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'mock', label: 'Mock Exams', icon: MockIcon },
];

export function SubjectDetail() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('papers');
  
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const papers = Array.isArray(subject?.papers) ? subject.papers : [];
  
  // Get progress from localStorage
  const [progressStats, setProgressStats] = useState({
    completed: 0,
    total: 0,
    accuracy: 0,
    weakTopic: null,
    streak: 0
  });

  useEffect(() => {
    if (userData && subjectId) {
      const key = `progress_${subjectId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        // Calculate accuracy
        const totalQuestions = data.completed || 0;
        const correctAnswers = data.correct || 0;
        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        // Find weak topic
        const topicStats = data.topicStats || {};
        let weakTopic = null;
        let lowestAccuracy = 100;
        Object.entries(topicStats).forEach(([topic, stats]) => {
          const topicAcc = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
          if (topicAcc < lowestAccuracy && stats.total >= 3) {
            lowestAccuracy = topicAcc;
            weakTopic = topic;
          }
        });
        
        setProgressStats({
          completed: totalQuestions,
          total: data.total || 0,
          accuracy,
          weakTopic,
          streak: data.streak || 0
        });
      }
      
      // Load notes
      const notesKey = `notes_${subjectId}`;
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }
  }, [userData, subjectId]);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  const saveNote = () => {
    if (!newNote.trim()) return;
    const updated = [...notes, { id: Date.now(), text: newNote, date: new Date().toISOString() }];
    setNotes(updated);
    localStorage.setItem(`notes_${subjectId}`, JSON.stringify(updated));
    setNewNote('');
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem(`notes_${subjectId}`, JSON.stringify(updated));
  };

  const updateNote = (id, text) => {
    const updated = notes.map(n => n.id === id ? { ...n, text, date: new Date().toISOString() } : n);
    setNotes(updated);
    localStorage.setItem(`notes_${subjectId}`, JSON.stringify(updated));
    setEditingNote(null);
  };
  
  if (!subject) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Subject Not Found</h1>
        <button onClick={() => navigate('/subjects')} className="btn-primary mt-4">
          Back to Subjects
        </button>
      </div>
    );
  }

  const interactivePaperById = {
    'wbi11-jan-2019-unit1-qp': biologyWbi11Jan2019Unit1,
    'wbi11-may-2019-unit1-qp': biologyWbi11May2019Unit1,
    'wbi11-oct-2019-unit1-qp': biologyWbi11Oct2019Unit1,
    'wbi11-jan-2020-unit1-qp': biologyWbi11Jan2020Unit1,
    'wbi11-oct-2020-unit1-qp': biologyWbi11Oct2020Unit1,
    'wbi12-jun-2019-unit2-qp': biologyWbi12Jun2019Unit2,
    'wbi12-oct-2019-unit2-qp': biologyWbi12Oct2019Unit2,
    'wbi12-jan-2020-unit2-qp': biologyWbi12Jan2020Unit2,
    'wbi12-may-2020-unit2-qp': biologyWbi12May2020Unit2,
    'wbi13-jun-2019-unit3-qp': biologyWbi13Jun2019Unit3,
    'wbi13-oct-2019-unit3-qp': biologyWbi13Oct2019Unit3,
    'biology-0610-2021-unit1-june-ms': biology06102021Unit1June,
    'biology-0610-2021-unit1-november-ms': biology06102021Unit1November,
    'biology-0610-2021-unit2-june-ms': biology06102021Unit2June,
    'biology-0610-2021-unit2-november-ms': biology06102021Unit2November,
    'biology-0610-2021-unit3-june-ms': biology06102021Unit3June,
    'biology-0610-2021-unit3-november-ms': biology06102021Unit3November,
    'biology-0610-2021-unit6-june-ms': biology06102021Unit6June,
    'biology-0610-2021-unit6-november-ms': biology06102021Unit6November
  };

  const interactivePapers = papers.filter(p => Boolean(interactivePaperById[p.id]));

  const handlePaperClick = (paper) => {
    const paperData = interactivePaperById[paper.id];
    if (paperData) {
      navigate('/paper', {
        state: { paper: paperData, subject }
      });
    }
  };

  const handleTopicPractice = (topic) => {
    navigate('/practice', { state: { subject: subjectId, topic, mode: 'topic' } });
  };

  const handleQuickPractice = () => {
    navigate('/practice', { state: { subject: subjectId, mode: 'mixed' } });
  };

  const handleFullExam = () => {
    navigate('/exam', { state: { subject: subjectId, mode: 'full' } });
  };

  return (
    <div className="space-y-4">
      {/* Back & Header */}
      <div>
        <button onClick={() => navigate('/subjects')} className="flex items-center text-gray-600 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', subject.color)}>
            {(() => {
              const IconComponent = iconMap[subject.icon] || BookOpen;
              return <IconComponent className="w-6 h-6 text-white" />;
            })()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{subject.name}</h1>
            <p className="text-sm text-gray-500">{subject.code}</p>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      {progressStats.completed > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm text-gray-500">{progressStats.completed} questions</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all" 
              style={{ width: `${Math.min((progressStats.completed / 60) * 100, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 rounded-lg p-2">
              <p className="text-lg font-bold text-green-600">{progressStats.accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-lg font-bold text-blue-600">{progressStats.completed}</p>
              <p className="text-xs text-gray-500">Practiced</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2">
              <p className="text-lg font-bold text-amber-600">{progressStats.streak}</p>
              <p className="text-xs text-gray-500">Streak</p>
            </div>
          </div>
          {progressStats.weakTopic && (
            <div className="bg-red-50 rounded-lg p-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">
                Weak topic: <strong>{progressStats.weakTopic}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'papers' && (
        <div className="space-y-3">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleQuickPractice} className="bg-green-50 rounded-xl p-4 text-left">
              <Play className="w-5 h-5 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Practice</p>
              <p className="text-xs text-gray-500">Mixed questions</p>
            </button>
            <button onClick={handleFullExam} className="bg-amber-50 rounded-xl p-4 text-left">
              <Clock className="w-5 h-5 text-amber-600 mb-2" />
              <p className="font-medium text-gray-900">Exam</p>
              <p className="text-xs text-gray-500">Timed test</p>
            </button>
          </div>

          {/* Paper List */}
          {interactivePapers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => handlePaperClick(paper)}
              className="w-full bg-white rounded-xl p-4 border border-gray-100 text-left flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">{paper.session}</p>
                <p className="text-sm text-gray-500">{paper.code}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="grid grid-cols-2 gap-3">
          {subject.topics.map((topic, index) => (
            <button
              key={`${topic}-${index}`}
              onClick={() => handleTopicPractice(topic)}
              className="bg-white rounded-xl p-4 border border-gray-100 text-left"
            >
              <p className="font-medium text-gray-900 text-sm">{topic}</p>
            </button>
          ))}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-4">
          {/* Add Note */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
            <button
              onClick={saveNote}
              disabled={!newNote.trim()}
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4 inline mr-1" /> Add Note
            </button>
          </div>

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notes yet. Add your first note above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-xl p-4 border border-gray-100">
                  {editingNote === note.id ? (
                    <div>
                      <textarea
                        defaultValue={note.text}
                        id={`note-${note.id}`}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => updateNote(note.id, document.getElementById(`note-${note.id}`).value)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                        >
                          <Save className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
                        >
                          <X className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-900 text-sm">{note.text}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          {new Date(note.date).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingNote(note.id)}
                            className="p-1 text-gray-400 hover:text-primary-500"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">65%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-primary-500 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-xl font-bold text-gray-900">120</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-xl font-bold text-green-600">78%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-xl font-bold text-amber-600">5</p>
              <p className="text-xs text-gray-500">Exams</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mock' && (
        <div className="text-center py-12 text-gray-500">
          <MockIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Mock exams coming soon</p>
        </div>
      )}
    </div>
  );
}
