// ===== PG360 — Avir-style 3D Movement & Cinematic Scroll =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== Navbar scroll effect =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== Mobile menu toggle =====
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('active');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // ===== Sidebar active state on scroll =====
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const sections = document.querySelectorAll('[id^="section-"]');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id.replace('section-', '');

        sidebarItems.forEach(item => {
          item.classList.remove('active');
          if (item.dataset.section === sectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ===== Sidebar click scroll =====
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = 'section-' + item.dataset.section;
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Nav link smooth scroll =====
  document.querySelectorAll('.nav-link[href^="#"], .footer-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          const spans = hamburger.querySelectorAll('span');
          spans[0].style.transform = '';
          spans[1].style.opacity = '';
          spans[2].style.transform = '';
        }
      }
    });
  });

  // ===== Scroll Reveal with stagger =====
  const revealElements = document.querySelectorAll(
    '.amenity-card, .security-item, .hk-item, .support-card, .dining-content, .common-content, .feature-split, .hk-header'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.closest('.amenities-grid') ||
            entry.target.closest('.security-grid') ||
            entry.target.closest('.hk-items') ||
            entry.target.closest('.support-cards'))
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 120
          : 0
        );
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== AVIR-STYLE HERO: 3D Perspective Shrink on Scroll =====
  const heroBgImg = document.getElementById('hero-bg-img');
  const heroSection = document.querySelector('.hero-section');
  const heroBg = document.querySelector('.hero-bg');
  const heroText = document.querySelector('.hero-text-overlay');
  const scrollIndicator = document.getElementById('scroll-indicator');

  if (heroBgImg && heroSection && heroBg) {
    let heroMouseX = 0;
    let heroMouseY = 0;
    let heroCurrentX = 0;
    let heroCurrentY = 0;

    // Scroll: shrink + round + 3D perspective tilt
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroH = heroSection.offsetHeight;
      if (scrolled <= heroH + 200) {
        const pct = Math.max(0, Math.min(1, scrolled / heroH));

        // Saturation increase
        heroBgImg.style.filter = `saturate(${0.7 + pct * 0.4}) brightness(${1 - pct * 0.15})`;

        // Avir signature: shrink + round corners + perspective tilt
        const scale = Math.max(0.72, 1 - (pct * 0.28));
        const rounded = Math.min(48, pct * 65);
        const rotateX = pct * 3; // subtle 3D tilt forward on scroll
        const yMove = pct * (heroH * 0.25);

        heroBg.style.transform = `perspective(1500px) translateY(${yMove}px) scale(${scale}) rotateX(${rotateX}deg)`;
        heroBg.style.borderRadius = `${rounded}px`;
        heroBg.style.transformOrigin = 'center top';
        heroBg.style.boxShadow = `0 ${30 * pct}px ${80 * pct}px rgba(42,33,24,${0.3 * pct})`;

        // Fade text up with 3D
        if (heroText) {
          const textOpacity = 1 - (pct * 2);
          heroText.style.opacity = Math.max(0, textOpacity);
          heroText.style.transform = `translate3d(0, ${pct * -180}px, ${pct * 100}px)`;
        }

        // Hide scroll indicator
        if (scrollIndicator) {
          scrollIndicator.style.opacity = Math.max(0, 1 - pct * 5);
        }
      }
    }, { passive: true });

    // Mouse move: 3D depth parallax on hero image
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      heroMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      heroMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroMouseX = 0;
      heroMouseY = 0;
    });

    // Smooth animation loop for hero
    function animateHero() {
      heroCurrentX += (heroMouseX - heroCurrentX) * 0.04;
      heroCurrentY += (heroMouseY - heroCurrentY) * 0.04;

      const moveX = heroCurrentX * 25;
      const moveY = heroCurrentY * 18;
      const rotateY = heroCurrentX * 2;
      const rotateX = heroCurrentY * -1.5;

      heroBgImg.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      requestAnimationFrame(animateHero);
    }
    animateHero();
  }

  // ===== Active nav link detection =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== Amenity Card: 3D mouse spotlight =====
  const amenityCards = document.querySelectorAll('.amenity-card');
  amenityCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const rotateX = ((y - 50) / 50) * -4;
      const rotateY = ((x - 50) / 50) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--bg-darker) 0%, var(--bg-dark) 40%, var(--bg) 100%)`;
      card.style.boxShadow = `0 20px 40px rgba(42,33,24,0.12), 0 8px 16px rgba(42,33,24,0.08)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.background = '';
      card.style.boxShadow = '';
    });
  });

  // ===== Custom Cursor & Magnetic Elements =====
  if (window.matchMedia("(pointer: fine)").matches) {
    const dot = document.createElement('div');
    dot.classList.add('custom-cursor-dot');
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.classList.add('custom-cursor-ring');
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover effects on interactables
    const interactables = document.querySelectorAll('a, button, .sidebar-item, .amenity-card, .property-card, input, select, textarea');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    // Magnetic effect
    const magnetics = document.querySelectorAll('.nav-link, .hero-cta, .nav-cta');
    magnetics.forEach(el => {
      el.classList.add('magnetic');
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = `translate(0px, 0px)`;
      });
    });
  }

  // ===== DEEP 3D TILT on Images (Avir-style cinematic) =====
  const tiltWrappers = document.querySelectorAll('.dining-image-wrap, .common-image-wrap, .service-img, .about-mission-img');

  tiltWrappers.forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;

    // Create a shine/light overlay for 3D effect
    const shine = document.createElement('div');
    shine.style.cssText = `
      position: absolute; inset: 0; z-index: 2;
      pointer-events: none;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(0,0,0,0) 100%);
      transition: opacity 0.4s ease;
      opacity: 0;
    `;
    wrap.style.position = 'relative';
    wrap.appendChild(shine);

    let currentTiltX = 0;
    let currentTiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let isHovering = false;

    wrap.addEventListener('mousemove', (e) => {
      isHovering = true;
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const pctX = (x - centerX) / centerX;
      const pctY = (y - centerY) / centerY;

      targetTiltX = pctY * -18; // Max 18 deg
      targetTiltY = pctX * 18;

      // Move the shine/light based on mouse
      shine.style.background = `radial-gradient(circle at ${(pctX + 1) * 50}% ${(pctY + 1) * 50}%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.15) 100%)`;
      shine.style.opacity = '1';
    });

    wrap.addEventListener('mouseleave', () => {
      isHovering = false;
      targetTiltX = 0;
      targetTiltY = 0;
      shine.style.opacity = '0';
    });

    const animateTilt = () => {
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      if (isHovering || Math.abs(currentTiltX) > 0.01 || Math.abs(currentTiltY) > 0.01) {
        const scale = isHovering ? 1.06 : 1;
        const translateZ = isHovering ? 30 : 0;
        img.style.transform = `perspective(1000px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) scale(${scale}) translateZ(${translateZ}px)`;
        img.style.transition = 'none';
      }

      requestAnimationFrame(animateTilt);
    };

    animateTilt();
  });

  // ===== Parallax depth on sections while scrolling =====
  const parallaxSections = document.querySelectorAll('.dining-section, .housekeeping-section');
  window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.top < windowH && rect.bottom > 0) {
        const pct = (windowH - rect.top) / (windowH + rect.height);
        const label = section.querySelector('.section-label');
        if (label) {
          label.style.transform = `translateY(${(pct - 0.5) * -20}px)`;
        }
      }
    });
  }, { passive: true });

  // ===== HK (How it works) items — 3D entrance on scroll =====
  const hkItems = document.querySelectorAll('.hk-item');
  const hkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(entry.target.parentElement.children).indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 150}ms`;
        entry.target.classList.add('hk-visible');
        hkObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  hkItems.forEach(item => {
    item.classList.add('hk-animated');
    hkObserver.observe(item);
  });

  // ===== Stats counter animation =====
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('stat-visible');
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statObserver.observe(el));

});
