type LoopOptions = {
  update: (dt: number) => void;
  render?: () => void;
  fps?: number;
};

export function createGameLoop(options: LoopOptions) {
  const fpsInterval = 1000 / (options.fps ?? 60);
  let then = performance.now();
  let requestId: number | null = null;
  let running = false;

  const tick = (now: number) => {
    if (!running) return;
    const delta = now - then;
    if (delta >= fpsInterval) {
      then = now - (delta % fpsInterval);
      options.update(delta / 1000);
      options.render?.();
    }
    requestId = requestAnimationFrame(tick);
  };

  return {
    start() {
      if (running) return;
      running = true;
      then = performance.now();
      requestId = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (requestId !== null) cancelAnimationFrame(requestId);
    },
    isRunning() {
      return running;
    },
  };
}
