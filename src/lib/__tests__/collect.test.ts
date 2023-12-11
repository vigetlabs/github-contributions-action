import { subDays } from 'date-fns';
import { collectActivity } from '../collect';
import * as testLogger from '../../test/logger';
import * as api from '../api';

const queryAllMetricsMock = jest.spyOn(api, 'queryAllMetrics');

describe('collect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('with metrics', () => {
    it('aggregates metrics across users and returns a summary', async () => {
      const startDate = new Date();
      const endDate = subDays(startDate, 3);

      queryAllMetricsMock.mockImplementation(
        async (_token, user, _dateRange, _logger) => ({
          openedPrs: {
            total_count: 2,
            items: [
              {
                title: 'PR 1',
                repository_url: 'https://api.github.com/repos/owner1/repo1',
                user: {
                  login: user,
                },
              },
              {
                title: 'PR 2',
                repository_url: 'https://api.github.com/repos/owner2/repo2',
                user: {
                  login: user,
                },
              },
            ],
          },
          mergedPrs: {
            total_count: 2,
            items: [
              {
                title: 'PR 1',
                repository_url: 'https://api.github.com/repos/owner1/repo1',
                user: {
                  login: user,
                },
              },
              {
                title: 'PR 2',
                repository_url: 'https://api.github.com/repos/owner2/repo2',
                user: {
                  login: user,
                },
              },
            ],
          },
          reviews: {
            total_count: 2,
            items: [
              {
                title: 'PR 1',
                repository_url: 'https://api.github.com/repos/owner1/repo1',
                user: {
                  login: user,
                },
              },
              {
                title: 'PR 2',
                repository_url: 'https://api.github.com/repos/owner2/repo2',
                user: {
                  login: user,
                },
              },
            ],
          },
        }),
      );

      const activity = await collectActivity(
        {
          githubToken: 'abc',
          startDate,
          endDate,
          users: ['barryjbluejeans', 'solomonhawk'],
        },
        testLogger,
      );

      expect(activity).toEqual({
        end: 'Mar 29, 2020',
        mostActiveProject: 'owner1/repo1',
        mostActiveProjectCount: 2,
        mostActiveUser: 'barryjbluejeans',
        mostActiveUserCount: 4,
        start: 'Apr 1, 2020',
        totalMergedPrs: 4,
        totalOpenedPrs: 4,
        totalReviews: 4,
      });
    });
  });

  describe('with empty metrics', () => {
    it('returns empty results', async () => {
      const startDate = new Date();
      const endDate = subDays(startDate, 3);

      queryAllMetricsMock.mockImplementation(async () => ({
        openedPrs: {
          total_count: 0,
          items: [],
        },
        mergedPrs: {
          total_count: 0,
          items: [],
        },
        reviews: {
          total_count: 0,
          items: [],
        },
      }));

      const activity = await collectActivity(
        {
          githubToken: 'abc',
          startDate,
          endDate,
          users: ['barryjbluejeans', 'solomonhawk'],
        },
        testLogger,
      );

      expect(activity).toEqual({
        end: 'Mar 29, 2020',
        mostActiveProject: 'none',
        mostActiveProjectCount: 0,
        mostActiveUser: 'none',
        mostActiveUserCount: 0,
        start: 'Apr 1, 2020',
        totalMergedPrs: 0,
        totalOpenedPrs: 0,
        totalReviews: 0,
      });
    });
  });
});
