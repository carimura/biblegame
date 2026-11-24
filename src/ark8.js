// Noah's Ark, scene 8: dry ground, and the bow. Genesis 8:15–20, 8:22, 9:1, 9:11–13, 9:16.
// The waters are gone and the land is green. A click on the ark lets out a pair at a time: nine clicks, and they
// go bounding down the mountain with their own voices. Then Noah and his family, and the altar.
// The altar is the last thing to work out: nine stones (three long, three middling, three short) to be laid in
// three courses, six wide. A stone is carried to its place. It must rest on stones, and no gap between two stones
// may stand right over a gap in the course beneath (or under one in the course above): a wall is strong when every
// stone lies across a gap. A stone that would break the rule goes back, with the reason; one with nothing on it can
// be taken off again.
// Then the end of the whole story, which is meant to be its height. God's blessing and His promise are read; a
// cloud comes over the earth once more, with rain (9:14: "when I bring a cloud over the earth"); and the bow is
// set in it by the player's own hand: pressed where it rises and swept right over the sky, it follows the pointer
// round, seven colours at once (the first time every colour is in the picture), with a note of the harp for each
// seventh of the way, and every pair it passes over leaps and calls. When it stands whole the rain stops, the light
// comes back, and they all answer together. The last verse is read under it, and the animals go out two by two,
// to either side and right out of the picture, to fill the earth.
import { overlay, stage, sleep, tween, smooth, tap, click } from './engine.js';
import { cut } from './art.js';
import { knock, groan, thunder, flow, shine, sweep, pluck, STRINGS, music } from './audio.js';
import { verse, patience, tell, rank, sheet, scrap, put, slide, at, lighten } from './theatre.js';
import { LORD } from './shared.js';
import { finish } from './map.js';
import { boat, peaks, picture, creature, person, noahArt, VOICE } from './ark.js';

const DOOR = [425, 572];
// Each pair in the order it comes out, and where on the land it comes to stand.
const OUT = [['sheep', 880, 826], ['goat', 1010, 866], ['ox', 1160, 824], ['lion', 1330, 860], ['elephant', 1480, 822], ['giraffe', 760, 862], ['raven', 1130, 564], ['dove', 1380, 608], ['tortoise', 640, 800]];
const freed = []; // every pair that has come out: [its kind, its two drawings]

// A pair comes out at the door and goes down the mountain to its place (the birds fly to theirs).
async function release([kind, x, y]) {
  const flies = kind === 'raven' || kind === 'dove';
  VOICE[kind]();
  const pair = [];
  freed.push([kind, pair]);
  await Promise.all([0, 1].map(async i => {
    const a = (pair[i] = scrap(`<g transform="scale(.8)">${creature(i && kind === 'lion' ? 'lioness' : kind)}</g>`, 130, rank.works, 'fresh' + (flies ? ' aloft' : '')));
    put(a, ...DOOR);
    await sleep(i * 380);
    if (!flies) (await slide(a, 640, 606, 600), await slide(a, 770, 748, 600));
    await slide(a, x + i * 66, y + i * 8, flies ? 1800 : 500 + Math.abs(x - 770) * 2.2);
    a.classList.remove('aloft');
  }));
}

