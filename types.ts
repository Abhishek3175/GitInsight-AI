export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export interface UserProfile {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface SavedCandidate {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  topProjectSummary: string;
  savedAt: string;
}