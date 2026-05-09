import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Search, ExternalLink, Download, Eye, Calendar, BookOpen, Filter } from 'lucide-react';
import { cn } from '../utils/cn';

export function PdfLibrary() {
  const navigate = useNavigate();
  const [manifest, setManifest] = useState(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [boardFilter, setBoardFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeTab, setTypeTab] = useState('all'); // 'all', 'qp', 'ms'
  const [selectedPdf, setSelectedPdf] = useState(null);

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

  if (!manifest) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading PDF library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/subjects')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Subjects
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">PDF Past Papers Library</h1>
        <p className="text-gray-600">Browse and download past papers by level, board, and subject.</p>
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
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by subject, code, or filename..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Levels</option>
            <option value="OLEVEL">O Level / IGCSE</option>
            <option value="ALEVEL">A Level / IAL</option>
          </select>
          <select
            value={boardFilter}
            onChange={e => setBoardFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Boards</option>
            {boards.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>{filtered.length} of {allItems.length} PDFs</span>
        {search && <span>for "{search}"</span>}
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPdf(item)}
            className={cn(
              'group block rounded-xl border transition-all overflow-hidden cursor-pointer',
              item.isQP
                ? 'bg-white border-blue-200 hover:shadow-lg hover:border-blue-400'
                : 'bg-white border-green-200 hover:shadow-lg hover:border-green-400'
            )}
          >
            <div className={cn(
              'aspect-[4/3] flex items-center justify-center',
              item.isQP
                ? 'bg-gradient-to-br from-blue-50 to-blue-100'
                : 'bg-gradient-to-br from-green-50 to-green-100'
            )}>
              <FileText className={cn(
                'w-12 h-12 group-hover:scale-110 transition-transform',
                item.isQP ? 'text-blue-500' : 'text-green-600'
              )} />
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.subject}</p>
                  <p className="text-xs text-gray-500 truncate">{item.file}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {item.isQP && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">QP</span>
                  )}
                  {item.isMS && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">MS</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.board}</span>
                <span>{item.level.replace('OLEVEL', 'O Level').replace('ALEVEL', 'A Level')}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="w-3 h-3" />
                  View
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

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
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf.url)}&embedded=true`}
              className="flex-1 w-full"
              title={selectedPdf.file}
            />
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
