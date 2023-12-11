import * as testLogger from '../../test/logger';
import { createSlackBlocks } from '../slack-blocks';

let debugMock: jest.SpyInstance;

describe('slack-blocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    debugMock = jest.spyOn(testLogger, 'debug').mockImplementation();
  });

  describe('createSlackBlocks', () => {
    it('creates a set of Slack blocks', () => {
      const slackBlocks = createSlackBlocks(
        {
          start: 'November 15th, 2023',
          end: 'Novermber 22nd, 2023',
          totalOpenedPrs: 16,
          totalMergedPrs: 16,
          totalReviews: 32,
          mostActiveProject: 'owner1/repo1',
          mostActiveProjectCount: 16,
          mostActiveUser: 'barryjbluejeans',
          mostActiveUserCount: 12,
        },
        testLogger,
      );

      expect(debugMock).toHaveBeenNthCalledWith(1, 'Slack blocks:');
      expect(debugMock).toHaveBeenNthCalledWith(2, expect.any(String));

      expect(slackBlocks).toEqual([
        {
          block_id: 'acitivity_heading',
          text: {
            text: 'Activity for November 15th, 2023 through Novermber 22nd, 2023',
            type: 'mrkdwn',
          },
          type: 'section',
        },
        {
          type: 'divider',
        },
        {
          block_id: 'prs_opened',
          elements: [
            {
              text: '👀  Total PRs opened: *16*',
              type: 'mrkdwn',
            },
          ],
          type: 'context',
        },
        {
          block_id: 'prs_merged',
          elements: [
            {
              text: '🚀  Total PRs merged: *16*',
              type: 'mrkdwn',
            },
          ],
          type: 'context',
        },
        {
          block_id: 'code_reviews_given',
          elements: [
            {
              text: '✅  Code Reviews given: *32*',
              type: 'mrkdwn',
            },
          ],
          type: 'context',
        },
        {
          block_id: 'most_active_project',
          elements: [
            {
              text: '👑  Most Active Project:  *owner1/repo1* with 16 contributions',
              type: 'mrkdwn',
            },
          ],
          type: 'context',
        },
        {
          block_id: 'most_active_contributor',
          elements: [
            {
              text: '🥇  Most Active User: *barryjbluejeans* with 12 contributions',
              type: 'mrkdwn',
            },
          ],
          type: 'context',
        },
        {
          type: 'divider',
        },
      ]);
    });
  });
});
