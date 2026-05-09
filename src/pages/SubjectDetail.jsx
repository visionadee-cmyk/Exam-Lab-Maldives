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
  ExternalLink
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

export function SubjectDetail() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
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

  const handleTopicPractice = (topic) => {
    navigate('/practice', {
      state: {
        subject: subjectId,
        topic,
        mode: 'topic'
      }
    });
  };

  const handleFullExam = () => {
    navigate('/exam', {
      state: {
        subject: subjectId,
        mode: 'full'
      }
    });
  };

  const handleQuickPractice = () => {
    navigate('/practice', {
      state: {
        subject: subjectId,
        mode: 'mixed'
      }
    });
  };

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

  const handlePastPaper = (paperId) => {
    if (subject.id !== 'biology_ial_pearson') return;
    const paperData = interactivePaperById[paperId];
    if (!paperData) return;
    try {
      navigate('/paper', {
        state: {
          paper: paperData,
          subject: subject
        }
      });
    } catch (err) {
      console.error('Failed to load paper:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => navigate('/subjects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Subjects
        </button>
        
        <div className="flex items-center space-x-4">
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', subject.color)}>
            {(() => {
              const IconComponent = iconMap[subject.icon] || BookOpen;
              return <IconComponent className="w-8 h-8 text-white" />;
            })()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
            <p className="text-gray-600">{subject.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={handleQuickPractice}
          className="card hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
            <Play className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Quick Practice</h3>
          <p className="text-sm text-gray-600 mt-1">Mixed questions from all topics</p>
        </button>

        <button
          onClick={handleFullExam}
          className="card hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Full Exam</h3>
          <p className="text-sm text-gray-600 mt-1">Timed exam simulation</p>
        </button>

        <div className="card text-left">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Your Progress</h3>
          <p className="text-sm text-gray-600 mt-1">Track your performance</p>
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">65% mastery</p>
          </div>
        </div>
      </div>

      {/* Past Paper Mode */}
      {subject.id === 'biology_ial_pearson' && interactivePapers.length > 0 && (
        <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Past Paper Mode</h3>
            <p className="text-sm text-gray-600">Choose a paper to start</p>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {interactivePapers.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePastPaper(p.id)}
                className="btn-primary"
              >
                Start {p.session} • {p.code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Topics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subject.topics.map((topic, index) => (
            <button
              key={`${topic}-${index}`}
              onClick={() => handleTopicPractice(topic)}
              className="card hover:shadow-md transition-all text-left group flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {topic}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Practice questions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Past Papers */}
      {papers.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Past Papers</h2>
          <div className="space-y-3">
            {papers.map((paper) => {
              const url = new URL(`../data/${paper.file}`, import.meta.url).toString();
              return (
                <a
                  key={paper.id}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{paper.session} • {paper.code}</p>
                      <p className="text-xs text-gray-600">{paper.title} ({paper.type})</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Types Info */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Question Types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {QUESTION_TYPES.map((type) => (
            <div key={type.id} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{type.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
