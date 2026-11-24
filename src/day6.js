// The sixth day: the animals, and people. Genesis 1:24–31.
// Four animals, of the three sorts the verse names (cattle: an ox and a sheep; a creeping thing; a beast of the
// earth), have their twelve parts mixed. Click any two parts (or carry one onto another) and they change places: a head can be put where a tail
// goes, so they can be mixed worse before they are put right. An animal that comes to stand whole, all of its own
// kind and the right way round, gives a jump and makes its sound, to a chord on the harp; it is done when all four
// stand whole. Then they are on the land. The people are a picture to be sewn: a card with holes in it, a man and a
// woman hand in hand marked on it in dotted lines, and one long thread. The thread goes from hole to hole along a
// line, and along no line twice; and it will only get along every line if it begins at one of the two hands that
// hold no other hand, and finishes each part of the picture before it leaves it. Sewn, the two stand on the land
// with the animals: cut plain from paper, with no faces.
import { sleep, leap } from './engine.js';
import { cut } from './art.js';
import { music, knock, tick, pluck, shine, bleat, moo, roar } from './audio.js';
import { rank, sheet, gone, verse, tell, days, patience, solved, pairs } from './theatre.js';
import { dusk } from './day1.js';

// Each stands on (0,0), faces right, and is 300 wide: so that any one's hindquarters, middle and forequarters (each
// a third of that) will join on to any other's.
const leg = (x, fill, hoof = '') => `<rect x="${x}" y="-50" width="22" height="50" rx="6" fill="${fill}"/>${hoof && `<rect x="${x}" y="-10" width="22" height="10" rx="4" fill="${hoof}"/>`}`;
const BEASTS = [
  // an ox
  '<path d="M-100,-96C-126,-90 -124,-52 -118,-38" fill="none" stroke="#8a6a4c" stroke-width="7" stroke-linecap="round"/><circle cx="-117" cy="-33" r="8" fill="#5b4530"/>' +
    leg(-94, '#e3d6bf', '#5b4530') + leg(-68, '#f3ead8', '#5b4530') + leg(42, '#e3d6bf', '#5b4530') + leg(68, '#f3ead8', '#5b4530') +
    '<rect x="-102" y="-108" width="190" height="66" rx="22" fill="#f3ead8"/><path d="M-66,-108q32,28 64,0z" fill="#8a6a4c"/><ellipse cx="-6" cy="-60" rx="24" ry="13" fill="#8a6a4c"/>' +
    '<path d="M92,-120C84,-142 96,-152 106,-146M124,-120C134,-142 122,-152 112,-146" fill="none" stroke="#8a6a3c" stroke-width="7" stroke-linecap="round"/><rect x="78" y="-124" width="64" height="60" rx="20" fill="#f3ead8"/><ellipse cx="128" cy="-78" rx="18" ry="14" fill="#e9b9a6"/><circle cx="112" cy="-102" r="3.5" fill="#3b2f2a"/>',
  // a tortoise
  '<path d="M-92,-54L-120,-40L-92,-42Z" fill="#9ab56a"/><rect x="-86" y="-46" width="30" height="46" rx="10" fill="#8aa55c"/><rect x="50" y="-46" width="30" height="46" rx="10" fill="#8aa55c"/>' +
    '<rect x="78" y="-70" width="34" height="20" fill="#9ab56a"/><ellipse cx="118" cy="-66" rx="30" ry="20" fill="#9ab56a"/><circle cx="128" cy="-72" r="3.5" fill="#3b2f2a"/>' +
    '<path d="M-98,-46A94,84 0 0 1 90,-46Z" fill="#6f8a48"/><path d="M-52,-46L-32,-104L20,-116L62,-88L78,-46M-32,-104L-6,-46M20,-116L30,-46" fill="none" stroke="#526b33" stroke-width="5"/><rect x="-100" y="-54" width="192" height="12" rx="6" fill="#c9b37a"/>',
  // a lion
  '<path d="M-98,-86C-130,-98 -142,-72 -130,-52" fill="none" stroke="#c8922f" stroke-width="9" stroke-linecap="round"/><circle cx="-130" cy="-48" r="11" fill="#8a5a2a"/>' +
    leg(-96, '#c8922f') + leg(-70, '#d9a441') + leg(44, '#c8922f') + leg(70, '#d9a441') +
    '<rect x="-100" y="-106" width="186" height="64" rx="26" fill="#d9a441"/><circle cx="98" cy="-98" r="48" fill="#8a5a2a"/><circle cx="106" cy="-94" r="30" fill="#e2b356"/><circle cx="116" cy="-101" r="3.5" fill="#3b2f2a"/><path d="M128,-90l9,4l-9,5z" fill="#3b2f2a"/>',
  // a sheep
  leg(-90, '#4a3f3a') + leg(-66, '#5b4f48') + leg(46, '#4a3f3a') + leg(70, '#5b4f48') + '<circle cx="-108" cy="-84" r="13" fill="#efe6d2"/>' +
    `<ellipse cx="-6" cy="-80" rx="96" ry="40" fill="#f7f1e3"/>${[-88, -54, -20, 14, 48, 80].map(x => `<circle cx="${x}" cy="-112" r="21" fill="#f7f1e3"/><circle cx="${x - 4}" cy="-50" r="19" fill="#f7f1e3"/>`).join('')}` +
    '<ellipse cx="116" cy="-92" rx="27" ry="21" fill="#5b4f48"/><ellipse cx="94" cy="-100" rx="14" ry="7" fill="#4a3f3a" transform="rotate(-28 94 -100)"/><circle cx="98" cy="-116" r="15" fill="#f7f1e3"/><circle cx="124" cy="-98" r="3.5" fill="#f7f1e3"/>',
];
const HOME = [[350, 565], [1010, 632], [700, 566], [215, 566]]; // where each stands on the land in the end
// The sound each makes: the ox, the tortoise (a knock or two on its shell), the lion, the sheep.
export const VOICE = [moo, () => (knock(), setTimeout(knock, 170)), roar, () => bleat(215)];
const PAIR = [590, 512]; // and the two people: cut from one piece of paper, joined at the hand
const DOLLS = cut('<circle cx="34" cy="-104" r="13"/><path d="M0,-82L24,-88Q34,-92 44,-88L68,-82V-72L46,-74L56,-4H12L22,-74L0,-72Z"/><circle cx="-34" cy="-104" r="13"/><path d="M-68,-82L-44,-88Q-34,-92 -24,-88L0,-82V-72L-22,-74V-44L-14,0H-28L-34,-34L-40,0H-54L-46,-44V-74L-68,-72Z"/>', 1);
// The card to be sewn. Its holes: the man's (his free hand first), the hand the two hold between them, and the
// woman's (her free hand last). And its lines, each from one hole to another: two of them run between a neck and
// the top of a head, the two sides of the head. At every hole but the two free hands an even number of lines meet,
// so a thread that is to go along every line once has to begin at one free hand and end at the other.
const HOLES = [[520, 465], [590, 375], [640, 348], [640, 276], [690, 375], [595, 495], [640, 495], [685, 495], [590, 620], [690, 620], [800, 450],
  [910, 375], [960, 348], [960, 276], [1010, 375], [925, 485], [995, 485], [875, 620], [1045, 620], [1080, 465]];
