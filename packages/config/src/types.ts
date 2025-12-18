export type ThemeConfig = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  gradient?: string;
};

export type GameRegistryItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  themeId?: string;
  previewEmoji?: string;
  order?: number;
  lastUpdated?: string;
};

export type GamesRegistry = {
  hubTheme?: string;
  games: GameRegistryItem[];
};

export type GameConfig = {
  id: string;
  saveSchemaVersion: number;
  themeId?: string;
  xpRules: Record<string, number>;
  uiText: {
    title: string;
    shortDescription: string;
    help: string;
    controls: string[];
  };
  difficultyParams: Record<string, number>;
  input: {
    keys: Record<string, string>;
  };
  rewards?: {
    event?: Record<string, number>;
  };
};

export type XPLevel = {
  level: number;
  requiredXP: number;
};

export type XPConfig = {
  levels: XPLevel[];
};

export type RewardsConfig = {
  defaults: Record<string, number>;
};

export type AchievementCondition =
  | { type: "eventCount"; event: string; count: number }
  | { type: "xpReached"; xp: number }
  | { type: "gamesPlayed"; count: number }
  | { type: "streak"; event: string; count: number }
  | { type: "playerXpName"; xp: number; name: string };

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  condition: AchievementCondition;
  rewardXP?: number;
};

export type AchievementsConfig = {
  achievements: Achievement[];
};
