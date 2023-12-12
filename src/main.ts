import * as core from '@actions/core';
import * as logger from './logger';
import { getInputs } from './input';
import { collectActivity } from './lib/collect';
import { createSlackBlocks } from './lib/slack-blocks';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputs = getInputs();

    core.debug(`Starting report collection... ${new Date().toTimeString()}`);

    const activity = await collectActivity(inputs, logger);

    core.debug(`Finished collecting data... ${new Date().toTimeString()}`);

    const slackBlocks = createSlackBlocks(activity, logger);

    core.setOutput('json', JSON.stringify(activity));
    core.setOutput('slackBlocks', JSON.stringify(slackBlocks));
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
