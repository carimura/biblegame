// The second day: the sky. Genesis 1:6–8.
// Water everywhere, and no room between. The three pale waves are to be the waters above. Each hangs on a cord that
// runs up over a pulley and down to a hook: lifted by hand it only sinks back, and it stays up when the weights on
// its hook come to just its own heaviness (the drops on its tag: 4, 6 and 7; the weights are 1, 2, 2, 3, 4 and 5,
// and all are wanted, so some hooks must carry two or three). Too little and it hangs low; too much and it is
// hauled up past its place, the hook sinking past its mark. When all three hang true the waters below settle, and the sky is spread out between them
// like a curtain. From then on it is the sky that holds them up, and the cords and weights are put away.
import { html, sleep, when, leap } from './engine.js';
import { rnd, cut, hills } from './art.js';
import { music, knock, splash, pluck, STRINGS } from './audio.js';
import { rank, waves, lay, float, sheet, piece, put, slide, gone, carry, at, verse, tell, days, patience, solved } from './theatre.js';
import { dusk } from './day1.js';

const UP = [2, 1, 0], NEED = [4, 6, 7], X = [120, 320, 540]; // the waters above: which wave each is (the front one hangs highest), how heavy it is, and where its pulley is
const TRUE = [-260, -205, -150], EYE = 390; // where each lies when it hangs true (its upper edge), and how far down it its cord is tied
const STEP = 40, HOOK = 470; // how much lower a water hangs for each drop of weight it lacks, and how high its hook is when it hangs true
const EVERY = [130, 35, -100, 560, 665, 770], PARTED = [670, 745, 820]; // the six waves when water is everywhere, and the three below once they have settled
const WEIGHTS = [[4, 72, 812], [1, 147, 824], [5, 227, 808], [2, 312, 820], [3, 387, 816], [2, 462, 820]]; // as they lie in their tray: [how heavy, x, y]
const PIPS = [[], [[0, 0]], [[-9, 0], [9, 0]], [[-12, 7], [0, -9], [12, 7]], [[-10, -10], [10, -10], [-10, 10], [10, 10]], [[-13, -11], [13, -11], [0, 0], [-13, 11], [13, 11]]];

let curtain, cords, hooks, tags, tray, help, rigging = [], felt = false, parted = false, hand = null, handY;
const hung = [[], [], []]; // the weights on each hook, top to bottom
const load = i => hung[i].reduce((sum, p) => sum + p.w, 0);
const rest = i => TRUE[i] + Math.max(NEED[i] - load(i), -0.75) * STEP; // where a water hangs with what is on its hook now
const hookAt = i => HOOK + TRUE[i] - waves[UP[i]].level; // as much as the water is below its place, the hook is above its mark

export function build() {
  // The sky: bands of blue paper behind the waters, unrolled from the left once there is room for it.
  const r = rnd(7);
  curtain = rank.sky.appendChild(html('<div class="curtain"></div>'));
  sheet(`<g transform="translate(-300,0)">${[[170, '#6fb1dc'], [290, '#86c0e4'], [400, '#9ecfeb'], [500, '#b9ddf0'], [590, '#d5ebf4']].map(([y, fill]) => cut(`<path d="${hills(2200, y, 22, 300, r, 1000)}" fill="${fill}"/>`)).join('')}</g>`, 'sky', curtain);
  // A water above is lifted by pressing on it and pulling up; let go, it hangs again as its weights allow.
  UP.forEach((w, i) => {
    const water = waves[w].querySelector('.water');
    water.addEventListener('pointerdown', e => {
      if (!cords || parted) return;
      water.setPointerCapture(e.pointerId);
      const grip = at(e)[1] - waves[w].level;
      hand = i;
      handY = waves[w].level;
      water.onpointermove = e => (handY = Math.min(Math.max(at(e)[1] - grip, TRUE[i] - 30), rest(i)));
      water.onpointerup = water.onpointercancel = () => {
        water.onpointermove = null;
        hand = null;
        felt = true;
        splash();
      };
    });
  });
}

