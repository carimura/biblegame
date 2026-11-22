// The lie of the land. Scenes 3 onward are each built from a short description of their place,
// and share the same comings and goings.
import { scene, show, layer, plane, fx, clamp, control, arrive, lead, walk, sleep } from './engine.js';
import { rnd, cut, hills, olive, grasses, tufts } from './art.js';
import { music } from './audio.js';
import { cast, wonders } from './shared.js';

const STAR = 'M0,-10Q1.5,-1.5 10,0Q1.5,1.5 0,10Q-1.5,1.5 -10,0Q-1.5,-1.5 0,-10Z';
const CLOUD = 'M0,0q40,-28 92,-14q32,-26 84,-8q54,-10 74,14q22,12 -8,18h-236q-34,-4 -6,-10z';
const BIRD = (x, y, s, late) => `<g class="flier" transform="translate(${x},${y}) scale(${s})"><circle r="42" fill="transparent"/><g class="bird" style="animation-delay:${late}s"><path d="M-16,2Q0,-7 18,1Q2,7 -16,2Z"/><path class="wing" style="animation-delay:${late}s" d="M2,0Q-6,-20 -24,-26Q-8,-12 -6,2Z"/><path class="wing" style="animation-delay:${late}s" d="M4,0Q8,-22 26,-24Q12,-10 8,3Z"/></g></g>`;

// What moves in the sky. The clouds have a layer of their own that drifts slowly (they are drawn twice over, 2000
// apart, so the drift can go round for ever). And now and then three birds cross the sky.
export function aloft(clouds, birds) {
  if (clouds) layer(0, cut(clouds, 1) + `<g transform="translate(2000,0)">${cut(clouds, 1)}</g>`, 'drift', 0, 4000);
  if (birds) layer(0, `<g fill="#4f4a58" opacity=".85">${BIRD(270, 250, 1.5, 0) + BIRD(170, 300, 1.2, -0.2) + BIRD(110, 214, 1.05, -0.35)}</g>`, 'birds', 0, 400);
}

