import{a as v,g as m,w as p}from"./loaders-BqXlQhzP.js";import{g as u,u as g,e as h,a as b,r as y,i as f}from"./index-1ZKvUn09.js";const $=document.getElementById("app");function r(){const e=u(),t=v().achievements,a=new Set(e.save.achievementsUnlocked),o=m();$.innerHTML=`
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Profil joueur</p>
          <h1>${e.save.playerProfile.avatar} ${e.save.playerProfile.name}</h1>
          <p class="muted">Niveau ${e.save.globalLevel} · ${e.save.globalXP} XP · ${a.size}/${t.length} succès</p>
        </div>
        <div class="actions">
          <a class="btn ghost" href="${p("/apps/home/")}">Accueil</a>
          <a class="btn primary" href="${p("/apps/hub_de_jeux/")}">Hub de jeux</a>
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
          <div><span class="label">Jeux joués</span><strong>${Object.keys(e.save.games).length}/${o.games.length}</strong></div>
          <div><span class="label">Succès</span><strong>${a.size}/${t.length}</strong></div>
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
        <h2>Succès</h2>
        <div class="ach-list">
          ${t.map(s=>`
                <article class="ach ${a.has(s.id)?"ok":""}">
                  <div class="pill">${s.icon||"⭐️"}</div>
                  <div>
                    <h3>${s.title}</h3>
                    <p class="muted">${s.description}</p>
                  </div>
                </article>
              `).join("")}
        </div>
      </section>
    </div>
  `,E()}function E(){var a,o,s,d;const e=document.getElementById("name"),t=document.getElementById("avatar");(a=document.getElementById("save-profile"))==null||a.addEventListener("click",()=>{g(n=>{n.playerProfile.name=((e==null?void 0:e.value)||"Joueur").slice(0,18),n.playerProfile.avatar=((t==null?void 0:t.value)||"🎮").slice(0,4)}),h({type:"PROFILE_UPDATED"}),r()}),(o=document.getElementById("export"))==null||o.addEventListener("click",()=>{const n=b(),i=new Blob([n],{type:"application/json"}),l=URL.createObjectURL(i),c=document.createElement("a");c.href=l,c.download="arcade-galaxy-save.json",c.click(),URL.revokeObjectURL(l)}),(s=document.getElementById("reset"))==null||s.addEventListener("click",()=>{y(),r()}),(d=document.getElementById("import-btn"))==null||d.addEventListener("click",()=>{var l;const n=((l=document.getElementById("import"))==null?void 0:l.value)||"",i=f(n);i.success?r():alert(i.error||"Import impossible")})}r();
