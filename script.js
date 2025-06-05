// Advanced Portfolio JavaScript
class PortfolioExperience {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoading();
        this.setupCursor();
        this.setupScrollAnimations();
        this.setupFormAnimations();
        this.setupStatsCounter();
        this.setupParallax();
        this.setupNavigation();
    }

    // Loading Screen Animation
    setupLoading() {
        window.addEventListener('load', () => {
            const loadingScreen = document.querySelector('.loading-screen');
            const loadingProgress = document.querySelector('.loading-progress');
            
            // Animate loading bar
            loadingProgress.style.width = '100%';
            
            setTimeout(() => {
                loadingScreen.style.transform = 'translateY(-100%)';
                document.body.style.overflow = 'visible';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }, 2500);
        });
    }

    // Custom Cursor
    setupCursor() {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
        });

        // Smooth follower animation
        const animateFollower = () => {
            const distX = mouseX - followerX;
            const distY = mouseY - followerY;
            
            followerX += distX * 0.1;
            followerY += distY * 0.1;
            
            cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .project-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(1.5)';
                cursorFollower.style.transform += ' scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
            });
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Stagger animation for child elements
                    const children = entry.target.querySelectorAll('.skill-category, .stat');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll('.about-content, .skill-category, .stat');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.8s ease';
            observer.observe(el);
        });
    }

    // Project Animations
    setupProjectAnimations() {
        const projects = document.querySelectorAll('.project-item');
        
        projects.forEach((project, index) => {
            // Set initial state
            project.style.opacity = '0';
            project.style.transform = 'translateY(100px)';
            
            // Intersection observer for reveal
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 300);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(project);

            // Parallax effect on scroll
            window.addEventListener('scroll', () => {
                const rect = project.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.1;
                
                if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                    const visual = project.querySelector('.project-visual');
                    visual.style.transform = `translateY(${rate}px)`;
                }
            });

            // Color change effect
            const bgColor = project.getAttribute('data-bg');
            project.addEventListener('mouseenter', () => {
                document.body.style.setProperty('--accent-hover', bgColor);
                project.style.setProperty('--hover-color', bgColor);
            });
        });
    }

    // Form Animations
    setupFormAnimations() {
        const form = document.querySelector('.form');
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            const formGroup = input.parentElement;
            const formBar = formGroup.querySelector('.form-bar');
            
            input.addEventListener('focus', () => {
                formBar.style.width = '100%';
                formGroup.style.transform = 'translateY(-5px)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    formBar.style.width = '0%';
                    formGroup.style.transform = 'translateY(0)';
                }
            });
            
            input.addEventListener('input', () => {
                if (input.value) {
                    formBar.style.width = '100%';
                }
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            
            // Animate button
            submitBtn.style.transform = 'scale(0.98)';
            btnText.textContent = 'Sending...';
            btnIcon.style.transform = 'rotate(360deg)';
            
            // Simulate submission
            setTimeout(() => {
                btnText.textContent = 'Message Sent!';
                btnIcon.textContent = '✓';
                btnIcon.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    btnIcon.textContent = '→';
                    btnIcon.style.transform = 'scale(1)';
                    submitBtn.style.transform = 'scale(1)';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }

    // Stats Counter Animation
    setupStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        let animated = false;
        
        const animateStats = () => {
            if (animated) return;
            animated = true;
            
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    stat.textContent = Math.floor(current);
                    
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    }
                }, 50);
            });
        };
        
        // Trigger when stats section is visible
        const statsSection = document.querySelector('.profile-stats');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStats();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(statsSection);
        }
    }

    // Parallax Effects
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const heroSphere = document.querySelector('.hero-sphere');
            if (heroSphere) {
                heroSphere.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.1}deg)`;
            }
            
            // Floating elements parallax
            const floatingElements = document.querySelectorAll('.float-item');
            floatingElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                element.style.transform += ` translateY(${scrolled * speed}px)`;
            });
            
            // Particles parallax
            const particles = document.querySelectorAll('.hero-particles, .contact-particles');
            particles.forEach(particle => {
                particle.style.transform = `translateY(${scrolled * 0.2}px)`;
            });
        });
    }

    // Navigation
    setupNavigation() {
        const nav = document.querySelector('.nav');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Smooth scroll for nav links
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
                }
            });
        });
        
        // Nav background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.1)';
                nav.style.backdropFilter = 'blur(20px)';
            }
        });
        
        // Active section highlighting
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => observer.observe(section));
    }
}

// Text Animation Effects
class TextAnimations {
    static typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        type();
    }
        




}

// Enhanced Page Transitions
class PageTransitions {
    static fadeInUp(elements, delay = 0) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay + (index * 200));
        });
    }
    
    static slideInFromSide(elements, direction = 'left') {
        const translateValue = direction === 'left' ? '-100px' : '100px';
        
        elements.forEach((element, index) => {
            element.style.transform = `translateX(${translateValue})`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
            }, index * 150);
        });
    }
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trails = [];
        this.maxTrails = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrail(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    addTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(trail);
        this.trails.push({
            element: trail,
            life: 1
        });
        
        if (this.trails.length > this.maxTrails) {
            const oldTrail = this.trails.shift();
            oldTrail.element.remove();
        }
    }
    
    animate() {
        this.trails.forEach((trail, index) => {
            trail.life -= 0.05;
            trail.element.style.opacity = trail.life;
            trail.element.style.transform = `scale(${trail.life})`;
            
            if (trail.life <= 0) {
                trail.element.remove();
                this.trails.splice(index, 1);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioExperience();
    new MouseTrail();
        
});

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // All scroll-related animations
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Dark mode toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Initialize theme based on system preference
if (prefersDark.matches) {
  setTheme('dark');
}

darkModeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});


