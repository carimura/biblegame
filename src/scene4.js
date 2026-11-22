// Scene 4: the lost sheep. "He restores my soul; He leads me in the paths of righteousness For His name's sake."
// Pip has wandered off. Listen for her and follow the wool on the thorns (some thickets have none: not that way).
// Find her, let her run out and jump into David's arms, and carry her back. Then the glad flock sings the next line.
import { actor, place, exit, sleep, when, still, say, tell, hush, reach, go, roam, lead, walk, tween, smooth, apart } from './engine.js';
import { land, come, roamer } from './land.js';
import { bleat, rustle } from './audio.js';
import { answer, hear } from './harp.js';
import { cast, SONG, baa, post } from './shared.js';

const W = 3000;
const BUSHES = [[900, 830, true], [1760, 910, true], [2620, 800, true], [1400, 690, false], [2240, 970, false]]; // [x, y, wool on it?]; Pip is behind the third, and the last two are the wrong way
const CHOIR = [[250, 890], [390, 890], [530, 890], [670, 890], [810, 890]]; // where the flock lines up to sing, lowest voice first
const WAIT = [[340, 800], [460, 885], [570, 790], [650, 900]]; // where the others graze while he looks
const find = roamer(W);

let sc, field, bushes, begun = false, found = false;

// A bramble thicket, with or without a tuft of wool caught on it.
const bramble = wool => `<g filter="url(#paperS)"><ellipse cx="-50" cy="-40" rx="70" ry="44" fill="#4d6b3f"/><ellipse cx="46" cy="-46" rx="76" ry="50" fill="#567545"/><ellipse cx="0" cy="-78" rx="70" ry="44" fill="#62824e"/>
  <path d="M-96,-52l-22,-14M-70,-84l-10,-24M-14,-116l-4,-26M44,-100l14,-24M96,-70l24,-12M110,-34l24,2M-112,-22l-22,6" stroke="#6b5a3a" stroke-width="5" stroke-linecap="round"/>
  <circle cx="-30" cy="-58" r="6" fill="#7a2f4f"/><circle cx="30" cy="-34" r="6" fill="#7a2f4f"/><circle cx="62" cy="-74" r="6" fill="#7a2f4f"/>
  ${wool ? '<g fill="#f4ebdb"><circle cx="-84" cy="-78" r="11"/><circle cx="-72" cy="-88" r="10"/><circle cx="-66" cy="-74" r="9"/></g>' : ''}</g><ellipse cy="-56" rx="130" ry="76" fill="transparent"/>`;

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 41,
    sky: '#e3c586', bands: ['#ecd49a', '#f2dfae', '#f6e8c6', '#faf0d8'], sun: [1260, 200, 60, '#fff6d4'], clouds: '#fff8ea',
    far: ['#cbc59c', '#bbb98b'], haze: 'rgba(255,238,196,.42)', mid: '#aab57e', near: '#9aab6c',
    ground: ['#9eb664', '#91ab59', '#85a050', '#789547'], flowers: 90,
    trees: [[380, 636, 0.9], [2200, 642, 1.1]],
    // Stony country.
    props: ({ cut, rock, r }) => cut(Array.from({ length: 26 }, () => rock((80 + r() * (W - 160)) | 0, (640 + r() * 400) | 0, 0.5 + r() * 0.9, ['#c2b7a4', '#b3a894', '#cfc6b6'][(r() * 3) | 0])).join(''), 1),
  }));
  bushes = BUSHES.map(([x, y, wool]) => actor(field, 'bush', bramble(wool), x, y));
  sc.next = next;
  exit(sc, 'left', back, false);
}

export function enter(side, look) {
  come(sc, field, find, side, 'lost');
  if (look) return; // only looked back at, from the ending: nothing begins
  if (found) return;
  // Until she is found, Pip is not with the flock: she is out of sight behind the far thicket.
  const lamb = cast.flock.find(s => s.classList.contains('lamb'));
  lead(cast.flock.filter(s => s !== lamb), -1);
  place(lamb, BUSHES[2][0] + 10, BUSHES[2][1] - 34);
  sc.locked = true; // no going on, or back, without her
  if (!begun) story(lamb);
  begun = true;
}

