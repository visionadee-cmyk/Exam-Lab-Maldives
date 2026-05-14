import { useState, useEffect } from 'react';
import { Search, X, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { defaultPracticeSubjectId } from '../lib/practicePrefs';

const TOPIC_SUGGESTIONS = [
  'Photosynthesis',
  'Trigonometry',
  'Organic Chemistry',
  'Genetics',
  'Kinematics',
  'Calculus',
  'Cell Biology',
  'Thermodynamics',
  'Probability',
  'Electricity',
  'Moles',
  'Evolution',
  'Forces',
  'Statistics',
  'Acids and Bases',
];

export function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      // Filter topics based on query
      const filtered = TOPIC_SUGGESTIONS.filter(topic =>
        topic.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleSearch = (searchTerm) => {
    // Save to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
    
    // Navigate to practice with topic filter
    navigate(`/practice/${defaultPracticeSubjectId()}`, { state: { topic: searchTerm, mode: 'topic' } });
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search topics (e.g., Photosynthesis, Trigonometry)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setShowResults(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2">Topics</p>
            {results.map((topic) => (
              <button
                key={topic}
                onClick={() => handleSearch(topic)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
              >
                <BookOpen className="w-4 h-4 text-primary-500" />
                <span className="text-gray-900">{topic}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!showResults && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2">Recent Searches</p>
            {recentSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => { setQuery(term); }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
