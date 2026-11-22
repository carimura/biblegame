// Scene 3: still waters. "He leads me beside the still waters."
// The flock is thirsty, but sheep will not drink where water rushes. The pool pours out through a gap at the bottom:
// block the gap with three stones and the pool goes still.
import { actor, place, exit, sleep, when, still, say, tell, hush, hint, reach, go, lead, walk, clamp, wonder } from './engine.js';
import { land, come, rise } from './land.js';
import { splash, lap, flow, knock, pluck, STRINGS } from './audio.js';
import { answer, hear } from './harp.js';
import { cast, SONG, NOTES, chime, counter, post } from './shared.js';

const W = 3000;
const POND = [1750, 815, 300, 90], MOUTH = [1750, 934]; // the pool [x, y, half-width, half-depth], and where it runs out
const STONES = [[700, 880], [1180, 700], [2260, 905]]; // all in view from the pool
const DRINK = [[1436, 836, 1], [1545, 902, 1], [2064, 836, -1], [1955, 902, -1], [1668, 918, 1]]; // on the near bank, feet at the water's edge, so a lowered head is over the water

const STONE = 'M-30,0q-8,-26 14,-36q26,-10 40,8q14,14 6,28z';
const CHANNEL = 'M1722,888C1704,960 1738,1040 1686,1112L1806,1112C1828,1040 1764,960 1778,888Z'; // the stream out of the pool, widening as it comes toward us
const RINGS = [[1600, 3], [1700, 4], [1800, 5], [1900, 6]]; // where the still pool makes rings to play the song on: [x, harp string]

let sc, field, pond, dam, stones, begun = false, stilled = false, hushWater;

// David keeps out of the water: a click in the pool means its bank, and a walk across goes round by the nearer bank.
const wet = (x, y) => ((x - POND[0]) / (POND[2] + 45)) ** 2 + ((y - POND[1]) / (POND[3] + 40)) ** 2 < 1;
function find(x, y) {
  x = clamp(x, 30, W - 40);
  y = clamp(y, 650, 1010);
  if (wet(x, y)) y = y < POND[1] ? 672 : 998;
  const [x0, y0] = cast.david.pos, pts = [];
  let across = false;
  for (let k = 1; k < 16; k++) across ||= wet(x0 + ((x - x0) * k) / 16, y0 + ((y - y0) * k) / 16);
  if (across) {
    const bank = y0 + y < 2 * POND[1] ? 672 : 998, end = v => (v < POND[0] ? 1370 : 2130);
    pts.push([end(x0), bank]);
    if (end(x) !== end(x0)) pts.push([end(x), bank]);
  }
  pts.push([x, y]);
  return pts;
}

