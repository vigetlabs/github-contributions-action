import { subDays } from 'date-fns';
import { HttpResponse, http } from 'msw';
import * as testLogger from '../../test/logger';
import { server } from '../../mocks/node';
import { pullRequestsOpened, queryAllMetrics } from '../api';

describe('api', () => {
  const end = new Date();
  const start = subDays(end, 3);

  it('gives up after 3 retries', async () => {
    jest.useRealTimers();

    server.use(
      http.get('https://api.github.com/search/issues', () => {
        return HttpResponse.json(null, {
          status: 403,
          headers: {
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': String((Date.now() + 200) / 1000),
          },
        });
      }),
    );

    await expect(async () =>
      queryAllMetrics('abc', 'barryjbluejeans', [start, end], testLogger),
    ).rejects.toThrow('Retried 3 times, giving up.');

    jest.useFakeTimers();
  });

  it('recovers from an intermittent rate limit error', async () => {
    server.use(
      // rate limit first request
      http.get(
        'https://api.github.com/search/issues',
        () => {
          return HttpResponse.json(null, {
            status: 403,
            headers: {
              'x-ratelimit-remaining': '0',
              'x-ratelimit-reset': String((Date.now() + 200) / 1000),
            },
          });
        },
        { once: true },
      ),

      // respond successfully to subsequent requests
      http.get('https://api.github.com/search/issues', () => {
        return HttpResponse.json(
          {
            total_count: 1,
            items: [
              {
                title: 'PR 1',
                repository_url: 'https://api.github.com/repos/owner1/repo1',
                user: {
                  login: 'barryjbluejeans',
                },
              },
            ],
          },
          {
            status: 200,
          },
        );
      }),
    );

    const openedPrsPromise = pullRequestsOpened(
      'abc',
      'barryjbluejeans',
      [start, end],
      testLogger,
    );

    await jest.runAllTimersAsync();

    const openedPrs = await openedPrsPromise;

    expect(openedPrs.total_count).toBe(1);
  });

  it('throws on a non-200 response', async () => {
    server.use(
      http.get('https://api.github.com/search/issues', () => {
        return HttpResponse.json(null, {
          status: 404,
        });
      }),
    );

    await expect(async () =>
      queryAllMetrics('abc', 'barryjbluejeans', [start, end], testLogger),
    ).rejects.toThrow('Failed to get a response!');
  });

  it('forwards errors from response data', async () => {
    server.use(
      http.get('https://api.github.com/search/issues', () => {
        return HttpResponse.json(
          {
            errors: [{ message: 'The cake is a lie' }],
          },
          {
            status: 200,
          },
        );
      }),
    );

    await expect(async () =>
      queryAllMetrics('abc', 'barryjbluejeans', [start, end], testLogger),
    ).rejects.toThrow('The cake is a lie');
  });

  it('follows link headers to request all pages', async () => {
    const items = [
      {
        title: 'PR 1',
        repository_url: 'https://api.github.com/repos/owner1/repo1',
        user: {
          login: 'barryjbluejeans',
        },
      },
      {
        title: 'PR 2',
        repository_url: 'https://api.github.com/repos/owner1/repo1',
        user: {
          login: 'barryjbluejeans',
        },
      },
    ];

    server.use(
      // first PRs opened request, includes link to page 2
      http.get(
        'https://api.github.com/search/issues',
        ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get('q');

          // PRs opened
          if (q?.startsWith('type:pr author:')) {
            return HttpResponse.json(
              {
                total_count: 2,
                items: [items[0]],
              },
              {
                status: 200,
                headers: {
                  link: '<https://api.github.com/search/issues?q=type:pr+author:barryjbluejeans+created:2020-03-29..2020-04-01&per_page=1000&page=2>; rel="next", <https://api.github.com/search/issues?q=type:pr+author:barryjbluejeans+created:2020-03-29..2020-04-01&per_page=1000&page=2>; rel="last"',
                },
              },
            );
          }
        },
        { once: true },
      ),

      // second PRs opened request, last page
      http.get(
        'https://api.github.com/search/issues',
        ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get('q');

          // PRs opened
          if (q?.startsWith('type:pr author:')) {
            return HttpResponse.json(
              {
                total_count: 2,
                items: [items[1]],
              },
              {
                status: 200,
              },
            );
          }
        },
        { once: true },
      ),
    );

    const openedPrs = await pullRequestsOpened(
      'abc',
      'barryjbluejeans',
      [start, end],
      testLogger,
    );

    expect(openedPrs.total_count).toBe(2);
    expect(openedPrs.items).toEqual(items);
  });
});
