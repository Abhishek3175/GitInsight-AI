
import React, { useState } from 'react';
import { GithubRepo } from '../types';

interface RepoCardProps {
  repo: GithubRepo;
  username: string;
}

/**
 * RepoCard now acts as a pure client to the Spring Boot backend.
 * It triggers the AI analysis by calling the /api/insight endpoint.
 */
const RepoCard: React.FC<RepoCardProps> = ({ repo, username }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      /**
       * Hits the Spring Boot InsightController:
       * GET /api/insight/{username}/{repoName}
       */
      const response = await fetch(`/api/insight/${username}/${repo.name}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository or README not found on server.");
        }
        throw new Error("Backend service is currently unreachable.");
      }
      
      const data = await response.json();
      // data: { repoName: string, summary: string }
      setSummary(data.summary);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Failed to communicate with GitInsight Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl transition-all hover:scale-[1.02] hover:border-emerald-500/30 duration-300 flex flex-col h-full border border-white/5 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold text-emerald-400 truncate">
            {repo.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {repo.language || 'Documentation'}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/20 ml-2">
          <span className="text-emerald-500 text-xs">★</span>
          <span className="text-sm font-bold text-emerald-100">{repo.stargazers_count}</span>
        </div>
      </div>

      <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10 italic leading-relaxed">
        {repo.description || "No project description provided on GitHub."}
      </p>

      <div className="mt-auto">
        <div className="p-4 bg-black/40 rounded-xl border border-emerald-500/10 shadow-inner min-h-[100px] flex flex-col justify-center transition-all">
          {summary ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70 mb-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                Backend AI Insight
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">{summary}</p>
            </div>
          ) : loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-2 bg-emerald-900/30 rounded w-full"></div>
              <div className="h-2 bg-emerald-900/30 rounded w-4/5"></div>
              <p className="text-[10px] text-emerald-500/50 text-center mt-2 animate-pulse">Calling Spring Boot Service...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-xs text-red-400/80 mb-3">{error}</p>
              <button 
                onClick={handleAnalyze}
                className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 underline uppercase tracking-widest transition-colors"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAnalyze}
              className="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 rounded-xl text-sm font-black transition-all group flex items-center justify-center gap-2 uppercase tracking-tight"
            >
              <svg className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze with AI
            </button>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
