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
  const [needsKey, setNeedsKey] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey && (!process.env.API_KEY || process.env.API_KEY === 'undefined')) {
          setNeedsKey(true);
        }
      }
    };
    checkKey();
    
    const saved = localStorage.getItem('lifecycle_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleOpenKey = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
      setError(null);
    }
  };

  const handleSearch = async (query: string) => {
    setLastQuery(query);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await searchLifecycleInfo(query);
      setResult(data);
      
      const newHistoryItem = { query, timestamp: Date.now() };
      const updatedHistory = [newHistoryItem, ...history.filter(h => h.query.toLowerCase() !== query.toLowerCase())].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('lifecycle_history', JSON.stringify(updatedHistory));
    } catch (err: any) {
      if (err.message === "QUOTA_EXHAUSTED") {
        setError("Search Quota Exceeded. The free tier limit for Google Search grounding has been reached.");
        setNeedsKey(true);
      } else if (err.message === "API_KEY_MISSING") {
        setError("Configuration Required: No API key found.");
        setNeedsKey(true);
      } else if (err.message === "MODEL_NOT_AVAILABLE") {
        setError("The selected model is currently unavailable for this search tool.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('lifecycle_history');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-[#f8fafc]">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block bg-[#009444]/10 text-[#009444] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
            Version History & Compliance
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#0033a0] tracking-tight leading-[1.1]">
            Technology Asset Lifecycle <span className="text-[#009444]">Intelligence</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Instantly audit historical end-of-support dates, release milestones, and migration paths for global technology products.
          </p>
        </div>

        {needsKey && (
          <div className="max-w-xl mx-auto mb-12 bg-amber-50 border border-amber-200 p-8 rounded-3xl shadow-xl animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-amber-100 text-amber-700 p-3 rounded-xl">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-amber-900">Personal API Key Recommended</h3>
            </div>
            <p className="text-amber-800 mb-6 text-sm font-medium leading-relaxed">
              The public shared key has reached its rate limit for Google Search grounding. To continue searching with higher reliability, please select your own API key from a paid Google Cloud project.
            </p>
            <button 
              onClick={handleOpenKey}
              className="w-full bg-[#0033a0] hover:bg-[#002880] text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Configure My Own Key
              <i className="fas fa-key text-xs"></i>
            </button>
            <p className="text-[10px] text-amber-600 mt-4 text-center font-bold uppercase tracking-widest">
              See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-amber-800">Billing Documentation</a> for more info.
            </p>
          </div>
        )}

        <div className="mb-16">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-[6px] border-[#0033a0]/10 border-t-[#009444] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-search text-[#0033a0] animate-pulse"></i>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[#0033a0] font-black text-lg uppercase tracking-widest">Compiling Data</p>
                <p className="text-slate-400 text-sm mt-1">Cross-referencing vendor documentation...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-white border-2 border-red-100 p-8 rounded-2xl shadow-xl flex items-start gap-6 animate-in slide-in-from-top-4">
              <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg">
                <i className="fas fa-exclamation-circle text-2xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-red-900 font-black text-xl mb-1">Retrieval Error</h3>
                <p className="text-red-600 font-medium">{error}</p>
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => handleSearch(lastQuery)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Retry
                  </button>
                  <button 
                    onClick={() => setError(null)}
                    className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline px-4 py-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && !isLoading && <ResultCard result={result} />}

          {!result && !isLoading && !error && (
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col group hover:border-[#009444] transition-all duration-300">
                <div className="h-14 w-14 bg-[#009444]/10 text-[#009444] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <i className="fas fa-shield-virus text-2xl"></i>
                </div>
                <h3 className="text-2xl font-black text-[#0033a0] mb-4 tracking-tight">Version Compliance</h3>
                <p className="text-slate-500 text-base leading-relaxed mb-6 font-medium">
                  Visibility into End-of-Life (EOL) milestones is the first line of defense against infrastructure security breaches.
                </p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#009444] uppercase tracking-widest bg-[#009444]/10 px-3 py-1.5 rounded-lg">
                    <i className="fas fa-check"></i> Security
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#0033a0] uppercase tracking-widest bg-[#0033a0]/10 px-3 py-1.5 rounded-lg">
                    <i className="fas fa-sync"></i> Lifecycle
                  </span>
                </div>
              </div>

              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-14 w-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-clock-rotate-left text-2xl"></i>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                    >
                      Reset History
                    </button>
                  )}
                </div>
                <h3 className="text-2xl font-black text-[#0033a0] mb-6 tracking-tight">Audit Trail</h3>
                {history.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(h.query)}
                        className="text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:border-[#0033a0] hover:text-[#0033a0] px-4 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        {h.query}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-auto py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No Recent Audits</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#0033a0] text-blue-100 py-20 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#009444]"></div>
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-16 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-[#009444] p-2 rounded-lg shadow-lg">
                <i className="fas fa-chart-line text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-black text-white leading-tight tracking-tight uppercase">LifecycleTracker</h1>
            </div>
            <p className="text-sm leading-relaxed text-blue-200 font-medium">
              Standardizing asset lifecycle intelligence for global IT operations. Driven by real-time audit protocols.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-8 text-xs underline decoration-[#009444] decoration-2 underline-offset-8">Information Hub</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-book-open text-[#009444] text-[10px]"></i> EOL Definitions</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-shield-halved text-[#009444] text-[10px]"></i> Security Advisories</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-network-wired text-[#009444] text-[10px]"></i> Vendor Directory</a></li>
            </ul>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h4 className="text-white font-black uppercase tracking-widest mb-6 text-xs">Direct Support</h4>
            <div className="flex flex-col gap-4">
              <a 
                href="mailto:philipcs@gmail.com" 
                className="flex items-center gap-3 bg-white text-[#0033a0] px-6 py-3 rounded-xl font-black text-sm hover:bg-[#009444] hover:text-white transition-all shadow-lg"
              >
                <i className="fas fa-envelope"></i>
                philipcs@gmail.com
              </a>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest text-center mt-2">
                Available 24/7 for Enterprise Support
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pt-16 mt-16 border-t border-white/10 text-center flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
            &copy; {new Date().getFullYear()} Tech Lifecycle Tracker. Enterprise Edition.
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-blue-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;