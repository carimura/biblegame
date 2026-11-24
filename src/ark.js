// Noah's Ark (Genesis 6 to 9): what its scenes share. The place where the ark is built, the ark itself, Noah, and
// the animals. The ark is in every scene. It is drawn once, whole, and shows as much of itself as has been built so
// far: see "Noah's Ark" in index.html.
import { actor, control, arrive, speaker, show, fx, layer, sleep, fade, overlay, html } from './engine.js';
import { cut, sheep } from './art.js';
import { land, roamer } from './land.js';
import { tick, bleat, moo, roar, trumpet, maa, caw, coo, thunder } from './audio.js';
import { build as stage, rank, sheet, scrap, put, waves, lay, sea, light } from './theatre.js';

export const W = 3200, ARK = [1600, 646]; // how wide the place is, and where the middle of the ark's keel rests
export const find = roamer(W); // Noah may go anywhere on the ground before the ark
export let sc, below, field, ark, noah, berths;
let lights, bolts;

const n = Math.round, box = (x, y, w, h) => `M${x},${y}h${w}v${h}h${-w}Z`;
// Half the hull's length at a height above the keel: it is fuller above than below, and planked in five strakes.
const hx = y => n(520 + 130 * (1 - (1 - y / 280) ** 2));
const WOOD = ['#d6ae78', '#cba06a'];

// The door and the window, each drawn about its own middle: as they lie waiting, and as they sit in the ark.
export const DOOR = cut(`<path d="${box(-60, -85, 120, 170)}" fill="#b98a55"/><path d="M-30,-85v170M0,-85v170M30,-85v170" stroke="#8a6445" stroke-width="3"/><path d="${box(-60, -62, 120, 16)}${box(-60, 44, 120, 16)}" fill="#8a6445"/>`, 1);
export const SHUTTER = cut(`<path d="${box(-45, -30, 90, 60)}" fill="#8a6445"/><path d="${box(-36, -21, 72, 42)}" fill="#33261f"/><path d="M-36,-21L36,21M36,-21L-36,21M0,-21V21" stroke="#b98a55" stroke-width="4"/>`, 1);

// Where the parts of the ark go: [what goes there, which of its places this is, how high above the keel its middle
// is, its outline]. The door and the window each have one place that is wrong (scene 1).
const PLACES = [
  ['deck', 0, 110, box(-604, -120, 1208, 20)], ['deck', 1, 280, box(-650, -290, 1300, 20)], ['deck', 2, 375, box(-560, -385, 1120, 20)],
  ['door', 'side', 195, box(-60, -280, 120, 170)], ['door', 'top', 520, box(-60, -552, 120, 64)],
  ['window', 'low', 55, box(-45, -85, 90, 60)], ['window', 'high', 425, box(-45, -455, 90, 60)],
  ['roof', 0, 512, 'M-600,-470L-520,-555H520L600,-470Z'],
];

