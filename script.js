// ================================================
// NOTHING.TECH INSPIRED PORTFOLIO INTERACTIONS
// ================================================

// Custom Cursor
const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(updateCursor);
}
updateCursor();

// Cursor hover effects
const body = document.body;
const hoverElements = document.querySelectorAll(
'body'
);
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// Smooth Navigation
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active nav
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-content').forEach(section => {
    observer.observe(section);
});

// Project Card Interactions
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Blog Card Interactions
const blogCards = document.querySelectorAll('.blog-card');
blogCards.forEach(card => {
    card.addEventListener('click', () => {
        // Simulate blog post opening
        alert('Blog post would open here');
    });
});

// Contact Form
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.textContent = 'SENT ✓';
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }, 1500);
});

// Click to Copy Functionality
const contactItems = document.querySelectorAll('.contact-item[data-copy]');
contactItems.forEach(item => {
    item.addEventListener('click', () => {
        const text = item.getAttribute('data-copy');
        
        navigator.clipboard.writeText(text).then(() => {
            const label = item.querySelector('.contact-label');
            const originalText = label.textContent;
            
            label.textContent = 'COPIED!';
            item.style.transform = 'translateY(-4px)';
            
            setTimeout(() => {
                label.textContent = originalText;
                item.style.transform = 'translateY(0)';
            }, 1000);
        });
    });
});

// Glitch Effect on Hover
const glitchElement = document.querySelector('.glitch');
let glitchTimeout;

glitchElement.addEventListener('mouseenter', () => {
    glitchElement.style.animation = 'none';
    clearTimeout(glitchTimeout);
    
    glitchTimeout = setTimeout(() => {
        glitchElement.style.animation = '';
    }, 100);
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroTitle = document.querySelector('.home-title');
    
    if (heroTitle) {
        heroTitle.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
});

// Active Navigation on Scroll
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Performance Optimization
let ticking = false;

function updateOnScroll() {
    // Batch scroll-based updates here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Initialize Animations
document.addEventListener('DOMContentLoaded', () => {
    // Stagger animation for project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Initialize other animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ==============================================
// CONFIDENTIAL MODAL FUNCTIONALITY
// ==============================================

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get modal element
    const modal = document.getElementById('confidentialModal');
    // Get close button
    const closeButton = document.querySelector('.close-button');

    // Function to open modal
    function openModal() {
        modal.style.display = 'block';
    }

    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Close modal on clicking close button
    closeButton.addEventListener('click', closeModal);

    // Close modal on clicking outside modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal on pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Add event listeners to the two specific project cards
    const projectCards = document.querySelectorAll('.project-card');
    const conceptAttentionCard = projectCards[0]; // First card
    const vehicleEntryCard = projectCards[3]; // Fourth card

    // Add click event listeners
    conceptAttentionCard.addEventListener('click', function(e) {
        // Prevent default link behavior
        e.preventDefault();
        openModal();
    });

    vehicleEntryCard.addEventListener('click', function(e) {
        // Prevent default link behavior  
        e.preventDefault();
        openModal();
    });

    // Prevent the project links from working on these specific cards
    const conceptAttentionLinks = conceptAttentionCard.querySelectorAll('.project-link');
    const vehicleEntryLinks = vehicleEntryCard.querySelectorAll('.project-link');

    conceptAttentionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    vehicleEntryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });
});