export function build(next, back) {
  const [px, py, rx, ry] = POND;
  ({ sc, field, below: pond } = land({
    W, seed: 37,
    sky: '#86bcdc', bands: ['#9dcae3', '#b6d8e8', '#d2e6ec', '#eef1e2'], sun: [380, 150, 58, '#fff8dc'], clouds: '#fffaf0',
    far: ['#b4d2bd', '#9fc8a8'], haze: 'rgba(235,246,230,.4)', mid: '#8fc487', near: '#7fbb70',
    ground: ['#79b760', '#6dad57', '#62a34d', '#589844'], flowers: 240,
    trees: [[560, 640, 1.1], [2650, 650, 1.2], [1250, 630, 0.8]],
    // A deer at the far bank, the rocks the spring comes out of, and reeds.
    props: ({ cut, rock, r }) =>
      `<g class="spring">${cut(rock(1740, 606, 1.3, '#b3b8b5') + rock(1800, 610, 0.9, '#a3a9a6') + rock(1700, 612, 0.7, '#c2c6c2'), 1)}</g>` +
      `<g class="deer" transform="translate(2010,642)">${cut('<path d="M-30,-40v40M-18,-40v40M18,-40v40M30,-40v40" stroke="#8a6142" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="-52" rx="40" ry="19" fill="#b9855a"/><path d="M-32,-58Q-50,-84 -52,-102" stroke="#b9855a" stroke-width="15" stroke-linecap="round" fill="none"/><ellipse cx="-60" cy="-108" rx="17" ry="11" fill="#b9855a" transform="rotate(-18 -60 -108)"/><ellipse cx="-46" cy="-120" rx="9" ry="5" fill="#8a6142" transform="rotate(-50 -46 -120)"/><circle cx="-64" cy="-111" r="2.4" fill="#2b1f1a"/><circle cx="40" cy="-56" r="8" fill="#f4ebdb"/><path d="M-52,-120q-6,-22 -22,-30M-52,-120q4,-20 -2,-36M-60,-136q-10,-4 -14,-14" stroke="#7a5a3c" stroke-width="4" stroke-linecap="round" fill="none"/>', 1)}<circle cx="-10" cy="-70" r="70" fill="transparent"/></g>` +
      cut(Array.from({ length: 22 }, (_, i) => { const a = 2.2 + r() * 2.2 * (i % 2 ? 1 : -1), x = px + Math.cos(a) * (rx + 26), y = py + Math.sin(a) * (ry + 20), h = 40 + r() * 34; return `<path d="M${x | 0},${y | 0}q${(r() * 8 - 4) | 0},${(-h / 2) | 0} ${(r() * 14 - 7) | 0},${-h | 0}" stroke="#4f8a4c" stroke-width="5" stroke-linecap="round" fill="none"/>`; }).join(''), 1),
    // The water has a layer to itself, because it moves.
    under: ({ cut }) => `<g class="pond">
      <path d="M1766,598C1740,640 1794,676 1752,740" fill="none" stroke="#86c5dc" stroke-width="26" stroke-linecap="round"/>
      <path d="${CHANNEL}" fill="#d6c493"/>
      <g class="outflow"><clipPath id="channel"><path d="${CHANNEL}"/></clipPath>
        <g clip-path="url(#channel)" fill="none" stroke-linecap="round"><path d="${CHANNEL}" fill="#5aa9cc"/>
          <g class="race">${[...Array(6)].map((_, k) => { const y = 740 + k * 96; return `<path d="M1630,${y}Q1700,${y + 40} 1748,${y + 46}Q1796,${y + 40} 1866,${y}" stroke="#8ccbe3" stroke-width="20"/><path d="M1640,${y + 30}Q1700,${y + 66} 1748,${y + 72}Q1796,${y + 66} 1856,${y + 30}" stroke="#f2fbff" stroke-width="7"/>`; }).join('')}</g>
          <g class="race quick" fill="#f2fbff" stroke="none">${[...Array(18)].map((_, k) => `<ellipse cx="${1700 + ((k * 37) % 100)}" cy="${700 + k * 24}" rx="${5 + (k % 3) * 2}" ry="3"/>`).join('')}</g></g>
        <g class="foam" fill="#f6fdff">${[[1722, 906, 11], [1740, 911, 14], [1760, 912, 13], [1778, 906, 11], [1750, 902, 9]].map(([x, y, r], k) => `<circle cx="${x}" cy="${y}" r="${r}" style="animation-delay:${-k * 0.13}s"/>`).join('')}</g></g>
      ${cut(`<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}" fill="#7cc0d9"/>`)}
      <g class="calm"><ellipse cx="${px}" cy="${py}" rx="${rx - 14}" ry="${ry - 10}" fill="#4f9fc4"/><path d="M${px - 190},${py - 30}h120M${px + 40},${py + 24}h150M${px - 70},${py + 50}h90" stroke="#bfe3f0" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>
      <g class="rush" fill="none" stroke="#c4e8f4" stroke-width="10" stroke-linecap="round" stroke-dasharray="44 62" opacity=".8">
        <path d="M${px - 20},${py - ry + 16}C${px - 150},${py - 20} ${px - 60},${py + 40} ${px - 6},${py + ry - 10}"/><path d="M${px + 10},${py - ry + 16}C${px + 150},${py - 10} ${px + 70},${py + 46} ${px + 4},${py + ry - 10}"/><path d="M${px},${py - ry + 20}C${px - 30},${py - 10} ${px + 30},${py + 30} ${px},${py + ry - 14}"/>
      </g></g>`,
  }));
  pond = pond.querySelector('.pond');
  // The gap shows three stone-shaped places, so it is plain where the stones go.
  dam = actor(field, 'dam', [-56, 0, 56].map(x => `<path class="slot" transform="translate(${x},8)" d="${STONE}"/>`).join('') + '<ellipse rx="120" ry="52" fill="transparent"/>', ...MOUTH);
  stones = STONES.map(([x, y]) => actor(field, 'stone', `<g filter="url(#paperS)"><path d="${STONE}" fill="#b3b0aa"/></g><circle cy="-16" r="52" fill="transparent"/>`, x, y));
  wonder(sc.el.querySelector('.deer'), NOTES.deer, chime(4));
  wonder(sc.el.querySelector('.spring'), NOTES.spring, chime(5));
  sc.next = next;
  exit(sc, 'left', back, false);
}

export function enter(side, look) {
  come(sc, field, find, side, 'waters');
  if (look) return pond.classList.add('still'); // only looked back at, from the ending: nothing begins, and the water is still
  if (!stilled) {
    hushWater = flow(); // the stream is noisy until it is dammed
    sc.leave = () => hushWater();
  }
  if (!begun) story();
  begun = true;
}

async function story() {
  const dv = cast.david, flock = cast.flock;
  sc.locked = true; // no wandering off while he explains
  post('Still waters');
  await sleep(1800);
  await say('Water! Hear it? And the flock is thirsty.');
  await say('But sheep will not drink where the water rushes. It frightens them.');
  await say('See the gap at the bottom of the pool, where the water pours out? If we block it with stones, the pool will go still.');
  tell('Find a stone and click it to pick it up.');
  sc.locked = false;

  // Pick up a stone (one at a time), carry it to the gap, set it down. Three stones block it.
  // A ring shows each thing to click: the stones first, then the gap once he has one in his arms.
  const count = counter();
  let held = null, laid = 0, ringGap = () => {};
  for (const s of stones)
    (async () => {
      const unring = hint(field, s.pos[0] + 6, s.pos[1] - 18);
      do await reach(s);
      while (held);
      unring();
      held = s;
      dv.append(s);
      place(s, 4, -92);
      knock();
      tell('Now carry it to the gap, where the water pours out.');
      ringGap = hint(field, MOUTH[0], MOUTH[1] - 12);
    })();
  while (laid < 3) {
    await reach(dam, 210);
    if (!held) {
      tell('The stones go here. First find one and pick it up.');
      continue;
    }
    ringGap();
    dam.querySelector('.slot').remove();
    field.append(held);
    place(held, MOUTH[0] - 56 + laid * 56, MOUTH[1] + 8);
    count(held);
    held = null;
    laid++;
    splash();
    if (laid < 3) tell(['One stone in! Two more.', 'Two! One more stone.'][laid - 1]);
  }
  stilled = true;
  pond.classList.add('still');
  hushWater();
  sc.leave = null;
  go(find(MOUTH[0], 1006)); // he steps back, out of the flock's way
  tell('That’s done it!');
  await sleep(2600);
  hush();

  // Now they will drink. They go round by the banks, not through the water.
  await say('Look! The water has gone still and deep.');
  sc.locked = true;
  lead([]);
  tell('Come and drink, little ones.');
  const lapping = setInterval(lap, 380);
  await Promise.all(flock.map(async (s, i) => {
    const [x, y, facing] = DRINK[i];
    await sleep(i * 450);
    await walk(s, x < POND[0] ? 1370 : 2130, 998, 170);
    await walk(s, x, y, 170);
    s.style.setProperty('--dir', facing);
    s.classList.add('grazing'); // head down: here that is drinking
    pond.insertAdjacentHTML('beforeend', `<ellipse class="ripple" cx="${x + facing * (s.classList.contains('lamb') ? 38 : 56)}" cy="${y - 22}" rx="26" ry="9" style="animation-delay:${-i * 0.4}s"/>`);
  }));
  await sleep(5000);
  clearInterval(lapping);

  await say('They drink their fill, with nothing to fear.');
  await say('The Lord leads me to quiet places too.');

  // No harp here: the still pool makes rings that sound the next part of the song, and the player taps them back.
  await say('Look, rings on the still water! It is playing the next part of my song. Tap the rings to play it back.');
  const rings = RINGS.map(([x, string]) => {
    pond.insertAdjacentHTML('beforeend', `<g class="spot" transform="translate(${x},790)"><ellipse rx="42" ry="15" fill="#9fd8ec" opacity=".55" stroke="#f2fbff" stroke-width="3"/><ellipse class="wave" rx="42" ry="15" fill="none" stroke="#f2fbff" stroke-width="4"/><ellipse rx="56" ry="28" fill="transparent"/></g>`);
    return { el: pond.lastElementChild, string, sound: () => (pluck(STRINGS[string] * 2, 0.4), lap()) };
  });
  go(find(1330, 965)); // he stands aside, clear of the pool
  await when(still);
  await answer(rings, SONG[2].pieces.slice(0, 2).map(p => p[1]));
  for (const r of rings) r.el.remove();
  await hear([SONG[2]], 2);
  for (const ring of pond.querySelectorAll('.ripple')) ring.remove();
  rise();
  sc.locked = false;
  await say('Rested and watered. Let’s go on, and stay together!');
  exit(sc, 'right', sc.next);
}
