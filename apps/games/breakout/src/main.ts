import "./style.css";
import { createHybridInput, createMobileControls } from "@core/input";
import { createGameLoop } from "@core/loop";
import { clamp, withBasePath } from "@core/utils";
import { emitEvent } from "@core/events";
import { getGameConfig, getThemes } from "@config";
import { attachProgressionListener } from "@progression";
import { loadSave, updateGameState } from "@storage";

type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  row: number;
  col: number;
  alive: boolean;
  color: string;
};

const GAME_ID = "breakout";
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
  root.setProperty("--color-bg", theme.colors.background);
  document.body.style.background = theme.gradient || theme.colors.background;
}

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ui = document.getElementById("ui") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;
const input = createHybridInput();
const overlay = document.createElement("div");
overlay.className = "overlay";
overlay.style.display = "none";
ui.appendChild(overlay);

const controls = {
  left: config?.input.keys.left || "ArrowLeft",
  right: config?.input.keys.right || "ArrowRight",
  altLeft: config?.input.keys.altLeft || "KeyQ",
  altRight: config?.input.keys.altRight || "KeyD",
  launch: config?.input.keys.launch || "Space",
};

const isMobile =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(pointer: coarse)")?.matches || navigator.maxTouchPoints > 0);

const mobileControls = isMobile
  ? createMobileControls({
      container: document.body,
      input,
      mapping: {
        left: controls.left,
        right: controls.right,
        actionA: controls.launch,
        actionALabel: "Lancer",
      },
      autoShow: false,
      showPad: true,
      gestureEnabled: false,
      showOnDesktop: false,
    })
  : {
      show: () => {},
      hide: () => {},
      dispose: () => {},
    };

const state = {
  running: false,
  width: 0,
  height: 0,
  dpr: devicePixelRatio || 1,
  play: { x: 0, y: 0, w: 0, h: 0 },
  paddle: { x: 0, y: 0, w: 120, h: 16, speed: 640 },
  ball: { x: 0, y: 0, vx: 0, vy: 0, r: 8, stuck: true },
  rows: config?.difficultyParams.rows ?? 6,
  cols: config?.difficultyParams.cols ?? 10,
  brickGap: clamp(config?.difficultyParams.brickGap ?? 8, 4, 14),
  brickHeight: 22,
  bricks: [] as Brick[],
  bricksRemaining: 0,
  totalBricks: 0,
  clearedRows: new Set<number>(),
  score: 0,
  best: loadSave().games[GAME_ID]?.bestScore ?? 0,
  lives: config?.difficultyParams.lives ?? 3,
  ballSpeed: config?.difficultyParams.ballSpeed ?? 320,
  pointsPerBrick: config?.difficultyParams.pointsPerBrick ?? 10,
  launchHeld: false,
  flash: 0,
};

const loop = createGameLoop({
  update: (dt) => update(dt),
  render,
  fps: 60,
});

function resize() {
  const prevPlay = { ...state.play };
  state.dpr = devicePixelRatio || 1;
  canvas.width = window.innerWidth * state.dpr;
  canvas.height = window.innerHeight * state.dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  state.width = canvas.width / state.dpr;
  state.height = canvas.height / state.dpr;
  layoutPlayfield();
  if (prevPlay.w > 0 && prevPlay.h > 0) {
    const paddleRatio = (state.paddle.x - prevPlay.x) / prevPlay.w;
    state.paddle.x = state.play.x + clamp(paddleRatio, 0, 1) * state.play.w;
    if (!state.ball.stuck) {
      const ballRatioX = (state.ball.x - prevPlay.x) / prevPlay.w;
      const ballRatioY = (state.ball.y - prevPlay.y) / prevPlay.h;
      state.ball.x = state.play.x + ballRatioX * state.play.w;
      state.ball.y = state.play.y + ballRatioY * state.play.h;
    }
  } else {
    state.paddle.x = state.play.x + (state.play.w - state.paddle.w) / 2;
  }
  if (state.ball.stuck) {
    stickBallToPaddle();
  }
  positionBricks();
}