// The ark, from the side, about the middle of its keel: a hull of two storeys, a house on it for the third, and a
// roof. Back to front: the blocks it is built on, its bare frame, the decks and roof, the planking (`skin`), the
// doorway with its ramp, the door and window, and the outlines of the places where parts go.
function arkArt() {
  const strake = (k, d) => `<g filter="url(#paper)" style="--k:${k}"><path d="${d}" fill="${WOOD[k % 2]}"/></g>`;
  const end = s => [1, 2, 3, 4, 5].map(k => `L${s * hx(k * 56)},${-k * 56}`).join('');
  const along = (from, step, f) => Array.from({ length: (-2 * from) / step + 1 }, (_, i) => f(from + i * step)).join('');
  return cut(`<path d="${[-430, -150, 90, 370].map(x => box(x, -6, 60, 36)).join('')}" fill="#7d6a55"/>`, 1) +
    cut(`<path fill="none" stroke="#b08a5a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" d="M-520,-6H520${end(1)}M-520,-6${end(-1)}M-650,-280H650${along(-480, 120, x => `M${x},-6L${n(x * 1.22)},-280`)}${along(-560, 140, x => `M${x},-280V-470L${n(x * 0.93)},-555`)}M-560,-470H560M-521,-555H521"/>`) +
    cut(PLACES.slice(0, 3).map(([, k, , d]) => `<path class="fit deck d${k}" d="${d}" fill="#e3c08a"/>`).join('')) +
    cut(`<g class="fit roof"><path d="${PLACES[7][3]}" fill="#74492c"/><path d="${box(-520, -562, 1040, 13)}" fill="#5f3a22"/></g>`) +
    `<g class="skin">${[0, 1, 2, 3, 4].map(k => strake(k, `M${-hx(k * 56)},${-k * 56}H${hx(k * 56)}L${hx(k * 56 + 56)},${-k * 56 - 56}H${-hx(k * 56 + 56)}Z`)).join('')}${[0, 1, 2].map(k => strake(k + 5, box(-560, -344 - k * 63, 1120, 64))).join('')}</g>` +
    `<path class="hole" d="${box(-60, -280, 120, 170)}" fill="#33261f"/>` +
    `<g class="ramp">${cut(`<path d="M-60,-110H60L330,66H170Z" fill="#b98a55"/><path d="${[0.14, 0.3, 0.46, 0.62, 0.78, 0.94].map(t => `M${n(-60 + 230 * t)},${n(-110 + 176 * t)}H${n(60 + 270 * t)}`).join('')}" stroke="#8a6445" stroke-width="6"/>`)}</g>` +
    `<g transform="translate(0,-195)"><g class="fit door">${DOOR}</g></g><g transform="translate(0,-425)"><g class="fit window">${SHUTTER}</g></g>` +
    PLACES.map(p => `<path class="berth" d="${p[3]}"/>`).join('');
}

// Noah, standing on (0,0): an old man with a white beard, a long coat and a staff. Like David he is drawn twice,
// `front` for when he stands and `side` (facing right) for when he walks, and kept plain on purpose. He is drawn
// small, so that the ark is great beside him.
export function noahArt() {
  const skin = '#c58d66', white = '#f4efe6', coat = '#66788f', robe = '#e9dcc0', staff = 'fill="none" stroke="#7b5a3d" stroke-width="8" stroke-linecap="round"';
  const leg = `<rect x="-6" y="-30" width="11" height="26" fill="${skin}"/><rect x="-7" y="-8" width="21" height="9" rx="4" fill="#5d4330"/>`;
  const piece = shapes => cut(`<g class="face">${shapes}</g>`, 1); // turns round with the way he walks
  return `<g class="bob"><g transform="scale(.72)"><g class="front">
  ${cut(`<path d="M-52,0V-236" ${staff}/><rect x="-19" y="-8" width="20" height="9" rx="4" fill="#5d4330"/><rect x="2" y="-8" width="20" height="9" rx="4" fill="#5d4330"/>`, 1)}
  ${cut(`<path d="M-30,-160Q0,-174 30,-160L42,-12Q0,-4 -42,-12Z" fill="${robe}"/>`, 1)}
  ${cut(`<path d="M-32,-162L-10,-168L-19,-14L-46,-18ZM32,-162L10,-168L19,-14L46,-18Z" fill="${coat}"/>`, 1)}
  ${cut(`<path d="M-29,-152Q-50,-128 -52,-104M29,-152Q46,-124 34,-98" fill="none" stroke="${skin}" stroke-width="12" stroke-linecap="round"/>`, 1)}
  ${cut(`<circle cy="-190" r="25" fill="${skin}"/><path d="M-25,-188Q-29,-140 0,-122Q29,-140 25,-188Q13,-171 0,-173Q-13,-171 -25,-188Z" fill="${white}"/><path d="M-26,-188a26,26 0 0 1 52,0q-6,-16 -16,-18q-10,4 -20,0q-10,2 -16,18z" fill="${white}"/>
    <circle cx="-9" cy="-190" r="2.5" fill="#2b1f1a"/><circle cx="9" cy="-190" r="2.5" fill="#2b1f1a"/>`, 1)}
  </g><g class="side">
  ${piece(`<g class="leg b">${leg}</g>`)}
  ${piece(`<g class="leg">${leg}</g>`)}
  ${piece(`<path d="M-17,-160Q0,-172 17,-160L27,-14Q0,-6 -27,-14Z" fill="${robe}"/><path d="M-19,-162L7,-168L3,-12L-29,-16Z" fill="${coat}"/>`)}
  ${piece(`<g class="stick"><path d="M40,0V-236" ${staff}/></g>`)}
  ${piece(`<g class="stick"><path d="M2,-150Q22,-140 38,-122" fill="none" stroke="${skin}" stroke-width="12" stroke-linecap="round"/></g>`)}
  ${piece(`<circle cx="2" cy="-190" r="25" fill="${skin}"/><ellipse cx="27" cy="-187" rx="5" ry="4" fill="${skin}"/><path d="M-23,-194a25,25 0 0 1 42,-17q-12,2 -17,13q-12,0 -14,15q-7,-2 -11,-11z" fill="${white}"/><path d="M-10,-178Q-8,-138 24,-124Q36,-150 25,-178Q10,-166 -10,-178Z" fill="${white}"/>
    <circle cx="14" cy="-191" r="2.5" fill="#2b1f1a"/>`)}
  </g></g></g>`;
}

