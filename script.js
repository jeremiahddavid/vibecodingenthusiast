// ===================================
// Vibe Coding Enthusiast - Main JS
// Modern Interactive Website
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initServiceFilters();
    initFormHandling();
    initAnimations();
    initCounterAnimations();
    initFAQAccordion();
});

// ===================================
// Mobile Menu
// ===================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');

    if (!menuBtn || !navLinks) return;

    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <nav class="mobile-nav">
            ${navLinks.innerHTML}
            <a href="#order" class="btn btn-primary">Start Your Project</a>
        </nav>
    `;
    document.body.appendChild(mobileMenu);

    // Add mobile menu styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 10, 20, 0.98);
            backdrop-filter: blur(20px);
            z-index: 99;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            overflow-y: auto;
        }
        .mobile-menu.active {
            opacity: 1;
            visibility: visible;
        }
        .mobile-nav {
            display: flex;
            flex-direction: column;
            padding: 32px 24px;
            gap: 8px;
        }
        .mobile-nav a {
            display: block;
            padding: 16px;
            font-size: 1.125rem;
            color: var(--text-secondary);
            border-radius: var(--radius-md);
            transition: all 0.2s ease;
            text-decoration: none;
        }
        .mobile-nav a:hover {
            background: var(--bg-card);
            color: var(--text-primary);
        }
        .mobile-nav .btn {
            margin-top: 16px;
            text-align: center;
        }
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
            transform: translateX(-10px);
        }
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Toggle menu
    menuBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on click outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Header Scroll Effect
// ===================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                // Add scrolled class for background
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===================================
// Service Category Filters
// ===================================
function initServiceFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (!filterBtns.length || !serviceCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            // Filter cards with animation
            serviceCards.forEach((card, index) => {
                const cardCategory = card.dataset.category;

                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===================================
// Form Handling
// ===================================
function initFormHandling() {
    const form = document.getElementById('project-form');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        // Validate all fields
        if (!validateForm(form)) {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        submitBtn.innerHTML = `
            <span class="loading-spinner"></span>
            Sending...
        `;
        submitBtn.disabled = true;

        // Add spinner styles if not present
        if (!document.getElementById('spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    display: inline-block;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            showNotification('success', 'Project request submitted! We\'ll get back to you within 24 hours.');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Log data (for development)
            console.log('Form submitted:', data);
        }, 1500);

        // For actual implementation:
        // fetch('/api/submit', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => { ... })
        // .catch(error => { ... });
    });
}

function validateForm(form) {
    const required = form.querySelectorAll('[required]');
    let isValid = true;

    required.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    removeError(field);
    let isValid = true;

    if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, 'This field is required');
        isValid = false;
    } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showError(field, 'Please enter a valid email address');
        isValid = false;
    } else if (field.name === 'phone' && field.value && !isValidPhone(field.value)) {
        showError(field, 'Please enter a valid phone number');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{7,20}$/.test(phone);
}

function showError(field, message) {
    field.classList.add('error');

    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 6px;
        display: block;
        animation: fadeInUp 0.2s ease;
    `;

    const parent = field.closest('.form-group') || field.parentNode;
    parent.appendChild(errorEl);
}

function removeError(field) {
    field.classList.remove('error');
    const parent = field.closest('.form-group') || field.parentNode;
    const errorEl = parent.querySelector('.error-message');
    if (errorEl) errorEl.remove();
}

function showNotification(type, message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '&#10003;' : '&#10007;'}</span>
        <p>${message}</p>
        <button class="notification-close" aria-label="Close">&times;</button>
    `;

    // Add notification styles if not present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 24px;
                max-width: 400px;
                padding: 16px 20px;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1000;
                animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            }
            .notification-success {
                border-color: var(--accent-green);
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent);
            }
            .notification-success .notification-icon {
                color: var(--accent-green);
            }
            .notification-error {
                border-color: #ef4444;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent);
            }
            .notification-error .notification-icon {
                color: #ef4444;
            }
            .notification-icon {
                font-size: 1.5rem;
                font-weight: bold;
            }
            .notification p {
                flex: 1;
                margin: 0;
                font-size: 0.95rem;
                color: var(--text-primary);
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                transition: color 0.2s ease;
            }
            .notification-close:hover {
                color: var(--text-primary);
            }
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            @media (max-width: 480px) {
                .notification {
                    left: 16px;
                    right: 16px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => notification.remove(), 300);
}

// ===================================
// Scroll Animations
// ===================================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation styles
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                            transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            .stagger-1 { transition-delay: 0.1s; }
            .stagger-2 { transition-delay: 0.2s; }
            .stagger-3 { transition-delay: 0.3s; }
            .stagger-4 { transition-delay: 0.4s; }
            .stagger-5 { transition-delay: 0.5s; }
            .stagger-6 { transition-delay: 0.6s; }
        `;
        document.head.appendChild(style);
    }

    // Add class to animatable elements
    const animatableSelectors = [
        '.service-card',
        '.step',
        '.pricing-card',
        '.portfolio-item',
        '.case-study-card',
        '.testimonial-card',
        '.faq-item',
        '.industry-card',
        '.package-card',
        '.tech-category',
        '.section-header'
    ];

    animatableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            // Add stagger classes for grouped elements
            const staggerIndex = (index % 6) + 1;
            el.classList.add(`stagger-${staggerIndex}`);
            observer.observe(el);
        });
    });
}

// ===================================
// Counter Animations
// ===================================
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current + (element.dataset.suffix || '');

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    }

    requestAnimationFrame(updateCounter);
}

// ===================================
// FAQ Accordion
// ===================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        // Set initial state
        answer.style.maxHeight = item.classList.contains('active') ? answer.scrollHeight + 'px' : '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            answer.style.maxHeight = isActive ? '0' : answer.scrollHeight + 'px';
        });
    });
}

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Typing animation (optional enhancement)
function typeWriter(element, text, speed = 50, callback) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }

    type();
}

// Parallax effect for hero (optional enhancement)
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }, 16));
}

// Copy to clipboard utility
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('success', 'Copied to clipboard!');
        });
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('success', 'Copied to clipboard!');
    }
}