const LINES = [[0, 1], [1, 2], [2, 3], [2, 3], [2, 4], [1, 5], [4, 7], [1, 7], [4, 5], [5, 6], [6, 7], [5, 8], [8, 6], [6, 9], [9, 7], [4, 10],
  [10, 11], [11, 12], [12, 13], [12, 13], [12, 14], [11, 15], [14, 16], [11, 16], [14, 15], [15, 16], [15, 17], [17, 18], [18, 16], [14, 19]];

let living;

// The animals, parts mixed, on a card. There are twelve places, three to an animal, hindquarters first; and the
// parts are numbered the same way, so the first animal's own are 0, 1 and 2. `lie[n]` is the part lying in place n.
const ways = list => (list.length < 2 ? [list] : list.flatMap((v, i) => ways(list.filter((_, j) => j !== i)).map(rest => [v, ...rest])));
async function sort() {
  const lie = [8, 10, 3, 0, 5, 11, 9, 7, 2, 4, 1, 6], X = [440, 680, 920, 1160];
  const card = sheet(`<defs>${[0, 1, 2].map(k => `<clipPath id="third${k}"><rect x="${-150 + k * 100}" y="-180" width="100" height="190"/></clipPath>`).join('')}</defs>
    ${cut('<rect x="290" y="330" width="1020" height="330" rx="30" fill="#efe3c8"/>')}${'<g class="key"></g>'.repeat(12)}`, 'fresh', rank.works);
  const parts = [...card.querySelectorAll('.key')];
  let picked = null;
  const draw = () => parts.forEach((g, n) => {
    const k = lie[n] % 3; // which part of its animal lies here (0: its hindquarters)
    g.setAttribute('transform', `translate(${X[(n / 3) | 0] + ((n % 3) - k) * 80},${n === picked ? 556 : 570}) scale(.8)`);
    g.innerHTML = cut(`<g clip-path="url(#third${k})">${BEASTS[(lie[n] / 3) | 0]}</g>`, 1) + `<rect x="${-150 + k * 100}" y="-180" width="100" height="190" fill="transparent"/>`;
  });
  // Any animal may stand in any of the four places. As things lie: which animal each place had best be given, so
  // that the most parts lie right already; with how many those are, first.
  const best = () => ways([0, 1, 2, 3]).map(who => [lie.filter((part, n) => part === who[(n / 3) | 0] * 3 + (n % 3)).length, who]).sort((a, b) => b[0] - a[0])[0];
  const whole = () => [0, 3, 6, 9].filter(n => lie[n] % 3 === 0 && lie[n + 1] === lie[n] + 1 && lie[n + 2] === lie[n] + 2); // where an animal stands whole: the first of its three places
  // An animal that has just been made whole gives a jump and makes its sound, to a small chord of its own.
  const hail = (n, who) => {
    for (const g of parts.slice(n, n + 3)) (g.classList.add('hop'), setTimeout(() => g.classList.remove('hop'), 700));
    [293.66, 369.99, 440, 587.33, 739.99, 880].slice(who, who + 3).forEach((f, i) => setTimeout(pluck, i * 60, f, 0.4));
    VOICE[who]();
  };
  draw();
  tell('Every animal is to be according to its kind. But these are all mixed up! Click any two parts, or carry one onto another, and they change places.');
  const help = patience([
    () => tell('Find the lion’s head, and put it at the front of one place. Which middle is the same colour? Which back legs? Two are pale: the sheep is woolly all over, and the ox is smooth, with brown patches.'),
    () => (([, who], n = lie.findIndex((part, n) => part !== who[(n / 3) | 0] * 3 + (n % 3))) => [n, lie.indexOf(who[(n / 3) | 0] * 3 + (n % 3))].forEach(n => parts[n].classList.add('next')))(best()), // the first place with the wrong part in it, and the part that belongs there
  ]);
  const last = await new Promise(done => (leap(() => (lie.sort((a, b) => a - b), (picked = null), draw(), done(0))), pairs(card, parts, n => { // (the short cut: every part in its place)
    let made = [];
    for (const g of parts) g.classList.remove('next');
    if (picked === null || picked === n) picked = picked === null ? n : null; // take a part up, or put it down again
    else {
      const was = best()[0], stood = whole();
      [lie[picked], lie[n]] = [lie[n], lie[picked]];
      picked = null;
      knock();
      best()[0] > was || help.tried();
      made = whole().filter(n => !stood.includes(n));
      made.forEach((n, i) => setTimeout(hail, i * 900, n, lie[n] / 3)); // (one move can make two whole: they take turns)
    }
    draw();
    if (best()[0] === 12) done(made.length);
  }, () => parts[picked])));
  card.onpointerdown = null;
  help.stop();
  tell('');
  await sleep(last * 900 + 700); // the animals made whole by the last move are heard first
  solved();
  await sleep(1800);
  gone(card);
}

