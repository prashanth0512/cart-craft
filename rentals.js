/**
 * Cart Craft — Luxury Golf Cart Rentals Module
 * rentals.js — Interactive booking widget, reservation modal, experience modal, and scroll reveals
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. DATE PICKER DEFAULTS & LOGIC
     ============================================================ */
  const initDatePickers = () => {
    const pickupInput = document.getElementById('widget-pickup-date');
    const returnInput = document.getElementById('widget-return-date');
    const modalPickup = document.getElementById('res-pickup-date');
    const modalReturn = document.getElementById('res-return-date');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultReturn = new Date(tomorrow);
    defaultReturn.setDate(defaultReturn.getDate() + 3);

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const tomorrowStr = formatDate(tomorrow);
    const returnStr   = formatDate(defaultReturn);

    if (pickupInput && returnInput) {
      pickupInput.min = tomorrowStr;
      pickupInput.value = tomorrowStr;
      returnInput.min = tomorrowStr;
      returnInput.value = returnStr;

      pickupInput.addEventListener('change', () => {
        if (returnInput.value < pickupInput.value) {
          returnInput.value = pickupInput.value;
        }
        returnInput.min = pickupInput.value;
      });
    }

    if (modalPickup && modalReturn) {
      modalPickup.min = tomorrowStr;
      modalPickup.value = tomorrowStr;
      modalReturn.min = tomorrowStr;
      modalReturn.value = returnStr;

      modalPickup.addEventListener('change', () => {
        if (modalReturn.value < modalPickup.value) {
          modalReturn.value = modalPickup.value;
        }
        modalReturn.min = modalPickup.value;
        updateModalSummary();
      });

      modalReturn.addEventListener('change', updateModalSummary);
    }

    // Click anywhere on date inputs to open native calendar picker
    [pickupInput, returnInput, modalPickup, modalReturn].forEach(input => {
      if (input) {
        input.addEventListener('click', () => {
          if (typeof input.showPicker === 'function') {
            try {
              input.showPicker();
            } catch (e) {
              /* ignore error if already open */
            }
          }
        });
      }
    });
  };


  /* ============================================================
     2. RESERVATION BOOKING MODAL
     ============================================================ */
  const modal = document.getElementById('reservation-modal');
  const closeBtn = document.getElementById('reserve-modal-close');
  const backdrop = document.getElementById('reserve-modal-backdrop');
  const form = document.getElementById('rental-booking-form');
  const successView = document.getElementById('rental-reserve-success');
  const successClose = document.getElementById('reserve-success-close');
  const refCodeEl = document.getElementById('booking-ref-code');

  const vehicleSelect = document.getElementById('res-vehicle');
  const packageSelect = document.getElementById('res-package');
  const locationInput = document.getElementById('res-location');
  const passengerSelect = document.getElementById('res-passengers');

  const sumVehicle = document.getElementById('sum-vehicle');
  const sumDates   = document.getElementById('sum-dates');
  const sumLocation = document.getElementById('sum-location');

  const updateModalSummary = () => {
    if (sumVehicle && vehicleSelect) {
      sumVehicle.textContent = vehicleSelect.value;
    }
    if (sumLocation && locationInput) {
      sumLocation.textContent = locationInput.value || 'Resort Location';
    }
    const modalPickup = document.getElementById('res-pickup-date');
    const modalReturn = document.getElementById('res-return-date');
    if (sumDates && modalPickup && modalReturn && modalPickup.value && modalReturn.value) {
      sumDates.textContent = `${modalPickup.value} to ${modalReturn.value}`;
    }
  };

  const openReservationModal = (config = {}) => {
    if (!modal) return;

    if (config.vehicle && vehicleSelect) {
      for (let i = 0; i < vehicleSelect.options.length; i++) {
        if (vehicleSelect.options[i].text.includes(config.vehicle) || vehicleSelect.options[i].value.includes(config.vehicle)) {
          vehicleSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (config.pkg && packageSelect) {
      for (let i = 0; i < packageSelect.options.length; i++) {
        if (packageSelect.options[i].text.includes(config.pkg) || packageSelect.options[i].value.includes(config.pkg)) {
          packageSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (config.location && locationInput) {
      locationInput.value = config.location;
    }

    if (config.passengers && passengerSelect) {
      for (let i = 0; i < passengerSelect.options.length; i++) {
        if (passengerSelect.options[i].text.includes(config.passengers) || passengerSelect.options[i].value.includes(config.passengers)) {
          passengerSelect.selectedIndex = i;
          break;
        }
      }
    }

    const modalPickup = document.getElementById('res-pickup-date');
    const modalReturn = document.getElementById('res-return-date');
    if (config.pickup && modalPickup) modalPickup.value = config.pickup;
    if (config.returnDate && modalReturn) modalReturn.value = config.returnDate;

    updateModalSummary();

    form.style.display = 'block';
    successView.classList.remove('is-visible');
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    const nameField = document.getElementById('res-name');
    if (nameField) nameField.focus();
  };

  const closeReservationModal = () => {
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeReservationModal);
  if (backdrop) backdrop.addEventListener('click', closeReservationModal);
  if (successClose) successClose.addEventListener('click', closeReservationModal);

  if (vehicleSelect) vehicleSelect.addEventListener('change', updateModalSummary);
  if (locationInput) locationInput.addEventListener('input', updateModalSummary);

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing Reservation...';
      submitBtn.disabled = true;

      setTimeout(() => {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        if (refCodeEl) {
          refCodeEl.textContent = `AUR-RENT-${randomNum}`;
        }
        form.style.display = 'none';
        successView.classList.add('is-visible');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 700);
    });
  }

  // Hero Booking Widget Submission
  const heroForm = document.getElementById('rental-hero-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const location = document.getElementById('widget-location')?.value || '';
      const pickup = document.getElementById('widget-pickup-date')?.value || '';
      const returnDate = document.getElementById('widget-return-date')?.value || '';
      const passengers = document.getElementById('widget-passengers')?.value || '';

      openReservationModal({
        location,
        pickup,
        returnDate,
        passengers,
        vehicle: passengers.includes('2') ? '2-Seater' : (passengers.includes('6') ? '6-Seater' : '4-Seater')
      });
    });
  }

  // Trigger hooks
  document.querySelectorAll('[data-open-reserve]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openReservationModal();
    });
  });

  document.querySelectorAll('[data-reserve-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cartName = btn.getAttribute('data-reserve-cart');
      openReservationModal({ vehicle: cartName });
    });
  });

  document.querySelectorAll('[data-choose-package]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgName = btn.getAttribute('data-choose-package');
      openReservationModal({ pkg: pkgName });
    });
  });


  /* ============================================================
     3. EXPERIENCE MODAL
     ============================================================ */
  const expModal = document.getElementById('experience-modal');
  const expClose = document.getElementById('exp-modal-close');
  const expBackdrop = document.getElementById('exp-modal-backdrop');
  const expTitle = document.getElementById('exp-modal-title');
  const expDesc  = document.getElementById('exp-modal-desc');
  const expImg   = document.getElementById('exp-modal-img');
  const expBookBtn = document.getElementById('exp-book-btn');

  let currentExpTitle = '';

  const openExpModal = (title, imgUrl, description) => {
    if (!expModal) return;
    currentExpTitle = title;
    if (expTitle) expTitle.textContent = title;
    if (expDesc) expDesc.textContent = description;
    if (expImg) {
      expImg.src = imgUrl;
      expImg.alt = title;
    }
    expModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (expClose) expClose.focus();
  };

  const closeExpModal = () => {
    if (!expModal) return;
    expModal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (expClose) expClose.addEventListener('click', closeExpModal);
  if (expBackdrop) expBackdrop.addEventListener('click', closeExpModal);

  document.querySelectorAll('.rental-exp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-exp-title') || 'Resort Experience';
      const img   = btn.getAttribute('data-exp-img') || '';
      const desc  = btn.getAttribute('data-exp-desc') || '';
      openExpModal(title, img, desc);
    });
  });

  if (expBookBtn) {
    expBookBtn.addEventListener('click', () => {
      closeExpModal();
      setTimeout(() => {
        openReservationModal({
          location: currentExpTitle.includes('Beach') ? 'Beachside Cabana Hub' : (currentExpTitle.includes('Golf') ? 'Golf Pro Shop & Course' : 'Resort Clubhouse & Marina')
        });
      }, 200);
    });
  }

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('is-active')) closeReservationModal();
      if (expModal && expModal.classList.contains('is-active')) closeExpModal();
    }
  });


  /* ============================================================
     4. SCROLL REVEALS & ANCHORS
     ============================================================ */
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.rental-reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-visible'));
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
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  };

  const initSmoothAnchors = () => {
    const anchors = document.querySelectorAll('a[href^="#"]');
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
  initDatePickers();
  initScrollReveal();
  initSmoothAnchors();
});
