document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form
  const form = document.getElementById('contactForm');
  const status = document.getElementById('status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };

      if (!data.name || !data.email || !data.message) {
        status.textContent = 'Please fill out all fields.';
        return;
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Request failed');
        status.textContent = body.message || 'Message sent!';
        form.reset();
      } catch (err) {
        console.error(err);
        status.textContent = 'Failed to send message. Try again later.';
      }
    });
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      newsletterStatus.textContent = '';
      const data = {
        name: 'Newsletter Subscriber',
        email: newsletterForm.email.value.trim(),
        message: 'Subscribe to newsletter',
      };

      if (!data.email) {
        newsletterStatus.textContent = 'Please enter your email.';
        return;
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Request failed');
        newsletterStatus.textContent = body.message || 'Subscribed!';
        newsletterForm.reset();
      } catch (err) {
        console.error(err);
        newsletterStatus.textContent = 'Failed to subscribe. Try again later.';
      }
    });
  }










  // Slideshow functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if (slides.length > 0) {
    showSlide(currentSlide); // Initialize first slide

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
  }

  // About slideshow functionality
  let currentAboutSlide = 0;
  const aboutSlides = document.querySelectorAll('.about-slide');

  function showAboutSlide(index) {
    aboutSlides.forEach(slide => slide.classList.remove('active'));
    aboutSlides[index].classList.add('active');
  }

  function nextAboutSlide() {
    currentAboutSlide = (currentAboutSlide + 1) % aboutSlides.length;
    showAboutSlide(currentAboutSlide);
  }

  if (aboutSlides.length > 0) {
    showAboutSlide(currentAboutSlide); // Initialize first slide

    // Auto-slide every 5 seconds
    setInterval(nextAboutSlide, 5000);
  }

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links.mobile');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Login modal functionality
  const loginBtn = document.getElementById('loginBtn');
  const loginBtnMobile = document.getElementById('loginBtnMobile');
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const closeButtons = document.querySelectorAll('.close');

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'block';
    });
  }

  if (loginBtnMobile) {
    loginBtnMobile.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'block';
    });
  }

  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'none';
      registerModal.style.display = 'block';
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.style.display = 'none';
      loginModal.style.display = 'block';
    });
  }

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loginModal.style.display = 'none';
      registerModal.style.display = 'none';
    });
  });

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
      registerModal.style.display = 'none';
    }
  });

  // Login form submission
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginStatus.textContent = 'Login functionality not implemented yet.';
    });
  }

  // Register form submission
  const registerForm = document.getElementById('registerForm');
  const registerStatus = document.getElementById('registerStatus');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      registerStatus.textContent = 'Registration functionality not implemented yet.';
    });
  }

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });



});
