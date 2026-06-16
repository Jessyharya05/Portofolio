/* ══════════════════════════════════════════════
   PORTFOLIO — main.js
   Navy · Teal · Sky Blue theme
   ══════════════════════════════════════════════ */

/* ═══════════════════════
   1. PARTICLE CANVAS
   ═══════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const PARTICLE_COUNT = 55;
  const CONNECT_DIST = 140;
  const TEAL = 'rgba(86,124,141,';
  const SKY = 'rgba(200,217,230,';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 5;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.35 + 0.1);
      this.r = Math.random() * 1.4 + 0.5;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.isTeal = Math.random() < 0.4;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.vx += dx / dist * 0.04;
        this.vy += dy / dist * 0.04;
      }
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const alpha = Math.min(this.life / 60, 1) * Math.min((this.maxLife - this.life) / 60, 1) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = (this.isTeal ? TEAL : SKY) + alpha + ')';
      ctx.fill();
    }
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(86,124,141,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    connect();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  loop();

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
})();


/* ═══════════════════════
   2. CURSOR GLOW
   ═══════════════════════ */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animate() {
    cx = lerp(cx, tx, 0.10);
    cy = lerp(cy, ty, 0.10);
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ═══════════════════════
   3. STICKY NAV
   ═══════════════════════ */
(function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();


/* ═══════════════════════
   4. SCROLL REVEAL
   ═══════════════════════ */
(function initReveal() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => io.observe(el));
})();


/* ═══════════════════════
   5. ACTIVE NAV HIGHLIGHT
   ═══════════════════════ */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active-link', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => io.observe(s));
})();


/* ═══════════════════════
   6. TYPING ANIMATION
   ═══════════════════════ */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const phrases = [
    'Full-Stack Developer',
    'IT Student',
    'Problem Solver',
    'Open Source Enthusiast',
    'UI/UX Thinker',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 350); return;
      }
      setTimeout(tick, 40);
    }
  }
  tick();
})();


/* ═══════════════════════
   7. 3D CARD TILT
   ═══════════════════════ */
function initTiltCard(el) {
  const MAX_TILT = 12;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * MAX_TILT}deg) rotateY(${x * MAX_TILT}deg) translateZ(6px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    el.style.transition = 'transform 0.5s ease';
  });
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform 0.1s ease';
  });
}


/* ═══════════════════════
   8. MAGNETIC BUTTONS
   ═══════════════════════ */
function initMagneticBtn(el) {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  });
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform 0.15s ease';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(initMagneticBtn);
});


/* ═══════════════════════
   9. RIPPLE EFFECT
   ═══════════════════════ */
function addRipple(el) {
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const r = document.createElement('span');
    r.style.cssText = `
      position:absolute; border-radius:50%;
      width:0; height:0;
      left:${e.clientX - rect.left}px;
      top:${e.clientY - rect.top}px;
      background:rgba(255,255,255,0.2);
      transform:translate(-50%,-50%);
      animation:ripple-grow 0.6s ease-out forwards;
      pointer-events:none;
    `;
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = `@keyframes ripple-grow{to{width:200px;height:200px;opacity:0}}`;
      document.head.appendChild(s);
    }
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(r);
    setTimeout(() => r.remove(), 620);
  });
}


/* ═══════════════════════
   HELPERS
   ═══════════════════════ */
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

function makeRevealObserver(delay = 0) {
  return new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80 + delay);
        makeRevealObserver().unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
}


/* ═══════════════════════
   10. COUNTER ANIMATION
   ═══════════════════════ */
function animateCounter(el, target, duration = 1400) {
  const suffix = /[+∞%]/.test(target) ? target.replace(/[0-9]/g, '') : '';
  const num = parseInt(target);
  if (!num) { el.innerHTML = target; return; }
  let start = null;
  const ease = t => 1 - Math.pow(1 - t, 3);
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.innerHTML = `${Math.round(ease(p) * num)}<span>${suffix}</span>`;
    if (p < 1) requestAnimationFrame(step);
    else el.innerHTML = `${num}<span>${suffix}</span>`;
  }
  requestAnimationFrame(step);
}


/* ═══════════════════════
   11. STATS
   ═══════════════════════ */
