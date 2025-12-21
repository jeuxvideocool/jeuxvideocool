import{g as k,b as _,a as T,w as F,u as H,k as V,h as X,i as O,j as C}from"./index-DUQ7dej_.js";import{s as z,g as W,u as q,r as Y,c as B,a as K,l as Q,b as Z}from"./cloud-CdY9yCw-.js";const ee=document.getElementById("app");let t=W(),h=k(),f=null,l=null,g=!1,R=!1;const te=1.5*1024*1024;z(e=>{t=e,R||b()});function M(e){return e?new Date(e).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}):"Jamais"}function L(e){if(!e)return"0m";const s=Math.floor(e/1e3),a=Math.floor(s/3600),i=Math.floor(s%3600/60),d=s%60;return a?`${a}h ${i}m`:i?`${i}m ${d}s`:`${d}s`}function J(e){var i;if(!e)return"connecté";const s=(i=e.user_metadata)==null?void 0:i.identifier,a=e.email;return s||(a!=null&&a.endsWith("@user.local")?a.replace("@user.local",""):a||"connecté")}function ae(e){const s=Object.entries(e.save.games||{});if(!s.length)return{title:"Aucun jeu",duration:"0m"};const[a,i]=s.sort((v,m)=>(m[1].timePlayedMs||0)-(v[1].timePlayedMs||0))[0],d=T().games.find(v=>v.id===a);return{title:(d==null?void 0:d.title)||a,duration:L(i.timePlayedMs)}}function u(e,s="info"){const a=document.createElement("div");a.className=`toast ${s}`,a.textContent=e,document.body.appendChild(a),requestAnimationFrame(()=>a.classList.add("visible")),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>a.remove(),240)},2400)}function x(e,s){return e||Z(s)||null}function N(e,s,a,i){const d=x(s,i),v=!!d;return`<div class="avatar ${v?"has-image":""}" id="${e}">
    ${v?`<img src="${d}" alt="Avatar" />`:`<span>${a}</span>`}
  </div>`}function D(e){return e?"Image utilisée pour l'avatar (stockée sur Supabase). L'emoji reste disponible en secours.":t.ready?t.user?"Choisis une image, elle sera envoyée sur Supabase.":"Connecte-toi au cloud pour utiliser une image. Emoji disponible hors-ligne.":"Supabase non configuré (.env)."}function A(){var y;const e=((y=document.getElementById("avatar"))==null?void 0:y.value)||"🎮",s=document.getElementById("avatar-preview"),a=document.getElementById("avatar-helper"),i=document.getElementById("avatar-clear"),d=x(h.save.playerProfile.avatarUrl,h.save.playerProfile.avatarStoragePath),v=g?null:l||d,m=!!v;s&&(s.classList.toggle("has-image",m),s.innerHTML=m?`<img src="${v}" alt="Avatar" />`:`<span>${e}</span>`),a&&(a.textContent=D(m)),i&&(i.disabled=!m)}function b(){var n;h=k();const e=h,s=_().achievements,a=new Set(e.save.achievementsUnlocked),i=T(),d=Object.entries(e.save.games),v=t!=null&&t.user?"disabled":"",m=ae(e),y=t.lastSyncedAt?M(t.lastSyncedAt):"Jamais",P=e.save.playerProfile.avatar||"🎮",$=x(e.save.playerProfile.avatarUrl,e.save.playerProfile.avatarStoragePath),E=g?null:l||$,I=D(!!E),S=e.save.playerProfile.lastPlayedGameId?((n=i.games.find(o=>o.id===e.save.playerProfile.lastPlayedGameId))==null?void 0:n.title)??"Inconnu":null,U=t.user?`<span class="chip success">Cloud : ${J(t.user)}</span>`:t.ready?'<span class="chip ghost">Cloud : non connecté</span>':'<span class="chip warning">Supabase non configuré</span>';ee.innerHTML=`
    <div class="page">
      <header class="hero">
        <div class="identity">
          <div class="identity-top">
            ${N("avatar-hero",$,P,e.save.playerProfile.avatarStoragePath)}
            <div>
              <p class="eyebrow">Arcade Galaxy</p>
              <h1>${e.save.playerProfile.name||"Joueur"}</h1>
              <p class="muted">${S?`Dernier jeu : ${S}`:"Aucun jeu lancé"}</p>
            </div>
          </div>
          <div class="chips">
            ${U}
            <span class="chip ghost">Sync : ${y}</span>
            <span class="chip">⏱ ${L(e.save.globalStats.timePlayedMs)}</span>
            <span class="chip">🎮 ${e.save.globalStats.totalSessions} sessions</span>
          </div>
          <div class="identity-actions">
            <a class="btn primary strong" href="${F("/")}">Retour hub</a>
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
            <strong>${a.size}/${s.length}</strong>
            <p class="muted small">Schema v${e.save.schemaVersion}</p>
          </div>
          <div class="stat-card">
            <p class="label">Temps global</p>
            <strong>${L(e.save.globalStats.timePlayedMs)}</strong>
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
                ${N("avatar-preview",E,P,e.save.playerProfile.avatarStoragePath)}
                <p class="muted small" id="avatar-helper">${I}</p>
                <div class="avatar-actions">
                  <label class="file-drop">
                    <input type="file" id="avatar-upload" accept="image/*" />
                    <strong>Image de profil (Supabase)</strong>
                    <span class="muted small">PNG/JPG · 1.5 Mo max</span>
                  </label>
                  <button class="btn ghost danger" id="avatar-clear" type="button" ${E?"":"disabled"}>Revenir à l'emoji</button>
                </div>
              </div>
              <div class="form">
                <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" ${v} /></label>
                <label>Avatar (emoji) <input id="avatar" value="${P}" maxlength="4" /></label>
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
            ${t!=null&&t.user?`<div class="status ok">Connecté : ${J(t.user)}</div>
                   <div class="actions stretch">
                     <button class="btn primary" id="cloud-save" type="button">Sauvegarder vers cloud</button>
                     <button class="btn ghost" id="cloud-load" type="button">Charger depuis cloud</button>
                     <button class="btn ghost danger" id="cloud-logout" type="button">Déconnexion</button>
                   </div>
                   <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save). Dernière synchro : ${y}.</p>`:`<div class="form">
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
              <strong>${L(e.save.globalStats.timePlayedMs)}</strong>
            </div>
            <div>
              <span class="label">Jeux joués</span>
              <strong>${Object.keys(e.save.games).length}/${i.games.length}</strong>
            </div>
            <div>
              <span class="label">Sessions</span>
              <strong>${e.save.globalStats.totalSessions}</strong>
            </div>
          </div>
          <div class="save-list">
            ${d.length?d.map(([o,r])=>`
              <div class="save-row">
                <div>
                  <strong>${o}</strong>
                  <p class="muted small">v${r.saveSchemaVersion} · Dernier : ${M(r.lastPlayedAt)}</p>
                </div>
                <div class="chips-row">
                  <span class="chip ghost">⏱ ${L(r.timePlayedMs)}</span>
                  <span class="chip ghost">🏆 ${r.bestScore??"—"}</span>
                </div>
              </div>
            `).join(""):"<p class='muted'>Aucune sauvegarde par jeu pour le moment.</p>"}
          </div>
        </section>
      </div>
    </div>
  `,se()}function se(){var d,v,m,y,P,$,E,I,S,U;const e=document.getElementById("name"),s=document.getElementById("avatar"),a=document.getElementById("avatar-upload"),i=document.getElementById("avatar-clear");s==null||s.addEventListener("input",A),a==null||a.addEventListener("change",n=>{var c;const o=n.target,r=(c=o.files)==null?void 0:c[0];if(r){if(!t.ready){u("Supabase non configuré pour les avatars.","error"),o.value="";return}if(!t.user){u("Connecte-toi au cloud pour envoyer une image.","error"),o.value="";return}if(!r.type.startsWith("image/")){u("Seules les images sont autorisées.","error"),o.value="";return}if(r.size>te){u("Image trop lourde (1.5 Mo max).","error"),o.value="";return}l&&URL.revokeObjectURL(l),f=r,l=URL.createObjectURL(r),g=!1,A()}}),i==null||i.addEventListener("click",()=>{g=!0,f=null,l&&(URL.revokeObjectURL(l),l=null),A()}),(d=document.getElementById("save-profile"))==null||d.addEventListener("click",async()=>{R=!0;try{const n=h.save.playerProfile.name,o=t!=null&&t.user?n:((e==null?void 0:e.value)||"Joueur").slice(0,18),r=((s==null?void 0:s.value)||"🎮").slice(0,4),c=h.save.playerProfile.avatarStoragePath;let j=h.save.playerProfile.avatarUrl,w=c;if(f){const p=await q(f,c||void 0);if(!p.url||!p.path||p.error){u(p.error||"Upload avatar impossible","error");return}j=p.url,w=p.path}else g&&(j=void 0,w=void 0,c&&t.ready&&t.user&&await Y(c));H(p=>{const G=t!=null&&t.user?p.playerProfile.name:o;p.playerProfile.name=G,p.playerProfile.avatar=r,p.playerProfile.avatarUrl=j,p.playerProfile.avatarStoragePath=w,p.playerProfile.avatarType=j?"image":"emoji"}),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,V({type:"PROFILE_UPDATED"}),u("Profil mis à jour","success"),b()}finally{R=!1}}),(v=document.getElementById("export"))==null||v.addEventListener("click",()=>{try{const n=X(),o=new Blob([n],{type:"application/json"}),r=URL.createObjectURL(o),c=document.createElement("a");c.href=r,c.download="arcade-galaxy-save.json",document.body.appendChild(c),c.click(),c.remove(),URL.revokeObjectURL(r),u("Export JSON prêt","success")}catch(n){console.error("Export JSON failed",n),u("Export impossible","error")}}),(m=document.getElementById("reset"))==null||m.addEventListener("click",()=>{O(),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Progression réinitialisée","info"),b()}),(y=document.getElementById("import-btn"))==null||y.addEventListener("click",()=>{var r;const n=((r=document.getElementById("import"))==null?void 0:r.value)||"",o=C(n);o.success?(f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Import réussi","success"),b()):u(o.error||"Import impossible","error")}),(P=document.getElementById("reset-save"))==null||P.addEventListener("click",()=>{O(),u("Sauvegarde locale réinitialisée","info"),b()}),($=document.getElementById("cloud-login"))==null||$.addEventListener("click",async()=>{var r,c;const n=((r=document.getElementById("cloud-identifier"))==null?void 0:r.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await B("login",{identifier:n,password:o}),b()}),(E=document.getElementById("cloud-register"))==null||E.addEventListener("click",async()=>{var r,c;const n=((r=document.getElementById("cloud-identifier"))==null?void 0:r.value)||"",o=((c=document.getElementById("cloud-password"))==null?void 0:c.value)||"";await B("register",{identifier:n,password:o}),b()}),(I=document.getElementById("cloud-logout"))==null||I.addEventListener("click",async()=>{await B("logout"),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,b()}),(S=document.getElementById("cloud-save"))==null||S.addEventListener("click",async()=>{const n=k(),o=await K(n.save);u(o?"Sauvegarde envoyée dans le cloud.":t.error||"Erreur cloud",o?"success":"error")}),(U=document.getElementById("cloud-load"))==null||U.addEventListener("click",async()=>{const n=await Q();n!=null&&n.state?(C(JSON.stringify(n.state)),f=null,l&&(URL.revokeObjectURL(l),l=null),g=!1,u("Sauvegarde cloud importée.","success"),b()):n!=null&&n.error&&u(n.error,"error")}),A()}b();
