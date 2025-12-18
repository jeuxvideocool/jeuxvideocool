export type GameEvent = {
  type: string;
  payload?: Record<string, any>;
  gameId?: string;
  timestamp?: number;
};

type Listener = (event: GameEvent) => void;

class EventBus {
  private listeners: Record<string, Listener[]> = {};

  on(type: string, listener: Listener) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(listener);
    return () => this.off(type, listener);
  }

  off(type: string, listener: Listener) {
    this.listeners[type] = (this.listeners[type] || []).filter((l) => l !== listener);
  }

  emit(event: GameEvent) {
    const enriched: GameEvent = { timestamp: Date.now(), ...event };
    const list = this.listeners[event.type] || [];
    list.forEach((listener) => listener(enriched));
    const wildcard = this.listeners["*"] || [];
    wildcard.forEach((listener) => listener(enriched));
  }
}

export const globalEventBus = new EventBus();

export function emitEvent(event: GameEvent) {
  globalEventBus.emit(event);
}

export function onEvent(type: string | "*", listener: Listener) {
  if (type === "*") {
    return globalEventBus.on("*", listener);
  }
  return globalEventBus.on(type, listener);
}