// Pulleys, cords, hooks and weights. Where each cord is tied to its water, a tag shows how heavy that water is.
function rig() {
  for (const w of UP) waves[w].querySelector('.water').classList.add('key');
  tray = sheet(cut('<rect x="22" y="712" width="484" height="174" rx="26" fill="#efe3c8"/>'), 'fresh', rank.works);
  // the pulleys, and by each hook the mark it sits at when its water hangs true
  rigging[0] = sheet(cut(X.map(x => `<path d="M${x},-90V20" stroke="#5b4530" stroke-width="9"/><circle cx="${x}" cy="20" r="24" fill="#8a6a3c"/><circle cx="${x}" cy="20" r="15" fill="#6e5234"/><circle cx="${x}" cy="20" r="5" fill="#d9bd80"/><path d="M${x - 52},${HOOK - 10}l15,10l-15,10zM${x + 4},${HOOK - 10}l-15,10l15,10z" fill="#b65a3c"/>`).join(''), 1), 'fresh', rank.works);
  const lines = sheet(NEED.map(n => `<path class="cord"/><g class="hook"><circle r="8" fill="none" stroke="#7b5a3d" stroke-width="5"/><path d="M0,8v8q0,12 -10,10" fill="none" stroke="#7b5a3d" stroke-width="5" stroke-linecap="round"/></g>
    <g class="heft">${cut(`<circle r="10" fill="none" stroke="#7b5a3d" stroke-width="6"/><rect x="20" y="-17" width="${n * 20 + 16}" height="34" rx="9" fill="#fbf3df"/>${Array.from({ length: n }, (_, j) => `<path transform="translate(${38 + j * 20},1)" d="M0,-10Q8,2 0,8Q-8,2 0,-10Z" fill="#3f86b0"/>`).join('')}`, 1)}</g>`).join(''), 'fresh', rank.works);
  [cords, hooks, tags] = ['.cord', '.hook', '.heft'].map(what => [...lines.querySelectorAll(what)]);
  rigging.push(lines);
  for (const [w, x, y] of WEIGHTS) {
    const r = 20 + w * 5, p = piece(cut(`<circle cy="${-r - 4}" r="8" fill="none" stroke="#6e5234" stroke-width="5"/><path d="M${-r},4Q${-r},${-r} 0,${-r}Q${r},${-r} ${r},4Q${r},${r * 0.86} 0,${r * 0.86}Q${-r},${r * 0.86} ${-r},4Z" fill="${['', '#c2bcb4', '#b0aaa2', '#9d978f', '#8a847d', '#77716b'][w]}"/>${PIPS[w].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#3b2f2a"/>`).join('')}`, 1) + `<circle class="key" r="${r + 12}" fill="transparent"/>`, x, y, r + 30);
    Object.assign(p, { w, r });
    rigging.push(p);
    // Let go by a hook (or by what already hangs from it), a weight is hung there; anywhere else it goes back to the tray.
    carry(p, () => {
      const i = X.findIndex((x, i) => Math.abs(p.pos[0] - x + 24) < 62 && p.pos[1] > hookAt(i) - 50 && p.pos[1] < hookAt(i) + 300);
      if (i < 0) return slide(p, x, y);
      hung[i].push(p);
      knock();
      const over = load(i) - NEED[i];
      tell(over > 0 ? 'Too heavy! That water is hauled up past its place. Take something off.' : over < 0 ? 'That helps, but it still hangs low. It needs more weight.' : 'That one hangs true!');
      if (!over) pluck(STRINGS[i + 2]);
      over ? help?.tried() : help?.again();
    }, () => hung.forEach(h => h.includes(p) && h.splice(h.indexOf(p), 1)));
  }
  hang();
}

// Every frame each water above drifts toward where its weights hold it (or where the hand has it), and its cord,
// hook and weights go with it: as much as the water rises, the hook comes down.
function hang() {
  UP.forEach((w, i) => {
    const wave = waves[w], to = hand === i ? handY : rest(i), x = X[i];
    if (Math.abs(to - wave.level) > 0.3) lay(wave, wave.level + (to - wave.level) * 0.12);
    if (wave.drawn === (wave.drawn = wave.level + ',' + hung[i].length)) return; // nothing has moved
    cords[i].setAttribute('d', `M${x + 24},${wave.level + EYE}V20a24,24 0 0 0 -48,0V${hookAt(i)}`);
    tags[i].setAttribute('transform', `translate(${x + 24},${wave.level + EYE})`);
    hooks[i].setAttribute('transform', `translate(${x - 24},${hookAt(i)})`);
    let y = hookAt(i) + 22;
    for (const p of hung[i]) {
      put(p, x - 24, y + 13 + p.r);
      y += 9 + p.r * 2;
    }
  });
  if (rigging.length) requestAnimationFrame(hang);
}

// Jump past this day, for starting at a later one: the waters parted, and the sky spread between them.
export function skip() {
  UP.forEach((w, i) => ((waves[w].style.animation = 'none'), lay(waves[w], TRUE[i])));
  PARTED.forEach((y, k) => lay(waves[3 + k], y));
  curtain.style.transition = 'none';
  curtain.classList.add('spread');
  days(2);
}

export async function play() {
  music('sky');
  await sleep(800);
  tell('The second day. There is light now, and there is water: water everywhere, high and low, with no room between.');
  for (const w of UP) waves[w].style.animation = 'none'; // the three that will hang on cords stop rocking
  await Promise.all(waves.map((wave, k) => float(wave, EVERY[k], 4200)));
  await sleep(2600);
  tell('');
  await verse('Then God said, “Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.”', 'Genesis 1:6');
  rig();
  tell('A firmament is a wide open space: the sky. To make room for it, the pale waters must go up high. Try lifting one!');
  // (the short cut: every weight on a hook where all three then hang true)
  leap(() => (loose => ((felt = true), [[4], [1, 5], [2, 2, 3]].forEach((ws, i) => hung[i].splice(0, 9, ...ws.map(w => loose.splice(loose.findIndex(p => p.w === w), 1)[0])))))(rigging.filter(p => p.w)));
  await when(() => felt || hung.some(h => h.length));
  if (felt) tell('It sinks back: water is heavy! Hang weights on its hook to hold it up. The drops on its tag show how heavy it is.');
  help = patience([
    () => tell('One hook can carry two weights, or three. Count the drops on a water, then find weights whose dots make just that many. Every weight is wanted.'),
    () => tell('Try this: the water with seven drops takes the 5 and a 2. Then the 4 holds up the water with four drops.'),
  ]);
  await when(() => NEED.every((n, i) => load(i) === n));
  help.stop();
  parted = true;
  for (const w of UP) waves[w].querySelector('.water').classList.remove('key'); // no longer to be lifted
  for (const h of hung) for (const p of h) p.fixed = true;
  await sleep(1600);
  tell('All three hang true!');
  solved();
  gone(tray);
  splash();
  await Promise.all(PARTED.map((y, k) => float(waves[3 + k], y, 3600)));
  curtain.classList.add('spread');
  await sleep(5400);
  tell('');
  rigging.splice(0).forEach(gone); // the sky holds the waters up now
  await verse('Thus God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament; and it was so.', 'Genesis 1:7');
  await verse('And God called the firmament Heaven.', 'Genesis 1:8');
  tell('Evening is coming. Press and hold the handle to wind the great wheel round.');
  await dusk();
  tell('');
  await sleep(1500);
  await verse('So the evening and the morning were the second day.', 'Genesis 1:8');
  days(2, true);
}
