
import { GithubRepo, UserProfile } from '../types';

/**
 * Proper Full-Stack Implementation:
 * These calls now target the local Spring Boot server proxy.
 * This hides the GitHub API structure and tokens from the client.
 */

export const fetchUserProfile = async (username: string): Promise<UserProfile> => {
  const response = await fetch(`/api/insight/profile/${username}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('User not found on GitHub');
    throw new Error('Backend service unreachable');
  }
  return response.json();
};

export const fetchUserRepos = async (username: string): Promise<GithubRepo[]> => {
  const response = await fetch(`/api/insight/repos/${username}`);
  if (!response.ok) {
    throw new Error('Failed to fetch repositories from backend');
  }
  return response.json();
};

// This is kept as a helper but in a proper backend-driven app,
// the README fetching is typically handled entirely by the backend 
// during the insight generation process.
export const fetchRepoReadme = async (fullName: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    if (!response.ok) return null;
    return response.text();
  } catch (err) {
    return null;
  }
};