// The animals. Every kind is drawn facing right and standing on (0,0): [its drawing, how wide and how high it is
// to click]. Legs are in a group of their own, so that they trot as the sheep's do.
const legs = (xs, h, w, fill) => `<g class="legs" fill="${fill}">${xs.map(x => `<rect x="${x}" y="${-h}" width="${w}" height="${h + 1}" rx="${w / 3}"/>`).join('')}</g>`;
const eye = (x, y, fill = '#2b1f1a') => `<circle cx="${x}" cy="${y}" r="2.6" fill="${fill}"/>`;
const lion = mane => [legs([-54, -40, 28, 42], 42, 13, '#c8922f') +
  '<path d="M-60,-80C-88,-92 -98,-68 -88,-50" fill="none" stroke="#c8922f" stroke-width="6" stroke-linecap="round"/><circle cx="-88" cy="-46" r="8" fill="#8a5a2a"/><rect x="-64" y="-94" width="124" height="54" rx="24" fill="#d9a441"/>' +
  (mane ? '<circle cx="62" cy="-90" r="39" fill="#8a5a2a"/>' : '<circle cx="50" cy="-110" r="8" fill="#d9a441"/><circle cx="80" cy="-112" r="8" fill="#d9a441"/>') +
  `<circle cx="68" cy="-88" r="24" fill="#e2b356"/>${eye(77, -92)}<path d="M90,-86l8,4l-8,4z" fill="#3b2f2a"/>`, 190, 140];
const bird = (body, wing, beak, look) => [legs([-4, 4], 10, 2.6, '#7a5a3a') +
  `<path d="M-16,-20L-42,-23L-34,-11Z" fill="${body}"/><ellipse cy="-20" rx="21" ry="13" fill="${body}" transform="rotate(-14 0 -20)"/><circle cx="18" cy="-33" r="10" fill="${body}"/><path d="M26,-37L39,-32L26,-28Z" fill="${beak}"/>
  <path class="pinion" d="M-13,-25Q2,-39 15,-22Q2,-11 -13,-25Z" fill="${wing}"/>${eye(21, -35, look)}`, 110, 90];
