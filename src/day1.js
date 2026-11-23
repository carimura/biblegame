// The first day: light. Genesis 1:1–5.
// It begins black, with the deep stirring under the pointer. Then there is light, all mixed up with the dark: a
// great wheel of four paper discs lying one on another, each half light and half dark. A click turns a disc an
// eighth of the way round, and a disc carries the smaller ones lying on it, so the way to part the light from the
// dark is from the biggest disc inward. Divided, it becomes the wheel of day and night, half sunk behind the deep:
// wound right round with the handle it brings evening and then morning, which closes this day and every day after.
// But the handle does not reach it until the right three cogs are found for the three pegs between.
import { stage, html, sleep, when, apart, wonder } from './engine.js';
import { cut } from './art.js';
import { music, shine, knock, drip, tick, pluck, STRINGS } from './audio.js';
import { NOTES, chime } from './shared.js';
import { rank, sheet, piece, put, slide, gone, carry, at, light, lighten, flash, verse, tell, days, patience } from './theatre.js';

const R = [300, 228, 156, 84]; // the four discs, biggest (and lowest) first
const LIGHT = ['#fff7dc', '#fdecb4', '#fbdd8c', '#f8cd66'], DARK = ['#191d49', '#222960', '#2c3574', '#384388'];
const HOME = 'translate(800px,372px)', SKY = 'translate(800px,830px) scale(2)'; // the wheel while it is being divided, and after
const TEETH = 7; // two cogs mesh when their middles are this much further apart than their two radii together
const RIM = { pos: [800, 830], r: 609 }; // the great wheel as the cogs meet it, once it is in the sky
const off = ([x, y], far, deg) => [x + far * Math.cos((deg * Math.PI) / 180), y - far * Math.sin((deg * Math.PI) / 180)];
// Three pegs between the great wheel and the handle, set so that only one size of cog fits each: by the wheel a
// 50, then a 30, then a 70, which meets the handle's own cog (a 40). A spare cog, another 40, fits nowhere.
const P3 = off(RIM.pos, RIM.r + 50 + TEETH, 22), P2 = off(P3, 50 + 30 + TEETH, 95), P1 = off(P2, 30 + 70 + TEETH, 35);
const PEGS = [P1, P2, P3], FIT = [70, 30, 50], HANDLE = off(P1, 70 + 40 + TEETH, 112);
const LOOSE = [[50, 1160, 806], [30, 1262, 818], [70, 1385, 792], [40, 1516, 812]]; // the cogs as they lie in their tray: [size, x, y]

// The outline of a cog: `n` teeth standing `deep` out of a wheel of radius `r`.
const cog = (r, n = Math.round(r / 5), deep = TEETH) =>
  'M' + Array.from({ length: n * 4 }, (_, i) => off([0, 0], r + (i % 4 < 2 ? deep : 0), (i * 90) / n).map(v => v.toFixed(1))).join('L') + 'Z';
const cogArt = (r, more = '') =>
  cut(`<path d="${cog(r)}" fill="${{ 30: '#e2c486', 40: '#d3ad66', 50: '#c2974e', 70: '#b0833f' }[r]}"/><circle r="${r * 0.6}" fill="none" stroke="rgba(90,60,20,.3)" stroke-width="${r * 0.16}"/><circle r="8" fill="#5b4530"/>${more}`, 1) + `<circle class="key" r="${r + 18}" fill="transparent"/>`;
const halfDisc = (r, upper) => `M${-r},0A${r},${r} 0 0 ${upper} ${r},0Z`;

let wheel, discs = [], turns = [1, 3, 6, 5]; // `turns`: how far round each disc is from the one it lies on, in eighths
let turned = 0, goal = 0, held = false, idle = 0, beat = 0, night, stuck, round; // winding the wheel: see `wind`
let crank, cogs = [], tray, help;
const set = () => discs.forEach((d, k) => (d.style.transform = `rotate(${turns[k] * 45 + (k ? 0 : turned)}deg)`));

export function build() {
  wheel = rank.back.appendChild(html(`<div class="wheel" style="transform:${HOME}"></div>`));
  // Each disc is drawn inside the one it lies on, so turning one turns all those on top of it.
  R.reduce((under, r, k) => {
    const s = r + 30, d = html(`<div class="disc"><svg viewBox="${-s} ${-s} ${2 * s} ${2 * s}" style="width:${2 * s}px;height:${2 * s}px;margin:${-s}px">${cut(
      (k ? '' : `<path d="${cog(304.5, 122, 3.5)}" fill="#a3843f"/>`) + `<path class="key lit" d="${halfDisc(r, 1)}" fill="${LIGHT[k]}"/><path class="key unlit" d="${halfDisc(r, 0)}" fill="${DARK[k]}"/>`)}</svg></div>`);
    discs.push(under.appendChild(d));
    return d;
  }, wheel);
  set();
}

