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
    if (a.dataset.type) { const sel = $('#f-type'); if (sel) sel.value = a.dataset.type; }
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
  let lastY = 0;
  window.heroProgress = 0;
  function onScroll() {
    const y = window.scrollY, vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, y / (vh * 0.9)));
    window.heroProgress = p;
    const e = p * p * (3 - 2 * p);
    shade.style.opacity = (e * 0.92).toFixed(3);
    stage.style.opacity = (1 - Math.pow(p, 2.2)).toFixed(3);
    stage.style.transform = `scale(${1 + e * 0.06}) translateY(${-e * 4}vh)`;
    stage.style.visibility = p >= 1 ? 'hidden' : 'visible';
    content.style.opacity = Math.max(0, 1 - p * 1.7).toFixed(3);
    content.style.transform = `translateY(${-p * 90}px)`;

    const dark = y > vh * 0.6 || menu.classList.contains('is-open');
    nav.classList.toggle('is-dark', dark);
    nav.classList.toggle('is-hidden', y > vh * 1.2 && y > lastY + 2 && !menu.classList.contains('is-open'));
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;

  }
  if (lenis) lenis.on('scroll', onScroll); else addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
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
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
    $('#mClose').focus({ preventScroll: true });
  }
  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
    lastFocus && lastFocus.focus({ preventScroll: true });
  }
  cards.addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openModal(c.dataset.id); });
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeMenu(); } });

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
  $('#formReset').addEventListener('click', () => { form.reset(); form.classList.remove('is-done'); });
})();
