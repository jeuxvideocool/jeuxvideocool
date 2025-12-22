import { emitEvent, GameEvent, onEvent } from "@core/events";
import { clamp } from "@core/utils";
import {
  Achievement,
  AchievementsConfig,
  GameConfig,
  GameRegistryItem,
  GamesRegistry,
  RewardsConfig,
  XPConfig,
} from "@config";
import { getAchievementList, getGameConfig, getGameConfigs, getRegistry, getRewardsConfig, getXPConfig } from "@config";
import {
  GameSaveState,
  SaveState,
  getGameState,
  loadSave,
  persistSave,
  touchLastPlayed,
  updateSave,
} from "@storage";

export type ProgressionSnapshot = {
  save: SaveState;
  levelProgress: number;
  currentLevelXP: number;
  nextLevelXP: number;
};

type ProgressionContext = {
  xpConfig: XPConfig;
  rewardsConfig: RewardsConfig;
  achievements: Achievement[];
  registry: GamesRegistry;
  gameConfigs: GameConfig[];
};

const ctx: ProgressionContext = {
  xpConfig: getXPConfig(),
  rewardsConfig: getRewardsConfig(),
  achievements: getAchievementList(),
  registry: getRegistry(),
  gameConfigs: getGameConfigs(),
};

// Prevent double counting when an event is handled directly then emitted on the bus.
const PROGRESSION_HANDLED_FLAG = "__progressionHandled";

function hasProgressionHandled(event: GameEvent): boolean {
  return Boolean((event as any)[PROGRESSION_HANDLED_FLAG]);
}

function markProgressionHandled(event: GameEvent) {
  (event as any)[PROGRESSION_HANDLED_FLAG] = true;
}

export const ALEX_SECRET = {
  achievementId: "alex-birthday-31",
  minXP: 31000,
  requiredName: "alex",
};

export function getGameConfigById(id: string): GameConfig | undefined {
  return ctx.gameConfigs.find((g) => g.id === id) || getGameConfig(id);
}

export function getRegistryEntry(id: string): GameRegistryItem | undefined {
  return ctx.registry.games.find((g) => g.id === id);
}

function xpForEvent(event: GameEvent): number {
  const gameConfig = event.gameId ? getGameConfigById(event.gameId) : undefined;
  if (gameConfig?.xpRules?.[event.type] !== undefined) {
    return gameConfig.xpRules[event.type];
  }
  return ctx.rewardsConfig.defaults[event.type] ?? 0;
}

function computeLevel(xp: number, xpConfig: XPConfig) {
  const sorted = [...xpConfig.levels].sort((a, b) => a.requiredXP - b.requiredXP);
  let level = 1;
  let next = sorted[sorted.length - 1].requiredXP;
  for (let i = 0; i < sorted.length; i++) {
    if (xp >= sorted[i].requiredXP) {
      level = sorted[i].level;
      next = sorted[Math.min(sorted.length - 1, i + 1)].requiredXP;
    }
  }
  const currentLevelXP = sorted.find((l) => l.level === level)?.requiredXP ?? 0;
  const diff = Math.max(next - currentLevelXP, 1);
  const levelProgress = clamp((xp - currentLevelXP) / diff, 0, 1);
  return { level, nextLevelXP: next, currentLevelXP, levelProgress };
}

function isAchievementUnlockedByState(state: SaveState, achievement: Achievement) {
  const condition = achievement.condition as any;
  const normalizedName = state.playerProfile.name?.trim().toLowerCase();

  if (condition.type === "eventCount") {
    const count = state.globalStats.events[condition.event] ?? 0;
    return count >= condition.count;
  }
  if (condition.type === "xpReached") {
    return state.globalXP >= condition.xp;
  }
  if (condition.type === "gamesPlayed") {
    const uniqueGames = Object.keys(state.games).length;
    return uniqueGames >= condition.count;
  }
  if (condition.type === "streak") {
    const streak = state.globalStats.streaks[condition.event] ?? 0;
    return streak >= condition.count;
  }
  if (condition.type === "playerXpName") {
    return state.globalXP >= condition.xp && normalizedName === condition.name.trim().toLowerCase();
  }
  return false;
}

function unlockEligibleAchievements(
  state: SaveState,
  achievements: AchievementsConfig["achievements"],
) {
  achievements.forEach((achievement) => {
    if (state.achievementsUnlocked.includes(achievement.id)) return;
    const unlocked = isAchievementUnlockedByState(state, achievement);
    if (unlocked) {
      state.achievementsUnlocked.push(achievement.id);
      if (achievement.rewardXP) {
        state.globalXP += achievement.rewardXP;
      }
      emitEvent({ type: "ACHIEVEMENT_UNLOCKED", payload: { achievementId: achievement.id } });
    }
  });
}

