/**
 * Cart Craft — Premium Golf Cart Sales Module
 * sales.js — Inventory filtering, interactive quote & specs modals, scroll reveals
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. VEHICLE DATA STORE (SPECIFICATIONS & DETAILS)
     ============================================================ */
  const VEHICLE_DATA = {
    'monarch-4': {
      brand: 'Cart Craft Signature',
      title: 'Monarch 4 Luxury LSV',
      price: '$16,490',
      finance: 'Financing from $249/mo on approved credit',
      category: 'electric luxury street-legal 4-seater',
      img: 'https://images.unsplash.com/photo-1597586124394-fbd6ef244026?w=1000&q=85&auto=format&fit=crop',
      desc: 'The benchmark of luxury low-speed vehicles. Hand-stitched diamond-quilted marine leather, 9-inch touchscreen display with Apple CarPlay, integrated Bluetooth soundbar, and automotive hydraulic 4-wheel disc brakes.',
      specs: [
        { k: 'Seating Capacity', v: '4-Passenger (2 Forward + 2 Rear Flip)' },
        { k: 'Drivetrain', v: '72V AC High-Output Brushless Motor (5.0kW)' },
        { k: 'Battery Pack', v: '105Ah Maintenance-Free Lithium-Ion' },
        { k: 'Top Speed', v: '25 mph (DOT Street-Legal LSV)' },
        { k: 'Estimated Range', v: '45 Miles per Full Charge' },
        { k: 'Charging Time', v: '2.5 - 3.5 Hours (110V/220V On-Board)' },
        { k: 'Brakes', v: '4-Wheel Hydraulic Disc with Auto-Park' },
        { k: 'Chassis', v: 'All-Aluminum Aircraft-Grade Non-Rust Frame' },
        { k: 'Wheels & Tires', v: '14" Machine-Faced Alloys / 205/50R14 Radial' },
        { k: 'Certified Warranty', v: '5-Year Lithium & Drivetrain Limited' }
      ]
    },
    'sovereign-6': {
      brand: 'Cart Craft Executive',
      title: 'Sovereign 6 Executive Tourer',
      price: '$21,850',
      finance: 'Financing from $329/mo on approved credit',
      category: 'electric luxury 6-seater',
      img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=1000&q=85&auto=format&fit=crop',
      desc: 'Designed for VIP hospitality, private estates, and luxury community touring. Extended wheelbase with two rows of forward-facing captain bucket seats, rear flip-down luggage platform, wireless inductive charging docks, and ambient underglow.',
      specs: [
        { k: 'Seating Capacity', v: '6-Passenger (4 Forward + 2 Rear Flip)' },
        { k: 'Drivetrain', v: '72V 6.3kW AC Electric Powertrain' },
        { k: 'Battery Pack', v: '160Ah High-Capacity Lithium-Ion' },
        { k: 'Top Speed', v: '25 mph (LSV Compliant)' },
        { k: 'Estimated Range', v: '55 Miles per Full Charge' },
        { k: 'Charging Time', v: '3.5 - 4.5 Hours Smart Fast-Charge' },
        { k: 'Suspension', v: 'Independent Double A-Arm with Coil Springs' },
        { k: 'Interior', v: 'Nappa Marine Upholstery with Cooled Foam' },
        { k: 'Audio System', v: '8-Speaker Wet Sounds Marine Bluetooth' },
        { k: 'Certified Warranty', v: '5-Year Comprehensive Powertrain' }
      ]
    },
    'apex-gt': {
      brand: 'Cart Craft Sport',
      title: 'Apex GT Sport Edition',
      price: '$14,990',
      finance: 'Financing from $229/mo on approved credit',
      category: 'electric custom 4-seater',
      img: 'https://images.unsplash.com/photo-1571987502951-92bb0cd1d37e?w=1000&q=85&auto=format&fit=crop',
      desc: 'Track-inspired aerodynamic styling combined with responsive torque. Features custom two-tone rally upholstery, flat-bottom leather sport steering wheel, lifted sport suspension, and matte-black alloy rims with aggressive road grip.',
      specs: [
        { k: 'Seating Capacity', v: '4-Passenger Sport Configuration' },
        { k: 'Drivetrain', v: '48V AC 5.0kW High-Speed Motor' },
        { k: 'Battery Pack', v: '105Ah Lithium-Ion with BMS Protection' },
        { k: 'Top Speed', v: '24 mph Performance Tuning' },
        { k: 'Estimated Range', v: '40 Miles per Full Charge' },
        { k: 'Suspension', v: 'Sport-Tuned Heavy-Duty Shocks' },
        { k: 'Steering', v: 'Rack-and-Pinion Sport Feedback' },
        { k: 'Lighting', v: 'Automotive Projector LED with DRL Halo' },
        { k: 'Wheels & Tires', v: '14" Matte Black Alloy / Low-Profile Radials' },
        { k: 'Certified Warranty', v: '5-Year Drivetrain Warranty' }
      ]
    },
    'boulevard': {
      brand: 'Cart Craft Urban',
      title: 'Boulevard Street-Legal LSV',
      price: '$15,750',
      finance: 'Financing from $239/mo on approved credit',
      category: 'electric street-legal 4-seater',
      img: 'https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=1000&q=85&auto=format&fit=crop',
      desc: 'Built specifically for public road compliance up to 35 mph zones. Includes full Department of Transportation (DOT) certified safety suite: automotive glass windshield with electric wiper, 3-point seatbelts, high/low beam headlights, and backup camera.',
      specs: [
        { k: 'Seating Capacity', v: '4-Passenger DOT Street Legal' },
        { k: 'DOT Status', v: 'FMVSS 500 Certified Low-Speed Vehicle' },
        { k: 'Drivetrain', v: '48V AC 4.0kW High-Efficiency Motor' },
        { k: 'Battery Pack', v: '105Ah Lithium-Ion Quick-Charge' },
        { k: 'Top Speed', v: '25 mph (Federally Regulated LSV)' },
        { k: 'Estimated Range', v: '42 Miles per Charge' },
        { k: 'Windshield', v: 'AS4 Tempered Glass with Wiper & Washer' },
        { k: 'Safety Restraints', v: '3-Point Retractable Seatbelts on All Seats' },
        { k: 'Mirrors & Signals', v: 'Dual Side Mirrors with Integrated LED Turn Indicators' },
        { k: 'Certified Warranty', v: '5-Year Limited Coverage' }
      ]
    },
    'estate-cruiser': {
      brand: 'Cart Craft Classic',
      title: 'Estate Cruiser Classic 4',
      price: '$12,890',
      finance: 'Financing from $195/mo on approved credit',
      category: 'electric 4-seater',
      img: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1000&q=85&auto=format&fit=crop',
      desc: 'The benchmark of reliable course elegance. Dual sand bottles, integrated under-seat cooler, fold-down tinted windshield, premium USB charging console, and an ultra-smooth powertrain engineered for serene mornings on the green.',
      specs: [
        { k: 'Seating Capacity', v: '4-Passenger Classic Configuration' },
        { k: 'Drivetrain', v: '48V Quiet-Drive Electric Motor' },
        { k: 'Battery Pack', v: '48V Deep-Cycle Lithium Pack' },
        { k: 'Top Speed', v: '19.5 mph (Course Speed Governed)' },
        { k: 'Estimated Range', v: '35 Miles per Charge' },
        { k: 'Course Gear', v: 'Dual Sand Bottles, Ball Washer, Cooler' },
        { k: 'Tires', v: 'Course-Friendly 18" Non-Marking Turf Radials' },
        { k: 'Frame', v: 'Corrosion-Resistant Powder-Coated Aluminum' },
        { k: 'Canopy', v: 'Extended Flow-Through Drain Canopy Top' },
        { k: 'Certified Warranty', v: '5-Year Lithium / 3-Year Bumper-to-Bumper' }
      ]
    },
    'grand-horizon': {
      brand: 'Cart Craft Commercial',
      title: 'Grand Horizon 6 Resort Limo',
      price: '$23,400',
      finance: 'Financing from $355/mo or Fleet Lease',
      category: 'electric luxury 6-seater',
      img: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=1000&q=85&auto=format&fit=crop',
      desc: 'The gold standard for luxury resorts, boutique hotels, and premier club communities. Boasts an extended chassis, heavy-duty commercial transaxle, full Sunbrella canopy with roll-down weather shields, and rear fold-out luggage capacity.',
      specs: [
        { k: 'Seating Capacity', v: '6-Passenger Commercial Grade' },
        { k: 'Drivetrain', v: '72V 7.0kW AC High-Torque Motor' },
        { k: 'Battery Pack', v: '160Ah Lithium Commercial Fleet Grade' },
        { k: 'Top Speed', v: '22 mph (Resort Speed Governed)' },
        { k: 'Estimated Range', v: '50 Miles per Full Charge' },
        { k: 'Payload Capacity', v: '1,400 lbs Maximum Rating' },
        { k: 'Roof & Enclosure', v: 'Sunbrella Extended Top with Clear Enclosure' },
        { k: 'Lighting Package', v: 'Full Perimeter Courtesy & Ambient Floor LEDs' },
        { k: 'Sound System', v: 'Driver PA Mic + Bluetooth Passenger Speakers' },
        { k: 'Certified Warranty', v: '5-Year Drivetrain / 2-Year Fleet Service' }
      ]
    },
    'outlaw': {
      brand: 'Cart Craft Off-Road',
      title: 'Outlaw 4x4 Off-Road Custom',
      price: '$17,250',
      finance: 'Financing from $265/mo on approved credit',
      category: 'electric custom 4-seater',
      img: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1000&q=85&auto=format&fit=crop',
      desc: 'Uncompromising trail authority with luxury comfort. Features a 6-inch heavy-duty A-arm lift kit, 23-inch rugged all-terrain treads, aggressive safari front brush guard, roof-mounted 40-inch LED light bar, and diamond plate rocker protection.',
      specs: [
        { k: 'Seating Capacity', v: '4-Passenger Lifted All-Terrain' },
        { k: 'Drivetrain', v: 'High-Torque 48V AC 5.0kW Electric Motor' },
        { k: 'Battery Pack', v: '105Ah Ruggedized Sealed Lithium-Ion' },
        { k: 'Top Speed', v: '24 mph High-Torque Setup' },
        { k: 'Estimated Range', v: '38 Miles on Mixed Terrain' },
        { k: 'Lift Kit', v: '6" Heavy-Duty Independent Double A-Arm Lift' },
        { k: 'Tires & Wheels', v: '23x10-14 Aggressive All-Terrain on 14" Alloys' },
        { k: 'Off-Road Gear', v: 'Steel Bull-Bar, 40" LED Bar, Fender Flares' },
        { k: 'Underbody', v: 'Aircraft Aluminum Front Skid Plate' },
        { k: 'Certified Warranty', v: '5-Year Powertrain Limited' }
      ]
    },
    'gas-gt': {
      brand: 'Cart Craft Powertrain',
      title: 'Whispering Gas GT 4',
      price: '$13,650',
      finance: 'Financing from $205/mo on approved credit',
      category: 'gas 4-seater',
      img: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1000&q=85&auto=format&fit=crop',
      desc: 'The unmatched freedom of endless range. Powered by a commercial 429cc overhead-cam engine with closed-loop Electronic Fuel Injection (EFI) for effortless cold weather start-ups, ultra-low emissions, and over 300 miles on a single 6-gallon tank.',
      specs: [
        { k: 'Seating Capacity', v: '4-Passenger Classic Touring' },
        { k: 'Engine Type', v: '429cc Commercial Overhead-Cam Single-Cylinder' },
        { k: 'Fuel System', v: 'Closed-Loop Electronic Fuel Injection (EFI)' },
        { k: 'Horsepower', v: '14.0 HP Peak Rating' },
        { k: 'Fuel Capacity', v: '6.0 Gallons (300+ Miles Range)' },
        { k: 'Top Speed', v: '20 mph Governed' },
        { k: 'Exhaust System', v: 'Automotive Submerged Acoustic Baffle Muffler' },
        { k: 'Starting System', v: 'Pedal-Start Instant Electronic Ignition' },
        { k: 'Chassis', v: 'Heavy-Duty Welded Box-Beam Steel with E-Coat' },
        { k: 'Certified Warranty', v: '5-Year Commercial Engine Limited' }
      ]
    }
  };


  /* ============================================================
     2. EVERY DETAIL HAS A PURPOSE — INTERACTIVE HOTSPOTS
     ============================================================ */
  const initPurposeHotspots = () => {
    const spots = document.querySelectorAll('.purpose-spot');
    const cards = document.querySelectorAll('.purpose-card');
    if (!spots.length || !cards.length) return;

    const setActiveSpot = (spotId) => {
      const idStr = String(spotId);
      spots.forEach(s => {
        const match = s.getAttribute('data-spot') === idStr;
        s.classList.toggle('is-active', match);
        s.setAttribute('aria-expanded', match ? 'true' : 'false');
      });

      cards.forEach(c => {
        const match = c.getAttribute('data-spot-card') === idStr;
        c.classList.toggle('is-active', match);
      });
    };

    // Clicking and hovering on spots
    spots.forEach(spot => {
      const id = spot.getAttribute('data-spot');
      spot.addEventListener('click', () => setActiveSpot(id));
      spot.addEventListener('mouseenter', () => setActiveSpot(id));
    });

    // Clicking and hovering on detail cards
    cards.forEach(card => {
      const id = card.getAttribute('data-spot-card');
      card.addEventListener('click', () => setActiveSpot(id));
      card.addEventListener('mouseenter', () => setActiveSpot(id));
    });

    // Category button triggers scroll smoothly to purpose section
    const triggerButtons = document.querySelectorAll('[data-filter-trigger]');
    triggerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const purposeEl = document.getElementById('every-detail-purpose');
        if (purposeEl) {
          const header = document.getElementById('site-header');
          const headerHeight = header ? header.offsetHeight : 70;
          const targetTop = purposeEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  };


  /* ============================================================
     3. VEHICLE DETAILS MODAL
     ============================================================ */
  const initDetailsModal = () => {
    const modal = document.getElementById('details-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('details-modal-close');
    const backdrop = document.getElementById('details-modal-backdrop');
    const quoteBtn = document.getElementById('details-quote-btn');

    const brandEl = document.getElementById('details-brand');
    const titleEl = document.getElementById('details-modal-title');
    const priceEl = document.getElementById('details-price');
    const descEl = document.getElementById('details-desc');
    const imgEl = document.getElementById('details-img');
    const specsGrid = document.getElementById('details-specs-grid');

    let currentModelTitle = '';

    const openDetails = (modelKey) => {
      const data = VEHICLE_DATA[modelKey];
      if (!data) return;

      currentModelTitle = data.title;
      brandEl.textContent = data.brand;
      titleEl.textContent = data.title;
      priceEl.textContent = data.price;
      descEl.textContent = data.desc;
      imgEl.src = data.img;
      imgEl.alt = data.title;

      // Populate specs grid
      specsGrid.innerHTML = data.specs.map(spec => `
        <div class="sales-spec-item">
          <span class="sales-spec-k">${spec.k}</span>
          <span class="sales-spec-v">${spec.v}</span>
        </div>
      `).join('');

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeDetails = () => {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-open-details]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modelKey = btn.getAttribute('data-open-details');
        openDetails(modelKey);
      });
    });

    closeBtn.addEventListener('click', closeDetails);
    backdrop.addEventListener('click', closeDetails);

    quoteBtn.addEventListener('click', () => {
      closeDetails();
      setTimeout(() => {
        window.openQuoteModal(currentModelTitle);
      }, 200);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeDetails();
      }
    });
  };


  /* ============================================================
     4. GET A QUOTE / SALES INQUIRY MODAL
     ============================================================ */
  const initQuoteModal = () => {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('quote-modal-close');
    const backdrop = document.getElementById('quote-modal-backdrop');
    const form = document.getElementById('sales-quote-form');
    const successView = document.getElementById('sales-quote-success');
    const successClose = document.getElementById('quote-success-close');
    const modelSelect = document.getElementById('quote-model');

    window.openQuoteModal = (preselectedModel) => {
      if (preselectedModel && modelSelect) {
        let matched = false;
        for (let i = 0; i < modelSelect.options.length; i++) {
          if (modelSelect.options[i].text.includes(preselectedModel) || modelSelect.options[i].value.includes(preselectedModel)) {
            modelSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          modelSelect.value = preselectedModel;
        }
      }

      form.style.display = 'block';
      successView.classList.remove('is-visible');
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      const nameInput = document.getElementById('quote-name');
      if (nameInput) nameInput.focus();
    };

    const closeQuote = () => {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-open-quote]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const model = btn.getAttribute('data-open-quote') || '';
        window.openQuoteModal(model);
      });
    });

    closeBtn.addEventListener('click', closeQuote);
    backdrop.addEventListener('click', closeQuote);
    if (successClose) successClose.addEventListener('click', closeQuote);

    // Form Submission Simulation
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Transmitting Inquiry...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        successView.classList.add('is-visible');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 750);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeQuote();
      }
    });
  };


  /* ============================================================
     5. SCROLL REVEALS & ANCHORS
     ============================================================ */
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.sales-reveal');
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


  /* ============================================================
     6. PERFORMANCE REFINED DYNAMIC DRIVE MODES
     ============================================================ */
  const initPerformanceModes = () => {
    const modeBtns = document.querySelectorAll('.sales-perf-mode-btn');
    if (!modeBtns.length) return;

    const badge = document.getElementById('perf-active-badge');
    const throttleBar = document.getElementById('calib-throttle');
    const throttleVal = document.getElementById('calib-throttle-val');
    const regenBar = document.getElementById('calib-regen');
    const regenVal = document.getElementById('calib-regen-val');
    const speedBar = document.getElementById('calib-speed');
    const speedVal = document.getElementById('calib-speed-val');

    const accelMetric = document.getElementById('perf-metric-accel');
    const rangeMetric = document.getElementById('perf-metric-range');
    const soundMetric = document.getElementById('perf-metric-sound');
    const inclineMetric = document.getElementById('perf-metric-incline');

    const modeData = {
      eco: {
        badge: 'MODE: <strong>ECO GLIDE</strong>',
        throttlePct: '55%',
        throttleText: '55% Smooth Curve',
        regenPct: '90%',
        regenText: '90% Max Recovery',
        speedPct: '50%',
        speedText: '15 MPH (Turf Safe)',
        accel: '4.5<span class="sales-perf-unit">s</span>',
        range: '75+<span class="sales-perf-unit">mi</span>',
        sound: '< 28<span class="sales-perf-unit">dB</span>',
        incline: '25<span class="sales-perf-unit">%</span>'
      },
      cruise: {
        badge: 'MODE: <strong>CRUISE LSV</strong>',
        throttlePct: '80%',
        throttleText: '80% Proportional',
        regenPct: '65%',
        regenText: '65% Standard',
        speedPct: '83%',
        speedText: '25 MPH (LSV Cap)',
        accel: '3.2<span class="sales-perf-unit">s</span>',
        range: '65+<span class="sales-perf-unit">mi</span>',
        sound: '< 32<span class="sales-perf-unit">dB</span>',
        incline: '35<span class="sales-perf-unit">%</span>'
      },
      sport: {
        badge: 'MODE: <strong>APEX SPORT</strong>',
        throttlePct: '100%',
        throttleText: '100% Instant Torque',
        regenPct: '50%',
        regenText: '50% Dynamic Bias',
        speedPct: '100%',
        speedText: '30+ MPH (Dyno Track)',
        accel: '2.6<span class="sales-perf-unit">s</span>',
        range: '48+<span class="sales-perf-unit">mi</span>',
        sound: '< 36<span class="sales-perf-unit">dB</span>',
        incline: '42<span class="sales-perf-unit">%</span>'
      }
    };

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (!mode || !modeData[mode]) return;

        modeBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const data = modeData[mode];
        if (badge) badge.innerHTML = data.badge;
        if (throttleBar) throttleBar.style.width = data.throttlePct;
        if (throttleVal) throttleVal.textContent = data.throttleText;
        if (regenBar) regenBar.style.width = data.regenPct;
        if (regenVal) regenVal.textContent = data.regenText;
        if (speedBar) speedBar.style.width = data.speedPct;
        if (speedVal) speedVal.textContent = data.speedText;

        if (accelMetric) accelMetric.innerHTML = data.accel;
        if (rangeMetric) rangeMetric.innerHTML = data.range;
        if (soundMetric) soundMetric.innerHTML = data.sound;
        if (inclineMetric) inclineMetric.innerHTML = data.incline;
      });
    });
  };

  /* ============================================================
     7. HERO SHOWROOM STAGE INTERACTIVE SWITCHER
     ============================================================ */
  const initHeroStageSwitcher = () => {
    const stagePills = document.querySelectorAll('.sales-stage-pill');
    const stageImg = document.getElementById('sales-stage-active-img');
    const stageTitle = document.getElementById('sales-stage-title');
    const techSpec = document.getElementById('sales-stage-tech-spec');
    const craftSpec = document.getElementById('sales-stage-craft-spec');

    if (!stagePills.length || !stageImg) return;

    stagePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const newImg = pill.getAttribute('data-img');
        const newTitle = pill.getAttribute('data-title');
        const newTech = pill.getAttribute('data-tech');
        const newCraft = pill.getAttribute('data-craft');

        stagePills.forEach(p => {
          p.classList.remove('is-active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-selected', 'true');

        // Smooth crossfade
        stageImg.classList.add('is-fade');
        setTimeout(() => {
          if (newImg) stageImg.src = newImg;
          if (newTitle && stageTitle) stageTitle.textContent = newTitle;
          if (newTech && techSpec) techSpec.innerHTML = newTech;
          if (newCraft && craftSpec) craftSpec.innerHTML = newCraft;
          stageImg.classList.remove('is-fade');
        }, 180);
      });
    });
  };

  // Run all module inits
  initHeroStageSwitcher();
  initPurposeHotspots();
  initPerformanceModes();
  initDetailsModal();
  initQuoteModal();
  initScrollReveal();
  initSmoothAnchors();
});

