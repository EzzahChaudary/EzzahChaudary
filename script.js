const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- THEME TOGGLE ---------- */
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

themeToggle.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    rootEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        rootEl.setAttribute('data-theme', e.matches ? 'light' : 'dark');
    }
});

/* ---------- HAMBURGER TOGGLE ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

/* ---------- SCROLL PROGRESS BAR ---------- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
    scrollProgress.setAttribute('aria-valuenow', Math.round(pct));
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------- BACK TO TOP ---------- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* ---------- SCROLLSPY ---------- */
const sections = ['about', 'skills', 'projects', 'experience', 'education', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => spyObserver.observe(sec));

/* ---------- ROLE TYPEWRITER ---------- */
const roles = ['Aspiring Software Engineer', 'Web Developer','Blockchain Developer', 'UI/UX Enthusiast', 'React & Node.js Developer'];
const roleEl = document.getElementById('roleTyped');

if (prefersReducedMotion) {
    roleEl.textContent = roles[0];
} else {
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
        const current = roles[roleIndex];
        if (!deleting) {
            charIndex++;
            roleEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            charIndex--;
            roleEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }
        setTimeout(typeLoop, deleting ? 35 : 65);
    }
    typeLoop();
}

/* ---------- STAT COUNTERS ---------- */
const counters = document.querySelectorAll('.number[data-count]');
function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
    }

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

/* ---------- PROJECT DATA & MODAL ---------- */
const projectData = [{
    id: 'rwa',
    title: 'Tokenization of RWA (Rental Property)',
    images: [
        'DAshboard.jpeg', 'KYC.jpeg', 'overview-user dashboard.jpeg',
        'User dashboard.jpeg', 'tenant management .jpeg', '1.png', '2.png', '3.png', '4.png',
    ]
}, {
    id: 'food',
    title: 'Food Delivery App UI',
    images: [
        'Welcome.png', 'Profile.png', 'Cart Page.png', 'Main Page .png',
        'other.png', 'Payment Methods.png', 'Food .png', 'AI .png'
    ]
}, { id: 'banking', title: 'Online Banking System', images: [] },
   { id: 'hotel', title: 'Hotel Management System', images: [] },
   { id: 'coffee', title: 'My Coffee Shop Website', images: [] },
   { id: 'watch', title: 'WatchIt Website', images: [] }];

const modal = document.getElementById('projectModal');
const modalGallery = document.getElementById('modalGallery');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.getElementById('closeModalBtn');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function () {
        const project = projectData.find(p => p.id === this.dataset.projectId);
        if (!project) return;

        modalTitle.textContent = project.title;
        modalGallery.innerHTML = '';

        if (project.images.length === 0) {
            const placeholder = document.createElement('p');
            placeholder.style.cssText = 'color:var(--text-muted);padding:2rem;text-align:center;font-family:var(--f-mono);font-size:0.85rem;';
            placeholder.textContent = 'No images available for this project yet.';
            modalGallery.appendChild(placeholder);
        } else {
            project.images.forEach(src => {
                const wrapper = document.createElement('div');
                wrapper.className = 'gallery-image';
                const img = document.createElement('img');
                img.src = src;
                img.alt = project.title;
                img.loading = 'lazy';
                wrapper.appendChild(img);
                modalGallery.appendChild(wrapper);
            });
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ---------- TOAST ---------- */
const toast = document.getElementById('toast');
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------- COPY EMAIL (with tooltip) ---------- */
const copyEmailBtn = document.getElementById('copyEmailBtn');
let tooltipEl = null;

copyEmailBtn.addEventListener('click', async () => {
    const email = 'chaudharyezzah8@gmail.com';
    try {
        await navigator.clipboard.writeText(email);
        showTooltip('✅ Copied!');
        showToast('Email copied to clipboard');
    } catch {
        showTooltip('📋 Copy');
        showToast(email);
    }
});

function showTooltip(text) {
    // Remove existing tooltip
    if (tooltipEl) tooltipEl.remove();

    tooltipEl = document.createElement('span');
    tooltipEl.className = 'tooltip show';
    tooltipEl.textContent = text;
    copyEmailBtn.style.position = 'relative';
    copyEmailBtn.appendChild(tooltipEl);

    setTimeout(() => {
        if (tooltipEl) {
            tooltipEl.classList.remove('show');
            setTimeout(() => { if (tooltipEl) tooltipEl.remove(); }, 300);
        }
    }, 1500);
}

/* ---------- DYNAMIC COPYRIGHT ---------- */
document.getElementById('copyrightYear').textContent = new Date().getFullYear();

/* ---------- CONTACT FORM ---------- */
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const originalText = submitText.textContent;

    submitText.textContent = 'Sending...';
    submitSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    feedback.style.display = 'none';

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            feedback.style.display = 'block';
            feedback.style.color = getComputedStyle(document.documentElement).getPropertyValue('--mint').trim();
            feedback.textContent = '✓ Message sent successfully. I will get back to you soon.';
            form.reset();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('_subject').value;
        const message = document.getElementById('message').value;

        const mailtoLink = `https://mail.google.com/mail/?view=cm&to=chaudharyezzah8@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.open(mailtoLink, '_blank');

        feedback.style.display = 'block';
        feedback.style.color = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
        feedback.textContent = '→ Opening Gmail. Please send the message manually.';
        form.reset();
    } finally {
        submitText.textContent = originalText;
        submitSpinner.style.display = 'none';
        submitBtn.disabled = false;
    }
});

/* ---------- SCROLL REVEAL ---------- */
const revealSections = document.querySelectorAll('.reveal-section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
revealSections.forEach(section => revealObserver.observe(section));