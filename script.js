/**
 * MOTO ROAM - Motorcycle Touring Landing Page Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------- */
  /* 1. Navbar Scroll Effect & Mobile Menu Toggle                               */
  /* -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    navLinkItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 2. Dynamic Animated Odometer Numbers                                       */
  /* -------------------------------------------------------------------------- */
  const odometerNumbers = document.querySelectorAll('.odometer-number');
  let animated = false;

  const animateCounters = () => {
    odometerNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const step = Math.ceil(target / (duration / 16));

      let current = 0;
      const updateCount = () => {
        current += step;
        if (current < target) {
          counter.innerText = current.toLocaleString('id-ID');
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target.toLocaleString('id-ID');
        }
      };
      updateCount();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateCounters();
        animated = true;
      }
    });
  }, { threshold: 0.4 });

  const heroSection = document.querySelector('.hero');
  if (heroSection) observer.observe(heroSection);

  /* -------------------------------------------------------------------------- */
  /* 3. Expedition Route Category Filtering                                     */
  /* -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const routeCards = document.querySelectorAll('.route-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      routeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. Interactive Bike Specs Accordion                                         */
  /* -------------------------------------------------------------------------- */
  const specHeaders = document.querySelectorAll('.spec-header');

  specHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.parentElement;
      const chevron = header.querySelector('.fa-chevron-down');
      
      const isOpen = card.classList.contains('open');

      // Close all other spec cards
      document.querySelectorAll('.spec-card').forEach(c => {
        c.classList.remove('open');
        const icon = c.querySelector('.fa-chevron-down');
        if (icon) icon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        card.classList.add('open');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. Interactive Trip & Fuel Calculator                                      */
  /* -------------------------------------------------------------------------- */
  const calcDistance = document.getElementById('calcDistance');
  const rangeDistance = document.getElementById('rangeDistance');
  const calcTerrain = document.getElementById('calcTerrain');
  const calcFuelType = document.getElementById('calcFuelType');

  const resLiters = document.getElementById('resLiters');
  const resCost = document.getElementById('resCost');
  const resHours = document.getElementById('resHours');
  const resStops = document.getElementById('resStops');

  const calculateTrip = () => {
    if (!calcDistance || !calcTerrain || !calcFuelType) return;

    const distance = parseFloat(calcDistance.value) || 0;
    const terrainFactor = parseFloat(calcTerrain.value) || 1.0;
    const fuelPrice = parseFloat(calcFuelType.value) || 14800;

    // Base efficiency: 22 KM/L on smooth flat asphalt
    const actualEfficiency = 22 / terrainFactor;

    const litersNeeded = distance / actualEfficiency;
    const totalCost = litersNeeded * fuelPrice;
    
    // Average touring pace speed ~ 55 km/h including short breaks
    const hoursNeeded = distance / 55;

    // Suggested stops every 140-160 KM for rest & refueling
    const stopsNeeded = Math.max(1, Math.round(distance / 150));

    // Update DOM Display
    resLiters.innerText = `${litersNeeded.toFixed(1)} L`;
    resCost.innerText = `Rp ${Math.round(totalCost).toLocaleString('id-ID')}`;
    resHours.innerText = `${hoursNeeded.toFixed(1)} Jam`;
    resStops.innerText = `${stopsNeeded} - ${stopsNeeded + 1} Kali`;
  };

  if (calcDistance && rangeDistance) {
    calcDistance.addEventListener('input', (e) => {
      rangeDistance.value = e.target.value;
      calculateTrip();
    });

    rangeDistance.addEventListener('input', (e) => {
      calcDistance.value = e.target.value;
      calculateTrip();
    });

    calcTerrain.addEventListener('change', calculateTrip);
    calcFuelType.addEventListener('change', calculateTrip);

    // Initial run
    calculateTrip();
  }

  /* -------------------------------------------------------------------------- */
  /* 6. Route Modal & GPX Track Downloader                                      */
  /* -------------------------------------------------------------------------- */
  const routeModal = document.getElementById('routeModal');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const modalTitle = document.getElementById('modalTitle');
  const modalDist = document.getElementById('modalDist');
  const modalDays = document.getElementById('modalDays');
  const modalDesc = document.getElementById('modalDesc');
  const btnDownloadGpx = document.getElementById('btnDownloadGpx');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const dist = btn.getAttribute('data-dist');
      const days = btn.getAttribute('data-days');
      const desc = btn.getAttribute('data-desc');

      if (modalTitle) modalTitle.innerText = title;
      if (modalDist) modalDist.innerHTML = `<i class="fa-solid fa-road"></i> ${dist}`;
      if (modalDays) modalDays.innerHTML = `<i class="fa-solid fa-calendar"></i> ${days}`;
      if (modalDesc) modalDesc.innerText = desc;

      routeModal.classList.add('active');
    });
  });

  const closeModal = () => {
    if (routeModal) routeModal.classList.remove('active');
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (routeModal) {
    routeModal.addEventListener('click', (e) => {
      if (e.target === routeModal) closeModal();
    });
  }

  if (btnDownloadGpx) {
    btnDownloadGpx.addEventListener('click', () => {
      const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="MOTO ROAM Track Exporter">
  <metadata><name>${modalTitle.innerText || 'Touring Track'}</name></metadata>
  <trk><name>Track Log</name><trkseg></trkseg></trk>
</gpx>`;
      
      const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(modalTitle.innerText || 'touring_route').toLowerCase().replace(/[^a-z0-9]/g, '_')}.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 7. Lightbox Photo Gallery                                                  */
  /* -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption');

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxCaption) lightboxCaption.innerText = caption || '';

      if (lightbox) lightbox.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.classList.remove('active');
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 8. Contact Form Handling                                                   */
  /* -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const btnSubmit = document.getElementById('btnSubmit');

  if (contactForm && btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Mohon lengkapi Nama, Email, dan Pesan sebelum mengirim!');
        return;
      }

      btnSubmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim...`;
      btnSubmit.disabled = true;

      setTimeout(() => {
        btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> Pesan Terkirim!`;
        btnSubmit.style.background = '#10B981';

        alert(`Terima kasih Bro ${name}! Pesan dan pengajuan rute/GPX telah diterima. Kami akan membalas ke email ${email}. Ride safe! 🏍️💨`);

        contactForm.reset();

        setTimeout(() => {
          btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Kirim Pesan Sekarang`;
          btnSubmit.style.background = '';
          btnSubmit.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

});