const KINDS = {
  goat: [legs([-30, -18, 12, 24], 34, 8, '#6b5a4c') +
    '<path d="M-34,-54L-50,-74L-38,-46Z" fill="#e4d9c6"/><ellipse cy="-48" rx="42" ry="21" fill="#efe6d6"/><path d="M24,-52L42,-86L56,-78L42,-38Z" fill="#efe6d6"/>' +
    '<path d="M44,-92Q32,-116 12,-110M53,-92Q44,-120 24,-122" fill="none" stroke="#8a7a66" stroke-width="5" stroke-linecap="round"/>' +
    `<ellipse cx="57" cy="-83" rx="17" ry="11" fill="#efe6d6" transform="rotate(24 57 -83)"/><path d="M62,-73L60,-50L51,-71Z" fill="#d9ccb5"/><ellipse cx="40" cy="-89" rx="9" ry="4.5" fill="#d9ccb5" transform="rotate(-30 40 -89)"/>${eye(61, -86)}`, 140, 130],
  ox: [legs([-54, -40, 28, 42], 44, 13, '#cdbfa6') +
    '<path d="M-62,-92C-82,-88 -80,-60 -76,-50" fill="none" stroke="#8a6a4c" stroke-width="5" stroke-linecap="round"/><circle cx="-76" cy="-46" r="6" fill="#5b4530"/><rect x="-66" y="-102" width="128" height="62" rx="24" fill="#f0e6d2"/>' +
    '<ellipse cx="-22" cy="-86" rx="22" ry="12" fill="#8a6a4c"/><ellipse cx="22" cy="-58" rx="15" ry="9" fill="#8a6a4c"/><path d="M60,-112C52,-130 62,-138 70,-134M86,-112C96,-130 86,-138 78,-134" fill="none" stroke="#8a6a3c" stroke-width="5" stroke-linecap="round"/>' +
    `<rect x="50" y="-116" width="48" height="46" rx="16" fill="#f0e6d2"/><ellipse cx="90" cy="-80" rx="13" ry="10" fill="#e9b9a6"/>${eye(76, -98)}`, 190, 150],
  lion: lion(true),
  lioness: lion(false),
  elephant: [legs([-80, -52, 30, 58], 72, 26, '#8d8d9c') +
    '<path d="M-98,-124C-118,-114 -116,-86 -112,-74" fill="none" stroke="#8d8d9c" stroke-width="6" stroke-linecap="round"/><ellipse cx="-8" cy="-112" rx="96" ry="60" fill="#9c9cab"/><circle cx="82" cy="-130" r="44" fill="#9c9cab"/>' +
    '<path d="M112,-128C142,-104 134,-52 120,-22L106,-24C116,-60 116,-92 96,-106Z" fill="#9c9cab"/><path d="M104,-100q16,12 26,2q-10,14 -28,8z" fill="#f4efe6"/>' +
    `<ellipse cx="58" cy="-126" rx="30" ry="44" fill="#85859a"/>${eye(97, -142)}`, 270, 190],
  giraffe: [legs([-40, -26, 20, 34], 124, 11, '#dfb85a') +
    '<path d="M-50,-150C-64,-140 -62,-116 -58,-104" fill="none" stroke="#dfb85a" stroke-width="5" stroke-linecap="round"/><circle cx="-58" cy="-100" r="5" fill="#7a4f2a"/><ellipse cx="-2" cy="-140" rx="54" ry="30" fill="#e9c46a" transform="rotate(-8 -2 -140)"/>' +
    '<g fill="#b5793a"><circle cx="-28" cy="-140" r="9"/><circle cx="-2" cy="-152" r="8"/><circle cx="8" cy="-128" r="9"/><circle cx="30" cy="-146" r="7"/></g>' +
    '<g class="neck"><path d="M24,-150L66,-290L86,-284L54,-126Z" fill="#e9c46a"/><g fill="#b5793a"><circle cx="46" cy="-170" r="7"/><circle cx="57" cy="-208" r="6"/><circle cx="68" cy="-248" r="6"/></g>' +
    `<path d="M74,-304v-16M85,-306v-16" stroke="#7a4f2a" stroke-width="4" stroke-linecap="round"/><ellipse cx="92" cy="-296" rx="25" ry="12" fill="#e9c46a" transform="rotate(-10 92 -296)"/><ellipse cx="66" cy="-299" rx="9" ry="4.5" fill="#dfb85a"/>${eye(97, -300)}</g>`, 190, 340],
  tortoise: [legs([-28, 16], 16, 12, '#8aa55c') +
    `<path d="M-40,-18L-55,-10L-40,-9Z" fill="#9ab56a"/><rect x="30" y="-29" width="14" height="10" fill="#9ab56a"/><ellipse cx="47" cy="-25" rx="14" ry="10" fill="#9ab56a"/>${eye(53, -28)}` +
    '<path d="M-40,-14A40,36 0 0 1 40,-14Z" fill="#6f8a48"/><path d="M-22,-14L-12,-40L12,-46L28,-30M-12,-40L-2,-14M12,-46L14,-14" fill="none" stroke="#526b33" stroke-width="3"/><rect x="-42" y="-19" width="84" height="7" rx="3.5" fill="#c9b37a"/>', 130, 80],
  raven: bird('#2f2b33', '#45404b', '#6b6670', '#f4efe6'),
  dove: bird('#f6f1e6', '#e2dccf', '#d9a06a'),
};
// What each kind is called, and its voice (a giraffe and a tortoise have next to none).
export const NAMES = { elephant: 'elephants', ox: 'oxen', giraffe: 'giraffes', lion: 'lions', sheep: 'sheep', goat: 'goats', tortoise: 'tortoises', raven: 'ravens', dove: 'doves' };
export const VOICE = { sheep: () => bleat(205 + Math.random() * 40), goat: maa, ox: moo, lion: roar, elephant: trumpet, giraffe: tick, tortoise: tick, raven: caw, dove: coo };
export function creature(kind) {
  if (kind === 'sheep') return sheep('', 0.78);
  const [art, w, h] = KINDS[kind];
  return `<g class="bob">${cut(`<g class="face">${art}</g>`, 1)}<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h + 6}" fill="transparent"/></g>`;
}

