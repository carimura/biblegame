// Scene 1: the sheepfold at dawn. "The LORD is my shepherd; I shall not want."
import { scene, show, layer, plane, fx, actor, glide, walk, smooth, clamp, say, tell, hush, speaker, hint, wonder, sleep, tap, when, control, roam, free, still, go, spot, arrive, lead, exit, IN } from './engine.js';
import { rnd, cut, ridge, hills, wall, WICKET, olive, grasses, tufts, sheep, david } from './art.js';
import { pluck, blip, creak, music, STRINGS } from './audio.js';
import { teach } from './harp.js';
import { cast, SONG, line, baa, counter, wonders } from './shared.js';
import { aloft } from './land.js';

const W = 3200; // four screens of ground, at the size it is drawn

// Where each sheep sleeps in the fold, and where it goes to graze.
const FLOCK = [
  ['Barley', 380, 628, 1150, 742],
  ['Fig', 480, 622, 1290, 778],
  ['Olive', 580, 630, 1410, 735],
  ['Honey', 680, 624, 1520, 772],
];
const PIP = [262, 630, 1235, 712]; // out of sight behind the hay

let sc, inside, outside, flock, lamb, dv, gate, count;
let opened = false; // the gate
let limit = 1950; // how far right David may walk; the land opens up once the song has begun

// ---- Where David may walk ----
// Outside he has the ground in front of the fold and to its right. The fold itself is a block he must go round,
// and its only way in is the gate: down to the gateway, then through. (`CORNER` is just clear of its right-hand end wall.)
const CORNER = [990, 716], GATEWAY = [868, 724], THRESHOLD = [838, 656];
const isIn = () => dv.parentNode === inside;
const nearGate = () => !isIn() && Math.hypot(dv.pos[0] - 915, dv.pos[1] - 716) < 110;

function toOutside(x, y) {
  x = clamp(x, 40, limit);
  y = clamp(y, x < CORNER[0] ? CORNER[1] : 650, 1010);
  const pts = [];
  let [x0, y0] = dv.pos;
  if (isIn()) pts.push([...THRESHOLD, () => outside.append(dv)]);
  if (isIn() || (x0 < CORNER[0] && y0 < CORNER[1])) {
    pts.push(GATEWAY); // in the gateway: come straight out first
    [x0, y0] = GATEWAY;
  }
  // Going round the end of the fold: don't cut its corner.
  if (x0 < CORNER[0] !== x < CORNER[0] && y0 + ((y - y0) * (CORNER[0] - x0)) / (x - x0) < CORNER[1]) pts.push(CORNER);
  pts.push([x, y]);
  return pts;
}

function toInside(x) {
  const pts = isIn() ? [] : [...toOutside(...GATEWAY), [...THRESHOLD, () => inside.append(dv)]];
  pts.push([clamp(x, 370, 800), 642]);
  return pts;
}

