import { aggregateResults } from '../aggregate';
import type { Stats } from '../types';

describe('aggregate', () => {
  describe('aggregateResults', () => {
    it('collects activity from contributors', async () => {
      const projectStats: Record<string, Stats> = {};
      const userStats: Record<string, Stats> = {
        john: {
          opened: 0,
          merged: 0,
          reviews: 0,
        },
        mary: {
          opened: 0,
          merged: 0,
          reviews: 0,
        },
      };

      aggregateResults(
        projectStats,
        userStats,
        'john',
        // opened PRs
        {
          total_count: 1,
          items: [
            {
              repository_url: 'https://api.github.com/repos/owner/repo',
              title: 'PR 1',
              user: {
                login: 'john',
              },
            },
            {
              repository_url: 'https://api.github.com/repos/owner/repo',
              title: 'PR 2',
              user: {
                login: 'john',
              },
            },
          ],
        },
        // merged PRs
        {
          total_count: 1,
          items: [
            {
              repository_url: 'https://api.github.com/repos/owner/repo',
              title: 'PR 1',
              user: {
                login: 'john',
              },
            },
          ],
        },
        // reviews
        {
          total_count: 1,
          items: [
            {
              repository_url: 'https://api.github.com/repos/owner/repo',
              title: 'PR 1',
              user: {
                login: 'john',
              },
            },
          ],
        },
      );

      expect(userStats).toEqual({
        john: {
          opened: 2,
          merged: 1,
          reviews: 1,
        },
        mary: {
          opened: 0,
          merged: 0,
          reviews: 0,
        },
      });

      expect(projectStats).toEqual({
        'owner/repo': {
          opened: 2,
          merged: 1,
          reviews: 1,
        },
      });
    });
  });
});
