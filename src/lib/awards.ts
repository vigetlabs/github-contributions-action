import { Stats } from './types';

/**
 * User activity is measured by the number of opened PRs and reviews.
 */
export function getMostActiveUser(
  userStats: Record<string, Stats>,
): readonly [string, number] {
  let mostActiveUser = 'none';
  let mostActiveUserCount = 0;

  for (const [user, stats] of Object.entries(userStats)) {
    if (stats.reviews + stats.opened > mostActiveUserCount) {
      mostActiveUser = user;
      mostActiveUserCount = stats.reviews + stats.opened;
    }
  }

  return [mostActiveUser, mostActiveUserCount] as const;
}

/**
 * User activity is measured by the number of reviews.
 */
export function getMostActiveProject(
  projectStats: Record<string, Stats>,
): readonly [string, number] {
  let mostActiveProject = 'none';
  let mostActiveProjectCount = 0;

  for (const [project, stats] of Object.entries(projectStats)) {
    if (stats.reviews > mostActiveProjectCount) {
      mostActiveProject = project;
      mostActiveProjectCount = stats.reviews;
    }
  }

  return [mostActiveProject, mostActiveProjectCount] as const;
}