// Sew the picture of the two people. A click on a hole puts the needle in it; after that, a click on the next hole
// along a line sews that line. "Go back" pulls the last stitch back out, one for each click (and after the last, the needle).
async function sew() {
  const seam = ([a, b], i) => (twin => `<path class="stitch" d="M${HOLES[a]}${twin < 0 ? 'L' : `A36,36 0 0 ${+(twin < i)} `}${HOLES[b]}"/>`)(LINES.findIndex((l, j) => j !== i && l + '' === a + ',' + b)); // (a head: its two lines bend, one each way)
  const card = sheet(cut('<rect x="430" y="222" width="740" height="446" rx="30" fill="#efe3c8"/>') + LINES.map(seam).join('') +
    HOLES.map(p => `<g class="key" transform="translate(${p})"><circle r="22" fill="transparent"/><circle r="7" fill="#5b4530"/></g>`).join('') +
    `<g class="key" transform="translate(800,262)">${cut('<rect x="-76" y="-20" width="152" height="40" rx="12" fill="#fbf3df"/>', 1)}<text y="7">Go back</text></g>`, 'fresh sewing', rank.works);
  const seams = [...card.querySelectorAll('.stitch')], holes = [...card.querySelectorAll('.key')], back = holes.pop();
  let at = null, guide = 0; // the hole the needle is in; and how much is shown as help (1: where to begin; 2: every next hole as well)
  const path = []; // the stitches, in order: [the line, the hole it was sewn from]
  const sewn = i => path.some(s => s[0] === i), far = (i, h) => LINES[i][+(LINES[i][0] === h)]; // (`far`: the other end of a line)
  const bare = h => LINES.map((_, i) => i).filter(i => !sewn(i) && LINES[i].includes(h)); // the lines at a hole that are not sewn yet
  // Whether all that is still bare (leaving out line `but`) could be sewn in one go from hole `h`: it must all hang
  // together with `h`, and no hole may have an odd number of bare lines but `h` and one other.
  const can = (h, but) => {
    const left = LINES.filter((_, i) => i !== but && !sewn(i)), odd = HOLES.map((_, n) => n).filter(n => left.filter(l => l.includes(n)).length % 2);
    if (odd.length && !(odd.length === 2 && odd.includes(h))) return false;
    const seen = new Set([h]);
    for (const n of seen) for (const [a, b] of left) (a === n && seen.add(b)), (b === n && seen.add(a));
    return left.every(([a]) => seen.has(a));
  };
  // What to click next, for showing as help: with the needle out, a hole it can be begun from; then the hole to sew
  // on to; or, if it can no longer be finished from where the needle is, "Go back" (given here as the needle's own hole).
  const lead = () => (at === null ? HOLES.findIndex((_, h) => can(h)) : can(at) ? far(bare(at).find(i => can(far(i, at), i)), at) : at);
  const draw = () => {
    const show = path.length < LINES.length && guide > +!!path.length ? lead() : -1;
    seams.forEach((s, i) => s.classList.toggle('sewn', sewn(i)));
    holes.forEach((g, h) => (g.classList.toggle('next', h === show && h !== at), g.classList.toggle('needle', h === at)));
    back.classList.toggle('next', show === at && at !== null);
    back.style.display = at === null || path.length === LINES.length ? 'none' : ''; // (not wanted until the needle is in, nor once all is sewn)
  };
  draw();
  tell('A man and a woman, to be sewn with one long thread: along every dotted line, and never along the same line twice. Click a hole to begin there.');
  const help = patience([
    () => tell('Stuck again! Go back to the very beginning, and this time begin at a hole where only one line ends. And sew each part all the way round before the thread leaves it.'),
    () => (guide = 1),
    () => (guide = 2),
  ], 2);
  await new Promise(done => (leap(() => (path.splice(0, 30, ...LINES.map((_, i) => [i, 0])), (at = 19), draw(), done())), card.onpointerdown = e => { // (the short cut: every line sewn)
    const key = e.target.closest('.key'), h = holes.indexOf(key);
    if (!key) return;
    if (key === back) (at = path.length ? path.pop()[1] : null), tick(); // the last stitch is pulled back out (or, nothing sewn, the needle)
    else if (at === null) (at = h), tick(), tell('Now click the next hole along a dotted line, and the next. “Go back” pulls the last stitch out again.');
    else if (h !== at) {
      const i = bare(at).find(i => far(i, at) === h);
      if (i === undefined) tell(LINES.some(l => l.includes(at) && l.includes(h)) ? 'That line is sewn already. The thread goes along each line only once.' : 'The thread goes along a dotted line, from one hole to the next one on it.');
      else {
        path.push([i, at]);
        at = h;
        tick();
        if (path.length < LINES.length && !bare(at).length) (tell('The thread can go no further, and some lines are still bare. Go back a few stitches and try another way, or all the way back to begin at another hole.'), help.tried());
      }
    }
    draw();
    if (path.length === LINES.length) done();
  }));
  card.onpointerdown = null;
  help.stop();
  solved();
  tell('It is sewn: one thread, all the way round!');
  await sleep(2600);
  tell('');
  gone(card);
}

