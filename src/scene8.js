// Scene 8: home. "Surely goodness and mercy shall follow me All the days of my life; And I will dwell in the house of the LORD Forever."
// Nothing to solve. Lead the flock to the gate, count them in, learn the last line at the harp, and then the
// whole psalm fills the screen and is played straight through: Chapter 1 complete.
import { actor, exit, sleep, when, still, say, tell, hush, lead, walk, clamp, on, show, control, place, arrive, dissolve } from './engine.js';
import { land, come } from './land.js';
import { wall, rnd } from './art.js';
import { teach, psalm } from './harp.js';
import { finish } from './map.js';
import { cast, SONG, line, baa, counter, post } from './shared.js';

const W = 3000;
const GATE = [2538, 736]; // just outside the gateway
// The fold is walled all round. David and the flock stay outside it: he walks along its front or round its ends,
// never through it. Only the sheep go in, by the gateway, when they are counted home.
const LEFT = 1836, RIGHT = 2706, FRONT = 730;
const walled = (x, y) => x > LEFT && x < RIGHT && y < FRONT;
function find(x, y) {
  x = clamp(x, 30, W - 40);
  y = clamp(y, x > LEFT && x < RIGHT ? FRONT : 650, 1010);
  const [x0, y0] = cast.david.pos, pts = [], end = v => (v <= LEFT ? LEFT : v >= RIGHT ? RIGHT : 0);
  let through = false;
  for (let k = 1; k < 24; k++) through ||= walled(x0 + ((x - x0) * k) / 24, y0 + ((y - y0) * k) / 24);
  if (through) {
    const first = end(x0) || end(x);
    pts.push([first, FRONT]); // round the corner of the fold
    if (end(x) && end(x) !== first) pts.push([end(x), FRONT]); // and the far corner, if he is going right past it
  }
  pts.push([x, y]);
  return pts;
}

let sc, field, begun = false;

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 83,
    sky: '#3a3f78', bands: ['#5a5590', '#8b6f9e', '#c98a94', '#f0b98f'], sun: [1180, 356, 66, '#ffe9b0'], clouds: '#f3c3a6',
    far: ['#c2a9c6', '#ab98c0'], haze: 'rgba(255,205,160,.45)', mid: '#93a48f', near: '#7f9967',
    ground: ['#8fae62', '#84a85a', '#779e50', '#6b9447'], flowers: 150,
    trees: [[500, 640, 1.1], [1500, 636, 0.9]],
    // His father's house, and the back wall of the fold.
    props: ({ cut, r }) =>
      cut('<rect x="2700" y="430" width="250" height="180" rx="4" fill="#efe0c4"/><rect x="2740" y="372" width="120" height="62" rx="4" fill="#e6d4b6"/><rect x="2790" y="520" width="50" height="90" rx="6" fill="#8a6445"/><rect x="2870" y="470" width="34" height="40" rx="4" fill="#8a7a86"/><rect x="2778" y="392" width="26" height="30" rx="4" fill="#8a7a86"/>') +
      cut('<ellipse cx="2250" cy="632" rx="330" ry="42" fill="#dcc48c"/>') + wall(1900, 478, 740, 112, r),
  }));
  // The front wall, with the gateway at its right-hand end, and the two end walls (seen end-on). It stands on the
  // ground like everyone else, so whoever is outside is drawn in front of it and whoever is inside behind it.
  const r = rnd(84);
  actor(field, '', `<g transform="translate(0,-700)">${wall(1880, 604, 574, 96, r) + wall(2452, 550, 36, 150, r) + wall(2590, 550, 36, 150, r) + wall(1862, 478, 40, 222, r) + wall(2624, 478, 40, 222, r)}</g>`, 0, 700);
  sc.next = next;
  exit(sc, 'left', back, false);
}

export function enter(side) {
  come(sc, field, find, side, 'home');
  if (!begun) story();
  begun = true;
}

async function story() {
  const dv = cast.david, flock = cast.flock;
  sc.locked = true; // no wandering off while he explains
  post('Home');
  await sleep(1800);
  await say('Home! There is the fold, and my father’s house beyond it.');
  tell('Lead them to the gate, and we will count them in.');
  sc.locked = false;
  await when(() => on(sc) && Math.hypot(dv.pos[0] - GATE[0], dv.pos[1] - GATE[1]) < 220 && still());
  hush();
  sc.locked = true;
  lead([]);

  // In they go, one at a time, through the gateway and behind the wall.
  const count = counter();
  for (const [i, s] of flock.entries()) {
    await walk(s, 2538, 724, 200);
    await walk(s, 2538, 652, 200);
    count(s);
    baa(s, true);
    walk(s, 2400 - i * 100, 628 + (i % 2) * 6, 170);
    await sleep(500);
  }
  await sleep(2200);

  await say('Five. Every one is home. Not one is lost.');
  await say('Goodness and mercy have followed us all the way. Thank you for helping me today!');
  await say('Listen, this is the last part of my song. Then we will hear it whole…');
  await teach(line(6), SONG[6].ref, null); // no reading back of this line alone: straight on to the whole psalm
  finish('shepherd'); // the map will show this story in its colours
  // The whole psalm, played straight through. As each line begins, the little window looks back at the scene it
  // belongs to (`sc.next`, from main.js); for the last line it comes home, to everyone just where they are now.
  const here = [dv, ...flock].map(a => [a, ...a.pos]);
  await psalm(SONG, n => n < 6 ? sc.next(n) : dissolve(() => {
    show(sc);
    field.append(dv, ...flock);
    control(dv, find);
    lead([]);
    for (const [a, x, y] of here) (place(a, x, y), a.classList.remove('walk'));
    arrive(...dv.pos);
  })); // a click at the end goes back to the map
  location.href = location.pathname;
}
