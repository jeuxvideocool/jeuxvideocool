import{g as I,c as M,w as t,A as n}from"./index-D6AlT0_O.js";const T=document.getElementById("app"),q=I(),i=q.save,C=e=>e[Math.floor(Math.random()*e.length)];if(!M(i))window.location.replace(t("/"));else{const e=i.playerProfile.name||"Alex",l=i.playerProfile.avatar||"✨",r=i.globalXP.toLocaleString("fr-FR"),o=n.minXP.toLocaleString("fr-FR"),c=Math.min(100,Math.max(12,Math.round(i.globalXP/(n.minXP*1.3)*100))),p=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),u=["Ton pseudo a allumé le mode VIP, les serveurs ont applaudi, la page s'est habillée en premium.","C'est officiel : le moteur d'achievement t'a réservé une édition luxe, designée aux petits oignons.","On a mis un supplément de style dans l'algorithme, et il a voté pour toi sans hésiter."],v=[{icon:"✨",title:"Signature exclusive",text:"Un cachet premium réservé à une seule personne."},{icon:"🛡️",title:"Bouclier anti-bad vibes",text:"Protection deluxe contre les journées grises, calibrée pour toi."},{icon:"🏆",title:"Trophée unique",text:"Pièce 1/1 gravée à ton nom. Impossible à copier."},{icon:"💎",title:"Pass premium XL",text:"Accès illimité aux moments stylés et aux boosts inattendus."}],h=[{icon:"🎧",text:"Playlist de victoire (imaginaire mais certifiée stylée)."},{icon:"🪄",text:"Sort bonus : sourire qui déclenche le mode signature."},{icon:"🚀",text:"Accélérateur de bonne vibe à usage illimité."}],m=["Édition 1/1","Premium","Sur-mesure","Fun garanti"],y=[{x:14,y:18,hue:36,delay:"0s",size:180},{x:78,y:16,hue:188,delay:"0.5s",size:200},{x:60,y:48,hue:10,delay:"1.1s",size:150},{x:24,y:62,hue:48,delay:"1.7s",size:190},{x:72,y:70,hue:112,delay:"2.3s",size:170},{x:42,y:30,hue:220,delay:"2.9s",size:160}],g=[{x:8,y:12,delay:"0s",duration:"8s"},{x:72,y:18,delay:"2.5s",duration:"9s"},{x:30,y:38,delay:"5s",duration:"10s"}],$=Array.from({length:32},(s,a)=>{const P=(a*7+12)%100,k=6+a%7,A=8+a%6,S=(a*.35).toFixed(2),z=(a*32+20)%360,L=120+a%5*10,X=(a%2===0?320:-320)+a*9,j=(a%2===0?18:-18)+a%5,w=a%3===0?"999px":"4px";return{x:P,size:k,duration:A,delay:S,hue:z,fall:L,rotate:X,sway:j,round:w}}),x=t("/"),f=t("/apps/profil/"),b=Array.from({length:10},(s,a)=>({rotate:a*36,delay:`${(a*.25).toFixed(2)}s`})),d=`${e} — Édition Surprise — Premium — Achievement unique — ${o} XP —`;T.innerHTML=`
    <div class="page">
      <div class="backdrop" aria-hidden="true">
        <div class="aurora"></div>
        <div class="halo halo-a"></div>
        <div class="halo halo-b"></div>
        <div class="halo halo-c"></div>
        <div class="laser-grid"></div>
        <div class="spotlight"></div>
      </div>
      <div class="spark-sweep" aria-hidden="true"></div>
      <div class="streaks" aria-hidden="true">
        ${g.map(s=>`<span class="streak" style="--x:${s.x}%; --y:${s.y}%; --delay:${s.delay}; --duration:${s.duration};"></span>`).join("")}
      </div>
      <div class="confetti" aria-hidden="true">
        ${$.map(s=>`<span class="confetti-piece" style="--x:${s.x}%; --size:${s.size}px; --duration:${s.duration}s; --delay:${s.delay}s; --hue:${s.hue}; --fall:${s.fall}vh; --rotate:${s.rotate}deg; --sway:${s.sway}; --round:${s.round};"></span>`).join("")}
      </div>
      <div class="fireworks" aria-hidden="true">
        ${y.map(s=>`<span class="firework" style="--x:${s.x}%; --y:${s.y}%; --hue:${s.hue}; --delay:${s.delay}; --size:${s.size}px;"></span>`).join("")}
      </div>

      <main class="shell">
        <nav class="topbar reveal" style="--delay: 0.05s">
          <div class="brand">
            <span class="badge">Achievement débloqué</span>
            <span class="brand-title">Surprise Alex · Édition ultra-personnalisée</span>
          </div>
          <div class="seal">
            <span>ID secret</span>
            <strong>${n.achievementId}</strong>
          </div>
        </nav>

        <header class="hero reveal" style="--delay: 0.12s">
          <div class="hero-main">
            <p class="overline">Accès validé · ${o} XP</p>
            <h1>
              ${l} ${e}, l'édition <span class="highlight">Surprise Premium</span> est activée.
            </h1>
            <p class="sub">
              ${C(u)} C'est un achievement unique, calibré pour une seule personne : toi.
            </p>
            <div class="hero-actions">
              <a class="btn primary" href="${x}">Retour au hub</a>
              <a class="btn ghost" href="${f}">Ton profil</a>
            </div>
            <div class="hero-meta">
              <span class="chip">XP ${r}</span>
              <span class="chip">Premium garanti</span>
              <span class="chip">Mode Signature</span>
            </div>
          </div>
          <aside class="hero-card">
            <div class="hero-card-top">
              <div class="avatar-ring">
                <div class="avatar">${l}</div>
              </div>
              <div class="hero-id">
                <p class="label">Propriétaire officiel</p>
                <strong>${e}</strong>
                <span class="small">Cachet ${p}</span>
              </div>
            </div>
            <div class="meter-ring" style="--value:${c}">
              <span>${c}%</span>
              <p>Hype meter</p>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <span>XP total</span>
                <strong>${r}</strong>
              </div>
              <div class="stat">
                <span>Statut</span>
                <strong>Édition unique</strong>
              </div>
              <div class="stat">
                <span>Aura</span>
                <strong>Aura signature</strong>
              </div>
            </div>
          </aside>
        </header>

        <section class="moment reveal" style="--delay: 0.2s">
          <article class="card aura-card" aria-hidden="true">
            <div class="aura-core"></div>
            <div class="aura-ring"></div>
            <div class="aura-ring alt"></div>
            <div class="aura-rays">
              ${b.map(s=>`<span style="--rotate:${s.rotate}deg; --delay:${s.delay};"></span>`).join("")}
            </div>
          </article>
          <article class="card capsule-card">
            <div class="card-head">
              <span class="pill">Capsule secrète</span>
              <h2>Boost instantané</h2>
            </div>
            <p class="capsule-text">
              Tout est calibré pour un boost immédiat : intensité, énergie et bonne vibe en édition ${e}.
            </p>
            <div class="capsule-list">
              ${h.map(s=>`<div class="capsule-item"><span>${s.icon}</span><p>${s.text}</p></div>`).join("")}
            </div>
          </article>
        </section>

        <section class="perks-grid reveal" style="--delay: 0.28s">
          ${v.map(s=>`
              <article class="perk-card">
                <div class="perk-icon">${s.icon}</div>
                <h3>${s.title}</h3>
                <p>${s.text}</p>
              </article>
            `).join("")}
        </section>

        <section class="card message-card reveal" style="--delay: 0.36s">
          <div class="message-main">
            <span class="pill">Message perso</span>
            <h3>Spotlight sur ${e}</h3>
            <p>
              Ici, ${e}, tu es la tête d'affiche. Cette page est un coffre-fort d'énergie positive :
              ouverte 24/7, jamais en rupture de style, toujours en mode premium.
            </p>
            <div class="message-tags">
              ${m.map(s=>`<span>${s}</span>`).join("")}
            </div>
          </div>
          <div class="message-side">
            <div class="stamp">
              <span>VIP</span>
              <em>Édition 1/1</em>
            </div>
            <p class="signature">Signature officielle : ${e}</p>
          </div>
        </section>

        <section class="ticker reveal" style="--delay: 0.44s" aria-hidden="true">
          <div class="ticker-track">
            <span>${d}</span>
            <span>${d}</span>
          </div>
        </section>
      </main>
    </div>
  `}
