const projects = [
  {
    key: "portfolio",
    no: "01",
    title: "内容落地",
    subtitle: "组织内容 · 内容运营",
    lead: "把活动、产品与社群信息整理为可阅读、可传播、可回看的内容材料。",
    prefix: "portfolio",
    pages: 11,
    pageNumbers: [2, 3, 6, 7, 8, 9, 10, 11],
    tags: ["组织内容", "视觉物料", "内容运营", "用户反馈"],
    notes: [
      ["内容语境", "从组织内容、新媒体物料到用户反馈，呈现一次综合内容落地过程。"],
      ["我的工作", "负责内容架构、文案打磨、资料整理、视觉呈现与 Demo 原型制作。"],
      ["转化方式", "将活动、产品和社群信息转化为图文、视觉物料、Demo 与视频内容。"],
      ["可见产出", "作品集页面、内容案例、Web Demo、视频链接与发布复盘线索。"]
    ],
    links: [
      ["My Data Wallet Demo", "https://mydatawalletishere.netlify.app"],
      ["Bilibili video", "https://www.bilibili.com/video/BV1YxbTegEQ8/?share_source=copy_web&vd_source=1cf18844280d1000ac7ac48e93dc22c5"]
    ]
  },
  {
    key: "research",
    no: "02",
    title: "玩家田野",
    subtitle: "研究项目 · 个体叙事",
    lead: "从女性玩家的个体叙事中，观察游戏经验、情感支持与身份表达。",
    prefix: "research",
    pages: 25,
    tags: ["访谈", "个体叙事", "女性玩家", "主题分析"],
    notes: [
      ["研究问题", "女性玩家如何在游戏、社群和同人内容中获得情感支持与身份表达。"],
      ["访谈路径", "通过访谈和材料整理，把分散经验转化为可讨论的主题线索。"],
      ["主题发现", "从个体叙事中识别文化需求、情绪结构与社群参与方式。"],
      ["叙事价值", "为内容策划提供人物故事、用户理解和社群文化观察的依据。"]
    ],
    links: []
  },
  {
    key: "game-culture",
    no: "03",
    title: "文化转译",
    subtitle: "中式审美 · 游戏文化",
    lead: "以游戏文本、视觉与氛围为入口，拆解中式文化表达如何被重新组织。",
    prefix: "game-culture",
    pages: 39,
    tags: ["中式审美", "游戏文化", "角色文本", "氛围分析"],
    notes: [
      ["观察对象", "聚焦游戏中的中式文化表达，以及它如何进入角色、场景与叙事。"],
      ["分析维度", "从建筑、音乐、角色、文本和氛围五条线索拆解审美组织方式。"],
      ["审美线索", "提炼传统意象与现代数字内容之间的连接、取舍和再表达。"],
      ["内容启发", "沉淀文化判断、审美表达和内容转译能力，可迁移到选题策划中。"]
    ],
    links: []
  }
];

const homeView = document.querySelector("#home");
const projectView = document.querySelector("#projectView");
const projectPage = document.querySelector("#projectPage");
const railList = document.querySelector("#railList");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");

let activeProjectKey = projects[0].key;
let activePageIndex = 0;
let lightboxOpen = false;
let viewerSwapToken = 0;

function pad(num) {
  return String(num).padStart(2, "0");
}

function projectByKey(key) {
  return projects.find((project) => project.key === key) || projects[0];
}

function visiblePages(project) {
  return project.pageNumbers || Array.from({ length: project.pages }, (_, index) => index + 1);
}

function currentProject() {
  return projectByKey(activeProjectKey);
}

function imageSrc(project, pageNumber) {
  return `assets/images/${project.prefix}-${pad(pageNumber)}.jpg`;
}

function currentImageData() {
  const project = currentProject();
  const pages = visiblePages(project);
  const pageNumber = pages[activePageIndex] || pages[0];
  return {
    project,
    pages,
    pageNumber,
    src: imageSrc(project, pageNumber),
    displayIndex: activePageIndex + 1,
    total: pages.length,
    caption: `${project.title} · ${pad(activePageIndex + 1)} / ${pages.length}`
  };
}

