// Noah's Ark, scene 7: the raven and the dove. Genesis 8:6–12.
// The ark rests on the mountain, with water all round it. A click opens the window, and the raven goes out, to and
// fro across the sky for the rest of the scene. Then the dove, three times, and the player flies her. It is kept as plain as it can be: a click on the dove
// sends her out; she then follows the pointer, wherever it goes over the picture; and a click anywhere asks her to
// come down there. She never goes anywhere by herself, and she is never hidden: between her flights she sits at the
// window, in plain sight.
// The first time there is only water, wherever she is asked to come down (three tries), and she is brought home.
// Seven days pass. The second time three treetops stand out of the water, a palm, a fig and an olive, each named as
// she alights on it; from the olive she plucks a leaf, and is brought home with it. Seven days more; the third time
// there is dry ground, and where she alights she stays. Each seven days is seen going by: the sun goes over the sky
// and down, and the moon after it, seven times round.
import { stage, sleep, tween, smooth, when, tap, clamp } from './engine.js';
import { rnd, cut, olive } from './art.js';
import { knock, splash, music } from './audio.js';
import { verse, patience, tell, rank, sheet, scrap, put, slide, gone, at, light, lighten } from './theatre.js';
import { boat, peaks, picture, creature, VOICE } from './ark.js';

const HOME = [425, 478]; // the window of the ark
const TREES = [[900, 690, 'palm'], [1130, 660, 'fig'], [1380, 700, 'olive']]; // where each tree stands (its foot), left to right
const TOP = { palm: 118, fig: 96, olive: 92 }; // how far above its foot a bird perches
const GROUND = [[150, 790], [700, 684], [830, 716], [1010, 756], [1250, 770], [1450, 728], [1560, 770]]; // places to alight, once the land is dry
const SAID = {
  palm: 'This is a palm tree: its leaves are great fans. Not the olive. Try another tree!',
  fig: 'This is a fig tree: its leaves are broad, like hands. Not the olive. Try another tree!',
};
let trees, dove, raven, ring, aim = HOME, asked = null, out = false;

// The trees whose tops stand out of the water, the two birds, and a ring to show where to click next.
function make() {
  const leaf = (x, y, turn) => `<path transform="translate(${x},${y}) rotate(${turn})" d="M0,0Q34,-22 78,-6Q40,10 0,0Z" fill="#6f9a52"/>`;
  trees = sheet(
    `<g transform="translate(900,690)">${cut('<path d="M-7,10Q4,-50 -3,-100L7,-100Q14,-50 9,10Z" fill="#8a6a4c"/>' + [-150, -115, -80, -45, -10, 25].map(t => leaf(2, -100, t)).join(''), 1)}</g>` +
    `<g transform="translate(1130,660)">${cut('<path d="M-8,10Q-2,-30 -4,-56L8,-56Q8,-30 10,10Z" fill="#6e5645"/><circle cx="-26" cy="-62" r="30" fill="#4f7a45"/><circle cx="24" cy="-66" r="32" fill="#4f7a45"/><circle cx="0" cy="-86" r="30" fill="#5f8a52"/><path d="M-30,-66l10,-12l4,12l10,-8M16,-70l10,-12l4,12l10,-8M-6,-90l8,-10l4,10l8,-6" fill="none" stroke="#3f6338" stroke-width="3"/>', 1)}</g>` +
    `<g transform="translate(${TREES[2][0]},${TREES[2][1] + 6})">${olive(rnd(5), 0.36)}</g>`, 'trees', rank.land);
  trees.style.opacity = 0;
  // (a bird is turned to face the way it flies inside its paper, by `--dir`: paper that is itself turned comes out black)
  const bird = kind => scrap(`<g transform="scale(1.35)">${creature(kind)}${kind === 'dove' ? '<g class="face"><path class="sprig" d="M34,-44Q52,-56 64,-46Q50,-38 34,-44Z" fill="#7d9070"/></g><circle class="touch" cy="-28" r="54" fill="transparent"/>' : ''}</g>`, 90, rank.works, 'fowl ' + kind);
  raven = bird('raven');
  dove = bird('dove');
  for (const b of [raven, dove]) (put(b, ...HOME), (b.style.opacity = 0));
  ring = scrap('<circle r="44" fill="none" stroke="#ffe29a" stroke-width="7"/>', 60, rank.works, 'beckon');
  stage.addEventListener('pointermove', e => (aim = at(e)));
  stage.addEventListener('pointerdown', e => out && (asked = at(e)));
}
// Show the ring at a place (or, given nothing, put it away).
const beckon = (x, y) => (x === undefined ? ring.classList.remove('on') : (put(ring, x, y), ring.classList.add('on')));
// The picture as this scene leaves it, with the waters at `level`.
function scenery(level) {
  trees.style.opacity = 1;
  picture({ level, storm: 0 });
}

