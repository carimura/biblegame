// The first day: light. Genesis 1:1–5.
// It begins black, with the deep stirring under the pointer. Then there is light, all mixed up with the dark: a
// great wheel of four paper discs lying one on another, each half light and half dark. A click turns a disc an
// eighth of the way round, and the disc lying on it turns as far back the other way, so a disc set right is upset
// by turning the one beneath it: the way to part the light from the dark is from the biggest disc inward. Divided,
// it becomes the wheel of day and night, half sunk behind the deep: wound right round with the handle it brings
// evening and then morning, which closes this day and every day after. But the handle does not reach it until the
// right four cogs are found for the four pegs between. The handle goes round the way a clock's hands do.
import { stage, html, sleep, when, apart, leap } from './engine.js';
import { cut } from './art.js';
import { music, shine, knock, drip, tick, pluck, STRINGS } from './audio.js';
import { rank, sheet, piece, put, slide, gone, carry, at, light, lighten, flash, verse, tell, days, patience, solved } from './theatre.js';

const R = [300, 228, 156, 84]; // the four discs, biggest (and lowest) first
const LIGHT = ['#fff7dc', '#fdecb4', '#fbdd8c', '#f8cd66'], DARK = ['#191d49', '#222960', '#2c3574', '#384388'];
const HOME = 'translate(800px,372px)', SKY = 'translate(800px,830px) scale(2)'; // the wheel while it is being divided, and after
// A cog has a tooth for every 5 of its size, so the teeth of every cog are as far apart, and two cogs mesh when their
// middles are just their two sizes apart: the teeth of each then reach in between the other's. `TEETH`: how deep.
const TEETH = 10, SPEED = 30; // (and how many degrees a second the great wheel is wound)
const RIM = { pos: [800, 830], r: 610 }; // the great wheel as the cogs meet it, once it is in the sky: a cog of 122 teeth
const off = ([x, y], far, deg) => [x + far * Math.cos((deg * Math.PI) / 180), y - far * Math.sin((deg * Math.PI) / 180)];
// Four pegs between the great wheel and the handle, set so that only one size of cog fits each: by the wheel a 40,
// then a 70, a 25 and a 55. That one meets a small cog (a 25) which is always there, and the small cog meets the
// handle's own (a 40): with it the cogs are an even number, so the handle and the great wheel go round the same way.
// A spare cog, another 40, is not wanted.
const P4 = off(RIM.pos, RIM.r + 40, 22), P3 = off(P4, 40 + 70, 30), P2 = off(P3, 70 + 25, 100), P1 = off(P2, 25 + 55, 60);
const PEGS = [P1, P2, P3, P4], FIT = [55, 25, 70, 40], LINK = off(P1, 55 + 25, 140), HANDLE = off(LINK, 25 + 40, 150);
const LOOSE = [[70, 1235, 748], [55, 1385, 735], [40, 1508, 722], [25, 1335, 848], [40, 1470, 832]]; // the cogs as they lie in their tray: [size, x, y]

// The outline of a cog of size `r`: `n` teeth, standing half their depth out of it and cut half their depth into it.
const cog = (r, n = r / 5, deep = TEETH) =>
  'M' + Array.from({ length: n * 4 }, (_, i) => off([0, 0], r + (i % 4 < 2 ? deep : -deep) / 2, (i * 90) / n).map(v => v.toFixed(1))).join('L') + 'Z';
const cogArt = (r, more = '') =>
  cut(`<path d="${cog(r)}" fill="${{ 25: '#e2c486', 40: '#d3ad66', 55: '#c2974e', 70: '#b0833f' }[r]}"/><circle r="${r * 0.6}" fill="none" stroke="rgba(90,60,20,.3)" stroke-width="${r * 0.16}"/><circle r="8" fill="#5b4530"/>${more}`, 1) + `<circle class="key" r="${r + 18}" fill="transparent"/>`;
const halfDisc = (r, upper) => `M${-r},0A${r},${r} 0 0 ${upper} ${r},0Z`;