function renderRail() {
  railList.innerHTML = projects.map((project) => `
    <button class="rail-item ${project.key === activeProjectKey ? "is-active" : ""}" type="button" data-project="${project.key}" title="${project.title}">
      ${project.no}
    </button>
  `).join("");
}

function renderViewerMarkup(project) {
  const pages = visiblePages(project);
  const data = currentImageData();
  const thumbs = pages.map((pageNumber, index) => `
    <button class="thumb ${index === activePageIndex ? "is-active" : ""}" type="button" data-page-index="${index}" aria-label="查看第 ${index + 1} 页">
      <img src="${imageSrc(project, pageNumber)}" alt="${project.title} 第 ${index + 1} 页缩略图" loading="lazy">
      <span>${pad(index + 1)} / ${pages.length}</span>
    </button>
  `).join("");

  return `
    <div class="viewer-head">
      <span class="viewer-count">Page ${pad(data.displayIndex)} / ${data.total}</span>
      <div class="viewer-controls">
        <button type="button" data-step="-1">Prev</button>
        <button type="button" data-step="1">Next</button>
      </div>
    </div>

    <div class="preview-stage">
      <div class="preview-card" aria-hidden="true"></div>
      <div class="preview-card" aria-hidden="true"></div>
      <figure class="main-preview" data-lightbox>
        <img src="${data.src}" alt="${project.title} 第 ${data.displayIndex} 页">
        <figcaption>
          <span>${project.title}</span>
          <span class="preview-count">${pad(data.displayIndex)} / ${data.total}</span>
        </figcaption>
      </figure>
    </div>

    <div class="thumb-strip">${thumbs}</div>
  `;
}

