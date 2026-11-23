// The paper theatre: what the days of Creation share. One picture, black to begin with, which every day adds to.
// Nobody walks here: the player works the picture itself, and the wheels, cords and weights that move it.
import { stage, scene, show, overlay, hud, html, sleep, click, tween, smooth } from './engine.js';
import { rnd, cut } from './art.js';
import { tick } from './audio.js';

function svg(cls, view, inner) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('class', cls);
  el.setAttribute('viewBox', view);
  el.innerHTML = inner;
  return el;
}

// The picture is 1600x900, kept in the middle of the window (`.tableau` in index.html). It is built in ranks, back
// to front: what lies behind the waters, the waters, the first darkness that lies over both, and the works in front.
export const rank = {};
let box, burst, day = 0;

// The waters: six long waves of paper lying one over another, back to front: three pale, then three deep. Each is a
// band 420 deep, scalloped along its upper and lower edges, with a few curls of foam on it; `level` is where its upper
// edge lies. In the beginning they all lie low: the deep.
export const waves = [];
const BLUES = ['#8fc4dd', '#a6d2e6', '#bcdfed', '#5fa6c9', '#4b90b8', '#3a7aa6'], DEEP = [600, 640, 690, 740, 790, 840];
function band(k) {
  const r = rnd(90 + k), bump = () => (80 + r() * 90) | 0, rise = () => (18 + r() * 16) | 0;
  let d = 'M-300,0', x = -300, foam = '';
  for (let w; x < 1900; x += w) d += `q${(w = bump()) / 2},${-rise()} ${w},0`;
  d += 'v420';
  for (let w; x > -300; x -= w) d += `q${-(w = bump()) / 2},${rise()} ${-w},0`;
  for (let i = 0; i < 26; i++) foam += `M${(-280 + r() * 2140) | 0},${(70 + r() * 290) | 0}q22,-16 44,0`;
  return cut(`<path class="water" d="${d}Z" fill="${BLUES[k]}"/><path d="${foam}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>`);
}
export const lay = (wave, y) => (wave.style.transform = `translateY(${(wave.level = y)}px)`);
export const float = (wave, y, ms) => (y0 => tween(ms, k => lay(wave, y0 + (y - y0) * k), smooth))(wave.level);

export function build() {
  const sc = scene(1600);
  box = html('<div class="tableau"><div class="wash base"></div><div class="wash dusk"></div><div class="wash dawn"></div></div>');
  for (const name of ['back', 'water', 'shade', 'works']) box.append((rank[name] = html('<div class="rank"></div>')));
  rank.shade.innerHTML = '<div class="wash void"></div>';
  box.append((burst = html('<div class="wash burst"></div>')));
  sc.el.append(box);
  DEEP.forEach((y, k) => {
    const wave = rank.water.appendChild(svg('sheet wave', '0 0 1600 900', band(k)));
    wave.style.cssText = `--t:${6 + k * 0.8}s;--d:${-k * 1.7}s`; // each rocks in its own time
    lay(wave, y);
    waves.push(wave);
  });
  light(0, 0);
  show(sc);
}

// A sheet of the picture: an SVG of its own, so that moving or fading it costs nothing.
export const sheet = (inner, cls = '', into = rank.back) => into.appendChild(svg('sheet ' + cls, '0 0 1600 900', inner));
// A loose piece (a cog, a weight), drawn round its own middle so that it can be put anywhere and turned.
export function piece(inner, x, y, size) {
  const el = rank.works.appendChild(svg('piece fresh', `${-size} ${-size} ${2 * size} ${2 * size}`, inner));
  el.style.cssText = `width:${2 * size}px;height:${2 * size}px;margin:${-size}px`;
  put(el, x, y);
  return el;
}
export function put(el, x, y, spin = el.spin ?? 0) {
  el.pos = [x, y];
  el.spin = spin;
  el.style.transform = `translate(${x}px,${y}px) rotate(${spin}deg)`;
}
export const slide = (el, x, y, ms = 400) => (([x0, y0]) => tween(ms, k => put(el, x0 + (x - x0) * k, y0 + (y - y0) * k), smooth))(el.pos);
// Something that has done its work fades and is gone.
export function gone(el) {
  el.style.transition = 'opacity 1.2s';
  el.style.opacity = 0;
  setTimeout(() => el.remove(), 1300);
}

// Where in the picture the pointer is.
export function at(e) {
  const b = box.getBoundingClientRect();
  return [((e.clientX - b.left) * 1600) / b.width, ((e.clientY - b.top) * 900) / b.height];
}
// A piece that can be picked up and carried with the pointer: `lift` is called as it is taken, `drop` as it is let go.
export function carry(el, drop, lift) {
  el.addEventListener('pointerdown', e => {
    if (el.fixed) return;
    e.target.setPointerCapture(e.pointerId);
    const [x0, y0] = at(e), [px, py] = el.pos;
    el.classList.add('held');
    lift?.();
    el.onpointermove = e => put(el, px + at(e)[0] - x0, py + at(e)[1] - y0);
    el.onpointerup = el.onpointercancel = () => {
      el.onpointermove = el.onpointerup = el.onpointercancel = null;
      el.classList.remove('held');
      drop();
    };
  });
}

// How light the picture is. `lit`: whether there is any light yet. `d`: how much of the day is up, from 1 at noon
// to 0 at night. Night is not the black of the beginning: it has its own deep blue.
export function light(d, lit = 1) {
  box.style.setProperty('--day', (day = d));
  box.style.setProperty('--lit', lit);
  stage.classList.toggle('unlit', !lit);
}
export const lighten = (to, ms) => (from => tween(ms, k => light(from + (to - from) * k), smooth))(day);
// Light breaks over the whole picture, then clears to show whatever `then` made of the picture meanwhile.
export async function flash(then) {
  burst.classList.add('on');
  await sleep(1700);
  then();
  burst.style.transitionDuration = '3.4s';
  burst.classList.remove('on');
  await sleep(3000);
}

// Scripture fills the screen and stays until a click. `veil` is what it is read against ('none': the bare picture).
const page = overlay('<p class="verse"></p>');
page.classList.add('read');
export async function verse(text, ref = '', veil = '') {
  const p = page.firstChild;
  p.className = 'verse';
  p.innerHTML = `${text}<small>${ref}</small><small class="more">click to continue</small>`;
  page.style.background = veil;
  page.classList.add('on');
  await sleep(1100);
  p.classList.add('done');
  await click(page);
  tick();
  page.classList.remove('on');
  await sleep(1000);
}

// The storyteller's card, low on the screen: what is happening, and what to try. Nothing (or '') puts it away.
const sign = html('<div class="place card telling"></div>');
// Seven rings in the corner, one for each day; a day that is done is filled with gold.
const week = html(`<div class="week">${'<i></i>'.repeat(7)}</div>`);
hud.append(sign, week);
export function tell(text) {
  sign.classList.toggle('on', !!text);
  if (text) sign.innerHTML = text;
}
export function days(n) {
  week.classList.add('on');
  [...week.children].forEach((d, i) => d.classList.toggle('done', i < n));
}

// Help comes slowly here, and by steps. Left alone for `ms`, a puzzle does the first of `steps` (it says a little
// more); after as long again, the next (it shows what to touch). `again` starts the wait over, when the player has
// got somewhere.
export function patience(steps, ms = 30000) {
  let t;
  const again = () => {
    clearTimeout(t);
    let k = 0;
    (function wait() { t = setTimeout(() => (steps[k++](), k < steps.length && wait()), ms); })();
  };
  again();
  return { again, stop: () => clearTimeout(t) };
}
