import { isMobileDevice } from "./utils";

export type KeyboardInput = {
  isDown: (code: string) => boolean;
  dispose: () => void;
};

export function createKeyboardInput(): KeyboardInput {
  const pressed = new Set<string>();
  const preventCodes = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);
  const onDown = (e: KeyboardEvent) => {
    if (preventCodes.has(e.code)) {
      e.preventDefault();
    }
    pressed.add(e.code);
  };
  const onUp = (e: KeyboardEvent) => {
    if (preventCodes.has(e.code)) {
      e.preventDefault();
    }
    pressed.delete(e.code);
  };
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

export type HybridInput = {
  isDown: (code: string) => boolean;
  bindButton: (el: HTMLElement, code: string) => () => void;
  press: (code: string) => void;
  release: (code: string) => void;
  dispose: () => void;
};

export function createHybridInput(): HybridInput {
  const keyboard = createKeyboardInput();
  const touchPressed = new Set<string>();

  const setPressed = (code: string, pressed: boolean) => {
    if (!code) return;
    if (pressed) touchPressed.add(code);
    else touchPressed.delete(code);
  };

  const bindButton = (el: HTMLElement, code: string) => {
    const down = (e: PointerEvent) => {
      e.preventDefault();
      setPressed(code, true);
    };
    const up = (e: PointerEvent) => {
      e.preventDefault();
      setPressed(code, false);
    };
    el.addEventListener("pointerdown", down, { passive: false });
    el.addEventListener("pointerup", up, { passive: false });
    el.addEventListener("pointercancel", up, { passive: false });
    el.addEventListener("pointerleave", up, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", up);
      setPressed(code, false);
    };
  };

  return {
    isDown: (code: string) => keyboard.isDown(code) || touchPressed.has(code),
    bindButton,
    press: (code: string) => setPressed(code, true),
    release: (code: string) => setPressed(code, false),
    dispose: () => {
      keyboard.dispose();
      touchPressed.clear();
    },
  };
}

type MobileMapping = {
  up?: string;
  down?: string;
  left?: string;
  right?: string;
  actionA?: string;
  actionALabel?: string;
  actionB?: string;
  actionBLabel?: string;
};

type MobileControlsOptions = {
  container: HTMLElement;
  input: HybridInput;
  mapping: MobileMapping;
  showOnDesktop?: boolean;
  autoShow?: boolean;
  showFullscreenToggle?: boolean;
  showPad?: boolean;
  gestureEnabled?: boolean;
};

type MotionAxis = {
  negative?: string;
  positive?: string;
};

export type MotionAction = {
  code: string;
  trigger: "shake" | "tiltForward" | "tiltBack" | "tiltLeft" | "tiltRight";
  mode?: "tap" | "hold";
  threshold?: number;
  cooldownMs?: number;
};

export type MotionControlsOptions = {
  input: HybridInput;
  axis?: {
    x?: MotionAxis;
    y?: MotionAxis;
  };
  actions?: MotionAction[];
  deadzone?: number;
  maxTilt?: number;
  smoothing?: number;
  invertX?: boolean;
  invertY?: boolean;
};

export type MotionControls = {
  supported: boolean;
  active: boolean;
  start: () => Promise<boolean>;
  stop: () => void;
  dispose: () => void;
};

export type MobileControlMode = "touch" | "motion";

export type MobileControlManagerOptions = {
  gameId: string;
  container: HTMLElement;
  input: HybridInput;
  touch: {
    mapping: MobileMapping;
    showPad?: boolean;
    gestureEnabled?: boolean;
    showFullscreenToggle?: boolean;
  };
  motion: MotionControlsOptions;
  hints?: {
    touch?: string;
    motion?: string;
  };
  defaultMode?: MobileControlMode;
};

export type MobileControlManager = {
  isMobile: boolean;
  mode: MobileControlMode;
  show: () => void;
  hide: () => void;
  attachOverlay: (overlay: HTMLElement) => void;
  setMode: (mode: MobileControlMode) => Promise<void>;
  dispose: () => void;
};