export function canAccessAlexPage(state: SaveState): boolean {
  const normalizedName = state.playerProfile.name?.trim().toLowerCase();
  const hasAchievement = state.achievementsUnlocked.includes(ALEX_SECRET.achievementId);
  return hasAchievement && state.globalXP >= ALEX_SECRET.minXP && normalizedName === ALEX_SECRET.requiredName;
}

function handleStreaks(state: SaveState, event: GameEvent) {
  if (!state.globalStats.streaks[event.type]) {
    state.globalStats.streaks[event.type] = 0;
  }
  state.globalStats.streaks[event.type] += 1;
  if (event.type === "SESSION_FAIL") {
    state.globalStats.streaks["SESSION_WIN"] = 0;
  }
}

function trackSessionTime(state: SaveState, event: GameEvent, gameState?: GameSaveState) {
  const ts = event.timestamp ?? Date.now();
  if (event.type === "SESSION_START") {
    state.globalStats.currentSessionStartedAt = ts;
    if (gameState) {
      // Close any dangling session to avoid losing time if start is spammed.
      if (gameState.sessionStartedAt && gameState.sessionStartedAt < ts) {
        const delta = ts - gameState.sessionStartedAt;
        gameState.timePlayedMs = (gameState.timePlayedMs ?? 0) + Math.max(0, delta);
        state.globalStats.timePlayedMs = (state.globalStats.timePlayedMs ?? 0) + Math.max(0, delta);
      }
      gameState.sessionStartedAt = ts;
    }
    return;
  }

  if (event.type === "SESSION_WIN" || event.type === "SESSION_FAIL") {
    const start = gameState?.sessionStartedAt ?? state.globalStats.currentSessionStartedAt;
    const duration = start ? Math.max(0, ts - start) : 0;
    state.globalStats.timePlayedMs = (state.globalStats.timePlayedMs ?? 0) + duration;
    if (gameState) {
      gameState.timePlayedMs = (gameState.timePlayedMs ?? 0) + duration;
      gameState.sessionStartedAt = undefined;
    }
    state.globalStats.currentSessionStartedAt = undefined;
  }
}

function applyEventToState(state: SaveState, event: GameEvent) {
  const xpGain = xpForEvent(event);
  if (xpGain > 0) {
    state.globalXP += xpGain;
  }

  if (!state.globalStats.events[event.type]) {
    state.globalStats.events[event.type] = 0;
  }
  state.globalStats.events[event.type] += 1;
  state.globalStats.totalSessions += event.type === "SESSION_START" ? 1 : 0;

  handleStreaks(state, event);

  if (event.gameId) {
    const existed = Boolean(state.games[event.gameId]);
    const gameState: GameSaveState = getGameState(state, event.gameId);
    if (xpGain !== 0) {
      gameState.xpEarned = (gameState.xpEarned ?? 0) + xpGain;
    }
    trackSessionTime(state, event, gameState);
    if (event.type === "SESSION_START") {
      state.globalStats.gamesPlayed += existed ? 0 : 1;
    }
    touchLastPlayed(state, event.gameId);
    if (event.payload?.score !== undefined) {
      const score = Number(event.payload.score);
      if (!gameState.bestScore || score > gameState.bestScore) {
        gameState.bestScore = score;
      }
    }
  }
}

function applyLevelFromXP(state: SaveState) {
  const { level } = computeLevel(state.globalXP, ctx.xpConfig);
  state.globalLevel = level;
}

export function handleProgressionEvent(event: GameEvent): SaveState {
  if (hasProgressionHandled(event)) {
    return loadSave();
  }
  markProgressionHandled(event);
  const state = updateSave((draft) => {
    applyEventToState(draft, event);
    unlockEligibleAchievements(draft, ctx.achievements);
    applyLevelFromXP(draft);
  });
  return state;
}

export function emitProgressionEvent(event: GameEvent): SaveState {
  const state = handleProgressionEvent(event);
  emitEvent(event);
  return state;
}

export function attachProgressionListener() {
  onEvent("*", (event) => {
    handleProgressionEvent(event);
  });
}

export function getProgressionSnapshot(): ProgressionSnapshot {
  const save = loadSave();
  unlockEligibleAchievements(save, ctx.achievements);
  applyLevelFromXP(save);
  const { levelProgress, currentLevelXP, nextLevelXP } = computeLevel(save.globalXP, ctx.xpConfig);
  const snapshot: ProgressionSnapshot = {
    save,
    levelProgress,
    currentLevelXP,
    nextLevelXP,
  };
  persistSave(save);
  return snapshot;
}

export function getXpNeededForNextLevel(xp: number) {
  const { currentLevelXP, nextLevelXP } = computeLevel(xp, ctx.xpConfig);
  return nextLevelXP - xp;
}
