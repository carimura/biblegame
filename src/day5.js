// The fifth day: fish and birds. Genesis 1:20–23.
// Each is put together from pieces of paper. Only its shadow is given, whole, and the pieces lie turned every which
// way (a click gives one a quarter turn), so where each goes, and which way up, has to be worked out from the
// shapes: a piece let go on a place of just its shape sits there, and anywhere else it stays where it is put. After
// a good many tries that do not fit, the shadow shows where its pieces join. Made, the fish goes to the sea and the
// bird to the sky; and when they are blessed they multiply, and a great sea creature comes by.
import { html, sleep, when, tween, leap } from './engine.js';
import { cut } from './art.js';
import { music, plop, chirp, knock, pluck, STRINGS } from './audio.js';
import { rank, waves, sheet, scrap, piece, put, gone, carry, verse, tell, days, patience, solved } from './theatre.js';
import { dusk } from './day1.js';

// A creature is a list of pieces: [its corners, its colour, anything drawn on it]. Both face right.
const FISH = [
  [[[-80, 0], [80, 0], [0, -80]], '#f08a4b', '<circle cx="38" cy="-16" r="7" fill="#3b2f2a"/>'],
  [[[-80, 0], [80, 0], [0, 80]], '#f6a65e'],
  [[[-80, 0], [-160, -64], [-160, 64]], '#e2703a'],
  [[[-60, -20], [-20, -60], [-74, -78]], '#f6c15e'],
  [[[-60, 20], [-20, 60], [-74, 78]], '#f6c15e'],
];
const BIRD = [
  [[[-70, 6], [10, -22], [80, 0], [10, 26]], '#f3ead8'],
  [[[78, -14], [104, -40], [130, -14], [104, 12]], '#e2d6bc', '<circle cx="110" cy="-18" r="4.5" fill="#3b2f2a"/>'],
  [[[128, -20], [158, -11], [128, -2]], '#e0a13c'],
  [[[-34, -12], [26, -16], [-28, -112]], '#cfc3a8', '', 'wing'],
  [[[-20, 16], [30, 13], [-50, 84]], '#bdb095'],
  [[[-66, 4], [-128, -28], [-122, 30]], '#cfc3a8'],
];
const SPOTS = [[930, 400], [1120, 380], [1230, 520], [960, 610], [1130, 640], [1245, 660]]; // where the loose pieces lie
const whole = parts => parts.map(([pts, fill, more = '', cls = '']) => `<polygon class="${cls}" points="${pts}" fill="${fill}"/>${more}`).join('');
const WHALE = '<path d="M-150,6C-150,-66 -40,-92 60,-72C124,-58 156,-28 162,4C150,36 96,52 20,54C-64,56 -150,52 -150,6Z" fill="#3d5f80"/><path d="M-140,4L-212,-52Q-188,-6 -212,46Z" fill="#35536f"/><path d="M-120,30C-40,52 80,50 152,18C140,40 96,52 20,54C-50,56 -100,50 -120,30Z" fill="#9fc0d6"/><circle cx="112" cy="-14" r="6" fill="#17263a"/>';

let shoal, flock, help;

export function build() {
  shoal = html('<div class="rank"></div>'); // the fish swim behind the two nearest waves
  rank.water.insertBefore(shoal, waves[4]);
  flock = rank.sky.appendChild(html('<div class="rank"></div>'));
}

