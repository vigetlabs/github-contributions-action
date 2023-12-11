import { format } from 'date-fns';
import { aggregateResults } from './aggregate';
import { queryAllMetrics } from './api';
import { getMostActiveProject, getMostActiveUser } from './awards';
import { Stats } from './types';
import type { Inputs } from 'src/input';
import type { Logger } from 'src/logger';

export type Activity = {
  start: string;
  end: string;
  totalOpenedPrs: number;
  totalMergedPrs: number;
  totalReviews: number;
  mostActiveProject: string;
  mostActiveProjectCount: number;
  mostActiveUser: string;
  mostActiveUserCount: number;
};

export async function collectActivity(
  inputs: Inputs,
  logger: Logger,
): Promise<Activity> {
  const { githubToken, startDate, endDate, users } = inputs;
  const dateRange = [startDate, endDate] as const;

  const projectStats: Record<string, Stats> = {};
  const userStats: Record<string, Stats> = Object.fromEntries(
    users.map(username => [
      username,
      {
        opened: 0,
        merged: 0,
        reviews: 0,
      },
    ]),
  );

  let totalOpenedPrs = 0;
  let totalMergedPrs = 0;
  let totalReviews = 0;

  for (const user of users) {
    const { openedPrs, mergedPrs, reviews } = await queryAllMetrics(
      githubToken,
      user,
      dateRange,
      logger,
    );

    aggregateResults(
      projectStats,
      userStats,
      user,
      openedPrs,
      mergedPrs,
      reviews,
    );

    totalOpenedPrs += openedPrs.total_count;
    totalMergedPrs += mergedPrs.total_count;
    totalReviews += reviews.total_count;
  }

  const [mostActiveUser, mostActiveUserCount] = getMostActiveUser(userStats);
  const [mostActiveProject, mostActiveProjectCount] =
    getMostActiveProject(projectStats);

  const start = format(startDate, 'MMM d, yyyy');
  const end = format(endDate, 'MMM d, yyyy');

  logger.debug(`Code Review Activity for ${start} through ${end}`);

  logger.debug('Summary by user:');

  /* istanbul ignore next */
  if (logger.isDebug()) {
    console.table(userStats);
  }

  logger.debug('Summary by project:');

  /* istanbul ignore next */
  if (logger.isDebug()) {
    console.table(projectStats);
  }

  logger.debug(`👀 Total PRs opened: ${totalOpenedPrs}`);
  logger.debug(`🚀 Total PRs merged: ${totalMergedPrs}`);
  logger.debug(`✅ Code Reviews given: ${totalReviews}`);

  logger.debug(
    `👑 Most Active Project: ${mostActiveProject} with ${mostActiveProjectCount} contributions`,
  );

  logger.debug(
    `🥇 Most Active User: ${mostActiveUser} with ${mostActiveUserCount} contributions`,
  );

  return {
    start,
    end,
    totalOpenedPrs,
    totalMergedPrs,
    totalReviews,
    mostActiveProject,
    mostActiveProjectCount,
    mostActiveUser,
    mostActiveUserCount,
  };
}
