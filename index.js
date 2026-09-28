/**
 * Cart Craft — Premium Golf Cart Website
 * index.js — Main JavaScript Module
 */

'use strict';

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'Cart Craft-theme';

  // Determine initial theme
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', initial);

  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    btn.setAttribute('aria-label', `Switch to ${current} theme`);
  });
})();


/* ============================================================
   2. RTL TOGGLE
   ============================================================ */
(function initRTL() {
  const root = document.documentElement;
  const btn  = document.getElementById('rtl-toggle');
  const STORAGE_KEY = 'Cart Craft-dir';

  // Restore saved preference
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    root.setAttribute('dir', saved);
  }

  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = root.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';

    // SAFETY: On desktop, ensure mobile menu is fully closed before switching direction.
    // Toggling dir on <html> can cause a brief reflow that triggers mobile menu visibility.
    if (window.innerWidth > 1024) {
      const mobileMenu = document.getElementById('mobile-menu');
      const overlay    = document.getElementById('mobile-overlay');
      const hamburger  = document.getElementById('hamburger');
      if (mobileMenu)  { mobileMenu.classList.remove('is-open'); }
      if (overlay)     { overlay.classList.remove('is-open'); }
      if (hamburger)   {
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    root.setAttribute('dir', next);
    localStorage.setItem(STORAGE_KEY, next);
    btn.setAttribute('aria-label', `Switch to ${current === 'rtl' ? 'LTR' : 'RTL'} direction`);
  });
})();


/* ============================================================
   3. HEADER — SCROLL BEHAVIOR
   ============================================================ */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastY = 0;
  let ticking = false;

  const onScroll = () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        if (lastY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
})();


/* ============================================================
   4. HOME DROPDOWN MENU
   ============================================================ */
(function initDropdown() {
  const trigger = document.getElementById('home-dropdown-btn');
  const menu    = trigger ? trigger.closest('.nav-dropdown-parent')?.querySelector('.dropdown-menu') : null;

  if (!trigger || !menu) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    menu.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    isOpen = false;
    menu.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? close() : open();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isOpen ? close() : open();
    }
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', (e) => {
    if (!trigger.closest('.nav-dropdown-parent').contains(e.target)) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
})();


/* ============================================================
   5. MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn  = document.getElementById('mobile-menu-close');
  const overlay   = document.getElementById('mobile-overlay');
  const body      = document.body;

  if (!hamburger || !mobileMenu) return;

  // Focusable elements inside mobile menu
  const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const openMenu = () => {
    mobileMenu.classList.add('is-open');
    overlay.classList.add('is-open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';

    // Focus first focusable element
    const first = mobileMenu.querySelector(focusableSelectors);
    if (first) setTimeout(() => first.focus(), 100);
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    hamburger.focus();
  };

  hamburger.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Focus trap inside mobile menu
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(mobileMenu.querySelectorAll(focusableSelectors));
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Close mobile menu when a nav link is clicked
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();


/* ============================================================
   6. SCROLL REVEAL ANIMATION
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.model-card, .models-filter-bar, .models-atelier-strip, .feature-item, .process-step, .custom-option, .section-header, .customization-grid, .cta-inner, .craft-content, .craft-card, .craft-visual-stack, .timeline-era-item, .timeline-nav-bar, .timeline-footer-banner'
  );

  if (!elements.length) return;

  // Add reveal class
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay for grid items
    if (el.classList.contains('model-card') || el.classList.contains('feature-item') || el.classList.contains('process-step')) {
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   7. SMOOTH ANCHOR SCROLLING
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('site-header')?.offsetHeight || 76;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerH - 16,
        behavior: 'smooth',
      });
    });
  });
})();


/* ============================================================
   8. HERO BACKGROUND SHAPE — SUBTLE PARALLAX
   ============================================================ */
(function initHeroParallax() {
  const shapes = document.querySelectorAll('.hero-shape-arc');
  if (!shapes.length) return;

  // Only run on non-mobile to avoid performance issues
  const isMobile = () => window.innerWidth < 768;

  let ticking = false;

  const onScroll = () => {
    if (isMobile() || ticking) return;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      shapes.forEach((shape, i) => {
        const speed = (i + 1) * 0.04;
        shape.style.transform = `translateY(calc(-50% + ${sy * speed}px)) scale(1)`;
      });
      ticking = false;
    });
    ticking = true;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   9. RESPONSIVE RESIZE HANDLER
   ============================================================ */
(function initResizeHandler() {
  let resizeTimer;

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Close mobile menu on resize to desktop
      if (window.innerWidth > 1024) {
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay    = document.getElementById('mobile-overlay');
        const hamburger  = document.getElementById('hamburger');

        if (mobileMenu?.classList.contains('is-open')) {
          mobileMenu.classList.remove('is-open');
          overlay?.classList.remove('is-open');
          hamburger?.classList.remove('is-open');
          hamburger?.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    }, 150);
  };

  window.addEventListener('resize', onResize, { passive: true });
})();


/* ============================================================
   10. ACTIVE NAV LINK ON SCROLL (Highlight current section)
   ============================================================ */
(function initActiveSection() {
  const sections = ['hero', 'philosophy', 'models', 'evolution', 'customization', 'features', 'process', 'cta'];
  const headerH = () => document.getElementById('site-header')?.offsetHeight || 76;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY + headerH() + 60;

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          const elTop = top + window.scrollY;
          const elBottom = bottom + window.scrollY;

          if (scrollY >= elTop && scrollY < elBottom) {
            // Could add additional nav highlighting logic here if needed
          }
        }
      });

      ticking = false;
    });
    ticking = true;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   10b. ATELIER MODELS FILTER INTERACTION
   ============================================================ */
