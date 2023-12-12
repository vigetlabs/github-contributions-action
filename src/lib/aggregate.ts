import { SearchResults, Stats } from './types';

export function aggregateResults(
  projectStats: Record<string, Stats>,
  userStats: Record<string, Stats>,
  user: string,
  openedPrs: SearchResults,
  mergedPrs: SearchResults,
  reviews: SearchResults,
): {
  userStats: Record<string, Stats>;
  projectStats: Record<string, Stats>;
} {
  for (const [type, results] of [
    ['opened', openedPrs] as const,
    ['merged', mergedPrs] as const,
    ['reviews', reviews] as const,
  ]) {
    for (const item of results.items) {
      const project = repositoryKey(item.repository_url);

      ensureProject(projectStats, project);

      projectStats[project][type]++;
      userStats[user][type]++;
    }
  }

  return {
    userStats,
    projectStats,
  };
}

function ensureProject(
  projectStats: Record<string, Stats>,
  project: string,
): void {
  projectStats[project] = projectStats[project] || {
    opened: 0,
    merged: 0,
    reviews: 0,
  };
}

function repositoryKey(url: string): string {
  return url.replace('https://api.github.com/repos/', '');
}