// The animals on the land.
function roam() {
  living = sheet(BEASTS.map((b, i) => `<g class="beast" transform="translate(${HOME[i]}) scale(.5)">${cut(b, 1)}</g>`).join(''), 'daylit fresh', rank.land);
}
function stand() {
  const people = living.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
  people.setAttribute('class', 'dolls fresh');
  people.setAttribute('transform', `translate(${PAIR})`);
  people.innerHTML = DOLLS + '<rect x="-70" y="-120" width="140" height="124" fill="transparent"/>';
}

// Jump past this day, for starting at a later one: the animals on the land, and the two people.
export function skip() {
  roam();
  stand();
  days(6);
}

export async function play() {
  music('beasts');
  await sleep(1200);
  await verse('Then God said, “Let the earth bring forth the living creature according to its kind: cattle and creeping thing and beast of the earth, each according to its kind”; and it was so.', 'Genesis 1:24');
  await sort();
  roam();
  await sleep(2600);
  await verse('And God made the beast of the earth according to its kind, cattle according to its kind, and everything that creeps on the earth according to its kind. And God saw that it was good.', 'Genesis 1:25');
  await verse('Then God said, “Let Us make man in Our image, according to Our likeness; let them have dominion over the fish of the sea, over the birds of the air, and over the cattle, over all the earth and over every creeping thing that creeps on the earth.”', 'Genesis 1:26');
  await sew();
  stand();
  shine();
  await sleep(3200);
  await verse('So God created man in His own image; in the image of God He created him; male and female He created them.', 'Genesis 1:27');
  await verse('Then God saw everything that He had made, and indeed it was very good.', 'Genesis 1:31');
  tell('Evening is coming. Press and hold the handle to wind the great wheel round.');
  await dusk();
  tell('');
  await sleep(1500);
  await verse('So the evening and the morning were the sixth day.', 'Genesis 1:31');
  days(6, true);
}
