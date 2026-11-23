// Scene 5: night under the stars. A rest scene, with no new line of the song and nothing to play.
// Gather sticks, lay the fire in the right order (smallest things first, leaving out what will not burn) and strike a spark, and hear the song so
// far (verses 1 to 3, together on one page) as the flock goes to sleep. Then it is dark, then morning.
import { actor, exit, sleep, click, say, tell, hush, hint, reach, lead, fade, overlay } from './engine.js';
import { cut } from './art.js';
import { land, come, gather, rise, roamer } from './land.js';
import { crackle, knock, rustle, blip } from './audio.js';
import { hear } from './harp.js';
import { cast, SONG, LORD, baa, counter, post } from './shared.js';

const W = 2600;
const FIRE = [1400, 850];
const STICKS = [[620, 900], [1050, 720], [2150, 930]];
const GREEN = [[860, 965], [1760, 715]]; // leafy branches, too green and wet to burn
const BEDS = [[1180, 800, 1], [1230, 905, 1], [1610, 790, -1], [1640, 900, -1], [1320, 960, 1]]; // round the fire, facing it
const find = roamer(W);

let sc, field, fire, sticks, greens, begun = false, lit = false, hushFire;

// Laying and lighting the fire, seen close up. A fire has to grow, so what goes on must go on smallest first: dry
// grass, then twigs, then the sticks, then a branch, then a log. They lie on the grass in no order, to be clicked,
// and among them lie two things that will not burn at all (a green branch and wet leaves). One clicked out of turn,
// or one that will not burn, only shakes, and he says why. Then two stones are struck together (three clicks) for a
// spark, and the flames grow. Nothing can go wrong, and whatever is next glows if it is left a long while.
const TUFT = 'q-10,-40 -30,-58q26,10 34,40q-2,-44 12,-70q16,30 12,70q10,-34 36,-50q-12,24 -18,68z';
const LEAFY = '<path d="M-40,-6L38,-18M-4,-10L20,-34" stroke="#7f9a58" stroke-width="9" stroke-linecap="round"/><g fill="#5f9a4a"><ellipse cx="30" cy="-34" rx="15" ry="8" transform="rotate(-40 30 -34)"/><ellipse cx="44" cy="-10" rx="15" ry="8" transform="rotate(20 44 -10)"/><ellipse cx="-34" cy="-22" rx="14" ry="7" transform="rotate(30 -34 -22)"/><ellipse cx="6" cy="-40" rx="13" ry="7" transform="rotate(-70 6 -40)"/></g>';
const wood = (d, stroke, width) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
// What burns, smallest first: [where it lies, half its width, how it looks lying there, how it looks on the fire].
const FUEL = [
  [-316, -196, 50, `<path d="M-23,36${TUFT}" fill="#d9c67a" transform="translate(0,8) scale(.72)"/>`, `<path d="M-23,42${TUFT}" fill="#d9c67a"/>`],
  [-72, -292, 62, wood('M-46,10L40,-12M-40,-10L44,6M-34,22L30,16M-22,-20L28,-26', '#c9a878', 6), wood('M-50,34L-2,-70M50,34L4,-66M-18,38L0,-58M24,38L2,-56', '#c9a878', 6)],
  [270, -292, 82, wood('M-66,12L60,-14M-58,-16L66,10M-36,28L48,22', '#dcbd8e', 14), wood('M-88,30L-4,-128M88,30L6,-122M-38,36L2,-112', '#dcbd8e', 14)],
  [262, -186, 100, wood('M-80,8L80,-8', '#8a5a37', 24) + wood('M14,-2L44,-32', '#8a5a37', 14), wood('M-134,26L-6,-180M134,26L10,-172', '#8a5a37', 26)],
  [-256, -292, 116, wood('M-84,0H84', '#6b472b', 46) + '<ellipse cx="88" rx="13" ry="22" fill="#c99b6a"/><ellipse cx="88" rx="6" ry="11" fill="none" stroke="#a67c55" stroke-width="3"/>', wood('M-170,12H170', '#6b472b', 44) + '<ellipse cx="174" cy="12" rx="12" ry="21" fill="#c99b6a"/>'],
];
// What will not burn: [where it lies, half its width, how it looks, what he says of it].
const DAMP = [
  [96, -280, 70, `<g transform="scale(1.3)">${LEAFY}</g>`, 'That branch is green and wet. It would only smoke!'],
  [-196, -190, 52, '<g fill="#4f8a4c"><ellipse cx="-18" cy="6" rx="27" ry="13" transform="rotate(-20 -18 6)"/><ellipse cx="18" cy="8" rx="27" ry="13" transform="rotate(18 18 8)"/><ellipse cy="-10" rx="27" ry="13" fill="#5f9a4a" transform="rotate(-4 0 -10)"/></g><circle cx="-8" cy="-13" r="4.5" fill="#cfeaf4"/><circle cx="22" cy="5" r="4" fill="#cfeaf4"/><circle cx="-24" cy="8" r="3.5" fill="#cfeaf4"/>', 'Those leaves are wet. They would only smoke!'],
];
const lying = ([x, y, half, drawn], more) => `<g class="fuel key" ${more} transform="translate(${x},${y})"><g>${cut(drawn, 1)}</g><ellipse rx="${half + 16}" ry="48" fill="transparent"/></g>`;
const pit = overlay(`<p class="cue"></p>
<svg class="pit" viewBox="-400 -360 800 500">
  ${cut('<rect x="-394" y="-354" width="788" height="488" rx="36" fill="#55784f"/>')}
  ${cut('<ellipse cy="52" rx="250" ry="62" fill="#6f6a66"/>', 1)}
  <circle class="heat" cy="-30" r="150" fill="#ff9a3c"/>
  ${FUEL.map(f => `<g class="laid">${cut(f[4], 1)}</g>`).reverse().join('')}
  <g class="smoke" fill="none" stroke="#e9e4f2" stroke-width="9" stroke-linecap="round"><path d="M-14,-70q-22,-34 0,-64t-4,-66"/><path d="M16,-76q20,-30 2,-58t8,-58"/></g>
  <g transform="translate(0,44) scale(1.35)"><g class="flames"><path class="flame" d="M-58,-6Q-76,-112 -14,-190Q-4,-126 28,-158Q76,-92 54,-6Z" fill="#f08a3c"/><path class="flame" d="M-28,-6Q-36,-82 4,-132Q18,-88 32,-102Q54,-56 32,-6Z" fill="#fbd36a"/></g></g>
  <circle class="ember" cy="18" r="14" fill="#ffd27a"/>
  ${cut([-222, -142, -52, 44, 134, 216].map((x, i) => `<ellipse cx="${x}" cy="${82 - Math.abs(x) / 9}" rx="${50 - (i % 2) * 6}" ry="30" fill="${i % 2 ? '#a9a39c' : '#b9b3ac'}"/>`).join(''), 1)}
  ${FUEL.map(f => lying(f, '')).join('')}${DAMP.map(d => lying(d, `data-no="${d[4]}"`)).join('')}
  <g class="flint key" transform="translate(236,-52)"><g class="a">${cut('<ellipse cx="-34" rx="30" ry="22" fill="#8f8a86" transform="rotate(-24 -34 0)"/>', 1)}</g><g class="b">${cut('<ellipse cx="34" rx="30" ry="22" fill="#77726e" transform="rotate(24 34 0)"/>', 1)}</g>
    <path class="sparks" d="M0,-30l4,10l10,4l-10,4l-4,10l-4,-10l-10,-4l10,-4zM-26,-52l3,7l7,3l-7,3l-3,7l-3,-7l-7,-3l7,-3zM24,-58l3,7l7,3l-7,3l-3,7l-3,-7l-7,-3l7,-3z" fill="#ffe27a"/><circle r="84" fill="transparent"/></g>
</svg>`);
pit.classList.add('harp');
async function kindle() {
  const svg = pit.querySelector('svg'), cue = text => (pit.querySelector('.cue').textContent = text);
  const fuel = [...svg.querySelectorAll('.fuel:not([data-no])')], laid = [...svg.querySelectorAll('.laid')].reverse(), flint = svg.querySelector('.flint');
  const jolt = el => (el.classList.remove('play'), el.getBoundingClientRect(), el.classList.add('play'));
  let on = 0, nudge; // how many things are on the fire; left a while, whatever is next glows
  const wait = next => (clearTimeout(nudge), (nudge = setTimeout(() => next.classList.add('next'), 20000)));
  cue('A fire has to grow: put the smallest thing on first. And only dry things burn!');
  pit.classList.add('on');
  wait(fuel[0]);
  await new Promise(done => (svg.onpointerdown = e => {
    const el = e.target.closest('.fuel'), k = fuel.indexOf(el);
    if (!el) return;
    if (k !== on) { // one that will not burn, or one whose turn has not come
      jolt(el);
      rustle();
      return cue(el.dataset.no ?? 'That one is too big to catch yet. Find something smaller.');
    }
    fuel[k].classList.remove('key', 'next');
    fuel[k].classList.add('gone');
    laid[k].classList.add('on');
    k < 2 ? rustle() : knock();
    if (++on === fuel.length) return done();
    cue(['Dry grass: that catches first.', 'Then little twigs.', 'Then our sticks.', 'Then the branch.'][k]);
    wait(fuel[on]);
  }));
  svg.onpointerdown = null;
  svg.classList.add('built');
  cue('Now strike the two stones together to make a spark. Click them!');
  for (const [i, said] of ['A spark! Strike again.', 'The grass is glowing. Once more!', 'We have a fire!'].entries()) {
    wait(flint);
    await click(flint);
    flint.classList.remove('next');
    jolt(flint);
    knock();
    blip(1500, 0.12);
    svg.classList.add('sparked');
    svg.style.setProperty('--breath', [0, 0.3, 1][i]);
    cue(said);
  }
  clearTimeout(nudge);
  await sleep(3000);
  pit.classList.remove('on');
}

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 53,
    sky: '#141a3c', bands: ['#1b2350', '#232c60', '#2d3870', '#3a467e'], moon: [1320, 78], stars: 34,
    far: ['#3d4a78', '#35416c'], peaks: [140, 250], mid: '#3f5a60', near: '#3b5a52',
    back: ({ cut, cypress }) => cut([[250, 560, 96], [300, 566, 70], [980, 556, 104], [1030, 562, 76], [1640, 560, 90]].map(([x, y, h]) => cypress(x, y, h, '#2f4250')).join(''), 1),
    ground: ['#7cae62', '#70a458', '#659a4e', '#5a8f45'], flowers: 120,
    trees: [[420, 640, 1.1], [1960, 646, 1.2]],
    dark: 'linear-gradient(#c9cdea,#8a92c8 28%,#4a579a 46%,#3a4a8c 58%)', // night lies heaviest on the ground
  }));
  fire = actor(field, 'fire', `<g filter="url(#paperS)"><ellipse cy="-4" rx="78" ry="26" fill="#6f6a66"/>
    ${[-64, -34, 0, 34, 64].map(x => `<ellipse cx="${x}" cy="${4 - Math.abs(x) / 9}" rx="17" ry="12" fill="#a9a39c"/>`).join('')}
    <path d="M-40,-10L34,-26M40,-10L-34,-26" stroke="#6b4a30" stroke-width="12" stroke-linecap="round"/></g>
    <g class="flames"><path class="flame" d="M-26,-22Q-34,-70 -6,-104Q-2,-76 12,-90Q34,-60 24,-22Z" fill="#f08a3c"/><path class="flame" d="M-12,-22Q-16,-56 2,-78Q8,-58 14,-64Q24,-44 14,-22Z" fill="#fbd36a"/></g>
    <ellipse cy="-30" rx="100" ry="70" fill="transparent"/>`, ...FIRE);
  sticks = STICKS.map(([x, y]) => actor(field, 'stick', '<g filter="url(#paperS)"><path d="M-38,-6L36,-16M-6,-10L16,-30" stroke="#dcbd8e" stroke-width="9" stroke-linecap="round"/></g><circle cy="-12" r="54" fill="transparent"/>', x, y));
  greens = GREEN.map(([x, y]) => actor(field, 'stick', `<g filter="url(#paperS)">${LEAFY}</g><circle cy="-16" r="56" fill="transparent"/>`, x, y));
  sc.light = () => [FIRE[0], FIRE[1] - 50];
  sc.next = next;
  exit(sc, 'left', back, false);
}

