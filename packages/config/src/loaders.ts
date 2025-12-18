import { z } from "zod";
import achievementsRaw from "../../../configs/achievements.json";
import registryRaw from "../../../configs/games.registry.json";
import rewardsRaw from "../../../configs/progression.rewards.json";
import xpRaw from "../../../configs/progression.xp.json";
import {
  Achievement,
  AchievementsConfig,
  GameConfig,
  GameRegistryItem,
  GamesRegistry,
  RewardsConfig,
  ThemeConfig,
  XPConfig,
} from "./types";

const gameConfigFiles = import.meta.glob("../../../configs/games/*.config.json", {
  eager: true,
  import: "default",
});

const themeFiles = import.meta.glob("../../../configs/themes/*.json", {
  eager: true,
  import: "default",
});

const gameSchema = z.object({
  id: z.string(),
  saveSchemaVersion: z.number(),
  themeId: z.string().optional(),
  xpRules: z.record(z.number()),
  uiText: z.object({
    title: z.string(),
    shortDescription: z.string(),
    help: z.string(),
    controls: z.array(z.string()),
  }),
  difficultyParams: z.record(z.number()),
  input: z.object({
    keys: z.record(z.string()),
  }),
  rewards: z
    .object({
      event: z.record(z.number()),
    })
    .optional(),
});

const registrySchema = z.object({
  hubTheme: z.string().optional(),
  games: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      themeId: z.string().optional(),
      previewEmoji: z.string().optional(),
      order: z.number().optional(),
      lastUpdated: z.string().optional(),
    }),
  ),
});

const achievementsSchema = z.object({
  achievements: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
      condition: z.union([
        z.object({ type: z.literal("eventCount"), event: z.string(), count: z.number() }),
        z.object({ type: z.literal("xpReached"), xp: z.number() }),
        z.object({ type: z.literal("gamesPlayed"), count: z.number() }),
        z.object({ type: z.literal("streak"), event: z.string(), count: z.number() }),
      ]),
      rewardXP: z.number().optional(),
    }),
  ),
});

const xpSchema = z.object({
  levels: z.array(z.object({ level: z.number(), requiredXP: z.number() })),
});

const rewardsSchema = z.object({
  defaults: z.record(z.number()),
});

function safeParse<T>(schema: z.ZodType<T>, data: unknown, label: string, fallback: T): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error(`[config] Invalid ${label}`, parsed.error);
    return fallback;
  }
  return parsed.data;
}

export function getRegistry(): GamesRegistry {
  return safeParse(registrySchema, registryRaw, "games.registry", { games: [] });
}

export function getGameConfigs(): GameConfig[] {
  const configs: GameConfig[] = [];
  Object.entries(gameConfigFiles).forEach(([path, mod]) => {
    try {
      const validated = safeParse(gameSchema, mod as any, path, null as any);
      if (validated) {
        configs.push(validated);
      }
    } catch (err) {
      console.error(`Game config error in ${path}`, err);
    }
  });
  return configs;
}

export function getGameConfig(id: string): GameConfig | undefined {
  return getGameConfigs().find((cfg) => cfg.id === id);
}

export function getThemes(): ThemeConfig[] {
  return Object.values(themeFiles)
    .map((mod, idx) => ({ mod, idx }))
    .map(({ mod, idx }) => ({ ...(mod as any), idx }))
    .filter((theme) => theme.id && theme.name) as ThemeConfig[];
}

export function getXPConfig(): XPConfig {
  return safeParse(xpSchema, xpRaw, "progression.xp", { levels: [{ level: 1, requiredXP: 0 }] });
}

export function getRewardsConfig(): RewardsConfig {
  return safeParse(rewardsSchema, rewardsRaw, "progression.rewards", { defaults: {} });
}

export function getAchievementsConfig(): AchievementsConfig {
  return safeParse(achievementsSchema, achievementsRaw, "achievements", { achievements: [] });
}

export function getAchievementList(): Achievement[] {
  return getAchievementsConfig().achievements;
}
