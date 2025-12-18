import "./style.css";
import { withBasePath } from "@core/utils";
import { ALEX_SECRET, canAccessAlexPage, getProgressionSnapshot } from "@progression";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;

const snapshot = getProgressionSnapshot();
const save = snapshot.save;

if (!canAccessAlexPage(save)) {
  window.location.replace(withBasePath("/", basePath));
} else {
  const perks = [
    "31 000 XP = 31 bougies, donc on souffle tout en une seule respiration.",
    "Un buff +31 en bonne humeur appliqué automatiquement pendant 24h.",
    "Droit officiel de chambrer le reste de l'équipe sur leurs petits niveaux.",
  ];

  const punchlines = [
    "On ne vieillit pas, on up un skill tree secret.",
    "Les 31 ans, c'est juste la saison 31 de la série « Alex est trop stylée ».",
    "Le gâteau est littéralement un drop légendaire, ne le laisse pas filer.",
  ];

  const backLink = withBasePath("/", basePath);
  const profileLink = withBasePath("/apps/profil/", basePath);

  app.innerHTML = `
    <div class="wrap">
      <header class="hero-card">
        <div class="halo"></div>
        <div class="hero-copy">
          <span class="pill">Succès secret · ${ALEX_SECRET.minXP} XP</span>
          <h1>${save.playerProfile.avatar} Joyeux 31, Alex !</h1>
          <p>
            ${punchlines[Math.floor(Math.random() * punchlines.length)]}
            Merci d'être la joueuse qui transforme chaque partie en souvenir doré.
          </p>
          <div class="cta-row">
            <a class="btn primary" href="${backLink}">Retour au hub</a>
            <a class="btn ghost" href="${profileLink}">Voir ton profil</a>
          </div>
        </div>
        <div class="card-badge">
          <p class="label">XP actuel</p>
          <strong>${save.globalXP.toLocaleString("fr-FR")} XP</strong>
          <p class="muted">Pseudo validé : ${save.playerProfile.name}</p>
        </div>
      </header>

      <section class="grid">
        <article class="card">
          <div class="pill ghost">Bonus d'anniversaire</div>
          <ul class="perks">
            ${perks.map((perk) => `<li><span>🎁</span>${perk}</li>`).join("")}
          </ul>
        </article>

        <article class="card vibes">
          <div class="pill ghost">Message intergalactique</div>
          <p class="vibe">
            Dans ce hub, ${save.playerProfile.name} est officiellement la boss ultime des 31. Continue de spammer tes éclats de rire,
            ça fait crit sur tout le monde.
          </p>
          <div class="callout">PS : si quelqu'un demande, c'est un Easter egg codé rien que pour toi.</div>
        </article>

        <article class="card mini">
          <div class="pill ghost">À garder</div>
          <div class="mini-list">
            <div><span class="tag">⚡️</span>Un vœu prioritaire dans le hub</div>
            <div><span class="tag">🎉</span>Un high-five cosmique réservé</div>
            <div><span class="tag">🧁</span>Le dernier bout de gâteau t'appartient</div>
          </div>
        </article>
      </section>
    </div>
  `;
}
