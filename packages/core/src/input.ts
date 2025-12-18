export type KeyboardInput = {
  isDown: (code: string) => boolean;
  dispose: () => void;
};

export function createKeyboardInput(): KeyboardInput {
  const pressed = new Set<string>();
  const onDown = (e: KeyboardEvent) => pressed.add(e.code);
  const onUp = (e: KeyboardEvent) => pressed.delete(e.code);
  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  return {
    isDown: (code: string) => pressed.has(code),
    dispose() {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      pressed.clear();
    },
  };
}

export type PointerInput = {
  position: { x: number; y: number };
  isDown: boolean;
  dispose: () => void;
};

export function createPointerInput(target: HTMLElement): PointerInput {
  const position = { x: 0, y: 0 };
  let isDown = false;

  const setFromEvent = (event: PointerEvent) => {
    const rect = target.getBoundingClientRect();
    position.x = event.clientX - rect.left;
    position.y = event.clientY - rect.top;
  };

  const onMove = (event: PointerEvent) => setFromEvent(event);
  const onDown = (event: PointerEvent) => {
    isDown = true;
    setFromEvent(event);
  };
  const onUp = () => {
    isDown = false;
  };

  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerdown", onDown);
  target.addEventListener("pointerup", onUp);
  target.addEventListener("pointerleave", onUp);

  return {
    get position() {
      return position;
    },
    get isDown() {
      return isDown;
    },
    dispose() {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onDown);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointerleave", onUp);
    },
  };
}
