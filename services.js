/**
 * Cart Craft — Golf Cart Services & Genuine Parts Module
 * services.js — Interactive booking modal, service detail modal, parts inquiry modal, and scroll animations
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. SERVICE SCOPE DATA (FOR DETAIL MODAL)
     ============================================================ */
  const SERVICE_DATA = {
    repair: {
      tag: 'Mechanical & Drivetrain',
      badge: 'Master Certified Procedure',
      title: 'Golf Cart Mechanical & Electrical Repair',
      desc: 'Our master mechanics perform factory-grade diagnostics and repairs for all leading electric and gas golf carts. From motor rewinds to differential overhauls, we restore factory performance, quiet operation, and utmost safety.',
      image: 'assets/srv-mechanical-repair.jpg',
      alt: 'Certified master technician inspecting luxury golf cart powertrain in atelier workshop',
      bookingType: 'Golf Cart Repair',
      checklist: [
        'Complete computerized diagnostic scan of speed controller & electric motor',
        'Rear differential oil flush, seal check & precision bearing inspection',
        'Front steering rack & pinion alignment and tie rod adjustment',
        'Throttle sensor calibration & speed governor fine-tuning',
        'OEM wiring harness continuity testing & corrosion remediation',
        'Chassis load-bearing weld and structural frame stress analysis'
      ]
    },
    battery: {
      tag: 'Power Systems',
      badge: '5-Year Lithium Warranty',
      title: 'Golf Cart Battery Service & Lithium Conversion',
      desc: 'Upgrade your cart’s range and eliminate battery acid maintenance forever. We specialize in drop-in lithium iron phosphate (LiFePO4) conversions, cell balance diagnostics, terminal reconditioning, and smart charger testing.',
      image: 'assets/srv-battery-service.jpg',
      alt: '72V high-performance lithium battery conversion for custom golf cart chassis',
      bookingType: 'Battery Service',
      checklist: [
        'Drop-in 48V/72V Lithium-ion conversions with Bluetooth state-of-charge BMS',
        'Deep-cycle load testing and individual cell voltage variance profiling',
        'Terminal cleaning, cable re-lugging, and anti-corrosion barrier seal',
        'On-board smart charger calibration and float voltage verification',
        'Weight reduction re-balancing (+40% faster acceleration, 300 lbs lighter)',
        'Safe recycling and eco-disposal of legacy lead-acid cores'
      ]
    },
    brake: {
      tag: 'Safety & Stopping Power',
      badge: 'DOT Highway Safety Standard',
      title: 'Golf Cart Brake Service & Hydraulic Disc Upgrades',
      desc: 'Golf carts operating on hilly golf courses, resort communities, or street-legal roads require dependable stopping force. We service standard drum brakes and install high-performance 4-wheel hydraulic disc brake conversions.',
      image: 'assets/srv-brake-service.jpg',
      alt: 'Gold performance brake caliper and cross-drilled rotor on luxury golf cart',
      bookingType: 'Brake Service',
      checklist: [
        'Installation of 4-wheel hydraulic disc conversion kits with stainless rotors',
        'Drum machining, heavy-duty ceramic pad replacement, and return spring renewals',
        'Emergency park brake cable tensioning and pedal latch adjustment',
        'DOT 4 brake fluid pressure bleeding and stainless braided line upgrades',
        'Electronic motor brake solenoid testing and auto-lock hill hold calibration',
        'Comprehensive deceleration skid and hill-hold safety road testing'
      ]
    },
    tire: {
      tag: 'Tires & Alignment',
      badge: 'Computerized Road-Force Balance',
      title: 'Golf Cart Tire & Wheel Service',
      desc: 'Whether you need gentle low-impact turf tires for championship golf greens or DOT-approved street radials on 14-inch custom machine-faced alloys, our precision mounting and high-speed balancing guarantee a buttery smooth ride.',
      image: 'assets/srv-wheel-tire.jpg',
      alt: 'Digital laser wheel alignment rack with luxury custom gold wheels',
      bookingType: 'Tire & Wheel Service',
      checklist: [
        'Precision laser wheel alignment (camber, caster, and toe-in adjustment)',
        'Dynamic electronic high-speed tire balancing to eliminate high-speed steering wobble',
        'Tire mounting from 8" turf wheels up to 14" custom machined alloy rims',
        'Puncture repairs, heavy-duty inner tubes, and bead sealing',
        'All-terrain knobby tire clearance fitment for lifted golf carts',
        'Lug nut torque verification and hub bearing inspection'
      ]
    },
    electrical: {
      tag: 'Wiring & Electronics',
      badge: 'Diagnostic Scan Tools',
      title: 'Golf Cart Electrical Diagnostics & Controller Tuning',
      desc: 'From erratic solenoid clicking to full digital cockpit transformations, our electrical team diagnoses complex wiring faults, programs high-output motor controllers, and integrates premium marine audio and street legal lighting systems.',
      image: 'assets/srv-electrical-cockpit.jpg',
      alt: 'Luxury golf cart digital touchscreen cockpit with ambient gold illumination',
      bookingType: 'Electrical Diagnostics',
      checklist: [
        'Curtis & Navitas programmable speed controller tuning (up to 32 MPH)',
        'Full OEM and custom wiring harness fault tracing and insulation testing',
        'Automotive LED street legal light kit installation with turn signals and horn',
        'Marine-grade Bluetooth audio soundbars and subwoofer integration',
        'Digital GPS touchscreen dash displays with speed & state-of-charge readout',
        'Keyless digital ignition, USB quick-charge ports & auxiliary 12V converters'
      ]
    },
    maintenance: {
      tag: 'Preventative Care',
      badge: 'Factory 25-Point Checklist',
      title: 'Golf Cart Seasonal 25-Point Preventative Maintenance',
      desc: 'Keep your golf cart operating in peak condition year-round. Our certified 25-point preventative maintenance covers every mechanical, electrical, and structural component to avoid unexpected roadside breakdowns.',
      image: 'assets/srv-maintenance-detail.jpg',
      alt: 'White-glove 25-point preventative maintenance and ceramic detailing in aesthetic studio',
      bookingType: 'Preventative Maintenance',
      checklist: [
        'Suspension bushing lubrication, kingpin greasing, and shock absorber check',
        'Battery terminal cleaning, specific gravity test, and torque check',
        'Brake shoe clearance inspection and parking lock engagement check',
        'Differential gear oil level verification and leak inspection',
        'Tire tread wear inspection, tire rotation, and pressure optimization',
        'Full exterior vehicle wash, underbody debris removal, and detailing'
      ]
    }
  };


  /* ============================================================
     2. HELPER FUNCTIONS: MODAL MANAGEMENT
     ============================================================ */
  const openModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.remove('is-active');
    // Check if any other modal is still active
    const anyActive = document.querySelector('.srv-modal.is-active');
    if (!anyActive) {
      document.body.style.overflow = '';
    }
  };


  /* ============================================================
     3. DATE PICKER INITIALIZATION
     ============================================================ */
  const dateInput = document.getElementById('srv-date');
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${y}-${m}-${d}`;
    dateInput.min = tomorrowStr;
    dateInput.value = tomorrowStr;
  }


  /* ============================================================
     4. SERVICE BOOKING MODAL (#service-booking-modal)
     ============================================================ */
  const bookingModal = document.getElementById('service-booking-modal');
  const bookingClose = document.getElementById('srv-modal-close');
  const bookingBackdrop = document.getElementById('srv-modal-backdrop');
  const bookingForm = document.getElementById('service-appointment-form');
  const bookingSuccessView = document.getElementById('srv-success-view');
  const bookingSuccessClose = document.getElementById('srv-success-close');
  const bookingRefCode = document.getElementById('srv-ref-code');
  const serviceTypeSelect = document.getElementById('srv-type');

  // Trigger buttons with [data-open-service-modal]
  const bookTriggers = document.querySelectorAll('[data-open-service-modal]');
  bookTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselected = btn.getAttribute('data-open-service-modal');
      if (preselected && serviceTypeSelect) {
        // Find matching option
        for (let i = 0; i < serviceTypeSelect.options.length; i++) {
          if (serviceTypeSelect.options[i].value.toLowerCase().includes(preselected.toLowerCase()) ||
              preselected.toLowerCase().includes(serviceTypeSelect.options[i].value.toLowerCase())) {
            serviceTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
      // Reset form view in case it was previously submitted
      if (bookingForm && bookingSuccessView) {
        bookingForm.style.display = 'block';
        bookingSuccessView.classList.remove('is-visible');
      }
      openModal(bookingModal);
    });
  });

  if (bookingClose) {
    bookingClose.addEventListener('click', () => closeModal(bookingModal));
  }
  if (bookingBackdrop) {
    bookingBackdrop.addEventListener('click', () => closeModal(bookingModal));
  }

  // Handle Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Generate a realistic Reference Code: AUR-SRV-XXXXX
      const randomCode = 'AUR-SRV-' + Math.floor(10000 + Math.random() * 90000);
      if (bookingRefCode) {
        bookingRefCode.textContent = randomCode;
      }

      // Hide form and show confirmation view
      bookingForm.style.display = 'none';
      if (bookingSuccessView) {
        bookingSuccessView.classList.add('is-visible');
      }
    });
  }

  if (bookingSuccessClose) {
    bookingSuccessClose.addEventListener('click', () => {
      closeModal(bookingModal);
      if (bookingForm && bookingSuccessView) {
        bookingForm.reset();
        bookingForm.style.display = 'block';
        bookingSuccessView.classList.remove('is-visible');
      }
    });
  }


  /* ============================================================
     5. SERVICE DETAIL MODAL (#service-detail-modal)
     ============================================================ */
  const detailModal = document.getElementById('service-detail-modal');
  const detailClose = document.getElementById('srv-detail-close');
  const detailBackdrop = document.getElementById('srv-detail-backdrop');
  const detailImg = document.getElementById('srv-detail-img');
  const detailBadge = document.getElementById('srv-detail-badge');
  const detailTag = document.getElementById('srv-detail-tag');
  const detailTitle = document.getElementById('srv-detail-title');
  const detailDesc = document.getElementById('srv-detail-desc');
  const detailChecklist = document.getElementById('srv-detail-checklist');
  const detailBookBtn = document.getElementById('srv-detail-book-btn');

  let currentDetailService = null;

  const learnButtons = document.querySelectorAll('[data-learn-service]');
  learnButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-learn-service');
      const data = SERVICE_DATA[serviceKey];
      if (!data) return;

      currentDetailService = data;

      if (detailImg) {
        detailImg.src = data.image;
        detailImg.alt = data.alt;
      }
      if (detailBadge) detailBadge.textContent = data.badge;
      if (detailTag) detailTag.textContent = data.tag;
      if (detailTitle) detailTitle.textContent = data.title;
      if (detailDesc) detailDesc.textContent = data.desc;

      if (detailChecklist) {
        detailChecklist.innerHTML = '';
        data.checklist.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span class="srv-check" aria-hidden="true">&#10003;</span>
            <span>${item}</span>
          `;
          detailChecklist.appendChild(li);
        });
      }

      openModal(detailModal);
    });
  });

  if (detailClose) {
    detailClose.addEventListener('click', () => closeModal(detailModal));
  }
  if (detailBackdrop) {
    detailBackdrop.addEventListener('click', () => closeModal(detailModal));
  }

  // Inside Detail Modal: "Book This Service" button
  if (detailBookBtn) {
    detailBookBtn.addEventListener('click', () => {
      closeModal(detailModal);
      if (currentDetailService && serviceTypeSelect) {
        for (let i = 0; i < serviceTypeSelect.options.length; i++) {
          if (serviceTypeSelect.options[i].value.toLowerCase().includes(currentDetailService.bookingType.toLowerCase()) ||
              currentDetailService.bookingType.toLowerCase().includes(serviceTypeSelect.options[i].value.toLowerCase())) {
            serviceTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
      if (bookingForm && bookingSuccessView) {
        bookingForm.style.display = 'block';
        bookingSuccessView.classList.remove('is-visible');
      }
      openModal(bookingModal);
    });
  }


  /* ============================================================
     6. PARTS INQUIRY MODAL (#parts-inquiry-modal)
     ============================================================ */
  const partsModal = document.getElementById('parts-inquiry-modal');
  const partsClose = document.getElementById('parts-modal-close');
  const partsBackdrop = document.getElementById('parts-modal-backdrop');
  const partsForm = document.getElementById('parts-inquiry-form');
  const partsSuccessView = document.getElementById('parts-success-view');
  const partsSuccessClose = document.getElementById('parts-success-close');
  const partCategorySelect = document.getElementById('part-category-select');

  const partButtons = document.querySelectorAll('[data-part-cat]');
  partButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-part-cat');
      if (cat && partCategorySelect) {
        for (let i = 0; i < partCategorySelect.options.length; i++) {
          if (partCategorySelect.options[i].value.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().includes(partCategorySelect.options[i].value.toLowerCase())) {
            partCategorySelect.selectedIndex = i;
            break;
          }
        }
      }
      if (partsForm && partsSuccessView) {
        partsForm.style.display = 'block';
        partsSuccessView.classList.remove('is-visible');
      }
      openModal(partsModal);
    });
  });

  if (partsClose) {
    partsClose.addEventListener('click', () => closeModal(partsModal));
  }
  if (partsBackdrop) {
    partsBackdrop.addEventListener('click', () => closeModal(partsModal));
  }

  // Handle Parts Inquiry Submission
  if (partsForm) {
    partsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      partsForm.style.display = 'none';
      if (partsSuccessView) {
        partsSuccessView.classList.add('is-visible');
      }
    });
  }

  if (partsSuccessClose) {
    partsSuccessClose.addEventListener('click', () => {
      closeModal(partsModal);
      if (partsForm && partsSuccessView) {
        partsForm.reset();
        partsForm.style.display = 'block';
        partsSuccessView.classList.remove('is-visible');
      }
    });
  }


  /* ============================================================
     7. GLOBAL KEYBOARD ACCESSIBILITY (ESC TO CLOSE MODALS)
     ============================================================ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.srv-modal.is-active');
      activeModals.forEach(m => closeModal(m));
    }
  });


  /* ============================================================
     8. SCROLL REVEAL OBSERVER (.srv-reveal)
     ============================================================ */
  const revealElements = document.querySelectorAll('.srv-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }


  /* ============================================================
     9. SMOOTH SCROLL FOR IN-PAGE ANCHORS
     ============================================================ */
  const pageAnchors = document.querySelectorAll('a[href^="#"]');
  pageAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });


  /* ============================================================
     10. COMPREHENSIVE CARE SERVICE FILTER TABS
     ============================================================ */
  const filterTabs = document.querySelectorAll('.srv-filter-tab');
  const serviceCards = document.querySelectorAll('#srv-services-grid .srv-card');

  if (filterTabs.length > 0 && serviceCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filterVal = tab.getAttribute('data-filter');

        // Update active tab states
        filterTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        // Filter cards with smooth transition
        serviceCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.classList.remove('is-filtered-out');
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 40);
          } else {
            card.classList.add('is-filtered-out');
          }
        });
      });
    });
  }


  /* ============================================================
     11. CERTIFIED INVENTORY PARTS FILTER TABS
     ============================================================ */
  const partsFilterTabs = document.querySelectorAll('.srv-parts-tab');
  const partCards = document.querySelectorAll('#srv-parts-grid .srv-part-card');

  if (partsFilterTabs.length > 0 && partCards.length > 0) {
    partsFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filterVal = tab.getAttribute('data-parts-filter');

        partsFilterTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        partCards.forEach(card => {
          const category = card.getAttribute('data-parts-cat');
          if (filterVal === 'all' || category === filterVal) {
            card.classList.remove('is-filtered-out');
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 40);
          } else {
            card.classList.add('is-filtered-out');
          }
        });
      });
    });
  }

});


