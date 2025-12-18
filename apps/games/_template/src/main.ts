import "./style.css";
import { createKeyboardInput } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "__GAME_ID__";
const config = getGameConfig(GAME_ID);
const themes = getThemes();
const theme = config ? themes.find((t) => t.id === config.themeId) || themes[0] : themes[0];
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

type Pickup = { x: number; y: number; collected: boolean };

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 12 },
  pickups: [] as Pickup[],
  score: 0,
  timer: 45,
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
    showOverlay("Config à compléter", "Crée configs/games/<id>.config.json", false);
    return;
  }
  state.running = true;
  state.player.x = state.width / 2;
  state.player.y = state.height / 2;
  state.pickups = [];
  for (let i = 0; i < 8; i++) {
    state.pickups.push({ x: rand(40, state.width - 40), y: rand(40, state.height - 40), collected: false });
  }
  state.score = 0;
  state.timer = 45;
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score: state.score } });
  if (config) {
    updateGameState(GAME_ID, config.saveSchemaVersion, (game) => {
      const best = (game.state.bestScore as number | undefined) || 0;
      if (state.score > best) {
        game.state.bestScore = state.score;
        game.bestScore = state.score;
      }
    });
  }
  showOverlay(win ? "GG" : "Raté", config?.uiText.help || "");
}

function showOverlay(title: string, body: string, showStart = true) {
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Template</p>
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

showOverlay(config?.uiText.title || "Nouveau jeu", config?.uiText.help || "Copie ce template et ajoute ta config.");

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
  const speed = config.difficultyParams.playerSpeed || 3;
  state.player.x += moveX * speed * (dt * 60);
  state.player.y += moveY * speed * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = clamp(state.player.y, state.player.r, state.height - state.player.r);

  state.pickups.forEach((pickup) => {
    if (pickup.collected) return;
    const dx = pickup.x - state.player.x;
    const dy = pickup.y - state.player.y;
    if (Math.sqrt(dx * dx + dy * dy) < state.player.r + 10) {
      pickup.collected = true;
      state.score += 10;
      emitEvent({ type: "ITEM_COLLECTED", gameId: GAME_ID });
    }
  });

  if (state.pickups.every((p) => p.collected)) {
    endGame(true);
  }
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Player
  ctx.fillStyle = theme.colors.primary;
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2);
  ctx.fill();

  // Pickups
  ctx.fillStyle = theme.colors.secondary;
  state.pickups.forEach((p) => {
    ctx.globalAlpha = p.collected ? 0.2 : 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

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
    <div class="pill">Score ${state.score}</div>
  `;
  ui.appendChild(hud);
}
