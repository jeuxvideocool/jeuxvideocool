function N(){const n=new Set,o=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"]),s=e=>{o.has(e.code)&&e.preventDefault(),n.add(e.code)},t=e=>{o.has(e.code)&&e.preventDefault(),n.delete(e.code)};return window.addEventListener("keydown",s),window.addEventListener("keyup",t),{isDown:e=>n.has(e),dispose(){window.removeEventListener("keydown",s),window.removeEventListener("keyup",t),n.clear()}}}function Y(){const n=N(),o=new Set,s=(e,a)=>{e&&(a?o.add(e):o.delete(e))};return{isDown:e=>n.isDown(e)||o.has(e),bindButton:(e,a)=>{const v=b=>{b.preventDefault(),s(a,!0)},l=b=>{b.preventDefault(),s(a,!1)};return e.addEventListener("pointerdown",v,{passive:!1}),e.addEventListener("pointerup",l,{passive:!1}),e.addEventListener("pointercancel",l,{passive:!1}),e.addEventListener("pointerleave",l,{passive:!1}),()=>{e.removeEventListener("pointerdown",v),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l),e.removeEventListener("pointerleave",l),s(a,!1)}},press:e=>s(e,!0),release:e=>s(e,!1),dispose:()=>{n.dispose(),o.clear()}}}let S=!1;function j(){if(S)return;S=!0;const n=document.createElement("style");n.textContent=`
    .mobile-controls {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 12px;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .mobile-controls.hidden-desktop {
      display: none;
    }
    @media (max-width: 1024px) {
      .mobile-controls.hidden-desktop {
        display: grid;
      }
    }
    .mobile-controls.mc-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
    }
    .mobile-pad, .mobile-actions {
      pointer-events: all;
      align-self: end;
    }
    .mobile-pad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 6px;
      width: 168px;
      max-width: 36vw;
      justify-self: start;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      padding: 10px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .mobile-actions {
      display: flex;
      gap: 10px;
      justify-self: end;
    }
    .mobile-btn {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.18);
      background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
      color: #f7fbff;
      font-weight: 800;
      font-size: 15px;
      box-shadow: 0 10px 22px rgba(0,0,0,0.26);
      cursor: pointer;
      touch-action: none;
    }
    .mobile-btn:active {
      transform: scale(0.96);
      background: linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
    }
    .mobile-fs-btn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.08);
      color: #f7fbff;
      font-weight: 800;
      font-size: 18px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.26);
      cursor: pointer;
      touch-action: manipulation;
    }
    .mobile-fs-btn:active {
      transform: scale(0.95);
    }
    .mobile-gesture {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      touch-action: none;
      z-index: 29;
    }
    @media (min-width: 1025px) {
      .mobile-gesture {
        display: none;
      }
    }
  `,document.head.appendChild(n)}function w(n,o,s){const t=document.createElement("button");return t.type="button",t.className="mobile-btn",t.textContent=n,o?s.bindButton(t,o):t.disabled=!0,t}function M(n,o,s){const t={x:0,y:0};let e=!1,a={x:0,y:0};const v=10,l=()=>{["up","down","left","right"].forEach(i=>{const u=o[i];u&&s.release(u)})},b=(i,u)=>{l();const g=Math.abs(i),h=Math.abs(u);g<v&&h<v||(g>h?(i>0&&o.right&&s.press(o.right),i<0&&o.left&&s.press(o.left)):(u>0&&o.down&&s.press(o.down),u<0&&o.up&&s.press(o.up)))},d=i=>{i.preventDefault(),e=!0,a={x:i.clientX,y:i.clientY}},r=i=>{e&&(i.preventDefault(),e&&(t.x=i.clientX-a.x,t.y=i.clientY-a.y,b(t.x,t.y)))},f=()=>{e=!1,t.x=0,t.y=0,l()};return n.addEventListener("pointerdown",d,{passive:!1}),n.addEventListener("pointermove",r,{passive:!1}),n.addEventListener("pointerup",f,{passive:!1}),n.addEventListener("pointercancel",f,{passive:!1}),n.addEventListener("pointerleave",f,{passive:!1}),()=>{n.removeEventListener("pointerdown",d),n.removeEventListener("pointermove",r),n.removeEventListener("pointerup",f),n.removeEventListener("pointercancel",f),n.removeEventListener("pointerleave",f),l()}}function F(n){const{container:o,input:s,mapping:t,showOnDesktop:e=!1,autoShow:a=!0,showFullscreenToggle:v=!0,showPad:l=!1,gestureEnabled:b=!0}=n;if(!o)return{dispose:()=>{}};j();const d=document.createElement("div");d.className=`mobile-controls ${e?"":"hidden-desktop"}`.trim(),a||d.classList.add("mc-hidden"),d.style.display=a?"grid":"none";const r=document.createElement("div");r.className="mobile-pad";const f=w("↑",t.up,s),i=w("↓",t.down,s),u=w("←",t.left,s),g=w("→",t.right,s);r.appendChild(document.createElement("div")),r.appendChild(f),r.appendChild(document.createElement("div")),r.appendChild(u),r.appendChild(document.createElement("div")),r.appendChild(g),r.appendChild(document.createElement("div")),r.appendChild(i),r.appendChild(document.createElement("div"));const h=document.createElement("div");h.className="mobile-actions";const E=t.actionA?w(t.actionALabel||"A",t.actionA,s):null,L=t.actionB?w(t.actionBLabel||"B",t.actionB,s):null;E&&h.appendChild(E),L&&h.appendChild(L);const k=!!(t.up||t.down||t.left||t.right),D=k&&l,B=!!(E||L);D&&d.appendChild(r),B&&d.appendChild(h);const m=v?document.createElement("button"):null;if(m){m.type="button",m.className="mobile-fs-btn",m.textContent="⤢",m.title="Plein écran",m.addEventListener("click",()=>{var y,A;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):(A=(y=document.documentElement)==null?void 0:y.requestFullscreen)==null||A.call(y).catch(()=>{})});const p=document.createElement("div");p.style.pointerEvents="all",p.style.alignSelf="start",p.style.justifySelf="end",p.appendChild(m),d.appendChild(p)}let x,c;k&&b&&(c=document.createElement("div"),c.className="mobile-gesture",c.style.background="transparent",o.appendChild(c),x=M(c,t,s)),(D||B||m)&&o.appendChild(d);const C=p=>{d.classList.toggle("mc-hidden",!p),d.style.display=p?"grid":"none",c&&(c.style.display=p?"block":"none",c.style.pointerEvents=p?"all":"none")};return C(a),{show(){C(!0)},hide(){C(!1)},dispose(){d.remove(),c!=null&&c.parentElement&&c.remove(),x==null||x()}}}export{F as a,Y as c};
