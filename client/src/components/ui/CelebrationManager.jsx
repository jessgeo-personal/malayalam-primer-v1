import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const CelebrationManager = () => {
  useEffect(() => {
    const handleCelebration = (event) => {
      const { type } = event.detail;

      if (type === 'sparkle') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#22D3EE', '#FACC15', '#F87171']
        });
      } else if (type === 'redemption') {
        // Redemption: Big Starburst
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      } else if (type === 'epic') {
        // Epic: Fireworks
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        const fire = (particleRatio, opts) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      }
    };

    window.addEventListener('mp-celebration', handleCelebration);
    return () => window.removeEventListener('mp-celebration', handleCelebration);
  }, []);

  return null; // Silent manager
};

export default CelebrationManager;
