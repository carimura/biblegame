// Scene 8: home. "Surely goodness and mercy shall follow me All the days of my life; And I will dwell in the house of the LORD Forever."
// Lead the flock to the gate and open its picture lock (the key is the song), count them in, learn the last line
// at the harp, and then the whole psalm fills the screen and is played straight through: Chapter 1 complete.
import { actor, exit, sleep, when, still, go, say, tell, hush, lead, walk, clamp, on, show, control, place, arrive, dissolve, overlay } from './engine.js';
import { land, come } from './land.js';
import { wall, WICKET, cut, rnd } from './art.js';
import { creak, knock } from './audio.js';
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

let sc, field, door, begun = false;

// The gate is tied shut with a picture lock, and the key is the song: four lines of it, each with a word left out
// and a wheel in its place, showing a picture with its word. A click turns a wheel to its next picture, and it can
// always be turned on, right or not: nothing says a line is right until all four are, and then the gate opens.
// (Picture n finishes line n.) For anyone stuck, after a while the lines that are right turn green.
const sky = fill => `<rect x="-60" y="-60" width="120" height="120" fill="${fill}"/>`;
const PICTURES = [
  sky('#bfe0ec') + cut('<path d="M-60,60V4Q-22,-24 20,-2Q42,8 60,0V60Z" fill="#5fae4c"/>', 1) + [[-30, 20], [-8, 34], [16, 18], [36, 36], [-40, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fbf7ea"/>`).join(''),
  sky('#cfe6ee') + cut('<path d="M-60,60V-6Q0,-18 60,-6V60Z" fill="#4f9fc4"/>', 1) + '<path d="M-38,10h34M6,26h36M-24,42h30" stroke="#bfe3f0" stroke-width="5" stroke-linecap="round"/><path d="M-44,-4q-2,-18 2,-34M-36,-4q2,-14 8,-24M42,-4q2,-18 -2,-32" fill="none" stroke="#4f8a4c" stroke-width="4" stroke-linecap="round"/>',
  sky('#2c2648') + '<path d="M0,-44Q2,-34 12,-32Q2,-30 0,-20Q-2,-30 -12,-32Q-2,-34 0,-44Z" fill="#fdf1cf"/>' + cut('<path d="M-60,60V-28L-36,-46L-6,60Z" fill="#4f4a5e"/><path d="M60,60V-34L32,-50L4,60Z" fill="#5a5568"/>', 1),
  sky('#f6e3b4') + cut('<path d="M-26,-24H26L18,40H-18Z" fill="#b98c62"/>', 1) + '<path d="M-24,-22H24L22,-6H-22Z" fill="#5fb1d2"/><path d="M-29,-24q-10,20 -7,48M29,-24q10,20 7,48M-8,-26v-12M10,-26v-14" fill="none" stroke="#5fb1d2" stroke-width="6" stroke-linecap="round"/>',
];
const WORDS = ['green pastures', 'still waters', 'valley', 'cup'];
const LINES = [['He makes me to lie down in', ''], ['He leads me beside the', ''], ['Yea, though I walk through the', ''], ['My', 'runs over.']];
const lock = overlay(`<div class="lock card"><h3>The key is our song</h3>${LINES.map(([before, after]) => `<p><span>${before}</span><b class="tumbler"><svg viewBox="-60 -60 120 120"></svg><i></i></b><span>${after}</span></p>`).join('')}<small>click a picture to change it. Finish all four lines of the song, and the gate will open</small></div>`);
async function unlock() {
  const card = lock.firstChild, rows = [...lock.querySelectorAll('p')], at = [1, 2, 3, 0]; // every wheel starts on a wrong picture
  const draw = () => rows.forEach((row, i) => {
    row.querySelector('svg').innerHTML = PICTURES[at[i]];
    row.querySelector('i').textContent = WORDS[at[i]];
    row.classList.toggle('got', at[i] === i);
  });
  draw();
  lock.classList.add('on');
  const help = setTimeout(() => card.classList.add('told'), 40000);
  await new Promise(done => (lock.onpointerdown = e => {
    const wheel = e.target.closest('.tumbler'), i = rows.indexOf(wheel?.parentNode);
    e.stopPropagation(); // the picture clicked is redrawn, and a click on something gone would be taken for one on the ground
    if (i < 0) return;
    at[i] = (at[i] + 1) % 4;
    knock();
    draw();
    wheel.classList.remove('spin');
    wheel.getBoundingClientRect(); // restart its turn
    wheel.classList.add('spin');
    if (at.every((a, i) => a === i)) done();
  }));
  lock.onpointerdown = null;
  clearTimeout(help);
  card.classList.add('told');
  await sleep(1800);
  lock.classList.remove('on');
}

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 83,
    sky: '#3a3f78', bands: ['#5a5590', '#8b6f9e', '#c98a94', '#f0b98f'], sun: [1180, 356, 66, '#ffe9b0'], clouds: '#f3c3a6',
    far: ['#c2a9c6', '#ab98c0'], haze: 'rgba(255,205,160,.45)', mid: '#93a48f', near: '#7f9967',
    // The village on the hill, among cypress trees.
    back: ({ cut, cypress, house }) => cut(house(300, 520, 44, 60, '#e9d9bd') + house(340, 502, 46, 80, '#efe0c4') + house(384, 486, 56, 96, '#e2cfae') + house(438, 500, 44, 80, '#f3e6cc') + house(480, 514, 48, 64, '#e6d4b6'), 1) +
      cut([[250, 566, 76], [560, 566, 62], [900, 570, 70], [1480, 560, 66], [1530, 566, 50]].map(([x, y, h]) => cypress(x, y, h)).join(''), 1),
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
  door = actor(field, '', `<g transform="translate(0,-700)">${wall(1880, 604, 574, 96, r) + wall(2452, 550, 36, 150, r) + wall(2590, 550, 36, 150, r) + wall(1862, 478, 40, 222, r) + wall(2624, 478, 40, 222, r)}<g transform="translate(2488,578) scale(.836,1)"><g class="gate">${WICKET}</g></g></g>`, 0, 700).querySelector('.gate');
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
  go(find(GATE[0] + 150, 780)); // he steps aside, so the gate can be seen
  await when(still);
  await say('The gate is tied shut with my father’s picture lock. I know the key: it is our song!');
  await unlock();
  door.classList.add('open');
  creak();
  await sleep(1700);
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
    for (const [a, x, y] of here) (place(a, x, y), a.classList.remove('walk', 'grazing'));
    arrive(...dv.pos);
  })); // a click at the end goes back to the map
  location.href = location.pathname;
}