// One flight of the dove. A click on her sends her out; then she follows the pointer, no lower than `low` (the
// water, or the ground, is below), until a click asks her to come down. If the click is near one of `perches`
// ([x, y, what it is]) she alights on it; if not, she comes down where `floor` says, for a click at that place
// (as it is, straight down to the water). `land` is told where, and what (if anything) is there, and says whether
// the flight is over. If it is not, she is up again and following.
async function fly(low, perches, land, floor = ([x]) => [clamp(x, 40, 1560), low + 26]) {
  let pos = [...dove.pos], last = performance.now(), down = null;
  const touch = dove.querySelector('.touch'); // (she can be clicked only while she waits to be sent)
  dove.style.opacity = 1;
  touch.style.cssText = 'pointer-events:auto;cursor:pointer';
  beckon(...HOME);
  await tap(touch);
  touch.style.cssText = '';
  beckon();
  VOICE.dove();
  [out, asked] = [true, null];
  dove.classList.add('aloft');
  await when(() => {
    const now = performance.now(), dt = Math.min(50, now - last) / 1000;
    last = now;
    if (asked && !down) {
      down = perches.find(p => Math.hypot(p[0] - asked[0], p[1] - asked[1]) < 80) ?? floor(asked);
    }
    asked = null;
    const [tx, ty] = down ?? [clamp(aim[0], 40, 1560), clamp(aim[1], 60, low)], dx = tx - pos[0], dy = ty - pos[1], d = Math.hypot(dx, dy), step = Math.min(d, 460 * dt);
    if (d > 2) pos = [pos[0] + (dx / d) * step, pos[1] + (dy / d) * step];
    if (Math.abs(dx) > 6) dove.style.setProperty('--dir', dx < 0 ? -1 : 1);
    put(dove, ...pos);
    if (!down || d > 2) return false;
    put(dove, down[0], down[1]);
    const over = land(down);
    down = null;
    return over;
  });
  out = false;
  dove.classList.remove('aloft');
}
// Seven days go by, counted. The sun and the moon go round the sky, always opposite each other, about a middle that
// lies below the sea: from noon the sun goes down on the right, the moon comes up on the left and over, and the sun
// after it. The light goes with the sun.
const ROUND = [800, 760], REACH = 560;
async function week() {
  const orbs = ['<circle r="66" fill="#f8d77a" opacity=".45"/>' + cut('<circle r="42" fill="#f6c54a"/>', 1), cut('<path transform="scale(3.2)" d="M0,-14a14,14 0 1 0 10,24a11,11 0 1 1 -10,-24z" fill="#fdf1cf"/>', 1)].map(art => scrap(art, 80, rank.sky, 'orb'));
  const turn = t => {
    orbs.forEach((o, i) => put(o, ROUND[0] - REACH * Math.cos((t + 0.25 + i / 2) * 2 * Math.PI), ROUND[1] - REACH * Math.sin((t + 0.25 + i / 2) * 2 * Math.PI)));
    light(0.25 + 0.75 * clamp(2.5 * Math.sin((t + 0.25) * 2 * Math.PI), 0, 1)); // (dark by the time the sun is right down in the sea)
  };
  turn(0);
  tell('He waited yet another seven days.');
  await sleep(900);
  for (let n = 1; n <= 7; n++) {
    await tween(1600, k => turn(n - 1 + k));
    tell('He waited yet another seven days. ' + '●'.repeat(n));
  }
  await sleep(900);
  orbs.forEach(gone);
  tell();
}

// Jump past this scene, for starting further on: the waters nearly gone, the trees standing clear.
export function skip() {
  make();
  scenery(860);
}

