
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import { searchLifecycleInfo } from './services/gemini';
import { LifecycleResponse, SearchHistoryItem } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LifecycleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lifecycle_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await searchLifecycleInfo(query);
      setResult(data);
      
      // Update history
      const newHistoryItem = { query, timestamp: Date.now() };
      const updatedHistory = [newHistoryItem, ...history.filter(h => h.query.toLowerCase() !== query.toLowerCase())].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('lifecycle_history', JSON.stringify(updatedHistory));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('lifecycle_history');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Stop Guessing <span className="text-indigo-600">Upgrade Dates</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Get instant, accurate End of Support (EOS) and End of Life (EOL) dates for software, hardware, and operating systems.
          </p>
        </div>

        {/* Search Input Area */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading / Error / Results Area */}
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Researching product lifecycle details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl flex items-start gap-4">
              <div className="bg-red-500 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-xs"></i>
              </div>
              <div>
                <h3 className="text-red-800 font-bold">Search Failed</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && !isLoading && <ResultCard result={result} />}

          {!result && !isLoading && !error && (
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Info Box */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fas fa-info-circle text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Why Tracking EOL Matters?</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Running software or hardware past its end-of-support date exposes your organization to critical security vulnerabilities, compliance risks, and higher maintenance costs.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    <i className="fas fa-shield-alt"></i> Security
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    <i className="fas fa-check-circle"></i> Compliance
                  </div>
                </div>
              </div>

              {/* History Box */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-history text-xl"></i>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Searches</h3>
                {history.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(h.query)}
                        className="text-sm bg-slate-50 border border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all"
                      >
                        {h.query}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic mt-auto pb-4">No recent searches yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <i className="fas fa-calendar-check text-white text-sm"></i>
              </div>
              <h1 className="text-lg font-bold text-white leading-tight">LifecycleTracker</h1>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering IT professionals with reliable, real-time data to manage hardware and software lifecycles effectively.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Bulk Search Pro</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">IT Asset Management Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Data Source</h4>
            <p className="text-sm leading-relaxed mb-4">
              Search results are grounded in real-time web searches and official vendor documentation via the Gemini 3 Flash model.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <i className="fas fa-robot text-indigo-500"></i> Powered by Gemini AI
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pt-12 mt-12 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} Tech Lifecycle Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
