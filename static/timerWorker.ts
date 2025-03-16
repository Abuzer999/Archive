self.onmessage = (e) => {
  const { delay } = e.data;
  let timeLeft = delay;

  const interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft -= 1000; // Decrease by 1 second
      self.postMessage(timeLeft); // Send remaining time back to the main thread
    } else {
      clearInterval(interval);
      self.postMessage("done"); // Notify when the task is done
    }
  }, 1000);
};
