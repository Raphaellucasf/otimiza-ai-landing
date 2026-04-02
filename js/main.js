/**
 * Main App — Otimiza-AI
 * Loading screen, header, dropdown, mobile menu, smooth scroll
 */
class OtimizaApp {
  constructor() {
    this.header = document.getElementById('siteHeader');
    this.loadingScreen = document.getElementById('loadingScreen');
    this.enterBtn = document.getElementById('enterBtn');
    this.dropdown = document.getElementById('systemDropdown');
    this.mobileToggle = document.getElementById('mobileMenuToggle');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.mobileClose = document.getElementById('mobileMenuClose');

    this.init();
  }

  init() {
    this.handleLoading();
    this.handleHeaderScroll();
    this.handleDropdown();
    this.handleMobileMenu();
    this.handleSmoothScroll();
  }

  handleLoading() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (this.loadingScreen) {
          this.loadingScreen.classList.add('hidden');
        }
      }, 1500);
    });

    // Fallback: force hide after 4s
    setTimeout(() => {
      if (this.loadingScreen) {
        this.loadingScreen.classList.add('hidden');
      }
    }, 4000);
  }

  handleHeaderScroll() {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      if (y > 80) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
      lastY = y;
    });
  }

  handleDropdown() {
    if (!this.enterBtn || !this.dropdown) return;

    this.enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target) && !this.enterBtn.contains(e.target)) {
        this.dropdown.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.dropdown.classList.remove('active');
      }
    });
  }

  handleMobileMenu() {
    if (!this.mobileToggle || !this.mobileMenu) return;

    this.mobileToggle.addEventListener('click', () => {
      this.mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      this.mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', closeMenu);
    }

    this.mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = this.header.offsetHeight;
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new OtimizaApp();
});

// Demo Modal Logic
function openDemoModal() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn   = document.getElementById('demoModalClose');
  const backdrop   = document.getElementById('demoModalBackdrop');
  const form       = document.getElementById('demoForm');

  if (closeBtn)  closeBtn.addEventListener('click', closeDemoModal);
  if (backdrop)  backdrop.addEventListener('click', closeDemoModal);

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('demoModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeDemoModal();
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const empresa     = document.getElementById('f-company').value.trim();
      const responsavel = document.getElementById('f-name').value.trim();
      const email       = document.getElementById('f-email').value.trim();
      const telefone    = document.getElementById('f-phone').value.trim();
      const segmento    = document.getElementById('f-segment').value;
      const mensagem    = document.getElementById('f-message').value.trim();

      if (!empresa || !responsavel || !email || !telefone) {
        alert('Por favor, preencha todos os campos obrigatórios (*).');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '3c46c26d-212f-4639-8bdb-7daa80b8bea2',
            subject: `Solicitação de Demonstração — ${empresa}`,
            from_name: responsavel,
            replyto: email,
            'Empresa': empresa,
            'Responsável': responsavel,
            'E-mail do Cliente': email,
            'Telefone/WhatsApp': telefone,
            'Segmento': segmento,
            'Mensagem': mensagem || '—',
          }),
        });

        const data = await response.json();

        if (data.success) {
          form.innerHTML = `
            <div class="form-success">
              <i class="fas fa-check-circle"></i>
              <h4>Solicitação Enviada!</h4>
              <p>Recebemos sua solicitação e entraremos em contato em breve.</p>
              <button type="button" class="btn-submit-demo" style="margin-top:1.25rem;" onclick="closeDemoModal()">Fechar</button>
            </div>
          `;
        } else {
          throw new Error(data.message || 'Erro desconhecido');
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar Solicitação';
        }
        alert('Erro ao enviar. Tente novamente ou entre em contato: Lucasraphael.lr@gmail.com');
      }
    });
  }
});
