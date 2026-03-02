(() => {
  const root = document;
  if (!root) return;

  const on = (target, event, handler, options) => target && target.addEventListener(event, handler, options);

  function initNav() {
    const nav = root.querySelector('nav');
    if (!nav) return;
    const logoCircles = nav.querySelectorAll('svg circle');
    const logoPath = nav.querySelector('svg path');

    const update = () => {
      const isScrolled = window.scrollY > 60;
      nav.classList.toggle('nav-scrolled', isScrolled);
      if (logoCircles[0]) logoCircles[0].setAttribute('fill', isScrolled ? 'rgba(94,138,106,.12)' : 'rgba(255,255,255,.15)');
      if (logoPath) logoPath.setAttribute('stroke', isScrolled ? 'var(--sage)' : '#fff');
      if (logoCircles[1]) logoCircles[1].setAttribute('fill', isScrolled ? 'var(--sage)' : '#fff');
    };

    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', update);
    update();
  }

  function initMenu() {
    const menuBtn = root.querySelector('.ham');
    const menu = root.querySelector('.mob-menu');
    const overlay = root.querySelector('.mob-overlay');
    const closeBtn = root.querySelector('.mob-close');
    if (!menuBtn || !menu || !overlay) return;

    const closeMenu = () => {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    on(menuBtn, 'click', openMenu);
    on(closeBtn, 'click', closeMenu);
    on(overlay, 'click', closeMenu);
    root.querySelectorAll('.mob-menu a').forEach((a) => on(a, 'click', closeMenu));
  }

  function initFaq() {
    const faqButtons = Array.from(root.querySelectorAll('#faq button'));
    faqButtons.forEach((btn) => {
      on(btn, 'click', () => {
        const answerWrap = btn.nextElementSibling;
        if (!answerWrap) return;
        const plus = btn.querySelector('span:last-child');
        const isOpen = answerWrap.classList.contains('faq-item-open');

        faqButtons.forEach((b) => {
          const aw = b.nextElementSibling;
          const p = b.querySelector('span:last-child');
          if (aw) aw.classList.remove('faq-item-open');
          if (p) p.classList.remove('faq-plus-open');
        });

        if (!isOpen) {
          answerWrap.classList.add('faq-item-open');
          if (plus) plus.classList.add('faq-plus-open');
        }
      });
    });
  }

  function initBackToTop() {
    const backToTop = root.querySelector('button[aria-label="Back to top"]');
    if (!backToTop) return;

    backToTop.classList.add('back-to-top');
    on(backToTop, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const update = () => backToTop.classList.toggle('show', window.scrollY > 800);
    on(window, 'scroll', update, { passive: true });
    update();
  }

  function initMobileCta() {
    const mobileCta = root.querySelector('.mob-cta');
    if (!mobileCta) return;

    const update = () => {
      const show = window.matchMedia('(max-width: 768px)').matches && window.scrollY > 500;
      mobileCta.classList.toggle('show', show);
    };

    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', update);
    update();

    const ctaBtn = mobileCta.querySelector('button');
    on(ctaBtn, 'click', () => {
      const products = root.querySelector('#products');
      if (products) products.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function initSmoothScroll() {
    root.querySelectorAll('a[href^="#"]').forEach((a) => {
      on(a, 'click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = root.querySelector(id) || document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function patchConvertedContent() {
    root.querySelectorAll('.water-science__fact-drift-harbor,.science-mobile__fact-crest-harbor').forEach((el) => {
      el.innerHTML = 'Subtraction,<br>Not Addition.';
    });

    root.querySelectorAll('span').forEach((span) => {
      const txt = (span.textContent || '').trim();
      const needsGradient =
        /Your Shower Undoes It Every Morning\.?/i.test(txt) ||
        /Your Water Should Change With It\.?/i.test(txt) ||
        ((span.getAttribute('style') || '').includes('-webkit-text-fill-color: transparent'));

      if (!needsGradient) return;
      span.style.background = 'linear-gradient(90deg,var(--rose),var(--gold),var(--rose))';
      span.style.backgroundSize = '200% auto';
      span.style.backgroundClip = 'text';
      span.style.webkitBackgroundClip = 'text';
      span.style.webkitTextFillColor = 'transparent';
    });
  }

  function initRevealEffects() {
    const targets = root.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale,.content-layout,.tl-dot,.tl-fill,.tl-vline-fill');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Reset accidentally pre-rendered visibility classes so reveal animations can run consistently.
    targets.forEach((el) => el.classList.remove('is-visible'));

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((el) => io.observe(el));
  }

  function initTimeline() {
    const sections = Array.from(root.querySelectorAll('section')).filter((s) => {
      const h2 = s.querySelector('h2');
      return h2 && /Your Results Timeline/i.test(h2.textContent || '');
    });

    if (!sections.length) return;
    const activate = (section) => section.classList.add('timeline-live');

    if (!('IntersectionObserver' in window)) {
      sections.forEach(activate);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

    sections.forEach((section) => io.observe(section));
  }

  initNav();
  initMenu();
  initFaq();
  initBackToTop();
  initMobileCta();
  initSmoothScroll();
  patchConvertedContent();
  initRevealEffects();
  initTimeline();
})();
