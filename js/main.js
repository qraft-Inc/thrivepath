// ThrivePath Main JavaScript

// DOM Elements
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navbar = document.querySelector('.navbar');
const forms = document.querySelectorAll('form');
const testimonialContainer = document.querySelector('.testimonial-carousel');

// Mobile Navigation Toggle (sidebar + backdrop)
if (mobileNavToggle) {
    // helper to close nav and cleanup
    function closeNav() {
        document.body.classList.remove('mobile-nav-active');
        document.body.style.overflow = '';
        if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'false');
        const bd = document.querySelector('.nav-backdrop');
        if (bd) bd.remove();
    }

    // create backdrop and append to body
    function ensureBackdrop() {
        if (!document.querySelector('.nav-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'nav-backdrop';
            backdrop.addEventListener('click', closeNav);
            document.body.appendChild(backdrop);
        }
    }

    mobileNavToggle.setAttribute('aria-expanded', 'false');

    mobileNavToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !document.body.classList.contains('mobile-nav-active');
        if (willOpen) {
            document.body.classList.add('mobile-nav-active');
            ensureBackdrop();
            document.body.style.overflow = 'hidden';
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        } else {
            closeNav();
        }
    });

    // Close menu when clicking a link inside nav
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            // let normal navigation occur, but close the sidebar first
            closeNav();
        });
    });

    // Also handle escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) {
            closeNav();
        }
    });
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else if (input.type === 'email' && input.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid email address');
            }
        }
    });
    
    return isValid;
}

function showError(input, message) {
    const errorDiv = input.nextElementSibling?.classList.contains('error-message') 
        ? input.nextElementSibling 
        : document.createElement('div');
    
    if (!input.nextElementSibling?.classList.contains('error-message')) {
        errorDiv.className = 'error-message';
        input.parentNode.insertBefore(errorDiv, input.nextElementSibling);
    }
    
    errorDiv.textContent = message;
    input.classList.add('error');
}

// Form Submission Handling
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(form)) {
            // Here you would normally send the form data to a server
            alert('Form submitted successfully!');
            form.reset();
        }
    });
});

// Testimonial Carousel
class TestimonialCarousel {
    constructor(container) {
        this.container = container;
        this.slides = container?.querySelectorAll('.testimonial-slide');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        
        if (this.slides?.length) {
            this.init();
        }
    }
    
    init() {
        this.createNavigation();
        this.showSlide(0);
        this.startAutoplay();
    }
    
    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'testimonial-nav';
        
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&larr;';
        prevButton.addEventListener('click', () => this.prevSlide());
        
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&rarr;';
        nextButton.addEventListener('click', () => this.nextSlide());
        
        nav.appendChild(prevButton);
        nav.appendChild(nextButton);
        this.container.appendChild(nav);
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.style.display = 'none');
        this.slides[index].style.display = 'block';
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
        
        this.container.addEventListener('mouseenter', () => {
            clearInterval(this.autoplayInterval);
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
    }
}

// Initialize testimonial carousel if it exists
if (testimonialContainer) {
    new TestimonialCarousel(testimonialContainer);
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});