export function build(onward) {
  sc = scene(W, 0.8, 30); // the ground is drawn at four-fifths size, with the horizon high, so there is room to roam
  sc.hold = 0; // the camera stays on the fold until the flock is gathered
  const r = rnd(11);
  const band = (y, amp, fill) => cut(`<path d="${hills(2000, y, amp, 300, r)}" fill="${fill}"/>`);
  const star = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><path class="tw" d="M0,-10Q1.5,-1.5 10,0Q1.5,1.5 0,10Q-1.5,1.5 -10,0Q-1.5,-1.5 0,-10Z" fill="#fdf1cf"/><circle r="${28 / s}" fill="transparent"/></g>`;
  const cloud = (x, y, s, fill) => `<path transform="translate(${x},${y}) scale(${s})" d="M0,0q40,-28 92,-14q32,-26 84,-8q54,-10 74,14q22,12 -8,18h-236q-34,-4 -6,-10z" fill="${fill}"/>`;
  const house = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}"/><rect x="${x + w * 0.4}" y="${y + 9}" width="7" height="11" rx="2" fill="#8a7a86"/>`;
  const cypress = (x, y, h) => `<path d="M${x},${y}q${-h * 0.2},${-h * 0.45} 0,${-h}q${h * 0.2},${h * 0.55} 0,${h}z" fill="#5b7560"/>`;
  const rock = (x, y, s) => `<path transform="translate(${x},${y}) scale(${s})" d="M-30,0q-6,-22 12,-30q22,-10 36,6q12,12 6,24z" fill="#b9ad9c"/>`;
  const tree = (x, y, s) => `<g class="tree" transform="translate(${x},${y})">${olive(r, s)}</g>`;

  // Sky: stacked bands of paper, night at the top, dawn at the bottom.
  layer(0,
    `<rect y="-200" width="2000" height="1100" fill="#2c3868"/>
    <g class="stars">${cut([[140, 56, 1], [420, 82, 0.7], [760, 46, 0.8], [1060, 74, 0.6], [1320, 58, 1], [590, 26, 0.5], [1180, 30, 0.7]].map(a => star(...a)).join(''), 1)}</g>
    <g class="moon" transform="translate(1425,66) rotate(-24)">${cut('<path class="rock" d="M0,-36a36,36 0 1 0 26,61a29,29 0 1 1 -26,-61z" fill="#fdf1cf"/>', 1)}<circle cx="-4" r="48" fill="transparent"/></g>
    ${band(124, 44, '#434a80')}${band(200, 44, '#6a6197')}${band(264, 40, '#a0789b')}${band(318, 36, '#d5938d')}
    ${band(362, 26, '#f0b98f')}
    <g class="sun" transform="translate(450,388)"><circle class="halo" r="210" fill="#ffe9b0" opacity=".13"/><circle class="halo" r="138" fill="#ffe9b0" opacity=".24"/>${cut('<circle r="74" fill="#fff3cc"/>')}</g>
    ${band(412, 18, '#fadcab')}`);
  aloft(cloud(980, 250, 1, '#f3c3a6') + cloud(170, 290, 0.8, '#e9b3a4') + cloud(1290, 312, 0.65, '#f7d2b0') + cloud(1700, 270, 0.7, '#f3c3a6'), true);

  layer(0.12, cut(`<path d="${hills(2300, 410, 50, 330, r)}" fill="#c9afcd"/>`) + cut(`<path d="${hills(2300, 436, 36, 260, r)}" fill="#b09cc3"/>`), 'far');
  fx('background:linear-gradient(transparent 27%,rgba(255,216,170,.5) 47%,transparent 68%)');

  // A village on the far hill, and cypress trees.
  layer(0.3,
    cut([house(1440, 522, 44, 40, '#e9d9bd'), house(1480, 505, 46, 60, '#efe0c4'), house(1520, 488, 56, 80, '#e2cfae'), house(1572, 500, 44, 70, '#f3e6cc'), house(1612, 512, 50, 50, '#e6d4b6')].join(''), 1) +
    cut([cypress(300, 556, 76), cypress(336, 560, 58), cypress(905, 572, 66), cypress(1395, 560, 62), cypress(1705, 548, 70)].join(''), 1) +
    cut(`<path d="${ridge([[-60, 575], [250, 540], [520, 585], [820, 552], [1150, 590], [1450, 540], [1620, 528], [1800, 550], [2140, 585], [2420, 560]])}" fill="#96a892"/>`), 'mid', -85);

  layer(0.6,
    tree(1840, 585, 0.4) + tree(2060, 560, 0.34) +
    cut(`<path d="${ridge([[-60, 560], [300, 585], [700, 548], [1100, 580], [1500, 555], [1900, 590], [2250, 545], [2620, 570]])}" fill="#7f9967"/>`), '', -78);

  // The ground, the path from the gate over the hill, the back of the fold and the olive tree.
  const flowers = Array.from({ length: 46 }, () => {
    const x = r() * W, y = r() < 0.5 ? 606 + r() * 40 : 780 + r() * 290;
    return x > 150 && x < 960 && y < 700 ? '' : `<circle cx="${x | 0}" cy="${y | 0}" r="${(4 + r() * 3) | 0}" fill="${r() < 0.7 ? '#cf4a3c' : '#f6efe0'}"/>`;
  }).join('');
  plane(
    cut(`<path d="${ridge([[-40, 588], [400, 580], [900, 592], [1300, 604], [1700, 618], [2100, 602], [2500, 614], [2900, 588], [3240, 600]], 1100)}" fill="#8fae62"/>`) +
    cut('<path d="M786,640L896,640C900,668 960,676 1040,676S1220,678 1300,674S2100,660 2500,664S2880,640 2990,590L3050,592C2990,680 2820,730 2500,736S1400,750 1150,746S800,745 786,640Z" fill="#e7d2a4"/>') +
    cut('<ellipse cx="480" cy="628" rx="340" ry="44" fill="#dcc48c"/>') +
    wall(170, 474, 766, 114, r) +
    tree(1250, 640, 1.15) + tree(2330, 632, 0.9) +
    cut(rock(1385, 652, 1) + rock(1990, 650, 0.8) + rock(2760, 640, 1.2), 1) +
    cut(`<path d="${ridge([[-40, 782], [450, 768], [1000, 790], [1600, 774], [2200, 792], [2750, 770], [3240, 784]], 1100)}" fill="#84a85a"/>`) +
    cut(`<path d="${ridge([[-40, 896], [600, 884], [1300, 900], [2000, 886], [2700, 902], [3240, 888]], 1100)}" fill="#779e50"/>`) +
    cut(`<path d="${ridge([[-40, 1008], [700, 996], [1500, 1012], [2400, 998], [3240, 1010]], 1100)}" fill="#6b9447"/>`) +
    tufts(70, W, 606, 880, r, [140, 960, 705]) + tufts(90, W, 880, 1075, rnd(31), [0, 0, 0]) +
    cut(flowers, 1));

  // Inside the fold, behind its front wall: the sleeping flock, and Pip behind the hay.
  inside = plane('<rect id="fold" x="170" y="474" width="730" height="224" fill="transparent"/>');
  flock = FLOCK.map(([name, x, y]) => actor(inside, 'sheep asleep', sheep(name), x, y));
  lamb = actor(inside, 'sheep lamb', sheep('Pip', 0.66), PIP[0], PIP[1]);
  actor(inside, '', cut('<path d="M172,660Q186,578 250,554Q302,544 326,586Q342,622 340,660Z" fill="#dcbd68"/><path d="M205,640q10,-40 40,-62M250,646q4,-44 22,-70M292,644q-2,-30 12,-50" fill="none" stroke="#c4a34e" stroke-width="4" stroke-linecap="round"/>', 1), 0, 0);

  // The front wall, with the gate in it, and the two end walls (seen end-on), which close the fold at its sides.
  // (The end walls have numbers of their own, so that adding them changed nothing drawn after them.)
  const front = plane(
    wall(150, 602, 594, 96, r) + wall(742, 548, 36, 150, r) + wall(900, 548, 36, 150, r) + wall(132, 478, 40, 222, rnd(12)) + wall(934, 478, 40, 222, rnd(13)) +
    `<g transform="translate(778,575)"><g id="gate">${WICKET}</g></g>`);
  gate = front.querySelector('#gate');

  // Outside the fold, in front of the wall.
  outside = plane('', 'deep');
  dv = cast.david = actor(outside, 'david', david(), 1090, 668);

  layer(1.5, grasses(4000, r), 'fore');
  fx('background:radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(30,20,55,.5) 100%)');

  wonders(sc.el);
  count = counter();

  // The gate opens only when David is standing by it. From further off, a click on it walks him over.
  gate.addEventListener('pointerdown', e => {
    if (!free()) return;
    e.stopPropagation();
    if (!nearGate()) return go(toOutside(932, 716));
    opened = true;
    gate.classList.add('open');
    creak();
  });
  // Once it is open, a click inside the fold walks him in through it.
  inside.querySelector('#fold').addEventListener('pointerdown', e => {
    if (!free() || !opened) return;
    e.stopPropagation();
    go(toInside(spot(e)[0]));
  });

  sc.onward = onward;
  show(sc);
}

