import{a as $,g as B,w}from"./loaders-BqXlQhzP.js";import{g as I,u as k,e as P,a as L,r as x,i as S}from"./index-1ZKvUn09.js";let g=null,t={ready:!!g,user:null};const C=[];function p(){C.forEach(e=>e())}function f(){return t={ready:!1,user:null,error:"Supabase non configuré."},p(),!1}function _(){return t}async function b(e,a){var i;if(!f())return t;if(e==="logout")return await g.auth.signOut(),t={...t,user:null,session:null,message:"Déconnecté"},p(),t;const l=(i=a==null?void 0:a.email)==null?void 0:i.trim(),u=(a==null?void 0:a.password)||"";if(!l||u.length<6)return t={...t,error:"Email/mot de passe invalide."},p(),t;const n=g.auth;try{if(e==="login"){const{data:o,error:v}=await n.signInWithPassword({email:l,password:u});if(v)throw v;t={ready:!0,user:o.user,session:o.session,message:"Connecté"}}else if(e==="register"){const{data:o,error:v}=await n.signUp({email:l,password:u});if(v)throw v;t={ready:!0,user:o.user,session:o.session,message:"Compte créé (vérifie ton email si nécessaire)."}}}catch(o){t={...t,error:(o==null?void 0:o.message)||"Erreur d'auth Supabase"}}return p(),t}async function A(e){if(!f())return!1;if(!t.user)return t={...t,error:"Connecte-toi pour synchroniser."},p(),!1;const{error:a}=await g.from("saves").upsert({user_id:t.user.id,save:e,updated_at:new Date().toISOString()});return a?(t={...t,error:a.message},p(),!1):(t={...t,message:"Sauvegarde envoyée."},p(),!0)}async function j(){if(!f())return{error:"Supabase non configuré."};if(!t.user)return{error:"Connecte-toi pour charger."};const{data:e,error:a}=await g.from("saves").select("save, updated_at").eq("user_id",t.user.id).maybeSingle();return a?{error:a.message}:e?{state:e.save}:{error:"Aucune sauvegarde trouvée."}}const O=document.getElementById("app");function m(){const e=I(),a=$().achievements,l=new Set(e.save.achievementsUnlocked),u=B(),n=_();O.innerHTML=`
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Profil joueur</p>
          <h1>${e.save.playerProfile.avatar} ${e.save.playerProfile.name}</h1>
          <p class="muted">Niveau ${e.save.globalLevel} · ${e.save.globalXP} XP · ${l.size}/${a.length} succès</p>
        </div>
        <div class="actions">
          <a class="btn ghost" href="${w("/apps/home/")}">Accueil</a>
          <a class="btn primary" href="${w("/apps/hub_de_jeux/")}">Hub de jeux</a>
        </div>
      </header>

      <section class="panel">
        <h2>Identité</h2>
        <div class="form">
          <label>Pseudo <input id="name" value="${e.save.playerProfile.name}" maxlength="18" /></label>
          <label>Avatar (emoji) <input id="avatar" value="${e.save.playerProfile.avatar}" maxlength="4" /></label>
          <button class="btn primary" id="save-profile">Enregistrer</button>
        </div>
      </section>

      <section class="panel">
        <h2>Progression</h2>
        <div class="stats">
          <div><span class="label">XP manquants</span><strong>${e.nextLevelXP-e.save.globalXP}</strong></div>
          <div><span class="label">Jeux joués</span><strong>${Object.keys(e.save.games).length}/${u.games.length}</strong></div>
          <div><span class="label">Succès</span><strong>${l.size}/${a.length}</strong></div>
        </div>
      </section>

      <section class="panel">
        <h2>Backup</h2>
        <div class="form">
          <button class="btn ghost" id="export">Exporter JSON</button>
          <button class="btn ghost danger" id="reset">Reset global</button>
          <textarea id="import" placeholder="Colle ici ton export JSON"></textarea>
          <button class="btn primary" id="import-btn">Importer</button>
          <p class="muted small">Les données restent sur ton appareil (localStorage). Aucun service externe n'est utilisé.</p>
        </div>
      </section>

      <section class="panel">
        <h2>Cloud (Supabase)</h2>
        <div class="form">
          <p class="muted small">Synchronisation cross-device via Supabase (Spark gratuit). Renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.</p>
          ${n!=null&&n.user?`<div class="status ok">Connecté : ${n.user.email||"compte sans email"}</div>
                 <div class="actions">
                    <button class="btn primary" id="cloud-save">Sauvegarder vers cloud</button>
                    <button class="btn ghost" id="cloud-load">Charger depuis cloud</button>
                    <button class="btn ghost danger" id="cloud-logout">Déconnexion</button>
                 </div>
                 <p class="muted small">Les données sont stockées dans la table "saves" (clé user_id, JSON save).</p>`:`<label>Email <input id="cloud-email" type="email" placeholder="mail@example.com" /></label>
                 <label>Mot de passe <input id="cloud-password" type="password" placeholder="8+ caractères" /></label>
                 <div class="actions">
                   <button class="btn primary" id="cloud-login">Connexion</button>
                   <button class="btn ghost" id="cloud-register">Créer un compte</button>
                 </div>
                 <div class="status ${n!=null&&n.error?"error":"info"}">${(n==null?void 0:n.message)??"Non connecté"}</div>`}
        </div>
      </section>

      <section class="panel">
        <h2>Succès</h2>
        <div class="ach-list">
          ${a.map(i=>`
                <article class="ach ${l.has(i.id)?"ok":""}">
                  <div class="pill">${i.icon||"⭐️"}</div>
                  <div>
                    <h3>${i.title}</h3>
                    <p class="muted">${i.description}</p>
                  </div>
                </article>
              `).join("")}
        </div>
      </section>
    </div>
  `,U()}function U(){var l,u,n,i,o,v,h,y,E;const e=document.getElementById("name"),a=document.getElementById("avatar");(l=document.getElementById("save-profile"))==null||l.addEventListener("click",()=>{k(s=>{s.playerProfile.name=((e==null?void 0:e.value)||"Joueur").slice(0,18),s.playerProfile.avatar=((a==null?void 0:a.value)||"🎮").slice(0,4)}),P({type:"PROFILE_UPDATED"}),m()}),(u=document.getElementById("export"))==null||u.addEventListener("click",()=>{const s=L(),c=new Blob([s],{type:"application/json"}),r=URL.createObjectURL(c),d=document.createElement("a");d.href=r,d.download="arcade-galaxy-save.json",d.click(),URL.revokeObjectURL(r)}),(n=document.getElementById("reset"))==null||n.addEventListener("click",()=>{x(),m()}),(i=document.getElementById("import-btn"))==null||i.addEventListener("click",()=>{var r;const s=((r=document.getElementById("import"))==null?void 0:r.value)||"",c=S(s);c.success?m():alert(c.error||"Import impossible")}),(o=document.getElementById("cloud-login"))==null||o.addEventListener("click",async()=>{var r,d;const s=((r=document.getElementById("cloud-email"))==null?void 0:r.value)||"",c=((d=document.getElementById("cloud-password"))==null?void 0:d.value)||"";await b("login",{email:s,password:c}),m()}),(v=document.getElementById("cloud-register"))==null||v.addEventListener("click",async()=>{var r,d;const s=((r=document.getElementById("cloud-email"))==null?void 0:r.value)||"",c=((d=document.getElementById("cloud-password"))==null?void 0:d.value)||"";await b("register",{email:s,password:c}),m()}),(h=document.getElementById("cloud-logout"))==null||h.addEventListener("click",async()=>{await b("logout"),m()}),(y=document.getElementById("cloud-save"))==null||y.addEventListener("click",async()=>{const s=I();await A(s.save)&&alert("Sauvegarde envoyée dans le cloud.")}),(E=document.getElementById("cloud-load"))==null||E.addEventListener("click",async()=>{const s=await j();s!=null&&s.state?(S(JSON.stringify(s.state)),alert("Sauvegarde cloud importée."),m()):s!=null&&s.error&&alert(s.error)})}m();
