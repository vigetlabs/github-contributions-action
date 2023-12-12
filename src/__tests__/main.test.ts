import * as core from '@actions/core';
import * as main from '../main';
import * as collect from '../lib/collect';
import * as slackBlocks from '../lib/slack-blocks';

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');
const collectActivitySpy = jest.spyOn(collect, 'collectActivity');
const createSlackBlocksSpy = jest.spyOn(slackBlocks, 'createSlackBlocks');

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance;
let errorMock: jest.SpyInstance;
let getInputMock: jest.SpyInstance;
let setFailedMock: jest.SpyInstance;
let setOutputMock: jest.SpyInstance;

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    debugMock = jest.spyOn(core, 'debug').mockImplementation();
    errorMock = jest.spyOn(core, 'error').mockImplementation();
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation();
  });

  it('sets the `json` and `slackBlocks` outputs', async () => {
    collectActivitySpy.mockResolvedValueOnce({
      start: 'November 15th, 2023',
      end: 'Novermber 22nd, 2023',
      totalOpenedPrs: 16,
      totalMergedPrs: 16,
      totalReviews: 32,
      mostActiveProject: 'owner1/repo1',
      mostActiveProjectCount: 16,
      mostActiveUser: 'barryjbluejeans',
      mostActiveUserCount: 12,
    });

    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'days':
          return '3';
        case 'github-token':
          return 'abc';
        case 'users':
          return 'solomonhawk,cwmanning';
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('Starting report collection...'),
    );

    expect(collectActivitySpy).toHaveBeenCalled();

    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('Finished collecting data...'),
    );

    expect(createSlackBlocksSpy).toHaveBeenCalled();

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'json',
      expect.any(String),
    );
    expect(setOutputMock).toHaveBeenNthCalledWith(
      2,
      'slackBlocks',
      expect.any(String),
    );
    expect(errorMock).not.toHaveBeenCalled();
  });

  it('sets a failed status if inputs are invalid', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'days':
          return '-5';
        case 'github-token':
          return 'abc';
        case 'users':
          return 'solomonhawk,cwmanning';
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Days must be a positive number',
    );
    expect(errorMock).not.toHaveBeenCalled();
  });
});
