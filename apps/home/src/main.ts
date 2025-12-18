import "./style.css";
import { withBasePath } from "@core/utils";
import { getRegistry } from "@config";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;
const registry = getRegistry();

const hubLink = withBasePath("/apps/hub_de_jeux/", basePath);
const profileLink = withBasePath("/apps/profil/", basePath);

const games = registry.games.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 3);

app.innerHTML = `
  <div class="shell">
    <header class="hero">
      <div class="badge">Arcade Galaxy</div>
      <h1>Mini-jeux, XP et succès <span class="gradient">en un seul hub</span></h1>
      <p>Découvre les mini-jeux, suis ta progression et débloque des succès. Zéro inscription, les données restent sur ton appareil.</p>
      <div class="actions">
        <a class="btn primary" href="${hubLink}">Hub de jeux</a>
        <a class="btn ghost" href="${profileLink}">Profil</a>
      </div>
    </header>
    <section class="games">
      <div class="section-head">
        <p class="eyebrow">Aperçu</p>
        <h2>Jeux en vedette</h2>
      </div>
      <div class="grid">
        ${games
          .map(
            (g) => `
          <article class="card">
            <div class="pill">${g.previewEmoji || "🎮"} ${g.title}</div>
            <p class="muted">${g.description}</p>
            <div class="tags">${g.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
            <a class="btn ghost" href="${withBasePath(`/apps/games/${g.id}/`, basePath)}">Jouer</a>
          </article>
        `,
          )
          .join("")}
      </div>
    </section>
  </div>
`;