function layoutPlayfield() {
  const margin = Math.max(16, Math.min(state.width, state.height) * 0.05);
  const playWidth = Math.min(state.width - margin * 2, 920);
  const playHeight = state.height - margin * 2;
  state.play.x = (state.width - playWidth) / 2;
  state.play.y = margin;
  state.play.w = playWidth;
  state.play.h = playHeight;

  state.paddle.w = clamp(
    config?.difficultyParams.paddleWidth ?? playWidth * 0.24,
    playWidth * 0.16,
    playWidth * 0.34,
  );
  state.paddle.h = clamp(Math.floor(playHeight * 0.03), 10, 18);
  state.paddle.y = state.play.y + state.play.h - state.paddle.h - Math.max(16, playHeight * 0.04);

  state.ball.r = clamp(Math.floor(playWidth * 0.012), 6, 10);
  state.brickGap = clamp(config?.difficultyParams.brickGap ?? 8, 4, 14);
  state.brickHeight = clamp(Math.floor(playHeight * 0.045), 16, 28);
}

function positionBricks() {
  if (!state.bricks.length) return;
  const brickW = (state.play.w - state.brickGap * (state.cols - 1)) / state.cols;
  const startX = state.play.x;
  const startY = state.play.y + Math.max(18, state.play.h * 0.08);
  state.bricks.forEach((brick) => {
    brick.w = brickW;
    brick.h = state.brickHeight;
    brick.x = startX + brick.col * (brickW + state.brickGap);
    brick.y = startY + brick.row * (state.brickHeight + state.brickGap);
  });
}

function buildBricks() {
  const palette = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    "#ffd166",
    "#7ce7ff",
  ];
  const brickW = (state.play.w - state.brickGap * (state.cols - 1)) / state.cols;
  const startX = state.play.x;
  const startY = state.play.y + Math.max(18, state.play.h * 0.08);
  state.bricks = [];
  state.clearedRows = new Set();

  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      state.bricks.push({
        x: startX + col * (brickW + state.brickGap),
        y: startY + row * (state.brickHeight + state.brickGap),
        w: brickW,
        h: state.brickHeight,
        row,
        col,
        alive: true,
        color: palette[row % palette.length],
      });
    }
  }

  state.totalBricks = state.rows * state.cols;
  state.bricksRemaining = state.totalBricks;
}

function stickBallToPaddle() {
  state.ball.x = state.paddle.x + state.paddle.w / 2;
  state.ball.y = state.paddle.y - state.ball.r - 4;
}

function resetBall() {
  state.ball.stuck = true;
  state.ball.vx = 0;
  state.ball.vy = 0;
  stickBallToPaddle();
}

function launchBall() {
  state.ball.stuck = false;
  const spread = Math.PI / 3;
  const angle = -Math.PI / 2 + (Math.random() * spread - spread / 2);
  state.ball.vx = Math.cos(angle) * state.ballSpeed;
  state.ball.vy = Math.sin(angle) * state.ballSpeed;
}

function startGame() {
  if (!config) {
    showOverlay("Config manquante", "Ajoute configs/games/breakout.config.json", false);
    return;
  }
  mobileControls.show();
  state.running = true;
  state.score = 0;
  state.flash = 0;
  state.lives = config?.difficultyParams.lives ?? 3;
  state.rows = config?.difficultyParams.rows ?? 6;
  state.cols = config?.difficultyParams.cols ?? 10;
  state.ballSpeed = config?.difficultyParams.ballSpeed ?? 320;
  state.pointsPerBrick = config?.difficultyParams.pointsPerBrick ?? 10;
  state.paddle.x = state.play.x + (state.play.w - state.paddle.w) / 2;
  resetBall();
  buildBricks();
  overlay.style.display = "none";
  canvas.style.pointerEvents = "auto";
  ui.style.pointerEvents = "none";
  emitEvent({ type: "SESSION_START", gameId: GAME_ID });
  loop.start();
}

function endGame(win: boolean) {
  state.running = false;
  loop.stop();
  mobileControls.hide();
  const score = state.score;
  const eventType = win ? "SESSION_WIN" : "SESSION_FAIL";
  emitEvent({ type: eventType, gameId: GAME_ID, payload: { score } });
  updateGameState(GAME_ID, config?.saveSchemaVersion ?? 1, (game) => {
    const best = game.bestScore || 0;
    if (score > best) {
      game.bestScore = score;
    }
    const destroyed = state.totalBricks - state.bricksRemaining;
    const bestBricks = (game.state.bestBricks as number | undefined) || 0;
    if (destroyed > bestBricks) {
      game.state.bestBricks = destroyed;
    }
  });
  state.best = Math.max(state.best, score);
  const title = win ? "Victoire" : "Perdu";
  showOverlay(title, config?.uiText.help || "Relance une partie pour battre ton record.", true, score);
}

