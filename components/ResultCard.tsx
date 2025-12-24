import React, { useState } from 'react';
import { LifecycleResponse } from '../types';

interface ResultCardProps {
  result: LifecycleResponse;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    // Fix: Use React.ReactNode instead of JSX.Element to avoid "Cannot find namespace 'JSX'" errors
    const elements: React.ReactNode[] = [];
    let currentTableRows: string[][] = [];

    const flushTable = (index: number) => {
      if (currentTableRows.length > 0) {
        elements.push(
          <div key={`table-${index}`} className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-sm bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {currentTableRows[0].map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-200 last:border-0">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTableRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-sm text-slate-600 border-r border-slate-100 last:border-0 font-medium">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTableRows = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('|')) {
        const cells = trimmedLine.split('|').filter((c, idx) => {
          if (idx === 0 || idx === trimmedLine.split('|').length - 1) return trimmedLine.startsWith('|') && c.trim() !== '';
          return true;
        }).map(c => c.trim());
        
        if (cells.some(c => c.includes('---'))) return;
        if (cells.length > 0) {
          currentTableRows.push(cells);
        }
      } else {
        flushTable(i);
        
        if (trimmedLine.startsWith('# ')) {
          elements.push(<h1 key={i} className="text-3xl font-black text-[#0033a0] mb-6 mt-2">{trimmedLine.replace('# ', '')}</h1>);
        } else if (trimmedLine.startsWith('## ')) {
          elements.push(<h2 key={i} className="text-xl font-bold mt-10 mb-4 text-[#0033a0] flex items-center gap-2 border-b border-slate-100 pb-2">
            <i className="fas fa-calendar-check text-[#009444]"></i>
            {trimmedLine.replace('## ', '')}
          </h2>);
        } else if (trimmedLine.startsWith('### ')) {
          elements.push(<h3 key={i} className="text-md font-black mt-8 mb-3 text-slate-800 uppercase tracking-tight">{trimmedLine.replace('### ', '')}</h3>);
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          elements.push(<li key={i} className="text-slate-600 mb-2 ml-4 list-disc marker:text-[#009444] font-medium">{trimmedLine.substring(2)}</li>);
        } else if (trimmedLine === '') {
          elements.push(<div key={i} className="h-2" />);
        } else {
          elements.push(<p key={i} className="text-slate-600 leading-relaxed mb-4 font-medium">{trimmedLine}</p>);
        }
      }
    });

    flushTable(lines.length);
    return elements;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0033a0] px-8 py-10 text-white relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#009444] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Lifecycle Verified
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">{result.productName}</h2>
          </div>
          
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-sm border border-white/10"
          >
            <i className={`fas ${copied ? 'fa-check text-[#009444]' : 'fa-copy'}`}></i>
            {copied ? 'Copied' : 'Copy Report'}
          </button>
        </div>
      </div>
      
      <div className="p-8 md:p-12">
        <div className="max-w-none">
          {formatText(result.summary)}
        </div>
        
        {result.sources.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#009444]"></span>
              Data Provenance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-[#0033a0] hover:shadow-md transition-all group"
                >
                  <span className="text-xs font-bold text-slate-500 group-hover:text-[#0033a0] truncate px-2">
                    {source.title}
                  </span>
                  <i className="fas fa-external-link-alt text-[10px] text-slate-300 group-hover:text-[#0033a0]"></i>
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
