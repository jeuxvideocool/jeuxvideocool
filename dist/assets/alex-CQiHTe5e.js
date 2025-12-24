import{A as x,w as v,g as R,c as E}from"./index-CK9lGSzJ.js";import{subscribe as B,getAuthState as I}from"./cloud-CKXTOD0h.js";const y=document.getElementById("app");let m=I(),k=!1,c=null,S="";function X(){y.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Arcade Galaxy</p>
            <h1>Synchronisation cloud en cours</h1>
            <p class="lead">Chargement de ta sauvegarde avant l'accès au secret.</p>
            <div class="hero-actions">
              <a class="btn ghost" href="${v("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function z(){y.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Vérification</p>
            <h1>Contrôle d'accès en cours</h1>
            <p class="lead">On vérifie si ce compte a le droit d'entrer.</p>
            <div class="hero-actions">
              <a class="btn primary" href="${v("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function O(s){y.innerHTML=`
    <div class="page">
      <main class="shell">
        <header class="hero">
          <div class="hero-content">
            <p class="overline">Accès restreint</p>
            <h1>Page réservée au compte Alex</h1>
            <p class="lead">${s}</p>
            <div class="hero-actions">
              <a class="btn primary" href="${v("/")}">Retour au hub</a>
            </div>
          </div>
        </header>
      </main>
    </div>
  `}function F(s){var i;if(!s)return null;const t=(i=s.user_metadata)==null?void 0:i.identifier;if(t)return t;const n=s.email||"";if(!n)return null;if(n.endsWith("@user.local"))return n.replace("@user.local","");const e=n.indexOf("@");return e>0?n.slice(0,e):n}function H(s){const t=F(s);return(t==null?void 0:t.trim().toLowerCase())===x.requiredName.trim().toLowerCase()}function N(){c!=="checking"&&(c="checking",z())}function V(){c!=="gate"&&(c="gate",X())}function M(s){c==="denied"&&S===s||(c="denied",S=s,O(s))}function G(){c!=="secret"&&(c="secret",W())}function T(){if(!m.ready){M("Supabase n'est pas configuré pour vérifier l'identité.");return}if(!k){N();return}if(!m.user){M("Connecte-toi au cloud depuis le hub pour déverrouiller l'accès.");return}if(!H(m.user)){M("Tu n'es pas connecté avec le compte Alex.");return}if(!m.hydrated){V();return}G()}function W(){const t=R().save;if(!E(t)){window.location.replace(v("/"));return}const n="Alexiane",e=t.playerProfile.avatar||"💫",i=t.globalXP.toLocaleString("fr-FR"),r=x.minXP.toLocaleString("fr-FR"),o=Math.min(100,Math.max(12,Math.round(t.globalXP/(x.minXP*1.25)*100))),f=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),d=["Bon. C’est officiel. Tu as atteint le niveau requis.","Ce qui signifie surtout une chose : oui, tu es vieille. Pas symboliquement. Administrativement.","On pourrait parler d’expérience, de maturité, de sagesse… mais soyons honnêtes : c’est surtout l’accumulation des années qui a fini par faire le boulot.","D’ailleurs, petit rappel utile : se niquer une cheville sur un micro-rebord de rien du tout, c’est pas un bug du décor, c’est un indice.","Donc si tu as joué sur ton téléphone, j’espère sincèrement que tu as levé les yeux de temps en temps. Ce serait dommage de rajouter une deuxième cheville au tableau.","Mais revenons au sujet : cet achievement. Pas une surprise, plutôt une étape inévitable. Comme les lunettes qui apparaissent soudainement “juste pour lire”.","Tu n'y es pas encore, mais ça ne saurait tarder ! Regarde Elo....(Ouais elle prend sa balle perdue aussi !!).","Vu que tu adores les mots gentils, les paillettes et tout ce genre de trucs, je voulais te dire que tu es une personne remarquable. Toujours le sourire, attentionnée, drôle et intelligente.","Mais en vrai je sais très bien que là, tu es en train de vomir intérieurement.","Du coup je vais rééquilibrer tout ça : va te faire foutre amicalement :D","Joyeux Anninoël : cadeau d’anniversaire ET de Noël, accès au site le 24 au soir oblige.","Bref, respect quand même. Et maintenant… comme tu veux."],g=["Accès débloqué (avec assistance)","Achievement validé malgré l’âge"],b=v("/");y.innerHTML=`
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
            <span class="tag">Accès débloqué</span>
            <span class="topbar-title">Alexiane · Un joyeux Anni-noël</span>
          </div>
        </nav>

        <header class="hero">
          <div class="hero-content">
            <p class="overline">Niveau requis atteint · ${r} XP</p>
            <h1>
              ${e} ${n}, objectif atteint.
            </h1>
            <p class="lead">
              Tu as atteint l'expérience requise. Voici le message qui va avec !
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${b}">Retour au hub</a>
            </div>
            <div class="chips">
              <span>XP ${i}</span>
              <span>Achievement validé</span>
            </div>
          </div>
          <aside class="hero-panel">
            <div class="profile">
              <div class="avatar">${e}</div>
              <div class="profile-info">
                <span>Compte autorisé</span>
                <strong>${n}</strong>
                <em>Validation du ${f}</em>
              </div>
            </div>
            <div class="meter">
              <div class="meter-bar"><span style="width: ${o}%"></span></div>
              <div class="meter-meta">
                <span>Progression</span>
                <strong>${o}%</strong>
              </div>
            </div>
            <div class="badge-row">
              ${g.map(u=>`<span>${u}</span>`).join("")}
            </div>
          </aside>
        </header>

        <section class="cards-grid">
          <article class="card card-accent">
            <div class="card-head">
              <span class="pill">Message</span>
              <h2>Le mot qui va bien</h2>
            </div>
            <div class="message">
              ${d.map(u=>`<p>${u}</p>`).join("")}
            </div>
            <div class="signature">— La dream team</div>
          </article>

<article class="card">
  <div class="card-head">
    <span class="pill">Dernier mot</span>
    <h2>Merci, vraiment</h2>
  </div>
  <p>
    On te chambre, on te pique, on exagère… mais le fond est simple :
    merci pour tout ce que tu fais, pour ce que tu donnes, et pour être
    exactement comme tu es (même quand tu râles).
  </p>
  <div class="signature">— Signé : la DREAM TEAM, avec affection (si si)</div>
</article>


      </main>
    </div>
  `,_()}function _(){const s=document.getElementById("fireworks");if(!s)return;const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=t?.55:1,e=s.getContext("2d");if(!e)return;let i=0,r=0,o=1;const f=["#ffd27a","#6de3ff","#ff89c4","#ffe96b","#8dffb0"],d=[],g=()=>{o=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,r=window.innerHeight,s.width=Math.round(i*o),s.height=Math.round(r*o),s.style.width=`${i}px`,s.style.height=`${r}px`,e.setTransform(o,0,0,o,0,0)},b=(p,l,a=1)=>{const h=Math.round(82*a*n);for(let w=0;w<h;w+=1){const $=Math.random()*Math.PI*2,L=(Math.random()*2.6+(t?1.7:2.6))*a,D=Math.random()*2.4+1.8;d.push({x:p,y:l,vx:Math.cos($)*L,vy:Math.sin($)*L,alpha:1,decay:(.007+Math.random()*.01)*(t?1.05:1),size:D,color:f[Math.floor(Math.random()*f.length)]})}};let u=!1;const A=()=>{e.globalCompositeOperation="source-over",e.fillStyle="rgba(5, 6, 12, 0.1)",e.fillRect(0,0,i,r),e.globalCompositeOperation="lighter";const p=t?.028:.035;for(let l=d.length-1;l>=0;l-=1){const a=d[l];if(a.vy+=p,a.vx*=.985,a.vy*=.985,a.x+=a.vx,a.y+=a.vy,a.alpha-=a.decay,a.alpha<=0){d.splice(l,1);continue}const h=a.size*6.2;e.globalAlpha=a.alpha*.22,e.fillStyle=a.color,e.shadowBlur=50*n,e.shadowColor=a.color,e.beginPath(),e.arc(a.x,a.y,h,0,Math.PI*2),e.fill();const w=a.size*3.4;e.globalAlpha=a.alpha*.7,e.fillStyle=a.color,e.shadowBlur=34*n,e.shadowColor=a.color,e.beginPath(),e.arc(a.x,a.y,w,0,Math.PI*2),e.fill(),e.globalAlpha=a.alpha*.95,e.shadowBlur=18*n,e.beginPath(),e.arc(a.x,a.y,a.size,0,Math.PI*2),e.fill()}d.length>0?requestAnimationFrame(A):u=!1},q=()=>{u||(u=!0,requestAnimationFrame(A))};g(),window.addEventListener("resize",g);const P=t?520:300,j=t?820:640,C=()=>{const p=P+Math.random()*(j-P);window.setTimeout(()=>{const l=i*(.16+Math.random()*.68),a=r*(.18+Math.random()*.55),h=(.75+Math.random()*.6)*n;b(l,a,h),q(),C()},p)};b(i*.5,r*.3,1.3*n),q(),C()}B(s=>{m=s,k=!0,T()});T();