async function story(lamb) {
  const dv = cast.david, flock = cast.flock, rest = flock.filter(s => s !== lamb);
  post('The lost sheep');
  await sleep(1800);
  await say('One, two, three, four… Wait. Where is Pip?');
  await say('She has wandered off! Stay here, flock. I must go and find her.');
  lead([]);
  rest.forEach(async (s, i) => {
    await walk(s, ...WAIT[i], 170);
    s.classList.add('grazing');
  });
  tell('Listen for her. And look for wool caught on the thorns.');

  // She bleats, louder the nearer he gets. The wool is there to help; he can go straight to her if he hears where she is.
  // Her thicket shakes each time she cries: something to spot, for anyone who cannot tell where a sound is coming from.
  const shake = b => (b.classList.remove('play'), b.getBoundingClientRect(), b.classList.add('play'));
  const crying = setInterval(() => (bleat(lamb.voice ?? 450, clamp01(1.25 - apart(dv, lamb) / 2000)), shake(bushes[2])), 3400);
  reach(bushes[0]).then(() => found || (rustle(), tell('A tuft of wool! She came this way.')));
  reach(bushes[1]).then(() => found || (rustle(), tell('More wool. We are getting closer. Listen!')));
  for (const b of bushes.slice(3)) reach(b).then(() => found || (rustle(), tell('No wool on this one. She did not come this way.')));
  await reach(bushes[2], 230);
  found = true;
  clearInterval(crying);
  roam(false); // he stands still for her
  shake(bushes[2]);
  rustle();
  tell('There you are, Pip! Caught fast in the brambles.');
  await sleep(1800);

  // She wriggles free, runs out to him, stops at his feet, and jumps up into his arms.
  shake(bushes[2]);
  rustle();
  baa(lamb, true);
  const side = lamb.pos[0] > dv.pos[0] ? 1 : -1;
  await walk(lamb, lamb.pos[0] - side * 30, BUSHES[2][1] + 46, 110);
  await sleep(400);
  await walk(lamb, dv.pos[0] + side * 76, dv.pos[1] + 8, 200);
  await sleep(700);
  baa(lamb, true);
  dv.append(lamb);
  place(lamb, side * 76, 8);
  await tween(750, k => place(lamb, side * 76 * (1 - k) + 4 * k, 8 - 104 * k - 64 * Math.sin(Math.PI * k)), smooth);
  lamb.style.removeProperty('--dir'); // in his arms, she faces whichever way he does
  await sleep(500);
  roam(true);
  tell('I have you. Let’s carry you back to the others.');
  await when(() => Math.hypot(dv.pos[0] - 500, dv.pos[1] - 845) < 300 && still());
  hush();
  field.append(lamb);
  place(lamb, dv.pos[0] + 84, dv.pos[1] + 12);
  rest.forEach((s, i) => {
    s.classList.remove('grazing');
    setTimeout(() => baa(s), i * 260);
  });
  await sleep(1500);

  await say('Back with the flock! See how glad they are.');
  await say('When one of mine is lost, I go after it and carry it home. The Lord does that for me.');

  // No harp here: the flock lines up and sings the next part of the song, each sheep its own note (Pip the highest),
  // and the player answers by tapping the sheep.
  await say('Listen! They are so glad that they are singing. Every sheep has a note of its own.');
  const choir = [...rest, lamb];
  go(find(530, 770));
  await Promise.all(choir.map(async (s, i) => {
    await walk(s, ...CHOIR[i], 190);
    s.style.setProperty('--dir', 1);
    s.classList.add('named');
    s.task = () => {}; // while she is singing, a tap is a note, not a bleat
  }));
  await answer(choir.map((s, i) => ({ el: s, string: i + 1 })), SONG[3].pieces.slice(0, 2).map(p => p[1]));
  for (const s of choir) {
    s.classList.remove('named');
    s.task = null;
  }
  await hear([SONG[3]], 3);
  lead(flock);
  sc.locked = false;
  await say('The day is nearly done. Let’s find a place to rest for the night.');
  exit(sc, 'right', sc.next);
}

const clamp01 = v => Math.max(0.12, Math.min(1, v));
