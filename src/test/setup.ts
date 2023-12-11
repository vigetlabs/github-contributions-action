import { server } from '../mocks/node';

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2020, 3, 1));

  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  jest.useRealTimers();
  server.close();
});

server.events.on('request:start', ({ request }) => {
  if (process.env.DEBUG_MSW) {
    console.log('MSW intercepted:', request.method, request.url);
  }
});