function loseLife() {
  state.lives = Math.max(0, state.lives - 1);
  state.flash = 1;
  if (state.lives <= 0) {
    endGame(false);
  } else {
    resetBall();
  }
}

function breakBrick(brick: Brick) {
  if (!brick.alive) return;
  brick.alive = false;
  state.bricksRemaining -= 1;
  state.score += state.pointsPerBrick;
  emitEvent({ type: "BRICK_BROKEN", gameId: GAME_ID, payload: { score: state.score } });

  if (!state.clearedRows.has(brick.row)) {
    const rowCleared = !state.bricks.some((b) => b.alive && b.row === brick.row);
    if (rowCleared) {
      state.clearedRows.add(brick.row);
      emitEvent({ type: "ROW_CLEARED", gameId: GAME_ID });
    }
  }

  if (state.bricksRemaining <= 0) {
    endGame(true);
  }
}

function update(dt: number) {
  if (!state.running) return;
  const leftDown = input.isDown(controls.left) || input.isDown(controls.altLeft);
  const rightDown = input.isDown(controls.right) || input.isDown(controls.altRight);
  const move = (rightDown ? 1 : 0) - (leftDown ? 1 : 0);
  if (move !== 0) {
    state.paddle.x += move * state.paddle.speed * dt;
  }
  state.paddle.x = clamp(state.paddle.x, state.play.x, state.play.x + state.play.w - state.paddle.w);

  const launchDown = input.isDown(controls.launch);
  if (state.ball.stuck && launchDown && !state.launchHeld) {
    launchBall();
  }
  state.launchHeld = launchDown;

  if (state.ball.stuck) {
    stickBallToPaddle();
    return;
  }

  state.ball.x += state.ball.vx * dt;
  state.ball.y += state.ball.vy * dt;

  handleCollisions();
  state.flash = Math.max(0, state.flash - dt * 2);
}

function handleCollisions() {
  const ball = state.ball;
  const play = state.play;
  if (ball.x - ball.r <= play.x) {
    ball.x = play.x + ball.r;
    ball.vx = Math.abs(ball.vx);
  }
  if (ball.x + ball.r >= play.x + play.w) {
    ball.x = play.x + play.w - ball.r;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y - ball.r <= play.y) {
    ball.y = play.y + ball.r;
    ball.vy = Math.abs(ball.vy);
  }
  if (ball.y - ball.r > play.y + play.h) {
    loseLife();
    return;
  }

  if (
    ball.vy > 0 &&
    ball.y + ball.r >= state.paddle.y &&
    ball.y - ball.r <= state.paddle.y + state.paddle.h &&
    ball.x >= state.paddle.x &&
    ball.x <= state.paddle.x + state.paddle.w
  ) {
    const hit = (ball.x - (state.paddle.x + state.paddle.w / 2)) / (state.paddle.w / 2);
    const clampedHit = clamp(hit, -1, 1);
    const angle = clampedHit * (Math.PI / 3);
    ball.vx = Math.sin(angle) * state.ballSpeed;
    ball.vy = -Math.cos(angle) * state.ballSpeed;
    ball.y = state.paddle.y - ball.r - 0.5;
  }

  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (
      ball.x + ball.r < brick.x ||
      ball.x - ball.r > brick.x + brick.w ||
      ball.y + ball.r < brick.y ||
      ball.y - ball.r > brick.y + brick.h
    ) {
      continue;
    }

    const overlapX = Math.min(
      ball.x + ball.r - brick.x,
      brick.x + brick.w - (ball.x - ball.r),
    );
    const overlapY = Math.min(
      ball.y + ball.r - brick.y,
      brick.y + brick.h - (ball.y - ball.r),
    );

    if (overlapX < overlapY) {
      ball.vx *= -1;
    } else {
      ball.vy *= -1;
    }

    breakBrick(brick);
    break;
  }
}

function drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function render() {
  ctx.save();
  ctx.scale(state.dpr, state.dpr);
  ctx.clearRect(0, 0, state.width, state.height);

  const bg = ctx.createLinearGradient(0, 0, state.width, state.height);
  bg.addColorStop(0, "rgba(96,165,250,0.08)");
  bg.addColorStop(0.5, "rgba(251,191,36,0.05)");
  bg.addColorStop(1, "rgba(244,114,182,0.08)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  drawRoundedRect(state.play.x, state.play.y, state.play.w, state.play.h, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  state.bricks.forEach((brick) => {
    if (!brick.alive) return;
    const grad = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.h);
    grad.addColorStop(0, brick.color);
    grad.addColorStop(1, `${brick.color}cc`);
    ctx.fillStyle = grad;
    drawRoundedRect(brick.x, brick.y, brick.w, brick.h, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  const paddleGrad = ctx.createLinearGradient(
    state.paddle.x,
    state.paddle.y,
    state.paddle.x + state.paddle.w,
    state.paddle.y,
  );
  paddleGrad.addColorStop(0, theme.colors.secondary);
  paddleGrad.addColorStop(1, theme.colors.primary);
  ctx.fillStyle = paddleGrad;
  drawRoundedRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h, 10);
  ctx.fill();

  const ballGlow = ctx.createRadialGradient(
    state.ball.x - state.ball.r * 0.4,
    state.ball.y - state.ball.r * 0.4,
    state.ball.r * 0.2,
    state.ball.x,
    state.ball.y,
    state.ball.r,
  );
  ballGlow.addColorStop(0, "#ffffff");
  ballGlow.addColorStop(1, theme.colors.accent);
  ctx.fillStyle = ballGlow;
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  renderHUD();
}

function renderHUD() {
  ui.innerHTML = "";
  ui.appendChild(overlay);
  const destroyed = state.totalBricks - state.bricksRemaining;
  const hudTop = document.createElement("div");
  hudTop.className = "hud";
  hudTop.innerHTML = `
    <div class="chip">Score <strong>${state.score}</strong></div>
    <div class="chip">Briques <strong>${destroyed}/${state.totalBricks}</strong></div>
    <div class="chip ghost">Vies <span>${state.lives}</span></div>
    <div class="chip ghost">Record <span>${state.best}</span></div>
  `;
  ui.appendChild(hudTop);

  const hudBottom = document.createElement("div");
  hudBottom.className = "hud bottom";
  hudBottom.innerHTML = `
    <div class="pill ${state.ball.stuck ? "glow" : ""}">${
      state.ball.stuck ? "Pret a lancer" : "Balle en jeu"
    }</div>
    <div class="pill ghost">${state.ball.stuck ? "Espace pour lancer" : "Garde le rythme"}</div>
  `;
  ui.appendChild(hudBottom);
}

function showOverlay(title: string, body: string, showStart = true, lastScore?: number) {
  mobileControls.hide();
  overlay.style.display = "grid";
  ui.style.pointerEvents = "auto";
  canvas.style.pointerEvents = "none";
  const controlsList = (config?.uiText.controls || [])
    .map((item) => `<span class="chip ghost">${item}</span>`)
    .join("");
  overlay.innerHTML = `
    <div class="panel">
      <p class="pill">${config?.uiText.title || "Casse-briques"}</p>
      <h2>${title}</h2>
      ${lastScore !== undefined ? `<p class="muted">Score ${lastScore}</p>` : ""}
      <p class="muted">${body}</p>
      <div class="panel-actions">
        ${showStart ? `<button class="btn" id="start-btn">Lancer</button>` : ""}
        <a class="btn ghost" href="${withBasePath("/", import.meta.env.BASE_URL)}">Hub</a>
      </div>
      <div class="inline-metrics">
        <div><span>Record</span><strong>${state.best}</strong></div>
        <div><span>Vies</span><strong>${state.lives}</strong></div>
        <div><span>Briques</span><strong>${state.bricksRemaining}/${state.totalBricks}</strong></div>
      </div>
      <div class="controls">${controlsList}</div>
    </div>
  `;
  document.getElementById("start-btn")?.addEventListener("click", startGame);
}

resize();
window.addEventListener("resize", resize);

buildBricks();
state.paddle.x = state.play.x + (state.play.w - state.paddle.w) / 2;
resetBall();

showOverlay(config?.uiText.title || "Casse-briques", config?.uiText.help || "");
render();
