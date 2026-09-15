(() => {
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const closeMenu = (restoreFocus = false) => {
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Abrir menu');
    navigation?.classList.remove('is-open');
    if (restoreFocus) menu?.focus();
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open', open);
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());

  const phone = String(window.SITE_CONFIG?.whatsapp || '').replace(/\D/g, '');
  const configured = /^\d{10,15}$/.test(phone);
  const whatsappUrl = message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const status = document.querySelector('#form-status');
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    if (configured) {
      link.href = whatsappUrl(link.dataset.whatsapp);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.addEventListener('click', () => {
        if (status) status.textContent = 'O contato pelo WhatsApp estará disponível em breve.';
      });
    }
  });
  document.querySelector('#contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const telephone = form.elements.phone;
    telephone.setCustomValidity(telephone.value.replace(/\D/g, '').length < 10 ? 'Informe seu WhatsApp com DDD.' : '');
    if (!form.reportValidity()) return;
    if (!configured) {
      status.textContent = 'O contato pelo WhatsApp estará disponível em breve. Sua mensagem ainda não foi enviada.';
      return;
    }
    const data = new FormData(form);
    const message = ['Olá, Thainá! Vim pelo site.', '', `Nome: ${data.get('name').trim()}`, `WhatsApp: ${data.get('phone').trim()}`, data.get('email') ? `E-mail: ${data.get('email').trim()}` : '', `Interesse: ${data.get('interest')}`, '', data.get('message').trim()].filter(line => line !== '').join('\n');
    status.textContent = 'Sua mensagem está pronta. Conclua o envio na conversa do WhatsApp.';
    window.location.assign(whatsappUrl(message));
  });
  document.querySelector('#phone')?.addEventListener('input', event => event.target.setCustomValidity(''));
  document.querySelectorAll('[data-compare]').forEach(container => {
    const range = container.querySelector('input[type="range"]');
    const frame = container.querySelector('.compare-frame');
    range.addEventListener('input', () => {
      frame.style.setProperty('--position', `${range.value}%`);
      range.setAttribute('aria-valuetext', `${range.value}% da imagem antes da edição`);
    });
  });
})();
