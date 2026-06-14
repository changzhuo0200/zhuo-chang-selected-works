import{a as e,i as t,n,r,t as i}from"./ColorBends-CDC0-XMI.js";import"./three.module-DTwpF38d.js";var a=[{key:`portfolio`,no:`01`,title:`内容落地`,subtitle:`内容案例 · 内容策划`,lead:`把组织内容、活动物料与用户反馈整理为可阅读、可传播、可复盘的内容案例。`,prefix:`portfolio`,pages:11,pageNumbers:[2,3,6,7,8,9,10,11],tags:[`内容案例`,`视觉物料`,`内容策划`,`用户反馈`],notes:[[`案例语境`,`围绕组织内容、活动物料与用户反馈，呈现从选题判断到内容落地的案例整理。`],[`我的工作`,`负责内容架构、选题梳理、文案打磨、资料整理与视觉呈现。`],[`策划转化`,`将活动、产品和社群信息转化为图文、视觉物料、Demo 与视频内容案例。`],[`可见产出`,`作品集页面、内容案例、Web Demo、视频链接与发布复盘线索。`]],links:[[`My Data Wallet Demo`,`https://mydatawalletishere.netlify.app`],[`Bilibili video`,`https://www.bilibili.com/video/BV1YxbTegEQ8/?share_source=copy_web&vd_source=1cf18844280d1000ac7ac48e93dc22c5`]]},{key:`research`,no:`02`,title:`玩家田野`,subtitle:`研究项目 · 个体叙事`,lead:`从女性玩家的个体叙事中，观察游戏经验、情感支持与身份表达。`,prefix:`research`,pages:25,tags:[`访谈`,`个体叙事`,`女性玩家`,`主题分析`],notes:[[`研究问题`,`女性玩家如何在游戏、社群和同人内容中获得情感支持与身份表达。`],[`访谈路径`,`通过访谈和材料整理，把分散经验转化为可讨论的主题线索。`],[`主题发现`,`从个体叙事中识别文化需求、情绪结构与社群参与方式。`],[`叙事价值`,`为内容策划提供人物故事、用户理解和社群文化观察的依据。`]],links:[]},{key:`game-culture`,no:`03`,title:`文化转译`,subtitle:`中式审美 · 游戏文化`,lead:`以游戏文本、视觉与氛围为入口，拆解中式文化表达如何被重新组织。`,prefix:`game-culture`,pages:39,tags:[`中式审美`,`游戏文化`,`角色文本`,`氛围分析`],notes:[[`观察对象`,`聚焦游戏中的中式文化表达，以及它如何进入角色、场景与叙事。`],[`分析维度`,`从建筑、音乐、角色、文本和氛围五条线索拆解审美组织方式。`],[`审美线索`,`提炼传统意象与现代数字内容之间的连接、取舍和再表达。`],[`内容启发`,`沉淀文化判断、审美表达和内容转译能力，可迁移到选题策划中。`]],links:[]}],o=document.querySelector(`#home`),s=document.querySelector(`#projectView`),c=document.querySelector(`#projectPage`),l=document.querySelector(`#railList`),u=document.querySelector(`#lightbox`),d=u.querySelector(`img`),f=u.querySelector(`p`),p=a[0].key,m=0,h=!1,g=0;function _(e){return String(e).padStart(2,`0`)}function v(e){return a.find(t=>t.key===e)||a[0]}function y(e){return e.pageNumbers||Array.from({length:e.pages},(e,t)=>t+1)}function b(){return v(p)}function x(e,t){return`assets/images/${e.prefix}-${_(t)}.jpg`}function S(){let e=b(),t=y(e),n=t[m]||t[0];return{project:e,pages:t,pageNumber:n,src:x(e,n),displayIndex:m+1,total:t.length,caption:`${e.title} · ${_(m+1)} / ${t.length}`}}function C(){l.innerHTML=a.map(e=>`
    <button class="rail-item ${e.key===p?`is-active`:``}" type="button" data-project="${e.key}" title="${e.title}">
      ${e.no}
    </button>
  `).join(``)}function w(e){let t=y(e),n=S(),r=t.map((n,r)=>`
    <button class="thumb ${r===m?`is-active`:``}" type="button" data-page-index="${r}" aria-label="查看第 ${r+1} 页">
      <img src="${x(e,n)}" alt="${e.title} 第 ${r+1} 页缩略图" loading="lazy">
      <span>${_(r+1)} / ${t.length}</span>
    </button>
  `).join(``);return`
    <div class="viewer-head">
      <span class="viewer-count">Page ${_(n.displayIndex)} / ${n.total}</span>
      <div class="viewer-controls">
        <button type="button" data-step="-1">Prev</button>
        <button type="button" data-step="1">Next</button>
      </div>
    </div>

    <div class="preview-stage">
      <div class="preview-card" aria-hidden="true"></div>
      <div class="preview-card" aria-hidden="true"></div>
      <figure class="main-preview" data-lightbox>
        <img src="${n.src}" alt="${e.title} 第 ${n.displayIndex} 页">
        <figcaption>
          <span>${e.title}</span>
          <span class="preview-count">${_(n.displayIndex)} / ${n.total}</span>
        </figcaption>
      </figure>
    </div>

    <div class="thumb-strip">${r}</div>
  `}function T(e,t=0){let n=v(e);p=n.key,m=Math.min(Math.max(t,0),y(n).length-1);let r=n.notes.map(([e,t])=>`
    <div class="note-block">
      <dt>${e}</dt>
      <dd>${t}</dd>
    </div>
  `).join(``),i=n.tags.map(e=>`<span>${e}</span>`).join(``),a=n.links.length?`
    <section class="external-links" aria-label="作品外链">
      <h3>Works Online</h3>
      ${n.links.map(([e,t])=>`<a href="${t}" target="_blank" rel="noreferrer">${e}</a>`).join(``)}
    </section>
  `:``;c.classList.add(`is-switching`),window.setTimeout(()=>{c.innerHTML=`
      <header class="project-hero">
        <div>
          <p class="project-kicker">${n.no} · ${n.subtitle}</p>
          <h2 class="project-title">${n.title}</h2>
          <p class="project-lead">${n.lead}</p>
        </div>
        <div class="project-tags">${i}</div>
      </header>

      <section class="project-body">
        <aside class="exhibit-note">
          <dl>${r}</dl>
          ${a}
        </aside>

        <section class="viewer" aria-label="${n.title} 页面浏览">
          ${w(n)}
        </section>
      </section>

      <nav class="bottom-nav" aria-label="项目前后切换">
        <button type="button" data-prev-project>Previous Project</button>
        <button type="button" data-next-project>Next Project</button>
      </nav>
    `,C(),c.classList.remove(`is-switching`)},180)}function E(e,t=1){let n=y(b());m=(e+n.length)%n.length;let r=c.querySelector(`.viewer`),i=c.querySelector(`.main-preview`);if(!r||!i)return;let a=S(),o=i.querySelector(`img`),s=i.querySelector(`.preview-count`),l=r.querySelector(`.viewer-count`),u=++g,d=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,f=()=>{o.src=a.src,o.alt=`${a.project.title} 第 ${a.displayIndex} 页`,s.textContent=`${_(a.displayIndex)} / ${a.total}`,l.textContent=`Page ${_(a.displayIndex)} / ${a.total}`,r.querySelectorAll(`.thumb`).forEach((e,t)=>{e.classList.toggle(`is-active`,t===m)}),h&&j(t)};if(d){f();return}let p=new Image;new Promise(e=>{let t=()=>e();p.onload=t,p.onerror=t,p.src=a.src,p.complete&&t(),window.setTimeout(t,240)}).then(()=>{u===g&&(i.classList.add(`is-swapping`),i.animate([{opacity:1,transform:`translate3d(0, 0, 0) scale(1)`},{opacity:.16,transform:`translate3d(${t*-12}px, 0, 0) scale(0.997)`}],{duration:170,easing:`cubic-bezier(0.22, 0.61, 0.36, 1)`,fill:`forwards`}).finished.finally(()=>{u===g&&(f(),i.animate([{opacity:.12,transform:`translate3d(${t*16}px, 0, 0) scale(0.997)`},{opacity:1,transform:`translate3d(0, 0, 0) scale(1)`}],{duration:320,easing:`cubic-bezier(0.16, 1, 0.3, 1)`}),i.classList.remove(`is-swapping`))}))})}function D(){document.body.classList.remove(`project-open`),s.classList.remove(`is-active`),o.classList.add(`is-active`),window.scrollTo({top:0,behavior:`smooth`})}function O(e,t=0){document.body.classList.add(`project-open`),o.classList.remove(`is-active`),s.classList.add(`is-active`),T(e,t),window.scrollTo({top:0,behavior:`smooth`})}function k(e){E(m+e,e)}function A(e){O(a[(a.findIndex(e=>e.key===p)+e+a.length)%a.length].key,0)}function j(e=1){let t=S();u.classList.add(`is-swapping`),window.setTimeout(()=>{d.src=t.src,d.alt=t.caption,f.textContent=t.caption,d.animate([{opacity:0,transform:`translateX(${e*14}px)`},{opacity:1,transform:`translateX(0)`}],{duration:280,easing:`cubic-bezier(0.16, 1, 0.3, 1)`}),u.classList.remove(`is-swapping`)},120)}function M(){h=!0,u.hidden=!1,j(1)}function N(){h=!1,u.hidden=!0,d.removeAttribute(`src`)}document.body.addEventListener(`click`,e=>{let t=e.target.closest(`[data-project]`),n=e.target.closest(`[data-home]`),r=e.target.closest(`[data-page-index]`),i=e.target.closest(`[data-step]`),a=e.target.closest(`[data-lightbox]`),o=e.target.closest(`.lightbox-close`),s=e.target.closest(`[data-lightbox-step]`),c=e.target.closest(`[data-prev-project]`),l=e.target.closest(`[data-next-project]`);if(t&&O(t.dataset.project,0),n&&D(),r){let e=Number(r.dataset.pageIndex);E(e,e>=m?1:-1)}i&&k(Number(i.dataset.step)),a&&M(),s&&k(Number(s.dataset.lightboxStep)),(o||e.target===u)&&N(),c&&A(-1),l&&A(1)}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&h&&N(),s.classList.contains(`is-active`)&&(e.key===`ArrowLeft`&&k(-1),e.key===`ArrowRight`&&k(1))}),C();var P=e(t()),F=r(),I=n(),L={colors:[`#315b70`,`#525c62`,`#5f95ad`,`#a8d8e8`],rotation:88,speed:.12,scale:1.15,frequency:.75,warpStrength:.65,mouseInfluence:.45,noise:.03,parallax:.22,iterations:2,intensity:.9,bandWidth:5.5,transparent:!0,autoRotate:-2,color:`#12354a`},R={colors:[`#12324a`,`#2f6f95`,`#74aed5`,`#b8e7f4`],rotation:91,speed:.055,scale:1.1,frequency:.68,warpStrength:.36,mouseInfluence:.14,noise:.024,parallax:.08,iterations:2,intensity:.42,bandWidth:7.4,transparent:!0,autoRotate:-.65,color:`#102f45`};function z(){let[e,t]=(0,P.useState)(document.body.classList.contains(`project-open`));return(0,P.useEffect)(()=>{let e=new MutationObserver(()=>{t(document.body.classList.contains(`project-open`))});return e.observe(document.body,{attributes:!0,attributeFilter:[`class`]}),()=>e.disconnect()},[]),(0,I.jsx)(i,{...e?R:L,className:e?`is-muted`:``},e?`page`:`hero`)}var B=document.querySelector(`#colorbendsBackground`);B&&(0,F.createRoot)(B).render((0,I.jsx)(z,{}));