// Build the place: a dry, dusty country (bright colour is kept back in this story, until the end), the ark on its
// blocks, and Noah before it.
export function build() {
  ({ sc, below, field } = land({
    W, seed: 301,
    sky: '#cfd8d6', bands: ['#d8ddd2', '#e3e0cd', '#ecdfc0', '#f1dcb0'], sun: [420, 170, 56, '#fbeec4'], clouds: '#f4eedd',
    far: ['#b3ab9a', '#c2b792'], haze: 'rgba(240,224,180,.4)', mid: '#b5ad7e', near: '#a9a46f',
    ground: ['#b7ae76', '#aca36c', '#a19862', '#958c58'], flowers: 0,
    trees: [[330, 640, 1.05], [2890, 644, 1.15]],
    under: () => `<g class="ark" transform="translate(${ARK})">${arkArt()}</g>`,
  }));
  for (const t of sc.el.querySelectorAll('.tree')) t.classList.remove('wonder'); // there is nothing to find in the trees here: a click on one is a click on the ground
  // Storm clouds, which gather as the sky darkens, with two bolts of lightning under them: far off, behind the hills.
  const cloud = (x, y, s, fill) => `<path transform="translate(${x},${y}) scale(${s})" d="M-180,-40H180q46,8 34,40q-12,30 -58,22q-22,30 -72,18q-30,26 -80,8q-40,22 -84,-2q-44,6 -56,-30q-50,-6 -44,-56z" fill="${fill}"/>`;
  const bolt = x => `<g class="bolt" transform="translate(${x},150)">${cut('<path d="M0,0L-44,120H-8L-52,260L60,96H18L52,0Z" fill="#fffdf2" stroke="#f0bf2e" stroke-width="6" stroke-linejoin="round"/>', 1)}</g>`;
  sc.el.querySelector('.drift').after(layer(0, bolt(170) + bolt(1430) +
    cut('<rect x="-100" y="-220" width="2200" height="250" fill="#737b8a"/>' + cloud(240, 70, 2.6, '#7b8392') + cloud(1010, 44, 3, '#737b8a') + cloud(1760, 80, 2.6, '#7b8392')) + cut(cloud(600, 118, 1.9, '#8a919e') + cloud(1420, 128, 2, '#8a919e')), 'thunderhead'));
  fx('', 'gloom'); // the sky darkens as the flood draws near (`--gloom`)
  fx('', 'rain'); // and then it rains (`--rain`)
  fx('', 'glare'); // and lightning lights it
  lights = sc.el.querySelectorAll('.gloom,.glare');
  bolts = sc.el.querySelectorAll('.bolt');
  ark = below.querySelector('.ark');
  const outlines = ark.querySelectorAll('.berth');
  berths = PLACES.map(([kind, k, h], i) => ({ kind, k, h, el: outlines[i], fit: ark.querySelector(kind === 'deck' ? `.d${k}` : `.fit.${kind}`) }));
  noah = actor(field, 'david noah', noahArt(), 1420, 780); // (`david` is what every walked figure is: it turns him side-on as he walks)
  noah.tall = 178;
  noah.speed = 260; // there is a great deal of ground to cover here
  show(sc);
}
// Lightning, and its thunder after it (`near`: how loud). For a moment the gloom lifts and everything is lit, and a
// bolt stands on whichever side of the picture the ark is not.
export function strike(near) {
  for (const el of [...lights, bolts[+(ARK[0] * sc.zoom - sc.cam < 800)]]) (el.classList.remove('on'), el.getBoundingClientRect(), el.classList.add('on'));
  sleep(700).then(() => thunder(near));
}
// The ark as it stands when its building is done.
export function built() {
  for (const b of berths) b.fit.classList.add('in');
  ark.classList.add('planked', 'pitched');
}
// Noah comes on at (x, y): he is the one who is walked, and who speaks. If he is here already, from the scene
// before, he stays where he is: one scene runs on into the next without a break.
let here;
export function enter(x, y) {
  if (here) return;
  here = true;
  control(noah, find);
  speaker(noah);
  arrive(x, y);
}