let mobileStylesInjected = false;
function injectMobileStyles() {
  if (mobileStylesInjected) return;
  mobileStylesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    .mobile-controls {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr auto;
      grid-template-areas:
        "fs fs"
        "pad actions";
      align-content: end;
      align-items: end;
      justify-items: stretch;
      gap: 12px;
      padding: 16px;
      padding-bottom: calc(18px + env(safe-area-inset-bottom, 0px));
      transition: opacity 0.25s ease, transform 0.25s ease;
      --mc-primary: var(--color-primary, #f4c56a);
      --mc-accent: var(--color-accent, #7dd3fc);
      --mc-ink: rgba(248, 250, 255, 0.98);
      --mc-surface: rgba(10, 14, 22, 0.45);
      --mc-border: rgba(255, 255, 255, 0.14);
    }
    .mobile-controls.hidden-desktop {
      display: none;
    }
    @media (max-width: 1024px) {
      .mobile-controls.hidden-desktop {
        display: grid;
      }
    }
    .mobile-controls.mc-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
    }
    .mobile-pad,
    .mobile-actions {
      pointer-events: all;
      align-self: end;
      margin-bottom: env(safe-area-inset-bottom, 0px);
    }
    .mobile-pad {
      grid-area: pad;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 6px;
      width: min(148px, 38vw);
      max-width: 34vw;
      justify-self: start;
      background: var(--mc-surface);
      border-radius: 18px;
      padding: 12px;
      backdrop-filter: blur(14px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35),
        inset 0 0 0 1px rgba(255, 255, 255, 0.04);
    }
    .mobile-actions {
      grid-area: actions;
      display: flex;
      gap: 12px;
      justify-self: end;
    }
    .mobile-btn {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      border: 1px solid var(--mc-border);
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.06)),
        linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.12));
      color: var(--mc-ink);
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
      cursor: pointer;
      touch-action: none;
      letter-spacing: 0.02em;
      transition: transform 0.12s ease, box-shadow 0.2s ease;
    }
    .mobile-btn.action {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, var(--mc-primary), var(--mc-accent));
      color: #0b0f17;
      font-weight: 800;
      box-shadow: 0 16px 28px rgba(0, 0, 0, 0.3);
    }
    .mobile-btn:active {
      transform: scale(0.96);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    .mobile-btn:disabled {
      opacity: 0.35;
      cursor: default;
      box-shadow: none;
      filter: saturate(0.6);
    }
    @media (max-height: 720px) {
      .mobile-btn {
        width: 40px;
        height: 40px;
        font-size: 13px;
      }
      .mobile-btn.action {
        width: 48px;
        height: 48px;
      }
      .mobile-pad {
        width: min(132px, 36vw);
        padding: 8px;
      }
    }
    .mobile-fs-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid var(--mc-border);
      background: rgba(255, 255, 255, 0.08);
      color: var(--mc-ink);
      font-weight: 800;
      font-size: 16px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.26);
      cursor: pointer;
      touch-action: manipulation;
      backdrop-filter: blur(8px);
    }
    .mobile-fs-btn:active {
      transform: scale(0.95);
    }
    .mobile-fs-wrap {
      grid-area: fs;
      pointer-events: all;
      align-self: start;
      justify-self: end;
    }
    .mobile-gesture {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      touch-action: none;
      z-index: 29;
    }
    @media (min-width: 1025px) {
      .mobile-gesture {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
}

function createBtn(
  label: string,
  code: string | undefined,
  input: HybridInput,
  variant: "pad" | "action" = "pad",
) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `mobile-btn${variant === "action" ? " action" : ""}`;
  btn.textContent = label;
  btn.setAttribute("aria-label", label);
  if (code) {
    input.bindButton(btn, code);
  } else {
    btn.disabled = true;
  }
  return btn;
}

function bindGestureZone(
  zone: HTMLElement,
  mapping: { up?: string; down?: string; left?: string; right?: string },
  input: HybridInput,
) {
  const dir = { x: 0, y: 0 };
  let active = false;
  let start = { x: 0, y: 0 };
  const threshold = 10;

  const release = () => {
    ["up", "down", "left", "right"].forEach((key) => {
      const code = (mapping as any)[key];
      if (code) input.release(code);
    });
  };

  const apply = (dx: number, dy: number) => {
    release();
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < threshold && absY < threshold) return;
    if (absX > absY) {
      if (dx > 0 && mapping.right) input.press(mapping.right);
      if (dx < 0 && mapping.left) input.press(mapping.left);
    } else {
      if (dy > 0 && mapping.down) input.press(mapping.down);
      if (dy < 0 && mapping.up) input.press(mapping.up);
    }
  };

  const onDown = (e: PointerEvent) => {
    e.preventDefault();
    active = true;
    start = { x: e.clientX, y: e.clientY };
  };
  const onMove = (e: PointerEvent) => {
    if (!active) return;
    e.preventDefault();
    if (!active) return;
    dir.x = e.clientX - start.x;
    dir.y = e.clientY - start.y;
    apply(dir.x, dir.y);
  };
  const onUp = () => {
    active = false;
    dir.x = 0;
    dir.y = 0;
    release();
  };

  zone.addEventListener("pointerdown", onDown, { passive: false });
  zone.addEventListener("pointermove", onMove, { passive: false });
  zone.addEventListener("pointerup", onUp, { passive: false });
  zone.addEventListener("pointercancel", onUp, { passive: false });
  zone.addEventListener("pointerleave", onUp, { passive: false });

  return () => {
    zone.removeEventListener("pointerdown", onDown);
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerup", onUp);
    zone.removeEventListener("pointercancel", onUp);
    zone.removeEventListener("pointerleave", onUp);
    release();
  };
}

