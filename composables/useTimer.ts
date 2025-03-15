export const useTimer = (initialTime: number) => {
    const savedTime = localStorage.getItem("timer") ? Number(localStorage.getItem("timer")) : initialTime;
    const timer = ref<number>(savedTime);
    let interval: ReturnType<typeof setInterval> | null = null;
  
    // Запускаем таймер
    const startTimer = () => {
      if (interval) return;
  
      interval = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          clearInterval(interval!);
          interval = null;
        }
      }, 1000);
    };
  
    const resetTimer = () => {
      if (interval) {
        clearInterval(interval);
      }
      timer.value = initialTime;
      interval = null;
      localStorage.setItem("timer", String(initialTime)); 
    };
  
    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  
    watch(timer, (newValue) => {
      localStorage.setItem("timer", String(newValue));
    });
  
    onMounted(() => {
      startTimer();
    });
  
    onUnmounted(() => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    });
  
    return {
      timer,
      startTimer,
      resetTimer,
      stopTimer,
    };
  };