// Jump past this scene, for starting the game further on: the gate open, the flock out and following.
export function skip() {
  opened = true;
  gate.classList.add('open');
  cast.flock = [...flock, lamb];
  for (const s of cast.flock) {
    s.classList.remove('asleep');
    outside.append(s);
    wonder(s, null, () => baa(s)); // a sheep answers a click with a bleat and a hop
  }
  speaker(dv);
  limit = W - 30;
  delete sc.hold;
  exit(sc, 'right', sc.onward);
}

// Coming back from the pastures: in from the right, flock behind.
export function enter() {
  show(sc);
  music('fold');
  outside.append(dv, ...cast.flock);
  control(dv, toOutside);
  arrive(W - IN, 780);
  lead(cast.flock, 1);
}

// A sheep in the fold walks to the gate, out through it, and along the path to (x, y).
async function leave(s, x, y) {
  await walk(s, 838, 652);
  outside.append(s); // now in front of the wall
  count(s);
  await walk(s, ...GATEWAY);
  await walk(s, x, y);
  s.classList.remove('named');
  wonder(s, null, () => baa(s)); // a sheep answers a click with a bleat and a hop
}

async function call(s, i) {
  s.classList.remove('asleep', 'live');
  s.classList.add('named');
  pluck(STRINGS[i]);
  sleep(350).then(() => baa(s, true)); // it answers, with its name still showing
  await sleep(800);
  await leave(s, FLOCK[i][3], FLOCK[i][4]);
}

