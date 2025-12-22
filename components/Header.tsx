
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <i className="fas fa-calendar-check text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">LifecycleTracker</h1>
            <p className="text-xs text-slate-500 font-medium">Tech End of Support Search</p>
          </div>
        </div>
        
        <nav className="hidden sm:flex gap-6">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About EOL</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
