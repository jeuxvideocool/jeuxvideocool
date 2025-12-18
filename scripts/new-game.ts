import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const gameId = process.argv[2];

if (!gameId) {
  console.error(chalk.red("Usage: pnpm new:game <id>"));
  process.exit(1);
}

const safeId = gameId.trim().toLowerCase();
if (!/^[a-z0-9-_]+$/.test(safeId)) {
  console.error(chalk.red("L'id doit contenir uniquement des lettres, chiffres, - ou _."));
  process.exit(1);
}

const templateDir = path.join(root, "apps", "games", "_template");
const targetDir = path.join(root, "apps", "games", safeId);
const configTemplatePath = path.join(root, "configs", "games", "_template.config.json");
const configTargetPath = path.join(root, "configs", "games", `${safeId}.config.json`);
const registryPath = path.join(root, "configs", "games.registry.json");

if (fs.existsSync(targetDir)) {
  console.error(chalk.red(`apps/games/${safeId} existe déjà.`));
  process.exit(1);
}

if (!fs.existsSync(templateDir)) {
  console.error(chalk.red("Template apps/games/_template introuvable."));
  process.exit(1);
}

fs.cpSync(templateDir, targetDir, { recursive: true });

const mainPath = path.join(targetDir, "src", "main.ts");
if (fs.existsSync(mainPath)) {
  const content = fs.readFileSync(mainPath, "utf-8");
  fs.writeFileSync(mainPath, content.replace(/__GAME_ID__/g, safeId), "utf-8");
}

const indexPath = path.join(targetDir, "index.html");
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, "utf-8");
  fs.writeFileSync(
    indexPath,
    content.replace(/Game Template/gi, `Jeu ${safeId}`).replace(/Template/gi, safeId),
    "utf-8",
  );
}

const configTemplate = JSON.parse(fs.readFileSync(configTemplatePath, "utf-8"));
configTemplate.id = safeId;
fs.writeFileSync(configTargetPath, JSON.stringify(configTemplate, null, 2));

const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
registry.games = registry.games || [];
if (registry.games.some((g: any) => g.id === safeId)) {
  console.error(chalk.red("Cet id est déjà présent dans games.registry.json"));
  process.exit(1);
}

registry.games.push({
  id: safeId,
  title: `Nouveau jeu ${safeId}`,
  description: "Ajoute une description",
  tags: [],
  previewEmoji: "🎮",
});
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));

console.log(chalk.green(`Jeu ${safeId} créé.`));
console.log(chalk.gray(`- Dossier : apps/games/${safeId}`));
console.log(chalk.gray(`- Config : configs/games/${safeId}.config.json`));
