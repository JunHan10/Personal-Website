// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation to sections when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Add animation class to elements when they come into view
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    const animateOnScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.8) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
});

// Language switcher functionality
function setLanguage(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
}

document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-zh').addEventListener('click', () => setLanguage('zh'));

// --- Pixelated Robot Animation ---
const robotSVG = `<svg viewBox='0 0 16 16' width='40' height='40' xmlns='http://www.w3.org/2000/svg'>
  <rect x='3' y='3' width='10' height='10' fill='#8b5a2b' stroke='#f5f5f5' stroke-width='1'/>
  <rect x='5' y='5' width='6' height='6' fill='#f5f5f5'/>
  <rect x='6' y='6' width='1' height='1' fill='#2c1810'/>
  <rect x='9' y='6' width='1' height='1' fill='#2c1810'/>
  <rect x='7' y='8' width='2' height='1' fill='#8b5a2b'/>
  <rect x='4' y='12' width='2' height='2' fill='#4a2c1a'/>
  <rect x='10' y='12' width='2' height='2' fill='#4a2c1a'/>
  <rect x='2' y='7' width='1' height='2' fill='#4a2c1a'/>
  <rect x='13' y='7' width='1' height='2' fill='#4a2c1a'/>
</svg>`;

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

const robotCount = 6;
const robots = [];
const robotBg = document.getElementById('robot-bg');

for (let i = 0; i < robotCount; i++) {
    const div = document.createElement('div');
    div.className = 'robot-sprite';
    div.innerHTML = robotSVG;
    robotBg.appendChild(div);
    robots.push({
        el: div,
        x: randomBetween(0, window.innerWidth - 40),
        y: randomBetween(0, window.innerHeight - 40),
        dx: randomBetween(-0.4, 0.4) || 0.2,
        dy: randomBetween(-0.4, 0.4) || 0.2
    });
}

// --- Enhanced Interactivity ---
// Mouse collision
let mouseX = -100, mouseY = -100;
const ROBOT_SIZE = 40;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseleave', () => {
    mouseX = -100;
    mouseY = -100;
});

function robotCollidesWithMouse(r) {
    return (
        mouseX > r.x && mouseX < r.x + ROBOT_SIZE &&
        mouseY > r.y && mouseY < r.y + ROBOT_SIZE
    );
}

// On scroll, nudge all robots
window.addEventListener('scroll', () => {
    robots.forEach(r => {
        r.dx += randomBetween(-0.5, 0.5);
        r.dy += randomBetween(-0.5, 0.5);
        // Clamp speed
        r.dx = Math.max(Math.min(r.dx, 1.2), -1.2);
        r.dy = Math.max(Math.min(r.dy, 1.2), -1.2);
    });
});

// Update animateRobots to handle mouse collision
function animateRobots() {
    for (const r of robots) {
        // Mouse collision
        if (robotCollidesWithMouse(r)) {
            // Bounce away from mouse
            const cx = r.x + ROBOT_SIZE / 2;
            const cy = r.y + ROBOT_SIZE / 2;
            const angle = Math.atan2(cy - mouseY, cx - mouseX);
            r.dx = Math.cos(angle) * randomBetween(1, 2);
            r.dy = Math.sin(angle) * randomBetween(1, 2);
        }
        r.x += r.dx;
        r.y += r.dy;
        if (r.x < 0 || r.x > window.innerWidth - ROBOT_SIZE) r.dx *= -1;
        if (r.y < 0 || r.y > window.innerHeight - ROBOT_SIZE) r.dy *= -1;
        r.el.style.left = r.x + 'px';
        r.el.style.top = r.y + 'px';
    }
    requestAnimationFrame(animateRobots);
}
animateRobots();

window.addEventListener('resize', () => {
    robots.forEach(r => {
        r.x = Math.min(r.x, window.innerWidth - 40);
        r.y = Math.min(r.y, window.innerHeight - 40);
    });
}); 