// ===== PG360 Main Script =====

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

  // ===== Reveal on scroll =====
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
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
          : 0
        );
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Hero parallax on scroll + mouse move =====
  const heroBgImg = document.getElementById('hero-bg-img');
  const heroSection = document.querySelector('.hero-section');
  const heroBg = document.querySelector('.hero-bg');
  const heroText = document.querySelector('.hero-text-overlay');

  if (heroBgImg && heroSection && heroBg) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Scroll parallax & Avir-style scale down
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroH = heroSection.offsetHeight;
      if (scrolled <= heroH + 100) {
        const pct = Math.max(0, scrolled / heroH);
        
        // Image saturation
        heroBgImg.style.filter = `saturate(${0.7 + pct * 0.3})`;
        
        // Avir Webflow effect: shrink background, round corners, parallax down
        const scale = Math.max(0.75, 1 - (pct * 0.25));
        const rounded = Math.min(60, pct * 80);
        const yMove = pct * (heroH * 0.3); // Parallax the bg container down
        
        heroBg.style.transform = `translateY(${yMove}px) scale(${scale})`;
        heroBg.style.borderRadius = `${rounded}px`;
        heroBg.style.transformOrigin = 'center top';
        
        // Fade and move text up
        if (heroText) {
          const textOpacity = 1 - (pct * 1.5);
          heroText.style.opacity = Math.max(0, textOpacity);
          heroText.style.transform = `translateY(${pct * -150}px)`;
        }
      }
    }, { passive: true });

    // Mouse move parallax
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    // Smooth animation loop
    function animateHero() {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      const moveX = currentX * 20; // max 20px shift
      const moveY = currentY * 15; // max 15px shift

      // Base zoom for the image inside the container
      heroBgImg.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
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

  // ===== Smooth cursor-following highlight on amenity cards =====
  const amenityCards = document.querySelectorAll('.amenity-card');
  amenityCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--bg-darker) 0%, var(--bg-dark) 60%, var(--bg) 100%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
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
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
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

  // ===== 3D Tilt View Effect on Images =====
  const tiltWrappers = document.querySelectorAll('.dining-image-wrap, .common-image-wrap, .service-img, .about-mission-img');
  
  tiltWrappers.forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;

    // Smooth physics variables
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
      
      // Calculate target tilt angles
      targetTiltX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
      targetTiltY = ((x - centerX) / centerX) * 12;
    });
    
    wrap.addEventListener('mouseleave', () => {
      isHovering = false;
      targetTiltX = 0;
      targetTiltY = 0;
    });

    const animateTilt = () => {
      // Lerp for buttery smoothness
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;
      
      if (isHovering || Math.abs(currentTiltX) > 0.01 || Math.abs(currentTiltY) > 0.01) {
        const scale = isHovering ? 1.05 : 1;
        img.style.transform = `perspective(1200px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) scale(${scale})`;
      }
      
      requestAnimationFrame(animateTilt);
    };
    
    animateTilt();
  });

});