(function initModelsFilter() {
  const filterBtns = document.querySelectorAll('.models-filter-btn');
  const cards = document.querySelectorAll('.models-grid .model-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach(card => {
        const modelId = card.getAttribute('data-model');
        if (filter === 'all' || filter === modelId) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            if (btn.getAttribute('data-filter') !== 'all' && btn.getAttribute('data-filter') !== modelId) {
              card.style.display = 'none';
            }
          }, 250);
        }
      });
    });
  });
})();


/* ============================================================
   11. TIMELINE INTERACTIVE ERA NAVIGATION
   ============================================================ */
(function initTimelineNav() {
  const navBtns = document.querySelectorAll('.timeline-nav-btn');
  const eraItems = document.querySelectorAll('.timeline-era-item');
  if (!navBtns.length || !eraItems.length) return;

  const headerH = () => document.getElementById('site-header')?.offsetHeight || 76;

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      navBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerH() - 30;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });

  // Highlight active nav tab based on scroll position
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollPos = window.scrollY + headerH() + 160;
      eraItems.forEach(item => {
        const top = item.offsetTop;
        const height = item.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          const id = item.id;
          navBtns.forEach(b => {
            const match = b.getAttribute('data-target') === id;
            b.classList.toggle('is-active', match);
            b.setAttribute('aria-selected', match ? 'true' : 'false');
          });
        }
      });
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ============================================================
   12. BESPOKE HERO STICKER & 3D STAGE INTERACTION
   ============================================================ */
(function initBespokeHero() {
  const visual = document.getElementById('hero-stage-visual');
  const card = document.getElementById('hero-sticker-card');
  const cartImg = document.getElementById('hero-main-cart-img');
  const btnSticker = document.getElementById('btn-sticker-mode');
  const btnStudio = document.getElementById('btn-studio-mode');
  const seal = document.getElementById('hero-seal-sticker');

  // Mode Toggle (Sticker Decal vs Studio Cutout)
  if (btnSticker && btnStudio && cartImg) {
    btnSticker.addEventListener('click', () => {
      btnSticker.classList.add('sticker-mode-btn--active');
      btnStudio.classList.remove('sticker-mode-btn--active');
      cartImg.classList.remove('is-studio-style');
      cartImg.classList.add('is-sticker-style');
    });

    btnStudio.addEventListener('click', () => {
      btnStudio.classList.add('sticker-mode-btn--active');
      btnSticker.classList.remove('sticker-mode-btn--active');
      cartImg.classList.remove('is-sticker-style');
      cartImg.classList.add('is-studio-style');
    });
  }

  // 3D Parallax Tilt Effect on Mouse Move
  if (visual && card) {
    let bounds = visual.getBoundingClientRect();
    let isHovered = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const updateBounds = () => {
      bounds = visual.getBoundingClientRect();
    };

    window.addEventListener('resize', updateBounds, { passive: true });
    window.addEventListener('scroll', updateBounds, { passive: true });

    visual.addEventListener('mouseenter', () => {
      isHovered = true;
      updateBounds();
      if (!rafId) renderTilt();
    });

    visual.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      // Normalized between -0.5 and 0.5
      targetX = (mouseX / bounds.width) - 0.5;
      targetY = (mouseY / bounds.height) - 0.5;
    });

    visual.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
    });

    function renderTilt() {
      // Smooth lerp
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const rotateY = currentX * 12; // tilt left/right
      const rotateX = -currentY * 8; // tilt up/down
      const transZ = isHovered ? 20 : 0;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${transZ}px)`;

      // Animate if still moving or hovered
      if (isHovered || Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
        rafId = requestAnimationFrame(renderTilt);
      } else {
        card.style.transform = '';
        rafId = null;
      }
    }
  }

  // Interactive Hotspot Tooltips & Touch Feedback
  const hotspots = document.querySelectorAll('.cart-hotspot');
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      e.stopPropagation();
      hotspot.classList.add('hotspot-active');
      setTimeout(() => hotspot.classList.remove('hotspot-active'), 800);
    });
  });

  // Seal click interaction
  if (seal) {
    seal.addEventListener('click', () => {
      seal.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      seal.style.transform = 'translateZ(40px) scale(1.18) rotate(360deg)';
      setTimeout(() => {
        seal.style.transform = '';
      }, 700);
    });
  }
})();


/* ============================================================
   12b. BESPOKE ATELIER CUSTOMIZATION STUDIO INTERACTION
   ============================================================ */
(function initAtelierCustomization() {
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  const activeSwatchName = document.getElementById('active-swatch-name');
  const stageImg = document.getElementById('atelier-preview-img');
  const hotspots = document.querySelectorAll('.atelier-hotspot');

  if (swatchBtns.length && activeSwatchName) {
    swatchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        swatchBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-checked', 'true');

        const colorName = btn.getAttribute('data-color');
        if (colorName) {
          activeSwatchName.textContent = colorName;
        }

        // Subtle glow flash on stage image
        if (stageImg) {
          stageImg.style.transition = 'filter 0.4s ease';
          stageImg.style.filter = 'brightness(1.12) contrast(1.05)';
          setTimeout(() => {
            stageImg.style.filter = '';
          }, 350);
        }
      });
    });
  }

  // Interactive Hotspot Tooltip click on mobile/touch
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      e.stopPropagation();
      const label = hotspot.querySelector('.hotspot-label');
      if (label) {
        label.style.transform = 'scale(1.15)';
        setTimeout(() => {
          label.style.transform = '';
        }, 400);
      }
    });
  });
})();


/* ============================================================
   13. INITIALIZATION LOG
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%cCart Craft — Premium Golf Cart Website', 'color:#9B9AE8;font-size:14px;font-weight:700;');
  console.log('%cBespoke Hero Stage & Sticker Module Initialized.', 'color:#C9A45C;font-size:11px;');
});