export function enter(side) {
  come(sc, field, find, side, 'night');
  if (lit) {
    hushFire = crackle();
    sc.leave = () => hushFire();
  }
  if (!begun) story();
  begun = true;
}

async function story() {
  const flock = cast.flock;
  sc.locked = true; // no wandering off while he explains
  post('Night under the stars');
  await sleep(1800);
  await say('The sun has set, and the night will be cold. Let’s make a fire.');
  await say('Dry sticks burn well. Green branches with leaves on only smoke.');
  tell('Find three dry sticks, then bring them to the ring of stones. Look all around: one is further along.');
  sc.locked = false;
  let enough = false;
  for (const g of greens)
    (async () => {
      for (;;) {
        await reach(g);
        if (enough) return;
        rustle();
        tell('That branch is green and wet. It would only smoke. Look for a dry stick.');
      }
    })();
  const count = counter();
  await Promise.all(sticks.map(async s => {
    const unring = hint(field, s.pos[0], s.pos[1] - 12, 20000); // after a while a ring shows on each one still lying, with an arrow toward any that is out of sight
    await reach(s);
    unring();
    count(s);
    s.remove();
    rustle();
  }));
  enough = true;
  tell('That is enough. Now to the ring of stones.');
  const unring = hint(field, FIRE[0], FIRE[1] - 30, 20000);
  await reach(fire, 200);
  unring();
  hush();
  knock();
  await kindle();
  lit = true;
  fire.classList.add('lit');
  sc.el.classList.add('lit');
  hushFire = crackle();
  sc.leave = () => hushFire();
  await sleep(1800);

  await say('Warm and bright! Come close, little flock.');
  sc.locked = true;
  lead([]);
  await gather(BEDS);
  await say('I will play them to sleep with our song, as far as we have come. Just listen this time.');
  await hear(SONG.slice(0, 4), 3);
  for (const s of flock) {
    s.classList.add('resting');
    baa(s, true);
    await sleep(700);
  }
  await say(`“I will both lie down in peace, and sleep; For You alone, O ${LORD}, make me dwell in safety.”<small>Psalm 4:8</small>`);

  // Everything goes dark for the night. When the picture comes back the fire is out and there is a little light: morning.
  await fade(true);
  await sleep(1600);
  lit = false;
  hushFire();
  sc.leave = null;
  fire.classList.remove('lit');
  sc.el.classList.remove('lit');
  sc.el.querySelector('.fx.dark').style.background = 'linear-gradient(#fff,#f6ded6 40%,#c9c2e0 52%,#b4b9e0 62%)'; // the dark thins
  sc.el.querySelector('.fx.glow').style.cssText = 'opacity:1;background:linear-gradient(rgba(70,80,160,.35),rgba(215,120,130,.5) 34%,rgba(255,176,120,.7) 50%,rgba(255,200,150,.2) 58%,transparent 70%)'; // and the sky warms from the horizon up
  await fade(false);
  await sleep(1200);

  rise();
  sc.locked = false;
  await say('Morning! The Lord has kept us safe all night.');
  await say('The way home goes through the valley. Stay close to me.');
  exit(sc, 'right', sc.next);
}
