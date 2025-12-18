import "./style.css";
import { emitEvent, onEvent } from "@core/events";
import { withBasePath } from "@core/utils";
import {
  getAchievementsConfig,
  getGameConfigs,
  getRegistry,
  getThemes,
  ThemeConfig,
} from "@config";
import { attachProgressionListener, getProgressionSnapshot } from "@progression";
import { exportSave, importSave, resetGameSave, resetSave, updateSave } from "@storage";

type Tab = "hub" | "achievements" | "saves";

const app = document.getElementById("app")!;
const registry = getRegistry();
const achievementsConfig = getAchievementsConfig();
const gameConfigs = getGameConfigs();
const themes = getThemes();
const basePath = import.meta.env.BASE_URL || "/";

let activeTab: Tab = "hub";
let snapshot = getProgressionSnapshot();
let lastLevel = snapshot.save.globalLevel;

attachProgressionListener();
applyTheme(findTheme(registry.hubTheme));

onEvent("ACHIEVEMENT_UNLOCKED", (event) => {
  const achievementId = event.payload?.achievementId;
  const achievement = achievementsConfig.achievements.find((a) => a.id === achievementId);
  if (achievement) {
    showToast(`Succès débloqué : ${achievement.title}`, "success");
  }
});

function findTheme(id?: string): ThemeConfig | undefined {
  if (id) return themes.find((t) => t.id === id);
  return themes[0];
}

function applyTheme(theme?: ThemeConfig) {
  if (!theme) return;
  const root = document.documentElement.style;
  root.setProperty("--color-primary", theme.colors.primary);
  root.setProperty("--color-secondary", theme.colors.secondary);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-bg", theme.colors.background);
  root.setProperty("--color-surface", theme.colors.surface);
  root.setProperty("--color-text", theme.colors.text);
  root.setProperty("--color-muted", theme.colors.muted);
  if (theme.gradient) {
    root.setProperty("--hero-gradient", theme.gradient);
  }
}

