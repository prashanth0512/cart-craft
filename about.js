/**
 * Cart Craft — Luxury Golf Cart Website
 * about.js — JavaScript Module for About Page
 * Handles theme toggle, RTL toggle, header scroll, navigation dropdown,
 * mobile drawer, FAQ accordion, telemetry counters, and scroll reveals.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. THEME TOGGLE (CONSISTENT WITH HOME 1)
     ============================================================ */
  (function initTheme() {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    const STORAGE_KEY = 'Cart Craft-theme';

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
     2. RTL TOGGLE (CONSISTENT WITH HOME 1)
     ============================================================ */
  (function initRTL() {
    const root = document.documentElement;
    const btn = document.getElementById('rtl-toggle');
    const STORAGE_KEY = 'Cart Craft-dir';

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      root.setAttribute('dir', saved);
    }

    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = root.getAttribute('dir') || 'ltr';
      const next = current === 'ltr' ? 'rtl' : 'ltr';

      // Immediately close any open mobile menu and reset hamburger state
      const mobileMenu = document.getElementById('mobile-menu');
      const overlay    = document.getElementById('mobile-overlay');
      const hamburger  = document.getElementById('hamburger');
      if (mobileMenu)  mobileMenu.classList.remove('is-open');
      if (overlay)     overlay.classList.remove('is-open');
      if (hamburger) {
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';

      // Disable transitions during direction switch to eliminate any reflow/sliding glitch
      root.classList.add('no-transitions');
      root.setAttribute('dir', next);
      void root.offsetHeight; // force synchronous layout computation without transitions
      requestAnimationFrame(() => {
        root.classList.remove('no-transitions');
      });

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
    onScroll();
  })();


  /* ============================================================
     4. HOME DROPDOWN MENU
     ============================================================ */
  (function initDropdown() {
    const trigger = document.getElementById('home-dropdown-btn');
    const menu = trigger ? trigger.closest('.nav-dropdown-parent')?.querySelector('.dropdown-menu') : null;

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
      const parent = trigger.closest('.nav-dropdown-parent');
      if (parent && !parent.contains(e.target)) {
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
    const closeBtn = document.getElementById('mobile-menu-close');
    const overlay = document.getElementById('mobile-overlay');
    const body = document.body;

    if (!hamburger || !mobileMenu) return;

    const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const openMenu = () => {
      mobileMenu.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';

      const first = mobileMenu.querySelector(focusableSelectors);
      if (first) setTimeout(() => first.focus(), 100);
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      hamburger.focus();
    };

    hamburger.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close on mobile link click
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  })();


  /* ============================================================
     6. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
     ============================================================ */
  (function initFAQ() {
    const faqItems = document.querySelectorAll('.abt-faq-item');

    faqItems.forEach(item => {
      const trigger = item.querySelector('.abt-faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close other items for a focused luxury experience
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherTrigger = otherItem.querySelector('.abt-faq-trigger');
            if (otherTrigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle clicked item
        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();


  /* ============================================================
     7. SMOOTH IN-PAGE ANCHOR SCROLLING
     ============================================================ */
  (function initSmoothScroll() {
    const inPageLinks = document.querySelectorAll('a[href^="#"]');
    inPageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '70', 10);
            const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 16;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  })();


  /* ============================================================
     8. TELEMETRY NUMBER TICKER ON HERO ENTRANCE
     ============================================================ */
  (function initTelemetryAnimation() {
    const telemetrySection = document.querySelector('.abt-hero-telemetry');
    if (!telemetrySection) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          // Add subtle entrance pulse
          telemetrySection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          telemetrySection.style.opacity = '1';
          telemetrySection.style.transform = 'translateY(0)';
          observer.unobserve(telemetrySection);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(telemetrySection);
  })();


  /* ============================================================
     9. UNIVERSAL CART CRAFT BOOKING FORM CARD MODAL
     ============================================================ */
  (function initBookingModal() {
    const modal = document.getElementById('cc-booking-modal');
    if (!modal) return;

    const backdrop = document.getElementById('cc-modal-backdrop');
    const closeBtn = document.getElementById('cc-modal-close');
    const bookingForm = document.getElementById('cc-booking-form');
    const successView = document.getElementById('cc-booking-success');
    const doneBtn = document.getElementById('cc-btn-done');
    const calendarBtn = document.getElementById('cc-btn-calendar');

    const categoryPills = modal.querySelectorAll('.cc-cat-pill');
    const categoryNoticeText = document.getElementById('cc-notice-text');
    const categoryHiddenInput = document.getElementById('cc-selected-category-input');
    const modelSelect = document.getElementById('cc-book-model');
    const dateInput = document.getElementById('cc-book-date');

    const ticketCode = document.getElementById('cc-ticket-code');
    const ticketName = document.getElementById('cc-ticket-name');
    const ticketCategory = document.getElementById('cc-ticket-category');
    const ticketModel = document.getElementById('cc-ticket-model');
    const ticketDateTime = document.getElementById('cc-ticket-datetime');

    let lastBookingData = null;

    if (dateInput) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const tomorrowStr = `${yyyy}-${mm}-${dd}`;
      dateInput.min = tomorrowStr;
      dateInput.value = tomorrowStr;
    }

    const categoryConfigs = {
      'test-drive': {
        label: 'Private Test Drive',
        notice: 'Complimentary private estate or country club test drive with our master artisan concierge.',
        suggestedModel: '4-Passenger Estate Cruiser (Forward-Facing)'
      },
      'custom-build': {
        label: 'Bespoke Commission',
        notice: 'Bespoke architectural tailoring: custom leather swatches, chassis colors, and lithium power options.',
        suggestedModel: 'Bespoke One-of-One Custom Commission'
      },
      'rental-fleet': {
        label: 'VIP Event Rental',
        notice: 'Concierge event delivery, multi-cart tournament fleet coordination, and 24/7 on-site support.',
        suggestedModel: '6-Passenger Grand Touring Limousine'
      },
      'service-lithium': {
        label: 'Service & Lithium',
        notice: 'White-glove enclosed trailer pickup, 25-point inspection, and certified lithium conversions.',
        suggestedModel: 'High-Performance Lithium Battery Conversion'
      }
    };

    const selectCategory = (catKey) => {
      const config = categoryConfigs[catKey] || categoryConfigs['test-drive'];

      categoryPills.forEach(pill => {
        const isMatch = pill.getAttribute('data-category') === catKey;
        pill.classList.toggle('is-active', isMatch);
        pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (categoryHiddenInput) categoryHiddenInput.value = catKey;
      if (categoryNoticeText) categoryNoticeText.textContent = config.notice;

      if (modelSelect && config.suggestedModel) {
        for (let i = 0; i < modelSelect.options.length; i++) {
          if (modelSelect.options[i].value === config.suggestedModel) {
            modelSelect.selectedIndex = i;
            break;
          }
        }
      }
    };

    categoryPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const catKey = pill.getAttribute('data-category');
        if (catKey) selectCategory(catKey);
      });
    });

    let lastActiveTrigger = null;

    const openModal = (triggerElement, categoryToPreselect) => {
      lastActiveTrigger = triggerElement || document.activeElement;

      const mobileMenu = document.getElementById('mobile-menu');
      const overlay = document.getElementById('mobile-overlay');
      const hamburger = document.getElementById('hamburger');
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-open');
        if (hamburger) {
          hamburger.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }

      if (categoryToPreselect && categoryConfigs[categoryToPreselect]) {
        selectCategory(categoryToPreselect);
      }

      if (bookingForm && successView) {
        bookingForm.style.display = 'block';
        successView.style.display = 'none';
      }

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const nameInput = document.getElementById('cc-book-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 120);
      }
    };

    const closeModal = () => {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    };

    const triggers = document.querySelectorAll('[data-open-booking-modal], #header-book-btn, .mobile-book-btn');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const preselected = btn.getAttribute('data-open-booking-modal') || btn.getAttribute('data-category');
        openModal(btn, preselected);
      });
      if (btn.tagName !== 'BUTTON' && btn.tagName !== 'A') {
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-active')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = Array.from(modal.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetParent !== null);

        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = (document.getElementById('cc-book-name')?.value || '').trim();
        const phoneVal = (document.getElementById('cc-book-phone')?.value || '').trim();
        const emailVal = (document.getElementById('cc-book-email')?.value || '').trim();
        const modelVal = document.getElementById('cc-book-model')?.value || '4-Passenger Estate Cruiser';
        const dateVal = document.getElementById('cc-book-date')?.value || '';
        const timeVal = document.getElementById('cc-book-time')?.value || 'Morning Window';
        const locationVal = (document.getElementById('cc-book-location')?.value || '').trim() || 'Client Residence / Country Club';
        const currentCatKey = categoryHiddenInput?.value || 'test-drive';
        const currentCatLabel = categoryConfigs[currentCatKey]?.label || 'VIP Experience';

        if (!nameVal || !phoneVal || !emailVal) {
          alert('Please provide your name, phone number, and email address.');
          return;
        }

        const randomCode = 'CC-VIP-' + Math.floor(10000 + Math.random() * 90000);

        if (ticketCode) ticketCode.textContent = randomCode;
        if (ticketName) ticketName.textContent = nameVal;
        if (ticketCategory) ticketCategory.textContent = currentCatLabel;
        if (ticketModel) ticketModel.textContent = modelVal;

        let formattedDate = dateVal;
        if (dateVal) {
          try {
            const parts = dateVal.split('-');
            const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
            formattedDate = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch (_) {}
        }
        if (ticketDateTime) {
          ticketDateTime.textContent = `${formattedDate || 'Scheduled Date'} • ${timeVal.split('(')[0].trim() || 'Selected Window'}`;
        }

        lastBookingData = {
          code: randomCode,
          name: nameVal,
          category: currentCatLabel,
          model: modelVal,
          date: dateVal,
          time: timeVal,
          location: locationVal,
          email: emailVal
        };

        bookingForm.style.display = 'none';
        if (successView) {
          successView.style.display = 'block';
        }

        const card = modal.querySelector('.cc-modal-card');
        if (card) card.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        closeModal();
        if (bookingForm) {
          bookingForm.reset();
          if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
          }
        }
      });
    }

    if (calendarBtn) {
      calendarBtn.addEventListener('click', () => {
        if (!lastBookingData || !lastBookingData.date) {
          alert('Your reservation has been confirmed. An email calendar invite will be sent.');
          return;
        }

        const dateClean = lastBookingData.date.replace(/-/g, '');
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Cart Craft Luxury Golf Carts//VIP Booking//EN',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          `UID:cartcraft-${lastBookingData.code}@cartcraft.com`,
          `DTSTAMP:${dateClean}T090000Z`,
          `DTSTART:${dateClean}T100000Z`,
          `DTEND:${dateClean}T120000Z`,
          `SUMMARY:Cart Craft VIP Consultation — ${lastBookingData.category}`,
          `DESCRIPTION:Cart Craft VIP reservation reference: ${lastBookingData.code}\\nVehicle: ${lastBookingData.model}\\nTime Window: ${lastBookingData.time}\\nConcierge inquiries: concierge@cartcraft.com`,
          `LOCATION:${lastBookingData.location.replace(/,/g, '\\,')}`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `CartCraft-VIP-${lastBookingData.code}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        calendarBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Calendar File Saved!</span>
        `;
        setTimeout(() => {
          calendarBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Add to Calendar (.ics)</span>
          `;
        }, 3000);
      });
    }

    window.openCartCraftBookingModal = (category) => openModal(null, category);
  })();

});