// The altar, close up. `U` is the width of a short stone; a course is six of them wide, and 64 high.
const U = 86, LEFT = 800 - 3 * U, BASE = 650, STONES = [3, 3, 3, 2, 2, 2, 1, 1, 1], YARD = [[110, 250], [110, 370], [1232, 250], [150, 490], [1275, 370], [1275, 490], [240, 610], [1300, 610], [1420, 610]];
const mound = overlay(`<p class="cue long"></p><svg class="mound" viewBox="0 0 1600 800">
  ${cut(`<path d="M-100,800V700Q400,650 800,662T1700,690V800Z" fill="#7da35a"/>`)}
  <rect class="socket" x="${LEFT}" y="${BASE - 192}" width="${6 * U}" height="192" rx="6"/>
  ${STONES.map((w, i) => `<g class="stone" data-i="${i}">${cut(`<rect x="3" y="3" width="${w * U - 6}" height="58" rx="17" fill="${['#b9ad9c', '#a79a88', '#cfc4b2'][i % 3]}"/>`, 1)}</g>`).join('')}
</svg>`);
mound.classList.add('harp');
mound.style.background = '#2b2640'; // its own picture: nothing of the scene shows through
async function altar() {
  const svg = mound.querySelector('svg'), stones = [...svg.querySelectorAll('.stone')], cue = text => (mound.firstChild.textContent = text);
  const laid = STONES.map(() => null); // for each stone, the course it lies in and how far along: [course, from]
  const set = (i, x, y) => (stones[i].style.transform = `translate(${x}px,${y}px)`), home = i => set(i, ...YARD[i]);
  const filled = (r, u) => laid.some((p, i) => p && p[0] === r && u >= p[1] && u < p[1] + STONES[i]);
  const gaps = r => laid.flatMap((p, i) => (p && p[0] === r ? [p[1], p[1] + STONES[i]] : [])).filter(u => u > 0 && u < 6); // where two stones meet (or will)
  stones.forEach((_, i) => home(i));
  // After three stones sent back, the rule is said plainly; after three more, a way to begin.
  const help = patience([
    () => cue('A wall is strong when every stone lies across the gap between two stones beneath it. No gap may stand right over another.'),
    () => cue('Stuck? A stone with nothing on it can be taken off again. Try two long stones for the lowest course, and then a middling one to begin the next.'),
  ], 3);
  cue('Help Noah build the altar: three courses of stone, each as wide as the place marked. Carry a stone to where it should lie.');
  mound.classList.add('on');
  await new Promise(done => (svg.onpointerdown = e => {
    const el = e.target.closest('.stone'), i = stones.indexOf(el), box = svg.getBoundingClientRect(), w = STONES[i];
    if (i < 0) return;
    const spot = e => [((e.clientX - box.left) * 1600) / box.width, ((e.clientY - box.top) * 800) / box.height], [x0, y0] = spot(e);
    const was = laid[i], [px, py] = was ? [LEFT + was[1] * U, BASE - 64 * (was[0] + 1)] : YARD[i];
    if (was && [...Array(w)].some((_, k) => filled(was[0] + 1, was[1] + k))) return cue('Another stone rests on that one. Take the upper one off first.');
    laid[i] = null;
    svg.append(el); // above the rest while it is carried
    el.setPointerCapture(e.pointerId);
    el.onpointermove = e => set(i, px + spot(e)[0] - x0, py + spot(e)[1] - y0);
    el.onpointerup = el.onpointercancel = e => {
      el.onpointermove = el.onpointerup = el.onpointercancel = null;
      const [x, y] = [px + spot(e)[0] - x0, py + spot(e)[1] - y0], r = Math.round((BASE - 64 - y) / 64), a = Math.round((x - LEFT) / U);
      if (r < 0 || r > 2 || a < -1 || a + w > 7) return home(i); // let go away from the altar: it lies where it lay
      const why = a < 0 || a + w > 6 ? 'It would stick out past the side of the altar.'
        : [...Array(w)].some((_, k) => filled(r, a + k)) ? 'There is a stone there already.'
        : r && ![...Array(w)].every((_, k) => filled(r - 1, a + k)) ? 'Nothing is under it there. A stone must rest on stones.'
        : [a, a + w].some(u => u > 0 && u < 6 && (gaps(r - 1).includes(u) || gaps(r + 1).includes(u))) ? 'A gap would stand right over a gap, and the altar would split there. Every stone must lie across a gap.' : '';
      if (why) return (cue(why), knock(), home(i), help.tried());
      laid[i] = [r, a];
      set(i, LEFT + a * U, BASE - 64 * (r + 1));
      knock();
      help.again();
      if (laid.every(Boolean)) done();
    };
  }));
  svg.onpointerdown = null;
  cue('The altar is built.');
  await sleep(2600);
  mound.classList.remove('on');
  await sleep(900);
}