// sky: its colour; bands: four bands of paper from high to low; sun: [x, y, radius, colour]; moon: [x, y];
// stars: how many; clouds: their colour; far, ground: lists of colours, back to front; dark: a colour laid over
// everything for night, with a pool of light where the scene says; props, under, front: drawings for the ground,
// for a layer of their own beneath the actors (anything that moves), and for one in front of them.
export function land({ W, seed, sky, bands, sun, moon, stars = 0, clouds, far, haze, mid, near, ground, flowers = 200, trees = [], props = () => '', under = () => '', front = () => '', dark }) {
  const sc = scene(W, 0.8, 30), r = rnd(seed);
  const band = (y, amp, fill) => cut(`<path d="${hills(2000, y, amp, 300, r)}" fill="${fill}"/>`);
  const kit = {
    r,
    cut,
    tree: (x, y, s) => `<g class="tree" transform="translate(${x},${y})">${olive(r, s)}</g>`,
    rock: (x, y, s, fill = '#b9ad9c') => `<path transform="translate(${x},${y}) scale(${s})" d="M-30,0q-6,-22 12,-30q22,-10 36,6q12,12 6,24z" fill="${fill}"/>`,
  };

  layer(0,
    `<rect y="-200" width="2000" height="1100" fill="${sky}"/>` +
    (stars ? `<g class="stars">${cut(Array.from({ length: stars }, () => { const s = 0.5 + r() * 0.6; return `<g transform="translate(${(60 + r() * 1880) | 0},${(18 + r() * 96) | 0}) scale(${s.toFixed(2)})"><path class="tw" d="${STAR}" fill="#fdf1cf"/><circle r="${(26 / s) | 0}" fill="transparent"/></g>`; }).join(''), 1)}</g>` : '') +
    (moon ? `<g class="moon" transform="translate(${moon}) rotate(-24)">${cut('<path class="rock" d="M0,-36a36,36 0 1 0 26,61a29,29 0 1 1 -26,-61z" fill="#fdf1cf"/>', 1)}<circle cx="-4" r="48" fill="transparent"/></g>` : '') +
    band(140, 46, bands[0]) + band(232, 42, bands[1]) +
    (sun ? `<g class="sun" transform="translate(${sun[0]},${sun[1]})"><circle class="halo" r="${sun[2] * 2.7}" fill="${sun[3]}" opacity=".18"/><circle class="halo" r="${sun[2] * 1.8}" fill="${sun[3]}" opacity=".3"/>${cut(`<circle r="${sun[2]}" fill="${sun[3]}"/>`)}</g>` : '') +
    band(304, 36, bands[2]) +
    band(372, 24, bands[3]));
  aloft(clouds && [[240, 160, 1], [760, 108, 0.75], [1320, 268, 0.9], [560, 276, 0.6], [1740, 150, 0.7]].map(([x, y, s]) => `<path transform="translate(${x},${y}) scale(${s})" d="${CLOUD}" fill="${clouds}"/>`).join(''), sun);

  layer(0.12, cut(`<path d="${hills(2300, 404, 54, 320, r)}" fill="${far[0]}"/>`) + cut(`<path d="${hills(2300, 432, 40, 250, r)}" fill="${far[1]}"/>`), 'far');
  if (haze) fx(`background:linear-gradient(transparent 30%,${haze} 48%,transparent 66%)`);
  layer(0.3, cut(`<path d="${hills(2400, 560, 44, 330, r)}" fill="${mid}"/>`), 'mid', -84);
  layer(0.6, kit.tree(520 + r() * 300, 574, 0.4) + kit.tree(1500 + r() * 300, 568, 0.36) + cut(`<path d="${hills(2500, 568, 36, 400, r)}" fill="${near}"/>`), '', -80);

  const dots = Array.from({ length: flowers }, () => {
    const x = r() * W, y = r() < 0.3 ? 610 + r() * 40 : 760 + r() * 310;
    return `<circle cx="${x | 0}" cy="${y | 0}" r="${(4 + r() * 3) | 0}" fill="${['#cf4a3c', '#f6efe0', '#f2cf58', '#f6efe0'][(r() * 4) | 0]}"/>`;
  }).join('');
  plane(
    [[596, 20, 440], [786, 20, 560], [898, 18, 760], [1006, 16, 880]].map(([y, amp, step], i) => cut(`<path d="${hills(W, y, amp, step, r, 1100)}" fill="${ground[i]}"/>`)).join('') +
    props(kit) + trees.map(t => kit.tree(...t)).join('') +
    tufts((W / 14) | 0, W, 610, 1075, r, [0, 0, 0]) + cut(dots, 1));
  const below = plane(under(kit));
  const field = plane('', 'deep');
  const over = plane(front(kit));
  layer(1.5, grasses(W * 1.25, r), 'fore');
  if (dark) {
    fx(`background:${dark}`, 'dark');
    fx('', 'glow');
  }
  fx('background:radial-gradient(ellipse at 50% 45%,transparent 60%,rgba(30,40,50,.34) 100%)');
  wonders(sc.el, false); // these scenes have things to do low on the screen, where the poppies are
  return { sc, below, field, over };
}

// David may go anywhere on the grass.
export const roamer = W => (x, y) => [[clamp(x, 30, W - 40), clamp(y, 650, 1010)]];

// David walks into a scene with the flock behind him: from the left if he is going on, from the right if he has come back.
export function come(sc, field, find, side, song) {
  show(sc);
  music(song);
  field.append(cast.david, ...cast.flock);
  control(cast.david, find);
  arrive(side === 'right' ? sc.W - 220 : 220, 780);
  lead(cast.flock, side === 'right' ? 1 : -1);
}

// Send each sheep to its own spot [x, y, which way to face], one after another, and give it a pose once there.
export const gather = (spots, pose) =>
  Promise.all(cast.flock.map(async (s, i) => {
    await sleep(i * 450);
    await walk(s, spots[i][0], spots[i][1], 170);
    if (spots[i][2]) s.style.setProperty('--dir', spots[i][2]);
    if (pose) s.classList.add(pose);
  }));
// Up on their feet again, and following.
export function rise() {
  for (const s of cast.flock) s.classList.remove('grazing', 'resting');
  lead(cast.flock);
}
