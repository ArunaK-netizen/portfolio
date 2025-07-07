// GSAP Plugins Registration
gsap.registerPlugin(ScrollTrigger, TextPlugin, MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin, Flip, Observer);

// Global Variables
let isIntroComplete = false;
let currentPage = 'home';
let mm = gsap.matchMedia();
let cursor = {
    core: document.querySelector('.cursor-core'),
    ring: document.querySelector('.cursor-ring'),
    trail: document.querySelector('.cursor-trail'),
    label: document.querySelector('.cursor-label')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    checkFirstVisit();
    initCursor();
    initNavigation();
    initThemeToggle();
    initSplashScreen();
    initResponsiveAnimations();
});

// Check if first visit to show splash
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        isIntroComplete = false;
        localStorage.setItem('hasVisited', 'true');
    } else {
        isIntroComplete = true;
        document.querySelector('.splash-screen').style.display = 'none';
        initMainAnimations();
    }
}

// Advanced Cursor System
function initCursor() {
    if (window.innerWidth <= 768) return;
    
    let mouseX = 0, mouseY = 0;
    let coreX = 0, coreY = 0;
    let ringX = 0, ringY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor following with different speeds
    gsap.ticker.add(() => {
        const coreSpeed = 0.2;
        const ringSpeed = 0.15;
        const trailSpeed = 0.1;
        
        coreX += (mouseX - coreX) * coreSpeed;
        coreY += (mouseY - coreY) * coreSpeed;
        
        ringX += (mouseX - ringX) * ringSpeed;
        ringY += (mouseY - ringY) * ringSpeed;
        
        trailX += (mouseX - trailX) * trailSpeed;
        trailY += (mouseY - trailY) * trailSpeed;
        
        gsap.set(cursor.core, { x: coreX, y: coreY });
        gsap.set(cursor.ring, { x: ringX, y: ringY });
        gsap.set(cursor.trail, { x: trailX, y: trailY });
    });
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .work-item, .experiment-item, .skill-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const label = element.dataset.label || element.getAttribute('aria-label') || 'Click';
            
            gsap.to([cursor.core, cursor.ring], {
                scale: 1.5,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
            
            gsap.to(cursor.label, {
                opacity: 1,
                duration: 0.2
            });
            
            cursor.label.textContent = label;
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to([cursor.core, cursor.ring], {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(cursor.label, {
                opacity: 0,
                duration: 0.2
            });
        });
    });
    
    // Click ripple effect
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10001;
            left: ${e.clientX - 10}px;
            top: ${e.clientY - 10}px;
        `;
        
        document.body.appendChild(ripple);
        
        gsap.fromTo(ripple, 
            { scale: 0, opacity: 1 },
            { 
                scale: 3, 
                opacity: 0, 
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            }
        );
    });
}

// Navigation System with Page Transitions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.dataset.page;
            
            if (targetPage !== currentPage) {
                transitionToPage(targetPage);
            }
        });
    });
    
    function transitionToPage(targetPage) {
        const overlay = document.querySelector('.transition-overlay');
        const text = document.querySelector('.transition-text');
        const currentSection = document.querySelector(`.page-section[id="${currentPage}"]`);
        const targetSection = document.querySelector(`.page-section[id="${targetPage}"]`);
        
        // Update nav active state
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === targetPage);
        });
        
        // Page transition timeline
        const tl = gsap.timeline();
        
        tl.to(overlay, {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.inOut"
        })
        .to(text, {
            opacity: 1,
            duration: 0.2
        }, "-=0.3")
        .call(() => {
            // Switch sections
            currentSection.classList.remove('active');
            targetSection.classList.add('active');
            currentPage = targetPage;
            
            // Initialize page-specific animations
            initPageAnimations(targetPage);
        })
        .to(text, {
            opacity: 0,
            duration: 0.2
        }, "+=0.3")
        .to(overlay, {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.1");
    }
}

// Theme Toggle with Morphing Animation
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const sunRays = document.querySelector('.sun-rays');
    const moonCrescent = document.querySelector('.moon-crescent');
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Animate theme transition
        const tl = gsap.timeline();
        
        tl.to(document.body, {
            scale: 0.9,
            duration: 0.3,
            ease: "power2.out"
        })
        .call(() => {
            document.body.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
        })
        .to(document.body, {
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
        
        // Animate icon transition
        if (newTheme === 'light') {
            gsap.to(moonCrescent, { rotation: 360, scale: 0, duration: 0.4 });
            gsap.to(sunRays, { rotation: 0, scale: 1, duration: 0.4, delay: 0.2 });
        } else {
            gsap.to(sunRays, { rotation: -360, scale: 0, duration: 0.4 });
            gsap.to(moonCrescent, { rotation: 0, scale: 1, duration: 0.4, delay: 0.2 });
        }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.dataset.theme = savedTheme;
}

// Splash Screen Animation Sequence
function initSplashScreen() {
    if (isIntroComplete) return;
    
    const tl = gsap.timeline({
        onComplete: () => {
            gsap.to('.splash-screen', {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.querySelector('.splash-screen').style.display = 'none';
                    initMainAnimations();
                }
            });
        }
    });
    
    // Morphing logo animation
    tl.fromTo('.morph-path', 
        { 
            morphSVG: "M100,100 L100,100 L100,100 L100,100 L100,100 L100,100 L100,100 L100,100 Z",
            rotation: 0,
            scale: 0.5
        },
        { 
            morphSVG: "M100,20 Q180,20 180,100 Q180,180 100,180 Q20,180 20,100 Q20,20 100,20 Z",
            rotation: 360,
            scale: 1,
            duration: 1.5,
            ease: "back.out(1.7)"
        }
    )
    
    // Character-by-character text animation
    .to('.splash-title .char', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.5")
    
    .to('.splash-subtitle', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.3")
    
    // Loading bar animation
    .to('.loading-progress', {
        width: '100%',
        duration: 2,
        ease: "power2.inOut"
    }, "-=0.5")
    
    // Blob morphing animation
    .to('.blob', {
        scale: 1.2,
        rotation: 180,
        duration: 2,
        stagger: 0.3,
        ease: "sine.inOut",
        repeat: 1,
        yoyo: true
    }, 0);
}

// Main Animations Initialization
function initMainAnimations() {
    initHeroAnimations();
    initScrollAnimations();
    initProjectCardAnimations();
    initFormAnimations();
    initCanvasAnimations();
}

// Hero Section Timeline Animation
function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.5 });
    
    // Floating shapes animation
    tl.fromTo('.shape', 
        { scale: 0, rotation: 0 },
        { 
            scale: 1, 
            rotation: 360,
            duration: 1.5,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }
    )
    
    // Text animations with overlapping motion
    .to('.word', {
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=1")
    
    .to('.subtitle-text', {
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6")
    
    .to('.desc-text', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.4")
    
    // Code snippet animation
    .to('.visual-container', {
        rotateY: 0,
        rotateX: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8")
    
    .to('.code-line', {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.5");
    
    // Continuous floating animation for shapes
    gsap.to('.shape', {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "+=30",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            amount: 2,
            from: "random"
        }
    });
}

// Scroll-Driven Animations with ScrollTrigger
function initScrollAnimations() {
    // About section with multi-step timeline
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => animateAboutSection(),
        onLeave: () => reverseAboutSection(),
        onEnterBack: () => animateAboutSection(),
        onLeaveBack: () => reverseAboutSection()
    });
    
    function animateAboutSection() {
        const tl = gsap.timeline();
        
        tl.to('.about-paragraph', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        })
        .to('.skill-item', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4")
        .to('.stat-item', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: animateCounters
        }, "-=0.3");
        
        // SVG mask morphing
        gsap.to('.mask-path', {
            morphSVG: "M150,30 Q220,80 200,150 Q180,220 150,200 Q80,180 70,150 Q60,80 150,30 Z",
            duration: 2,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });
    }
    
    function reverseAboutSection() {
        gsap.to('.about-paragraph, .skill-item, .stat-item', {
            y: 50,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
        });
    }
    
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.dataset.count);
            gsap.to({ value: 0 }, {
                value: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: function() {
                    counter.textContent = Math.round(this.targets()[0].value);
                }
            });
        });
    }
    
    // Work section with staggered reveals
    ScrollTrigger.create({
        trigger: "#work",
        start: "top 70%",
        onEnter: () => {
            gsap.to('.work-item', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            });
        }
    });
    
    // Lab section experiments
    ScrollTrigger.create({
        trigger: "#lab",
        start: "top 70%",
        onEnter: () => {
            gsap.to('.experiment-item', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)"
            });
            
            initLabAnimations();
        }
    });
    
    // Contact section
    ScrollTrigger.create({
        trigger: "#contact",
        start: "top 70%",
        onEnter: () => {
            gsap.to('.contact-link', {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    });
    
    // Parallax effects for background elements
    gsap.utils.toArray('.shape').forEach((shape, i) => {
        gsap.to(shape, {
            y: (i + 1) * -100,
            rotation: (i + 1) * 90,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });
    });
}

// Project Cards with 3D Effects and Mouse Following
function initProjectCardAnimations() {
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(item => {
        const card = item.querySelector('.project-card');
        
        // Mouse tilt effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = (y / rect.height) * 20;
            const rotateY = -(x / rect.width) * 20;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        
        // Click to flip
        item.addEventListener('click', () => {
            const isFlipped = card.style.transform.includes('rotateY(180deg)');
            gsap.to(card, {
                rotateY: isFlipped ? 0 : 180,
                duration: 0.6,
                ease: "power2.inOut"
            });
        });
    });
}

// Form Interactions with State-based Animations
function initFormAnimations() {
    const form = document.querySelector('.form-container');
    const submitBtn = document.querySelector('.submit-btn');
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Validate on input
        input.addEventListener('input', () => {
            const isValid = input.checkValidity();
            const line = input.nextElementSibling;
            
            gsap.to(line, {
                backgroundColor: isValid ? '#10b981' : '#ef4444',
                duration: 0.3
            });
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        // Submit animation
        const tl = gsap.timeline();
        
        tl.to(submitBtn, {
            scale: 0.95,
            duration: 0.1
        })
        .call(() => {
            btnText.textContent = 'Sending...';
        })
        .to(submitBtn, {
            scale: 1,
            duration: 0.2
        })
        .to(submitBtn, {
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            duration: 0.3,
            delay: 1
        })
        .call(() => {
            btnText.textContent = 'Message Sent!';
        })
        .to(submitBtn, {
            backgroundColor: 'transparent',
            borderColor: '#6366f1',
            duration: 0.3,
            delay: 2
        })
        .call(() => {
            btnText.textContent = originalText;
            form.reset();
        });
    });
}

// Canvas Animations for Interactive Elements
function initCanvasAnimations() {
    const rippleCanvas = document.getElementById('ripple-canvas');
    const particleCanvases = document.querySelectorAll('.particle-canvas');
    
    // Ripple effect canvas
    if (rippleCanvas) {
        const ctx = rippleCanvas.getContext('2d');
        const ripples = [];
        
        function resizeCanvas() {
            rippleCanvas.width = rippleCanvas.offsetWidth;
            rippleCanvas.height = rippleCanvas.offsetHeight;
        }
        
        function addRipple(x, y) {
            ripples.push({
                x: x,
                y: y,
                radius: 0,
                maxRadius: 100,
                opacity: 1
            });
        }
        
        function animateRipples() {
            ctx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
            
            ripples.forEach((ripple, index) => {
                ripple.radius += 2;
                ripple.opacity -= 0.02;
                
                if (ripple.opacity <= 0) {
                    ripples.splice(index, 1);
                    return;
                }
                
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(99, 102, 241, ${ripple.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            });
            
            requestAnimationFrame(animateRipples);
        }
        
        rippleCanvas.addEventListener('click', (e) => {
            const rect = rippleCanvas.getBoundingClientRect();
            addRipple(e.clientX - rect.left, e.clientY - rect.top);
        });
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        animateRipples();
    }
    
    // Particle system for lab experiments
    particleCanvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`
            });
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    });
}

