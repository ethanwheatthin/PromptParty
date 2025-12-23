/**
 * Pure game logic functions for PromptParty
 * These functions are stateless and testable
 */

export interface GameConfig {
  minPerformanceDurationSeconds: number;
  maxPerformanceDurationSeconds: number;
  cutVoteThresholdPercent: number;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  minPerformanceDurationSeconds: 30,
  maxPerformanceDurationSeconds: 90,
  cutVoteThresholdPercent: 50,
};

/**
 * Calculate the number of cut votes required to end a performance
 * @param activeNonActorCount Number of active players excluding the actor
 * @param thresholdPercent Percentage threshold (default 50 for majority)
 * @returns Required number of votes
 */
export function calculateCutVoteThreshold(
  activeNonActorCount: number,
  thresholdPercent: number = DEFAULT_GAME_CONFIG.cutVoteThresholdPercent
): number {
  if (activeNonActorCount <= 0) {
    return 0;
  }
  return Math.ceil((activeNonActorCount * thresholdPercent) / 100);
}

/**
 * Check if enough cut votes have been cast to end the performance
 * @param cutVoteCount Current number of cut votes
 * @param activeNonActorCount Number of active players excluding the actor
 * @param config Game configuration
 * @returns True if threshold is reached
 */
export function hasReachedCutThreshold(
  cutVoteCount: number,
  activeNonActorCount: number,
  config: GameConfig = DEFAULT_GAME_CONFIG
): boolean {
  const threshold = calculateCutVoteThreshold(activeNonActorCount, config.cutVoteThresholdPercent);
  return cutVoteCount >= threshold;
}

/**
 * Calculate min cutoff timestamp and max end timestamp for a round
 * @param startedAt Performance start timestamp
 * @param config Game configuration
 * @returns Object with minCutoffAt and maxEndAt timestamps
 */
export function calculatePerformanceTimestamps(
  startedAt: Date,
  config: GameConfig = DEFAULT_GAME_CONFIG
): { minCutoffAt: Date; maxEndAt: Date } {
  const minCutoffAt = new Date(startedAt.getTime() + config.minPerformanceDurationSeconds * 1000);
  const maxEndAt = new Date(startedAt.getTime() + config.maxPerformanceDurationSeconds * 1000);
  return { minCutoffAt, maxEndAt };
}

/**
 * Check if a player can cast a cut vote
 * @param currentTime Current timestamp
 * @param minCutoffAt Minimum cutoff timestamp
 * @param isActor Whether the player is the actor
 * @param hasAlreadyVoted Whether the player has already voted
 * @returns True if player can cast a cut vote
 */
export function canCastCutVote(
  currentTime: Date,
  minCutoffAt: Date,
  isActor: boolean,
  hasAlreadyVoted: boolean
): boolean {
  if (isActor) return false;
  if (hasAlreadyVoted) return false;
  if (currentTime < minCutoffAt) return false;
  return true;
}

/**
 * Calculate average rating from an array of ratings
 * @param ratings Array of rating values (1-10)
 * @returns Average rating rounded to 2 decimal places
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 100) / 100;
}

/**
 * Select the next actor in rotation
 * @param currentActorIndex Current actor's index in players array
 * @param totalPlayers Total number of players
 * @returns Next actor index
 */
export function selectNextActor(currentActorIndex: number, totalPlayers: number): number {
  if (totalPlayers <= 0) return 0;
  return (currentActorIndex + 1) % totalPlayers;
}
