// Noah's Ark, scene 6: the ark on the waters. Genesis 7:18, 7:24, 8:1, 8:3–4.
// The ark has no sail and no rudder, and none is given it here: the waters carry it. Seen from above, the flood
// lies over a drowned country whose mountains are dark shapes under the water. The player sends a wave, from one of
// the four sides, and the ark goes with it, to the sound of rushing water, until a mountain (or the edge of the
// picture) stops her: she cannot stop herself, or turn. She is to come to rest in the circle. Three seas, each wider than the last: three waves do the
// first, six the second, eight the third (a script found the boards, and their shortest ways). The third ring lies
// over the mountains of Ararat, and there, as the waters go down, the ark rests.
// A wave that brings her no nearer counts as a try that got nowhere: after four, a little more is said; after four
// more, the arrow of a wave that helps glows.
import { overlay, sleep, tween, smooth, fade } from './engine.js';
import { cut } from './art.js';
import { rush, knock, music } from './audio.js';
import { verse, patience, tell, lighten } from './theatre.js';
import { picture } from './ark.js';

// Each sea: how wide and high it is in squares, its drowned mountains, where the ark begins and where she is to rest.
const SEAS = [
  [6, 4, ['....#.', '.S....', '...#G.', '.#...#']],
  [8, 5, ['..#..#..', '..G.....', '...#.S..', '.#...#..', '..#...#.']],
  [9, 6, ['.#...##..', '.........', '....#.S.#', '#G.#..#..', '..#......', '.....#...']],
];
const WAYS = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // a wave from the west carries her east, and so on
const chart = overlay('<p class="cue long"></p><svg class="chart" viewBox="0 0 1600 800"></svg>');
chart.classList.add('harp');
const svg = chart.querySelector('svg'), cue = text => (chart.firstChild.textContent = text);

async function sail([W, H, rows], words) {
  const c = Math.min(150, (1180 / W) | 0, (560 / H) | 0), x0 = 800 - (W * c) / 2, y0 = 400 - (H * c) / 2, at = (x, y) => [x0 + x * c + c / 2, y0 + y * c + c / 2];
  const rock = (x, y) => x < 0 || y < 0 || x >= W || y >= H || rows[y][x] === '#', find = ch => { const y = rows.findIndex(r => r.includes(ch)); return [rows[y].indexOf(ch), y]; };
  // Where a wave leaves her, from a square; and how many waves it is from a square to the ring, at the least.
  const drift = ([x, y], [dx, dy]) => { while (!rock(x + dx, y + dy)) (x += dx), (y += dy); return [x, y]; };
  const goal = find('G'), same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const far = from => {
    const seen = new Map([[from + '', 0]]), line = [from];
    for (const p of line) {
      if (same(p, goal)) return seen.get(p + '');
      for (const w of WAYS) { const q = drift(p, w); if (!seen.has(q + '')) (seen.set(q + '', seen.get(p + '') + 1), line.push(q)); }
    }
  };
  let here = find('S'), busy = false;
  // (an arrow is turned inside its paper, not with it: paper that is itself turned round comes out black)
  const arrow = (k, x, y, turn) => `<g class="wind key" data-k="${k}" transform="translate(${x},${y})">${cut(`<path transform="rotate(${turn})" d="M-46,-26Q-20,-44 0,-26T46,-26L46,-40L84,0L46,40L46,26Q20,8 0,26T-46,26Z" fill="#fbf3df"/>`, 1)}<circle r="70" fill="transparent"/></g>`;
  svg.innerHTML = cut(`<rect x="${x0 - 14}" y="${y0 - 14}" width="${W * c + 28}" height="${H * c + 28}" rx="26" fill="#3f7fa8"/>`) +
    `<path d="${Array.from({ length: H * 3 }, (_, i) => `M${x0 + 10 + (i % 2) * 30},${y0 + 24 + (i * c) / 3}${'q18,-14 36,0t36,0'.repeat(((W * c - 60) / 72) | 0)}`).join('')}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="5" stroke-linecap="round"/>` +
    rows.flatMap((r, y) => [...r].map((ch, x) => ch === '#' && `<g transform="translate(${at(x, y)}) scale(${c / 150})">${cut('<path d="M-58,44L-30,-18L-8,8L18,-46L60,44Z" fill="#2f5f85"/><path d="M18,-46L34,-12L16,-20L6,-4L-2,-22Z" fill="#6f9bb8"/>', 1)}</g>`)).filter(Boolean).join('') +
    `<circle class="socket" cx="${at(...goal)[0]}" cy="${at(...goal)[1]}" r="${c * 0.42}"/>` +
    `<g class="craft"><g transform="scale(${c / 190})">${cut('<path d="M-70,-4H70Q66,32 44,36H-44Q-66,32 -70,-4Z" fill="#6f5239"/><rect x="-56" y="-34" width="112" height="32" fill="#664a33"/><path d="M-64,-32L-52,-50H52L64,-32Z" fill="#74492c"/>', 1)}</g></g>` +
    arrow(0, x0 - 90, 400, 0) + arrow(1, x0 + W * c + 90, 400, 180) + arrow(2, 800, y0 - 76, 90) + arrow(3, 800, y0 + H * c + 76, -90);
  const craft = svg.querySelector('.craft'), winds = [...svg.querySelectorAll('.wind')], put = ([x, y]) => (craft.style.transform = `translate(${x}px,${y}px)`);
  put(at(...here));
  cue(words);
  const help = patience([
    () => cue('She only stops when she bumps into a mountain, or the edge. Which mountain would stop her at the circle?'),
    () => winds[WAYS.reduce((best, w, k) => ((far(drift(here, w)) ?? 99) < (far(drift(here, WAYS[best])) ?? 99) ? k : best), 0)].classList.add('next'),
  ], 4);
  await new Promise(done => (svg.onpointerdown = async e => {
    const k = winds.indexOf(e.target.closest('.wind'));
    if (k < 0 || busy) return;
    const to = drift(here, WAYS[k]), was = far(here), from = at(...here), end = at(...to);
    for (const w of winds) w.classList.remove('next');
    busy = true;
    const ms = 140 + 110 * (Math.abs(to[0] - here[0]) + Math.abs(to[1] - here[1]));
    rush(ms);
    await tween(ms, t => put([from[0] + (end[0] - from[0]) * t, from[1] + (end[1] - from[1]) * t]), smooth);
    if (!same(to, here)) knock();
    here = to;
    busy = false;
    if (same(here, goal)) return done();
    far(here) < was ? help.again() : help.tried();
  }));
  svg.onpointerdown = null;
  cue('She is in the circle!');
  await sleep(1800);
}

