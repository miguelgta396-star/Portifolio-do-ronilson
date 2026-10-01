/**
 * Registro em Luz — Main JavaScript
 * Handles navigation, animations, gallery, and lightbox functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ============================================
  // NAVBAR — scroll behavior & mobile toggle
  // ============================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Shrink navbar on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const animateElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('animated');
        }, parseInt(delay));
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ============================================
  // HERO PARALLAX & PARTICLES
  // ============================================
  const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    if (heroSection) {
      const scrolled = window.pageYOffset;
      const heroHeight = heroSection.offsetHeight;
      if (scrolled < heroHeight) {
        const opacity = 1 - (scrolled / heroHeight) * 1.2;
        const translateY = scrolled * 0.3;
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = `translateY(${translateY}px)`;
      }
    }
  });

  // Light particles in hero
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 6) + 's';
      particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
      particlesContainer.appendChild(particle);
    }
  }

  // ============================================
  // GALLERY FILTERS
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.classList.add('visible'), 10);
        } else {
          item.classList.remove('visible');
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    });
  });

  // Show all items initially
  galleryItems.forEach(item => item.classList.add('visible'));

  // ============================================
  // LIGHTBOX
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImgWrapper = document.getElementById('lightboxImgWrapper');
  const lightboxInfo = document.getElementById('lightboxInfo');

  let currentLightboxIndex = 0;
  let visibleItems = [];

  function openLightbox(item) {
    visibleItems = Array.from(galleryItems).filter(el => el.style.display !== 'none');
    const idx = visibleItems.indexOf(item);
    currentLightboxIndex = idx >= 0 ? idx : 0;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = visibleItems[currentLightboxIndex];
    if (!item) return;

    const overlay = item.querySelector('.gallery-overlay');
    const category = overlay ? (overlay.querySelector('.gallery-category')?.textContent || '') : '';
    const title = overlay ? (overlay.querySelector('h3')?.textContent || '') : '';
    const imgEl = item.querySelector('.gallery-img');

    lightboxImgWrapper.innerHTML = '';
    if (imgEl) {
      const clone = imgEl.cloneNode(true);
      clone.style.width = 'auto';
      clone.style.maxWidth = '100%';
      clone.style.maxHeight = '70vh';
      clone.style.objectFit = 'contain';
      clone.style.borderRadius = '12px';
      clone.style.display = 'block';
      clone.style.margin = '0 auto';
      lightboxImgWrapper.appendChild(clone);
    }

    lightboxInfo.innerHTML = `<span class="lb-category">${category}</span><h3>${title}</h3>`;
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
    updateLightbox();
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
      updateLightbox();
    }
  });

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
      const sectionId = section.getAttribute('id');

      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // ============================================
  // WHATSAPP FLOAT BUTTON — show after scroll
  // ============================================
  const whatsappFloat = document.getElementById('whatsappFloat');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      whatsappFloat.classList.add('visible');
    } else {
      whatsappFloat.classList.remove('visible');
    }
  });

  // ============================================
  // COUNTER ANIMATION (for future use with real stats)
  // ============================================
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
});
