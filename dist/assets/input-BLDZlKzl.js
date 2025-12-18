function g(){const o=new Set,d=e=>o.add(e.code),n=e=>o.delete(e.code);return window.addEventListener("keydown",d),window.addEventListener("keyup",n),{isDown:e=>o.has(e),dispose(){window.removeEventListener("keydown",d),window.removeEventListener("keyup",n),o.clear()}}}function x(){const o=g(),d=new Set,n=(t,a)=>{t&&(a?d.add(t):d.delete(t))};return{isDown:t=>o.isDown(t)||d.has(t),bindButton:(t,a)=>{const i=p=>{p.preventDefault(),n(a,!0)},s=p=>{p.preventDefault(),n(a,!1)};return t.addEventListener("pointerdown",i,{passive:!1}),t.addEventListener("pointerup",s,{passive:!1}),t.addEventListener("pointercancel",s,{passive:!1}),t.addEventListener("pointerleave",s,{passive:!1}),()=>{t.removeEventListener("pointerdown",i),t.removeEventListener("pointerup",s),t.removeEventListener("pointercancel",s),t.removeEventListener("pointerleave",s),n(a,!1)}},press:t=>n(t,!0),release:t=>n(t,!1),dispose:()=>{o.dispose(),d.clear()}}}let f=!1;function w(){if(f)return;f=!0;const o=document.createElement("style");o.textContent=`
    .mobile-controls {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 30;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 12px;
    }
    .mobile-controls.hidden-desktop {
      display: none;
    }
    @media (max-width: 1024px) {
      .mobile-controls.hidden-desktop {
        display: grid;
      }
    }
    .mobile-pad, .mobile-actions {
      pointer-events: all;
      align-self: end;
    }
    .mobile-pad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 8px;
      width: 200px;
      max-width: 42vw;
      justify-self: start;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      padding: 10px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .mobile-actions {
      display: flex;
      gap: 12px;
      justify-self: end;
    }
    .mobile-btn {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.18);
      background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
      color: #f7fbff;
      font-weight: 800;
      font-size: 16px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.28);
      cursor: pointer;
      touch-action: none;
    }
    .mobile-btn:active {
      transform: scale(0.96);
      background: linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
    }
  `,document.head.appendChild(o)}function r(o,d,n){const e=document.createElement("button");return e.type="button",e.className="mobile-btn",e.textContent=o,d?n.bindButton(e,d):e.disabled=!0,e}function E(o){const{container:d,input:n,mapping:e,showOnDesktop:t=!1}=o;if(!d)return{dispose:()=>{}};w();const a=document.createElement("div");a.className=`mobile-controls ${t?"":"hidden-desktop"}`.trim();const i=document.createElement("div");i.className="mobile-pad";const s=r("↑",e.up,n),p=r("↓",e.down,n),v=r("←",e.left,n),h=r("→",e.right,n);i.appendChild(document.createElement("div")),i.appendChild(s),i.appendChild(document.createElement("div")),i.appendChild(v),i.appendChild(document.createElement("div")),i.appendChild(h),i.appendChild(document.createElement("div")),i.appendChild(p),i.appendChild(document.createElement("div"));const l=document.createElement("div");l.className="mobile-actions";const c=e.actionA?r(e.actionALabel||"A",e.actionA,n):null,u=e.actionB?r(e.actionBLabel||"B",e.actionB,n):null;c&&l.appendChild(c),u&&l.appendChild(u);const m=!!(e.up||e.down||e.left||e.right),b=!!(c||u);return m&&a.appendChild(i),b&&a.appendChild(l),!m&&!b?{dispose:()=>{}}:(d.appendChild(a),{dispose(){a.remove()}})}export{E as a,x as c};