// Jump past this scene, for starting further on: the waters lower, and the ark at rest on the mountains.
export function skip() {
  picture({ level: 640, x: 425, rest: 592, storm: 0.3, rain: 0 });
  lighten(1, 0);
}

export async function play() {
  music('adrift');
  await verse('The waters prevailed and greatly increased on the earth, and the ark moved about on the surface of the waters.', 'Genesis 7:18');
  tell('The ark has no sail, and no rudder. The waters carry her, where God wills.');
  await sleep(4200);
  tell();
  chart.classList.add('on');
  await sail(SEAS[0], 'Get the ark to the circle! Click an arrow to push her that way. She cannot stop by herself: she goes on until she bumps into a mountain, or the edge.');
  await sail(SEAS[1], 'Get the ark to the circle again. She only stops at a mountain, or the edge: use the mountains to stop her where you want her.');
  chart.classList.remove('on');
  await sleep(900);
  await verse('And the waters prevailed on the earth one hundred and fifty days.', 'Genesis 7:24');
  await verse('Then God remembered Noah, and every living thing, and all the animals that were with him in the ark. And God made a wind to pass over the earth, and the waters subsided.', 'Genesis 8:1');
  picture({ storm: 0.3 });
  lighten(1, 5000);
  chart.classList.add('on');
  await sail(SEAS[2], 'The waters are going down. The circle is over the mountains of Ararat. Get the ark there!');
  chart.classList.remove('on');
  await sleep(900);
  // The waters fall, the ark comes over the mountain, and rests on it.
  tell('The waters go down…');
  await tween(10000, k => picture({ level: 430 + 210 * k, x: 820 - 395 * Math.min(1, k / 0.3), rest: 430 + 210 * k + 88 > 592 ? 592 : 0 }), smooth);
  knock();
  tell();
  await verse('Then the ark rested in the seventh month, the seventeenth day of the month, on the mountains of Ararat.', 'Genesis 8:4');
  await sleep(1200);
}
