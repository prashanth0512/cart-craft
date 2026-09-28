/**
 * Cart Craft — Luxury Golf Cart Rentals Coming Soon
 * coming-soon.js — Live ticking countdown timer and email notify form handler
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. LIVE COUNTDOWN TIMER (Initialized to 28 Days 12 Hrs)
     ============================================================ */
  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');

  // Set target launch timestamp: 28 days, 12 hours, 37 mins, 26 secs from first view
  const STORAGE_KEY_LAUNCH = 'Cart Craft-launch-target';
  let targetTime = localStorage.getItem(STORAGE_KEY_LAUNCH);

  if (!targetTime) {
    const now = new Date().getTime();
    // 28 days + 12 hours + 37 minutes + 26 seconds in milliseconds
    const launchOffset = (28 * 24 * 60 * 60 + 12 * 60 * 60 + 37 * 60 + 26) * 1000;
    targetTime = now + launchOffset;
    localStorage.setItem(STORAGE_KEY_LAUNCH, String(targetTime));
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  const updateCountdown = () => {
    const now = new Date().getTime();
    let distance = targetTime - now;

    if (distance <= 0) {
      // If time expired, reset with fresh 14 days
      distance = (14 * 24 * 60 * 60) * 1000;
      targetTime = now + distance;
      localStorage.setItem(STORAGE_KEY_LAUNCH, String(targetTime));
    }

    const days  = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl)  daysEl.textContent  = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl)  minsEl.textContent  = String(mins).padStart(2, '0');
    if (secsEl)  secsEl.textContent  = String(secs).padStart(2, '0');
  };

  // Run immediately and tick every second
  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ============================================================
     2. EMAIL NOTIFICATION SUBSCRIPTION FORM
     ============================================================ */
  const notifyForm  = document.getElementById('cs-notify-form');
  const emailInput  = document.getElementById('cs-email');
  const successMsg  = document.getElementById('cs-success-msg');
  const submitBtn   = document.getElementById('cs-notify-submit');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (notifyForm) {
    notifyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailVal = emailInput ? emailInput.value.trim() : '';

      if (!emailRegex.test(emailVal)) {
        if (emailInput) {
          emailInput.style.color = '#E53935';
          emailInput.focus();
          setTimeout(() => {
            emailInput.style.color = '';
          }, 1500);
        }
        return;
      }

      // Store in localStorage
      try {
        localStorage.setItem('Cart Craft-notify-email', emailVal);
      } catch (err) {
        /* storage disabled */
      }

      // Show success feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Subscribed &check;</span>';
      }
      if (emailInput) {
        emailInput.disabled = true;
      }
      if (successMsg) {
        successMsg.classList.add('is-visible');
      }
    });
  }

});
