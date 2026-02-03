import React, { useState, useEffect } from 'react';
import { fetchUserProfile, fetchUserRepos } from '../services/githubService';
import { GithubRepo, UserProfile, SavedCandidate } from '../types';
import RepoCard from './RepoCard';

const GitInsight: React.FC = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>([]);
  const [showPipeline, setShowPipeline] = useState(false);

  useEffect(() => {
    fetchSavedCandidates();
  }, []);

  const fetchSavedCandidates = async () => {
    try {
      const res = await fetch('/api/insight/candidates');
      if (res.ok) {
        const data = await res.json();
        setSavedCandidates(data);
      }
    } catch (err) {
      console.error("Failed to load pipeline from DB", err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);
    try {
      const userProfile = await fetchUserProfile(username);
      const userRepos = await fetchUserRepos(username);
      setProfile(userProfile);
      setRepos(userRepos);
    } catch (err: any) {
      setError(err.message.includes('404') ? 'User not found.' : 'Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const saveToPipeline = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch('/api/insight/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.login,
          name: profile.name || profile.login,
          avatarUrl: profile.avatar_url,
          bio: profile.bio || '',
          summary: 'Candidate shortlisted via GitInsight AI.'
        })
      });
      if (res.ok) {
        await fetchSavedCandidates();
        alert("Candidate saved!");
      }
    } catch (err) {
      alert("Database error: Could not save candidate.");
    } finally {
      setSaving(false);
    }
  };

  const removeCandidate = async (id: number) => {
    try {
      const res = await fetch(`/api/insight/candidates/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSavedCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative">
      {/* Floating Saved Users Button */}
      <button 
        onClick={() => setShowPipeline(!showPipeline)}
        className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-black font-black p-4 rounded-2xl shadow-2xl flex items-center gap-2 hover:bg-emerald-500 transition-all active:scale-95 border-2 border-black/10"
      >
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
        </span>
        Saved Users ({savedCandidates.length})
      </button>

      {/* Pipeline Drawer */}
      {showPipeline && (
        <div className="fixed inset-y-0 right-0 w-80 glass-panel z-[60] border-l border-emerald-500/20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Saved Users</h3>
            <button onClick={() => setShowPipeline(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="space-y-4">
            {savedCandidates.length === 0 && <p className="text-slate-600 text-sm italic">No users saved yet.</p>}
            {savedCandidates.map(c => (
              <div key={c.id} className="bg-slate-900/50 p-4 rounded-xl border border-emerald-500/10 group relative">
                <div className="flex items-center gap-3">
                  <img src={c.avatarUrl} className="w-10 h-10 rounded-lg" alt="" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-emerald-400 truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">@{c.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeCandidate(c.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-red-500 hover:underline uppercase tracking-widest font-bold transition-opacity"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent mb-4 tracking-tighter">
          GitInsight AI
        </h1>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 max-w-xl mx-auto mb-16">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          className="flex-1 px-6 py-4 rounded-2xl bg-slate-900 border border-emerald-900/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-2xl"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs"
        >
          {loading ? 'Searching...' : 'Find User'}
        </button>
      </form>

      {error && <div className="max-w-xl mx-auto mb-8 p-4 bg-red-950/30 border border-red-500/20 rounded-2xl text-red-400 text-center">{error}</div>}

      {profile && (
        <div className="glass-panel p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center gap-10 border-l-4 border-l-emerald-500 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img src={profile.avatar_url} alt={profile.login} className="relative w-36 h-36 rounded-3xl shadow-2xl border border-white/10" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight">{profile.name || profile.login}</h2>
                <span className="text-emerald-500 font-mono text-lg font-medium">@{profile.login}</span>
              </div>
              <button 
                onClick={saveToPipeline}
                disabled={saving}
                className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-black border border-emerald-500/40 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                {saving ? 'Saving...' : 'Bookmark User'}
              </button>
            </div>
            <p className="text-slate-400 mb-6 max-w-2xl leading-relaxed font-medium">
              {profile.bio || "Candidate has not provided a professional bio."}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-5 py-2.5 bg-slate-900/80 rounded-xl border border-emerald-900/30 text-xs font-bold uppercase tracking-widest">
                <strong className="text-emerald-400 text-sm mr-1">{profile.public_repos}</strong> Public Repos
              </span>
              <span className="px-5 py-2.5 bg-slate-900/80 rounded-xl border border-emerald-900/30 text-xs font-bold uppercase tracking-widest">
                <strong className="text-emerald-400 text-sm mr-1">{profile.followers}</strong> Followers
              </span>
            </div>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map(repo => (
            <RepoCard key={repo.id} repo={repo} username={profile?.login || ''} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GitInsight;