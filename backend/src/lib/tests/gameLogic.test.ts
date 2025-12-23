import {
  calculateCutVoteThreshold,
  hasReachedCutThreshold,
  calculatePerformanceTimestamps,
  canCastCutVote,
  calculateAverageRating,
  selectNextActor,
  DEFAULT_GAME_CONFIG,
} from '../gameLogic';

describe('gameLogic', () => {
  describe('calculateCutVoteThreshold', () => {
    it('should calculate majority threshold correctly', () => {
      expect(calculateCutVoteThreshold(3)).toBe(2); // 50% of 3 = 1.5, ceil = 2
      expect(calculateCutVoteThreshold(4)).toBe(2); // 50% of 4 = 2
      expect(calculateCutVoteThreshold(5)).toBe(3); // 50% of 5 = 2.5, ceil = 3
      expect(calculateCutVoteThreshold(10)).toBe(5); // 50% of 10 = 5
    });

    it('should return 0 for no players', () => {
      expect(calculateCutVoteThreshold(0)).toBe(0);
    });

    it('should handle custom threshold percentage', () => {
      expect(calculateCutVoteThreshold(10, 75)).toBe(8); // 75% of 10 = 7.5, ceil = 8
      expect(calculateCutVoteThreshold(10, 25)).toBe(3); // 25% of 10 = 2.5, ceil = 3
    });
  });

  describe('hasReachedCutThreshold', () => {
    it('should return true when threshold is reached', () => {
      expect(hasReachedCutThreshold(2, 3)).toBe(true); // threshold is 2
      expect(hasReachedCutThreshold(3, 5)).toBe(true); // threshold is 3
    });

    it('should return false when threshold is not reached', () => {
      expect(hasReachedCutThreshold(1, 3)).toBe(false); // threshold is 2
      expect(hasReachedCutThreshold(2, 5)).toBe(false); // threshold is 3
    });

    it('should return true when votes exceed threshold', () => {
      expect(hasReachedCutThreshold(5, 5)).toBe(true); // threshold is 3
    });
  });

  describe('calculatePerformanceTimestamps', () => {
    it('should calculate correct timestamps', () => {
      const startedAt = new Date('2024-01-01T00:00:00.000Z');
      const result = calculatePerformanceTimestamps(startedAt);

      expect(result.minCutoffAt).toEqual(new Date('2024-01-01T00:00:30.000Z'));
      expect(result.maxEndAt).toEqual(new Date('2024-01-01T00:01:30.000Z'));
    });

    it('should use custom config', () => {
      const startedAt = new Date('2024-01-01T00:00:00.000Z');
      const result = calculatePerformanceTimestamps(startedAt, {
        ...DEFAULT_GAME_CONFIG,
        minPerformanceDurationSeconds: 15,
        maxPerformanceDurationSeconds: 60,
      });

      expect(result.minCutoffAt).toEqual(new Date('2024-01-01T00:00:15.000Z'));
      expect(result.maxEndAt).toEqual(new Date('2024-01-01T00:01:00.000Z'));
    });
  });

  describe('canCastCutVote', () => {
    const minCutoffAt = new Date('2024-01-01T00:00:30.000Z');

    it('should allow vote after cutoff time for non-actor who hasnt voted', () => {
      const currentTime = new Date('2024-01-01T00:00:31.000Z');
      expect(canCastCutVote(currentTime, minCutoffAt, false, false)).toBe(true);
    });

    it('should not allow vote before cutoff time', () => {
      const currentTime = new Date('2024-01-01T00:00:29.000Z');
      expect(canCastCutVote(currentTime, minCutoffAt, false, false)).toBe(false);
    });

    it('should not allow actor to vote', () => {
      const currentTime = new Date('2024-01-01T00:00:31.000Z');
      expect(canCastCutVote(currentTime, minCutoffAt, true, false)).toBe(false);
    });

    it('should not allow duplicate vote', () => {
      const currentTime = new Date('2024-01-01T00:00:31.000Z');
      expect(canCastCutVote(currentTime, minCutoffAt, false, true)).toBe(false);
    });
  });

  describe('calculateAverageRating', () => {
    it('should calculate average correctly', () => {
      expect(calculateAverageRating([5, 5, 5])).toBe(5);
      expect(calculateAverageRating([3, 4, 5])).toBe(4);
      expect(calculateAverageRating([1, 10])).toBe(5.5);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageRating([])).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateAverageRating([3, 3, 4])).toBe(3.33);
    });
  });

  describe('selectNextActor', () => {
    it('should rotate to next player', () => {
      expect(selectNextActor(0, 5)).toBe(1);
      expect(selectNextActor(1, 5)).toBe(2);
      expect(selectNextActor(4, 5)).toBe(0); // wrap around
    });

    it('should handle edge cases', () => {
      expect(selectNextActor(0, 1)).toBe(0); // single player
      expect(selectNextActor(0, 0)).toBe(0); // no players
    });
  });
});
