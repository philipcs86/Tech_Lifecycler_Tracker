
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

  const suggestions = ["Windows Server", "ESXi 7.0", "Python 3.8", "Cisco IOS-XE", "Red Hat Enterprise Linux"];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product (e.g. SQL Server 2014, VMware ESXi...)"
          disabled={isLoading}
          className="w-full h-16 pl-14 pr-28 rounded-xl border-2 border-slate-200 bg-white focus:border-[#009444] focus:ring-4 focus:ring-[#009444]/10 transition-all outline-none text-slate-800 text-lg shadow-sm group-hover:shadow-md disabled:bg-slate-50 font-medium"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0033a0] transition-colors">
          <i className="fas fa-search text-xl"></i>
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-3 top-3 bottom-3 px-8 rounded-lg bg-[#009444] text-white font-bold hover:bg-[#007a37] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Query"}
        </button>
      </form>
      
      {!isLoading && (
        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mr-2 self-center">Common Queries:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                onSearch(s);
              }}
              className="text-xs font-bold text-slate-500 bg-white hover:bg-[#0033a0] hover:text-white px-4 py-2 rounded-lg transition-all border border-slate-200 shadow-sm hover:shadow hover:border-[#0033a0]"
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
