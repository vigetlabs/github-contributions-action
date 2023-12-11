import * as core from '@actions/core';
import { subDays } from 'date-fns';

export type Inputs = {
  githubToken: string;
  startDate: Date;
  endDate: Date;
  users: string[];
};

export function getInputs(): Inputs {
  const daysInput = core.getInput('days');
  const githubTokenInput = core.getInput('github-token', { required: true });
  const usersInput = core.getInput('users', { required: true });

  const days = parseInt(daysInput, 10);

  if (isNaN(days) || days < 1) {
    throw new Error('Days must be a positive number');
  }

  const users = usersInput
    .split(',')
    .map(user => user.trim())
    .filter(user => !!user);

  if (!users.length) {
    throw new Error('At least one user must be provided');
  }

  const endDate = new Date();
  const startDate = subDays(endDate, days);

  return {
    githubToken: githubTokenInput,
    startDate,
    endDate,
    users,
  };
}