// A pair leaps up, and calls.
const leap = ([kind, pair], quiet) => {
  for (const a of pair) (a.classList.remove('play'), a.getBoundingClientRect(), a.classList.add('play'));
  quiet || VOICE[kind]();
};
// The bow. Seven bands round one middle, far below the picture, so that it rises behind the mountain on the left,
// stands over the ark and the whole land, and comes down on the right. It is drawn as far round as the pointer has
// been swept (`far`: 0 at its left foot, 1 at its right), and only on from where it had got to: it cannot be jumped.
const MID = [800, 1010], WIDE = 703, FROM = 0.17, TO = 0.86; // its middle, the middle band's radius, and the part of it that shows
async function rainbow() {
  const bow = sheet(['#d9634a', '#e58f4a', '#f0c14d', '#7fae5d', '#6fa8c9', '#56659f', '#8a6aa8'].map((c, i) => `<path pathLength="1" d="M${MID[0] - 760 + i * 19},${MID[1]}A${760 - i * 19},${760 - i * 19} 0 0 1 ${MID[0] + 760 - i * 19},${MID[1]}" fill="none" stroke="${c}" stroke-width="20"/>`).join(''), 'bow', rank.sky);
  const ring = scrap('<circle r="44" fill="none" stroke="#ffe29a" stroke-width="7"/>', 60, rank.works, 'beckon on'), point = k => [MID[0] - WIDE * Math.cos(Math.PI * k), MID[1] - WIDE * Math.sin(Math.PI * k)];
  let far = FROM, note = 0;
  const draw = () => {
    for (const arc of bow.children) arc.style.strokeDashoffset = 1 - far;
    put(ring, ...point(far));
    while (note < 7 && far >= FROM + ((note + 1) * (TO - FROM)) / 7) pluck(STRINGS[note++], 0.5);
    for (const f of freed) if (!f.leapt && point(far)[0] > f[1][0].pos[0]) (f.leapt = true), leap(f);
  };
  draw();
  await new Promise(done => {
    const round = e => {
      const [x, y] = at(e), k = 1 - Math.atan2(MID[1] - y, x - MID[0]) / Math.PI;
      if (!e.buttons || k <= far || k > far + 0.14 || Math.abs(Math.hypot(x - MID[0], MID[1] - y) - WIDE) > 170) return;
      far = k;
      draw();
      if (far < TO) return;
      stage.removeEventListener('pointermove', round);
      stage.removeEventListener('pointerdown', round);
      done();
    };
    stage.addEventListener('pointermove', round);
    stage.addEventListener('pointerdown', round);
  });
  far = 1;
  draw();
  ring.remove();
  bow.classList.add('whole');
}