// The camera flies in at something (the door of the ark, or the ark on the sea) until that is all there is to see:
// we are going inside. It stays there until `out`, which puts the picture back as it was behind a moment of dark.
// (It used to draw back out the way it went in, and that looked wrong.)
const world = document.getElementById('world');
export async function into(el) {
  const b = el.getBoundingClientRect(), w = world.getBoundingClientRect();
  world.style.transformOrigin = `${b.left + b.width / 2 - w.left}px ${b.top + b.height / 2 - w.top}px`;
  world.style.transform = 'scale(9)';
  await sleep(1000);
}
export async function out() {
  await fade(true);
  world.style.transition = 'none';
  world.style.transform = world.style.transformOrigin = '';
  world.getBoundingClientRect();
  world.style.transition = '';
  fade(false);
}

// One of Noah's family, standing on (0,0): a plain figure in a long coat, bare-headed or with a head cloth.
export const person = (coat, hair, cloth) => `<g class="bob"><g transform="scale(.7)">${cut(`<rect x="-19" y="-8" width="20" height="9" rx="4" fill="#5d4330"/><rect x="2" y="-8" width="20" height="9" rx="4" fill="#5d4330"/><path d="M-28,-158Q0,-172 28,-158L40,-12Q0,-4 -40,-12Z" fill="${coat}"/><circle cy="-188" r="24" fill="#c58d66"/>` +
  (cloth ? `<path d="M-27,-186a27,27 0 0 1 54,0L34,-128Q0,-146 -34,-128Z" fill="${hair}"/><circle cy="-185" r="18" fill="#c58d66"/>` : `<path d="M-25,-190a25,25 0 0 1 50,0q-12,-13 -25,-11q-13,-2 -25,11z" fill="${hair}"/>`) +
  '<circle cx="-7" cy="-186" r="2.4" fill="#2b1f1a"/><circle cx="7" cy="-186" r="2.4" fill="#2b1f1a"/>', 1)}</g></g>`;

