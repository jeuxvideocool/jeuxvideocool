const cache = new Map<string, HTMLAudioElement>();

export function playSound(url: string, { volume = 0.4 } = {}) {
  const sound = cache.get(url) ?? new Audio(url);
  sound.currentTime = 0;
  sound.volume = volume;
  cache.set(url, sound);
  sound.play().catch(() => undefined);
}

export function playBeep({ frequency = 440, duration = 0.1, volume = 0.2 } = {}) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
  osc.onended = () => ctx.close();
}
