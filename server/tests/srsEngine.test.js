const srsEngine = require('../services/srsEngine');

describe('SRS Engine Logic', () => {
  test('should increase weight for correct answers', () => {
    const oldWeight = 1.0;
    const newWeight = srsEngine.calculateNewWeight(oldWeight, true, 5000);
    expect(newWeight).toBeGreaterThan(oldWeight);
  });

  test('should decrease weight for incorrect answers', () => {
    const oldWeight = 5.0;
    const newWeight = srsEngine.calculateNewWeight(oldWeight, false, 5000);
    expect(newWeight).toBeLessThan(oldWeight);
  });

  test('should provide a boost for fast response times', () => {
    const weight1 = srsEngine.calculateNewWeight(1.0, true, 8000);
    const weight2 = srsEngine.calculateNewWeight(1.0, true, 2000); // Faster
    expect(weight2).toBeGreaterThan(weight1);
  });

  test('should respect the minimum weight of 1.0', () => {
    const newWeight = srsEngine.calculateNewWeight(1.0, false, 5000);
    expect(newWeight).toBe(1.0);
  });

  test('should respect the maximum weight of 50.0', () => {
    const newWeight = srsEngine.calculateNewWeight(50.0, true, 1000);
    expect(newWeight).toBe(50.0);
  });
});
