import{g as P,b as k,o as w,u as C,a as j,c as A,r as T,i as R}from"./index-1ZKvUn09.js";import{g as U,a as B,b as q,c as J,w as N}from"./loaders-BqXlQhzP.js";const X=document.getElementById("app"),p=U(),m=B(),x=q(),h=J();let c="hub",r=P(),f=r.save.globalLevel;k();S(E(p.hubTheme));w("ACHIEVEMENT_UNLOCKED",e=>{var s;const t=(s=e.payload)==null?void 0:s.achievementId,a=m.achievements.find(n=>n.id===t);a&&l(`Succès débloqué : ${a.title}`,"success")});function E(e){return e?h.find(t=>t.id===e):h[0]}function S(e){if(!e)return;const t=document.documentElement.style;t.setProperty("--color-primary",e.colors.primary),t.setProperty("--color-secondary",e.colors.secondary),t.setProperty("--color-accent",e.colors.accent),t.setProperty("--color-bg",e.colors.background),t.setProperty("--color-surface",e.colors.surface),t.setProperty("--color-text",e.colors.text),t.setProperty("--color-muted",e.colors.muted),e.gradient&&t.setProperty("--hero-gradient",e.gradient)}function l(e,t="info"){const a=document.createElement("div");a.className=`toast ${t}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("visible")),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>a.remove(),300)},2600)}function L(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function y(e,t){const a=e.trim()||"Joueur",s=t.trim()||"🎮";C(n=>{n.playerProfile.name=a.slice(0,18),n.playerProfile.avatar=s.slice(0,4)}),b()}function I(){const e=j(),t=new Blob([e],{type:"application/json"}),a=URL.createObjectURL(t),s=document.createElement("a");s.href=a,s.download="nintendo-hub-save.json",s.click(),URL.revokeObjectURL(a),l("Sauvegarde exportée","success")}function D(e){const t=R(e);t.success?(l("Import réussi","success"),b()):l(t.error||"Import impossible","error")}function $(e){e?(A(e),l(`Progression de ${e} réinitialisée`,"info")):(T(),l("Progression globale réinitialisée","info")),b()}function G(){return`
    <nav class="nav">
      <button class="nav-btn ${c==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${c==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${c==="saves"?"active":""}" data-tab="saves">Saves</button>
    </nav>
  `}function M(){const e=r.save,t=e.achievementsUnlocked.length,a=m.achievements.length,s=e.globalLevel>f,n=`--progress:${r.levelProgress*100}%`;return f=e.globalLevel,`
    <section class="card hero">
      <div class="hero-top">
        <div class="avatar">${e.playerProfile.avatar||"🎮"}</div>
        <div class="hero-text">
          <p class="eyebrow">Profil</p>
          <h1>${e.playerProfile.name||"Joueur"}</h1>
          <p class="subtitle">Niveau ${e.globalLevel} · ${e.globalXP} XP</p>
        </div>
        <div class="stats-pill">
          <span>${t}/${a} succès</span>
          <span>Schema v${e.schemaVersion}</span>
        </div>
      </div>
      <div class="level-row ${s?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${n}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(r.levelProgress*100)}% · ${r.nextLevelXP-e.globalXP} XP restants</div>
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
    </section>
  `}function O(){const e=p.games.length?[]:["games.registry.json vide ou invalide"],t=p.games.slice().sort((s,n)=>(s.order??0)-(n.order??0)).map(s=>{x.find(v=>v.id===s.id)||e.push(`Config manquante pour ${s.id}`);const o=r.save.games[s.id],i=o!=null&&o.lastPlayedAt?L(o.lastPlayedAt):"Jamais",d=(o==null?void 0:o.bestScore)??null,u=N(`/apps/games/${s.id}/`);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill">${s.previewEmoji||"🎮"} ${s.title}</div>
            <span class="muted">MAJ ${s.lastUpdated||"N/A"}</span>
          </div>
          <p class="game-desc">${s.description}</p>
          <div class="tags">${s.tags.map(v=>`<span class="tag">${v}</span>`).join("")}</div>
          <div class="game-meta">
            <div><span class="label">Dernière partie</span><strong>${i}</strong></div>
            <div><span class="label">Meilleur score</span><strong>${d??"—"}</strong></div>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${u}" data-game="${s.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${s.id}">Aide</button>
          </div>
        </article>
      `}).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h2>Choisis ton mini-jeu</h2>
        </div>
      </div>
      ${e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:""}
      <div class="grid">${t}</div>
    </section>
  `}function H(){const e=new Set(r.save.achievementsUnlocked),t=m.achievements.map(a=>`
        <article class="card achievement ${e.has(a.id)?"unlocked":""}">
          <div class="pill">${a.icon||"⭐️"}</div>
          <div>
            <h3>${a.title}</h3>
            <p>${a.description}</p>
            <p class="muted">${V(a)}</p>
          </div>
          <div class="reward">+${a.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${m.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${t}</div>
    </section>
  `}function V(e){const t=e.condition;return t.type==="eventCount"?`${t.count}x ${t.event}`:t.type==="xpReached"?`${t.xp} XP globaux`:t.type==="gamesPlayed"?`${t.count} jeux différents`:t.type==="streak"?`${t.count} ${t.event} d'affilée`:""}function F(){const e=r.save,a=Object.entries(e.games).map(([s,n])=>`
        <div class="save-row">
          <div>
            <strong>${s}</strong>
            <p class="muted">v${n.saveSchemaVersion} · Dernier : ${L(n.lastPlayedAt)}</p>
          </div>
          <button class="btn ghost reset-game" data-game="${s}">Reset</button>
        </div>
      `).join("");return`
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
      <label class="import">
        Import JSON
        <textarea id="import-text" placeholder="Colle ici ta sauvegarde"></textarea>
        <button class="btn primary" id="import-btn">Importer</button>
      </label>
      <div class="save-list">
        ${a||"<p class='muted'>Aucune save par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function g(){X.innerHTML=`
    <div class="layout">
      ${G()}
      ${c==="hub"?M()+O():""}
      ${c==="achievements"?H():""}
      ${c==="saves"?F():""}
    </div>
  `,z()}function z(){document.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{c=i.dataset.tab,g()})});const e=document.getElementById("player-name"),t=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>y(e.value,(t==null?void 0:t.value)||"🎮")),t==null||t.addEventListener("change",()=>y((e==null?void 0:e.value)||"Joueur",t.value)),document.querySelectorAll(".help-btn").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.help,u=x.find(v=>v.id===d);u&&l(u.uiText.help,"info")})});const a=document.getElementById("export-save");a==null||a.addEventListener("click",I);const s=document.getElementById("reset-save");s==null||s.addEventListener("click",()=>$()),document.querySelectorAll(".reset-game").forEach(i=>{i.addEventListener("click",()=>{const d=i.dataset.game;$(d)})});const n=document.getElementById("import-btn"),o=document.getElementById("import-text");n==null||n.addEventListener("click",()=>o&&D(o.value))}function b(){r=P(),S(E(p.hubTheme)),g()}g();