// ---- The inside of the ark, cut open (scenes 3 and 5) ----
// Ten stalls on three decks, [deck (0 the lowest), side (0 left), column], and one more that is two decks high, for
// the giraffes. `pens` is the stall each pair stands in: as scene 2 leaves them, in a muddle. `RIGHT` is one way
// that is right; `HEAVY` is what each pair weighs. The hay is kept by stall 0 and the water by stall 2; stalls 7 and
// 8 are the two under the window.
export const STALLS = [[0, 0, 0], [0, 1, 2], [0, 1, 3], [1, 0, 0], [1, 1, 2], [1, 1, 3], [2, 0, 0], [2, 0, 1], [2, 1, 2], [2, 1, 3]];
export const HEAVY = { elephant: 5, ox: 4, giraffe: 3, lion: 3, sheep: 2, goat: 2, tortoise: 1, raven: 1, dove: 1 };
export const pens = { elephant: 0, ox: 2, lion: 5, sheep: 1, goat: 3, tortoise: 7, raven: 6, dove: 4 };
export const RIGHT = { elephant: 2, ox: 0, lion: 3, sheep: 4, goat: 5, tortoise: 1, raven: 7, dove: 8 };
export const settle = () => Object.assign(pens, RIGHT);
const LEFT = [200, 480, 840, 1120], FLOOR = [710, 480, 300], HIGH = [230, 180, 130], SIZE = { elephant: 0.8, ox: 0.92, giraffe: 1, lion: 0.92, sheep: 1.15, goat: 1.05, tortoise: 1.1, raven: 1.3, dove: 1.3 };
// A stall's place in the picture: [left, top, width, height]. (Stall 10 is the tall one.)
const pen = k => (k === 10 ? [480, 300, 280, 410] : [LEFT[STALLS[k][2]], FLOOR[STALLS[k][0]] - HIGH[STALLS[k][0]], 280, HIGH[STALLS[k][0]]]);
let hull;
// The picture, made the first time it is wanted. It gives back the screen it is on (`el`), its drawing (`svg`), `cue`
// to say something over it, and `place` to stand every pair in its stall as `pens` has it.
export function hold() {
  if (hull) return hull;
  const pair = kind => [kind, kind === 'lion' ? 'lioness' : kind].map((k, i) => `<g transform="translate(${i ? 34 : -34},${i ? -5 : 0}) scale(${SIZE[kind]})">${creature(k)}</g>`).join('');
  const el = overlay(`<p class="cue long"></p>
<svg class="hold" viewBox="0 0 1600 900"><g class="keel">
  ${cut(`<path d="${[330, 770, 1210].map(x => box(x, 772, 60, 34)).join('')}" fill="#7d6a55"/>`, 1)}
  ${cut('<path d="M150,160H1450V690Q1450,772 1370,772H230Q150,772 150,690Z" fill="#6f5239"/>')}
  <path d="${box(200, 170, 1200, 548)}" fill="#dcc393"/><path d="${box(760, 170, 80, 548)}" fill="#cdb181"/>
  <path d="M782,180V712M818,180V712${Array.from({ length: 15 }, (_, i) => `M782,${204 + i * 36}H818`).join('')}" fill="none" stroke="#8a6445" stroke-width="7" stroke-linecap="round"/>
  ${cut(`<path d="${box(200, 294, 1200, 12)}${box(200, 474, 280, 12)}${box(760, 474, 640, 12)}${box(200, 704, 1200, 14)}${[475, 755, 835, 1115].map(x => box(x, 170, 10, 540)).join('')}" fill="#a67c55"/>`)}
  ${cut('<path d="M110,162L230,84H1370L1490,162Z" fill="#74492c"/>')}<g transform="translate(800,124)">${SHUTTER}</g>
  ${Object.keys(HEAVY).map(kind => `<g class="lot" data-kind="${kind}">${pair(kind)}<g fill="#fbf3df">${Array.from({ length: HEAVY[kind] }, (_, i) => `<circle cx="${(i - (HEAVY[kind] - 1) / 2) * 17}" cy="12" r="6"/>`).join('')}</g></g>`).join('')}
  ${cut('<path d="M204,704q-2,-40 26,-52q30,-8 44,14q14,14 12,38z" fill="#e3c45c"/><path d="M222,700l8,-34M244,700l2,-40M266,700l-6,-30" stroke="#b8963a" stroke-width="3" stroke-linecap="round"/>', 1)}
  ${cut([1326, 1362].map(x => `<rect x="${x}" y="652" width="32" height="52" rx="9" fill="#9a6b3f"/><path d="M${x},666h32M${x},690h32" stroke="#5b4530" stroke-width="4"/><ellipse cx="${x + 16}" cy="655" rx="12" ry="4.5" fill="#8cc3e0"/>`).join(''), 1)}
  ${Array.from({ length: 11 }, (_, k) => `<path class="dark" d="${box(...pen(k))}"/><path class="pen" data-k="${k}" d="${box(...pen(k))}"/>`).join('')}
</g><text class="sum" x="480" y="866"></text><text class="sum" x="1120" y="866"></text><g class="tally" transform="translate(628,828)"></g></svg>`);
  el.classList.add('harp');
  const svg = el.querySelector('svg'), lots = [...svg.querySelectorAll('.lot')];
  const place = () => lots.forEach(l => {
    const [x, y, w, h] = pen(l.dataset.kind === 'giraffe' ? 10 : pens[l.dataset.kind]);
    l.style.transform = `translate(${x + w / 2}px,${y + h - 8}px)`;
    l.style.setProperty('--dir', x < 800 ? 1 : -1); // every pair faces the ladder
  });
  place();
  return (hull = { el, svg, place, cue: text => (el.firstChild.textContent = text) });
}