function renderProject(projectKey, pageIndex = 0) {
  const project = projectByKey(projectKey);
  activeProjectKey = project.key;
  activePageIndex = Math.min(Math.max(pageIndex, 0), visiblePages(project).length - 1);
  const notes = project.notes.map(([label, value]) => `
    <div class="note-block">
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `).join("");
  const tags = project.tags.map((tag) => `<span>${tag}</span>`).join("");
  const links = project.links.length ? `
    <section class="external-links" aria-label="作品外链">
      <h3>Works Online</h3>
      ${project.links.map(([label, href]) => `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join("")}
    </section>
  ` : "";

  projectPage.classList.add("is-switching");
  window.setTimeout(() => {
    projectPage.innerHTML = `
      <header class="project-hero">
        <div>
          <p class="project-kicker">${project.no} · ${project.subtitle}</p>
          <h2 class="project-title">${project.title}</h2>
          <p class="project-lead">${project.lead}</p>
        </div>
        <div class="project-tags">${tags}</div>
      </header>

      <section class="project-body">
        <aside class="exhibit-note">
          <dl>${notes}</dl>
          ${links}
        </aside>

        <section class="viewer" aria-label="${project.title} 页面浏览">
          ${renderViewerMarkup(project)}
        </section>
      </section>

      <nav class="bottom-nav" aria-label="项目前后切换">
        <button type="button" data-prev-project>Previous Project</button>
        <button type="button" data-next-project>Next Project</button>
      </nav>
    `;
    renderRail();
    projectPage.classList.remove("is-switching");
  }, 180);
}

function updateViewer(pageIndex, direction = 1) {
  const project = currentProject();
  const pages = visiblePages(project);
  activePageIndex = (pageIndex + pages.length) % pages.length;
  const viewer = projectPage.querySelector(".viewer");
  const preview = projectPage.querySelector(".main-preview");
  if (!viewer || !preview) return;
  const data = currentImageData();
  const image = preview.querySelector("img");
  const previewCount = preview.querySelector(".preview-count");
  const viewerCount = viewer.querySelector(".viewer-count");
  const token = ++viewerSwapToken;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const applyImage = () => {
    image.src = data.src;
    image.alt = `${data.project.title} 第 ${data.displayIndex} 页`;
    previewCount.textContent = `${pad(data.displayIndex)} / ${data.total}`;
    viewerCount.textContent = `Page ${pad(data.displayIndex)} / ${data.total}`;

    viewer.querySelectorAll(".thumb").forEach((thumb, index) => {
      thumb.classList.toggle("is-active", index === activePageIndex);
    });

    if (lightboxOpen) updateLightboxImage(direction);
  };

  if (reduceMotion) {
    applyImage();
    return;
  }

  const nextImage = new Image();
  const imageReady = new Promise((resolve) => {
    const finish = () => resolve();
    nextImage.onload = finish;
    nextImage.onerror = finish;
    nextImage.src = data.src;
    if (nextImage.complete) finish();
    window.setTimeout(finish, 240);
  });

  imageReady.then(() => {
    if (token !== viewerSwapToken) return;
    preview.classList.add("is-swapping");
    const out = preview.animate(
      [
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        { opacity: 0.16, transform: `translate3d(${direction * -12}px, 0, 0) scale(0.997)` }
      ],
      { duration: 170, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "forwards" }
    );

    out.finished.finally(() => {
      if (token !== viewerSwapToken) return;
      applyImage();
      preview.animate(
        [
          { opacity: 0.12, transform: `translate3d(${direction * 16}px, 0, 0) scale(0.997)` },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
        ],
        { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
      preview.classList.remove("is-swapping");
    });
  });
}

function showHome() {
  document.body.classList.remove("project-open");
  projectView.classList.remove("is-active");
  homeView.classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showProject(key, pageIndex = 0) {
  document.body.classList.add("project-open");
  homeView.classList.remove("is-active");
  projectView.classList.add("is-active");
  renderProject(key, pageIndex);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shiftPage(step) {
  updateViewer(activePageIndex + step, step);
}

function shiftProject(step) {
  const index = projects.findIndex((project) => project.key === activeProjectKey);
  const nextIndex = (index + step + projects.length) % projects.length;
  showProject(projects[nextIndex].key, 0);
}

function updateLightboxImage(direction = 1) {
  const data = currentImageData();
  lightbox.classList.add("is-swapping");
  window.setTimeout(() => {
    lightboxImage.src = data.src;
    lightboxImage.alt = data.caption;
    lightboxCaption.textContent = data.caption;
    lightboxImage.animate(
      [
        { opacity: 0, transform: `translateX(${direction * 14}px)` },
        { opacity: 1, transform: "translateX(0)" }
      ],
      { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
    lightbox.classList.remove("is-swapping");
  }, 120);
}

function openLightbox() {
  lightboxOpen = true;
  lightbox.hidden = false;
  updateLightboxImage(1);
}

function closeLightbox() {
  lightboxOpen = false;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
}

document.body.addEventListener("click", (event) => {
  const projectTrigger = event.target.closest("[data-project]");
  const homeTrigger = event.target.closest("[data-home]");
  const pageTrigger = event.target.closest("[data-page-index]");
  const stepTrigger = event.target.closest("[data-step]");
  const preview = event.target.closest("[data-lightbox]");
  const close = event.target.closest(".lightbox-close");
  const lightboxStep = event.target.closest("[data-lightbox-step]");
  const prevProject = event.target.closest("[data-prev-project]");
  const nextProject = event.target.closest("[data-next-project]");

  if (projectTrigger) showProject(projectTrigger.dataset.project, 0);
  if (homeTrigger) showHome();
  if (pageTrigger) {
    const nextIndex = Number(pageTrigger.dataset.pageIndex);
    updateViewer(nextIndex, nextIndex >= activePageIndex ? 1 : -1);
  }
  if (stepTrigger) shiftPage(Number(stepTrigger.dataset.step));
  if (preview) openLightbox();
  if (lightboxStep) shiftPage(Number(lightboxStep.dataset.lightboxStep));
  if (close || event.target === lightbox) closeLightbox();
  if (prevProject) shiftProject(-1);
  if (nextProject) shiftProject(1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightboxOpen) closeLightbox();
  if (projectView.classList.contains("is-active")) {
    if (event.key === "ArrowLeft") shiftPage(-1);
    if (event.key === "ArrowRight") shiftPage(1);
  }
});

renderRail();
