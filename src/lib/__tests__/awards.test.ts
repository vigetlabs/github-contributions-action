import { getMostActiveUser, getMostActiveProject } from '../awards';

describe('awards', () => {
  describe('getMostActiveUser', () => {
    it('returns the user with the most activity', () => {
      expect(
        getMostActiveUser({
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
        }),
      ).toEqual(['john', 3]);
    });

    it('returns "none" if no users have activity', () => {
      expect(getMostActiveUser({})).toEqual(['none', 0]);
    });
  });

  describe('getMostActiveProject', () => {
    it('returns the project with the most activity', () => {
      expect(
        getMostActiveProject({
          'owner1/repo1': {
            opened: 2,
            merged: 1,
            reviews: 4,
          },
          'owner2/repo2': {
            opened: 1,
            merged: 5,
            reviews: 1,
          },
        }),
      ).toEqual(['owner1/repo1', 4]);
    });

    it('returns "none" if no projects have activity', () => {
      expect(getMostActiveProject({})).toEqual(['none', 0]);
    });
  });
});
