// Scene 2: green pastures. "He makes me to lie down in green pastures."
// The flock is hungry. Not all grass is good grass: find the clover, let them eat, then settle each one.
import { scene, show, layer, plane, fx, clamp, control, arrive, lead, exit, sleep, walk, when, still, go, say, tell, on, place, IN } from './engine.js';
import { rnd, cut, ridge, hills, olive, grasses, tufts } from './art.js';
import { music, munch } from './audio.js';
import { teach } from './harp.js';
import { cast, SONG, line, baa, counter, post, wonders } from './shared.js';
import { aloft } from './land.js';

const W = 3000;

// Three places to stop, each [x, y, how wide, how deep]: only the last is worth staying in.
const THIN = [820, 850, 340, 150], THISTLES = [1680, 860, 300, 150], CLOVER = [2560, 850, 400, 170];
const within = ([cx, cy, rx, ry], g) => ((g.pos[0] - cx) / rx) ** 2 + ((g.pos[1] - cy) / ry) ** 2 < 1;
// Where each sheep settles to graze, from the middle of the clover.
const GRAZE = [[-250, -50], [-110, 70], [50, -70], [190, 50], [310, -30]];

let sc, field, begun = false;

export function build(next, back) {
  sc = scene(W, 0.8, 30); // the ground is drawn at four-fifths size, with the horizon high, so there is room to roam
  const r = rnd(23);
  const band = (y, amp, fill) => cut(`<path d="${hills(2000, y, amp, 300, r)}" fill="${fill}"/>`);
  const cloud = (x, y, s) => `<path transform="translate(${x},${y}) scale(${s})" d="M0,0q40,-28 92,-14q32,-26 84,-8q54,-10 74,14q22,12 -8,18h-236q-34,-4 -6,-10z" fill="#fffaf0"/>`;
  const cypress = (x, y, h) => `<path d="M${x},${y}q${-h * 0.2},${-h * 0.45} 0,${-h}q${h * 0.2},${h * 0.55} 0,${h}z" fill="#5f8a63"/>`;
  const tree = (x, y, s) => `<g class="tree" transform="translate(${x},${y})">${olive(r, s)}</g>`;
  const rock = (x, y, s) => `<path transform="translate(${x},${y}) scale(${s})" d="M-30,0q-6,-22 12,-30q22,-10 36,6q12,12 6,24z" fill="#c2b7a4"/>`;
  const patch = ([cx, cy, rx, ry], fill, grow = 1) => cut(`<ellipse cx="${cx}" cy="${cy}" rx="${rx * grow}" ry="${ry * 0.7 * grow}" fill="${fill}"/>`);
  // Scatter `n` of something over a place.
  const strew = (n, [cx, cy, rx, ry], draw) =>
    Array.from({ length: n }, () => {
      const a = r() * 6.28, d = Math.sqrt(r()) * 0.9;
      return draw((cx + Math.cos(a) * d * rx) | 0, (cy + Math.sin(a) * d * ry * 0.7) | 0);
    }).join('');
  const dryTuft = (x, y) => `<path d="M${x - 8},${y}q-2,-9 -6,-13q7,3 8,9q0,-10 4,-16q4,7 3,16q3,-6 9,-9q-3,5 -5,13z" fill="#cdc98c"/>`;
  const thistle = (x, y) => `<path d="M${x},${y}v-44" stroke="#5c8a4a" stroke-width="5"/><path d="M${x - 17},${y - 12}l17,-11l17,11l-11,-19l-6,-13l-6,13z" fill="#5c8a4a"/><circle cx="${x}" cy="${y - 50}" r="11" fill="#8f66a8"/><path d="M${x - 10},${y - 56}l4,-13l6,9l6,-9l4,13z" fill="#b58acb"/>`;
  const blossom = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="#fbf7ea"/><circle cx="${x + 9}" cy="${y + 4}" r="5" fill="#fbf7ea"/><circle cx="${x - 7}" cy="${y + 6}" r="5" fill="#f4dfe6"/>`;

  // A clear morning sky.
  layer(0,
    `<rect y="-200" width="2000" height="1100" fill="#8fbfdc"/>
    ${band(140, 46, '#a6cde3')}${band(232, 42, '#bfdbe8')}
    <g class="sun" transform="translate(1180,168)"><circle class="halo" r="170" fill="#fff3c4" opacity=".2"/><circle class="halo" r="112" fill="#fff3c4" opacity=".32"/>${cut('<circle r="62" fill="#fff8dc"/>')}</g>
    ${band(304, 36, '#d8e8e6')}
    ${band(372, 24, '#f3efd6')}`);
  aloft(cloud(240, 160, 1) + cloud(760, 108, 0.75) + cloud(1320, 268, 0.9) + cloud(560, 276, 0.6) + cloud(1740, 150, 0.7), true);

  layer(0.12, cut(`<path d="${hills(2300, 404, 54, 320, r)}" fill="#b7d4b4"/>`) + cut(`<path d="${hills(2300, 432, 40, 250, r)}" fill="#a2c99b"/>`), 'far');
  fx('background:linear-gradient(transparent 30%,rgba(255,244,205,.42) 48%,transparent 66%)');

  layer(0.3,
    cut([cypress(360, 562, 70), cypress(1010, 566, 62), cypress(1052, 570, 48), cypress(1500, 548, 72)].join(''), 1) +
    cut(`<path d="${ridge([[-60, 560], [260, 582], [560, 540], [900, 578], [1240, 548], [1560, 530], [1900, 570], [2400, 548]])}" fill="#93c47f"/>`), 'mid', -84);

  layer(0.6,
    tree(520, 572, 0.42) + tree(1580, 566, 0.36) +
    cut(`<path d="${ridge([[-60, 578], [320, 548], [720, 584], [1120, 552], [1560, 586], [2000, 556], [2260, 570], [2520, 560]])}" fill="#82bb69"/>`), '', -80);

  // The ground: the path in from the fold, then thin dry grass, then thistles, then deep clover at the far end.
  const flowers = Array.from({ length: 260 }, () => {
    const x = r() * W, y = r() < 0.3 ? 610 + r() * 40 : 760 + r() * 310;
    return within(THIN, { pos: [x, y] }) ? '' : `<circle cx="${x | 0}" cy="${y | 0}" r="${(4 + r() * 3) | 0}" fill="${['#cf4a3c', '#f6efe0', '#f2cf58', '#f6efe0'][(r() * 4) | 0]}"/>`;
  }).join('');
  plane(
    cut(`<path d="${ridge([[-40, 596], [420, 584], [860, 604], [1300, 588], [1760, 606], [2200, 590], [2640, 604], [3040, 592]], 1100)}" fill="#7dba5c"/>`) +
    cut('<path d="M-40,676C200,664 420,690 700,690S1080,706 1160,716L1150,738C1000,744 700,760 420,752S120,744 -40,750Z" fill="#e7d2a4"/>') +
    tree(1450, 640, 1.2) + tree(420, 626, 0.8) + tree(2760, 648, 1.25) +
    cut(`<path d="${ridge([[-40, 786], [500, 772], [1100, 794], [1700, 776], [2400, 792], [3040, 778]], 1100)}" fill="#72b054"/>`) +
    cut(`<path d="${ridge([[-40, 900], [700, 886], [1500, 904], [2300, 888], [3040, 900]], 1100)}" fill="#67a64b"/>`) +
    cut(`<path d="${ridge([[-40, 1010], [800, 996], [1700, 1014], [3040, 1000]], 1100)}" fill="#5c9b43"/>`) +
    patch(THIN, '#b9c680') + cut(rock(640, 880, 0.9) + rock(900, 800, 0.7) + rock(1010, 905, 1) + rock(760, 930, 0.6), 1) + cut(strew(16, THIN, dryTuft), 1) +
    patch(THISTLES, '#8cb563') + cut(strew(13, THISTLES, thistle), 1) +
    patch(CLOVER, '#4f9c40') + patch(CLOVER, '#5fae4c', 0.72) + cut(strew(60, CLOVER, blossom), 1) +
    tufts(220, W, 610, 1075, r, [THIN[0] - THIN[2], THIN[0] + THIN[2], 2000]) + // none where the grass is thin
    cut(flowers, 1));

  field = plane('', 'deep');
  layer(1.5, grasses(3300, r), 'fore');
  fx('background:radial-gradient(ellipse at 50% 45%,transparent 60%,rgba(30,50,40,.32) 100%)');

  wonders(sc.el);
  sc.next = next;
  exit(sc, 'left', back, false); // you can walk back to the fold, but nothing points that way
}

// Anywhere on the grass.
const find = (x, y) => [[clamp(x, 30, W - 40), clamp(y, 650, 1010)]];

// In from the fold on the left, or back from the waters on the right, flock behind.
export function enter(side, look) {
  show(sc);
  music('pastures');
  field.append(cast.david, ...cast.flock);
  control(cast.david, find);
  arrive(side === 'right' ? W - IN : IN, 780);
  lead(cast.flock, side === 'right' ? 1 : -1);
  if (look) return; // only looked back at, from the ending: nothing begins
  if (!begun) story();
  begun = true;
}

// Looked back at, from the ending: the flock in the clover, eating, then lying down one by one.
export function look() {
  lead([]);
  cast.flock.forEach((s, i) => {
    place(s, CLOVER[0] + GRAZE[i][0], CLOVER[1] + GRAZE[i][1]);
    s.classList.add('grazing');
    setTimeout(() => s.classList.replace('grazing', 'resting'), 2400 + i * 700);
  });
}

async function story() {
  const dv = cast.david, flock = cast.flock;
  sc.locked = true; // no wandering off while he explains
  post('Green pastures');
  await sleep(1800);
  await say('Green pastures! The flock is hungry after the walk.');
  await say('But not all grass is good grass. Let’s find the best for them.');
  sc.locked = false;

  // Look around. David says what he makes of each place he stops, until he stops in the clover.
  const seen = new Set();
  for (;;) {
    await when(() => on(sc) && still() && (within(CLOVER, dv) || [THIN, THISTLES].some(p => within(p, dv) && !seen.has(p))));
    if (within(CLOVER, dv)) break;
    const here = within(THIN, dv) ? THIN : THISTLES;
    seen.add(here);
    if (here === THIN) tell('The grass here is thin and dry. They would still be hungry. Let’s look further on.');
    else {
      baa(flock[0], true);
      tell('Thistles! They would prickle the sheep’s noses. Not here.');
    }
  }

  // The flock stops following and spreads out to eat.
  tell('Deep, sweet clover! Eat up, little ones.');
  sc.locked = true; // no leaving while the flock is busy here
  lead([]);
  const chewing = setInterval(munch, 430);
  await Promise.all(flock.map(async (s, i) => {
    await sleep(i * 450);
    await walk(s, clamp(CLOVER[0] + GRAZE[i][0], 60, W - 60), CLOVER[1] + GRAZE[i][1], 170);
    s.classList.add('grazing');
  }));
  await sleep(4500);

  // A full sheep still will not lie down until its shepherd comes close. Each one answers a click only when he is near.
  await say('They have eaten their fill.');
  tell('But a sheep only lies down when it feels safe, with its shepherd close by. Walk to each one and pet it.');
  const count = counter();
  await Promise.all(flock.map(s => new Promise(done => {
    s.task = () => {
      if (Math.hypot(s.pos[0] - dv.pos[0], s.pos[1] - dv.pos[1]) > 175) return go(find(s.pos[0] - 95, s.pos[1] + 14));
      s.task = null;
      s.classList.replace('grazing', 'resting');
      baa(s, true);
      count(s);
      done();
    };
  })));
  clearInterval(chewing);
  await sleep(1700);

  await say('All five, lying down in green pastures. They have all they need, and their shepherd is near.');
  await say('That is how the Lord cares for me. Listen, this is the next part of my song…');
  await teach(line(1), SONG[1].ref, 1);

  for (const s of flock) s.classList.remove('resting');
  lead(flock);
  sc.locked = false;
  await say('They will be thirsty now. Still waters are not far from here.');
  exit(sc, 'right', sc.next);
}
