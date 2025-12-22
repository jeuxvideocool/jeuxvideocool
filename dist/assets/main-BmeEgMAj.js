import{a as Re,b as Ne,d as Xe,e as Ge,f as Je,o as Fe,g as fe,w as ye,u as ie,c as Oe,h as De,i as qe,r as He,j as Ve,k as _e,A as ze}from"./index-C0fiPuD6.js";import{s as We,g as Ke,c as V,u as Ye,r as Qe,a as be,b as Ze,d as de,e as es}from"./cloud-CCRs2Bqj.js";const re=document.getElementById("app"),w=Re(),D=Ne(),$e=Xe(),pe=Ge();let C="hub",v,le=1,ue=!1,o=Ke(),Q="",G="all",O=!1,T=null,_=null,B=!1;function Pe(){var a;const e=o.user;if(!e)return"connecté";const s=(a=e.user_metadata)==null?void 0:a.identifier,t=e.email;return s||(t!=null&&t.endsWith("@user.local")?t.replace("@user.local",""):t||"connecté")}function xe(e){return e?"Image stockée sur Supabase.":o.ready?o.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image.":"Supabase non configuré (.env)."}Je();Ee(Se(w.hubTheme));We(e=>{o=e,U()});Fe("ACHIEVEMENT_UNLOCKED",e=>{var a;const s=(a=e.payload)==null?void 0:a.achievementId,t=D.achievements.find(i=>i.id===s);t&&f(`Succès débloqué : ${t.title}`,"success"),s===ze.achievementId&&U()});function Se(e){return e?pe.find(s=>s.id===e):pe[0]}function Ee(e){if(!e)return;const s=document.documentElement.style;s.setProperty("--color-primary",e.colors.primary),s.setProperty("--color-secondary",e.colors.secondary),s.setProperty("--color-accent",e.colors.accent),s.setProperty("--color-bg",e.colors.background),s.setProperty("--color-surface",e.colors.surface),s.setProperty("--color-text",e.colors.text),s.setProperty("--color-muted",e.colors.muted),e.gradient&&s.setProperty("--hero-gradient",e.gradient)}function f(e,s="info"){const t=document.createElement("div");t.className=`toast ${s}`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("visible")),setTimeout(()=>{t.classList.remove("visible"),setTimeout(()=>t.remove(),300)},2600)}function Z(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function A(e){if(!e)return"0m";const s=Math.floor(e/1e3),t=Math.floor(s/3600),a=Math.floor(s%3600/60),i=s%60;return t?`${t}h ${a}m`:a?`${a}m ${i}s`:`${i}s`}function X(e){return new Intl.NumberFormat("fr-FR").format(e)}function ss(e){return e.trim().slice(0,3).toUpperCase()}function ve(e,s){if(e.length<2)return null;const t=e.map(c=>Number.isFinite(c)?c:0),a=100,i=42,n=4,x=Math.max(...t,1),h=Math.min(...t,0),y=x-h||1,P=(a-n*2)/Math.max(1,t.length-1),r=t.map((c,p)=>{const $=n+P*p,N=(c-h)/y,S=n+(i-n*2)*(1-N);return{x:$,y:S}}),b=r.map(c=>`${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" "),m=`${n},${i-n} ${b} ${a-n},${i-n}`,M=s===void 0?r.length-1:s,L=Math.max(0,Math.min(M,r.length-1)),g=Math.floor(L),I=L-g,E=r.slice(0,g+1);if(I>0&&g<r.length-1){const c=r[g],p=r[g+1];E.push({x:c.x+(p.x-c.x)*I,y:c.y+(p.y-c.y)*I})}const k=E.map(c=>`${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" "),d=E[E.length-1];return{points:b,area:m,progress:k,marker:d}}function me(e,s){return e?`
    <div class="curve-chart">
      <svg viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="${s}-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--chart-primary)" />
            <stop offset="100%" stop-color="var(--chart-secondary)" />
          </linearGradient>
          <linearGradient id="${s}-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--chart-primary)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--chart-primary)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polyline class="chart-line base" points="${e.points}" />
        <polygon class="chart-area" points="${e.area}" fill="url(#${s}-fill)" />
        <polyline class="chart-line progress" points="${e.progress}" stroke="url(#${s}-line)" />
        <circle class="chart-marker" cx="${e.marker.x}" cy="${e.marker.y}" r="2.6" />
      </svg>
    </div>
  `:'<div class="chart-empty">Pas encore assez de données.</div>'}function oe(e){const s=Object.entries(e.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[t,a]=s.sort((n,x)=>(x[1].timePlayedMs||0)-(n[1].timePlayedMs||0))[0],i=w.games.find(n=>n.id===t);return{title:(i==null?void 0:i.title)||t,duration:A(a.timePlayedMs)}}function ts(e){return/^https?:\/\//i.test(e)||e.startsWith("blob:")||e.startsWith("data:")}function ke(e,s){if(e){const t=e.trim();return ts(t)?t:de(s||t)||null}return de(s)||null}function as(e,s,t){const a=(s||"🎮").slice(0,4),i=ke(e,t);return`<div class="avatar ${i?"has-image":""}">${i?`<img src="${i}" alt="Avatar" />`:a}</div>`}function Ae(){if(B)return null;const e=ke(v.save.playerProfile.avatarUrl,v.save.playerProfile.avatarStoragePath);return _||e}function J(){_&&(URL.revokeObjectURL(_),_=null)}function ne(){const e=document.getElementById("profile-avatar-preview"),s=document.getElementById("profile-avatar-helper"),t=document.getElementById("profile-avatar-clear"),a=Ae(),i=v.save.playerProfile.avatar||"🎮",n=!!a;e&&(e.classList.toggle("has-image",n),e.innerHTML=n?`<img src="${a}" alt="Avatar" />`:i),s&&(s.textContent=xe(n)),t&&(t.disabled=!n)}function ge(e,s){const t=e.trim()||"Joueur",a=s.trim()||"🎮",i=o.user?v.save.playerProfile.name:t;ie(n=>{n.playerProfile.name=i.slice(0,18),n.playerProfile.avatar=a.slice(0,4),n.playerProfile.avatarType=n.playerProfile.avatarUrl?"image":"emoji"}),U()}function rs(){const e=qe(),s=new Blob([e],{type:"application/json"}),t=URL.createObjectURL(s),a=document.createElement("a");a.href=t,a.download="nintendo-hub-save.json",a.click(),URL.revokeObjectURL(t),f("Sauvegarde exportée","success")}async function ns(e){const s=_e(e);if(s.success)if(f("Import réussi","success"),J(),T=null,B=!1,U(),o.user)try{const t=await be(v.save,{allowEmpty:!0});f(t?"Sauvegarde cloud remplacée":o.error||"Erreur cloud",t?"success":"error")}catch(t){console.error("Cloud save failed after import",t),f("Erreur cloud","error")}else o.ready&&f("Connecte-toi pour envoyer l'import sur le cloud","info");else f(s.error||"Import impossible","error")}function he(e){es(),e?(He(e),f(`Progression de ${e} réinitialisée`,"info")):(Ve(),f("Progression globale réinitialisée","info")),J(),T=null,B=!1,U()}function ls(e){ie(s=>{const t=new Set(s.favorites||[]);t.has(e)?t.delete(e):t.add(e),s.favorites=Array.from(t)}),U()}async function is(){const e=fe();await be(e.save)?(v=e,f("Sauvegarde envoyée sur le cloud","success")):o.error&&f(o.error,"error")}async function os(){await Ze()?(f("Sauvegarde cloud importée","success"),J(),T=null,B=!1,U()):o.error?f(o.error,"error"):f("Import cloud impossible","error")}function cs(){return`
    <nav class="nav">
      <button class="nav-btn ${C==="hub"?"active":""}" data-tab="hub">Hub</button>
      <button class="nav-btn ${C==="achievements"?"active":""}" data-tab="achievements">Succès</button>
      <button class="nav-btn ${C==="stats"?"active":""}" data-tab="stats">Stats</button>
      <button class="nav-btn ${C==="profile"?"active":""}" data-tab="profile">Profil</button>
    </nav>
  `}function ds(e){return Oe(e)?`
    <div class="alex-banner">
      <div>
        <p class="eyebrow">Succès secret</p>
        <strong>31 000 XP validés pour Alex</strong>
        <p class="muted small">Un message d'anniversaire se cache derrière ce bouton.</p>
      </div>
      <a class="btn primary" href="${ye("/apps/alex/")}">Ouvrir la page</a>
    </div>
  `:""}function ps(){return`
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
                <span class="chip ${o.ready?"warning":"error"}">Cloud : ${o.ready?"non connecté":"Supabase non configuré"}</span>
                <span class="chip ghost">Saves verrouillées</span>
              </div>
            </div>
          </div>
        </div>
        ${o.ready?`<div class="gate-form">
                 <label>Identifiant <input id="gate-identifier" type="text" placeholder="mon-pseudo" /></label>
                 <label>Mot de passe <input id="gate-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="gate-actions">
                   <button class="btn primary strong" id="gate-login" ${o.loading?"disabled":""}>Connexion</button>
                   <button class="btn ghost strong" id="gate-register" ${o.loading?"disabled":""}>Créer un compte</button>
                 </div>
                 ${o.error?`<p class="status error">${o.error}</p>`:'<p class="status info">Tes saves seront synchronisées entre appareils.</p>'}
               </div>`:'<p class="status error">Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY puis recharge la page.</p>'}
      </header>
    </div>
  `}function us(){return`
    <div class="layout">
      <header class="card hero auth-gate">
        <div class="hero-glow"></div>
        <div class="hero-top">
          <div class="profile">
            <div class="avatar">☁️</div>
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>Synchronisation cloud en cours</h1>
              <p class="muted">Chargement de ta sauvegarde avant d'accéder au hub.</p>
              <div class="chips">
                <span class="chip accent">Sauvegarde cloud</span>
                <span class="chip ghost">${o.loading?"Chargement...":"En attente"}</span>
              </div>
            </div>
          </div>
        </div>
        ${o.error?`<p class="status error">${o.error}</p>`:""}
      </header>
    </div>
  `}function vs(){var r;const e=v.save,s=e.achievementsUnlocked.length,t=D.achievements.length,a=e.globalLevel>le,i=`--progress:${v.levelProgress*100}%`,n=A(e.globalStats.timePlayedMs),x=e.globalStats.totalSessions,h=e.playerProfile.lastPlayedGameId&&((r=w.games.find(b=>b.id===e.playerProfile.lastPlayedGameId))==null?void 0:r.title);le=e.globalLevel;const y=oe(e),P=`<span class="chip success">Cloud : ${Pe()}</span>`;return`
    <header class="card hero">
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="profile">
          ${as(e.playerProfile.avatarUrl,e.playerProfile.avatar,e.playerProfile.avatarStoragePath)}
          <div>
            <p class="eyebrow">Arcade Galaxy</p>
            <h1>${e.playerProfile.name||"Joueur"}</h1>
            <p class="muted">${h?`Dernier jeu : ${h}`:"Aucun jeu lancé"}</p>
            <div class="chips">
              ${P}
              <span class="chip">⏱ ${n}</span>
              <span class="chip">🎮 ${x} sessions</span>
              <button class="btn primary strong profile-inline" id="open-profile">Voir le profil</button>
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
            <strong>${n}</strong>
            <p class="muted small">Sessions ${x}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${y.title}</strong>
            <p class="muted small">Temps ${y.duration}</p>
          </div>
        </div>
      </div>
      ${ds(e)}
      <div class="level-row ${a?"level-up":""}">
        <div class="level-label">Progression niveau</div>
        <div class="xp-bar" style="${i}">
          <div class="xp-fill"></div>
        </div>
        <div class="xp-values">${Math.floor(v.levelProgress*100)}% · ${v.nextLevelXP-e.globalXP} XP restants</div>
      </div>
      <p class="muted small hero-note">Profil éditable depuis la page dédiée.</p>
    </header>
  `}function ms(){const e=w.games.length?[]:["games.registry.json vide ou invalide"],s=new Set(v.save.favorites||[]),t=Array.from(new Set(w.games.flatMap(r=>r.tags||[]).filter(Boolean))).sort((r,b)=>r.localeCompare(b,"fr")),a=Q.trim().toLowerCase(),i=Q.replace(/"/g,"&quot;"),n=w.games.filter(r=>O?s.has(r.id):!0).filter(r=>G==="all"?!0:(r.tags||[]).includes(G)).filter(r=>a?r.title.toLowerCase().includes(a)||r.description.toLowerCase().includes(a)||r.id.toLowerCase().includes(a):!0).sort((r,b)=>{const m=Number(s.has(b.id))-Number(s.has(r.id));return m!==0?m:(r.order??0)-(b.order??0)}),x=n.map(r=>{$e.find(k=>k.id===r.id)||e.push(`Config manquante pour ${r.id}`);const m=v.save.games[r.id],M=m!=null&&m.lastPlayedAt?Z(m.lastPlayedAt):"Jamais",L=(m==null?void 0:m.bestScore)??null,g=A(m==null?void 0:m.timePlayedMs),I=ye(`/apps/games/${r.id}/`),E=s.has(r.id);return`
        <article class="card game-card">
          <div class="card-top">
            <div class="pill accent">${r.previewEmoji||"🎮"} ${r.title}</div>
            <div class="card-actions">
              <button class="icon-btn favorite-btn ${E?"active":""}" data-game="${r.id}" title="${E?"Retirer des favoris":"Ajouter aux favoris"}">
                ${E?"★":"☆"}
              </button>
              <span class="muted">MAJ ${r.lastUpdated||"N/A"}</span>
            </div>
          </div>
          <p class="game-desc">${r.description}</p>
          <div class="tags">${r.tags.map(k=>`<span class="tag">${k}</span>`).join("")}</div>
          <div class="meta-row">
            <span class="chip ghost">⏱ ${g}</span>
            <span class="chip ghost">🏆 ${L??"—"}</span>
            <span class="chip ghost">🕘 ${M}</span>
          </div>
          <div class="game-actions">
            <a class="btn primary" href="${I}" data-game="${r.id}">Jouer</a>
            <button class="btn ghost help-btn" data-help="${r.id}">Aide</button>
          </div>
        </article>
      `}).join(""),h=O||G!=="all"||!!a,y=n.length,P=e.length?`<div class="alert">Configs manquantes : ${e.join(", ")}</div>`:"";return`
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
            value="${i}"
          />
        </div>
        <div class="filter group">
          <button class="chip-btn ${G==="all"?"active":""}" data-category="all">Toutes</button>
          ${t.map(r=>`<button class="chip-btn ${r===G?"active":""}" data-category="${r}">${r}</button>`).join("")}
        </div>
        <div class="filter actions">
          <button class="chip-btn fav ${O?"active":""}" id="filter-fav">
            ★ Favoris ${s.size?`<span class="badge">${s.size}</span>`:""}
          </button>
          <span class="muted small">${y}/${w.games.length} jeux</span>
          ${h?'<button class="chip-btn ghost" id="clear-filters">Réinitialiser</button>':""}
        </div>
      </div>
      ${P}
      <div class="grid">${x||"<p class='muted'>Aucun jeu ne correspond aux filtres.</p>"}</div>
    </section>
  `}function gs(){const e=new Set(v.save.achievementsUnlocked),s=D.achievements.map(t=>`
        <article class="card achievement ${e.has(t.id)?"unlocked":""}">
          <div class="pill accent">${t.icon||"⭐️"}</div>
          <div>
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <p class="muted">${hs(t)}</p>
          </div>
          <div class="reward">+${t.rewardXP??0} XP</div>
        </article>
      `).join("");return`
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">Succès</p>
          <h2>Collection</h2>
          <p class="muted">${e.size} / ${D.achievements.length} débloqués</p>
        </div>
      </div>
      <div class="stack">${s}</div>
    </section>
  `}function hs(e){const s=e.condition;return s.type==="eventCount"?`${s.count}x ${s.event}`:s.type==="xpReached"?`${s.xp} XP globaux`:s.type==="gamesPlayed"?`${s.count} jeux différents`:s.type==="streak"?`${s.count} ${s.event} d'affilée`:s.type==="playerXpName"?`${s.xp} XP et pseudo "${s.name}"`:""}function fs(){const e=v.save,t=Object.entries(e.games||{}).map(([l,u])=>{var F;const j=((F=w.games.find(H=>H.id===l))==null?void 0:F.title)||l;return{id:l,title:j,timePlayedMs:u.timePlayedMs??0,bestScore:u.bestScore,lastPlayedAt:u.lastPlayedAt??0}}),a=t.length,i=e.globalStats.timePlayedMs??0,n=e.globalStats.totalSessions??0,x=n?i/n:0,h=e.globalStats.events.SESSION_WIN??0,y=e.globalStats.events.SESSION_FAIL??0,P=h+y>0?Math.round(h/(h+y)*100):0,r=e.achievementsUnlocked.length,b=D.achievements.length,m=b?Math.round(r/b*100):0,M=Math.max(0,...Object.values(e.globalStats.streaks||{})),L=[...t].sort((l,u)=>u.timePlayedMs-l.timePlayedMs),g=[...t].filter(l=>l.lastPlayedAt).sort((l,u)=>u.lastPlayedAt-l.lastPlayedAt)[0],I=(g==null?void 0:g.title)||"Aucun jeu",E=g!=null&&g.lastPlayedAt?Z(g.lastPlayedAt):"Jamais",k=oe(e),c=[...De().levels].sort((l,u)=>l.level-u.level),p=c.map(l=>l.requiredXP),N=Math.max(0,c.findIndex(l=>l.level===e.globalLevel))+v.levelProgress,S=ve(p,N),ce=Math.round(v.levelProgress*100),we=Math.max(0,v.nextLevelXP-e.globalXP),ee=[...t].filter(l=>l.lastPlayedAt).sort((l,u)=>l.lastPlayedAt-u.lastPlayedAt).slice(-8),se=ee.length>=2?ee:L.filter(l=>l.timePlayedMs>0).slice(0,8),Le=se.map(l=>l.timePlayedMs),Ie=ve(Le),je=ee.length>=2?"Derniers jeux lancés":"Top temps de jeu",Ce=se.length?`<div class="curve-labels">
        ${se.map(l=>`<span title="${l.title}">${ss(l.title)}</span>`).join("")}
      </div>`:"",q=t.reduce((l,u)=>l+u.timePlayedMs,0),z=L.filter(l=>l.timePlayedMs>0).slice(0,5),Me=z.reduce((l,u)=>l+u.timePlayedMs,0),W=Math.max(0,q-Me),K=["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--chart-6)"];let te="",Y="";if(q>0&&z.length){let l=0;const u=z.map((j,F)=>{const H=j.timePlayedMs/q*100,Ue=l;return l+=H,`${K[F%K.length]} ${Ue.toFixed(2)}% ${l.toFixed(2)}%`});if(W>0&&u.push(`var(--chart-6) ${l.toFixed(2)}% 100%`),te=`style="--donut: conic-gradient(${u.join(", ")})"`,Y=z.map((j,F)=>{const H=Math.round(j.timePlayedMs/q*100);return`
          <div class="legend-item">
            <span class="legend-dot" style="--dot:${K[F%K.length]}"></span>
            <div>
              <strong>${j.title}</strong>
              <p class="muted small">${A(j.timePlayedMs)} · ${H}%</p>
            </div>
          </div>
        `}).join(""),W>0){const j=Math.round(W/q*100);Y+=`
        <div class="legend-item">
          <span class="legend-dot" style="--dot:var(--chart-6)"></span>
          <div>
            <strong>Autres</strong>
            <p class="muted small">${A(W)} · ${j}%</p>
          </div>
        </div>
      `}}else Y='<p class="muted">Pas encore de temps de jeu enregistré.</p>',te='style="--donut: conic-gradient(rgba(255, 255, 255, 0.08) 0 100%)"';const ae=[...t].filter(l=>l.bestScore!==void 0).sort((l,u)=>(u.bestScore??0)-(l.bestScore??0)).slice(0,6),Te=Math.max(1,...ae.map(l=>l.bestScore??0)),Be=ae.length?ae.map(l=>{const u=l.bestScore??0,j=Math.max(6,Math.round(u/Te*100));return`
            <div class="score-row">
              <div class="score-info">
                <strong>${l.title}</strong>
                <span class="muted small">${A(l.timePlayedMs)} joués</span>
              </div>
              <div class="score-bar"><span style="width:${j}%"></span></div>
              <div class="score-value">${X(u)}</div>
            </div>
          `}).join(""):'<p class="muted">Aucun score enregistré pour le moment.</p>';return`
    <section class="card stats-kpi">
      <div class="section-head">
        <div>
          <p class="eyebrow">Stats</p>
          <h2>Dashboard KPI</h2>
          <p class="muted">Vue globale, progression et performance par jeu.</p>
        </div>
        <div class="kpi-badges">
          <span class="chip ghost">Dernier : ${I}</span>
          <span class="chip ghost">Dernière activité : ${E}</span>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card" style="--kpi-accent: var(--chart-1)">
          <div class="kpi-top">
            <span class="kpi-icon">⏱</span>
            <span class="kpi-label">Temps total</span>
          </div>
          <strong>${A(i)}</strong>
          <p class="muted small">Session moyenne ${A(x)}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-2)">
          <div class="kpi-top">
            <span class="kpi-icon">🎮</span>
            <span class="kpi-label">Sessions</span>
          </div>
          <strong>${X(n)}</strong>
          <p class="muted small">${h} victoires · ${y} défaites</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-3)">
          <div class="kpi-top">
            <span class="kpi-icon">⚡</span>
            <span class="kpi-label">XP globale</span>
          </div>
          <strong>${X(e.globalXP)} XP</strong>
          <p class="muted small">Niveau ${e.globalLevel} · ${ce}%</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-4)">
          <div class="kpi-top">
            <span class="kpi-icon">🧩</span>
            <span class="kpi-label">Jeux joués</span>
          </div>
          <strong>${a}/${w.games.length}</strong>
          <p class="muted small">Top : ${k.title}</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-5)">
          <div class="kpi-top">
            <span class="kpi-icon">🏆</span>
            <span class="kpi-label">Succès</span>
          </div>
          <strong>${r}/${b}</strong>
          <p class="muted small">${m}% complétés</p>
        </div>
        <div class="kpi-card" style="--kpi-accent: var(--chart-6)">
          <div class="kpi-top">
            <span class="kpi-icon">📈</span>
            <span class="kpi-label">Performance</span>
          </div>
          <strong>${P}%</strong>
          <p class="muted small">Streak max ${M}</p>
        </div>
      </div>
    </section>

    <section class="card stats-curves">
      <div class="section-head">
        <div>
          <p class="eyebrow">Progression</p>
          <h2>Courbes de progression</h2>
          <p class="muted">XP, niveaux et rythme d'activité.</p>
        </div>
      </div>
      <div class="curve-grid">
        <article class="curve-card" style="--chart-primary: var(--color-primary); --chart-secondary: var(--color-secondary)">
          <div class="curve-head">
            <div>
              <h3>Niveaux & XP</h3>
              <p class="muted small">Prochain niveau : ${X(v.nextLevelXP)} XP</p>
            </div>
            <span class="chip ghost">+${X(we)} XP</span>
          </div>
          ${me(S,"xp-curve")}
          <div class="curve-metrics">
            <div>
              <span class="label">XP globale</span>
              <strong>${X(e.globalXP)}</strong>
            </div>
            <div>
              <span class="label">Progression</span>
              <strong>${ce}%</strong>
            </div>
            <div>
              <span class="label">Niveau</span>
              <strong>${e.globalLevel}</strong>
            </div>
          </div>
        </article>
        <article class="curve-card" style="--chart-primary: var(--color-accent); --chart-secondary: var(--color-primary)">
          <div class="curve-head">
            <div>
              <h3>Rythme d'activité</h3>
              <p class="muted small">${je}</p>
            </div>
            <span class="chip ghost">${P}% win</span>
          </div>
          ${me(Ie,"activity-curve")}
          ${Ce}
          <div class="curve-metrics">
            <div>
              <span class="label">Sessions</span>
              <strong>${X(n)}</strong>
            </div>
            <div>
              <span class="label">Temps total</span>
              <strong>${A(i)}</strong>
            </div>
            <div>
              <span class="label">Jeu top</span>
              <strong>${k.title}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="card stats-diagrams">
      <div class="section-head">
        <div>
          <p class="eyebrow">Jeux</p>
          <h2>Diagrammes & scores</h2>
          <p class="muted">Répartition des jeux les plus joués et meilleurs scores.</p>
        </div>
      </div>
      <div class="diagram-grid">
        <article class="diagram-card">
          <div class="diagram-head">
            <div>
              <h3>Jeux les plus joués</h3>
              <p class="muted small">${a} jeux actifs</p>
            </div>
          </div>
          <div class="donut-wrap">
            <div class="donut" ${te}></div>
            <div class="donut-center">
              <span class="label">Temps total</span>
              <strong>${A(i)}</strong>
              <p class="muted small">${a} jeux</p>
            </div>
          </div>
          <div class="donut-legend">
            ${Y}
          </div>
        </article>
        <article class="diagram-card">
          <div class="diagram-head">
            <div>
              <h3>Meilleurs scores</h3>
              <p class="muted small">Top jeux par score enregistré.</p>
            </div>
          </div>
          <div class="score-list">
            ${Be}
          </div>
        </article>
      </div>
    </section>
  `}function ys(){var h;const e=v.save,s=Object.entries(e.games||{}),t=oe(e),a=o.lastSyncedAt?Z(o.lastSyncedAt):"Jamais",i=e.playerProfile.lastPlayedGameId&&((h=w.games.find(y=>y.id===e.playerProfile.lastPlayedGameId))==null?void 0:h.title),n=Ae(),x=xe(!!n);return`
    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Profil</p>
          <h2>Identité & avatar</h2>
          <p class="muted small">Pseudo lié au compte cloud. Emoji modifiable, image stockée sur Supabase.</p>
        </div>
        <span class="chip ghost">Sync : ${a}</span>
      </div>
      <div class="profile-identity">
        <div class="avatar-panel">
          <div class="avatar ${n?"has-image":""}" id="profile-avatar-preview">
            ${n?`<img src="${n}" alt="Avatar" />`:e.playerProfile.avatar||"🎮"}
          </div>
          <p class="muted small" id="profile-avatar-helper">${x}</p>
          <label class="file-drop">
            <input type="file" id="profile-avatar-upload" accept="image/*" />
            <strong>Image Supabase</strong>
            <span class="muted small">PNG/JPG · 1.5 Mo max</span>
          </label>
          <button class="btn ghost danger" id="profile-avatar-clear" type="button" ${n?"":"disabled"}>Revenir à l'emoji</button>
        </div>
        <div class="profile-form two-cols">
          <label>Pseudo <input id="player-name" value="${e.playerProfile.name}" disabled /></label>
          <label>Avatar (emoji) <input id="player-avatar" value="${e.playerProfile.avatar||"🎮"}" maxlength="4" /></label>
          <div class="actions-grid">
            <button class="btn primary" id="profile-save" type="button">Enregistrer</button>
            <button class="btn ghost" id="export-save" type="button">Exporter JSON</button>
          </div>
          <div class="info-grid">
            <div>
              <span class="label">Dernier jeu</span>
              <strong>${i||"Aucun jeu lancé"}</strong>
            </div>
            <div>
              <span class="label">Jeu le plus joué</span>
              <strong>${t.title}</strong>
              <p class="muted small">${t.duration}</p>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.globalStats.totalSessions}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card cloud">
      <div class="section-head">
        <div>
          <p class="eyebrow">Cloud</p>
          <h2>Supabase</h2>
          <p class="muted small">Sauvegarde cloud (source de vérité) liée à ton compte.</p>
        </div>
        <span class="chip success">Connecté : ${Pe()}</span>
      </div>
      <div class="actions-grid">
        <button class="btn primary" id="cloud-save" ${o.loading?"disabled":""}>Sauvegarder vers cloud</button>
        <button class="btn ghost" id="cloud-load" ${o.loading?"disabled":""}>Charger depuis cloud</button>
        <button class="btn ghost danger" id="cloud-logout" ${o.loading?"disabled":""}>Déconnexion</button>
      </div>
      <p class="muted small">Dernière synchro : ${a}</p>
      ${o.message?`<p class="status ok">${o.message}</p>`:'<p class="status info">Synchronisation cloud active.</p>'}
      ${o.error?`<p class="status error">${o.error}</p>`:""}
    </section>

    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Sauvegardes</p>
          <h2>Export / Import</h2>
          <p class="muted small">Exporter, importer ou remettre à zéro ta progression.</p>
        </div>
        <button class="btn ghost danger" id="reset-save" type="button">Reset global</button>
      </div>
      <label class="import">
        <span class="label">Import JSON</span>
        <textarea id="import-text" placeholder="Colle ici ton export JSON"></textarea>
        <button class="btn primary" id="import-btn" type="button">Importer</button>
      </label>
      <div class="save-meta">
        <div>
          <span class="label">Temps global</span>
          <strong>${A(e.globalStats.timePlayedMs)}</strong>
        </div>
        <div>
          <span class="label">Jeux joués</span>
          <strong>${Object.keys(e.games).length}/${w.games.length}</strong>
        </div>
        <div>
          <span class="label">Succès</span>
          <strong>${e.achievementsUnlocked.length}/${D.achievements.length}</strong>
        </div>
      </div>
      <div class="save-list">
        ${s.length?s.map(([y,P])=>`
          <div class="save-row">
            <div>
              <strong>${y}</strong>
              <p class="muted small">v${P.saveSchemaVersion} · Dernier : ${Z(P.lastPlayedAt)}</p>
            </div>
            <div class="chips-row">
              <span class="chip ghost">⏱ ${A(P.timePlayedMs)}</span>
              <span class="chip ghost">🏆 ${P.bestScore??"—"}</span>
            </div>
          </div>
        `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
      </div>
    </section>
  `}function R(){if(!o.ready||!o.user){re.innerHTML=ps(),bs();return}if(!o.hydrated){re.innerHTML=us();return}re.innerHTML=`
    <div class="layout">
      ${cs()}
      ${vs()}
      ${C==="hub"?ms():""}
      ${C==="achievements"?gs():""}
      ${C==="stats"?fs():""}
      ${C==="profile"?ys():""}
    </div>
  `,$s()}function bs(){const e=document.getElementById("gate-login"),s=document.getElementById("gate-register");e==null||e.addEventListener("click",async()=>{var i,n;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",a=((n=document.getElementById("gate-password"))==null?void 0:n.value)||"";await V("login",{identifier:t,password:a})}),s==null||s.addEventListener("click",async()=>{var i,n;const t=((i=document.getElementById("gate-identifier"))==null?void 0:i.value)||"",a=((n=document.getElementById("gate-password"))==null?void 0:n.value)||"";await V("register",{identifier:t,password:a})})}function $s(){document.querySelectorAll(".nav-btn").forEach(d=>{d.addEventListener("click",()=>{C=d.dataset.tab,R()})});const e=document.getElementById("open-profile");e==null||e.addEventListener("click",()=>{C="profile",R()});const s=document.getElementById("player-name"),t=document.getElementById("player-avatar");s&&t&&C!=="profile"&&(s.addEventListener("change",()=>ge(s.value,(t==null?void 0:t.value)||"🎮")),t.addEventListener("change",()=>ge((s==null?void 0:s.value)||"Joueur",t.value))),document.querySelectorAll(".help-btn").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.help,p=$e.find($=>$.id===c);p&&f(p.uiText.help,"info")})}),document.querySelectorAll(".favorite-btn").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.game;c&&ls(c)})});const a=document.getElementById("export-save");a==null||a.addEventListener("click",rs);const i=document.getElementById("reset-save");i==null||i.addEventListener("click",()=>he()),document.querySelectorAll(".reset-game").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.game;he(c)})});const n=document.getElementById("import-btn"),x=document.getElementById("import-text");n==null||n.addEventListener("click",()=>x&&ns(x.value));const h=document.getElementById("cloud-login"),y=document.getElementById("cloud-register"),P=document.getElementById("cloud-logout"),r=document.getElementById("cloud-save"),b=document.getElementById("cloud-load");h==null||h.addEventListener("click",async()=>{var p,$;const d=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",c=(($=document.getElementById("cloud-password"))==null?void 0:$.value)||"";await V("login",{identifier:d,password:c})}),y==null||y.addEventListener("click",async()=>{var p,$;const d=((p=document.getElementById("cloud-identifier"))==null?void 0:p.value)||"",c=(($=document.getElementById("cloud-password"))==null?void 0:$.value)||"";await V("register",{identifier:d,password:c})}),P==null||P.addEventListener("click",async()=>{await V("logout"),T=null,B=!1,J()}),r==null||r.addEventListener("click",is),b==null||b.addEventListener("click",os);const m=document.getElementById("profile-avatar-upload"),M=document.getElementById("profile-avatar-clear"),L=document.getElementById("profile-save");m==null||m.addEventListener("change",d=>{var $;const c=d.target,p=($=c.files)==null?void 0:$[0];if(p){if(!p.type.startsWith("image/")){f("Seules les images sont autorisées.","error"),c.value="";return}if(p.size>1.5*1024*1024){f("Image trop lourde (1.5 Mo max).","error"),c.value="";return}J(),T=p,_=URL.createObjectURL(p),B=!1,ne()}}),M==null||M.addEventListener("click",()=>{B=!0,T=null,J(),ne()}),L==null||L.addEventListener("click",async()=>{const d=document.getElementById("player-avatar"),c=((d==null?void 0:d.value)||"🎮").slice(0,4),p=v.save.playerProfile.avatarStoragePath;let $=v.save.playerProfile.avatarUrl,N=p;if(T){const S=await Ye(T,p||void 0);if(!S.url||!S.path||S.error){f(S.error||"Upload avatar impossible","error");return}$=S.url,N=S.path}else B&&($=void 0,N=void 0,p&&o.ready&&o.user&&await Qe(p));ie(S=>{S.playerProfile.avatar=c,S.playerProfile.avatarUrl=$,S.playerProfile.avatarStoragePath=N,S.playerProfile.avatarType=$?"image":"emoji"}),T=null,B=!1,J(),f("Profil mis à jour","success"),U()});const g=document.getElementById("search-games"),I=document.getElementById("filter-fav"),E=Array.from(document.querySelectorAll(".chip-btn[data-category]")),k=document.getElementById("clear-filters");g==null||g.addEventListener("input",()=>{Q=g.value,R()}),E.forEach(d=>{d.addEventListener("click",()=>{G=d.dataset.category||"all",R()})}),I==null||I.addEventListener("click",()=>{O=!O,R()}),k==null||k.addEventListener("click",()=>{Q="",G="all",O=!1,R()}),ne()}function U(){if(!o.ready||!o.user||!o.hydrated){R();return}const e=fe();ue||(le=e.save.globalLevel,ue=!0),v=e,Ee(Se(w.hubTheme)),R()}U();
