import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script = fs.readFileSync('assets/js/enrollment.js', 'utf8');
const deadline = Date.parse('2026-10-11T23:59:00-03:00');
function simulate(now, invalidDate = false) {
  const state = { now, interval: null, clears: 0 };
  const counters = Object.fromEntries(['days', 'hours', 'minutes', 'seconds'].map(key => [key, { textContent: '' }]));
  const open = [{ hidden: false }, { hidden: false }];
  const closed = [{ hidden: true }, { hidden: true }];
  const buttons = [1, 2].map(() => ({
    href: 'https://checkout.ticto.app/O640B7735',
    dataset: { waitlistUrl: 'https://example.test/waitlist' },
    label: { textContent: 'Quero garantir minha vaga' },
    handlers: {},
    querySelector() { return this.label; },
    addEventListener(type, fn) { this.handlers[type] = fn; }
  }));
  const events = {};
  const banner = {
    dataset: { enrollmentDeadline: invalidDate ? 'invalid' : '2026-10-11T23:59:00-03:00' },
    querySelector(selector) { return counters[selector.match(/"([^"]+)"/)[1]]; }
  };
  vm.runInNewContext(script, {
    Date: { parse: Date.parse, now: () => state.now },
    document: {
      querySelector: () => banner,
      querySelectorAll: selector => selector === '[data-enrollment-cta]' ? buttons : selector === '[data-enrollment-open]' ? open : closed,
      addEventListener: (type, fn) => { events[type] = fn; }
    },
    window: { addEventListener: (type, fn) => { events[type] = fn; } },
    setInterval: fn => { state.interval = fn; return 1; },
    clearInterval: () => { state.clears++; }
  });
  return { state, counters, open, closed, buttons, events };
}
function assertClosed(s) {
  assert.ok(s.open.every(element => element.hidden));
  assert.ok(s.closed.every(element => !element.hidden));
  assert.ok(s.buttons.every(button => button.href === button.dataset.waitlistUrl));
  assert.ok(s.buttons.every(button => button.label.textContent === 'Entrar na lista de espera'));
}
assert.equal(new Date(deadline).toISOString(), '2026-10-12T02:59:00.000Z');
const active = simulate(deadline - (86400 + 2 * 3600 + 3 * 60 + 4) * 1000);
assert.deepEqual(Object.values(active.counters).map(counter => counter.textContent), ['01', '02', '03', '04']);
assert.ok(active.buttons.every(button => button.href.includes('checkout.ticto.app')));
const lastSecond = simulate(deadline - 1);
assert.equal(lastSecond.counters.seconds.textContent, '01');
lastSecond.state.now = deadline;
lastSecond.state.interval();
assertClosed(lastSecond);
assertClosed(simulate(deadline));
assertClosed(simulate(deadline + 7 * 86400000));
assertClosed(simulate(deadline, true));
for (const event of ['visibilitychange', 'pageshow']) {
  const s = simulate(deadline - 10000);
  s.state.now = deadline + 1;
  s.events[event]();
  assertClosed(s);
}
for (const event of ['click', 'auxclick']) {
  const s = simulate(deadline - 10000);
  s.state.now = deadline + 1;
  s.buttons[0].handlers[event]();
  assertClosed(s);
}
vm.runInNewContext(script, { document: { querySelector: () => null } });
const html = fs.readFileSync('dist/boss-4p/index.html', 'utf8');
assert.equal((html.match(/data-enrollment-cta/g) || []).length, 2);
assert.equal((html.match(/href="https:\/\/checkout.ticto.app\/O640B7735"/g) || []).length, 2);
assert.ok(html.includes('R$ 103,11') && html.includes('R$ 997'));
assert.ok(!html.includes('undefined'));
const home = fs.readFileSync('dist/index.html', 'utf8');
assert.ok(home.includes('disabled>Disponível em Breve</button>'));
assert.ok(!home.includes('href="/boss-4p/"'));
console.log('OK: enrollment countdown, deadline, timezone, both CTAs, suspended tabs, and generated pages verified.');
