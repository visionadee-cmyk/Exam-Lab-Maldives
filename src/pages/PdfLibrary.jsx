import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Search, ExternalLink, Download, Eye, Calendar, BookOpen, Filter, Lock, Crown, Grid, List, ChevronDown, ChevronRight, X, Sparkles, Clock, Star, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAccessControl } from '../hooks/useAccessControl';

export function PdfLibrary() {
  const navigate = useNavigate();
  const { canViewAnswers, hasSubjectAccess, userPlan } = useAccessControl();
  const [manifest, setManifest] = useState(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [boardFilter, setBoardFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeTab, setTypeTab] = useState('all'); // 'all', 'qp', 'ms'
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const ITEMS_PER_PAGE = 50;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    fetch('/pdf-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(() => setManifest({ OLEVEL: {}, ALEVEL: {} }));
  }, []);

  const allItems = useMemo(() => {
    if (!manifest) return [];
    const items = [];
    ['OLEVEL', 'ALEVEL'].forEach(level => {
      Object.entries(manifest[level]).forEach(([board, subjects]) => {
        Object.entries(subjects).forEach(([subject, files]) => {
          files.forEach(file => {
            const isQP = /qp|question/i.test(file);
            const isMS = /ms|mark|answer/i.test(file);
            const boardPath = board.replace(/&/g, '%26');
            const subjectPath = subject.replace(/&/g, '%26');
            items.push({
              level,
              board,
              subject,
              file,
              isQP,
              isMS,
              url: `https://media.githubusercontent.com/media/visionadee-cmyk/Exam-Lab-Maldives/main/public/pdf-pastpaer-q%26a/${encodeURIComponent(boardPath)}/${encodeURIComponent(subjectPath)}/${encodeURIComponent(file)}`
            });
          });
        });
      });
    });
    return items;
  }, [manifest]);

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = !search || (
        item.subject.toLowerCase().includes(search.toLowerCase()) ||
        item.file.toLowerCase().includes(search.toLowerCase()) ||
        item.board.toLowerCase().includes(search.toLowerCase())
      );
      const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
      const matchesBoard = boardFilter === 'all' || item.board === boardFilter;
      const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
      const matchesType = typeTab === 'all' || (typeTab === 'qp' && item.isQP) || (typeTab === 'ms' && item.isMS);
      return matchesSearch && matchesLevel && matchesBoard && matchesSubject && matchesType;
    });
  }, [allItems, search, levelFilter, boardFilter, subjectFilter, typeTab]);

  const boards = useMemo(() => [...new Set(allItems.map(i => i.board))], [allItems]);
  const subjects = useMemo(() => [...new Set(allItems.map(i => i.subject))], [allItems]);
  
  // Group by subject
  const groupedBySubject = useMemo(() => {
    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.subject]) {
        groups[item.subject] = [];
      }
      groups[item.subject].push(item);
    });
    return groups;
  }, [filtered]);

  const subjectList = Object.keys(groupedBySubject).sort();

  const toggleSubject = (subject) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filtered.length));
  };

  // Quick filter chips
  const quickFilters = [
    { key: 'recent', label: 'Recent', icon: Clock },
    { key: 'biology', label: 'Biology', icon: Star },
    { key: 'chemistry', label: 'Chemistry', icon: Star },
    { key: 'physics', label: 'Physics', icon: Star },
    { key: 'math', label: 'Math', icon: Star },
  ];

  const handleQuickFilter = (key) => {
    switch(key) {
      case 'recent':
        setSearch('2024');
        break;
      case 'biology':
        setSubjectFilter('Biology');
        break;
      case 'chemistry':
        setSubjectFilter('Chemistry');
        break;
      case 'physics':
        setSubjectFilter('Physics');
        break;
      case 'math':
        setSubjectFilter('Mathematics');
        break;
    }
  };

  if (!manifest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading PDF library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-primary-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/subjects')}
            className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Subjects
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">📚 Past Papers Library</h1>
              <p className="text-white/80 text-lg">Browse thousands of exam papers from Cambridge, Edexcel & more</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{allItems.length.toLocaleString()}</div>
                <div className="text-white/70 text-sm">Total Papers</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{subjects.length}</div>
                <div className="text-white/70 text-sm">Subjects</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{boards.length}</div>
                <div className="text-white/70 text-sm">Boards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickFilters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleQuickFilter(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all"
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
        <button
          onClick={() => { setSearch(''); setLevelFilter('all'); setBoardFilter('all'); setSubjectFilter('all'); setTypeTab('all'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* QP/MS Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl mb-4">
        {[
          { key: 'all', label: 'All Papers', icon: FileText },
          { key: 'qp', label: 'Question Papers', icon: FileText },
          { key: 'ms', label: 'Mark Schemes', icon: FileText }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTypeTab(key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all',
              typeTab === key
                ? 'bg-white text-primary-700 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search papers... (e.g., Biology 2024, WBI11)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            >
              <option value="all">All Levels</option>
              <option value="OLEVEL">O Level</option>
              <option value="ALEVEL">A Level</option>
            </select>
            <select
              value={boardFilter}
              onChange={e => setBoardFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            >
              <option value="all">All Boards</option>
              {boards.map(b => (
                <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{filtered.length}</span>
          <span className="text-gray-500">papers found</span>
          {(levelFilter !== 'all' || boardFilter !== 'all' || subjectFilter !== 'all' || search) && (
            <span className="text-sm text-gray-400">
              (filtered from {allItems.length})
            </span>
          )}
        </div>
      </div>

      {/* Subject Grouped View */}
      <div className="space-y-3">
        {subjectList.slice(0, viewMode === 'grid' ? 20 : subjectList.length).map((subject) => {
          const papers = groupedBySubject[subject];
          const isExpanded = expandedSubjects[subject];
          const qpCount = papers.filter(p => p.isQP).length;
          const msCount = papers.filter(p => p.isMS).length;
          
          return (
            <div key={subject} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleSubject(subject)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900">{subject}</h3>
                    <p className="text-sm text-gray-500">{papers.length} papers • {qpCount} QP • {msCount} MS</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="border-t border-gray-100 p-4">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {papers.slice(0, 24).map((item, idx) => (
                        <PdfCard key={idx} item={item} canViewAnswers={canViewAnswers} userPlan={userPlan} onSelect={setSelectedPdf} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {papers.map((item, idx) => (
                        <PdfListItem key={idx} item={item} canViewAnswers={canViewAnswers} userPlan={userPlan} onSelect={setSelectedPdf} />
                      ))}
                    </div>
                  )}
                  {papers.length > 24 && (
                    <button className="w-full mt-3 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                      Show all {papers.length} papers
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {filtered.length > visibleCount && (
        <button
          onClick={loadMore}
          className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-semibold hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          Load More ({filtered.length - visibleCount} more)
        </button>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold',
                  selectedPdf.isQP ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                )}>
                  {selectedPdf.isQP ? 'Question Paper' : 'Mark Scheme'}
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{selectedPdf.file}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(decodeURIComponent(selectedPdf.url))}&embedded=true`}
              className="flex-1 w-full"
              title={selectedPdf.file}
            />
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No papers found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => { setSearch(''); setLevelFilter('all'); setBoardFilter('all'); setSubjectFilter('all'); setTypeTab('all'); }}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 mt-8" style={{ backgroundColor: '#111827' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            📚 Exam Lab Maldives • Built with ❤️ by Retts Web Dev
          </p>
        </div>
      </footer>
    </div>
  );
}

// PDF Card Component
function PdfCard({ item, canViewAnswers, userPlan, onSelect }) {
  const isLocked = item.isMS && !canViewAnswers();
  
  const handleClick = () => {
    if (isLocked) {
      alert(`Upgrade to "With Answers" or higher to view mark schemes!\n\nCurrent plan: ${userPlan}`);
      return;
    }
    onSelect(item);
  };

  // Extract year from filename
  const yearMatch = item.file.match(/20\d{2}/);
  const year = yearMatch ? yearMatch[0] : '';
  const sessionMatch = item.file.match(/(m|s|o)\d{2}/i);
  const session = sessionMatch ? sessionMatch[0].toUpperCase() : '';

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden',
        item.isQP
          ? 'border-blue-200 hover:border-blue-400 hover:shadow-md'
          : isLocked 
            ? 'border-gray-200 opacity-75'
            : 'border-green-200 hover:border-green-400 hover:shadow-md'
      )}
    >
      <div className={cn(
        'p-3 text-center',
        item.isQP
          ? 'bg-gradient-to-br from-blue-50 to-blue-100/50'
          : isLocked
            ? 'bg-gray-50'
            : 'bg-gradient-to-br from-green-50 to-green-100/50'
      )}>
        {isLocked ? (
          <Lock className="w-6 h-6 text-gray-400 mx-auto" />
        ) : (
          <FileText className={cn(
            'w-6 h-6 mx-auto',
            item.isQP ? 'text-blue-500' : 'text-green-600'
          )} />
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium text-gray-900 truncate">{item.file}</p>
        <div className="flex items-center justify-between mt-1">
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded font-bold',
            item.isQP ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          )}>
            {item.isQP ? 'QP' : 'MS'}
          </span>
          {year && (
            <span className="text-[10px] text-gray-500">{year}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// PDF List Item Component
function PdfListItem({ item, canViewAnswers, userPlan, onSelect }) {
  const isLocked = item.isMS && !canViewAnswers();
  
  const handleClick = () => {
    if (isLocked) {
      alert(`Upgrade to "With Answers" or higher to view mark schemes!\n\nCurrent plan: ${userPlan}`);
      return;
    }
    onSelect(item);
  };

  const yearMatch = item.file.match(/20\d{2}/);
  const year = yearMatch ? yearMatch[0] : '';

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer',
        item.isQP
          ? 'border-blue-100 hover:border-blue-300 hover:bg-blue-50'
          : isLocked 
            ? 'border-gray-100 opacity-60'
            : 'border-green-100 hover:border-green-300 hover:bg-green-50'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
        item.isQP ? 'bg-blue-100' : isLocked ? 'bg-gray-100' : 'bg-green-100'
      )}>
        {isLocked ? (
          <Lock className="w-5 h-5 text-gray-400" />
        ) : (
          <FileText className={cn('w-5 h-5', item.isQP ? 'text-blue-600' : 'text-green-600')} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{item.file}</p>
        <p className="text-xs text-gray-500">{item.board} • {item.level.replace('OLEVEL', 'O Level').replace('ALEVEL', 'A Level')}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={cn(
          'text-xs px-2 py-1 rounded font-bold',
          item.isQP ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        )}>
          {item.isQP ? 'QP' : 'MS'}
        </span>
        {year && <span className="text-xs text-gray-400">{year}</span>}
        {isLocked ? (
          <Crown className="w-4 h-4 text-amber-500" />
        ) : (
          <ExternalLink className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}