// Before there is light: the pointer stirs the dark water, and rings spread from it that can only just be seen.
async function stir() {
  tell('Everything is dark. Move over the deep, dark water.');
  let n = 0, last = [0, 0];
  const rings = sheet('', '', rank.works), move = e => {
    const [x, y] = at(e);
    if (y < 590 || Math.hypot(x - last[0], y - last[1]) < 90) return;
    last = [x, y];
    rings.insertAdjacentHTML('beforeend', `<ellipse class="stir" cx="${x | 0}" cy="${y | 0}" rx="80" ry="22"/>`);
    setTimeout(ring => ring.remove(), 2400, rings.lastChild);
    drip(90 + Math.random() * 60);
    n++;
  };
  stage.addEventListener('pointermove', move);
  await Promise.race([when(() => n > 7), sleep(25000)]);
  await sleep(1500);
  stage.removeEventListener('pointermove', move);
  tell('');
  await sleep(1200);
  rings.remove();
}

// Divide the light from the darkness: turn the discs until every one lies the same way as the one beneath it.
async function divide() {
  tell('Light! But the light and the dark are all mixed together. Click a wheel to turn it. Can you get all the light onto one side?');
  const out = () => turns.findIndex((t, k) => k && t % 8); // the biggest disc that is out of place (-1: none is)
  const glow = on => discs.forEach((d, k) => d.querySelector('.lit').classList.toggle('next', on && k === out()));
  help = patience([() => tell('A big wheel carries the smaller ones round with it. So begin with the biggest one that is out of place.'), () => glow(true)]);
  await new Promise(done => (wheel.onpointerdown = e => {
    const k = discs.indexOf(e.target.closest('.disc')), was = out();
    if (k < 0) return;
    turns[k]++;
    set();
    knock();
    glow(false);
    if (out() < 0) return done();
    if (out() > was) (pluck(STRINGS[out()]), help.again()); // one more disc lies true
  }));
  wheel.onpointerdown = null;
  help.stop();
  tell('');
  discs[0].style.transitionDuration = '1.8s';
  turns[0] = Math.ceil(turns[0] / 8) * 8; // the light comes round to the top
  set();
  shine();
  await sleep(2400);
  wheel.classList.add('whole'); // one wheel now: its discs no longer turn on one another
  turns = [0, 0, 0, 0];
  set();
}

// Which cogs the handle turns, and which way each goes: its own, and on from each to any whose teeth meet it. The
// great wheel counts as one more.
function reach() {
  const live = new Map([[crank, 1]]);
  for (const [a, dir] of live) for (const b of [...cogs, RIM]) if (b.pos && b.peg !== null && !live.has(b) && Math.abs(apart(a, b) - a.r - b.r - TEETH) < 3) live.set(b, -dir);
  return live;
}
// While the handle is held its cog turns, and so does every cog the turning reaches. If it reaches the great wheel,
// and the wheel has further to go (`goal`), the wheel winds on: the light goes down as its dark half comes up, and
// comes back as it comes right round.
function wind(last) {
  requestAnimationFrame(now => {
    if (!held) return;
    const dt = Math.min(50, now - last) / 1000, live = reach();
    for (const [c, dir] of live) if (c !== RIM) put(c, ...c.pos, c.spin + ((dir * 9000) / c.r) * dt);
    if (!live.has(RIM)) (idle += dt) > 1.1 && stuck?.();
    else if (turned < goal) {
      turned = Math.min(goal, turned + 40 * dt);
      set();
      light((1 + Math.cos((turned * Math.PI) / 180)) / 2);
      if (!night && turned > goal - 185) (night = true), tell('Evening… and now it is night. Keep winding: morning is coming!');
      if (turned === goal) round();
    }
    if ((beat += dt) > 0.16) (beat = 0), tick();
    wind(now);
  });
}
// The close of a day: the player winds the great wheel right round with the handle. Evening, then morning.
export function dusk() {
  goal = turned + 360;
  night = false;
  return new Promise(done => (round = done));
}