export async function play() {
  music('olive');
  make();
  await verse('So it came to pass, at the end of forty days, that Noah opened the window of the ark which he had made.', 'Genesis 8:6');
  tell('The ark rests on the mountain, and there is water all round it. Click the ark, to open its window.');
  await tap(boat.querySelector('.key'));
  knock();
  tell();
  // The raven goes out, and keeps going to and fro.
  raven.style.opacity = 1;
  raven.classList.add('aloft');
  VOICE.raven();
  await tween(2600, k => put(raven, HOME[0] + 500 * k, HOME[1] - 260 * Math.sin(k * 2.2)), smooth);
  // (to and fro, turning at each end: it is turned inside its paper, as the dove is)
  (async () => {
    for (let dir = 1; raven.isConnected; dir = -dir) {
      raven.style.setProperty('--dir', dir);
      await slide(raven, dir > 0 ? 1480 : 620, 170 + Math.random() * 130, 7000);
    }
  })();
  await verse('Then he sent out a raven, which kept going to and fro until the waters had dried up from the earth.', 'Genesis 8:7');
  await verse('He also sent out from himself a dove, to see if the waters had receded from the face of the ground.', 'Genesis 8:8');

  // First: water everywhere, and nowhere to rest.
  const home = [...HOME, 'ark'];
  const WATER = ['Only water here. She cannot rest on water! Try somewhere else.', 'Water here too. Try once more, further off.', 'Water, as far as she can see. There is nowhere to rest: bring her home. Click the window of the ark.'];
  let tries = 0;
  tell('Now the dove, at the window. Click her, to send her out. She will follow your pointer: click where she should try to come down.');
  do await fly(600, [home], p => {
    if (p[2]) return tries > 2 || (tell('She is back at the window. But she has not looked far yet: click her, and send her out over the water.'), true);
    splash();
    tell(WATER[Math.min(2, tries++)]);
    if (tries > 2) beckon(...HOME);
    return false;
  });
  while (tries < 3);
  beckon();
  await sleep(900);
  tell();
  await verse('But the dove found no resting place for the sole of her foot, and she returned into the ark to him, for the waters were on the face of the whole earth. So he put out his hand and took her, and drew her into the ark to himself.', 'Genesis 8:9');
  await week();

  // Second: treetops, and an olive among them.
  await verse('And he waited yet another seven days, and again he sent the dove out from the ark.', 'Genesis 8:10');
  trees.style.transition = 'opacity 4s';
  trees.style.opacity = 1;
  await tween(5000, k => picture({ level: 640 + 100 * k, storm: 0.3 - 0.3 * k }), smooth);
  const tops = TREES.map(([x, y, kind]) => [x, y - TOP[kind], kind]), tree = tops[2];
  // After two trees that are not the olive, the olive is ringed.
  const help = patience([() => beckon(tree[0], tree[1])], 2);
  let leaf = false;
  tell('The waters have gone down, and three treetops stand out of them. One is an olive tree. Click the dove to send her out, then click a treetop.');
  do await fly(712, [home, ...tops], p => {
    if (p[2] === 'olive') {
      leaf = true;
      dove.classList.add('laden');
      knock();
      tell('The olive tree! Its leaves are small and narrow. She plucks one. Now bring her home with it: click the window of the ark.');
      beckon(...HOME);
    } else if (p[2] === 'ark') return leaf || (tell('She is back at the window, with nothing. Click her, and send her to a treetop.'), true);
    else if (p[2]) leaf || (tell(SAID[p[2]]), help.tried());
    else (splash(), tell(leaf ? 'Not here: this is water. Bring her home, to the window of the ark.' : 'Only water there. Click a treetop!'));
    return false;
  });
  while (!leaf);
  beckon();
  await sleep(900);
  tell();
  await lighten(0.45, 2500); // evening
  await verse('Then the dove came to him in the evening, and behold, a freshly plucked olive leaf was in her mouth; and Noah knew that the waters had receded from the earth.', 'Genesis 8:11');
  dove.classList.remove('laden');
  await lighten(1, 1500);
  await week();

  // Third: dry ground, and she stays.
  peaks.classList.add('dry');
  await tween(6000, k => picture({ level: 740 + 120 * k }), smooth);
  tell('The ground is drying, and green again. Send her out once more, and let her come down wherever you like.');
  let stays = false;
  do await fly(700, [home, ...tops], p => {
    if (p[2] === 'ark') tell('She is at the window again. Click her: there is dry ground for her now.');
    else (stays = true), tell();
    return true;
  }, ([x]) => GROUND.reduce((a, b) => (Math.abs(b[0] - x) < Math.abs(a[0] - x) ? b : a))); // (down on the ground nearest to the click)
  while (!stays);
  tell('She has found a place of her own, and she stays.');
  await sleep(3600);
  tell();
  await verse('So he waited yet another seven days and sent out the dove, which did not return again to him anymore.', 'Genesis 8:12');
  gone(raven); // the waters are dried up from the earth
}
