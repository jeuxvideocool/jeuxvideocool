import "./style.css";
import { createKeyboardInput } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "quest";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = themes.find((t) => t.id === config?.themeId) || themes[0];
attachProgressionListener();

if (theme) {
  const root = document.documentElement.style;
  root.setProperty("--color-primary", theme.colors.primary);
  root.setProperty("--color-secondary", theme.colors.secondary);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-text", theme.colors.text);
  root.setProperty("--color-muted", theme.colors.muted);
  document.body.style.background = theme.gradient || document.body.style.background;
}

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ui = document.getElementById("ui") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;
const keyboard = createKeyboardInput();
const overlay = document.createElement("div");
overlay.className = "overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

type Point = { x: number; y: number };
type Item = Point & { collected: boolean };
type Trap = Point & { active: boolean };

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 12 },
  items: [] as Item[],
  traps: [] as Trap[],
  gate: { x: 0, y: 0, open: false },
  timer: config?.difficultyParams.timeLimitSeconds ?? 60,
  collected: 0,
};

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  state.width = canvas.width / devicePixelRatio;
  state.height = canvas.height / devicePixelRatio;
}
resize();
window.addEventListener("resize", resize);

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function startGame() {
  if (!config) {
    showOverlay("Config manquante", "Ajoute configs/games/quest.config.json", false);
    return;
  }
  state.running = true;
  state.player.x = state.width * 0.15;
  state.player.y = state.height / 2;
  state.items = [];
  state.traps = [];
  state.collected = 0;
  state.gate = { x: state.width * 0.85, y: state.height / 2, open: false };
  state.timer = config.difficultyParams.timeLimitSeconds;
  spawnItems();
  spawnTraps();
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function spawnItems() {
  for (let i = 0; i < (config?.difficultyParams.itemCount ?? 6); i++) {
    state.items.push({
      x: rand(state.width * 0.25, state.width * 0.8),
      y: rand(50, state.height - 50),
      collected: false,
    });
  }
}

function spawnTraps() {
  for (let i = 0; i < (config?.difficultyParams.trapCount ?? 4); i++) {
    state.traps.push({
      x: rand(state.width * 0.2, state.width * 0.8),
      y: rand(60, state.height - 60),
      active: true,
    });
  }
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  const eventType = win ? "QUEST_COMPLETE" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { remaining: state.timer } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = (game.state.bestTime as number | undefined) || 0;
    if (win && state.timer > best) {
      game.state.bestTime = state.timer;
      game.bestScore = state.timer;
    }
  });
  showOverlay(win ? "Porte franchie" : "Temps écoulé", config?.uiText.help || "");
}

function showOverlay(title: string, body: string, showStart = true) {
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Mini Quest</p>
      <h2>${title}</h2>
      <p>${body}</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
        ${showStart ? `<button class="btn" id="play-btn">Lancer</button>` : ""}
        <a class="btn secondary" href="${withBasePath("/apps/hub/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
    </div>
  `;
  const play = document.getElementById("play-btn");
  play?.addEventListener("click", startGame);
}

showOverlay(config?.uiText.title || "Mini Quest", config?.uiText.help || "");

function update(dt: number) {
  if (!state.running || !config) return;
  state.timer -= dt;
  if (state.timer <= 0) {
    endGame(false);
    return;
  }

  const moveX =
    (keyboard.isDown(config.input.keys.right || "ArrowRight") ? 1 : 0) +
    (keyboard.isDown(config.input.keys.left || "ArrowLeft") ? -1 : 0);
  const moveY =
    (keyboard.isDown(config.input.keys.down || "ArrowDown") ? 1 : 0) +
    (keyboard.isDown(config.input.keys.up || "ArrowUp") ? -1 : 0);
  state.player.x += moveX * config.difficultyParams.playerSpeed * (dt * 60);
  state.player.y += moveY * config.difficultyParams.playerSpeed * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = clamp(state.player.y, state.player.r, state.height - state.player.r);

  // Items
  state.items.forEach((item) => {
    if (item.collected) return;
    const dx = item.x - state.player.x;
    const dy = item.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 10) {
      item.collected = true;
      state.collected += 1;
      emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID });
      if (state.collected >= state.items.length) {
        state.gate.open = true;
        emitEvent({ type: "GATE_UNLOCKED", gameId: GAME_ID });
      }
    }
  });

  // Traps
  state.traps.forEach((trap) => {
    if (!trap.active) return;
    const dx = trap.x - state.player.x;
    const dy = trap.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 10) {
      trap.active = false;
      state.timer = Math.max(0, state.timer - 5);
      emitEvent({ type: "TRAP_TRIGGERED", gameId: GAME_ID });
    }
  });

  // Gate
  const dxGate = state.gate.x - state.player.x;
  const dyGate = state.gate.y - state.player.y;
  if (state.gate.open && Math.sqrt(dxGate * dxGate + dyGate * dyGate) < state.player.r + 16) {
    endGame(true);
  }
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Gate
  ctx.fillStyle = state.gate.open ? theme.colors.accent : "rgba(255,255,255,0.1)";
  ctx.fillRect(state.gate.x - 14, state.gate.y - 24, 28, 48);

  // Items
  state.items.forEach((item) => {
    ctx.fillStyle = item.collected ? "rgba(255,255,255,0.2)" : theme.colors.secondary;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // Traps
  ctx.fillStyle = "rgba(255,95,109,0.9)";
  state.traps.forEach((trap) => {
    if (!trap.active) return;
    ctx.beginPath();
    ctx.moveTo(trap.x, trap.y - 10);
    ctx.lineTo(trap.x - 10, trap.y + 10);
    ctx.lineTo(trap.x + 10, trap.y + 10);
    ctx.closePath();
    ctx.fill();
  });

  // Player
  ctx.fillStyle = theme.colors.primary;
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const hud = document.createElement("div");
  hud.className = "hud";
  hud.innerHTML = `
    <div class="pill">Temps ${state.timer.toFixed(1)}s</div>
    <div class="pill">Objets ${state.collected}/${state.items.length}</div>
    <div class="pill">Porte ${state.gate.open ? "ouverte" : "fermée"}</div>
  `;
  ui.appendChild(hud);
}
