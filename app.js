(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Smooth scroll */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.25, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  /* Anchors */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = id === '#top' ? document.body : $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    if (a.dataset.type) { const sel = $('#f-type'); if (sel) { sel.value = a.dataset.type; sel.dispatchEvent(new Event('change')); } }
    if (a.closest('.modal')) closeModal();
    if (lenis) lenis.scrollTo(id === '#top' ? 0 : el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }));

  /* Mobile menu */
  const burger = $('#burger'), menu = $('#mobileMenu');
  function closeMenu() { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); }
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    $('#nav').classList.toggle('is-dark', open || scrollY > innerHeight * .6);
    open ? lenis && lenis.stop() : lenis && lenis.start();
  });

  /* Hero fade + nav + parallax */
  const stage = $('#heroStage'), shade = $('#heroShade'), content = $('#heroContent'), nav = $('#nav');
  // Stable viewport height: ignore mobile address-bar jitter, update only on width/orientation change
  let vh = innerHeight, vw = innerWidth;
  const setVH = () => { document.documentElement.style.setProperty('--stage-h', vh + 'px'); };
  setVH();
  addEventListener('resize', () => {
    if (innerWidth !== vw || Math.abs(innerHeight - vh) > 160) { vw = innerWidth; vh = innerHeight; setVH(); onScroll(); }
  });
  let lastY = 0;
  window.heroProgress = 0;
  function onScroll() {
    const y = window.scrollY;
    const p = Math.min(1, Math.max(0, y / (vh * 0.85)));
    window.heroProgress = p;
    const e = p * p * (3 - 2 * p);
    shade.style.opacity = e.toFixed(3);
    document.documentElement.style.setProperty('--edge', Math.min(1, p * 2.5).toFixed(3));
    stage.style.opacity = (1 - Math.pow(p, 2.4)).toFixed(3);
    stage.style.transform = reduce ? 'none' : `translate3d(0, ${(-y * (vw < 760 ? 0.55 : 0.32)).toFixed(1)}px, 0) scale(${(1 + e * 0.04).toFixed(4)})`;
    stage.style.visibility = p >= 1 ? 'hidden' : 'visible';
    content.style.opacity = Math.max(0, 1 - p * (vw < 760 ? 2.8 : 2.1)).toFixed(3);
    content.style.transform = `translate3d(0, ${(-p * 40).toFixed(1)}px, 0)`;

    const dark = y > vh * 0.6 || menu.classList.contains('is-open');
    nav.classList.toggle('is-dark', dark);
    nav.classList.toggle('is-hidden', y > vh * 1.2 && y > lastY + 2 && !menu.classList.contains('is-open'));
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
  onScroll();

  /* Reveal */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  $$('.reveal').forEach(el => io.observe(el));

  /* Counters */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
      const dur = reduce ? 1 : 2200, t0 = performance.now();
      const tick = now => {
        const k = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - k, 4));
        el.textContent = v.toFixed(dec).replace('.', ',') + (k === 1 ? suf : '');
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* Projects */
  const cards = $('#cards'), P = window.PROJECTS || [];
  function renderCards(filter) {
    const list = P.filter(p => filter === 'all' || p.category === filter);
    cards.innerHTML = list.map((p, k) => `
      <button class="card" data-id="${p.id}" style="transition-delay:${k * 70}ms">
        <div class="card-vis">${window.projectSVG(p.svgType)}<span class="card-scale mono">${p.scale}</span><span class="card-idx mono">0${P.indexOf(p) + 1}</span></div>
        <div class="card-body"><span class="card-cat mono">${p.categoryLabel}</span><h3>${p.title}</h3><p>${p.description}</p></div>
        <div class="card-foot mono"><span>${p.size}</span><span>Подробнее →</span></div>
      </button>`).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => $$('.card', cards).forEach(c => c.classList.add('in'))));
  }
  renderCards('all');
  $$('.filter').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('is-active')) return;
    $$('.filter').forEach(x => x.classList.toggle('is-active', x === b));
    cards.style.transition = 'opacity .4s cubic-bezier(.16,1,.3,1)';
    cards.style.opacity = 0;
    setTimeout(() => { renderCards(b.dataset.filter); cards.style.opacity = 1; }, 380);
  }));

  /* Modal */
  const modal = $('#modal');
  let lastFocus = null;
  function openModal(id) {
    const p = P.find(x => x.id === id); if (!p) return;
    $('#mCat').textContent = `${p.categoryLabel} // ${p.scale}`;
    $('#mTitle').textContent = p.title;
    $('#mDesc').textContent = p.description;
    $('#mScale').textContent = p.scale;
    $('#mSize').textContent = p.size;
    $('#mMat').textContent = p.materials;
    $('#mTime').textContent = p.time;
    $('#mVisual').innerHTML = window.projectSVG(p.svgType);
    $('#mOrder').dataset.type = p.category;
    lastFocus = document.activeElement;
    $('.modal-panel', modal).scrollTop = 0;
    modal.scrollTop = 0;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-lock');
    lenis && lenis.stop();
    $('#mClose').focus({ preventScroll: true });
  }
  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-lock');
    lenis && lenis.start();
    lastFocus && lastFocus.focus({ preventScroll: true });
  }
  cards.addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openModal(c.dataset.id); });
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { if (document.querySelector('.dd.open')) return; closeModal(); closeMenu(); } });

  /* Custom dropdowns */
  const dds = [];
  $$('.field.select select').forEach(sel => {
    const field = sel.closest('.field');
    const dd = document.createElement('div');
    dd.className = 'dd';
    const id = sel.id + '-list';
    dd.innerHTML = `<button type="button" class="dd-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="${sel.id}-lbl ${sel.id}-val"><span class="dd-val" id="${sel.id}-val"></span><span class="dd-ico" aria-hidden="true"></span></button>
      <ul class="dd-list" role="listbox" id="${id}" tabindex="-1">${[...sel.options].map((o, k) => `<li role="option" data-i="${k}" id="${sel.id}-o${k}">${o.textContent}</li>`).join('')}</ul>`;
    field.classList.add('has-dd');
    $('label', field).id = sel.id + '-lbl';
    sel.after(dd);
    sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    const btn = $('.dd-btn', dd), val = $('.dd-val', dd), list = $('.dd-list', dd), items = $$('li', list);
    let hi = sel.selectedIndex;
    const sync = () => {
      val.textContent = sel.options[sel.selectedIndex].textContent;
      items.forEach((li, k) => li.setAttribute('aria-selected', String(k === sel.selectedIndex)));
    };
    const highlight = k => { hi = (k + items.length) % items.length; items.forEach((li, j) => li.classList.toggle('hi', j === hi)); list.setAttribute('aria-activedescendant', items[hi].id); };
    const open = () => { dds.forEach(d => d !== close && d()); dd.classList.add('open'); field.classList.add('focus'); btn.setAttribute('aria-expanded', 'true'); highlight(sel.selectedIndex); };
    const close = () => { dd.classList.remove('open'); field.classList.remove('focus'); btn.setAttribute('aria-expanded', 'false'); };
    const choose = k => { sel.selectedIndex = k; sel.dispatchEvent(new Event('change')); close(); btn.focus({ preventScroll: true }); };
    dds.push(close);
    btn.addEventListener('click', () => dd.classList.contains('open') ? close() : open());
    items.forEach((li, k) => {
      li.addEventListener('click', () => choose(k));
      li.addEventListener('mouseenter', () => highlight(k));
    });
    btn.addEventListener('keydown', e => {
      const isOpen = dd.classList.contains('open');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!isOpen) open(); else highlight(hi + (e.key === 'ArrowDown' ? 1 : -1)); }
      else if ((e.key === 'Enter' || e.key === ' ') && isOpen) { e.preventDefault(); choose(hi); }
      else if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(); }
      else if (e.key === 'Tab') close();
    });
    sel.addEventListener('change', sync);
    sync();
  });
  document.addEventListener('click', e => { if (!e.target.closest('.dd')) dds.forEach(c => c()); });

  /* Form */
  const form = $('#form'), errBox = $('#formError');
  const nameF = $('#f-name'), contactF = $('#f-contact');
  [nameF, contactF].forEach(i => i.addEventListener('input', () => {
    i.closest('.field').classList.remove('invalid');
    if (nameF.value.trim() && contactF.value.trim()) errBox.classList.remove('show');
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    [nameF, contactF].forEach(i => { if (!i.value.trim()) { i.closest('.field').classList.add('invalid'); ok = false; } });
    errBox.classList.toggle('show', !ok);
    if (!ok) return;
    const btn = $('.btn-submit', form);
    btn.classList.add('loading'); $('span', btn).textContent = 'Отправляем…';
    setTimeout(() => {
      form.classList.add('is-done');
      btn.classList.remove('loading'); $('span', btn).textContent = 'Отправить запрос на расчёт';
    }, 900);
  });
  $('#formReset').addEventListener('click', () => { form.reset(); $$('.field.select select').forEach(x => x.dispatchEvent(new Event('change'))); form.classList.remove('is-done'); });
})();
