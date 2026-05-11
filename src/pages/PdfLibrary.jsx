import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Search, ExternalLink, Download, Eye, Calendar, BookOpen, Filter, Lock, Crown, Grid, List, X } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('grid');
  const [yearFilter, setYearFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedItem, setLockedItem] = useState(null);

  useEffect(() => {
    fetch('/pdf-manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(() => setManifest({ OLEVEL: {}, ALEVEL: {} }));
  }, []);

  const boardToFolder = {
    'Cambridge_O-Level': 'O-Level',
    'Cambridge_IGCSE': 'IGCSE',
    'Edexcel_IAL': 'A-Level'
  };

  const allItems = useMemo(() => {
    if (!manifest) return [];
    const items = [];
    ['OLEVEL', 'ALEVEL'].forEach(level => {
      Object.entries(manifest[level]).forEach(([board, subjects]) => {
        Object.entries(subjects).forEach(([subject, files]) => {
          files.forEach(file => {
            const isQP = /qp|question/i.test(file);
            const isMS = /ms|mark|answer/i.test(file);
            const folderPath = boardToFolder[board] || board;
            const boardPath = board.replace(/&/g, '%26');
            const subjectPath = subject.replace(/&/g, '%26');
            const baseUrl = `https://media.githubusercontent.com/media/visionadee-cmyk/Exam-Lab-Maldives/main/public/pdf-pastpaer-q%26a/${encodeURIComponent(folderPath)}/${encodeURIComponent(subjectPath)}`;
            // Extract base code to match QP with MS (e.g., "0400_s20" from "0400_s20_qp_02.pdf" or "2021-unit1-2021-06-WPH11-01" from "2021-unit1-2021-06-WPH11-01-qp.pdf")
            const baseMatch = file.match(/^(.+?)[-_](?:qp|ms|question|mark)[_-]/i) || file.match(/^(\d+_[msw]\d{2})_/);
            items.push({
              level,
              board,
              subject,
              file,
              isQP,
              isMS,
              url: `${baseUrl}/${encodeURIComponent(file)}`,
              baseCode: baseMatch ? baseMatch[1] : null
            });
          });
        });
      });
    });
    return items;
  }, [manifest]);

  // Find MS for a QP
  const findMS = (item) => {
    if (!item.isQP || !item.baseCode) return null;
    const msItem = allItems.find(i => i.isMS && i.baseCode === item.baseCode);
    return msItem;
  };

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
      const matchesYear = yearFilter === 'all' || item.file.includes(yearFilter);
      const matchesSession = sessionFilter === 'all' || item.file.toLowerCase().includes(sessionFilter.toLowerCase());
      return matchesSearch && matchesLevel && matchesBoard && matchesSubject && matchesType && matchesYear && matchesSession;
    });
  }, [allItems, search, levelFilter, boardFilter, subjectFilter, typeTab, yearFilter, sessionFilter]);

  const boards = useMemo(() => [...new Set(allItems.map(i => i.board))], [allItems]);
  const subjects = useMemo(() => [...new Set(allItems.map(i => i.subject))], [allItems]);

  if (!manifest) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading PDF library...</p>
      </div>
    );
  }

  const handleLockedClick = (item) => {
    setLockedItem(item);
    setShowLockedModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-primary-600 rounded-xl p-4 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Past Papers Library</h1>
            <p className="text-white/80 text-sm">Browse exam papers</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-1.5 text-center">
              <div className="text-lg font-bold">{allItems.length.toLocaleString()}</div>
              <div className="text-xs text-white/70">Papers</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-center">
              <div className="text-xl font-bold">{subjects.length}</div>
              <div className="text-xs text-white/70">Subjects</div>
            </div>
          </div>
        </div>
      </div>

      {/* QP/MS Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All', icon: FileText },
          { key: 'qp', label: 'Question Papers', icon: FileText },
          { key: 'ms', label: 'Mark Schemes', icon: FileText }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTypeTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors',
              typeTab === key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search papers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Levels</option>
            <option value="OLEVEL">O Level</option>
            <option value="ALEVEL">A Level</option>
          </select>
          <select
            value={boardFilter}
            onChange={e => setBoardFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Boards</option>
            {boards.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
          <select
            value={sessionFilter}
            onChange={e => setSessionFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Sessions</option>
            <option value="m">March (m)</option>
            <option value="s">June (s)</option>
            <option value="o">November (o)</option>
            <option value="w">Winter (w)</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-md transition-all', viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500')}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-md transition-all', viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>{filtered.length} of {allItems.length} PDFs</span>
        {search && <span>for "{search}"</span>}
      </div>

      {/* Cards Grid / List */}
      {viewMode === 'grid' ? (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.slice(0, 100).map((item, idx) => {
          const isLocked = item.isMS && !canViewAnswers();
          const handleClick = () => {
            if (isLocked) {
              handleLockedClick(item);
              return;
            }
            setSelectedPdf(item);
          };
          
          return (
          <div
            key={idx}
            onClick={handleClick}
            className={cn(
              'group block rounded-xl border-2 transition-all overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-md',
              item.isQP
                ? 'bg-white border-blue-200 hover:border-blue-400'
                : isLocked 
                  ? 'bg-gray-50 border-gray-200 opacity-75'
                  : 'bg-white border-green-200 hover:border-green-400'
            )}
          >
            <div className={cn(
              'aspect-[4/3] flex items-center justify-center relative',
              item.isQP
                ? 'bg-gradient-to-br from-blue-50 to-blue-100'
                : isLocked
                  ? 'bg-gradient-to-br from-gray-100 to-gray-200'
                  : 'bg-gradient-to-br from-green-50 to-green-100'
            )}>
              {isLocked ? (
                <Lock className="w-12 h-12 text-gray-400" />
              ) : (
                <FileText className={cn(
                  'w-12 h-12 group-hover:scale-110 transition-transform',
                  item.isQP ? 'text-blue-500' : 'text-green-600'
                )} />
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{item.subject}</p>
                  <p className="text-xs text-gray-500 truncate">{item.file}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {item.isQP && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">QP</span>
                  )}
                  {item.isMS && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded font-bold">MS</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.board}</span>
                <span>{item.level.replace('OLEVEL', 'O Level').replace('ALEVEL', 'A Level')}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  {isLocked ? <Lock className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {isLocked ? 'Locked' : 'View'}
                </span>
                {isLocked ? (
                  <Crown className="w-4 h-4 text-amber-500" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                )}
              </div>
              {/* Answer Sheet Link for QP */}
              {item.isQP && (
                findMS(item) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPdf(findMS(item));
                    }}
                    className="w-full mt-2 py-1.5 px-3 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    View Answer Sheet
                  </button>
                ) : (
                  <div className="w-full mt-2 py-1.5 px-3 text-xs bg-red-50 text-red-500 rounded-lg flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3" />
                    No Answer Sheet
                  </div>
                )
              )}
            </div>
          </div>
          );
        })}
      </div>
      ) : (
        <div className="space-y-2">
          {filtered.slice(0, 100).map((item, idx) => {
            const isLocked = item.isMS && !canViewAnswers();
            const handleClick = () => {
              if (isLocked) {
                handleLockedClick(item);
                return;
              }
              setSelectedPdf(item);
            };
            return (
              <div
                key={idx}
                onClick={handleClick}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md',
                  item.isQP ? 'border-blue-100 hover:border-blue-300 bg-blue-50/50' : isLocked ? 'border-gray-100' : 'border-green-100 hover:border-green-300 bg-green-50/50'
                )}
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', item.isQP ? 'bg-blue-100' : 'bg-green-100')}>
                  {isLocked ? <Lock className="w-5 h-5 text-gray-400" /> : <FileText className={cn('w-5 h-5', item.isQP ? 'text-blue-600' : 'text-green-600')} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.file}</p>
                  <p className="text-xs text-gray-500">{item.subject} • {item.board}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.isQP && (
                    findMS(item) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPdf(findMS(item));
                        }}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded"
                        title="View Answer Sheet"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="p-1.5 text-red-400" title="No Answer Sheet">
                        <FileText className="w-4 h-4" />
                      </span>
                    )
                  )}
                  <span className={cn('text-xs px-2 py-1 rounded font-bold', item.isQP ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}>{item.isQP ? 'QP' : 'MS'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Show more hint */}
      {filtered.length > 100 && (
        <p className="text-center text-gray-500 text-sm py-4">Showing first 100 of {filtered.length} papers. Use filters to narrow down.</p>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900 truncate flex-1 mr-4">{selectedPdf.file}</h3>
              <button
                onClick={() => setSelectedPdf(null)}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(decodeURIComponent(selectedPdf.url))}&embedded=true`}
              className="flex-1 w-full"
              title={selectedPdf.file}
            />
          </div>
        </div>
      )}

      {/* Locked Content Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mark Scheme Locked</h3>
            <p className="text-gray-600 mb-2">
              This mark scheme requires <span className="font-semibold text-primary-600">"With Answers"</span> or higher plan.
            </p>
            <p className="text-sm text-gray-500 mb-6">Current plan: <span className="font-medium">{userPlan || 'Free'}</span></p>
            
            <div className="space-y-2">
              <button
                onClick={() => { setShowLockedModal(false); navigate('/subscribe'); }}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:opacity-90"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setShowLockedModal(false)}
                className="w-full py-2 px-4 text-gray-500 hover:text-gray-700"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No PDFs found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