export async function play() {
  control(dv, toOutside);
  speaker(dv);
  await say('Good morning! I’m David. I look after my father’s sheep.');
  await say('Today I am taking them over the hills, to good grass and water. Will you come and help me look after them?');
  await say('As we walk I’ll teach you a song I am making. It is about the Lord, who looks after me just as I look after them.');
  await say('My sheep are still asleep in their pen. Our first job is to bring them out!');

  roam(true);
  tell('Click where you want me to walk. Let’s go to the gate.');
  let stop = hint(outside, 839, 633, 6000);
  await when(nearGate);
  stop();
  tell('Here we are! Click the gate to open it.');
  stop = hint(outside, 839, 633);
  await when(() => opened);
  stop();
  await sleep(1200);
  tell('Now wake them and call them out of the pen. Click each sleeping sheep!');
  await Promise.all(flock.map((s, i) => {
    s.classList.add('live');
    const unring = hint(outside, s.pos[0], s.pos[1] - 40, 1500); // a ring on each one still to be called
    return tap(s).then(() => (unring(), call(s, i)));
  }));

  tell('One, two, three, four… One is missing! Where is little Pip? Let’s look inside the pen.');
  stop = hint(outside, 560, 612, 7000);
  await when(() => isIn() && still());
  stop();

  blip(990, 0.15); // Pip pops up from behind the hay
  baa(lamb, true);
  await glide(lamb, 262, 552, 260, smooth);
  lamb.classList.add('named', 'live');
  tell('There she is, behind the hay! Click her to call her out.');
  stop = hint(outside, 285, 522, 6000);
  await tap(lamb);
  stop();
  hush();
  lamb.classList.remove('live');
  pluck(STRINGS[4]);
  sleep(350).then(() => baa(lamb, true));
  await glide(lamb, 318, 536, 280, smooth); // a hop over the hay
  isIn() ? inside.insertBefore(lamb, dv) : inside.append(lamb);
  await walk(lamb, 360, 626);
  await leave(lamb, PIP[2], PIP[3]);

  await say('Five! Every one is here. Not one is lost.');
  // (Said here, with the first job done and nothing pressing, and it waits: there is time to try them.)
  await say('Every place we come to has things you can click as well.');
  await say('Try it! Click the tree, the moon, or the flowers.');
  await say('Now listen. This is how my song begins…');
  await teach(line(0), SONG[0].ref);
  music('fold');
  await say('That’s the start of our song!');
  await say('Green pastures are just over the hill. Lead the way, and the flock will follow.');

  // From here the flock follows David, and the way on is open.
  const far = s => Math.hypot(s.pos[0] - dv.pos[0], s.pos[1] - dv.pos[1]);
  cast.flock = [...flock, lamb].sort((a, b) => far(a) - far(b));
  lead(cast.flock);
  limit = W - 30;
  delete sc.hold;
  exit(sc, 'right', sc.onward);
}
