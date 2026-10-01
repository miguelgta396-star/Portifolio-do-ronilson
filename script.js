/**
 * Registro em Luz — JavaScript Principal (v1.2)
 * Fotografia por Ronilson Ferreira
 * Arquivo na raiz para compatibilidade total com GitHub Pages.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // NAVBAR — scroll behavior & mobile toggle
  // ============================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL COM OFFSET DO NAVBAR
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const animateElements = document.querySelectorAll('[data-animate]');

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
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // ============================================
  // PARTICULAS NO HERO
  // ============================================
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 24; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particle.style.width = particle.style.height = (2 + Math.random() * 3) + 'px';
      particlesContainer.appendChild(particle);
    }
  }

  // ============================================
  // FILTROS DA GALERIA
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.classList.add('visible'), 10);
        } else {
          item.classList.remove('visible');
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Mostra todos os itens inicialmente
  galleryItems.forEach(item => item.classList.add('visible'));

  // ============================================
  // LIGHTBOX MODAL
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
    if (!lightbox) return;
    visibleItems = Array.from(galleryItems).filter(el => el.style.display !== 'none');
    const idx = visibleItems.indexOf(item);
    currentLightboxIndex = idx >= 0 ? idx : 0;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
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

    if (lightboxImgWrapper) {
      lightboxImgWrapper.innerHTML = '';
      if (imgEl) {
        const clone = imgEl.cloneNode(true);
        clone.style.width = 'auto';
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '72vh';
        clone.style.objectFit = 'contain';
        clone.style.borderRadius = '12px';
        clone.style.display = 'block';
        clone.style.margin = '0 auto';
        lightboxImgWrapper.appendChild(clone);
      }
    }

    if (lightboxInfo) {
      lightboxInfo.innerHTML = `<span class="lb-category">${category}</span><h3>${title}</h3>`;
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
      updateLightbox();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
      updateLightbox();
    });
  }

  // Teclado para o Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
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
  // FAQ ACCORDION (Caixinhas Interativas)
  // ============================================
  const faqCaixinhas = document.querySelectorAll('.faq-caixinha');

  faqCaixinhas.forEach(caixinha => {
    const header = caixinha.querySelector('.faq-caixinha-header');
    const content = caixinha.querySelector('.faq-caixinha-content');

    if (header && content) {
      header.addEventListener('click', () => {
        const isActive = caixinha.classList.contains('active');

        // Fecha outras caixinhas para manter elegância e foco
        faqCaixinhas.forEach(other => {
          if (other !== caixinha) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.faq-caixinha-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        // Alterna a caixinha atual
        if (!isActive) {
          caixinha.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          caixinha.classList.remove('active');
          content.style.maxHeight = null;
        }
      });
    }
  });

  // Abre a primeira caixinha por padrão
  if (faqCaixinhas.length > 0) {
    const first = faqCaixinhas[0];
    const firstContent = first.querySelector('.faq-caixinha-content');
    first.classList.add('active');
    if (firstContent) {
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }

  // ============================================
  // WHATSAPP FLOAT BUTTON — visível após rolar
  // ============================================
  const whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        whatsappFloat.classList.add('visible');
      } else {
        whatsappFloat.classList.remove('visible');
      }
    });
  }
});
