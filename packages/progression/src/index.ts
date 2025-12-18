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

function applyAchievements(state: SaveState, event: GameEvent, achievements: AchievementsConfig["achievements"]) {
  achievements.forEach((achievement) => {
    if (state.achievementsUnlocked.includes(achievement.id)) return;
    const condition = achievement.condition;
    let unlocked = false;
    if (condition.type === "eventCount") {
      const count = state.globalStats.events[condition.event] ?? 0;
      unlocked = count >= condition.count;
    } else if (condition.type === "xpReached") {
      unlocked = state.globalXP >= condition.xp;
    } else if (condition.type === "gamesPlayed") {
      const uniqueGames = Object.keys(state.games).length;
      unlocked = uniqueGames >= condition.count;
    } else if (condition.type === "streak") {
      const streak = state.globalStats.streaks[condition.event] ?? 0;
      unlocked = streak >= condition.count;
    }

    if (unlocked) {
      state.achievementsUnlocked.push(achievement.id);
      if (achievement.rewardXP) {
        state.globalXP += achievement.rewardXP;
      }
      emitEvent({ type: "ACHIEVEMENT_UNLOCKED", payload: { achievementId: achievement.id } });
    }
  });
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
  const state = updateSave((draft) => {
    applyEventToState(draft, event);
    applyAchievements(draft, event, ctx.achievements);
    applyLevelFromXP(draft);
  });
  return state;
}

export function attachProgressionListener() {
  onEvent("*", (event) => {
    handleProgressionEvent(event);
  });
}

export function getProgressionSnapshot(): ProgressionSnapshot {
  const save = loadSave();
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
