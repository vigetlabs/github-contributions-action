import * as core from '@actions/core';
import { getInputs } from '../input';

let getInputMock: jest.SpyInstance;

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
  });

  it('throws if inputs.days is not a number', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'days':
          return 'this is not a number';
        case 'github-token':
          return 'abc';
        case 'users':
          return 'solomonhawk,cwmanning';
        default:
          return '';
      }
    });

    expect(() => getInputs()).toThrow('Days must be a positive number');
  });

  it('throws inputs.days is not a positive number', async () => {
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

    expect(() => getInputs()).toThrow('Days must be a positive number');
  });

  it('throws if inputs.users is empty', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'days':
          return '7';
        case 'github-token':
          return 'abc';
        case 'users':
          return '';
        default:
          return '';
      }
    });

    expect(() => getInputs()).toThrow('At least one user must be provided');
  });

  it('returns inputs if valid', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'days':
          return '7';
        case 'github-token':
          return 'abc';
        case 'users':
          return 'john,mary,tim';
        default:
          return '';
      }
    });

    expect(getInputs()).toEqual({
      githubToken: 'abc',
      endDate: new Date('2020-04-01T00:00:00.000Z'),
      startDate: new Date('2020-03-25T00:00:00.000Z'),
      users: ['john', 'mary', 'tim'],
    });
  });
});