export function createMobileControls(options: MobileControlsOptions) {
  const {
    container,
    input,
    mapping,
    showOnDesktop = false,
    autoShow = false,
    showFullscreenToggle = true,
    showPad = false,
    gestureEnabled = true,
  } = options;
  if (!container) return { dispose: () => {} };
  injectMobileStyles();

  const root = document.createElement("div");
  root.className = `mobile-controls ${showOnDesktop ? "" : "hidden-desktop"}`.trim();
  if (!autoShow) {
    root.classList.add("mc-hidden");
  }

  const pad = document.createElement("div");
  pad.className = "mobile-pad";

  const up = createBtn("↑", mapping.up, input);
  const down = createBtn("↓", mapping.down, input);
  const left = createBtn("←", mapping.left, input);
  const right = createBtn("→", mapping.right, input);

  pad.appendChild(document.createElement("div"));
  pad.appendChild(up);
  pad.appendChild(document.createElement("div"));
  pad.appendChild(left);
  pad.appendChild(document.createElement("div"));
  pad.appendChild(right);
  pad.appendChild(document.createElement("div"));
  pad.appendChild(down);
  pad.appendChild(document.createElement("div"));

  const actions = document.createElement("div");
  actions.className = "mobile-actions";
  const actionA = mapping.actionA
    ? createBtn(mapping.actionALabel || "A", mapping.actionA, input, "action")
    : null;
  const actionB = mapping.actionB
    ? createBtn(mapping.actionBLabel || "B", mapping.actionB, input, "action")
    : null;
  if (actionA) actions.appendChild(actionA);
  if (actionB) actions.appendChild(actionB);

  const hasDirections = Boolean(mapping.up || mapping.down || mapping.left || mapping.right);
  const hasPad = hasDirections && showPad;
  const hasActions = Boolean(actionA || actionB);

  if (hasPad) root.appendChild(pad);
  if (hasActions) root.appendChild(actions);

  const fsBtn = showFullscreenToggle ? document.createElement("button") : null;
  if (fsBtn) {
    fsBtn.type = "button";
    fsBtn.className = "mobile-fs-btn";
    fsBtn.textContent = "⤢";
    fsBtn.title = "Plein écran";
    fsBtn.addEventListener("click", () => {
      const el = document.fullscreenElement;
      if (el) {
        document.exitFullscreen().catch(() => {});
      } else {
        (document.documentElement as any)?.requestFullscreen?.().catch(() => {});
      }
    });
    const fsWrap = document.createElement("div");
    fsWrap.className = "mobile-fs-wrap";
    fsWrap.appendChild(fsBtn);
    root.appendChild(fsWrap);
  }

  let gestureCleanup: (() => void) | undefined;
  let gestureEl: HTMLDivElement | undefined;
  if (hasDirections && gestureEnabled) {
    gestureEl = document.createElement("div");
    gestureEl.className = "mobile-gesture";
    gestureEl.style.background = "transparent";
    container.appendChild(gestureEl);
    gestureCleanup = bindGestureZone(gestureEl, mapping, input);
  }

  if (hasPad || hasActions || fsBtn) {
    container.appendChild(root);
  }

  const updateVisibility = (visible: boolean) => {
    root.classList.toggle("mc-hidden", !visible);
    if (gestureEl) {
      gestureEl.style.display = visible ? "block" : "none";
      gestureEl.style.pointerEvents = visible ? "all" : "none";
    }
  };

  updateVisibility(autoShow);

  return {
    show() {
      updateVisibility(true);
    },
    hide() {
      updateVisibility(false);
    },
    dispose() {
      root.remove();
      if (gestureEl?.parentElement) {
        gestureEl.remove();
      }
      gestureCleanup?.();
    },
  };
}

