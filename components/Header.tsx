
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Standard Chartered inspired logo shape/color */}
            <div className="absolute inset-0 bg-[#0033a0] rounded-lg rotate-3 shadow-sm"></div>
            <div className="absolute inset-0 bg-[#009444] rounded-lg -rotate-3 opacity-80"></div>
            <i className="fas fa-chart-line text-white relative z-10 text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0033a0] leading-tight tracking-tight">Lifecycle<span className="text-[#009444]">Tracker</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Asset Intelligence</p>
          </div>
        </div>
        
        <nav className="hidden sm:flex gap-8">
          <a href="#" className="text-sm font-bold text-slate-600 hover:text-[#009444] transition-colors border-b-2 border-transparent hover:border-[#009444] py-1">Resources</a>
          <a href="#" className="text-sm font-bold text-slate-600 hover:text-[#009444] transition-colors border-b-2 border-transparent hover:border-[#009444] py-1">Compliance</a>
          <a href="mailto:philipcs@gmail.com" className="text-sm font-bold text-[#0033a0] hover:text-[#009444] transition-colors">Contact Support</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
