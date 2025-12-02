// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link or outside
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}));

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background on scroll with throttling
let ticking = false;

function updateHeader() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// Intersection Observer for animations with reduced motion support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!prefersReducedMotion) {
                entry.target.classList.add('visible');
            } else {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
            }
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.timeline-item, .internship-card, .project-card, .certificate-card');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Skill bars animation
const skillsSection = document.querySelector('.skills');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkillBars();
            skillsAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 200);
    });
}

// Active navigation link highlighting with throttling
let navTicking = false;

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    navTicking = false;
}

window.addEventListener('scroll', () => {
    if (!navTicking) {
        requestAnimationFrame(updateActiveNav);
        navTicking = true;
    }
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showNotification('Please fill in all fields.', 'error');
        }
    });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #4CAF50;' : 'background: #f44336;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Parallax effect for hero section (disabled on mobile for performance)
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when page loads (only if not reduced motion)
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !prefersReducedMotion) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Handle orientation change with improved mobile support
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Fix viewport height issues on mobile
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Recalculate scroll position
        window.scrollTo(0, window.scrollY);
        
        // Trigger resize event for other components
        window.dispatchEvent(new Event('resize'));
    }, 150);
});

// Set initial viewport height
const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVH();
window.addEventListener('resize', setVH);

// Handle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize
        if (window.innerWidth > 767 && hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// Add hover effects to cards (only on non-touch devices)
if (!('ontouchstart' in window)) {
    document.querySelectorAll('.internship-card, .project-card, .certificate-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!prefersReducedMotion) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add CSS for active nav link and reduced motion support
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #1e3c72 !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .fade-in {
            opacity: 1 !important;
            transform: none !important;
        }
    }
    
    /* iOS Safari fixes */
    @supports (-webkit-touch-callout: none) {
        .hero {
            min-height: -webkit-fill-available;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Disable animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
}

// Enhanced mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    document.body.classList.add('mobile-device');
    
    // Disable parallax on mobile for better performance
    const heroParallax = document.querySelector('.hero');
    if (heroParallax) {
        heroParallax.style.backgroundAttachment = 'scroll';
    }
}