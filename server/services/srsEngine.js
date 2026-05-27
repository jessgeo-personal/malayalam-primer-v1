/**
 * SRS Engine for Malayalam Prime
 * Calculates the new SRS weight based on user performance.
 * 
 * Logic:
 * - Correct: Multiply by 1.5
 * - Incorrect: Multiply by 0.5
 * - Response Time < 3s: Add 0.2 boost
 * - Response Time > 10s: Subtract 0.1 penalty
 * - Limits: Min 1.0, Max 50.0
 */

const MIN_WEIGHT = 1.0;
const MAX_WEIGHT = 50.0;
const FAST_THRESHOLD = 3000;
const SLOW_THRESHOLD = 10000;

function calculateNewWeight(currentWeight, isCorrect, responseTimeMs) {
  let newWeight = currentWeight;

  if (isCorrect) {
    newWeight *= 1.5;
    if (responseTimeMs < FAST_THRESHOLD) {
      newWeight += 0.2;
    }
  } else {
    newWeight *= 0.5;
    if (responseTimeMs > SLOW_THRESHOLD) {
      newWeight -= 0.1;
    }
  }

  // Apply bounds
  newWeight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, newWeight));
  
  // Round to 2 decimal places for clean DB storage
  return Math.round(newWeight * 100) / 100;
}

module.exports = {
  calculateNewWeight
};