async function loadStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  try {
    const stats = await fetchJSON('/api/stats');
    grid.innerHTML = stats.map((s, i) => `
      <div class="stat-card reveal" style="transition-delay:${i * 0.1}s">
        <span class="stat-icon">${s.icon}</span>
        <div class="stat-value" data-target="${s.value}">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const valEl = e.target.querySelector('.stat-value');
          if (valEl) animateCounter(valEl, valEl.dataset.target);
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });

    grid.querySelectorAll('.stat-card').forEach(el => io.observe(el));
  } catch (err) {
    console.error('Stats:', err);
  }
}


/* ═══════════════════════
   12. SKILLS
   ═══════════════════════ */
function animateSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.skill-bar-fill');
        if (fill) setTimeout(() => { fill.style.width = fill.dataset.pct + '%'; }, 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skill-card').forEach(el => io.observe(el));
}

async function loadSkills() {
  const techGrid = document.getElementById('techSkillsGrid');
  const softGrid = document.getElementById('softSkillsGrid');
  if (!techGrid && !softGrid) return;

  const skillCardHTML = (s, i) => `
    <div class="skill-card reveal" style="transition-delay:${(i % 3) * 0.08}s">
      <div class="skill-header">
        <span class="skill-name">${s.name}</span>
        <div class="skill-meta">
          <span class="skill-pct">${s.level}%</span>
          <span class="skill-cat">${s.category}</span>
        </div>
      </div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" data-pct="${s.level}" style="width:0%"></div>
      </div>
    </div>
  `;

  const softCategories = ['Soft Skills'];

  try {
    const skills = await fetchJSON('/api/skills');
    const techSkills = skills.filter(s => !softCategories.includes(s.category));
    const softSkills = skills.filter(s => softCategories.includes(s.category));

    if (techGrid) techGrid.innerHTML = techSkills.map(skillCardHTML).join('');
    if (softGrid) softGrid.innerHTML = softSkills.map(skillCardHTML).join('');

    animateSkillBars();

    const obs = makeRevealObserver();
    document.querySelectorAll('#techSkillsGrid .skill-card, #softSkillsGrid .skill-card')
      .forEach(el => obs.observe(el));
  } catch {
    if (techGrid) techGrid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Could not load skills.</p>';
    if (softGrid) softGrid.innerHTML = '';
  }
}


/* ═══════════════════════
   13. PROJECTS
   ═══════════════════════ */
let allProjects = [];
let activeCategory = 'all';

async function loadProjects(category = 'all') {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="spinner"></div>';
  try {
    if (!allProjects.length) allProjects = await fetchJSON('/api/projects');
    const filtered = category === 'all'
      ? allProjects
      : allProjects.filter(p => p.category.toLowerCase() === category.toLowerCase());

    grid.innerHTML = filtered.length
      ? filtered.map((p, i) => `
        <div class="project-card reveal" style="transition-delay:${(i % 3) * 0.1}s">
          <div class="project-banner" style="background:linear-gradient(135deg,${p.color}88 0%,${p.color}33 100%)">
            <span class="project-emoji">${p.emoji}</span>
            ${p.featured ? '<span class="project-featured-badge">✦ Featured</span>' : ''}
          </div>
          <div class="project-body">
            <div class="project-header">
              <h3 class="project-title">${p.title}</h3>
              <span class="project-year">${p.year}</span>
            </div>
            <p class="project-desc">${p.description}</p>
            <div class="project-tags">
              ${p.tech.map(t => `<span class="project-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')
      : '<p style="text-align:center;color:var(--text-muted);padding:3rem">No projects here yet.</p>';

    const obs = makeRevealObserver();
    grid.querySelectorAll('.project-card').forEach(card => {
      obs.observe(card);
      initTiltCard(card);
    });
    grid.querySelectorAll('.btn').forEach(addRipple);

    const filterBar = document.getElementById('filterBar');
    if (filterBar && filterBar.children.length <= 1) {
      const cats = ['All', ...new Set(allProjects.map(p => p.category))];
      filterBar.innerHTML = cats.map(c => `
        <button class="filter-btn ${c.toLowerCase() === activeCategory ? 'active' : ''}"
                data-category="${c.toLowerCase()}">${c}</button>
      `).join('');
      filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        addRipple(btn);
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeCategory = btn.dataset.category;
          loadProjects(activeCategory);
        });
      });
    }
  } catch {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Could not load projects.</p>';
  }
}


/* ═══════════════════════
   14. TIMELINE
   ═══════════════════════ */
const TYPE_ICONS = { work: '💼', education: '🎓', achievement: '🏆' };

async function loadTimeline() {
  const wrap = document.getElementById('timelineWrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="spinner"></div>';
  try {
    const timeline = await fetchJSON('/api/timeline');
    wrap.innerHTML = timeline.map((item, i) => `
      <div class="timeline-item">
        <div class="timeline-dot ${item.type}">${TYPE_ICONS[item.type] || '●'}</div>
        <div class="timeline-card ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}">
          <span class="timeline-type-badge ${item.type}">${item.type}</span>
          <div class="timeline-year">${item.year}</div>
          <div class="timeline-title">${item.title}</div>
          <p class="timeline-desc">${item.description}</p>
        </div>
      </div>
    `).join('');
    const obs = makeRevealObserver(100);
    wrap.querySelectorAll('.timeline-card').forEach(el => obs.observe(el));
  } catch {
    wrap.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Could not load timeline.</p>';
  }
}


/* ═══════════════════════
   15. CONTACT FORM
   ═══════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const btn = document.getElementById('submitBtn');
  if (!form) return;

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => { input.parentElement.style.transform = 'scale(1.01)'; });
    input.addEventListener('blur', () => { input.parentElement.style.transform = ''; });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('#contactName').value.trim();
    const email = form.querySelector('#contactEmail').value.trim();
    const message = form.querySelector('#contactMessage').value.trim();
    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in all fields.';
      feedback.className = 'form-feedback error';
      return;
    }
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span>';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (data.success) {
        feedback.textContent = '✓ ' + data.message;
        feedback.className = 'form-feedback success';
        form.reset();
        showToast('Message sent! ✓');
      } else {
        feedback.textContent = '✗ ' + (data.error || 'Something went wrong.');
        feedback.className = 'form-feedback error';
      }
    } catch {
      feedback.textContent = '✗ Network error. Please try again.';
      feedback.className = 'form-feedback error';
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span>';
    }
  });

  addRipple(btn);
}


/* ═══════════════════════
   16. INTERACTIVE CODE PANEL
   ═══════════════════════ */
(function initCodePanel() {
  // Tab switching
  const tabs = document.querySelectorAll('.code-tab');
  const blocks = document.querySelectorAll('.code-block');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      blocks.forEach(b => b.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const block = document.getElementById('tab-' + target);
      if (block) block.classList.add('active');

      // Clear output on tab switch
      const out = document.getElementById('codeOutput');
      const label = document.getElementById('outputLabel');
      if (out) { out.innerHTML = ''; out.classList.remove('visible'); }
      if (label) label.textContent = '';
    });
  });

  // Output definitions per tab
  const outputs = {
    about: [
      { delay: 0, html: '<span class="out-prompt">$</span> <span class="out-info">python about.py</span>' },
      { delay: 400, html: '<span class="out-muted">Running…</span>' },
      { delay: 900, html: '<span class="out-success">["Clean code", "Problem solving", "Continuous learning"]</span>' },
      { delay: 1200, html: '<span class="out-muted">── Process finished with exit code 0 ──</span>' },
    ],
    skills: [
      { delay: 0, html: '<span class="out-prompt">$</span> <span class="out-info">python skills.py</span>' },
      { delay: 350, html: '<span class="out-muted">Running…</span>' },
      { delay: 700, html: '<span class="out-success">[languages]</span> Python, JavaScript, SQL' },
      { delay: 950, html: '<span class="out-success">[frontend]</span>  HTML, CSS, React' },
      { delay: 1150, html: '<span class="out-success">[backend]</span>   Flask, Node.js' },
      { delay: 1350, html: '<span class="out-success">[tools]</span>     Git, Docker, Linux' },
      { delay: 1550, html: '<span class="out-muted">── Process finished with exit code 0 ──</span>' },
    ],
    contact: [
      { delay: 0, html: '<span class="out-prompt">$</span> <span class="out-info">python contact.py</span>' },
      { delay: 400, html: '<span class="out-muted">Running…</span>' },
      { delay: 800, html: '<span class="out-success">hire_me("intern") → "Let\'s talk! "</span>' },
      { delay: 1100, html: '<span class="out-info">Status: Open to opportunities ✓</span>' },
      { delay: 1400, html: '<span class="out-muted">── Process finished with exit code 0 ──</span>' },
    ],
  };

  const runBtn = document.getElementById('runBtn');
  const output = document.getElementById('codeOutput');
  const label = document.getElementById('outputLabel');
  if (!runBtn || !output) return;

  let running = false;
  let timers = [];

  runBtn.addEventListener('click', () => {
    if (running) return;
    running = true;

    // Determine active tab
    const activeTab = document.querySelector('.code-tab.active');
    const tabKey = activeTab ? activeTab.dataset.tab : 'about';
    const lines = outputs[tabKey] || outputs.about;

    // Clear previous
    timers.forEach(clearTimeout);
    timers = [];
    output.innerHTML = '';
    output.classList.add('visible');
    label.textContent = 'running…';
    runBtn.style.opacity = '0.5';
    runBtn.style.pointerEvents = 'none';

    lines.forEach(({ delay, html }) => {
      const t = setTimeout(() => {
        const line = document.createElement('div');
        line.innerHTML = html;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
      }, delay);
      timers.push(t);
    });

    // After last line
    const lastDelay = lines[lines.length - 1].delay + 500;
    const done = setTimeout(() => {
      label.textContent = 'done ✓';
      runBtn.style.opacity = '';
      runBtn.style.pointerEvents = '';
      running = false;
    }, lastDelay);
    timers.push(done);
  });
})();


/* ═══════════════════════
   17. SMOOTH SCROLL
   ═══════════════════════ */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});


/* ═══════════════════════
   INIT
   ═══════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadSkills();
  loadProjects();
  loadTimeline();
  initContactForm();
});