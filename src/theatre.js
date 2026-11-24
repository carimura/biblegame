// The paper theatre: what the days of Creation share. One picture, black to begin with, which every day adds to.
// Nobody walks here: the player works the picture itself, and the wheels, cords and weights that move it.
import { stage, scene, show, overlay, hud, html, sleep, click, tween, smooth, leap } from './engine.js';
import { rnd, cut } from './art.js';
import { tick, cheer, sweep } from './audio.js';

function svg(cls, view, inner) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('class', cls);
  el.setAttribute('viewBox', view);
  el.innerHTML = inner;
  return el;
}

// The picture is 1600x900, kept in the middle of the window (`.tableau` in index.html). It is built in ranks, back
// to front: the light and the wheel of day and night, the sky and what is set in it, the land, the waters, the
// first darkness that lies over them all, and the works in front.
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
// The three deep waves are the sea, once the waters are divided: its face is the upper edge of the hindmost of them.
export const sea = y => [3, 4, 5].forEach(k => lay(waves[k], y + (k - 3) * 75));
export const tide = (y, ms) => (y0 => tween(ms, k => sea(y0 + (y - y0) * k), smooth))(waves[3].level);

export function build() {
  const sc = scene(1600);
  box = html('<div class="tableau"><div class="wash base"></div><div class="wash dusk"></div><div class="wash dawn"></div></div>');
  for (const name of ['back', 'sky', 'land', 'water', 'shade', 'works']) box.append((rank[name] = html('<div class="rank"></div>')));
  rank.shade.innerHTML = '<div class="wash void"></div>';
  box.append((burst = html('<div class="wash burst"></div>')));
  sc.el.append(box);
  DEEP.forEach((y, k) => {
    const wave = rank.water.appendChild(svg('sheet wave daylit', '0 0 1600 900', band(k)));
    wave.style.cssText = `--t:${6 + k * 0.8}s;--d:${-k * 1.7}s`; // each rocks in its own time
    lay(wave, y);
    waves.push(wave);
  });
  light(0, 0);
  show(sc);
}

