(() => {
  const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setReducedMotionClass = (matches) => {
    document.documentElement.classList.toggle('reduced-motion', matches);
  };

  setReducedMotionClass(prefersReducedMotionQuery.matches);
  if (typeof prefersReducedMotionQuery.addEventListener === 'function') {
    prefersReducedMotionQuery.addEventListener('change', (event) => setReducedMotionClass(event.matches));
  }

  // Prevent overscroll behavior (simplified version)
  const preventOverscroll = () => {
    // Only prevent overscroll on mobile devices
    if ('ontouchstart' in window) {
      let startY = 0;

      const handleTouchStart = (e) => {
        startY = e.touches[0].pageY;
      };

      const handleTouchMove = (e) => {
        const currentY = e.touches[0].pageY;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const maxScroll = scrollHeight - clientHeight;

        // Only prevent at boundaries
        if (scrollTop <= 0 && currentY > startY) {
          e.preventDefault();
        }
        if (scrollTop >= maxScroll && currentY < startY) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
  };

  // Initialize overscroll prevention
  preventOverscroll();

  // Header hide/show on scroll
  const setupHeaderScroll = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
      
      // Hide header when scrolling down, show when scrolling up
      if (scrollY > 100) { // Only hide after scrolling 100px
        if (scrollDirection === 'down') {
          header.classList.add('hidden');
          header.classList.remove('shadow-enhance');
        } else {
          header.classList.remove('hidden');
          header.classList.add('shadow-enhance');
        }
      } else {
        // Always show header at top of page
        header.classList.remove('hidden');
        header.classList.remove('shadow-enhance');
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  };

  setupHeaderScroll();

  const closeMobileMenu = (btn, menu) => {
    menu.classList.add('hidden');
    menu.style.maxHeight = '0px';
    btn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  document.querySelectorAll('[data-nav-toggle]').forEach((toggleBtn) => {
    const menuId = toggleBtn.getAttribute('data-nav-toggle');
    const menu = document.getElementById(menuId);
    if (!menu) return;

    toggleBtn.setAttribute('aria-controls', menuId);
    toggleBtn.setAttribute('aria-expanded', 'false');

    if (!menu.hasAttribute('data-mobile-menu')) {
      menu.setAttribute('data-mobile-menu', 'true');
    }

    toggleBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      const isOpen = !menu.classList.contains('hidden');
      toggleBtn.setAttribute('aria-expanded', isOpen.toString());
      document.body.classList.toggle('menu-open', isOpen);
      menu.style.maxHeight = isOpen ? `${menu.scrollHeight}px` : '0px';
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu(toggleBtn, menu);
        link.blur();
      });
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
        closeMobileMenu(toggleBtn, menu);
      }
    });
  });

  const setActiveNavLink = () => {
    const currentPage = document.body.getAttribute('data-page');
    if (!currentPage) return;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.classList.toggle('nav-link--active', link.dataset.nav === currentPage);
    });
  };

  setActiveNavLink();

  // Remove scroll progress functionality to prevent conflicts
  // const scrollProgress = document.getElementById('scrollProgress');
  // const header = document.querySelector('.site-header');
  // if (scrollProgress) {
  //   const updateScrollUI = () => {
  //     const scrollTop = window.scrollY;
  //     const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  //     const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  //     scrollProgress.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  //     header?.classList.toggle('shadow-enhance', scrollTop > 10);
  //   };
  //   updateScrollUI();
  //   window.addEventListener('scroll', updateScrollUI, { passive: true });
  //   window.addEventListener('resize', updateScrollUI);
  // }

  const floatingCta = document.querySelector('.floating-whatsapp');
  const footer = document.querySelector('footer');
  if (floatingCta && footer && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          floatingCta.classList.toggle('is-raised', entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
  }

  const heroCandidates = Array.from(document.querySelectorAll('[data-section="hero"], #hero'));
  const heroImages = new Set(
    heroCandidates.flatMap((el) => Array.from(el.querySelectorAll('img')))
  );

  document.querySelectorAll('img').forEach((img) => {
    if (!heroImages.has(img) && !img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
})();
