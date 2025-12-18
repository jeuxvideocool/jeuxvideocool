import { z } from "zod";

export const CURRENT_SCHEMA_VERSION = 1;
export const LOCAL_STORAGE_KEY = "nintendo-hub-save";

export type GameSaveState = {
  saveSchemaVersion: number;
  state: Record<string, any>;
  lastPlayedAt?: number;
  bestScore?: number;
};

export type SaveState = {
  schemaVersion: number;
  playerProfile: {
    name: string;
    avatar: string;
    lastPlayedGameId?: string;
  };
  globalXP: number;
  globalLevel: number;
  achievementsUnlocked: string[];
  globalStats: {
    events: Record<string, number>;
    gamesPlayed: number;
    totalSessions: number;
    streaks: Record<string, number>;
  };
  games: Record<string, GameSaveState>;
};

const GameSaveSchema = z.object({
  saveSchemaVersion: z.number().int().default(1),
  state: z.record(z.any()).default({}),
  lastPlayedAt: z.number().optional(),
  bestScore: z.number().optional(),
});

const SaveSchema = z.object({
  schemaVersion: z.number().int().default(CURRENT_SCHEMA_VERSION),
  playerProfile: z
    .object({
      name: z.string(),
      avatar: z.string(),
      lastPlayedGameId: z.string().optional(),
    })
    .default({ name: "Joueur", avatar: "🎮" }),
  globalXP: z.number().default(0),
  globalLevel: z.number().default(1),
  achievementsUnlocked: z.array(z.string()).default([]),
  globalStats: z
    .object({
      events: z.record(z.number()).default({}),
      gamesPlayed: z.number().default(0),
      totalSessions: z.number().default(0),
      streaks: z.record(z.number()).default({}),
    })
    .default({ events: {}, gamesPlayed: 0, totalSessions: 0, streaks: {} }),
  games: z.record(GameSaveSchema).default({}),
});

export function createEmptySave(): SaveState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    playerProfile: { name: "Joueur", avatar: "🎮" },
    globalXP: 0,
    globalLevel: 1,
    achievementsUnlocked: [],
    globalStats: {
      events: {},
      gamesPlayed: 0,
      totalSessions: 0,
      streaks: {},
    },
    games: {},
  };
}

function migrateSave(save: SaveState): SaveState {
  let current = { ...save };
  if (!current.schemaVersion || current.schemaVersion < 1) {
    current.schemaVersion = 1;
  }
  // Future migrations will go here.
  return current;
}

export function loadSave(): SaveState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return createEmptySave();
    const parsed = JSON.parse(raw);
    const validated = SaveSchema.parse(parsed);
    return migrateSave(validated);
  } catch (err) {
    console.warn("Corrupt save detected, resetting.", err);
    return createEmptySave();
  }
}

export function persistSave(state: SaveState) {
  const payload = { ...state, schemaVersion: CURRENT_SCHEMA_VERSION };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
}

export function updateSave(mutator: (state: SaveState) => void): SaveState {
  const state = loadSave();
  mutator(state);
  persistSave(state);
  return state;
}

export function exportSave(): string {
  const state = loadSave();
  return JSON.stringify(state, null, 2);
}

export function importSave(json: string): { success: boolean; error?: string; state?: SaveState } {
  try {
    const parsed = JSON.parse(json);
    const validated = SaveSchema.parse(parsed);
    const migrated = migrateSave(validated);
    persistSave(migrated);
    return { success: true, state: migrated };
  } catch (err: any) {
    return { success: false, error: err?.message || "Import invalide" };
  }
}

export function resetSave() {
  const empty = createEmptySave();
  persistSave(empty);
  return empty;
}

export function resetGameSave(gameId: string) {
  return updateSave((state) => {
    delete state.games[gameId];
  });
}

export function getGameState(state: SaveState, gameId: string, saveSchemaVersion = 1): GameSaveState {
  if (!state.games[gameId]) {
    state.games[gameId] = { saveSchemaVersion, state: {} };
  }
  return state.games[gameId];
}

export function touchLastPlayed(state: SaveState, gameId: string) {
  state.playerProfile.lastPlayedGameId = gameId;
  const gameState = getGameState(state, gameId);
  gameState.lastPlayedAt = Date.now();
}

export function updateGameState(
  gameId: string,
  saveSchemaVersion: number,
  mutator: (game: GameSaveState) => void,
) {
  return updateSave((state) => {
    const gs = getGameState(state, gameId, saveSchemaVersion);
    gs.saveSchemaVersion = saveSchemaVersion;
    mutator(gs);
    touchLastPlayed(state, gameId);
  });
}