let wheel, discs = [], turns = [1, 5, 2, 2]; // `turns`: how far round each disc is from the one it lies on, in eighths
let turned = 0, goal = 0, held = false, idle = 0, beat = 0, stuck, round; // winding the wheel: see `wind`
const riders = []; // what is set in the sky turns with the wheel (the fourth day)
let crank, link, pegs, cogs = [], tray, help;
function set() {
  discs.forEach((d, k) => (d.style.transform = `rotate(${turns[k] * 45 + (k ? 0 : turned)}deg)`));
  for (const el of riders) el.style.transform = `translate(${RIM.pos[0]}px,${RIM.pos[1]}px) rotate(${turned}deg)`;
}
// Something else to turn with the wheel, about its middle; and how far round the wheel is now, in degrees.
export const ride = el => (riders.push(el), set());
export const angle = () => turned;

export function build() {
  wheel = rank.back.appendChild(html(`<div class="wheel" style="transform:${HOME}"></div>`));
  // Each disc is drawn inside the one it lies on, so turning one turns all those on top of it.
  R.reduce((under, r, k) => {
    const s = r + 30, d = html(`<div class="disc"><svg viewBox="${-s} ${-s} ${2 * s} ${2 * s}" style="width:${2 * s}px;height:${2 * s}px;margin:${-s}px">${cut(
      (k ? '' : `<path d="${cog(305, 122, TEETH / 2)}" fill="#a3843f"/>`) + `<path class="key lit" d="${halfDisc(r, 1)}" fill="${LIGHT[k]}"/><path class="key unlit" d="${halfDisc(r, 0)}" fill="${DARK[k]}"/>`)}</svg></div>`);
    discs.push(under.appendChild(d));
    return d;
  }, wheel);
  set();
}

// Before there is light: the pointer stirs the dark water, anywhere in the picture, and rings spread from it. It
// goes on stirring under the words that come next; what this gives back puts an end to it.
async function stir() {
  tell('Everything is dark. Move over the deep, dark water.');
  let n = 0, last = [0, 0];
  const rings = sheet('', '', rank.works), move = e => {
    const [x, y] = at(e);
    if (Math.hypot(x - last[0], y - last[1]) < 90) return;
    last = [x, y];
    rings.insertAdjacentHTML('beforeend', `<ellipse class="stir" cx="${x | 0}" cy="${y | 0}" rx="80" ry="22"/>`);
    setTimeout(ring => ring.remove(), 2400, rings.lastChild);
    drip(90 + Math.random() * 60);
    n++;
  };
  stage.addEventListener('pointermove', move);
  await Promise.race([when(() => n > 7), sleep(25000), new Promise(leap)]);
  await sleep(1500);
  tell('');
  await sleep(1200);
  return () => (stage.removeEventListener('pointermove', move), rings.remove());
}

// Divide the light from the darkness: turn the discs until every one lies the same way as the one beneath it.
async function divide() {
  tell('Light! But the light and the dark are all mixed together. Click a wheel to turn it, and watch the next one in: it turns back the other way. Can you get all the light onto one side?');
  const out = () => turns.findIndex((t, k) => k && t % 8); // the biggest disc that is out of place (-1: none is)
  const glow = on => discs.forEach((d, k) => d.querySelector('.lit').classList.toggle('next', on && k === out()));
  help = patience([() => tell('Turning a wheel upsets the one lying on it. So begin with the biggest one that is out of place, and when it lies right, leave it alone.'), () => glow(true)], 8);
  await new Promise(done => (leap(() => ((turns = [turns[0], 0, 0, 0]), set(), done())), wheel.onpointerdown = e => { // (the short cut: every disc true)
    const k = discs.indexOf(e.target.closest('.disc')), was = out();
    if (k < 0) return;
    turns[k]++;
    if (k < 3) turns[k + 1] -= 2; // the disc lying on it is not carried round with it, but goes as far the other way
    if (k < 2) turns[k + 2]++; // (and the next stays as it was)
    set();
    knock();
    glow(false);
    if (out() < 0) return done();
    if (out() > was) (pluck(STRINGS[out()]), help.again()); // one more disc lies true
    else help.tried();
  }));
  wheel.onpointerdown = null;
  help.stop();
  tell('');
  discs[0].style.transitionDuration = '1.8s';
  turns[0] = Math.ceil(turns[0] / 8) * 8; // the light comes round to the top
  set();
  shine();
  solved();
  await sleep(2400);
  wheel.classList.add('whole'); // one wheel now: its discs no longer turn on one another
  turns = [0, 0, 0, 0];
  set();
}

