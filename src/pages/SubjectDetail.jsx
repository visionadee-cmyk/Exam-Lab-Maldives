import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBJECTS, QUESTION_TYPES } from '../data/subjects';
import biologyWbi11Jan2019Unit1 from '../data/papers/biology-wbi11-jan2019-unit1.json';
import biologyWbi11May2019Unit1 from '../data/papers/biology-wbi11-may2019-unit1.json';
import biologyWbi11Oct2019Unit1 from '../data/papers/biology-wbi11-oct2019-unit1.json';
import biologyWbi11Jan2020Unit1 from '../data/papers/biology-wbi11-jan2020-unit1.json';
import biologyWbi12Jun2019Unit2 from '../data/papers/biology-wbi12-jun2019-unit2.json';
import biologyWbi12Oct2019Unit2 from '../data/papers/biology-wbi12-oct2019-unit2.json';
import biologyWbi13Jun2019Unit3 from '../data/papers/biology-wbi13-jun2019-unit3.json';
import biologyWbi13Oct2019Unit3 from '../data/papers/biology-wbi13-oct2019-unit3.json';
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
  const [activeTab, setActiveTab] = useState('papers');
  
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const papers = Array.isArray(subject?.papers) ? subject.papers : [];
  
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
    'wbi12-jun-2019-unit2-qp': biologyWbi12Jun2019Unit2,
    'wbi12-oct-2019-unit2-qp': biologyWbi12Oct2019Unit2,
    'wbi13-jun-2019-unit3-qp': biologyWbi13Jun2019Unit3,
    'wbi13-oct-2019-unit3-qp': biologyWbi13Oct2019Unit3
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
        <div className="text-center py-12 text-gray-500">
          <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No notes available yet</p>
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
