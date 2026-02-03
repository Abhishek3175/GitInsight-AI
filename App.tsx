
import React from 'react';
import GitInsight from './components/GitInsight';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl text-black">G</div>
            <span className="text-xl font-black tracking-tight text-white">GitInsight <span className="text-emerald-500">AI</span></span>
          </div>
          
          {/* Right side of nav is now empty as requested */}
          <div className="hidden md:flex items-center space-x-4">
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="animate-in fade-in duration-500 pb-12">
        <GitInsight />
      </main>
    </div>
  );
};

export default App;