// The handle and its pegs. With `placed`, the right cogs are on the pegs already (for starting at a later day).
function works(placed) {
  discs[0].style.willChange = 'transform'; // from here the whole wheel is wound round by hand
  sheet(PEGS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#5b4530"/><circle cx="${x}" cy="${y}" r="4.5" fill="#d9bd80"/>`).join(''), 'fresh', rank.works);
  crank = piece(cogArt(40, '<path d="M0,0V-62" stroke="#6e5234" stroke-width="13" stroke-linecap="round"/><circle cy="-62" r="15" fill="#b65a3c"/>'), ...HANDLE, 100);
  crank.r = 40;
  crank.addEventListener('pointerdown', e => {
    e.target.setPointerCapture(e.pointerId);
    held = true;
    idle = 0;
    wind(performance.now());
  });
  crank.onpointerup = crank.onpointercancel = () => (held = false);
  if (placed) spares(true);
}
// The loose cogs, in their tray. Let go over a peg, a cog sits on it if there is room for it there.
function spares(placed) {
  if (!placed) tray = sheet(cut('<rect x="1086" y="700" width="492" height="186" rx="26" fill="#efe3c8"/>'), 'fresh', rank.works);
  cogs = LOOSE.flatMap(([r, x, y]) => {
    const k = FIT.indexOf(r);
    if (placed && k < 0) return [];
    const g = piece(cogArt(r), ...(placed ? PEGS[k] : [x, y]), r + 30);
    Object.assign(g, { r, peg: placed ? k : null, fixed: placed });
    carry(g, () => {
      const k = PEGS.reduce((best, p, i) => (Math.hypot(g.pos[0] - p[0], g.pos[1] - p[1]) < Math.hypot(g.pos[0] - PEGS[best][0], g.pos[1] - PEGS[best][1]) ? i : best), 0), pos = PEGS[k];
      if (Math.hypot(g.pos[0] - pos[0], g.pos[1] - pos[1]) > 75 || cogs.some(c => c.peg === k)) return slide(g, x, y);
      if ([crank, RIM, ...cogs.filter(c => c.peg !== null)].some(b => apart({ pos }, b) < g.r + b.r + TEETH - 3)) {
        knock();
        tell('That one is too big to sit there.');
        return slide(g, x, y);
      }
      g.peg = k;
      put(g, ...pos);
      knock();
      help.again();
    }, () => ((g.peg = null), g.classList.remove('next')));
    return [g];
  });
}

// Find the cogs that carry the turning from the handle to the great wheel; then wind the first evening and morning.
async function train() {
  works();
  await sleep(1400);
  tell('Day must turn to night, and night to day again. Press and hold the handle to wind the great wheel round.');
  const wound = dusk();
  await new Promise(tried => (stuck = tried)); // the first try goes nowhere
  stuck = null;
  spares();
  tell('The handle turns, but its cog does not reach the great wheel. Put a cog on each peg, so that the teeth of each one meet the next.');
  help = patience([
    () => tell('Begin at the handle. Which cog reaches from the nearest peg to the handle’s own? Hold the handle to see how far the turning gets.'),
    () => cogs.find(c => c.r === FIT.find((r, k) => !cogs.some(c => c.peg === k && c.r === r))).classList.add('next'), // the cog for the first peg that lacks its own
  ]);
  await when(() => turned > goal - 358); // the great wheel has begun to move: the cogs are right
  help.stop();
  for (const c of cogs) (c.fixed = true), c.classList.remove('next');
  gone(tray);
  gone(cogs.find(c => c.peg === null));
  tell('It turns! Keep holding.');
  await wound;
}

// Jump past this day, for starting at a later one: light, the wheel divided and in the sky, the cogs in place.
export function skip() {
  light(1);
  turns = [0, 0, 0, 0];
  set();
  wheel.style.transition = 'none';
  wheel.style.transform = SKY;
  wheel.classList.add('on', 'whole');
  wonders();
  works(true);
  days(1);
}
// Once divided, the wheel answers a click with a note: one for the light, one for the dark.
function wonders() {
  for (const d of discs) (wonder(d.querySelector('.lit'), NOTES.light, chime(5)), wonder(d.querySelector('.unlit'), NOTES.dark, chime(0)));
}

export async function play() {
  music('void');
  await sleep(1600);
  await verse('In the beginning God created the heavens and the earth.', 'Genesis 1:1', 'none');
  await verse('The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters.', 'Genesis 1:2', 'none');
  await stir();
  await verse('Then God said, “Let there be light”;', '', 'none');
  shine();
  music('light');
  await flash(() => (light(0.45), wheel.classList.add('on'))); // light, but not yet parted from the dark
  await verse('Then God said, “Let there be light”; and there was light.', 'Genesis 1:3');
  await divide();
  await verse('And God saw the light, that it was good; and God divided the light from the darkness.', 'Genesis 1:4');
  wonders();
  wheel.style.transform = SKY; // it sinks half behind the deep, and grows: the wheel of day and night
  days(0);
  await lighten(1, 3000);
  await verse('God called the light Day, and the darkness He called Night.', 'Genesis 1:5');
  await train();
  tell('');
  await sleep(1500);
  await verse('So the evening and the morning were the first day.', 'Genesis 1:5');
  days(1);
}
