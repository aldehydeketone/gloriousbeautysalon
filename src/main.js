import './style.css'


// Theme Management

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}



// Cursor Glow Movement
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateCursor = () => {
    // Smooth delay effect
    const easing = 0.15;
    cursorX += (mouseX - cursorX) * easing;
    cursorY += (mouseY - cursorY) * easing;

    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  };
  animateCursor();
}

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');

mobileBtn.addEventListener('click', () => {
  nav.classList.toggle('active');

  // Animate hamburger to X
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

// Close menu when clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    const spans = mobileBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

// Header Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in-up');
fadeElements.forEach(el => observer.observe(el));

// Service Pricing Toggle
const toggleButtons = document.querySelectorAll('.toggle-pricing');
toggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    list.classList.toggle('hidden');
    btn.textContent = list.classList.contains('hidden') ? 'View Pricing' : 'Hide Pricing';
  });
});

// Reviews Carousel
const reviewsWrapper = document.querySelector('.reviews-wrapper');
const slides = document.querySelectorAll('.review-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }

  // Move wrapper
  reviewsWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update active class for scaling effect
  slides.forEach((slide, i) => {
    if (i === currentSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startSlideTimer() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideTimer() {
  clearInterval(slideInterval);
}

if (prevBtn && nextBtn && reviewsWrapper) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopSlideTimer();
    startSlideTimer();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopSlideTimer();
    startSlideTimer();
  });

  // Pause on hover
  const reviewsContainer = document.querySelector('.reviews-container');
  reviewsContainer.addEventListener('mouseenter', stopSlideTimer);
  reviewsContainer.addEventListener('mouseleave', startSlideTimer);

  // Initial start
  startSlideTimer();
}

// Accordion Functionality (Pricing Page)
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(acc => {
  acc.addEventListener('click', () => {
    const item = acc.parentElement;
    item.classList.toggle('active');

    // Optional: Close others
    /*
    accordions.forEach(otherAcc => {
        if (otherAcc !== acc) {
            otherAcc.parentElement.classList.remove('active');
        }
    });
    */
  });
});


// Booking Form Submission
// Booking Form Submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const service = document.getElementById('booking-service').value;
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;

    // Validation
    if (!date || !time || !service || !name || !phone) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // specific formatting requested
    const rawMessage = `Hi, I would like to book an appointment at Glorious Beauty Salon.

Date: ${date}
Time: ${time}
Service: ${service}
Name: ${name}
Phone: ${phone}`;

    const encodedMessage = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=919167022992&text=${encodedMessage}&type=phone_number&app_absent=0`;

    // Redirect
    window.open(whatsappUrl, '_blank');

    // Optional: Reset form after a short delay so user sees what they submitted if they come back
    setTimeout(() => {
      bookingForm.reset();
    }, 1000);
  });
}