// ---- The ark on the waters (scenes 4 to 8) ----
// From the flood on, the story is told on the paper theatre that Creation is told on: one picture, 1600x900, with the
// six waves of the deep. Behind them the country the ark was built in, which the flood covers, and the mountains
// that are seen again as it goes down; among them the ark, small. `level` is where the face of the sea lies.
export let boat, country, peaks;
// The ark as she is seen on the waters: small, from the side, about the middle of her keel.
export const HULL = cut('<path d="M-200,-70H200Q196,-10 160,0H-160Q-196,-10 -200,-70Z" fill="#6f5239"/><rect x="-172" y="-128" width="344" height="60" fill="#664a33"/><path d="M-188,-126L-160,-156H160L188,-126Z" fill="#74492c"/><rect class="hatch" x="-18" y="-70" width="36" height="46" fill="#b98a55"/><rect x="-14" y="-118" width="28" height="18" fill="#33261f"/>');
// Rain, wherever it falls in this chapter (`.rain` in index.html): two sheets of short streaks, the nearer ones longer
// and faster, each a picture made here once that repeats.
const drops = (n, long, wide) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'>${Array.from({ length: n }, (_, i) => {
  const x = (i * 97 + 31) % 360, y = (i * 139 + 17) % 360, l = long * (0.6 + ((i * 53) % 10) / 14);
  return [0, -360].map(d => `<path d='M${x},${y + d}v${l.toFixed(0)}' stroke='#eaf2f8' stroke-width='${wide}' stroke-linecap='round' opacity='${(0.35 + ((i * 29) % 10) / 22).toFixed(2)}'/>`).join('');
}).join('')}</svg>`)}")`;
document.documentElement.style.setProperty('--far', drops(26, 26, 2));
document.documentElement.style.setProperty('--near', drops(15, 54, 3.2));
// The mountains: Ararat's broad top on the left, where the ark comes to rest, and three lower tops to the right of it.
const MOUNT = 'M-300,900L60,700L240,590H610L760,740L900,690L1000,765L1130,660L1250,775L1380,700L1500,750L1900,880V1100H-300Z';
let storm, wet, tidemark = 940, berth = [820, 0];
export function waters() {
  stage();
  light(1);
  storm = sheet('<rect x="-300" y="-200" width="2200" height="1300" fill="#566170"/>', 'storm', rank.sky);
  country = sheet(cut('<path d="M-300,520Q100,470 500,512T1300,500T1900,520V1100H-300Z" fill="#b7ae76"/>') + cut('<path d="M-300,640Q300,600 800,640T1900,630V1100H-300Z" fill="#a19862"/>'), '', rank.land);
  peaks = sheet(cut(`<path d="${MOUNT}" fill="#8f8474"/>`) + cut(`<path class="green" d="${MOUNT}" fill="#8fb45f"/>`) +
    cut('<path d="M240,590H610L700,668Q420,636 150,654Z" fill="#fff" opacity=".16"/>') + cut('<path class="green" d="M-300,1100V830Q200,770 700,806T1500,780T1900,806V1100Z" fill="#7da35a"/>'), 'peaks', rank.land);
  rank.water.insertBefore(peaks, waves[3]); // before the far waves, behind the near ones
  boat = scrap(`<g>${HULL}<circle class="key" cy="-80" r="150" fill="transparent"/></g>`, 240, rank.water, 'boat');
  rank.water.insertBefore(boat, waves[4]);
  wet = rank.works.parentNode.appendChild(html('<div class="wash rain"></div>'));
  peaks.style.opacity = 0;
  picture({ level: 940, x: 820, rest: 566, storm: 0, rain: 0 });
}
// Once the flood has covered it, the old country is gone; the mountains lie under the water until it goes down.
export function drowned() {
  country.remove();
  peaks.style.opacity = 1;
}
// Set the picture, at once: where the sea lies, where along it the ark is, how dark the storm and how hard the rain,
// and whether the ark rides the water or rests (`rest`: how high its keel stands). What is not given stays as it was.
export function picture({ level = tidemark, x = berth[0], rest = berth[1], storm: s, rain }) {
  tidemark = level;
  berth = [x, rest];
  sea(level);
  [0, 1, 2].forEach(k => lay(waves[k], level - 60 + k * 20)); // the pale waves lie behind, as the far sea
  put(boat, x, rest || level + 88);
  boat.classList.toggle('riding', !rest);
  if (s !== undefined) storm.style.opacity = s;
  if (rain !== undefined) wet.style.opacity = rain;
}