// Which cogs turn with `from`: itself, and on from each to any whose teeth meet it (the handle's cog, the small one
// beside it and the great wheel each count as one more). For each: the one the turning comes to it from, and which
// way it goes round.
function reach(from, dir) {
  const live = new Map([[from, [null, dir]]]);
  for (const [a, [, dir]] of live) for (const b of [crank, link, ...cogs, RIM]) if (b.peg !== null && !live.has(b) && Math.abs(apart(a, b) - a.r - b.r) < 3) live.set(b, [a, -dir]);
  return live;
}
// Teeth lie between teeth. Each cog on a peg is turned, by less than a tooth, to fit the one the turning comes to it
// from: outward from the great wheel, which stays as it is, and where the train does not reach that, from the handle.
function mesh() {
  const done = new Set();
  for (const from of [RIM, crank]) for (const [b, [a]] of reach(from)) {
    if (done.has(b)) continue;
    done.add(b);
    if (!a) continue;
    const way = (Math.atan2(a.pos[1] - b.pos[1], b.pos[0] - a.pos[0]) * 180) / Math.PI, tooth = 1800 / b.r; // the way from a to b, as cogs are drawn; and how far round b one tooth is
    const fit = tooth * (0.75 - ((way + (a === RIM ? turned : a.spin)) * a.r) / 1800) - way - 180;
    put(b, ...b.pos, b.spin + ((((fit - b.spin) % tooth) + tooth * 1.5) % tooth) - tooth / 2);
  }
}
// While the handle is held its cog turns, and so does every cog the turning reaches, tooth for tooth. If it reaches
// the great wheel, that winds on as far as it has to go (`goal`) and no further: the light goes down as its dark
// half comes up, and comes back as it comes right round.
function wind(last) {
  requestAnimationFrame(now => {
    if (!held) return;
    const dt = Math.min(50, now - last) / 1000, live = reach(crank, 1), by = live.has(RIM) ? Math.min(goal - turned, SPEED * dt) : SPEED * dt;
    for (const [c, [, dir]] of live) if (c !== RIM) put(c, ...c.pos, c.spin + (dir * by * RIM.r) / c.r);
    if (!live.has(RIM)) (idle += dt) > 1.1 && stuck?.();
    else if (by) {
      turned = Math.min(goal, turned + SPEED * dt);
      set();
      light((1 + Math.cos((turned * Math.PI) / 180)) / 2);
      if (turned === goal) round();
    }
    if (by && (beat += dt) > 0.16) (beat = 0), tick();
    wind(now);
  });
}
// Let the wheel be wound on by so many degrees. Resolves when the player has wound it that far.
const reached = () => ((turned = goal), set(), light((1 + Math.cos((turned * Math.PI) / 180)) / 2), round()); // (the short cut: it is there at once)
export function turn(by) {
  goal = turned + by;
  leap(reached);
  return new Promise(done => (round = done));
}
// The close of a day: the player winds the great wheel right round with the handle. Evening, then morning.
export async function dusk() {
  await turn(180);
  tell('Evening… and now it is night. Keep winding: morning is coming!');
  await turn(180);
}
// When all the work is done (the seventh day) the handle and its cogs are put away.
export const rest = () => [pegs, crank, link, ...cogs].forEach(gone);

