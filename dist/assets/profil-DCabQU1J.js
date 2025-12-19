import{g as k,b as G,a as N,w as _,u as F,k as H,h as V,i as x,j as O}from"./index-DUQ7dej_.js";import{s as X,g as z,u as W,r as q,c as R,a as Y,l as K}from"./cloud-renlPHrB.js";const Q=document.getElementById("app");let t=z(),E=k(),y=null,l=null,g=!1,U=!1;const Z=1.5*1024*1024;X(e=>{t=e,U||b()});function C(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function S(e){if(!e)return"0m";const n=Math.floor(e/1e3),a=Math.floor(n/3600),r=Math.floor(n%3600/60),d=n%60;return a?`${a}h ${r}m`:r?`${r}m ${d}s`:`${d}s`}function M(e){var r;if(!e)return"connecté";const n=(r=e.user_metadata)==null?void 0:r.identifier,a=e.email;return n||(a!=null&&a.endsWith("@user.local")?a.replace("@user.local",""):a||"connecté")}function ee(e){const n=Object.entries(e.save.games||{});if(!n.length)return{title:"Aucun jeu",duration:"0m"};const[a,r]=n.sort((v,m)=>(m[1].timePlayedMs||0)-(v[1].timePlayedMs||0))[0],d=N().games.find(v=>v.id===a);return{title:(d==null?void 0:d.title)||a,duration:S(r.timePlayedMs)}}function u(e,n="info"){const a=document.createElement("div");a.className=`toast ${n}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("visible")),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>a.remove(),240)},2400)}function J(e,n,a){const r=!!n;return`<div class="avatar ${r?"has-image":""}" id="${e}">
    ${r?`<img src="${n}" alt="Avatar" />`:`<span>${a}</span>`}
  </div>`}function T(e){return e?"Image utilisée pour l'avatar (stockée sur Supabase). L'emoji reste disponible en secours.":t.ready?t.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.":"Supabase non configuré (.env)."}function A(){var m;const e=((m=document.getElementById("avatar"))==null?void 0:m.value)||"🎮",n=document.getElementById("avatar-preview"),a=document.getElementById("avatar-helper"),r=document.getElementById("avatar-clear"),d=g?null:l||E.save.playerProfile.avatarUrl,v=!!d;n&&(n.classList.toggle("has-image",v),n.innerHTML=v?`<img src="${d}" alt="Avatar" />`:`<span>${e}</span>`),a&&(a.textContent=T(v)),r&&(r.disabled=!v)}function b(){var L;E=k();const e=E,n=G().achievements,a=new Set(e.save.achievementsUnlocked),r=N(),d=Object.entries(e.save.games),v=t!=null&&t.user?"disabled":"",m=ee(e),$=t.lastSyncedAt?C(t.lastSyncedAt):"Jamais",f=e.save.playerProfile.avatar||"🎮",h=g?null:l||e.save.playerProfile.avatarUrl,I=T(!!h),P=e.save.playerProfile.lastPlayedGameId?((L=r.games.find(s=>s.id===e.save.playerProfile.lastPlayedGameId))==null?void 0:L.title)??"Inconnu":null,j=t.user?`<span class="chip success">Cloud : ${M(t.user)}</span>`:t.ready?'<span class="chip ghost">Cloud : non connecté</span>':'<span class="chip warning">Supabase non configuré</span>';Q.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            ${J("avatar-hero",e.save.playerProfile.avatarUrl,f)}
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${e.save.playerProfile.name||"Joueur"}</h1>
              <p class="muted">${P?`Dernier jeu : ${P}`:"Aucun jeu lancé"}</p>
            </div>
          </div>
          <div class="chips">
            ${j}
            <span class="chip ghost">Sync : ${$}</span>
            <span class="chip">⏱ ${S(e.save.globalStats.timePlayedMs)}</span>
            <span class="chip">🎮 ${e.save.globalStats.totalSessions} sessions</span>
          </div>
          <div class="identity-actions">
            <a class="btn primary strong" href="${_("/")}">Retour hub</a>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <p class="label">Niveau</p>
            <strong>${e.save.globalLevel}</strong>
            <p class="muted small">${e.save.globalXP} XP</p>
          </div>
          <div class="stat-card">
            <p class="label">Succès</p>
            <strong>${a.size}/${n.length}</strong>
            <p class="muted small">Schema v${e.save.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${S(e.save.globalStats.timePlayedMs)}</strong>
            <p class="muted small">Sessions ${e.save.globalStats.totalSessions}</p>
          </div>
          <div class="stat-card">
            <p class="label">Jeu le plus joué</p>
            <strong>${m.title}</strong>
            <p class="muted small">${m.duration}</p>
          </div>
        </div>
      </header>

      <div class="sections">
        <div class="grid-two">
          <section class="card">
            <div class="section-head">
              <div>
                <h2>Identité</h2>
                <p class="muted small">Pseudo verrouillé si connecté en cloud. Avatar toujours modifiable.</p>
              </div>
              <span class="chip ghost">Avatar image</span>
            </div>
            <div class="identity-grid">
              <div class="avatar-panel">
                ${J("avatar-preview",h,f)}
                <p class="muted small" id="avatar-helper">${I}</p>
                <div class="avatar-actions">
                  <label class="file-drop">
                    <input type="file" id="avatar-upload" accept="image/*" />
                    <strong>Image de profil (Supabase)</strong>
                    <span class="muted small">PNG/JPG · 1.5 Mo max</span>
                  </label>
                  <button class="btn ghost danger" id="avatar-clear" type="button" ${h?"":"disabled"}>Revenir à l'emoji</button>
                </div>
              </div>
              <div class="form">
                <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" ${v} /></label>
                <label>Avatar (emoji) <input id="avatar" value="${f}" maxlength="4" /></label>
                <div class="actions stretch">
                  <button class="btn primary" id="save-profile" type="button">Enregistrer</button>
                  <button class="btn ghost danger" id="reset" type="button">Reset global</button>
                </div>
              </div>
            </div>
          </section>

          <section class="card">
            <h2>Cloud Supabase</h2>
            <p class="muted small">Synchronisation cross-device (Spark gratuit). Identifiant + mot de passe.</p>
            ${t!=null&&t.user?`<div class="status ok">Connecté : ${M(t.user)}</div>
                   <div class="actions stretch">
                     <button class="btn primary" id="cloud-save" type="button">Sauvegarder vers cloud</button>
                     <button class="btn ghost" id="cloud-load" type="button">Charger depuis cloud</button>
                     <button class="btn ghost danger" id="cloud-logout" type="button">Déconnexion</button>
                   </div>
                   <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save). Dernière synchro : ${$}.</p>`:`<div class="form">
                     <label>Identifiant <input id="cloud-identifier" type="text" placeholder="mon-pseudo" /></label>
                     <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                     <div class="actions stretch">
                       <button class="btn primary" id="cloud-login" type="button">Connexion</button>
                       <button class="btn ghost" id="cloud-register" type="button">Créer un compte</button>
                     </div>
                     <div class="status ${t!=null&&t.error?"error":"info"}">${(t==null?void 0:t.message)??"Non connecté"}</div>
                   </div>`}
          </section>
        </div>

        <section class="card">
          <div class="section-head">
            <div>
              <h2>Gestion des sauvegardes</h2>
              <p class="muted small">Export/Import JSON et stats locales. Les actions cloud ci-dessus restent disponibles.</p>
            </div>
            <span class="chip ghost">Local</span>
          </div>
          <div class="actions stretch">
            <button class="btn ghost" id="export" type="button">Exporter JSON</button>
            <button class="btn ghost danger" id="reset-save" type="button">Reset global</button>
          </div>
          <label>Import JSON
            <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
            <button class="btn primary" id="import-btn" type="button">Importer</button>
          </label>
          <div class="save-meta">
            <div>
              <span class="label">Temps global</span>
              <strong>${S(e.save.globalStats.timePlayedMs)}</strong>
            </div>
            <div>
              <span class="label">Jeux joués</span>
              <strong>${Object.keys(e.save.games).length}/${r.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.save.globalStats.totalSessions}</strong>
            </div>
          </div>
          <div class="save-list">
            ${d.length?d.map(([s,o])=>`
              <div class="save-row">
                <div>
                  <strong>${s}</strong>
                  <p class="muted small">v${o.saveSchemaVersion} · Dernier : ${C(o.lastPlayedAt)}</p>
                </div>
                <div class="chips-row">
                  <span class="chip ghost">⏱ ${S(o.timePlayedMs)}</span>
                  <span class="chip ghost">🏆 ${o.bestScore??"—"}</span>
                </div>
              </div>
            `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
          </div>
        </section>
      </div>
    </div>
  `,te()}function te(){var d,v,m,$,f,h,I,P,j,L;const e=document.getElementById("name"),n=document.getElementById("avatar"),a=document.getElementById("avatar-upload"),r=document.getElementById("avatar-clear");n==null||n.addEventListener("input",A),a==null||a.addEventListener("change",s=>{var c;const o=s.target,i=(c=o.files)==null?void 0:c[0];if(i){if(!t.ready){u("Supabase non configuré pour les avatars.","error"),o.value="";return}if(!t.user){u("Connecte-toi au cloud pour envoyer une image.","error"),o.value="";return}if(!i.type.startsWith("image/")){u("Seules les images sont autorisées.","error"),o.value="";return}if(i.size>Z){u("Image trop lourde (1.5 Mo max).","error"),o.value="";return}l&&URL.revokeObjectURL(l),y=i,l=URL.createObjectURL(i),g=!1,A()}}),r==null||r.addEventListener("click",()=>{g=!0,y=null,l&&(URL.revokeObjectURL(l),l=null),A()}),(d=document.getElementById("save-profile"))==null||d.addEventListener("click",async()=>{U=!0;try{const s=E.save.playerProfile.name,o=t!=null&&t.user?s:((e==null?void 0:e.value)||"Joueur").slice(0,18),i=((n==null?void 0:n.value)||"🎮").slice(0,4),c=E.save.playerProfile.avatarStoragePath;let w=E.save.playerProfile.avatarUrl,B=c;if(y){const p=await W(y,c||void 0);if(!p.url||!p.path||p.error){u(p.error||"Upload avatar impossible","error");return}w=p.url,B=p.path}else g&&(w=void 0,B=void 0,c&&t.ready&&t.user&&await q(c));F(p=>{const D=t!=null&&t.user?p.playerProfile.name:o;p.playerProfile.name=D,p.playerProfile.avatar=i,p.playerProfile.avatarUrl=w,p.playerProfile.avatarStoragePath=B,p.playerProfile.avatarType=w?"image":"emoji"}),y=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,H({type:"PROFILE_UPDATED"}),u("Profil mis à jour","success"),b()}finally{U=!1}}),(v=document.getElementById("export"))==null||v.addEventListener("click",()=>{try{const s=V(),o=new Blob([s],{type:"application/json"}),i=URL.createObjectURL(o),c=document.createElement("a");c.href=i,c.download="arcade-galaxy-save.json",document.body.appendChild(c),c.click(),c.remove(),URL.revokeObjectURL(i),u("Export JSON prêt","success")}catch(s){console.error("Export JSON failed",s),u("Export impossible","error")}}),(m=document.getElementById("reset"))==null||m.addEventListener("click",()=>{x(),y=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Progression réinitialisée","info"),b()}),($=document.getElementById("import-btn"))==null||$.addEventListener("click",()=>{var i;const s=((i=document.getElementById("import"))==null?void 0:i.value)||"",o=O(s);o.success?(y=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Import réussi","success"),b()):u(o.error||"Import impossible","error")}),(f=document.getElementById("reset-save"))==null||f.addEventListener("click",()=>{x(),u("Sauvegarde locale réinitialisée","info"),b()}),(h=document.getElementById("cloud-login"))==null||h.addEventListener("click",async()=>{var i,c;const s=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await R("login",{identifier:s,password:o}),b()}),(I=document.getElementById("cloud-register"))==null||I.addEventListener("click",async()=>{var i,c;const s=((i=document.getElementById("cloud-identifier"))==null?void 0:i.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await R("register",{identifier:s,password:o}),b()}),(P=document.getElementById("cloud-logout"))==null||P.addEventListener("click",async()=>{await R("logout"),y=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,b()}),(j=document.getElementById("cloud-save"))==null||j.addEventListener("click",async()=>{const s=k(),o=await Y(s.save);u(o?"Sauvegarde envoyée dans le cloud.":t.error||"Erreur cloud",o?"success":"error")}),(L=document.getElementById("cloud-load"))==null||L.addEventListener("click",async()=>{const s=await K();s!=null&&s.state?(O(JSON.stringify(s.state)),y=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Sauvegarde cloud importée.","success"),b()):s!=null&&s.error&&u(s.error,"error")}),A()}b();
