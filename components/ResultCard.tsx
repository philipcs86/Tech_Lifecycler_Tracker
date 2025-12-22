
import React from 'react';
import { LifecycleResponse } from '../types';

interface ResultCardProps {
  result: LifecycleResponse;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  // Simple markdown-to-html converter (limited)
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###')) {
        return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-slate-800">{line.replace('###', '').trim()}</h3>;
      }
      if (line.startsWith('##')) {
        return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-slate-900 border-b pb-2">{line.replace('##', '').trim()}</h2>;
      }
      if (line.startsWith('|')) {
        // Very basic table row styling
        return <div key={i} className="font-mono text-sm bg-slate-50 px-2 py-1 border-x border-slate-200 whitespace-pre">{line}</div>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-700 leading-relaxed mb-4">{line}</p>;
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-10 text-white">
        <div className="flex items-center gap-3 mb-2 opacity-80">
          <i className="fas fa-microchip"></i>
          <span className="text-sm font-semibold uppercase tracking-widest">Lifecycle Analysis</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{result.productName}</h2>
      </div>
      
      <div className="p-8 md:p-10">
        <div className="prose prose-slate max-w-none">
          {formatText(result.summary)}
        </div>
        
        {result.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fas fa-link"></i> Verified Sources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                >
                  <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-700 truncate mr-2">
                    {source.title}
                  </span>
                  <i className="fas fa-external-link-alt text-xs text-slate-300 group-hover:text-indigo-400"></i>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