// The corners of a piece as they lie about its own middle, when it is turned so many degrees.
function lie(pts, deg) {
  const [cx, cy] = [0, 1].map(k => pts.reduce((sum, p) => sum + p[k], 0) / pts.length), a = (deg * Math.PI) / 180;
  return Object.assign(pts.map(([x, y]) => [(x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]), { mid: [cx, cy] });
}
// Put one creature together.
async function make(parts, text) {
  const O = [570, 515], card = sheet(cut('<rect x="290" y="300" width="1020" height="430" rx="30" fill="#efe3c8"/>') + `<g class="shadow" transform="translate(${O})">${parts.map(([pts]) => `<polygon points="${pts}"/>`).join('')}</g>`, 'fresh', rank.works);
  const places = parts.map(([pts]) => lie(pts, 0)); // each place in the shadow, to be filled by any piece of its shape (the two halves of the fish are one shape)
  let left = parts.length, from;
  const pieces = parts.map(([pts, fill], i) => {
    const [cx, cy] = places[i].mid, p = piece(cut(`<g transform="translate(${-cx},${-cy})"><polygon class="key" points="${pts}" fill="${fill}"/></g>`, 1), ...SPOTS[i], 130);
    put(p, ...p.pos, (p.lies = 90 + (i % 3) * 90)); // `lies`: how it is to lie once it has done turning, always a whole number of quarters
    carry(p, async () => {
      const turn = Math.hypot(p.pos[0] - from[0], p.pos[1] - from[1]) < 6; // not carried anywhere: a click, which turns it
      if (turn) {
        knock();
        const to = (p.lies += 90), s = p.spin; // clicked again before it has got there, it goes on round to the next quarter from wherever it is
        await tween(160, k => p.lies === to && put(p, ...p.pos, s + (to - s) * k));
        if (p.lies !== to) return; // (that later click sees to the rest)
      }
      if (p.classList.contains('held')) return; // (taken up again while it turned)
      const as = lie(pts, p.spin), place = places.find(pl => !pl.full && Math.hypot(p.pos[0] - O[0] - pl.mid[0], p.pos[1] - O[1] - pl.mid[1]) < 45 && pl.length === as.length && as.every(([x, y]) => pl.some(([u, v]) => Math.hypot(x - u, y - v) < 8)));
      if (!place) return turn || help.tried();
      put(p, O[0] + place.mid[0], O[1] + place.mid[1]);
      p.fixed = place.full = true;
      pluck(STRINGS[parts.length - left + 1], 0.4);
      left--;
      help.again();
    }, () => (from = p.pos));
    return p;
  });
  tell(text);
  help = patience([() => tell('Look at the corners of the shadow. Which piece has a corner just like that one? Click the piece until it lies the same way.'), () => card.querySelector('.shadow').classList.add('lined')]);
  leap(() => (pieces.forEach((p, i) => (put(p, O[0] + places[i].mid[0], O[1] + places[i].mid[1], (p.lies = 0)), (p.fixed = true))), (left = 0))); // (the short cut: every piece in its own place)
  await when(() => !left);
  help.stop();
  solved();
  tell('');
  await sleep(1500);
  [card, ...pieces].forEach(gone);
}

// A fish in the sea, or a bird in the sky: it goes across the picture and comes round again, each at its own height
// and pace, coming in from the side (or, with `spread`, already somewhere on its way). `back`: it goes the other way.
// (It is turned round as a whole, layer and all: paper drawn mirrored comes out black, as paper drawn upside down does.)
let spread = false;
function loose(into, art, y, size, secs, back) {
  const el = scrap(`<g class="made" transform="scale(${size})"><g class="${into === flock ? 'bird' : ''}">${art}</g></g>`, 110, into, 'daylit cross');
  el.style.cssText += `;top:${y}px;scale:${back ? -1 : 1} 1;animation-duration:${secs}s;animation-delay:${spread ? -Math.random() * secs : 0}s;animation-direction:${back ? 'reverse' : 'normal'}`;
}
const fish = (y, size, secs, back) => loose(shoal, cut(whole(FISH), 1), y, size, secs, back);
const bird = (y, size, secs, back) => loose(flock, whole(BIRD), y, size, secs, back);
// Be fruitful and multiply: the waters and the sky fill, a few at a time.
async function multiply(wait) {
  for (const [f, b] of [[[800, 0.26, 34, true], [400, 0.34, 30, true]], [[850, 0.36, 44], [470, 0.26, 36]], [[790, 0.22, 26], [350, 0.3, 24]], [[870, 0.3, 38, true], [520, 0.24, 33, true]], [[825, 0.2, 30], [430, 0.22, 27]]]) {
    fish(...f);
    bird(...b);
    await sleep(wait);
  }
  loose(shoal, cut(WHALE, 1), 835, 0.62, 80); // and a great sea creature
}

// Jump past this day, for starting at a later one: the sea and the sky full.
export function skip() {
  spread = true;
  fish(830, 0.32, 40);
  bird(380, 0.3, 28);
  multiply(0);
  days(5);
}

export async function play() {
  music('life');
  await sleep(1200);
  await verse('Then God said, “Let the waters abound with an abundance of living creatures, and let birds fly above the earth across the face of the firmament of the heavens.”', 'Genesis 1:20');
  await make(FISH, 'Here are the pieces of a creature for the waters. Fit them into its shadow. Click a piece to turn it.');
  plop();
  fish(830, 0.32, 40);
  await sleep(2600);
  await make(BIRD, 'And here is one for the sky. Turn its pieces, and fit them into its shadow.');
  chirp();
  bird(380, 0.3, 28);
  await sleep(2600);
  await verse('So God created great sea creatures and every living thing that moves, with which the waters abounded, according to their kind, and every winged bird according to its kind. And God saw that it was good.', 'Genesis 1:21');
  await verse('And God blessed them, saying, “Be fruitful and multiply, and fill the waters in the seas, and let birds multiply on the earth.”', 'Genesis 1:22');
  await multiply(1300);
  await sleep(3000);
  tell('Evening is coming. Press and hold the handle to wind the great wheel round.');
  await dusk();
  tell('');
  await sleep(1500);
  await verse('So the evening and the morning were the fifth day.', 'Genesis 1:23');
  days(5, true);
}