export function createMotionControls(options: MotionControlsOptions): MotionControls {
  const {
    input,
    axis,
    actions = [],
    deadzone = 10,
    maxTilt = 35,
    smoothing = 0.16,
    invertX = false,
    invertY = false,
  } = options;
  const needsOrientation =
    Boolean(axis?.x?.negative || axis?.x?.positive || axis?.y?.negative || axis?.y?.positive) ||
    actions.some((action) => action.trigger !== "shake");
  const needsMotion = actions.some((action) => action.trigger === "shake");
  const hasWindow = typeof window !== "undefined";
  const supportsOrientation = hasWindow && "DeviceOrientationEvent" in window;
  const supportsMotion = hasWindow && "DeviceMotionEvent" in window;
  const supported = (!needsOrientation || supportsOrientation) && (!needsMotion || supportsMotion);

  const pressed = new Set<string>();
  const actionStates = actions.map(() => ({ active: false, lastFire: 0 }));
  let smoothedX = 0;
  let smoothedY = 0;

  const press = (code?: string) => {
    if (!code) return;
    input.press(code);
    pressed.add(code);
  };
  const release = (code?: string) => {
    if (!code) return;
    input.release(code);
    pressed.delete(code);
  };
  const releaseAll = () => {
    pressed.forEach((code) => input.release(code));
    pressed.clear();
    actionStates.forEach((state) => {
      state.active = false;
    });
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const getTilt = (event: DeviceOrientationEvent) => {
    const gamma = event.gamma ?? 0;
    const beta = event.beta ?? 0;
    const angle =
      (window.screen?.orientation?.angle ?? (window as any).orientation ?? 0) % 360;
    switch (angle) {
      case 90:
        return { x: beta, y: -gamma };
      case -90:
      case 270:
        return { x: -beta, y: gamma };
      case 180:
      case -180:
        return { x: -gamma, y: -beta };
      default:
        return { x: gamma, y: beta };
    }
  };

  const applyAxis = (value: number, negative?: string, positive?: string) => {
    if (!negative && !positive) return;
    const abs = Math.abs(value);
    if (abs < deadzone) {
      release(negative);
      release(positive);
      return;
    }
    if (value > 0) {
      press(positive);
      release(negative);
    } else {
      press(negative);
      release(positive);
    }
  };

  const getActionValue = (trigger: MotionAction["trigger"], x: number, y: number) => {
    switch (trigger) {
      case "tiltLeft":
        return -x;
      case "tiltRight":
        return x;
      case "tiltForward":
        return y;
      case "tiltBack":
        return -y;
      default:
        return 0;
    }
  };

  const triggerTap = (code: string) => {
    press(code);
    window.setTimeout(() => release(code), 90);
  };

  const handleTiltActions = (x: number, y: number) => {
    actions.forEach((action, idx) => {
      if (action.trigger === "shake") return;
      const state = actionStates[idx];
      const value = getActionValue(action.trigger, x, y);
      const threshold = action.threshold ?? 18;
      const cooldown = action.cooldownMs ?? 240;
      const releaseThreshold = threshold * 0.6;
      const now = performance.now();

      if (action.mode === "hold") {
        if (value >= threshold && !state.active) {
          state.active = true;
          press(action.code);
        } else if (value < releaseThreshold && state.active) {
          state.active = false;
          release(action.code);
        }
        return;
      }

      if (value >= threshold && !state.active && now - state.lastFire > cooldown) {
        state.active = true;
        state.lastFire = now;
        triggerTap(action.code);
      } else if (value < releaseThreshold) {
        state.active = false;
      }
    });
  };

  const onOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma == null && event.beta == null) return;
    const raw = getTilt(event);
    const nextX = clamp(raw.x, -maxTilt, maxTilt) * (invertX ? -1 : 1);
    const nextY = clamp(raw.y, -maxTilt, maxTilt) * (invertY ? -1 : 1);
    smoothedX += (nextX - smoothedX) * smoothing;
    smoothedY += (nextY - smoothedY) * smoothing;
    applyAxis(smoothedX, axis?.x?.negative, axis?.x?.positive);
    applyAxis(smoothedY, axis?.y?.negative, axis?.y?.positive);
    handleTiltActions(smoothedX, smoothedY);
  };

  const onMotion = (event: DeviceMotionEvent) => {
    const accel = event.acceleration ?? event.accelerationIncludingGravity;
    if (!accel) return;
    const magnitude = Math.sqrt(
      (accel.x || 0) * (accel.x || 0) +
        (accel.y || 0) * (accel.y || 0) +
        (accel.z || 0) * (accel.z || 0),
    );
    const intensity = event.acceleration ? magnitude : Math.abs(magnitude - 9.81);
    const now = performance.now();
    actions.forEach((action, idx) => {
      if (action.trigger !== "shake") return;
      const threshold = action.threshold ?? 12;
      const cooldown = action.cooldownMs ?? 520;
      const state = actionStates[idx];
      if (intensity >= threshold && now - state.lastFire > cooldown) {
        state.lastFire = now;
        triggerTap(action.code);
      }
    });
  };

  const requestPermission = async () => {
    if (!hasWindow) return false;
    const promises: Promise<string>[] = [];
    const MotionEvent = (window as any).DeviceMotionEvent;
    const OrientationEvent = (window as any).DeviceOrientationEvent;
    if (needsMotion && typeof MotionEvent?.requestPermission === "function") {
      promises.push(MotionEvent.requestPermission());
    }
    if (needsOrientation && typeof OrientationEvent?.requestPermission === "function") {
      promises.push(OrientationEvent.requestPermission());
    }
    if (promises.length === 0) return true;
    try {
      const results = await Promise.all(promises);
      return results.every((result) => result === "granted");
    } catch {
      return false;
    }
  };

  const api: MotionControls = {
    supported,
    active: false,
    async start() {
      if (!supported) return false;
      if (api.active) return true;
      const allowed = await requestPermission();
      if (!allowed) return false;
      if (needsOrientation) {
        window.addEventListener("deviceorientation", onOrientation, { passive: true });
      }
      if (needsMotion) {
        window.addEventListener("devicemotion", onMotion, { passive: true });
      }
      api.active = true;
      return true;
    },
    stop() {
      if (!api.active) return;
      if (needsOrientation) {
        window.removeEventListener("deviceorientation", onOrientation);
      }
      if (needsMotion) {
        window.removeEventListener("devicemotion", onMotion);
      }
      api.active = false;
      releaseAll();
      smoothedX = 0;
      smoothedY = 0;
    },
    dispose() {
      api.stop();
    },
  };

  return api;
}

