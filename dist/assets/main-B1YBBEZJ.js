import{g as I,a as O,o as X,u as N,e as F,r as V,b as _,i as J}from"./index-niTdxgfr.js";import{g as H,a as z,b as K,c as Y,w as Q}from"./loaders-CNHm-dlv.js";import{g as W,c as k,s as Z,l as ee,a as se}from"./cloud-B4CuE7-U.js";const te=document.getElementById("app"),b=H(),x=z(),q=K(),B=Y();let y="hub",v=I(),M=v.save.globalLevel,n=W(),j="",L="all",w=!1;O();G(D(b.hubTheme));se(e=>{n=e,f()});X("ACHIEVEMENT_UNLOCKED",e=>{var o;const s=(o=e.payload)==null?void 0:o.achievementId,t=x.achievements.find(l=>l.id===s);t&&p(`Succès débloqué : ${t.title}`,"success")});function D(e){return e?B.find(s=>s.id===e):B[0]}function G(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function p(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function T(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function A(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),o=Math.floor(s%3600/60),l=s%60;return t?`${t}h ${o}m`:o?`${o}m ${l}s`:`${l}s`}function R(e,s){const t=e.trim()||"Joueur",o=s.trim()||"🎮";N(l=>{l.playerProfile.name=t.slice(0,18),l.playerProfile.avatar=o.slice(0,4)}),C()}function ae(){const e=F(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),o=document.createElement("a");o.href=t,o.download="nintendo-hub-save.json",o.click(),URL.revokeObjectURL(t),p("Sauvegarde exportée","success")}function oe(e){const s=J(e);s.success?(p("Import réussi","success"),C()):p(s.error||"Import impossible","error")}function U(e){e?(V(e),p(`Progression de ${e} réinitialisée`,"info")):(_(),p("Progression globale réinitialisée","info")),C()}function ne(e){N(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),C()}async function le(){const e=I();await Z(e.save)?(v=e,p("Sauvegarde envoyée sur le cloud","success")):n.error&&p(n.error,"error")}async function ie(){const e=await ee();e!=null&&e.state?(J(JSON.stringify(e.state)),p("Sauvegarde cloud importée","success"),C()):e!=null&&e.error&&p(e.error,"error")}function ce(){return`
    <nav class="nav">
      <button class="nav-btn ${y==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${y==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${y==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function re(){var d;const e=v.save,s=e.achievementsUnlocked.length,t=x.achievements.length,o=e.globalLevel>M,l=`--progress:${v.levelProgress*100}%`,$=A(e.globalStats.timePlayedMs),m=e.globalStats.totalSessions,g=e.playerProfile.lastPlayedGameId&&((d=b.games.find(i=>i.id===e.playerProfile.lastPlayedGameId))==null?void 0:d.title);M=e.globalLevel;const a=n.user?`<span class="chip success">Cloud : ${n.user.email||"connecté"}</span>`:n.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          <div class="avatar">${e.playerProfile.avatar||"🎮"}</div>
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${g?`Dernier jeu : ${g}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${a}
              <span class="chip">⏱ ${$}</span>
              <span class="chip">🎮 ${m} sessions</span>
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
            <strong>${$}</strong>
            <p class="muted small">Sessions ${m}</p>
          </div>
        </div>
      </div>
      <div class="level-row ${o?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${l}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(v.levelProgress*100)}% · ${v.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <div class="profile-form">
        <label>
          Pseudo
          <input id="player-name" type="text" value="${e.playerProfile.name}" maxlength="18" />
        </label>
        <label>
          Avatar (emoji)
          <input id="player-avatar" type="text" value="${e.playerProfile.avatar}" maxlength="4" />
        </label>
      </div>
    </header>
  `}function de(){const e=b.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(v.save.favorites||[]),t=Array.from(new Set(b.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,d)=>a.localeCompare(d,"fr")),o=j.trim().toLowerCase(),l=j.replace(/"/g,"&quot;"),m=b.games.filter(a=>w?s.has(a.id):!0).filter(a=>L==="all"?!0:(a.tags||[]).includes(L)).filter(a=>o?a.title.toLowerCase().includes(o)||a.description.toLowerCase().includes(o)||a.id.toLowerCase().includes(o):!0).sort((a,d)=>{const i=Number(s.has(d.id))-Number(s.has(a.id));return i!==0?i:(a.order??0)-(d.order??0)}).map(a=>{q.find(u=>u.id===a.id)||e.push(`Config manquante pour ${a.id}`);const i=v.save.games[a.id],S=i!=null&&i.lastPlayedAt?T(i.lastPlayedAt):"Jamais",E=(i==null?void 0:i.bestScore)??null,P=A(i==null?void 0:i.timePlayedMs),c=Q(`/apps/games/${a.id}/`),r=s.has(a.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${a.previewEmoji||"🎮"} ${a.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${r?"active":""}" data-game="${a.id}" title="${r?"Retirer des favoris":"Ajouter aux favoris"}">
                ${r?"★":"☆"}
              </button>
              <span class="muted">MAJ ${a.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${a.description}</p>
          <div class="tags">${a.tags.map(u=>`<span class="tag">${u}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${P}</span>
            <span class="chip ghost">🏆 ${E??"—"}</span>
            <span class="chip ghost">🕘 ${S}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${c}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),g=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h2>Choisis ton mini-jeu</h2>
        </div>
      </div>
      <div class="filters">
        <label class="filter search">
          <input id="search-games" type="text" placeholder="Rechercher par nom..." value="${l}" />
        </label>
        <label class="filter">
          <select id="category-filter">
            <option value="all">Toutes les catégories</option>
            ${t.map(a=>`<option value="${a}" ${a===L?"selected":""}>${a}</option>`).join("")}
          </select>
        </label>
        <button class="btn ghost filter-toggle ${w?"active":""}" id="filter-fav">
          ${w?"★":"☆"} Favoris
        </button>
      </div>
      ${g}
      <div class="grid">${m||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function ue(){const e=new Set(v.save.achievementsUnlocked),s=x.achievements.map(t=>`
        <article class="card achievement ${e.has(t.id)?"unlocked":""}">
          <div class="pill accent">${t.icon||"⭐️"}</div>
          <div>
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p class="muted">${ve(t)}</p>
          </div>
          <div class="reward">+${t.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${x.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function ve(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:""}function pe(){return n.ready?n.user?`
      <section class="card cloud">
        <div class="section-head">
          <div>
            <p class="eyebrow">Cloud</p>
            <h2>Connecté</h2>
            <p class="muted">${n.user.email||"Compte sans email"}</p>
          </div>
          <span class="chip ghost">Dernière sync ${n.lastSyncedAt?T(n.lastSyncedAt):"Jamais"}</span>
        </div>
        <div class="actions wrap">
          <button class="btn primary" id="cloud-save" ${n.loading?"disabled":""}>Sauvegarder vers cloud</button>
          <button class="btn ghost" id="cloud-load" ${n.loading?"disabled":""}>Charger depuis cloud</button>
          <button class="btn ghost danger" id="cloud-logout" ${n.loading?"disabled":""}>Déconnexion</button>
        </div>
        ${n.message?`<p class="status ok">${n.message}</p>`:'<p class="status info">Synchronise tes saves entre appareils.</p>'}
        ${n.error?`<p class="status error">${n.error}</p>`:""}
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
        <label>Email <input id="cloud-email" type="email" placeholder="mail@example.com" /></label>
        <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
      </div>
      <div class="actions wrap">
        <button class="btn primary" id="cloud-login" ${n.loading?"disabled":""}>Connexion</button>
        <button class="btn ghost" id="cloud-register" ${n.loading?"disabled":""}>Créer un compte</button>
      </div>
      ${n.error?`<p class="status error">${n.error}</p>`:`<p class="status info">Aucune donnée n'est envoyée sans action manuelle.</p>`}
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
    `}function me(){const e=v.save,t=Object.entries(e.games).map(([o,l])=>`
        <div class="save-row">
          <div>
            <strong>${o}</strong>
            <p class="muted">v${l.saveSchemaVersion} · Dernier : ${T(l.lastPlayedAt)}</p>
          </div>
          <div class="row-meta">
            <span class="chip ghost">⏱ ${A(l.timePlayedMs)}</span>
            <button class="btn ghost reset-game" data-game="${o}">Reset</button>
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
            <strong>${A(e.globalStats.timePlayedMs)}</strong>
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
      ${pe()}
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
  `}function f(){te.innerHTML=`
    <div class="layout">
      ${ce()}
      ${re()}
      ${y==="hub"?de():""}
      ${y==="achievements"?ue():""}
      ${y==="saves"?me():""}
    </div>
  `,ge()}function ge(){document.querySelectorAll(".nav-btn").forEach(c=>{c.addEventListener("click",()=>{y=c.dataset.tab,f()})});const e=document.getElementById("player-name"),s=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>R(e.value,(s==null?void 0:s.value)||"🎮")),s==null||s.addEventListener("change",()=>R((e==null?void 0:e.value)||"Joueur",s.value)),document.querySelectorAll(".help-btn").forEach(c=>{c.addEventListener("click",()=>{const r=c.dataset.help,u=q.find(h=>h.id===r);u&&p(u.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(c=>{c.addEventListener("click",()=>{const r=c.dataset.game;r&&ne(r)})});const t=document.getElementById("export-save");t==null||t.addEventListener("click",ae);const o=document.getElementById("reset-save");o==null||o.addEventListener("click",()=>U()),document.querySelectorAll(".reset-game").forEach(c=>{c.addEventListener("click",()=>{const r=c.dataset.game;U(r)})});const l=document.getElementById("import-btn"),$=document.getElementById("import-text");l==null||l.addEventListener("click",()=>$&&oe($.value));const m=document.getElementById("cloud-login"),g=document.getElementById("cloud-register"),a=document.getElementById("cloud-logout"),d=document.getElementById("cloud-save"),i=document.getElementById("cloud-load");m==null||m.addEventListener("click",async()=>{var u,h;const c=((u=document.getElementById("cloud-email"))==null?void 0:u.value)||"",r=((h=document.getElementById("cloud-password"))==null?void 0:h.value)||"";await k("login",{email:c,password:r})}),g==null||g.addEventListener("click",async()=>{var u,h;const c=((u=document.getElementById("cloud-email"))==null?void 0:u.value)||"",r=((h=document.getElementById("cloud-password"))==null?void 0:h.value)||"";await k("register",{email:c,password:r})}),a==null||a.addEventListener("click",async()=>{await k("logout")}),d==null||d.addEventListener("click",le),i==null||i.addEventListener("click",ie);const S=document.getElementById("search-games"),E=document.getElementById("category-filter"),P=document.getElementById("filter-fav");S==null||S.addEventListener("input",()=>{j=S.value,f()}),E==null||E.addEventListener("change",()=>{L=E.value,f()}),P==null||P.addEventListener("click",()=>{w=!w,f()})}function C(){v=I(),G(D(b.hubTheme)),f()}f();
