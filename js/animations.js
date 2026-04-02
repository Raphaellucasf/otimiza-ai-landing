/**
 * Scroll Animations — Otimiza-AI
 * GSAP + ScrollTrigger + SplitType — 5 features
 */

window.addEventListener('load', () => {

  // ─── Fallback: se GSAP não carregou, mostra tudo normalmente ───
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    // mostra hero também
    ['.hero-badge','.hero-title','.hero-subtitle','.hero-cta-group'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (history.scrollRestoration) history.scrollRestoration = 'manual';

  // ─────────────────────────────────────────────────────────
  // HERO — animação de entrada (GSAP controla tudo, sem CSS keyframes)
  // ─────────────────────────────────────────────────────────
  const LOADING_DELAY = 1.7; // sinc com loading screen (1.5s) + margem

  // Badge
  gsap.fromTo('.hero-badge',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: LOADING_DELAY }
  );

  // Título letra por letra (SplitType)
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && typeof SplitType !== 'undefined') {
    const split = new SplitType(heroTitle, { types: 'words,chars' });
    if (split.words) {
      split.words.forEach((w) => {
        w.style.display = 'inline-block';
        w.style.overflow = 'hidden';
        w.style.verticalAlign = 'bottom';
        w.style.lineHeight = '1';
      });
    }
    gsap.fromTo(split.chars,
      { y: '110%', opacity: 0 },
      {
        y: '0%', opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: { each: 0.04 },
        delay: LOADING_DELAY + 0.1,
      }
    );
  } else if (heroTitle) {
    // fallback sem SplitType
    gsap.fromTo(heroTitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: LOADING_DELAY + 0.1 }
    );
  }

  // Subtítulo e botões
  gsap.fromTo('.hero-subtitle',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: LOADING_DELAY + 0.4 }
  );
  gsap.fromTo('.hero-cta-group',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: LOADING_DELAY + 0.6 }
  );

  // ─────────────────────────────────────────────────────────
  // HERO PARALLAX (scrub — conteúdo some ao rolar)
  // ─────────────────────────────────────────────────────────
  gsap.to('.hero-content', {
    y: 120,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: 1,
    },
  });

  // ─────────────────────────────────────────────────────────
  // 1. SCROLL REVEALS
  // ─────────────────────────────────────────────────────────
  function staggerDelay(el) {
    const map = { 'stagger-1': 0.05, 'stagger-2': 0.12, 'stagger-3': 0.19,
                  'stagger-4': 0.26, 'stagger-5': 0.33, 'stagger-6': 0.40 };
    for (const [cls, delay] of Object.entries(map)) {
      if (el.classList.contains(cls)) return delay;
    }
    return 0;
  }

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        delay: staggerDelay(el),
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      }
    );
  });

  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      }
    );
  });



  // ─────────────────────────────────────────────────────────
  // 4. PARALLAX SCRUB — imagens das divisões
  // (imagem já tem height:115% e translateY(-7.5%) no CSS para ter margem)
  // ─────────────────────────────────────────────────────────
  gsap.utils.toArray('.division-visual').forEach((container) => {
    const img = container.querySelector('img');
    if (!img) return;
    gsap.fromTo(img,
      { y: '-12%' },
      {
        y: '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: container.closest('.division-block'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      }
    );
  });

  // ─────────────────────────────────────────────────────────
  // 5. SVG PATH DRAW — linha que se desenha em "Como Funciona"
  // ─────────────────────────────────────────────────────────
  const linhaPath = document.querySelector('.process-svg-line svg path');
  if (linhaPath) {
    const len = linhaPath.getTotalLength();
    gsap.set(linhaPath, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(linhaPath, {
      strokeDashoffset: 0,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.process-section',
        start: 'top 65%',
        end: 'bottom 45%',
        scrub: 3,
      },
    });
  }

  // ─────────────────────────────────────────────────────────
  // COUNTERS
  // ─────────────────────────────────────────────────────────
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const isDecimal = target < 10;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
      onUpdate() { el.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val); },
      onComplete() { el.textContent = isDecimal ? target.toFixed(1) : target + '+'; },
    });
  });

  // Recalcula após loading screen sumir
  setTimeout(() => ScrollTrigger.refresh(), 2000);



  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      }
    );
  });

  // ─────────────────────────────────────────────────────────
  // 2. SPLITTYPE — Hero title letra por letra
  // ─────────────────────────────────────────────────────────
  if (typeof SplitType !== 'undefined') {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const split = new SplitType(heroTitle, { types: 'words,chars' });

      // Overflow hidden nos words para o efeito "letra sobe de baixo"
      if (split.words) {
        split.words.forEach((w) => {
          w.style.display = 'inline-block';
          w.style.overflow = 'hidden';
          w.style.verticalAlign = 'bottom';
        });
      }

      gsap.from(split.chars, {
        y: '110%',
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: { each: 0.04, overlap: 0.1 },
        delay: 1.8, // aguarda o loading screen (1.5s) sumir
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 3. SVG MARQUEE — texto desliza pela curva com scroll
  // ─────────────────────────────────────────────────────────
  const textPath = document.querySelector('.marquee-text-svg textPath');
  if (textPath) {
    gsap.to(textPath, {
      attr: { startOffset: '-20%' },
      ease: 'none',
      scrollTrigger: {
        trigger: '.marquee-section',
        start: 'top 80%',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }

  // ─────────────────────────────────────────────────────────
  // 4. PARALLAX SCRUB — imagens das divisões
  // ─────────────────────────────────────────────────────────
  gsap.utils.toArray('.division-visual img').forEach((img, i) => {
    gsap.fromTo(img,
      { y: -25 },
      {
        y: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.division-block'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      }
    );
  });



  // ─────────────────────────────────────────────────────────
  // HERO PARALLAX (scrub)
  // ─────────────────────────────────────────────────────────
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.fromTo(heroContent,
      { y: 0, opacity: 1 },
      {
        y: 150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      }
    );
  }

  // ─────────────────────────────────────────────────────────
  // COUNTERS
  // ─────────────────────────────────────────────────────────
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const isDecimal = target < 10;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
      onUpdate() {
        el.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val);
      },
      onComplete() {
        el.textContent = isDecimal ? target.toFixed(1) : target + '+';
      },
    });
  });

  // Recalcula posições após loading screen terminar
  setTimeout(() => ScrollTrigger.refresh(), 2000);

});
