// The third day: dry land, and plants. Genesis 1:9–13.
// Earth and water lie mixed together: twelve pieces of paper in four piles, on a card. A click on a pile and then
// on another moves the top piece across (or it is carried there); but water lies only on water, and earth only on earth (or in an empty
// place), and a pile holds four. When all four pieces of water lie in one pile the waters are gathered together into
// one place, and in the picture the sea goes down and the dry land comes up out of it: four hills. (The land has
// lain under the sea since the day began, to be seen through the water.) Then seeds: three to begin with, one of
// each kind the verse names. A seed let go on dry ground grows, and a plant that is clicked gives a seed of its own
// kind, so the land is planted from the plants themselves. A hill turns green when all three kinds grow on it.
import { sleep, when, leap } from './engine.js';
import { rnd, cut, olive } from './art.js';
import { music, lap, knock, sprout, splash, pluck, STRINGS } from './audio.js';
import { rank, waves, lay, float, tide, sheet, piece, slide, gone, carry, under, verse, tell, days, patience, solved, pairs } from './theatre.js';
import { dusk } from './day1.js';

// The hills, back to front: [where its top is across the picture, how high it stands in the end, bare, grown green].
const HILLS = [[470, 430, '#dcc7a2', '#a9c98a'], [170, 480, '#cfb48a', '#98bd78'], [780, 505, '#c2a176', '#88b068'], [1070, 560, '#b68f63', '#79a35a']];
const UNDER = 700, SHORE = 730; // a hill's top while it lies under the sea; and where the face of the sea lies in the end
// The piles as they lie to begin with, each from the bottom up (0: earth, 1: water). Ten moves at the least; and a
// script that tried every way of going on from here found none that cannot still be finished.
const PILES = ['0110', '1000', '1000', ''];
const PIECE = [
  '<rect x="-82" y="-31" width="164" height="62" rx="16" fill="#b68f63"/><path d="M-48,-8h.1M-14,10h.1M22,-10h.1M52,8h.1" stroke="#8a6a4c" stroke-width="9" stroke-linecap="round"/>',
  '<rect x="-82" y="-31" width="164" height="62" rx="16" fill="#4b90b8"/><path d="M-56,8q22,-16 44,0M12,-2q22,-16 44,0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>',
].map(art => cut(art, 1));
// The three kinds: [the plant, its seed]. Both are drawn standing on (0,0).
const tree = olive(rnd(5), 0.4) + cut([[-34, -98], [14, -114], [42, -88], [-8, -80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#c8432f"/>`).join(''), 1);
const KINDS = [
  [cut('<path d="M-20,0q-7,-26 -15,-37q18,7 22,26q0,-31 9,-48q11,20 9,48q7,-20 24,-29q-9,13 -13,40z" fill="#6fa04e"/>', 1), '<ellipse rx="7" ry="13" fill="#d9c67a" transform="rotate(20)"/>'],
  [cut('<path d="M0,0C-2,-30 2,-50 0,-78" fill="none" stroke="#6a8f3f" stroke-width="5"/><path d="M0,-30q-22,-6 -28,-22q20,-2 28,12zM0,-46q22,-6 28,-22q-20,-2 -28,12z" fill="#7aa348"/><ellipse cy="-94" rx="11" ry="21" fill="#e2b84e"/>', 1), '<circle r="10" fill="#e2b84e"/>'],
  [tree, '<path d="M0,-15Q13,-4 0,15Q-13,-4 0,-15Z" fill="#7a4a2a"/>'],
];
const GROWN = [[0, 360, 500], [1, 430, 455], [2, 540, 490], [0, 90, 520], [1, 245, 545], [2, 160, 510], [0, 780, 530], [1, 840, 570], [2, 690, 550], [0, 990, 600], [1, 1130, 625], [2, 1070, 590]]; // a planted land, for starting at a later day: [kind, x, y]

let hills, tray, help, full = false;
const loose = new Set();

export function build() {
  sheet('<rect x="-300" y="800" width="2200" height="400" fill="#2c5f88"/>', 'daylit', rank.land); // the deep, under the clear sea (and over the lower half of the great wheel)
  hills = HILLS.map(([x, , bare]) => sheet(cut(`<path class="land ground" d="M-400,190H${x - 330}C${x - 170},190 ${x - 150},0 ${x},0C${x + 150},0 ${x + 190},420 ${x + 330},420V1000H-400Z" fill="${bare}"/>`), 'daylit', rank.land));
  for (const h of hills) (lay(h, UNDER), (h.kinds = new Set())); // (`kinds`: what grows on it)
  rank.land.style.visibility = 'hidden'; // until the third day there is no land to be seen
}

// Whether the top piece of pile `i` may go onto pile `j`: there must be room, and it lies only on its own kind.
const fits = (lie, i, j) => i !== j && lie[i] && lie[j].length < 4 && (!lie[j] || lie[j].at(-1) === lie[i].at(-1));
// The shortest way from how the piles lie to all the water in one of them: how many moves, and the first of them.
function way(piles) {
  const seen = new Set([piles.join()]);
  for (const queue = [[piles, 0]]; ; ) {
    const [lie, far, first] = queue.shift();
    if (lie.includes('1111')) return [far, first];
    lie.forEach((a, i) => lie.forEach((b, j) => {
      const next = fits(lie, i, j) && lie.map((c, k) => (k === i ? a.slice(0, -1) : k === j ? b + a.at(-1) : c));
      if (next && !seen.has(next.join())) (seen.add(next.join()), queue.push([next, far + 1, first ?? [i, j]]));
    }));
  }
}
// Gather the waters into one place: the piles of earth and water, on a card.
async function gather() {
  let piles = PILES, from = null, shown; // `from`: the pile whose top piece is taken up; `shown`: a move pointed out as help
  const card = sheet(cut('<rect x="290" y="302" width="1020" height="366" rx="30" fill="#efe3c8"/>') + [440, 680, 920, 1160].map(x => `<g class="key" transform="translate(${x},632)"></g>`).join(''), 'fresh', rank.works);
  const places = [...card.querySelectorAll('.key')];
  const draw = () => places.forEach((g, i) => {
    g.classList.toggle('next', !!shown && i === shown[+(from === shown[0])]); // the pile to take from, and once that is taken up, the one to put it on
    g.innerHTML = '<rect x="-96" y="-296" width="192" height="306" rx="20" fill="#dccdaa"/>' + [...piles[i]].map((kind, k) => `<g transform="translate(0,${-36 - k * 68 - (i === from && k === piles[i].length - 1 ? 18 : 0)})">${PIECE[kind]}</g>`).join('');
  });
  draw();
  tell('Earth and water lie all mixed together. Gather all the water into one place! Click a pile, then another, and the top piece moves across. Or carry the piece there.');
  help = patience([() => tell('To get at a piece that lies underneath, first move what is on top of it somewhere else.'), () => ((shown = way(piles)[1]), draw())]);
  await new Promise(done => (leap(() => ((piles = ['1111', '0000', '0000', '']), (from = shown = null), draw(), done())), pairs(card, places, i => { // (the short cut: sorted)
    if (from === null || i === from) from = from === null && piles[i] ? i : null; // take up the top piece of a pile, or put it down again
    else {
      const was = way(piles)[0], wet = +piles[from].at(-1);
      if (fits(piles, from, i)) {
        piles = piles.map((c, k) => (k === from ? c.slice(0, -1) : k === i ? c + wet : c));
        (wet ? lap : knock)();
      } else tell(piles[i].length > 3 ? 'That pile is full: it holds four.' : 'Water lies only on water, and earth only on earth. Or in an empty place.');
      from = shown = null;
      way(piles)[0] < was || help.tried(); // (a move that brings it no nearer)
    }
    draw();
    if (piles.includes('1111')) done();
  }, () => from !== null && places[from].lastElementChild)));
  card.onpointerdown = null;
  help.stop();
  solved();
  tell('The waters are gathered together into one place!');
  await sleep(1800);
  gone(card);
  tell('');
  splash();
  await settle(3200);
}
// The land as it stands in the end, and the sea gathered below it.
const settle = ms => Promise.all([...hills.map((h, i) => float(h, HILLS[i][1], ms)), tide(SHORE, ms)]);

// A plant of one of the three kinds, growing where it is put (on whichever hill is there). Clicked, it gives a
// seed of its own kind, until the land is planted. A hill that has all three kinds growing on it turns green.
function plant(kind, x, y) {
  const hill = under(x, y, '.land')?.closest('svg');
  if (!hill || y > waves[3].level - 6) return;
  hill.insertAdjacentHTML('beforeend', `<g class="plant key" transform="translate(${x | 0},${(y - hill.level) | 0})"><g class="grow">${KINDS[kind][0]}</g></g>`);
  const grown = hill.lastChild;
  grown.addEventListener('pointerdown', e => {
    if (full || loose.size > 3) return;
    e.stopPropagation();
    seed(kind, x + 40, y - 50);
    sprout();
  });
  if (hill.kinds.add(kind).size === 3) hill.querySelector('.land').setAttribute('fill', HILLS[hills.indexOf(hill)][3]);
  return grown;
}
// A loose seed. Let go over dry ground it is planted there; anywhere else it goes back where it came from.
function seed(kind, x, y, hx = x, hy = y) {
  const s = piece(cut(KINDS[kind][1], 1) + '<circle class="key" r="34" fill="transparent"/>', x, y, 40);
  loose.add(s);
  carry(s, () => {
    const kinds = () => hills.reduce((sum, h) => sum + h.kinds.size, 0), had = kinds();
    if (!plant(kind, ...s.pos)) return tell('A seed needs dry ground.'), slide(s, hx, hy);
    loose.delete(s);
    s.remove();
    pluck(STRINGS[kind + 1], 0.4);
    kinds() > had || help.tried(); // (that hill had one of its kind already)
  });
}
async function sow() {
  tray = sheet(cut('<rect x="30" y="762" width="300" height="118" rx="24" fill="#efe3c8"/>'), 'fresh', rank.works);
  [0, 1, 2].forEach(kind => seed(kind, 95 + kind * 85, 822));
  tell('Three seeds, one of each kind: grass, a herb that bears seed, and a fruit tree. Carry each one to dry ground.');
  leap(() => { // (the short cut: no seed left lying, and every hill given the kinds it lacks)
    loose.forEach(s => s.remove());
    loose.clear();
    for (const [kind, x, y] of GROWN) under(x, y, '.land')?.closest('svg').kinds.has(kind) || plant(kind, x, y);
  });
  await when(() => !loose.size);
  tell('Every plant has its seed in itself. Click a plant, and it gives you a seed of its own kind. A hill turns green when all three kinds grow on it. Make every hill green!');
  help = patience([() => tell('Which hill is still bare earth? Look at what grows on it already, and bring it a seed of each kind it lacks.')], 3);
  await when(() => hills.every(h => h.kinds.size > 2));
  help.stop();
  solved();
  tell('');
  gone(tray);
  loose.forEach(gone);
  planted();
}
// The land is planted: its plants give no more seeds.
function planted() {
  full = true;
  for (const h of hills) for (const grown of h.querySelectorAll('.plant')) grown.classList.remove('key');
}
function appear() {
  rank.land.style.visibility = '';
  for (const k of [3, 4, 5]) waves[k].classList.add('sea'); // from now on the sea can be seen into
}

// Jump past this day, for starting at a later one: the land up, planted and green.
export function skip() {
  appear();
  settle(0);
  for (const g of GROWN) plant(...g);
  planted();
  days(3);
}

export async function play() {
  music('land');
  appear();
  await sleep(2400);
  await verse('Then God said, “Let the waters under the heavens be gathered together into one place, and let the dry land appear”; and it was so.', 'Genesis 1:9');
  await gather();
  await verse('And God called the dry land Earth, and the gathering together of the waters He called Seas. And God saw that it was good.', 'Genesis 1:10');
  await verse('Then God said, “Let the earth bring forth grass, the herb that yields seed, and the fruit tree that yields fruit according to its kind, whose seed is in itself, on the earth”; and it was so.', 'Genesis 1:11');
  await sow();
  await verse('And the earth brought forth grass, the herb that yields seed according to its kind, and the tree that yields fruit, whose seed is in itself according to its kind. And God saw that it was good.', 'Genesis 1:12');
  tell('Evening is coming. Press and hold the handle to wind the great wheel round.');
  await dusk();
  tell('');
  await sleep(1500);
  await verse('So the evening and the morning were the third day.', 'Genesis 1:13');
  days(3, true);
}
