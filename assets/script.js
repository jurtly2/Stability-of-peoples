
(function(){
  const DATA = window.SOP_DATA;
  const passages = DATA.passages || [];
  const params = new URLSearchParams(location.search);
  const page = document.body.dataset.page;
  const currentId = params.get("id") || passages[0]?.id || "intro-01";
  const currentIndex = Math.max(0, passages.findIndex(p => p.id === currentId));
  const passage = passages[currentIndex] || passages[0];
  const view = params.get("view") || "compare";

  function esc(str){
    return String(str ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function setActiveNav(){
    document.querySelectorAll("[data-nav]").forEach(a=>{
      a.classList.toggle("active", a.dataset.nav === page);
    });
  }

  function passageUrl(id){
    return `reader.html?id=${encodeURIComponent(id)}`;
  }

  function renderDrawer(){
    const drawerList = document.querySelector("#drawerList");
    if(!drawerList) return;
    drawerList.innerHTML = passages.map((p, i)=>`
      <a href="${passageUrl(p.id)}" class="${p.id === currentId ? "active" : ""}">
        <small>${esc(p.section)} · ${esc(p.number)}</small>
        <strong>${esc(p.title)}</strong>
      </a>
    `).join("");
  }

  function renderReader(){
    const root = document.querySelector("#readerRoot");
    if(!root || !passage) return;

    document.querySelector("#readerSection").textContent = passage.section;
    document.querySelector("#readerNumber").textContent = passage.number;
    document.querySelector("#readerTitle").textContent = passage.title;

    const prev = passages[currentIndex - 1];
    const next = passages[currentIndex + 1];

    const persistentPrev = document.querySelector("#persistentPrev");
    const persistentNext = document.querySelector("#persistentNext");

    if(prev){
      if(persistentPrev){ persistentPrev.href = passageUrl(prev.id); persistentPrev.style.visibility = "visible"; }
    } else {
      if(persistentPrev){ persistentPrev.href = "#"; persistentPrev.style.visibility = "hidden"; }
    }

    if(next){
      if(persistentNext){ persistentNext.href = passageUrl(next.id); persistentNext.style.visibility = "visible"; }
    } else {
      if(persistentNext){ persistentNext.href = "#"; persistentNext.style.visibility = "hidden"; }
    }

    root.innerHTML = renderNaturalReader();
  }

  function panel(cls, title, body, extraClass=""){
    return `<section class="panel ${cls} ${extraClass}">
      <div class="panel-head">${esc(title)}</div>
      <div class="panel-body">${body}</div>
    </section>`;
  }

  function renderNaturalReader(){
    return `<div class="natural-reader">
      ${panel("smith", "Exact Smith", `<div class="exact-text">${esc(passage.exact)}</div>`)}
      ${panel("plain", "Plain Smith", `<p>${esc(passage.plainSmith)}</p>`)}
      ${panel("plain", "What Smith Means", `<p>${esc(passage.smithMeans)}</p>`)}
      <div class="answer-grid natural-answer-grid">
        ${panel("stability", "What We Keep", `<p>${esc(passage.keep)}</p>`)}
        ${panel("smith", "What We Challenge", `<p>${esc(passage.challenge)}</p>`)}
        ${panel("stability", "Stability Answer", `<p>${esc(passage.answer)}</p>`, "wide")}
        ${renderExamples()}
        ${panel("stability", "Doctrine Saved", `<p class="doctrine-line">${esc(passage.doctrine)}</p>`, "wide")}
      </div>
    </div>`;
  }

  function renderExamples(){
    const ex = passage.examples;
    if(!ex) return "";
    return `<section class="panel examples-panel wide">
      <div class="panel-head">Test the ideas</div>
      <div class="panel-body">
        <div class="examples-grid">
          <article><h3>Where Smith works</h3><p>${esc(ex.smithWorks)}</p></article>
          <article><h3>Where Smith fails</h3><p>${esc(ex.smithFails)}</p></article>
          <article><h3>Where our doctrine works</h3><p>${esc(ex.oursWorks)}</p></article>
          <article><h3>Where our doctrine needs safeguards</h3><p>${esc(ex.oursFails)}</p></article>
        </div>
      </div>
    </section>`;
  }

  function renderDoctrine(){
    const root = document.querySelector("#doctrineRoot");
    if(!root) return;
    root.innerHTML = `<div class="doctrine-list">` + DATA.doctrine.map(d=>`
      <div class="doctrine-item"><p>${esc(d)}</p></div>
    `).join("") + `</div>`;
  }

  function renderGlossary(){
    const root = document.querySelector("#glossaryRoot");
    if(!root) return;
    root.innerHTML = `<div class="glossary-list">` + DATA.glossary.map(g=>`
      <article class="glossary-item">
        <div class="glossary-term">${esc(g.term)}</div>
        <div>
          <p><strong>Smith:</strong> ${esc(g.smith)}</p>
          <p><strong>Plain:</strong> ${esc(g.plain)}</p>
          <p><strong>Stability:</strong> ${esc(g.stability)}</p>
        </div>
      </article>
    `).join("") + `</div>`;
  }

  function drawerControls(){
    const openBtn = document.querySelector("#openDrawer");
    const closeBtn = document.querySelector("#closeDrawer");
    const drawer = document.querySelector("#chapterDrawer");
    const backdrop = document.querySelector("#drawerBackdrop");
    function open(){
      drawer?.classList.add("open");
      backdrop?.classList.add("open");
    }
    function close(){
      drawer?.classList.remove("open");
      backdrop?.classList.remove("open");
    }
    openBtn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);
  }

  setActiveNav();
  renderDrawer();
  renderReader();
  renderDoctrine();
  renderGlossary();
  drawerControls();
})();
