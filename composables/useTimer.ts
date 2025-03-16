export const useTimer = (initialTime: number, callbacks: { onComplete?: () => void; onTick?: () => void } = {}) => {
    const countdown = shallowRef(initialTime);
  
    const { start, reset, remaining, pause, resume } = useCountdown(countdown, {
      onComplete: () => {
        if (callbacks.onComplete) {
          callbacks.onComplete();
        }
      },
      onTick: () => {
        if (callbacks.onTick) {
          callbacks.onTick();
        }
      },
    });
  
    return {
      countdown,
      start,
      reset,
      remaining,
      pause,
      resume,
    };
  };