// A sheet of the picture: an SVG of its own, so that moving or fading it costs nothing.
export const sheet = (inner, cls = '', into = rank.back) => into.appendChild(svg('sheet ' + cls, '0 0 1600 900', inner));
// A small drawing with a layer of its own, drawn round its own middle so that it can be put anywhere and turned.
export function scrap(inner, size, into, cls = '') {
  const el = into.appendChild(svg('piece ' + cls, `${-size} ${-size} ${2 * size} ${2 * size}`, inner));
  el.style.cssText = `width:${2 * size}px;height:${2 * size}px;margin:${-size}px`;
  return el;
}
// A loose piece among the works (a cog, a weight, a seed).
export function piece(inner, x, y, size) {
  const el = scrap(inner, size, rank.works, 'fresh');
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
// What lies at a place in the picture: the first thing there that matches `what`, if any.
export function under(x, y, what) {
  const b = box.getBoundingClientRect();
  return document.elementsFromPoint(b.left + (x * b.width) / 1600, b.top + (y * b.height) / 900).find(el => el.matches(what));
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

// Things on a card that are chosen two at a time (to change places, or for one to be given to the other). A click
// on each will do: `press(i)` is told of every click, and `lifted()` gives back whatever is taken up just now, if
// anything is. Or the first can be carried to the second and let go, which counts as the click on the second. It
// goes with the pointer wherever that is (the whole window is listened to, not the thing itself, which the pointer
// can outrun). It need not be let go just on the other: the one it would go to is whichever its middle is in, or
// nearest to (within half its own size, so that it at least overlaps), and that one glows while it is carried. Let
// go anywhere else it goes back, still taken up.
export function pairs(card, keys, press, lifted) {
  const box = el => (el.querySelector('[fill="transparent"]') ?? el).getBoundingClientRect(); // (a thing's outline: the one drawn for the pointer, where it has one)
  card.onpointerdown = e => {
    const key = e.target.closest('.key'), i = keys.indexOf(key);
    if (i < 0) return;
    const again = !!lifted() && key.contains(lifted()); // pressed on the thing that is taken up already: it is put down again only if it is not carried off
    if (!again) press(i);
    const el = lifted(), [x0, y0] = at(e);
    if (!el || !key.contains(el)) return; // (that click took nothing up: it was the second of the two)
    key.parentNode.append(key); // in front of the rest while it is carried
    const homes = keys.map(k => k.classList.contains('key') && box(k)); // where each lies
    let far = 0, aim = i;
    const move = e => {
      const [x, y] = at(e);
      far = Math.max(far, Math.hypot(x - x0, y - y0));
      el.style.translate = `${x - x0}px ${y - y0}px`;
      const b = box(el), mx = b.left + b.width / 2, my = b.top + b.height / 2;
      const gaps = homes.map(h => (h ? Math.hypot(Math.max(h.left - mx, 0, mx - h.right), Math.max(h.top - my, 0, my - h.bottom)) : 1e9));
      aim = Math.min(...gaps) > Math.max(b.width, b.height) / 2 ? i : gaps.indexOf(Math.min(...gaps));
      keys.forEach((k, n) => k.classList.toggle('aim', n === aim && n !== i));
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', () => {
      removeEventListener('pointermove', move);
      el.style.translate = '';
      keys[aim].classList.remove('aim');
      if (aim !== i) press(aim);
      else if (again && far < 6) press(i);
    }, { once: true });
  };
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
  const p = page.firstChild, past = new Promise(leap); // (the short cut turns the page)
  p.className = 'verse';
  p.style.fontSize = text.length > 190 ? '56px' : ''; // a long verse is set smaller, to fit
  p.innerHTML = `${text}<small>${ref}</small><small class="more">click to continue</small>`;
  page.style.background = veil;
  page.classList.add('on');
  await sleep(1100);
  p.classList.add('done');
  await Promise.race([click(page), past]);
  tick();
  page.classList.remove('on');
  await sleep(1000);
}

// The storyteller's card, low on the screen: what is happening, and what to try. Nothing (or '') puts it away.
const sign = html('<div class="place card telling"></div>');
// Seven small round pictures along the top, numbered, one for each day: light and dark; the sky between the waters;
// land, sea and plants; sun, moon and stars; a bird and a fish; an animal and the two people; and a star for the day
// that was blessed. Each is gray until its day is done, and then takes its colours and a gold rim that glows, so
// that what was made on every day so far can be looked back over.
const STAR = 'M0,-10Q1.5,-1.5 10,0Q1.5,1.5 0,10Q-1.5,1.5 -10,0Q-1.5,-1.5 0,-10Z';
const paint = c => `<rect x="-20" y="-20" width="40" height="40" fill="${c}"/>`, surf = y => `<path d="M-20,20V${y}q5,-4 10,0t10,0t10,0t10,0V20Z" fill="#4b90b8"/>`;
const SIGNS = [
  paint('#222960') + '<path d="M-20,-20h40v20h-40z" fill="#fbdd8c"/>',
  paint('#9ecfeb') + '<path d="M-20,-20h40v10q-5,5 -10,0t-10,0t-10,0t-10,0z" fill="#e6f3f8"/>' + surf(10),
  paint('#d5ebf4') + '<path d="M-20,20V8Q-8,-8 6,4Q14,10 20,6V20Z" fill="#88b068"/><rect x="-9.5" y="-9" width="3" height="12" fill="#7a4a2a"/><circle cx="-8" cy="-11" r="7" fill="#5f8f45"/><path d="M-11,-12h.1M-6,-14h.1M-7,-8h.1" stroke="#c8432f" stroke-width="3" stroke-linecap="round"/>' + surf(14),
  paint('#a9d8ea') + `<path d="M-20,-20h20v40h-20z" fill="#27305f"/><path d="${STAR}" fill="#fdf1cf" transform="translate(-12,-10) scale(.3)"/><path d="${STAR}" fill="#fdf1cf" transform="translate(-6,10) scale(.25)"/><path d="M0,-14a14,14 0 1 0 10,24a11,11 0 1 1 -10,-24z" fill="#fdf1cf" transform="translate(-13,-1) scale(.42)"/><circle cx="9" r="9" fill="#f8d77a" opacity=".5"/><circle cx="9" r="5.5" fill="#f6c54a"/>`,
  paint('#bfe0ec') + '<path d="M-10,-8q5,-6 10,0q5,-6 10,0" fill="none" stroke="#4a3f3a" stroke-width="2.4" stroke-linecap="round"/>' + surf(1) + '<path d="M-20,0Q-4,-11 13,0Q-4,11 -20,0ZM11,0L24,-8V8Z" fill="#f08a4b" transform="translate(-1,10) scale(.55)"/>',
  paint('#8fc4dd') + '<path d="M-20,20V7Q0,1 20,7V20Z" fill="#8fb45f"/><path d="M-13,12V5h10v7h-2.5V9.5h-5V12z" fill="#d9a441"/><circle cx="-3" cy="4" r="5" fill="#8a5a2a"/><circle cx="-2.4" cy="4.4" r="3" fill="#e2b356"/>' +
    [7, 13].map((x, i) => `<circle cx="${x}" cy="-5" r="2.8" fill="#fbf3df"/><path d="M${x},-2l${i ? -3.6 : -2.6},13h${i ? 7.2 : 5.2}z" fill="#fbf3df"/>`).join(''),
  paint('#f4c95d') + `<path d="${STAR}" fill="#fffaf0" transform="scale(1.5)"/>`,
];
const week = html(`<div class="week">${SIGNS.map((art, i) => `<i><svg viewBox="-20 -20 40 40">${art}</svg><b>${i + 1}</b></i>`).join('')}</div>`);
hud.append(sign, week);
export function tell(text) {
  sign.classList.toggle('on', !!text);
  if (text) sign.innerHTML = text;
}
// So many days are done. `fresh`: the last of them only just now, and the harp hails it.
export function days(n, fresh) {
  week.classList.add('on');
  [...week.children].forEach((d, i) => d.classList.toggle('done', i < n));
  if (fresh) sweep();
}
// A puzzle is solved: the harp cheers, and gold paper stars are thrown out over the whole picture.
export function solved() {
  cheer();
  const stars = sheet(Array.from({ length: 30 }, (_, i) => {
    const a = Math.random() * 6.283, far = 220 + Math.random() * 480;
    return `<path class="toss" style="--x:${(800 + Math.cos(a) * far) | 0}px;--y:${(470 + Math.sin(a) * far * 0.7) | 0}px;--r:${(Math.random() * 720 - 360) | 0}deg;--k:${(1.2 + Math.random() * 2.4).toFixed(1)};animation-delay:${i * 15}ms" d="${STAR}" fill="${['#f4c95d', '#fff3c4', '#f7b93c'][i % 3]}"/>`;
  }).join(''), '', rank.works);
  setTimeout(() => stars.remove(), 3000);
}

// Help comes by what the player does, never by how long they take: someone who is thinking is left to think. A
// puzzle counts each try that gets nowhere (`tried`). After `every` of them it does the first of `steps` (it says a
// little more); after as many again the next (it shows the next move), and from then on that last one over again.
// `again` starts the count over, when the player has got somewhere.
export function patience(steps, every = 4) {
  let n = 0;
  return { tried: () => ++n % every || (steps[n / every - 1] ?? steps.at(-1))?.(), again: () => (n = 0), stop: () => (steps = []) };
}
