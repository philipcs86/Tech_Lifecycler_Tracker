
import React from 'react';
import { LifecycleResponse } from '../types';

interface ResultCardProps {
  result: LifecycleResponse;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  // Enhanced markdown-to-html converter to handle tables more gracefully
  const formatText = (text: string) => {
    const lines = text.split('\n');
    let inTable = false;
    let tableRows: string[][] = [];

    return lines.map((line, i) => {
      const trimmedLine = line.trim();

      // Table detection
      if (trimmedLine.startsWith('|')) {
        inTable = true;
        const cells = trimmedLine.split('|').filter(c => c.trim().length > 0 || trimmedLine.includes('||'));
        // Skip separator rows like |---|---|
        if (cells.some(c => c.includes('---'))) return null;
        
        return (
          <div key={i} className="overflow-x-auto my-4 border border-slate-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <tbody className="bg-white divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  {cells.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3 text-sm text-slate-700 font-medium border-r border-slate-100 last:border-0">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      } else {
        inTable = false;
      }

      if (trimmedLine.startsWith('###')) {
        return <h3 key={i} className="text-lg font-bold mt-8 mb-3 text-[#0033a0] border-l-4 border-[#009444] pl-3 uppercase tracking-tight">{trimmedLine.replace('###', '').trim()}</h3>;
      }
      if (trimmedLine.startsWith('##')) {
        return <h2 key={i} className="text-2xl font-bold mt-10 mb-5 text-[#0033a0] border-b-2 border-slate-100 pb-2 flex items-center gap-2">
          <i className="fas fa-layer-group text-[#009444] text-xl"></i>
          {trimmedLine.replace('##', '').trim()}
        </h2>;
      }
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        return <li key={i} className="text-slate-700 mb-2 ml-4 list-disc marker:text-[#009444]">{trimmedLine.substring(2)}</li>;
      }
      if (trimmedLine === '') return <div key={i} className="h-4" />;
      
      return <p key={i} className="text-slate-700 leading-relaxed mb-4 text-base">{trimmedLine}</p>;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#0033a0]/5 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-[#0033a0] px-8 py-12 text-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#009444] opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#009444] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Verified Lifecycle Data
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{result.productName}</h2>
          <p className="mt-4 text-blue-100 font-medium max-w-2xl text-lg">Comprehensive historical milestones and support timeline.</p>
        </div>
      </div>
      
      <div className="p-8 md:p-12">
        <div className="prose prose-slate max-w-none">
          {formatText(result.summary)}
        </div>
        
        {result.sources.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#009444]"></span>
                Audit Sources
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#0033a0] hover:bg-[#0033a0]/5 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0033a0] group-hover:text-white transition-colors">
                      <i className="fas fa-file-alt text-xs"></i>
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-[#0033a0] truncate">
                      {source.title}
                    </span>
                  </div>
                  <i className="fas fa-chevron-right text-xs text-slate-300 group-hover:text-[#0033a0] translate-x-0 group-hover:translate-x-1 transition-transform"></i>
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