export async function play() {
  music('bow');
  peaks.classList.add('dry');
  await tween(4000, k => picture({ level: 860 + 90 * k }), smooth);
  await verse('Then God spoke to Noah, saying, “Go out of the ark, you and your wife, and your sons and your sons’ wives with you.', 'Genesis 8:15–16');
  tell('The ground is dry. Click the ark, and let them out, two by two!');
  for (const pair of OUT) {
    await tap(boat.querySelector('.key'));
    if (pair === OUT[0]) groan(); // the great door opens
    tell(pair[0] === 'tortoise' ? 'And last of all…' : '');
    release(pair);
    await sleep(500);
  }
  await sleep(6500);
  tell();
  // Noah and his family stand before the ark.
  const kin = [noahArt(), ...[['#a8705c', '#d9ccb5', 1], ['#7d8f6f', '#3b2a22'], ['#c2a56a', '#8a6a5a', 1], ['#8f7d5d', '#2b1f1a'], ['#8fa3a8', '#e6dcc8', 1], ['#6f7f8f', '#5b4530'], ['#a98a9f', '#cdbf9f', 1]].map(look => person(...look))];
  const family = kin.map(art => scrap(`<g transform="scale(.62)">${art}</g>`, 120, rank.works, 'fresh david'));
  family.forEach((el, i) => put(el, 250 + i * 46, 592 + (i % 2) * 5));
  await sleep(1600);
  await verse('So Noah went out, and his sons and his wife and his sons’ wives with him. Every animal, every creeping thing, every bird, and whatever creeps on the earth, according to their families, went out of the ark.', 'Genesis 8:18–19');
  await verse(`Then Noah built an altar to the ${LORD}, and took of every clean animal and of every clean bird, and offered burnt offerings on the altar.`, 'Genesis 8:20');
  await altar();
  put(scrap(cut(`<path d="M-44,0V-44H44V0Z" fill="#a79a88"/><path d="M-44,-15H44M-44,-30H44M-14,0V-15M16,-15V-30M-22,-30V-44M20,0V-15" stroke="#8f8474" stroke-width="2.5"/>`, 1), 60, rank.works, 'fresh'), 610, 592);
  await sleep(1800);
  await verse('“While the earth remains,<br>Seedtime and harvest,<br>Cold and heat,<br>Winter and summer,<br>And day and night<br>Shall not cease.”', 'Genesis 8:22');
  await verse('So God blessed Noah and his sons, and said to them: “Be fruitful and multiply, and fill the earth.', 'Genesis 9:1');
  await verse('Thus I establish My covenant with you: Never again shall all flesh be cut off by the waters of the flood; never again shall there be a flood to destroy the earth.”', 'Genesis 9:11');

  // A cloud comes over the earth once more, and rain. And in the cloud, the bow.
  const dry = flow(0.05);
  picture({ storm: 0.6, rain: 0.55 });
  lighten(0.7, 4000);
  tell('But look: a cloud comes over the earth again. And rain!');
  await sleep(2500);
  thunder(0.1);
  await sleep(4500);
  tell();
  await verse('And God said: “This is the sign of the covenant which I make between Me and you, and every living creature that is with you, for perpetual generations: I set My rainbow in the cloud, and it shall be for the sign of the covenant between Me and the earth.', 'Genesis 9:12–13');
  tell('Set the bow in the cloud! Press on the ring, and sweep right over the sky, all the way down to the other side.');
  await rainbow();
  // It stands whole: the rain stops, the light comes back, and every living thing answers.
  tell();
  dry();
  shine();
  picture({ storm: 0, rain: 0 });
  lighten(1, 3000);
  for (const f of freed) (leap(f), await sleep(260));
  for (const el of family) (el.classList.add('play'), await sleep(90));
  await sleep(2600);
  await verse('The rainbow shall be in the cloud, and I will look on it to remember the everlasting covenant between God and every living creature of all flesh that is on the earth.”', 'Genesis 9:16', 'rgba(28,22,48,.5)');
  // And they go out, two by two, to either side, to fill the earth. (The tortoises set out first, and are the last
  // to be gone: it does not end until they are.)
  tell('And they went out, two by two, to fill the earth.');
  sweep();
  await Promise.all(freed.map(async (f, n) => (f[0] === 'tortoise' || (await sleep(n * 550)), setOut(f, f[0] === 'tortoise' ? 11000 : 5200))));
  for (const el of family) (el.classList.remove('play'), el.getBoundingClientRect(), el.classList.add('play'));
  shine();
  await sleep(3200);
  tell();
  finish('ark'); // the map will show this story with its gold rim
  const end = overlay('<div class="card title"><h3>Noah’s Ark</h3><h1>Chapter 3 complete</h1><p>click to go back to the map</p></div>');
  end.style.background = 'rgba(28,22,48,.35)'; // the bow is still to be seen behind it
  end.classList.add('on');
  await sleep(900);
  await click(end);
}
// A pair sets out for the nearer side of the picture, and goes right off it, however wide the window is (the birds
// up and away).
function setOut([kind, pair], ms) {
  const left = pair[0].pos[0] < 1000, flies = kind === 'raven' || kind === 'dove';
  VOICE[kind]();
  return Promise.all(pair.map((a, i) => {
    a.style.setProperty('--dir', left ? -1 : 1);
    a.classList.add(flies ? 'aloft' : 'walk');
    return slide(a, (left ? -420 : 2020) + i * 70, a.pos[1] - (flies ? 420 : 0), ms + Math.abs(a.pos[0] - (left ? 0 : 1600)) * 4);
  }));
}
