/**
 * Cart Craft — Home 2 JavaScript Module
 * Interactive features, scroll reveals, stats counters, and 3D card tilt
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ============================================================ */
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.h2-reveal');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  };

  /* ============================================================
     2. ANIMATED NUMBER COUNTERS
     ============================================================ */
  const initCounters = () => {
    const counterElements = [
      { el: document.querySelector('.h2-stat:nth-child(1) .h2-stat-val'), target: 98, suffix: '<sup>%</sup>' },
      { el: document.querySelector('.h2-stat:nth-child(3) .h2-stat-val'), target: 50, suffix: '<sup>+</sup>' },
      { el: document.querySelector('.h2-about-badge-num'), target: 15, suffix: '<sup>+</sup>' }
    ];

    const animateNumber = (element, target, suffix) => {
      let current = 0;
      const duration = 1600;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        current = Math.floor(easeOut * target);

        element.innerHTML = `${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.innerHTML = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counterElements.forEach(item => {
        if (item.el) item.el.innerHTML = `${item.target}${item.suffix}`;
      });
      return;
    }

    counterElements.forEach(item => {
      if (!item.el) return;
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateNumber(item.el, item.target, item.suffix);
          obs.unobserve(item.el);
        }
      }, { threshold: 0.5 });
      obs.observe(item.el);
    });
  };

  /* ============================================================
     3. 3D TILT EFFECT ON HERO CARDS (LUXURY INTERACTION)
     ============================================================ */
  const initHeroCardTilt = () => {
    const cards = document.querySelectorAll('.h2-hero-card');
    if (!cards.length || window.matchMedia('(hover: none)').matches) return;

    cards.forEach(card => {
      let bounds;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const xPct = mouseX / bounds.width - 0.5;
        const yPct = mouseY / bounds.height - 0.5;

        const tiltX = -yPct * 6;
        const tiltY = xPct * 6;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
      };

      const onMouseLeave = () => {
        card.style.transition = 'transform 0.6s var(--h2-transition-smooth), box-shadow 0.6s var(--h2-transition-smooth)';
        card.style.transform = '';
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  };

  /* ============================================================
     4. GALLERY LIGHTBOX MODAL
     ============================================================ */
  const initGalleryLightbox = () => {
    const galleryItems = document.querySelectorAll('.h2-gallery-item');
    if (!galleryItems.length) return;

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'h2-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image preview');
    modal.innerHTML = `
      <style>
        .h2-modal {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(14, 4, 8, 0.94);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.35s ease, visibility 0.35s ease;
        }
        .h2-modal.is-active {
          opacity: 1;
          visibility: visible;
        }
        .h2-modal-inner {
          position: relative;
          max-width: 900px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: scale(0.92);
          transition: transform 0.35s var(--h2-transition-smooth);
        }
        .h2-modal.is-active .h2-modal-inner {
          transform: scale(1);
        }
        .h2-modal-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(201, 164, 92, 0.25);
          border: 1.5px solid rgba(201, 164, 92, 0.3);
        }
        .h2-modal-caption {
          font-family: var(--h2-font-serif, 'Cormorant Garamond', serif);
          font-size: 1.5rem;
          color: #F8F3E8;
          margin-top: 1rem;
          letter-spacing: 0.04em;
          text-align: center;
        }
        .h2-modal-close {
          position: absolute;
          top: -2.75rem;
          right: 0;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(201, 164, 92, 0.4);
          color: #FFF;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.25s, transform 0.25s;
        }
        .h2-modal-close:hover {
          background: var(--color-supportive, #C9A45C);
          color: #1A0A0F;
          transform: scale(1.08);
        }
      </style>
      <div class="h2-modal-inner">
        <button class="h2-modal-close" aria-label="Close image preview">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <img class="h2-modal-img" src="" alt="" />
        <p class="h2-modal-caption"></p>
      </div>
    `;

    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.h2-modal-img');
    const modalCap = modal.querySelector('.h2-modal-caption');
    const closeBtn = modal.querySelector('.h2-modal-close');

    const openModal = (imgSrc, captionText) => {
      modalImg.src = imgSrc;
      modalCap.textContent = captionText;
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeModal = () => {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      setTimeout(() => {
        modalImg.src = '';
      }, 350);
    };

    galleryItems.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const img = item.querySelector('.h2-gallery-img');
        const cap = item.querySelector('.h2-gallery-caption');
        if (img) {
          openModal(img.src, cap ? cap.textContent : '');
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  };

  /* ============================================================
     5. SMOOTH SCROLL WITH HEADER OFFSET
     ============================================================ */
  const initSmoothAnchors = () => {
    const anchors = document.querySelectorAll('a[href^="#h2-"]');
    const header = document.getElementById('site-header');

    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 70;
          const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // Run initializations
  initScrollReveal();
  initCounters();
  initHeroCardTilt();
  initGalleryLightbox();
  initSmoothAnchors();
});
