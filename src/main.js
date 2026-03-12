import './style.css'

// ============================================================
// THEME MANAGEMENT
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}


// ============================================================
// CURSOR GLOW (desktop only)
// ============================================================
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  const animateCursor = () => {
    const easing = 0.15;
    cursorX += (mouseX - cursorX) * easing;
    cursorY += (mouseY - cursorY) * easing;
    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
}


// ============================================================
// MOBILE MENU TOGGLE
// ============================================================
const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileBtn && nav) {
  mobileBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    const spans = mobileBtn.querySelectorAll('span');
    if (nav.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      const spans = mobileBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}


// ============================================================
// HEADER SCROLL EFFECT
// ============================================================
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}


// ============================================================
// SCROLL REVEAL ANIMATION
// ============================================================
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));


// ============================================================
// REVIEWS CAROUSEL
// ============================================================
const reviewsWrapper = document.querySelector('.reviews-wrapper');
const slides = document.querySelectorAll('.review-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  if (reviewsWrapper) reviewsWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
}

function startSlideTimer() { slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000); }
function stopSlideTimer() { clearInterval(slideInterval); }

if (prevBtn && nextBtn && reviewsWrapper) {
  prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); stopSlideTimer(); startSlideTimer(); });
  nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); stopSlideTimer(); startSlideTimer(); });

  const reviewsContainer = document.querySelector('.reviews-container');
  if (reviewsContainer) {
    reviewsContainer.addEventListener('mouseenter', stopSlideTimer);
    reviewsContainer.addEventListener('mouseleave', startSlideTimer);
  }

  // Touch swipe support for reviews
  let touchStartX = 0;
  if (reviewsWrapper) {
    reviewsWrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    reviewsWrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        showSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        stopSlideTimer();
        startSlideTimer();
      }
    }, { passive: true });
  }

  startSlideTimer();
}


// ============================================================
// ACCORDION (Pricing Page)
// ============================================================
document.querySelectorAll('.accordion-header').forEach(acc => {
  acc.addEventListener('click', () => {
    acc.parentElement.classList.toggle('active');
  });
});


// ============================================================
// BOOKING FORM — Date Min Setup (Submissions handled in index.html)
// ============================================================
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');

if (bookingForm) {
  // Set minimum date to today
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
}


// ============================================================
// LAZY LOADING IMAGES
// ============================================================
document.querySelectorAll('img').forEach(img => {
  if (!img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }
});


// ============================================================
// ANALYTICS TRACKING (Click tracking for WhatsApp / Call)
// ============================================================
function trackEvent(category, action, label) {
  // Google Analytics 4 (if gtag is loaded)
  if (typeof gtag !== 'undefined') {
    gtag('event', action, { event_category: category, event_label: label });
  }
}

// Track WhatsApp clicks
document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
  link.addEventListener('click', () => trackEvent('Lead', 'whatsapp_click', link.dataset.source || 'general'));
});

// Track call clicks
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => trackEvent('Lead', 'call_click', 'phone'));
});

// Track booking form submissions
if (bookingForm) {
  bookingForm.addEventListener('submit', () => trackEvent('Lead', 'form_submit', 'booking_form'));
}


// ============================================================
// MOBILE STICKY BAR — highlight active section
// ============================================================
const stickyBar = document.getElementById('mobileStickyBar');
if (stickyBar) {
  // Show/hide sticky bar based on scroll position (hide at very top)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      stickyBar.style.opacity = '1';
      stickyBar.style.transform = 'translateY(0)';
    }
  }, { passive: true });
}


// ============================================================
// SERVICE PRICING TOGGLE (legacy support)
// ============================================================
document.querySelectorAll('.toggle-pricing').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    if (list) {
      list.classList.toggle('hidden');
      btn.textContent = list.classList.contains('hidden') ? 'View Pricing' : 'Hide Pricing';
    }
  });
});
