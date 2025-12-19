import{a as H,b as z,d as K,e as W,g as R,f as Y,o as Q,w as C,c as Z,u as O,h as ee,r as se,i as te,j as G,A as ae}from"./index-Bc-Kp7-P.js";import{s as ne,g as oe,c as B,a as ie,l as ce}from"./cloud-DWN9NUvT.js";const M=document.getElementById("app"),b=H(),k=z(),D=K(),N=W();let y="hub",v=R(),q=v.save.globalLevel,o=oe(),j="",P="all",w=!1;function _(){var n;const e=o.user;if(!e)return"connecté";const s=(n=e.user_metadata)==null?void 0:n.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}Y();F(V(b.hubTheme));ne(e=>{o=e,g()});Q("ACHIEVEMENT_UNLOCKED",e=>{var n;const s=(n=e.payload)==null?void 0:n.achievementId,t=k.achievements.find(c=>c.id===s);t&&m(`Succès débloqué : ${t.title}`,"success"),s===ae.achievementId&&L()});function V(e){return e?N.find(s=>s.id===e):N[0]}function F(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function m(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function U(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function I(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),n=Math.floor(s%3600/60),c=s%60;return t?`${t}h ${n}m`:n?`${n}m ${c}s`:`${c}s`}function X(e,s){const t=e.trim()||"Joueur",n=s.trim()||"🎮",c=o.user?v.save.playerProfile.name:t;O(p=>{p.playerProfile.name=c.slice(0,18),p.playerProfile.avatar=n.slice(0,4)}),L()}function re(){const e=ee(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),n=document.createElement("a");n.href=t,n.download="nintendo-hub-save.json",n.click(),URL.revokeObjectURL(t),m("Sauvegarde exportée","success")}function le(e){const s=G(e);s.success?(m("Import réussi","success"),L()):m(s.error||"Import impossible","error")}function J(e){e?(se(e),m(`Progression de ${e} réinitialisée`,"info")):(te(),m("Progression globale réinitialisée","info")),L()}function de(e){O(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),L()}async function ue(){const e=R();await ie(e.save)?(v=e,m("Sauvegarde envoyée sur le cloud","success")):o.error&&m(o.error,"error")}async function ve(){const e=await ce();e!=null&&e.state?(G(JSON.stringify(e.state)),m("Sauvegarde cloud importée","success"),L()):e!=null&&e.error&&m(e.error,"error")}function pe(){return`
    <nav class="nav">
      <button class="nav-btn ${y==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${y==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${y==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function me(e){return Z(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${C("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function ge(){var a;const e=v.save,s=e.achievementsUnlocked.length,t=k.achievements.length,n=e.globalLevel>q,c=`--progress:${v.levelProgress*100}%`,p=I(e.globalStats.timePlayedMs),h=e.globalStats.totalSessions,f=e.playerProfile.lastPlayedGameId&&((a=b.games.find(d=>d.id===e.playerProfile.lastPlayedGameId))==null?void 0:a.title);q=e.globalLevel;const $=C("/apps/profil/"),S=o.user?`<span class="chip success">Cloud : ${_()}</span>`:o.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          <div class="avatar">${e.playerProfile.avatar||"🎮"}</div>
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${f?`Dernier jeu : ${f}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${S}
              <span class="chip">⏱ ${p}</span>
              <span class="chip">🎮 ${h} sessions</span>
            </div>
          </div>
        </div>
        <div class="stat-grid compact">
          <div class="stat-card">
            <p class="label">Niveau</p>
            <strong>${e.globalLevel}</strong>
            <p class="muted small">${e.globalXP} XP</p>
          </div>
          <div class="stat-card">
            <p class="label">Succès</p>
            <strong>${s}/${t}</strong>
            <p class="muted small">Schema v${e.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${p}</strong>
            <p class="muted small">Sessions ${h}</p>
          </div>
        </div>
      </div>
      <div class="actions hero-actions">
        <a class="btn primary" href="${$}">Ouvrir le profil</a>
        <button class="btn ghost" id="go-saves">Voir les saves</button>
      </div>
      ${me(e)}
      <div class="level-row ${n?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${c}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(v.levelProgress*100)}% · ${v.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `}function he(){const e=b.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(v.save.favorites||[]),t=Array.from(new Set(b.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,d)=>a.localeCompare(d,"fr")),n=j.trim().toLowerCase(),c=j.replace(/"/g,"&quot;"),p=b.games.filter(a=>w?s.has(a.id):!0).filter(a=>P==="all"?!0:(a.tags||[]).includes(P)).filter(a=>n?a.title.toLowerCase().includes(n)||a.description.toLowerCase().includes(n)||a.id.toLowerCase().includes(n):!0).sort((a,d)=>{const r=Number(s.has(d.id))-Number(s.has(a.id));return r!==0?r:(a.order??0)-(d.order??0)}),h=p.map(a=>{D.find(u=>u.id===a.id)||e.push(`Config manquante pour ${a.id}`);const r=v.save.games[a.id],T=r!=null&&r.lastPlayedAt?U(r.lastPlayedAt):"Jamais",x=(r==null?void 0:r.bestScore)??null,A=I(r==null?void 0:r.timePlayedMs),i=C(`/apps/games/${a.id}/`),l=s.has(a.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${a.previewEmoji||"🎮"} ${a.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${l?"active":""}" data-game="${a.id}" title="${l?"Retirer des favoris":"Ajouter aux favoris"}">
                ${l?"★":"☆"}
              </button>
              <span class="muted">MAJ ${a.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${a.description}</p>
          <div class="tags">${a.tags.map(u=>`<span class="tag">${u}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${A}</span>
            <span class="chip ghost">🏆 ${x??"—"}</span>
            <span class="chip ghost">🕘 ${T}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${i}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),f=w||P!=="all"||!!n,$=p.length,S=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h2>Choisis ton mini-jeu</h2>
        </div>
      </div>
      <div class="filters">
        <div class="filter search">
          <span class="search-icon">🔎</span>
          <input
            id="search-games"
            type="text"
            placeholder="Rechercher un jeu par nom ou description…"
            value="${c}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${P==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(a=>`<button class="chip-btn ${a===P?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${w?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${$}/${b.games.length} jeux</span>
          ${f?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${S}
      <div class="grid">${h||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function fe(){const e=new Set(v.save.achievementsUnlocked),s=k.achievements.map(t=>`
        <article class="card achievement ${e.has(t.id)?"unlocked":""}">
          <div class="pill accent">${t.icon||"⭐️"}</div>
          <div>
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p class="muted">${be(t)}</p>
          </div>
          <div class="reward">+${t.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${k.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function be(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:s.type==="playerXpName"?`${s.xp} XP et pseudo "${s.name}"`:""}function ye(){return o.ready?o.user?`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Connecté</h2>
            <p class="muted">Identifiant : ${_()}</p>
          </div>
          <span class="chip ghost">Dernière sync ${o.lastSyncedAt?U(o.lastSyncedAt):"Jamais"}</span>
        </div>
        <div class="actions wrap">
          <button class="btn primary" id="cloud-save" ${o.loading?"disabled":""}>Sauvegarder vers cloud</button>
          <button class="btn ghost" id="cloud-load" ${o.loading?"disabled":""}>Charger depuis cloud</button>
          <button class="btn ghost danger" id="cloud-logout" ${o.loading?"disabled":""}>Déconnexion</button>
        </div>
        ${o.message?`<p class="status ok">${o.message}</p>`:'<p class="status info">Synchronise tes saves entre appareils.</p>'}
        ${o.error?`<p class="status error">${o.error}</p>`:""}
      </section>
    `:`
    <section class="card cloud">
      <div class="section-head">
        <div>
          <p class="eyebrow">Cloud</p>
          <h2>Supabase</h2>
          <p class="muted small">Créé pour rester optionnel : invité/local ou compte cloud.</p>
        </div>
      </div>
      <div class="profile-form two-cols">
        <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
        <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
      </div>
      <div class="actions wrap">
        <button class="btn primary" id="cloud-login" ${o.loading?"disabled":""}>Connexion</button>
        <button class="btn ghost" id="cloud-register" ${o.loading?"disabled":""}>Créer un compte</button>
      </div>
      ${o.error?`<p class="status error">${o.error}</p>`:`<p class="status info">Aucune donnée n'est envoyée sans action manuelle.</p>`}
    </section>
  `:`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Supabase</h2>
            <p class="muted">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer la synchro.</p>
          </div>
          <span class="chip warning">Inactif</span>
        </div>
      </section>
    `}function $e(){const e=v.save,t=Object.entries(e.games).map(([n,c])=>`
        <div class="save-row">
          <div>
            <strong>${n}</strong>
            <p class="muted">v${c.saveSchemaVersion} · Dernier : ${U(c.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${I(c.timePlayedMs)}</span>
            <button class="btn ghost reset-game" data-game="${n}">Reset</button>
          </div>
        </div>
      `).join("");return`
    <div class="panel-grid">
      <section class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Saves</p>
            <h2>Gestion</h2>
            <p class="muted">Schema v${e.schemaVersion}</p>
          </div>
          <div class="actions">
            <button class="btn ghost" id="export-save">Exporter</button>
            <button class="btn ghost danger" id="reset-save">Reset global</button>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${I(e.globalStats.timePlayedMs)}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Jeux joués</p>
            <strong>${Object.keys(e.games).length}/${b.games.length}</strong>
          </div>
          <div class="stat-card">
            <p class="label">Sessions</p>
            <strong>${e.globalStats.totalSessions}</strong>
          </div>
        </div>
        <label class="import">
          Import JSON
          <textarea id="import-text" placeholder="Colle ici ta sauvegarde"></textarea>
          <button class="btn primary" id="import-btn">Importer</button>
        </label>
      </section>
      ${ye()}
    </div>
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Par jeu</p>
          <h2>Saves détaillées</h2>
        </div>
      </div>
      <div class="save-list">
        ${t||"<p class='muted'>Aucune save par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function g(){if(!o.user){const e=C("/apps/profil/"),s=C("/apps/auth/");M.innerHTML=`
      <div class="layout">
        <header class="card hero">
          <div class="hero-glow"></div>
          <div class="hero-top">
            <div class="profile">
              <div class="avatar">🎮</div>
              <div>
                <p class="eyebrow">Arcade Galaxy</p>
                <h1>Connexion requise</h1>
                <p class="muted">Un compte cloud est obligatoire pour accéder au hub et lancer les jeux. Identifiant + mot de passe (pas d'email nécessaire).</p>
                <div class="chips">
                  <span class="chip warning">Cloud : non connecté</span>
                  <span class="chip ghost">Saves verrouillées</span>
                </div>
              </div>
            </div>
          </div>
          <div class="actions hero-actions">
            <a class="btn primary" href="${e}">Se connecter / Créer un compte</a>
            <a class="btn ghost" href="${s}">Page connexion dédiée</a>
          </div>
          <p class="muted small hero-note">La connexion se fait depuis la page Profil (formulaire Supabase).</p>
        </header>
      </div>
    `;return}M.innerHTML=`
    <div class="layout">
      ${pe()}
      ${ge()}
      ${y==="hub"?he():""}
      ${y==="achievements"?fe():""}
      ${y==="saves"?$e():""}
    </div>
  `,Se()}function Se(){var A;document.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{y=i.dataset.tab,g()})});const e=document.getElementById("player-name"),s=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>X(e.value,(s==null?void 0:s.value)||"🎮")),s==null||s.addEventListener("change",()=>X((e==null?void 0:e.value)||"Joueur",s.value)),(A=document.getElementById("go-saves"))==null||A.addEventListener("click",()=>{y="saves",g()}),document.querySelectorAll(".help-btn").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.help,u=D.find(E=>E.id===l);u&&m(u.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.game;l&&de(l)})});const t=document.getElementById("export-save");t==null||t.addEventListener("click",re);const n=document.getElementById("reset-save");n==null||n.addEventListener("click",()=>J()),document.querySelectorAll(".reset-game").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.game;J(l)})});const c=document.getElementById("import-btn"),p=document.getElementById("import-text");c==null||c.addEventListener("click",()=>p&&le(p.value));const h=document.getElementById("cloud-login"),f=document.getElementById("cloud-register"),$=document.getElementById("cloud-logout"),S=document.getElementById("cloud-save"),a=document.getElementById("cloud-load");h==null||h.addEventListener("click",async()=>{var u,E;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",l=((E=document.getElementById("cloud-password"))==null?void 0:E.value)||"";await B("login",{identifier:i,password:l})}),f==null||f.addEventListener("click",async()=>{var u,E;const i=((u=document.getElementById("cloud-identifier"))==null?void 0:u.value)||"",l=((E=document.getElementById("cloud-password"))==null?void 0:E.value)||"";await B("register",{identifier:i,password:l})}),$==null||$.addEventListener("click",async()=>{await B("logout")}),S==null||S.addEventListener("click",ue),a==null||a.addEventListener("click",ve);const d=document.getElementById("search-games"),r=document.getElementById("filter-fav"),T=Array.from(document.querySelectorAll(".chip-btn[data-category]")),x=document.getElementById("clear-filters");d==null||d.addEventListener("input",()=>{j=d.value,g()}),T.forEach(i=>{i.addEventListener("click",()=>{P=i.dataset.category||"all",g()})}),r==null||r.addEventListener("click",()=>{w=!w,g()}),x==null||x.addEventListener("click",()=>{j="",P="all",w=!1,g()})}function L(){v=R(),F(V(b.hubTheme)),g()}g();
