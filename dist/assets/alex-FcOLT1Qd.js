import{A as f,w as h,g as T,c as I}from"./index-CsvP8RUZ.js";import{subscribe as D,getAuthState as V}from"./cloud-CQZoWt0Z.js";const g=document.getElementById("app");let u=V(),q=!1,c=null,k="";const y=e=>e[Math.floor(Math.random()*e.length)];function X(){g.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Arcade Galaxy</p>
            <h1>Synchronisation cloud en cours</h1>
            <p class="lead">Chargement de ta sauvegarde avant l'accès au secret.</p>
            <div class="hero-actions">
              <a class="btn ghost" href="${h("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function E(){g.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Vérification</p>
            <h1>Contrôle d'accès en cours</h1>
            <p class="lead">On vérifie si ce compte a le droit d'entrer.</p>
            <div class="hero-actions">
              <a class="btn primary" href="${h("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function F(e){g.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès restreint</p>
            <h1>Page réservée au compte Alex</h1>
            <p class="lead">${e}</p>
            <div class="hero-actions">
              <a class="btn primary" href="${h("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function z(e){var r;if(!e)return null;const n=(r=e.user_metadata)==null?void 0:r.identifier;if(n)return n;const a=e.email||"";if(!a)return null;if(a.endsWith("@user.local"))return a.replace("@user.local","");const i=a.indexOf("@");return i>0?a.slice(0,i):a}function H(e){const n=z(e);return(n==null?void 0:n.trim().toLowerCase())===f.requiredName.trim().toLowerCase()}function O(){c!=="checking"&&(c="checking",E())}function j(){c!=="gate"&&(c="gate",X())}function x(e){c==="denied"&&k===e||(c="denied",k=e,F(e))}function B(){c!=="secret"&&(c="secret",G())}function S(){if(!u.ready){x("Supabase n'est pas configuré pour vérifier l'identité.");return}if(!q){O();return}if(!u.user){x("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");return}if(!H(u.user)){x("Tu n'es pas connecté avec le compte Alex.");return}if(!u.hydrated){j();return}B()}function G(){const n=T().save;if(!I(n)){window.location.replace(h("/"));return}const a="Alexiane",i=n.playerProfile.avatar||"💫",r=n.globalXP.toLocaleString("fr-FR"),o=f.minXP.toLocaleString("fr-FR"),d=Math.min(100,Math.max(12,Math.round(n.globalXP/(f.minXP*1.25)*100))),l=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),v=["Tu viens de passer en mode prestige : plus de style, zéro filtre.","On a tenté de faire sobre. Le code a répondu : « Alexiane, impossible ».","C'est la page secrète qui dit haut et fort que tu as le swag intégré."],b=["Vote unanime : garder Alexiane au sommet, ajouter une dose de fun et signer tout de suite.","Après examen, on confirme : niveau charme 9000, option premium activée.","Résultat du scan : rareté maximale, humour calibré, classe automatique."],p=["Si quelqu'un demande comment tu as débloqué ça, réponds « secret de fabrication ».","Tu peux revenir ici quand tu veux, c'est ton lounge privé.","Attention : cette page peut provoquer des sourires incontrôlables."],m=["Sourire naturel : activé","Style : premium","Vibes : stables","Punchlines : prêtes"],w=["Édition 1/1","Validé par le comité","Premium certifié"],M=h("/");g.innerHTML=`
    <div class="page">
      <canvas id="fireworks" class="fireworks" aria-hidden="true"></canvas>
      <div class="backdrop" aria-hidden="true">
        <span class="glow glow-a"></span>
        <span class="glow glow-b"></span>
        <span class="glow glow-c"></span>
        <span class="backdrop-grid"></span>
      </div>

      <main class="shell">
        <nav class="topbar">
          <div class="topbar-left">
            <span class="tag">Achievement exclusif</span>
            <span class="topbar-title">Alexiane · Édition sur-mesure</span>
          </div>
          <div class="topbar-right">
            <span>ID secret</span>
            <strong>${f.achievementId}</strong>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès validé · ${o} XP</p>
            <h1>
              ${i} ${a}, tu as débloqué la version <span>Prestige</span>.
            </h1>
            <p class="lead">
              ${y(v)} Une page pensée pour une seule personne : toi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${M}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${r}</span>
              <span>VIP réel</span>
              <span>Signature moderne</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${i}</div>
              <div class="profile-info">
                <span>Propriétaire officielle</span>
                <strong>${a}</strong>
                <em>Cachet du ${l}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${d}%"></span></div>
              <div class="meter-meta">
                <span>Prestige</span>
                <strong>${d}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${w.map(t=>`<span>${t}</span>`).join("")}
            </div>
          </aside>
        </header>

        <section class="cards-grid">
          <article class="card card-accent">
            <div class="card-head">
              <span class="pill">Comité secret</span>
              <h2>Décision officielle</h2>
            </div>
            <p>${y(b)}</p>
            <div class="card-tags">
              <span>Validé</span>
              <span>Drôle</span>
              <span>Premium</span>
            </div>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Checklist</span>
              <h2>Version Alexiane</h2>
            </div>
            <ul>
              ${m.map(t=>`<li>${t}</li>`).join("")}
            </ul>
          </article>

          <article class="card">
            <div class="card-head">
              <span class="pill">Message privé</span>
              <h2>Mot doux calibré</h2>
            </div>
            <p>
              Tu es la preuve qu'on peut être drôle, brillante et ultra stylée en même temps.
              On a donc mis tout ça au propre, en version premium.
            </p>
            <div class="signature">— L'équipe (qui note tout)</div>
          </article>
        </section>

        <section class="callout">
          <div>
            <span class="callout-label">PS</span>
            <p>${y(p)}</p>
          </div>
          <div class="callout-seal">
            <span>${a}</span>
            <em>Édition prestige</em>
          </div>
        </section>
      </main>
    </div>
  `,N()}function N(){const e=document.getElementById("fireworks");if(!e||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=e.getContext("2d");if(!a)return;let i=0,r=0,o=1;const d=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],l=[],v=()=>{o=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,r=window.innerHeight,e.width=Math.round(i*o),e.height=Math.round(r*o),e.style.width=`${i}px`,e.style.height=`${r}px`,a.setTransform(o,0,0,o,0,0)},b=(t,s,A=1)=>{const C=Math.round(60*A);for(let P=0;P<C;P+=1){const $=Math.random()*Math.PI*2,L=(Math.random()*3+2.2)*A,R=Math.random()*2+1.4;l.push({x:t,y:s,vx:Math.cos($)*L,vy:Math.sin($)*L,alpha:1,decay:.012+Math.random()*.016,size:R,color:d[Math.floor(Math.random()*d.length)]})}};let p=!1;const m=()=>{a.clearRect(0,0,i,r),a.globalCompositeOperation="lighter";for(let t=l.length-1;t>=0;t-=1){const s=l[t];if(s.vy+=.04,s.vx*=.98,s.vy*=.98,s.x+=s.vx,s.y+=s.vy,s.alpha-=s.decay,s.alpha<=0){l.splice(t,1);continue}a.globalAlpha=s.alpha,a.fillStyle=s.color,a.beginPath(),a.arc(s.x,s.y,s.size,0,Math.PI*2),a.fill()}l.length>0?requestAnimationFrame(m):p=!1},w=()=>{p||(p=!0,requestAnimationFrame(m))};v(),window.addEventListener("resize",v),[{delay:0,x:.2,y:.32,power:1.2},{delay:180,x:.5,y:.22,power:1.4},{delay:360,x:.8,y:.3,power:1.2},{delay:700,x:.35,y:.45,power:1.05},{delay:920,x:.68,y:.4,power:1.15}].forEach(t=>{window.setTimeout(()=>{b(i*t.x,r*t.y,t.power),w()},t.delay)})}D(e=>{u=e,q=!0,S()});S();