function showToast(message: string, variant: "success" | "error" | "info" = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${variant}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function formatDate(timestamp?: number) {
  if (!timestamp) return "Jamais";
  return new Date(timestamp).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function handleProfileChange(name: string, avatar: string) {
  const trimmedName = name.trim() || "Joueur";
  const trimmedAvatar = avatar.trim() || "🎮";
  updateSave((state) => {
    state.playerProfile.name = trimmedName.slice(0, 18);
    state.playerProfile.avatar = trimmedAvatar.slice(0, 4);
  });
  refresh();
}

function handleExport() {
  const data = exportSave();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nintendo-hub-save.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Sauvegarde exportée", "success");
}

function handleImport(text: string) {
  const result = importSave(text);
  if (result.success) {
    showToast("Import réussi", "success");
    refresh();
  } else {
    showToast(result.error || "Import impossible", "error");
  }
}

function handleReset(gameId?: string) {
  if (gameId) {
    resetGameSave(gameId);
    showToast(`Progression de ${gameId} réinitialisée`, "info");
  } else {
    resetSave();
    showToast("Progression globale réinitialisée", "info");
  }
  refresh();
}

function renderNav() {
  return `
    <nav class="nav">
      <button class="nav-btn ${activeTab === "hub" ? "active" : ""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${activeTab === "achievements" ? "active" : ""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${activeTab === "saves" ? "active" : ""}" data-tab="saves">Saves</button>
    </nav>
  `;
}

function renderProfileCard() {
  const save = snapshot.save;
  const unlocked = save.achievementsUnlocked.length;
  const total = achievementsConfig.achievements.length;
  const levelUp = save.globalLevel > lastLevel;
  const xpBarStyle = `--progress:${snapshot.levelProgress * 100}%`;
  lastLevel = save.globalLevel;

  return `
    <section class="card hero">
      <div class="hero-top">
        <div class="avatar">${save.playerProfile.avatar || "🎮"}</div>
        <div class="hero-text">
          <p class="eyebrow">Profil</p>
          <h1>${save.playerProfile.name || "Joueur"}</h1>
          <p class="subtitle">Niveau ${save.globalLevel} · ${save.globalXP} XP</p>
        </div>
        <div class="stats-pill">
          <span>${unlocked}/${total} succès</span>
          <span>Schema v${save.schemaVersion}</span>
        </div>
      </div>
      <div class="level-row ${levelUp ? "level-up" : ""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${xpBarStyle}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(snapshot.levelProgress * 100)}% · ${snapshot.nextLevelXP - save.globalXP} XP restants</div>
      </div>
      <div class="profile-form">
        <label>
          Pseudo
          <input id="player-name" type="text" value="${save.playerProfile.name}" maxlength="18" />
        </label>
        <label>
          Avatar (emoji)
          <input id="player-avatar" type="text" value="${save.playerProfile.avatar}" maxlength="4" />
        </label>
      </div>
    </section>
  `;
}

function renderGameGrid() {
  const errors: string[] = registry.games.length ? [] : ["games.registry.json vide ou invalide"];
  const cards = registry.games
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((game) => {
      const config = gameConfigs.find((cfg) => cfg.id === game.id);
      if (!config) {
        errors.push(`Config manquante pour ${game.id}`);
      }
      const save = snapshot.save.games[game.id];
      const lastPlayed = save?.lastPlayedAt ? formatDate(save.lastPlayedAt) : "Jamais";
      const bestScore = save?.bestScore ?? null;
      const gameLink = withBasePath(`/apps/games/${game.id}/`, basePath);
      return `
        <article class="card game-card">
          <div class="card-top">
            <div class="pill">${game.previewEmoji || "🎮"} ${game.title}</div>
            <span class="muted">MAJ ${game.lastUpdated || "N/A"}</span>
          </div>
          <p class="game-desc">${game.description}</p>
          <div class="tags">${game.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          <div class="game-meta">
            <div><span class="label">Dernière partie</span><strong>${lastPlayed}</strong></div>
            <div><span class="label">Meilleur score</span><strong>${bestScore ?? "—"}</strong></div>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${gameLink}" data-game="${game.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${game.id}">Aide</button>
          </div>
        </article>
      `;
    })
    .join("");

  const errorBox = errors.length
    ? `<div class="alert">Configs manquantes : ${errors.join(", ")}</div>`
    : "";

  return `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h2>Choisis ton mini-jeu</h2>
        </div>
      </div>
      ${errorBox}
      <div class="grid">${cards}</div>
    </section>
  `;
}

function renderAchievements() {
  const unlocked = new Set(snapshot.save.achievementsUnlocked);
  const list = achievementsConfig.achievements
    .map((ach) => {
      const isUnlocked = unlocked.has(ach.id);
      return `
        <article class="card achievement ${isUnlocked ? "unlocked" : ""}">
          <div class="pill">${ach.icon || "⭐️"}</div>
          <div>
            <h3>${ach.title}</h3>
            <p>${ach.description}</p>
            <p class="muted">${describeCondition(ach)}</p>
          </div>
          <div class="reward">+${ach.rewardXP ?? 0} XP</div>
        </article>
      `;
    })
    .join("");

  return `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${unlocked.size} / ${achievementsConfig.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${list}</div>
    </section>
  `;
}

function describeCondition(achievement: (typeof achievementsConfig.achievements)[number]) {
  const c = achievement.condition as any;
  if (c.type === "eventCount") return `${c.count}x ${c.event}`;
  if (c.type === "xpReached") return `${c.xp} XP globaux`;
  if (c.type === "gamesPlayed") return `${c.count} jeux différents`;
  if (c.type === "streak") return `${c.count} ${c.event} d'affilée`;
  return "";
}

function renderSaves() {
  const save = snapshot.save;
  const games = Object.entries(save.games);
  const gameRows = games
    .map(([id, game]) => {
      return `
        <div class="save-row">
          <div>
            <strong>${id}</strong>
            <p class="muted">v${game.saveSchemaVersion} · Dernier : ${formatDate(game.lastPlayedAt)}</p>
          </div>
          <button class="btn ghost reset-game" data-game="${id}">Reset</button>
        </div>
      `;
    })
    .join("");

  return `
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Saves</p>
          <h2>Gestion</h2>
          <p class="muted">Schema v${save.schemaVersion}</p>
        </div>
        <div class="actions">
          <button class="btn ghost" id="export-save">Exporter</button>
          <button class="btn ghost danger" id="reset-save">Reset global</button>
        </div>
      </div>
      <label class="import">
        Import JSON
        <textarea id="import-text" placeholder="Colle ici ta sauvegarde"></textarea>
        <button class="btn primary" id="import-btn">Importer</button>
      </label>
      <div class="save-list">
        ${gameRows || "<p class='muted'>Aucune save par jeu pour le moment.</p>"}
      </div>
    </section>
  `;
}

function renderHub() {
  app.innerHTML = `
    <div class="layout">
      ${renderNav()}
      ${activeTab === "hub" ? renderProfileCard() + renderGameGrid() : ""}
      ${activeTab === "achievements" ? renderAchievements() : ""}
      ${activeTab === "saves" ? renderSaves() : ""}
    </div>
  `;

  wireEvents();
}

function wireEvents() {
  document.querySelectorAll<HTMLButtonElement>(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab as Tab;
      renderHub();
    });
  });

  const nameInput = document.getElementById("player-name") as HTMLInputElement | null;
  const avatarInput = document.getElementById("player-avatar") as HTMLInputElement | null;
  nameInput?.addEventListener("change", () =>
    handleProfileChange(nameInput.value, avatarInput?.value || "🎮"),
  );
  avatarInput?.addEventListener("change", () =>
    handleProfileChange(nameInput?.value || "Joueur", avatarInput.value),
  );

  document.querySelectorAll<HTMLButtonElement>(".help-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.help!;
      const config = gameConfigs.find((g) => g.id === id);
      if (config) {
        showToast(config.uiText.help, "info");
      }
    });
  });

  const exportBtn = document.getElementById("export-save");
  exportBtn?.addEventListener("click", handleExport);

  const resetBtn = document.getElementById("reset-save");
  resetBtn?.addEventListener("click", () => handleReset());

  document.querySelectorAll<HTMLButtonElement>(".reset-game").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.game!;
      handleReset(id);
    });
  });

  const importBtn = document.getElementById("import-btn");
  const importText = document.getElementById("import-text") as HTMLTextAreaElement | null;
  importBtn?.addEventListener("click", () => importText && handleImport(importText.value));
}

function refresh() {
  snapshot = getProgressionSnapshot();
  applyTheme(findTheme(registry.hubTheme));
  renderHub();
}

renderHub();
