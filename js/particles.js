/**
 * Particle Network System — Otimiza-AI Hero Background
 * Interactive particle network with mouse-follow and connections
 */
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.animationId = null;

    // Configuration
    this.config = {
      particleCount: Math.round(this.getParticleCount() * 1.35),
      connectionDistance: 140,
      mouseRadius: 200,
      colors: ['#00E5FF', '#7C4DFF', '#C6FF00', '#00E676', '#448AFF'],
      baseSpeed: 0.3,
    };

    this.init();
  }

  getParticleCount() {
    const width = window.innerWidth;
    if (width < 768) return 40;
    if (width < 1024) return 60;
    return 80;
  }

  init() {
    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.config.baseSpeed,
        vy: (Math.random() - 0.5) * this.config.baseSpeed,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
      });
    }
  }

  addEventListeners() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.config.particleCount = this.getParticleCount();
        this.resize();
        this.createParticles();
      }, 200);
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  drawParticle(p) {
    // Glow
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    this.ctx.fillStyle = p.color;
    this.ctx.globalAlpha = p.opacity * 0.08;
    this.ctx.fill();

    // Core
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = p.color;
    this.ctx.globalAlpha = p.opacity;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }

  drawConnections() {
    const dist = this.config.connectionDistance;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < dist) {
          const alpha = (1 - d / dist) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.particles[i].color;
          this.ctx.globalAlpha = alpha;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }

      // Mouse connections
      const mx = this.particles[i].x - this.mouse.x;
      const my = this.particles[i].y - this.mouse.y;
      const md = Math.sqrt(mx * mx + my * my);

      if (md < this.config.mouseRadius) {
        const alpha = (1 - md / this.config.mouseRadius) * 0.4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = '#00E5FF';
        this.ctx.globalAlpha = alpha;
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }
    }
    this.ctx.globalAlpha = 1;
  }

  update() {
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Mouse attraction (leve)
      const mx = this.mouse.x - p.x;
      const my = this.mouse.y - p.y;
      const md = Math.sqrt(mx * mx + my * my);
      if (md < this.config.mouseRadius && md > 0) {
        const force = (this.config.mouseRadius - md) / this.config.mouseRadius;
        p.vx += (mx / md) * force * 0.008; // atração sutil
        p.vy += (my / md) * force * 0.008;
      }

      // Boundary wrap
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      // Dampen velocity
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Add slight random motion
      p.vx += (Math.random() - 0.5) * 0.005;
      p.vy += (Math.random() - 0.5) * 0.005;

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update();
    this.drawConnections();
    this.particles.forEach((p) => this.drawParticle(p));
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize on load
window.addEventListener('load', () => {
  new ParticleSystem();
});