// The handle, the small cog beside it, and the pegs. With `placed`, the right cogs are on the pegs already (for
// starting at a later day).
function works(placed) {
  discs[0].style.willChange = 'transform'; // from here the whole wheel is wound round by hand
  pegs = sheet(PEGS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#5b4530"/><circle cx="${x}" cy="${y}" r="4.5" fill="#d9bd80"/>`).join(''), 'fresh', rank.works);
  crank = piece(cogArt(40, '<path d="M0,0V-62" stroke="#6e5234" stroke-width="13" stroke-linecap="round"/><circle class="key" cy="-62" r="15" fill="#b65a3c"/>'), ...HANDLE, 100);
  crank.r = 40;
  crank.style.zIndex = 1; // the handle passes in front of the cog beside it
  crank.addEventListener('pointerdown', e => {
    e.target.setPointerCapture(e.pointerId);
    held = true;
    idle = 0;
    if (turned === goal && reach(crank).has(RIM)) knock(); // held fast: the great wheel has no further to go just now
    wind(performance.now());
  });
  crank.onpointerup = crank.onpointercancel = () => (held = false);
  link = piece(cogArt(25), ...LINK, 55);
  link.r = 25;
  link.querySelector('.key').remove(); // not one to be picked up
  placed ? spares(true) : mesh();
}
// The loose cogs, in their tray. Let go over a peg, a cog sits on it if there is room for it there.
const right = () => cogs.filter(c => c.r === FIT[c.peg]).length; // how many pegs carry their own cog
function spares(placed) {
  if (!placed) tray = sheet(cut('<rect x="1140" y="656" width="438" height="230" rx="26" fill="#efe3c8"/>'), 'fresh', rank.works);
  cogs = (placed ? FIT.map((r, k) => [r, ...PEGS[k], k]) : LOOSE).map(([r, x, y, peg = null]) => {
    const g = piece(cogArt(r), x, y, r + 30);
    Object.assign(g, { r, peg, fixed: placed });
    carry(g, () => {
      const was = right(), k = PEGS.reduce((best, p, i) => (Math.hypot(g.pos[0] - p[0], g.pos[1] - p[1]) < Math.hypot(g.pos[0] - PEGS[best][0], g.pos[1] - PEGS[best][1]) ? i : best), 0), pos = PEGS[k];
      if (Math.hypot(g.pos[0] - pos[0], g.pos[1] - pos[1]) > 75 || cogs.some(c => c.peg === k)) return slide(g, x, y);
      if ([crank, link, RIM, ...cogs.filter(c => c.peg !== null)].some(b => apart({ pos }, b) < g.r + b.r - 3)) {
        knock();
        tell('That one is too big to sit there.');
        help.tried();
        return slide(g, x, y);
      }
      g.peg = k;
      put(g, ...pos);
      mesh();
      knock();
      right() > was ? help.again() : help.tried();
    }, () => ((g.peg = null), g.classList.remove('next')));
    return g;
  });
  mesh();
}

// Find the cogs that carry the turning from the handle to the great wheel; then wind the first evening and morning.
async function train() {
  works();
  await sleep(1400);
  tell('Day must turn to night, and night to day again. Press and hold the handle to wind the great wheel round.');
  const wound = dusk(), from = turned;
  await new Promise(tried => leap((stuck = tried))); // the first try goes nowhere
  stuck = null;
  spares();
  tell('The handle turns, but the turning does not reach the great wheel. Put a cog on each peg, so that the teeth of each one meet the next.');
  help = patience([
    () => tell('Begin by the handle. Which cog reaches from the nearest peg to the small cog beside the handle? Hold the handle to see how far the turning gets.'),
    () => cogs.find(c => c.r === FIT.find((r, k) => !cogs.some(c => c.peg === k && c.r === r))).classList.add('next'), // the cog for the first peg that lacks its own
  ], 3);
  leap(() => { // (the short cut: the right cog on every peg, and the wheel wound as far as it has to go)
    for (const c of cogs) c.peg = null;
    FIT.forEach((r, k) => (c => ((c.peg = k), put(c, ...PEGS[k])))(cogs.find(c => c.r === r && c.peg === null)));
    mesh();
    reached();
  });
  await when(() => turned > from + 2); // the great wheel has begun to move: the cogs are right
  help.stop();
  for (const c of cogs) (c.fixed = true), c.classList.remove('next');
  gone(tray);
  gone(cogs.find(c => c.peg === null));
  cogs = cogs.filter(c => c.peg !== null);
  solved();
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
  works(true);
  days(1);
}
export async function play() {
  music('void');
  await sleep(1600);
  await verse('In the beginning God created the heavens and the earth.', 'Genesis 1:1', 'none');
  await verse('The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters.', 'Genesis 1:2', 'none');
  const still = await stir();
  await verse('Then God said, “Let there be light”;', '', 'none');
  still();
  shine();
  music('light');
  await flash(() => (light(0.45), wheel.classList.add('on'))); // light, but not yet parted from the dark
  await verse('Then God said, “Let there be light”; and there was light.', 'Genesis 1:3');
  await divide();
  await verse('And God saw the light, that it was good; and God divided the light from the darkness.', 'Genesis 1:4');
  wheel.style.transform = SKY; // it sinks half behind the deep, and grows: the wheel of day and night
  days(0);
  await lighten(1, 3000);
  await verse('God called the light Day, and the darkness He called Night.', 'Genesis 1:5');
  await train();
  tell('');
  await sleep(1500);
  await verse('So the evening and the morning were the first day.', 'Genesis 1:5');
  days(1, true);
}
