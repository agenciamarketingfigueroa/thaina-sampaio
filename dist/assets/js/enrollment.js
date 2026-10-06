(() => {
  const banner = document.querySelector('[data-enrollment-deadline]');
  if (!banner) return;
  const deadline = Date.parse(banner.dataset.enrollmentDeadline);
  const buttons = [...document.querySelectorAll('[data-enrollment-cta]')];
  const openContent = document.querySelectorAll('[data-enrollment-open]');
  const closedContent = document.querySelectorAll('[data-enrollment-closed]');
  const counters = Object.fromEntries(['days', 'hours', 'minutes', 'seconds'].map(unit =>
    [unit, banner.querySelector('[data-countdown="' + unit + '"]')]));
  let interval;
  let closed = false;
  const update = () => {
    const remaining = Math.max(0, deadline - Date.now());
    if (!Number.isFinite(remaining) || remaining === 0) {
      if (!closed) {
        closed = true;
        openContent.forEach(element => { element.hidden = true; });
        closedContent.forEach(element => { element.hidden = false; });
        buttons.forEach(button => {
          button.href = button.dataset.waitlistUrl;
          button.querySelector('[data-enrollment-label]').textContent = 'Entrar na lista de espera';
        });
      }
      clearInterval(interval);
      return;
    }
    const seconds = Math.ceil(remaining / 1000);
    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor(seconds / 3600) % 24,
      minutes: Math.floor(seconds / 60) % 60,
      seconds: seconds % 60
    };
    Object.entries(values).forEach(([unit, value]) => {
      counters[unit].textContent = String(value).padStart(2, '0');
    });
  };
  update();
  if (!closed) interval = setInterval(update, 1000);
  // Refresh immediately after a suspended/background tab resumes, and before navigation.
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
  buttons.forEach(button => {
    button.addEventListener('click', update);
    button.addEventListener('auxclick', update);
  });
})();