// Lab Experiments Animations
function initLabAnimations() {
    // Morphing blob animation
    const blobPath = document.querySelector('.blob-path');
    if (blobPath) {
        const morphStates = [
            "M100,20 Q160,40 180,100 Q160,160 100,180 Q40,160 20,100 Q40,40 100,20 Z",
            "M100,30 Q150,60 170,100 Q150,140 100,170 Q50,140 30,100 Q50,60 100,30 Z",
            "M100,25 Q170,35 175,100 Q170,165 100,175 Q30,165 25,100 Q30,35 100,25 Z"
        ];
        
        let currentState = 0;
        
        setInterval(() => {
            currentState = (currentState + 1) % morphStates.length;
            gsap.to(blobPath, {
                morphSVG: morphStates[currentState],
                duration: 2,
                ease: "power2.inOut"
            });
        }, 3000);
    }
}

// Page-specific Animations
function initPageAnimations(page) {
    switch(page) {
        case 'home':
            initHeroAnimations();
            break;
        case 'about':
            // About page specific animations
            break;
        case 'work':
            // Work page specific animations
            break;
        case 'lab':
            initLabAnimations();
            break;
        case 'contact':
            // Contact page specific animations
            break;
    }
}

// Responsive Animations with Media Queries
function initResponsiveAnimations() {
    mm.add("(min-width: 769px)", () => {
        // Desktop animations
        gsap.set('.hero-content', { 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr'
        });
        
        // Enhanced parallax for desktop
        gsap.utils.toArray('.floating-shapes .shape').forEach(shape => {
            gsap.to(shape, {
                y: "random(-50, 50)",
                x: "random(-30, 30)",
                rotation: "random(-180, 180)",
                duration: "random(4, 8)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    });
    
    mm.add("(max-width: 768px)", () => {
        // Mobile animations
        gsap.set('.hero-content', { 
            display: 'grid',
            gridTemplateColumns: '1fr'
        });
        
        // Simplified mobile animations
        gsap.set('.cursor-system', { display: 'none' });
        
        // Touch gesture support
        Observer.create({
            type: "touch",
            onLeft: () => console.log("Swiped left"),
            onRight: () => console.log("Swiped right"),
            tolerance: 10,
            preventDefault: true
        });
    });
    
    // Reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        gsap.globalTimeline.timeScale(0.5);
        gsap.set('*', { 
            animationDuration: '0.1s !important',
            transitionDuration: '0.1s !important'
        });
    }
}

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Page visibility optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
            console.log(`${entry.name}: ${entry.duration}ms`);
        }
    }
});

observer.observe({ entryTypes: ['measure'] });