export function createMobileControlManager(options: MobileControlManagerOptions): MobileControlManager {
  const isMobile = isMobileDevice();
  if (!isMobile) {
    return {
      isMobile: false,
      mode: "touch",
      show: () => {},
      hide: () => {},
      attachOverlay: () => {},
      setMode: async () => {},
      dispose: () => {},
    };
  }

  const storageKey = `mobile-control-mode:${options.gameId}`;
  let storedMode: MobileControlMode | null = null;
  try {
    storedMode = (localStorage.getItem(storageKey) as MobileControlMode | null) ?? null;
  } catch {
    storedMode = null;
  }

  const motionControls = createMotionControls(options.motion);
  let mode: MobileControlMode = storedMode || options.defaultMode || "touch";
  if (mode === "motion" && !motionControls.supported) {
    mode = "touch";
  }

  const touchControls = createMobileControls({
    container: options.container,
    input: options.input,
    mapping: options.touch.mapping,
    autoShow: false,
    showOnDesktop: false,
    showPad: options.touch.showPad ?? true,
    gestureEnabled: options.touch.gestureEnabled ?? false,
    showFullscreenToggle: options.touch.showFullscreenToggle ?? true,
  });

  let visible = false;
  let motionDenied = false;
  let motionReady = false;
  let sectionEl: HTMLElement | null = null;

  const saveMode = () => {
    try {
      localStorage.setItem(storageKey, mode);
    } catch {
      // ignore storage failures
    }
  };

  const statusText = () => {
    if (!motionControls.supported) return "Capteurs indisponibles";
    if (motionDenied) return "Autorisation refusée";
    if (motionControls.active) return "Capteurs actifs";
    if (motionReady) return "Capteurs prêts";
    return "Autorisation requise";
  };

  const updateSection = () => {
    if (!sectionEl) return;
    const touchOption = sectionEl.querySelector<HTMLElement>('[data-control-mode="touch"]');
    const motionOption = sectionEl.querySelector<HTMLElement>('[data-control-mode="motion"]');
    const touchInput = sectionEl.querySelector<HTMLInputElement>(
      'input[name="mobile-control-mode"][value="touch"]',
    );
    const motionInput = sectionEl.querySelector<HTMLInputElement>(
      'input[name="mobile-control-mode"][value="motion"]',
    );
    const hint = sectionEl.querySelector<HTMLElement>("[data-control-hint]");
    const status = sectionEl.querySelector<HTMLElement>("[data-control-status]");

    if (touchOption) touchOption.classList.toggle("is-active", mode === "touch");
    if (motionOption) {
      motionOption.classList.toggle("is-active", mode === "motion");
      motionOption.classList.toggle("is-disabled", !motionControls.supported);
    }
    if (touchInput) touchInput.checked = mode === "touch";
    if (motionInput) {
      motionInput.checked = mode === "motion";
      motionInput.disabled = !motionControls.supported;
    }
    if (hint) {
      hint.textContent =
        mode === "motion"
          ? options.hints?.motion || "Incliner pour jouer."
          : options.hints?.touch || "D-pad + actions.";
    }
    if (status) {
      status.textContent = statusText();
    }
  };

  const setMode = async (next: MobileControlMode) => {
    if (mode === next) return;
    if (next === "motion") {
      if (!motionControls.supported) {
        motionDenied = true;
        mode = "touch";
      } else {
        const allowed = await motionControls.start();
        if (!allowed) {
          motionDenied = true;
          motionReady = false;
          mode = "touch";
          motionControls.stop();
        } else {
          motionDenied = false;
          motionReady = true;
          mode = "motion";
          if (!visible) {
            motionControls.stop();
          }
        }
      }
    } else {
      mode = "touch";
      motionControls.stop();
    }
    saveMode();
    if (visible) {
      if (mode === "touch") touchControls.show();
      else touchControls.hide();
    } else {
      touchControls.hide();
    }
    api.mode = mode;
    updateSection();
  };

  const api: MobileControlManager = {
    isMobile: true,
    mode,
    async show() {
      visible = true;
      if (mode === "motion") {
        const allowed = await motionControls.start();
        if (!allowed) {
          motionDenied = true;
          motionReady = false;
          mode = "touch";
          api.mode = mode;
          touchControls.show();
        } else {
          motionDenied = false;
          motionReady = true;
          touchControls.hide();
        }
      } else {
        touchControls.show();
        motionControls.stop();
      }
      updateSection();
    },
    hide() {
      visible = false;
      touchControls.hide();
      motionControls.stop();
      updateSection();
    },
    attachOverlay(overlay: HTMLElement) {
      const grid = overlay.querySelector(".launch-grid");
      if (!grid) return;
      const existing = grid.querySelector("[data-mobile-controls]");
      existing?.remove();
      const section = document.createElement("section");
      section.className = "launch-section mobile-controls-section";
      section.dataset.mobileControls = "true";
      section.innerHTML = `
        <h3 class="launch-section-title">Contrôles mobiles</h3>
        <div class="launch-rows">
          <div class="launch-row">
            <span class="launch-row-label">Mode</span>
            <div class="launch-row-value launch-options">
              <label class="launch-option" data-control-mode="touch">
                <input type="radio" name="mobile-control-mode" value="touch" />
                <span class="launch-option-title">Boutons</span>
                <span class="launch-option-meta">Pad + actions</span>
              </label>
              <label class="launch-option" data-control-mode="motion">
                <input type="radio" name="mobile-control-mode" value="motion" />
                <span class="launch-option-title">Capteurs</span>
                <span class="launch-option-meta">Gyro + accel</span>
              </label>
            </div>
          </div>
          <div class="launch-row">
            <span class="launch-row-label">Aperçu</span>
            <div class="launch-row-value">
              <span class="launch-chip" data-control-hint></span>
            </div>
          </div>
          <div class="launch-row">
            <span class="launch-row-label">Statut</span>
            <div class="launch-row-value">
              <span class="launch-chip muted" data-control-status></span>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(section);
      sectionEl = section;
      const optionsEls = section.querySelectorAll<HTMLInputElement>(
        'input[name="mobile-control-mode"]',
      );
      optionsEls.forEach((inputEl) => {
        inputEl.addEventListener("change", () => {
          setMode(inputEl.value as MobileControlMode);
        });
      });
      updateSection();
    },
    setMode,
    dispose() {
      touchControls.dispose();
      motionControls.dispose();
      sectionEl = null;
    },
  };

  api.mode = mode;
  updateSection();
  return api;
}
