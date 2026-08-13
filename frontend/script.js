/* =====================
   KIRAN RATHOD — JS v2
   ===================== */

// Custom cursor
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,.pf-btn,.chip,.a-tag,.orb').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// Scroll progress
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  prog.style.width = pct + '%';
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
function closeMobileNav() { mobileNav.classList.remove('open'); }

// Theme
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
  const t = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', t === 'dark' ? 'light' : 'dark');
  themeBtn.textContent = t === 'dark' ? '●' : '◐';
});

// Typing
const phrases = ['Web Developer', 'Software Engineer', 'Java + DSA Learner', 'Data Analytics Learner', 'Problem Solver'];
let pIdx = 0, cIdx = 0, del = false;
const typeEl = document.getElementById('typeText');
function type() {
  const cur = phrases[pIdx];
  if (del) { typeEl.textContent = cur.slice(0, --cIdx); }
  else { typeEl.textContent = cur.slice(0, ++cIdx); }
  if (!del && cIdx === cur.length) { setTimeout(() => { del = true; type(); }, 1800); return; }
  if (del && cIdx === 0) { del = false; pIdx = (pIdx + 1) % phrases.length; }
  setTimeout(type, del ? 40 : 75);
}
type();

// Counter
function countUp(el, target, duration = 1600) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
let counted = false;
const metricObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    countUp(document.getElementById('c1'), 5);
    countUp(document.getElementById('c2'), 8);
    countUp(document.getElementById('c3'), 100);
  }
}, { threshold: 0.5 });
metricObs.observe(document.querySelector('.hero-metrics'));

// Skill bars
let barsAnimated = false;
const barObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !barsAnimated) {
    barsAnimated = true;
    document.querySelectorAll('.bar-fill').forEach(b => {
      b.style.width = b.getAttribute('data-w') + '%';
    });
  }
}, { threshold: 0.2 });
const skillSection = document.getElementById('skills');
if (skillSection) barObs.observe(skillSection);

// Reveal on scroll
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Project filter
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-f');
    document.querySelectorAll('.proj-card').forEach(c => {
      const show = f === 'all' || c.getAttribute('data-cat') === f;
      c.style.display = show ? '' : 'none';
    });
  });
});

// Active nav
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav-center a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// Back to top
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 500));
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form
document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn = this.querySelector(".form-submit");
  const statusMsg = document.getElementById("statusMsg");

  btn.textContent = "Sending...";
  btn.disabled = true;
  if (statusMsg) {
    statusMsg.innerText = "";
    statusMsg.style.display = "block";
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  let isSuccess = false;

  // 1. Try local or production Node server endpoint first
  const serverEndpoints = [
    "http://localhost:5000/send",
    "https://portfolio-uobb.onrender.com/send"
  ];

  for (const endpoint of serverEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (res.ok && data.success) {
        isSuccess = true;
        break;
      }
    } catch (err) {
      // Continue to next endpoint or fallback
    }
  }

  // 2. Direct fallback to FormSubmit API (guaranteed delivery to kiran.rathod@nmiet.edu.in without backend dependency)
  if (!isSuccess) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("_subject", `New Portfolio Message from ${name}`);
      formData.append("_captcha", "false");

      const res = await fetch("https://formsubmit.co/ajax/kiran.rathod@nmiet.edu.in", {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok || data.success === "true" || data.success === true) {
        isSuccess = true;
      }
    } catch (err) {
      console.error("FormSubmit fallback error:", err);
    }
  }

  if (isSuccess) {
    if (statusMsg) {
      statusMsg.style.color = "#38bdf8";
      statusMsg.style.marginTop = "1rem";
      statusMsg.style.fontWeight = "600";
      statusMsg.innerText = "✓ Message sent successfully to Kiran Rathod!";
    }
    this.reset();
  } else {
    if (statusMsg) {
      statusMsg.style.color = "#ef4444";
      statusMsg.style.marginTop = "1rem";
      statusMsg.innerText = "✕ Failed to send message. Please send an email directly to kiran.rathod@nmiet.edu.in";
    }
  }

  btn.textContent = "Send Message →";
  btn.disabled = false;
});