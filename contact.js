/**
 * Cart Craft — Luxury Golf Cart Contact Page
 * contact.js — FAQ accordion, contact form validation & ticket generation, and scroll reveals
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. DATE PICKER CONSTRAINTS
     ============================================================ */
  const dateInput = document.getElementById('contact-date');
  if (dateInput) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${y}-${m}-${d}`;
  }


  /* ============================================================
     2. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
     ============================================================ */
  const faqItems = document.querySelectorAll('.cnt-faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.cnt-faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other accordion items for clean focus
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherTrigger = otherItem.querySelector('.cnt-faq-trigger');
          if (otherTrigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ============================================================
     3. CONTACT FORM VALIDATION & TICKET GENERATION
     ============================================================ */
  const form = document.getElementById('main-contact-form');
  const successView = document.getElementById('contact-success-view');
  const ticketCodeEl = document.getElementById('contact-ticket-code');
  const successSummaryEl = document.getElementById('contact-success-summary');
  const resetBtn = document.getElementById('contact-reset-btn');

  // Fields to validate
  const nameField = document.getElementById('contact-name');
  const emailField = document.getElementById('contact-email');
  const phoneField = document.getElementById('contact-phone');
  const serviceField = document.getElementById('contact-service');
  const messageField = document.getElementById('contact-message');
  const dateField = document.getElementById('contact-date');

  const validateField = (field, condition) => {
    if (!field) return true;
    const parent = field.closest('.cnt-form-field');
    if (!condition) {
      if (parent) parent.classList.add('has-error');
      return false;
    } else {
      if (parent) parent.classList.remove('has-error');
      return true;
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+0-9\s\-()]{7,}$/;

  if (form) {
    // Clear error on input
    [nameField, emailField, phoneField, serviceField, messageField].forEach(f => {
      if (f) {
        f.addEventListener('input', () => {
          const parent = f.closest('.cnt-form-field');
          if (parent) parent.classList.remove('has-error');
        });
        f.addEventListener('change', () => {
          const parent = f.closest('.cnt-form-field');
          if (parent) parent.classList.remove('has-error');
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameField, nameField && nameField.value.trim().length >= 2);
      const isEmailValid = validateField(emailField, emailField && emailRegex.test(emailField.value.trim()));
      const isPhoneValid = validateField(phoneField, phoneField && phoneRegex.test(phoneField.value.trim()));
      const isServiceValid = validateField(serviceField, serviceField && serviceField.value !== '');
      const isMessageValid = validateField(messageField, messageField && messageField.value.trim().length >= 5);

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceValid || !isMessageValid) {
        // Find first invalid and focus
        const firstError = form.querySelector('.cnt-form-field.has-error input, .cnt-form-field.has-error select, .cnt-form-field.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Generate reference ticket code: AUR-MSG-XXXXX
      const ticketNum = 'AUR-MSG-' + Math.floor(10000 + Math.random() * 90000);
      if (ticketCodeEl) {
        ticketCodeEl.textContent = ticketNum;
      }

      // Populate summary
      if (successSummaryEl) {
        const clientName = nameField.value.trim();
        const clientEmail = emailField.value.trim();
        const selectedTopic = serviceField.value;
        const prefDate = (dateField && dateField.value) ? dateField.value : 'No specific date';

        successSummaryEl.innerHTML = `
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Topic:</strong> ${selectedTopic}</p>
          <p><strong>Preferred Timing:</strong> ${prefDate}</p>
        `;
      }

      // Hide form and show confirmation
      form.style.display = 'none';
      if (successView) {
        successView.classList.add('is-visible');
        successView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (form) {
        form.reset();
        form.style.display = 'block';
      }
      if (successView) {
        successView.classList.remove('is-visible');
      }
      if (nameField) nameField.focus();
    });
  }


  /* ============================================================
     4. SCROLL REVEAL OBSERVER (.cnt-reveal)
     ============================================================ */
  const revealElements = document.querySelectorAll('.cnt-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }


  /* ============================================================
     5. SMOOTH SCROLL FOR IN-PAGE ANCHORS
     ============================================================ */
  const inPageLinks = document.querySelectorAll('a[href^="#"]');
  inPageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });


  /* ============================================================
     6. HERO VIDEO PLAYBACK CONTROLLER
     ============================================================ */
  const heroVideo = document.getElementById('contact-hero-video');
  const videoToggle = document.getElementById('cnt-video-toggle');

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;

    // Explicit autoplay trigger
    const startVideo = () => {
      heroVideo.muted = true;
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was blocked; retry once on first user interaction
          const unlock = () => {
            heroVideo.play().catch(() => {});
            ['click', 'touchstart', 'scroll'].forEach(evt => {
              window.removeEventListener(evt, unlock);
            });
          };
          ['click', 'touchstart', 'scroll'].forEach(evt => {
            window.addEventListener(evt, unlock, { once: true, passive: true });
          });
        });
      }
    };

    startVideo();

    if (videoToggle) {
      const pauseIcon = videoToggle.querySelector('.cnt-video-icon-pause');
      const playIcon = videoToggle.querySelector('.cnt-video-icon-play');
      const txtSpan = videoToggle.querySelector('.cnt-video-txt');

      videoToggle.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play();
          if (pauseIcon) pauseIcon.style.display = 'inline-block';
          if (playIcon) playIcon.style.display = 'none';
          if (txtSpan) txtSpan.textContent = 'Atelier Film';
          videoToggle.setAttribute('aria-label', 'Pause background video');
        } else {
          heroVideo.pause();
          if (pauseIcon) pauseIcon.style.display = 'none';
          if (playIcon) playIcon.style.display = 'inline-block';
          if (txtSpan) txtSpan.textContent = 'Paused';
          videoToggle.setAttribute('aria-label', 'Play background video');
        }
      });
    }
  }

});
