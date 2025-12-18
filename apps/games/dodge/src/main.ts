import "./style.css";
import { createKeyboardInput } from "@core/input";
import { createGameLoop } from "@core/loop";
import { chance, clamp, rand, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { updateGameState } from "@storage";

const GAME_ID = "dodge";
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

type Obstacle = { x: number; y: number; size: number; speed: number };
type Powerup = { x: number; y: number; size: number; duration: number };

const state = {
  running: false,
  width: 0,
  height: 0,
  player: { x: 0, y: 0, r: 14, dash: 0, dashCooldown: 0 },
  invulnerable: 0,
  time: 0,
  spawnTimer: 0,
  powerupTimer: 0,
  obstacles: [] as Obstacle[],
  powerups: [] as Powerup[],
};

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
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
    showOverlay("Config introuvable", "Ajoute configs/games/dodge.config.json", false);
    return;
  }
  state.running = true;
  state.player.x = state.width * 0.15;
  state.player.y = state.height / 2;
  state.player.dash = 0;
  state.player.dashCooldown = 0;
  state.time = 0;
  state.invulnerable = 0;
  state.spawnTimer = 0;
  state.powerupTimer = 0;
  state.obstacles = [];
  state.powerups = [];
  overlay.style.display = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  const score = Math.floor(state.time);
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = (game.state.bestTime as number | undefined) || 0;
    if (score > best) {
      game.state.bestTime = score;
      game.bestScore = score;
    }
  });
  const action = win ? "Victoire !" : "Touché !";
  showOverlay(`${action} (${score}s)`, config?.uiText.help || "Rejoue pour pousser ton record.");
}

function showOverlay(title: string, body: string, showStart = true) {
  overlay.style.display = "grid";
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">Dodge Rush</p>
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

showOverlay(config?.uiText.title || "Dodge Rush", config?.uiText.help || "");

function update(dt: number) {
  if (!state.running || !config) return;
  state.time += dt;
  state.spawnTimer += dt * 1000;
  state.powerupTimer += dt * 1000;
  const speed = config.difficultyParams.obstacleSpeed;

  // Player movement
  const moveX =
    (keyboard.isDown(config.input.keys.right || "ArrowRight") ? 1 : 0) +
    (keyboard.isDown(config.input.keys.left || "ArrowLeft") ? -1 : 0);
  const moveY =
    (keyboard.isDown(config.input.keys.down || "ArrowDown") ? 1 : 0) +
    (keyboard.isDown(config.input.keys.up || "ArrowUp") ? -1 : 0);

  const dashKey = config.input.keys.dash || "Space";
  const dashReady = state.player.dashCooldown <= 0;
  if (keyboard.isDown(dashKey) && dashReady) {
    state.player.dash = 0.45;
    state.player.dashCooldown = 2.5;
    emitEvent({ type: "DASH_USED", gameId: GAME_ID });
  }

  const speedMultiplier = state.player.dash > 0 ? 2.4 : 1;
  state.player.x += moveX * config.difficultyParams.playerSpeed * speedMultiplier * (dt * 60);
  state.player.y += moveY * config.difficultyParams.playerSpeed * speedMultiplier * (dt * 60);
  state.player.x = clamp(state.player.x, state.player.r, state.width - state.player.r);
  state.player.y = clamp(state.player.y, state.player.r, state.height - state.player.r);

  state.player.dash = Math.max(0, state.player.dash - dt);
  state.player.dashCooldown = Math.max(0, state.player.dashCooldown - dt);
  state.invulnerable = Math.max(0, state.invulnerable - dt);

  // Spawn obstacles
  if (state.spawnTimer >= config.difficultyParams.spawnIntervalMs) {
    state.spawnTimer = 0;
    state.obstacles.push({
      x: state.width + rand(10, 60),
      y: rand(40, state.height - 40),
      size: rand(12, 22),
      speed: speed * rand(0.9, 1.2),
    });
  }

  // Spawn powerups
  if (state.powerupTimer >= 1600) {
    state.powerupTimer = 0;
    if (chance(config.difficultyParams.powerupChance)) {
      state.powerups.push({
        x: rand(state.width * 0.4, state.width * 0.95),
        y: rand(50, state.height - 50),
        size: 10,
        duration: 2.5,
      });
    }
  }

  // Update obstacles
  state.obstacles = state.obstacles.filter((obs) => {
    obs.x -= (obs.speed + state.time * 0.02) * (dt * 60);
    if (obs.x + obs.size < 0) {
      emitEvent({ type: "OBSTACLE_DODGED", gameId: GAME_ID });
      return false;
    }
    const dx = obs.x - state.player.x;
    const dy = obs.y - state.player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < obs.size + state.player.r) {
      if (state.invulnerable > 0 || state.player.dash > 0) {
        emitEvent({ type: "OBSTACLE_DODGED", gameId: GAME_ID });
        return false;
      }
      endGame(false);
      return false;
    }
    return true;
  });

  // Update powerups
  state.powerups = state.powerups.filter((p) => {
    p.x -= speed * 0.5 * (dt * 60);
    const dx = p.x - state.player.x;
    const dy = p.y - state.player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < p.size + state.player.r) {
      emitEvent({ type: "POWERUP_COLLECTED", gameId: GAME_ID });
      state.invulnerable = p.duration;
      state.player.dashCooldown = Math.max(0, state.player.dashCooldown - 1);
      return false;
    }
    return p.x + p.size > 0;
  });

  if (state.time >= config.difficultyParams.winTimeSeconds) {
    endGame(true);
  }
}

function render() {
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0, 0, state.width, state.height);

  // Player
  ctx.fillStyle = state.invulnerable > 0 ? "#7cf5ff" : "#ff5f6d";
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2);
  ctx.fill();

  // Obstacles
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  state.obstacles.forEach((obs) => {
    ctx.beginPath();
    ctx.rect(obs.x - obs.size, obs.y - obs.size, obs.size * 2, obs.size * 2);
    ctx.fill();
  });

  // Powerups
  ctx.fillStyle = "#7cf5ff";
  state.powerups.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
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
    <div class="pill">Temps ${state.time.toFixed(1)}s</div>
    <div class="pill">Dash ${Math.max(0, state.player.dashCooldown).toFixed(1)}s</div>
    <div class="pill">Invuln ${state.invulnerable.toFixed(1)}s</div>
  `;
  ui.appendChild(hud);
}
