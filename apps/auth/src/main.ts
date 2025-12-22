import "./style.css";
import { withBasePath } from "@core/utils";
import { getProgressionSnapshot } from "@progression";
import {
  connectCloud,
  getAuthState,
  saveCloud,
  subscribe as subscribeCloud,
} from "@storage/cloud";

const basePath = import.meta.env.BASE_URL || "/";
const app = document.getElementById("app")!;

let cloudState = getAuthState();

subscribeCloud((state) => {
  cloudState = state;
  render();
});

function showToast(message: string, variant: "success" | "error" | "info" = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${variant}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 240);
  }, 2400);
}

function formatCloudIdentity(user?: any): string {
  if (!user) return "connecté";
  const metaId = user.user_metadata?.identifier;
  const email = user.email as string | undefined;
  if (metaId) return metaId;
  if (email?.endsWith("@user.local")) return email.replace("@user.local", "");
  return email || "connecté";
}

function render() {
  const profilLink = withBasePath("/apps/profil/", basePath);
  const hubLink = withBasePath("/", basePath);
  const supaStatus = cloudState.user
    ? `Connecté : ${formatCloudIdentity(cloudState.user)}`
    : cloudState.ready
      ? "Connexion requise"
      : "Supabase non configuré (.env)";

  app.innerHTML = `
    <div class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">Arcade Galaxy</p>
          <h1>Compte cloud obligatoire</h1>
          <p class="muted">Connecte-toi ou crée un compte (identifiant + mot de passe) pour accéder au hub et aux jeux. Les saves sont synchronisées via Supabase.</p>
          <div class="chips">
            <span class="chip ${cloudState.user ? "success" : "warning"}">${supaStatus}</span>
          </div>
        </div>
        <div class="hero-card">
          <div class="avatar">🎮</div>
          <p class="muted small">Connexion requise pour poursuivre.</p>
          <div class="hero-actions">
            <a class="btn ghost" href="${profilLink}">Profil</a>
            <a class="btn ghost" href="${hubLink}">Hub</a>
          </div>
        </div>
      </header>

      <main class="grid single">
        <section class="card cloud">
          <div class="section-head">
            <div>
              <p class="eyebrow">Connexion</p>
              <h2>Compte Supabase</h2>
              <p class="muted small">Identifiant + mot de passe requis pour continuer.</p>
            </div>
            <span class="pill accent">Cloud</span>
          </div>

          ${
            !cloudState.ready
              ? `<div class="status error">Configure VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer la connexion.</div>`
              : cloudState.user
                ? `<div class="status ok">Connecté : ${formatCloudIdentity(cloudState.user)}</div>
                   <p class="muted small">La synchro s'enclenche automatiquement dès qu'une sauvegarde change.</p>
                   <div class="actions wrap">
                     <button class="btn primary" id="cloud-sync" ${cloudState.loading ? "disabled" : ""}>Forcer une sync</button>
                     <a class="btn ghost" href="${hubLink}">Aller au hub</a>
                     <button class="btn ghost danger" id="cloud-logout" ${cloudState.loading ? "disabled" : ""}>Déconnexion</button>
                   </div>
                   ${
                     cloudState.message
                       ? `<p class="status info">${cloudState.message}</p>`
                       : `<p class="status info">Dernière sync : ${
                           cloudState.lastSyncedAt
                             ? new Date(cloudState.lastSyncedAt).toLocaleString("fr-FR", {
                                 dateStyle: "medium",
                                 timeStyle: "short",
                               })
                             : "Jamais"
                         }</p>`
                   }
                   ${cloudState.error ? `<p class="status error">${cloudState.error}</p>` : ""}`
                : `<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions wrap">
                       <button class="btn primary" id="cloud-login" ${cloudState.loading ? "disabled" : ""}>Connexion</button>
                       <button class="btn ghost" id="cloud-register" ${cloudState.loading ? "disabled" : ""}>Créer un compte</button>
                     </div>
                   </div>
                   ${
                     cloudState.error
                       ? `<p class="status error">${cloudState.error}</p>`
                       : `<p class="status info">Compte utilisé uniquement pour la sauvegarde cloud (pas d'email requis).</p>`
                   }`
          }
        </section>
      </main>

      <section class="card info">
        <div class="info-grid">
          <div>
            <p class="eyebrow">Clair et simple</p>
            <h3>Compte requis</h3>
            <p class="muted">Connexion obligatoire : toutes les saves passent par le cloud Supabase pour rester synchronisées.</p>
          </div>
          <div class="bullets">
            <div class="bullet">🚀 Synchro auto dès qu'une save change.</div>
            <div class="bullet">🔒 Identifiant + mot de passe (pas d'email requis).</div>
            <div class="bullet">📤 Export/Import possibles depuis la page Profil.</div>
          </div>
        </div>
      </section>
    </div>
  `;

  wire();
}

function wire() {
  const loginBtn = document.getElementById("cloud-login");
  const registerBtn = document.getElementById("cloud-register");
  const logoutBtn = document.getElementById("cloud-logout");
  const syncBtn = document.getElementById("cloud-sync");

  loginBtn?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("cloud-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("login", { identifier, password });
  });

  registerBtn?.addEventListener("click", async () => {
    const identifier =
      (document.getElementById("cloud-identifier") as HTMLInputElement | null)?.value || "";
    const password =
      (document.getElementById("cloud-password") as HTMLInputElement | null)?.value || "";
    await connectCloud("register", { identifier, password });
  });

  logoutBtn?.addEventListener("click", async () => {
    await connectCloud("logout");
    showToast("Déconnecté du cloud", "info");
  });

  syncBtn?.addEventListener("click", async () => {
    const current = getProgressionSnapshot();
    const ok = await saveCloud(current.save);
    showToast(ok ? "Sauvegarde envoyée" : cloudState.error || "Erreur cloud", ok ? "success" : "error");
  });
}

render();
