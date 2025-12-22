
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const suggestions = ["Windows 10", "Ubuntu 22.04", "Java 8", "Cisco Catalyst 9300", "Node.js 18"];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product (e.g. Windows 10, Oracle DB 19c...)"
          disabled={isLoading}
          className="w-full h-14 pl-12 pr-24 rounded-2xl border-2 border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-slate-700 text-lg shadow-sm group-hover:shadow-md disabled:bg-slate-50"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <i className="fas fa-search text-xl"></i>
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Search"}
        </button>
      </form>
      
      {!isLoading && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-2 self-center">Try:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                onSearch(s);
              }}
              className="text-xs font-medium bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
