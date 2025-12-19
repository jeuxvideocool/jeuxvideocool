import{a as F,b as H,d as z,e as K,g as B,f as W,o as Y,w as M,c as Q,u as J,h as Z,r as ee,i as te,j as X,A as se}from"./index-DUQ7dej_.js";import{s as ae,g as ne,c as k,a as ie,l as oe}from"./cloud-renlPHrB.js";const U=document.getElementById("app"),h=F(),C=H(),O=z(),N=K();let w="hub",g=B(),R=g.save.globalLevel,u=ne(),T="",S="all",L=!1;function re(){var n;const e=u.user;if(!e)return"connecté";const t=(n=e.user_metadata)==null?void 0:n.identifier,s=e.email;return t||(s!=null&&s.endsWith("@user.local")?s.replace("@user.local",""):s||"connecté")}W();D(_(h.hubTheme));ae(e=>{u=e,E()});Y("ACHIEVEMENT_UNLOCKED",e=>{var n;const t=(n=e.payload)==null?void 0:n.achievementId,s=C.achievements.find(o=>o.id===t);s&&y(`Succès débloqué : ${s.title}`,"success"),t===se.achievementId&&x()});function _(e){return e?N.find(t=>t.id===e):N[0]}function D(e){if(!e)return;const t=document.documentElement.style;t.setProperty("--color-primary",e.colors.primary),t.setProperty("--color-secondary",e.colors.secondary),t.setProperty("--color-accent",e.colors.accent),t.setProperty("--color-bg",e.colors.background),t.setProperty("--color-surface",e.colors.surface),t.setProperty("--color-text",e.colors.text),t.setProperty("--color-muted",e.colors.muted),e.gradient&&t.setProperty("--hero-gradient",e.gradient)}function y(e,t="info"){const s=document.createElement("div");s.className=`toast ${t}`,s.textContent=e,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("visible")),setTimeout(()=>{s.classList.remove("visible"),setTimeout(()=>s.remove(),300)},2600)}function V(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function j(e){if(!e)return"0m";const t=Math.floor(e/1e3),s=Math.floor(t/3600),n=Math.floor(t%3600/60),o=t%60;return s?`${s}h ${n}m`:n?`${n}m ${o}s`:`${o}s`}function I(e){const t=Object.entries(e.games||{});if(!t.length)return{title:"Aucun jeu",duration:"0m"};const[s,n]=t.sort((i,p)=>(p[1].timePlayedMs||0)-(i[1].timePlayedMs||0))[0],o=h.games.find(i=>i.id===s);return{title:(o==null?void 0:o.title)||s,duration:j(n.timePlayedMs)}}function le(e,t){const s=(t||"🎮").slice(0,4);return`<div class="avatar ${e?"has-image":""}">${e?`<img src="${e}" alt="Avatar" />`:s}</div>`}function q(e,t){const s=e.trim()||"Joueur",n=t.trim()||"🎮",o=u.user?g.save.playerProfile.name:s;J(i=>{i.playerProfile.name=o.slice(0,18),i.playerProfile.avatar=n.slice(0,4),i.playerProfile.avatarType=i.playerProfile.avatarUrl?"image":"emoji"}),x()}function ce(){const e=Z(),t=new Blob([e],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download="nintendo-hub-save.json",n.click(),URL.revokeObjectURL(s),y("Sauvegarde exportée","success")}function de(e){const t=X(e);t.success?(y("Import réussi","success"),x()):y(t.error||"Import impossible","error")}function G(e){e?(ee(e),y(`Progression de ${e} réinitialisée`,"info")):(te(),y("Progression globale réinitialisée","info")),x()}function ue(e){J(t=>{const s=new Set(t.favorites||[]);s.has(e)?s.delete(e):s.add(e),t.favorites=Array.from(s)}),x()}async function pe(){const e=B();await ie(e.save)?(g=e,y("Sauvegarde envoyée sur le cloud","success")):u.error&&y(u.error,"error")}async function ve(){const e=await oe();e!=null&&e.state?(X(JSON.stringify(e.state)),y("Sauvegarde cloud importée","success"),x()):e!=null&&e.error&&y(e.error,"error")}function me(){return`
    <nav class="nav">
      <button class="nav-btn ${w==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${w==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${w==="stats"?"active":""}" data-tab="stats">Stats</button>
    </nav>
  `}function ge(e){return Q(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${M("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function fe(){return`
    <div class="layout">
      <header class="card hero auth-gate">
        <div class="hero-glow"></div>
        <div class="hero-top">
          <div class="profile">
            <div class="avatar">🎮</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>Connexion requise</h1>
              <p class="muted">Compte cloud obligatoire pour accéder au hub et lancer les jeux. Identifiant + mot de passe (pas d'email nécessaire).</p>
              <div class="chips">
                <span class="chip ${u.ready?"warning":"error"}">Cloud : ${u.ready?"non connecté":"Supabase non configuré"}</span>
                <span class="chip ghost">Saves verrouillées</span>
              </div>
            </div>
          </div>
        </div>
        ${u.ready?`<div class="gate-form">
                 <label>Identifiant <input id="gate-identifier" type="text" placeholder="mon-pseudo" /></label>
                 <label>Mot de passe <input id="gate-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="gate-actions">
                   <button class="btn primary strong" id="gate-login" ${u.loading?"disabled":""}>Connexion</button>
                   <button class="btn ghost strong" id="gate-register" ${u.loading?"disabled":""}>Créer un compte</button>
                 </div>
                 ${u.error?`<p class="status error">${u.error}</p>`:'<p class="status info">Tes saves seront synchronisées entre appareils.</p>'}
               </div>`:'<p class="status error">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY puis recharge la page.</p>'}
      </header>
    </div>
  `}function he(){var d;const e=g.save,t=e.achievementsUnlocked.length,s=C.achievements.length,n=e.globalLevel>R,o=`--progress:${g.levelProgress*100}%`,i=j(e.globalStats.timePlayedMs),p=e.globalStats.totalSessions,b=e.playerProfile.lastPlayedGameId&&((d=h.games.find(r=>r.id===e.playerProfile.lastPlayedGameId))==null?void 0:d.title);R=e.globalLevel;const $=M("/apps/profil/"),c=I(e),a=u.user?`<span class="chip success">Cloud : ${re()}</span>`:u.ready?'<span class="chip ghost">Mode invité · données locales</span>':'<span class="chip warning">Supabase non configuré (.env)</span>';return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          ${le(e.playerProfile.avatarUrl,e.playerProfile.avatar)}
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${b?`Dernier jeu : ${b}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${a}
              <span class="chip">⏱ ${i}</span>
              <span class="chip">🎮 ${p} sessions</span>
              <a class="btn primary strong profile-inline" href="${$}">Voir le profil</a>
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
            <strong>${t}/${s}</strong>
            <p class="muted small">Schema v${e.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${i}</strong>
            <p class="muted small">Sessions ${p}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${c.title}</strong>
            <p class="muted small">Temps ${c.duration}</p>
          </div>
        </div>
      </div>
      ${ge(e)}
      <div class="level-row ${n?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${o}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(g.levelProgress*100)}% · ${g.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `}function ye(){const e=h.games.length?[]:["games.registry.json vide ou invalide"],t=new Set(g.save.favorites||[]),s=Array.from(new Set(h.games.flatMap(a=>a.tags||[]).filter(Boolean))).sort((a,d)=>a.localeCompare(d,"fr")),n=T.trim().toLowerCase(),o=T.replace(/"/g,"&quot;"),i=h.games.filter(a=>L?t.has(a.id):!0).filter(a=>S==="all"?!0:(a.tags||[]).includes(S)).filter(a=>n?a.title.toLowerCase().includes(n)||a.description.toLowerCase().includes(n)||a.id.toLowerCase().includes(n):!0).sort((a,d)=>{const r=Number(t.has(d.id))-Number(t.has(a.id));return r!==0?r:(a.order??0)-(d.order??0)}),p=i.map(a=>{O.find(f=>f.id===a.id)||e.push(`Config manquante pour ${a.id}`);const r=g.save.games[a.id],A=r!=null&&r.lastPlayedAt?V(r.lastPlayedAt):"Jamais",P=(r==null?void 0:r.bestScore)??null,l=j(r==null?void 0:r.timePlayedMs),v=M(`/apps/games/${a.id}/`),m=t.has(a.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${a.previewEmoji||"🎮"} ${a.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${m?"active":""}" data-game="${a.id}" title="${m?"Retirer des favoris":"Ajouter aux favoris"}">
                ${m?"★":"☆"}
              </button>
              <span class="muted">MAJ ${a.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${a.description}</p>
          <div class="tags">${a.tags.map(f=>`<span class="tag">${f}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${l}</span>
            <span class="chip ghost">🏆 ${P??"—"}</span>
            <span class="chip ghost">🕘 ${A}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${v}" data-game="${a.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${a.id}">Aide</button>
          </div>
        </article>
      `}).join(""),b=L||S!=="all"||!!n,$=i.length,c=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
            value="${o}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${S==="all"?"active":""}" data-category="all">Toutes</button>
          ${s.map(a=>`<button class="chip-btn ${a===S?"active":""}" data-category="${a}">${a}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${L?"active":""}" id="filter-fav">
            ★ Favoris ${t.size?`<span class="badge">${t.size}</span>`:""}
          </button>
          <span class="muted small">${$}/${h.games.length} jeux</span>
          ${b?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${c}
      <div class="grid">${p||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function be(){const e=new Set(g.save.achievementsUnlocked),t=C.achievements.map(s=>`
        <article class="card achievement ${e.has(s.id)?"unlocked":""}">
          <div class="pill accent">${s.icon||"⭐️"}</div>
          <div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <p class="muted">${$e(s)}</p>
          </div>
          <div class="reward">+${s.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${C.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${t}</div>
    </section>
  `}function $e(e){const t=e.condition;return t.type==="eventCount"?`${t.count}x ${t.event}`:t.type==="xpReached"?`${t.xp} XP globaux`:t.type==="gamesPlayed"?`${t.count} jeux différents`:t.type==="streak"?`${t.count} ${t.event} d'affilée`:t.type==="playerXpName"?`${t.xp} XP et pseudo "${t.name}"`:""}function Ee(){var $;const e=g.save,t=Object.entries(e.games||{}),s=Math.max(1,...t.map(([,c])=>Math.max(c.timePlayedMs??0,1))),n=e.achievementsUnlocked.length,o=C.achievements.length,i=t.map(([c,a])=>({id:c,last:a.lastPlayedAt||0})).sort((c,a)=>a.last-c.last)[0],p=i&&i.last?(($=h.games.find(c=>c.id===i.id))==null?void 0:$.title)||i.id:"Aucun jeu",b=t.length===0?"<p class='muted'>Pas encore de données de jeu.</p>":t.map(([c,a])=>{var A;const d=((A=h.games.find(P=>P.id===c))==null?void 0:A.title)||c,r=Math.max(5,Math.round((a.timePlayedMs||0)/s*100));return`
            <div class="chart-row">
              <div>
                <strong>${d}</strong>
                <p class="muted small">${j(a.timePlayedMs)} · ${a.bestScore?`Best ${a.bestScore}`:"Aucun score"} · ${a.lastPlayedAt?V(a.lastPlayedAt):"Jamais"}</p>
              </div>
              <div class="chart-bar">
                <span style="width:${r}%"></span>
              </div>
            </div>
          `}).join("");return`
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Stats</p>
          <h2>Vue d'ensemble</h2>
          <p class="muted">Activité, temps de jeu et progression globale.</p>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-card">
          <p class="label">Temps total</p>
          <strong>${j(e.globalStats.timePlayedMs)}</strong>
          <p class="muted small">${e.globalStats.totalSessions} sessions</p>
        </div>
        <div class="stat-card">
          <p class="label">Jeux joués</p>
          <strong>${Object.keys(e.games).length}/${h.games.length}</strong>
          <p class="muted small">Dernier : ${p}</p>
        </div>
        <div class="stat-card">
          <p class="label">Succès</p>
          <strong>${n}/${o}</strong>
          <p class="muted small">Schema v${e.schemaVersion}</p>
        </div>
        <div class="stat-card">
          <p class="label">Jeu le plus joué</p>
          <strong>${I(e).title}</strong>
          <p class="muted small">${I(e).duration}</p>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Temps par jeu</p>
          <h2>Répartition</h2>
          <p class="muted">Temps passé, scores et derniers lancements.</p>
        </div>
      </div>
      <div class="chart-list">
        ${b}
      </div>
    </section>
  `}function E(){if(!u.user){U.innerHTML=fe(),Pe();return}U.innerHTML=`
    <div class="layout">
      ${me()}
      ${he()}
      ${w==="hub"?ye():""}
      ${w==="achievements"?be():""}
      ${w==="stats"?Ee():""}
    </div>
  `,Se()}function Pe(){const e=document.getElementById("gate-login"),t=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var o,i;const s=((o=document.getElementById("gate-identifier"))==null?void 0:o.value)||"",n=((i=document.getElementById("gate-password"))==null?void 0:i.value)||"";await k("login",{identifier:s,password:n})}),t==null||t.addEventListener("click",async()=>{var o,i;const s=((o=document.getElementById("gate-identifier"))==null?void 0:o.value)||"",n=((i=document.getElementById("gate-password"))==null?void 0:i.value)||"";await k("register",{identifier:s,password:n})})}function Se(){document.querySelectorAll(".nav-btn").forEach(l=>{l.addEventListener("click",()=>{w=l.dataset.tab,E()})});const e=document.getElementById("player-name"),t=document.getElementById("player-avatar");e==null||e.addEventListener("change",()=>q(e.value,(t==null?void 0:t.value)||"🎮")),t==null||t.addEventListener("change",()=>q((e==null?void 0:e.value)||"Joueur",t.value)),document.querySelectorAll(".help-btn").forEach(l=>{l.addEventListener("click",()=>{const v=l.dataset.help,m=O.find(f=>f.id===v);m&&y(m.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(l=>{l.addEventListener("click",()=>{const v=l.dataset.game;v&&ue(v)})});const s=document.getElementById("export-save");s==null||s.addEventListener("click",ce);const n=document.getElementById("reset-save");n==null||n.addEventListener("click",()=>G()),document.querySelectorAll(".reset-game").forEach(l=>{l.addEventListener("click",()=>{const v=l.dataset.game;G(v)})});const o=document.getElementById("import-btn"),i=document.getElementById("import-text");o==null||o.addEventListener("click",()=>i&&de(i.value));const p=document.getElementById("cloud-login"),b=document.getElementById("cloud-register"),$=document.getElementById("cloud-logout"),c=document.getElementById("cloud-save"),a=document.getElementById("cloud-load");p==null||p.addEventListener("click",async()=>{var m,f;const l=((m=document.getElementById("cloud-identifier"))==null?void 0:m.value)||"",v=((f=document.getElementById("cloud-password"))==null?void 0:f.value)||"";await k("login",{identifier:l,password:v})}),b==null||b.addEventListener("click",async()=>{var m,f;const l=((m=document.getElementById("cloud-identifier"))==null?void 0:m.value)||"",v=((f=document.getElementById("cloud-password"))==null?void 0:f.value)||"";await k("register",{identifier:l,password:v})}),$==null||$.addEventListener("click",async()=>{await k("logout")}),c==null||c.addEventListener("click",pe),a==null||a.addEventListener("click",ve);const d=document.getElementById("search-games"),r=document.getElementById("filter-fav"),A=Array.from(document.querySelectorAll(".chip-btn[data-category]")),P=document.getElementById("clear-filters");d==null||d.addEventListener("input",()=>{T=d.value,E()}),A.forEach(l=>{l.addEventListener("click",()=>{S=l.dataset.category||"all",E()})}),r==null||r.addEventListener("click",()=>{L=!L,E()}),P==null||P.addEventListener("click",()=>{T="",S="all",L=!1,E()})}function x(){g=B(),D(_(h.hubTheme)),E()}E();
