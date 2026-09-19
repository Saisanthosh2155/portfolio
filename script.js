/**
 * script.js — Portfolio of Sai Santhosh
 * Features:
 *  - Typing animation
 *  - Smooth navbar (scroll spy, mobile menu)
 *  - Scroll reveal
 *  - Animated counters
 *  - Project filter
 *  - Contact form validation
 *  - Back to top
 */

/* ── 1. TYPING ANIMATION ─────────────────────────────────── */
(function initTyping() {
  const el    = document.getElementById('typingText');
  const words = ['AI & ML Engineer', 'Data Science Enthusiast', 'Python Developer', 'Full-Stack Builder'];
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  const SPEED_TYPE   = 80;
  const SPEED_DELETE = 45;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 400;

  function tick() {
    const word = words[wordIdx];

    if (!deleting) {
      // Typing forward
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        // Full word shown — pause then start deleting
        deleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        // Fully deleted — move to next word
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, deleting ? SPEED_DELETE : SPEED_TYPE);
  }

  tick();
})();


/* ── 2. NAVBAR ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  // Scrolled shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll spy — highlight active section
  const sections = document.querySelectorAll('section[id]');

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spyObserver.observe(s));
})();


/* ── 3. SCROLL REVEAL ────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve once revealed to keep it visible
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();


/* ── 4. ANIMATED COUNTERS ────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let started    = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Trigger when About section enters view
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      counters.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target, 1800);
      });
    }
  }, { threshold: 0.3 });

  observer.observe(aboutSection);
})();




/* ── 5. PROJECT FILTER ───────────────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      cards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();


/* ── 6. TECH-TAG CLICK FILTER ────────────────────────────── */
(function initTechTagFilter() {
  const cards = Array.from(document.querySelectorAll('.project-card[data-category]'));
  if (!cards.length) return;

  let lastTech = null;

  function showAll() {
    cards.forEach(c => c.classList.remove('hidden'));
    lastTech = null;
    document.querySelectorAll('.tech-tag').forEach(t => t.classList.remove('tech-tag--active'));
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  }

  document.body.addEventListener('click', (e) => {
    const tag = e.target.closest('.tech-tag');
    if (!tag) return;
    const tech = tag.textContent.trim();

    // toggle: if same tech clicked twice, reset
    if (lastTech === tech) {
      showAll();
      return;
    }

    // set active visuals
    document.querySelectorAll('.tech-tag').forEach(t => t.classList.toggle('tech-tag--active', t === tag));
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

    // filter cards
    cards.forEach(card => {
      const techs = Array.from(card.querySelectorAll('.tech-tag')).map(t => t.textContent.trim());
      const match = techs.includes(tech);
      card.classList.toggle('hidden', !match);
    });

    lastTech = tech;
  });

  // Add cursor affordance for tags
  document.querySelectorAll('.tech-tag').forEach(t => t.style.cursor = 'pointer');
})();




/* ── 7. DASHBOARD MODAL ─────────────────────────────────── */
(function initDashboardModal() {
  const modal = document.getElementById('dashboardModal');
  const frame = document.getElementById('dashboardFrame');
  const loader = document.getElementById('dashboardLoader');
  const openButtons = document.querySelectorAll('.dashboard-open-btn');
  const closeButtons = document.querySelectorAll('[data-close-modal]');

  if (!modal || !frame || !loader) return;

  let isOpen = false;
  let loadTimeout = null;
  const loaderOriginal = loader.innerHTML;

  function showLoadError(url) {
    loader.innerHTML = `
      <div class="dashboard-error">
        <p>Unable to display the dashboard here — embedding may be blocked by the provider.</p>
        <a class="btn-sm btn-ghost" href="${url}" target="_blank" rel="noopener">Open in new tab</a>
      </div>`;
    loader.classList.remove('is-hidden');
  }

  function openModal(url) {
    if (!url) return;

    // reset loader content & state
    loader.innerHTML = loaderOriginal;
    loader.classList.remove('is-hidden');

    // set iframe src and show modal
    frame.src = url;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    isOpen = true;

    // fallback: if iframe hasn't loaded in 8s, show a helpful error + open link option
    clearTimeout(loadTimeout);
    loadTimeout = setTimeout(() => showLoadError(url), 8000);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    frame.removeAttribute('src');
    // restore loader and clear timeout
    clearTimeout(loadTimeout);
    loader.innerHTML = loaderOriginal;
    loader.classList.remove('is-hidden');
    isOpen = false;
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-dashboard-url');
      openModal(url);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target.matches('.dashboard-modal__backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      closeModal();
    }
  });

  frame.addEventListener('load', () => {
    // iframe loaded — hide loader and clear fallback
    clearTimeout(loadTimeout);
    loader.classList.add('is-hidden');
    // ensure loader content reset for next open
    setTimeout(() => { loader.innerHTML = loaderOriginal; }, 250);
  });
})();


/* ── 8. BACK TO TOP ──────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 9. HERO PARALLAX (subtle) ───────────────────────────── */
(function initParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (!orb1 || !orb2) return;

  // Only on desktop where it looks good
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orb1.style.transform = `translate(${dx * 20}px, ${dy * 20}px)`;
    orb2.style.transform = `translate(${-dx * 15}px, ${-dy * 15}px)`;
  }, { passive: true });
})();
