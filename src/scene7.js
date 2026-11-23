// Scene 7: the table. "You prepare a table before me in the presence of my enemies; You anoint my head with oil; My cup runs over."
// A high meadow, spread like a table. Fetch the oil jar and oil each sheep's head against the flies, then set the
// stone channels right so the spring runs down to the trough and it runs over. Then cups of water ring the next line.
import { actor, place, exit, sleep, say, tell, hush, hint, reach, lead, overlay } from './engine.js';
import { cut } from './art.js';
import { land, come, gather, rise, roamer } from './land.js';
import { splash, knock, flow } from './audio.js';
import { answer, hear } from './harp.js';
import { cast, SONG, baa, counter, post } from './shared.js';

const W = 3000;
const MEADOW = [[1250, 800], [1420, 900], [1560, 770], [1700, 880], [1480, 990]];
const TROUGH = [2300, 860];
const OIL = [1010, 770]; // where the oil jar stands
const CUPS = [2000, 2085, 2170, 2255, 2340]; // a row of cups in front of the trough
const find = roamer(W);

let sc, field, oil, jar, trough, begun = false;

// The water channels, seen from above: five stones, each with a groove cut in it, lying in steps from the spring
// (top left) down to the trough (bottom right). A click turns a stone a quarter. Water shows in each stone it
// reaches, so every turn can be seen to help or not; when it gets all the way, the trough (a hollowed stone, seen
// from above like the rest, with the last groove running on into it) fills and runs over its near edge.
// (Only the groove turns, not the stone under it: a paper-cut shape turned upside down is drawn black.)
// Each stone: [column, row, straight or bent, quarter-turns it starts with]. Before any turn a straight groove
// opens up and down, a bent one up and to the right (sides: 0 up, 1 right, 2 down, 3 left).
const STONES = [[0, 0, 'I', 0], [1, 0, 'L', 0], [1, 1, 'L', 2], [2, 1, 'L', 3], [2, 2, 'L', 1]];
const OPEN = { I: [0, 2], L: [0, 1] }, GROOVE = { I: 'M0,-75V75', L: 'M0,-75V-24Q0,0 24,0H75' };
const run = overlay(`<p class="cue"></p>
<svg class="run" viewBox="0 0 760 520">
  ${cut('<rect x="6" y="6" width="748" height="508" rx="36" fill="#79b458"/>')}
  ${cut('<path d="M22,96Q4,40 44,22Q84,6 112,34Q138,60 124,112Z" fill="#b08a66"/>', 1)}<path d="M92,70Q124,72 152,96" fill="none" stroke="#5fb1d2" stroke-width="26" stroke-linecap="round"/>
  ${STONES.map(([c, r, kind]) => `<g class="tile key" transform="translate(${235 + c * 150},${95 + r * 150})">${cut('<rect x="-70" y="-70" width="140" height="140" rx="20" fill="#b9ad9c"/>', 1)}<g class="turn"><path d="${GROOVE[kind]}" fill="none" stroke="#7d7468" stroke-width="46"/><path class="wet" d="${GROOVE[kind]}" fill="none" stroke="#5fb1d2" stroke-width="30"/></g></g>`).join('')}
  ${cut('<rect x="612" y="328" width="132" height="134" rx="20" fill="#a9a39c"/>', 1)}<rect x="632" y="348" width="92" height="94" rx="12" fill="#6f6a66"/>
  <path d="M604,395H640" fill="none" stroke="#7d7468" stroke-width="46"/><path class="wet" d="M604,395H644" fill="none" stroke="#5fb1d2" stroke-width="30"/>
  <rect class="brim" x="632" y="348" width="92" height="94" rx="12" fill="#5fb1d2"/>
  <g class="wet" fill="none" stroke="#5fb1d2" stroke-width="10" stroke-linecap="round"><path d="M652,436v40M678,436v50M704,436v36"/></g>
</svg>`);
run.classList.add('harp');
async function channels() {
  const svg = run.querySelector('svg'), tiles = [...svg.querySelectorAll('.tile')], turns = STONES.map(s => s[3]);
  run.querySelector('.cue').textContent = 'Click a stone to turn it. Make a way for the water, down to the trough.';
  // Follow the water from the spring: into the first stone from the left, and on for as long as the grooves meet.
  // `stuck` is the stone to turn next: the one the water cannot get into, or the one that sends it astray. Left
  // alone for a while, that stone glows.
  let stuck, nudge;
  const pour = () => {
    let c = 0, r = 0, from = 3, i;
    clearTimeout(nudge);
    tiles.forEach((t, k) => (t.classList.remove('on', 'next'), (t.lastChild.style.transform = `rotate(${turns[k] * 90}deg)`)));
    while ((i = STONES.findIndex(s => s[0] === c && s[1] === r)) >= 0) {
      const sides = OPEN[STONES[i][2]].map(d => (d + turns[i]) % 4);
      stuck = i;
      if (!sides.includes(from)) break;
      tiles[i].classList.add('on');
      const out = sides.find(d => d !== from);
      c += [0, 1, 0, -1][out];
      r += [-1, 0, 1, 0][out];
      from = (out + 2) % 4;
    }
    if (c === 3 && r === 2) return true; // out of the last stone, toward the trough
    nudge = setTimeout(() => tiles[stuck].classList.add('next'), 12000);
  };
  svg.classList.remove('full');
  pour();
  run.classList.add('on');
  await new Promise(done => (svg.onpointerdown = e => {
    const k = tiles.indexOf(e.target.closest('.tile'));
    if (k < 0) return;
    turns[k]++;
    knock();
    if (pour()) done();
  }));
  svg.onpointerdown = null;
  svg.classList.add('full');
  run.querySelector('.cue').textContent = 'It runs over!';
  const stop = flow(0.14);
  await sleep(2600);
  stop();
  run.classList.remove('on');
}

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 71,
    sky: '#8ec3e0', bands: ['#a3cfe6', '#bcdcea', '#d6e9ee', '#f1f2e0'], sun: [1150, 150, 60, '#fff8dc'], clouds: '#fffaf0',
    // High country: snowy mountains stand behind it.
    far: ['#7f9dbc', '#a6cb9c'], peaks: [260, 200], snow: '#f8faf6', haze: 'rgba(255,246,214,.4)', mid: '#97c883', near: '#88c070',
    ground: ['#86c064', '#79b458', '#6da84e', '#629c45'], flowers: 330,
    trees: [[330, 640, 1], [2700, 650, 1.25]],
  }));
  oil = actor(field, 'oil', '<g filter="url(#paperS)"><path d="M-17,0Q-27,-26 -9,-40V-50H9V-40Q27,-26 17,0Z" fill="#c9a86a"/><rect x="-12" y="-58" width="24" height="10" rx="4" fill="#8a6a3c"/><path d="M-15,-18Q0,-12 15,-18" fill="none" stroke="#a88a52" stroke-width="4"/></g><circle cy="-28" r="54" fill="transparent"/>', ...OIL);
  // The spring comes out of a jar-shaped rock; the trough beside it is dry until the channels are set right.
  jar = actor(field, 'jar', '<g filter="url(#paperS)"><path d="M-44,0Q-64,-60 -30,-96Q0,-116 30,-96Q64,-60 44,0Z" fill="#b08a66"/><ellipse cy="-98" rx="26" ry="9" fill="#7d5c41"/><path d="M-40,-50Q0,-40 40,-50" fill="none" stroke="#8f6c4c" stroke-width="5"/></g><ellipse cy="-52" rx="70" ry="70" fill="transparent"/>', TROUGH[0] - 150, TROUGH[1] - 6);
  trough = actor(field, 'trough', '<g filter="url(#paperS)"><path d="M-96,-44H96L84,0H-84Z" fill="#a9a39c"/><path d="M-84,-38H84L78,-18H-78Z" fill="#6f6a66"/></g><g class="water"><path d="M-82,-37H82L77,-20H-77Z" fill="#5fb1d2"/></g><g class="spill" fill="none" stroke="#7cc4de" stroke-width="7" stroke-linecap="round"><path d="M-60,-21v14M-24,-21v18M16,-21v16M54,-21v12"/></g>', ...TROUGH);
  sc.next = next;
  exit(sc, 'left', back, false);
}

export function enter(side, look) {
  come(sc, field, find, side, 'table');
  if (look) return; // only looked back at, from the ending: nothing begins
  if (!begun) story();
  begun = true;
}

// Looked back at, from the ending: the flock at its table, and the trough running over.
export function look() {
  lead([]);
  cast.flock.forEach((s, i) => (place(s, ...MEADOW[i]), s.classList.add('grazing')));
  trough.dataset.fill = 3;
}

async function story() {
  const flock = cast.flock;
  sc.locked = true; // no going on until the table is ready
  post('The table');
  await sleep(1800);
  await say('Out of the valley, and up to the high meadow! It is spread out like a table for them.');
  await say('Eat all you want, little ones.');
  lead([]);
  await gather(MEADOW, 'grazing');
  await say('The flies bother them, though. A little oil on each head keeps the flies away.');
  tell('First fetch the oil. It is in the little jar, back the way we came.');
  const unring = hint(field, OIL[0], OIL[1] - 28);
  await reach(oil);
  unring();
  knock();
  cast.david.append(oil); // he carries it in the crook of his arm
  place(oil, 30, -64);
  tell('Now go to each sheep and put oil on its head.');
  const count = counter();
  await Promise.all(flock.map(async s => {
    await reach(s);
    s.querySelector('.head').insertAdjacentHTML('beforeend', '<circle cx="42" cy="-76" r="6" fill="#e9c24a"/>');
    baa(s, true);
    count(s);
  }));
  hush();
  oil.remove();
  await sleep(1700);

  await say('And they will want water, but the trough is dry! Stone channels bring the water down from the spring, and they have been knocked about.');
  tell('Let’s set them right. Come over to the spring, by the trough.');
  const unring2 = hint(field, TROUGH[0] - 150, TROUGH[1] - 52, 8000);
  await reach(jar, 200);
  unring2();
  hush();
  await channels();
  trough.dataset.fill = 3;
  splash();
  await sleep(1800);

  await say('A table made ready, oil on every head, and a cup that runs over.');
  await say('That is how the Lord treats me.');

  // No harp here: a row of cups, each holding less water than the last (so ringing higher), plays the next part of the song.
  await say('See these cups? Each one holds a little less water than the last, and the less water in a cup, the higher it rings. They play the next part of my song. Tap them to play it back.');
  const cups = CUPS.map((x, i) => {
    const el = actor(field, 'cup', `<g filter="url(#paperS)"><path d="M-26,-56H26L19,0H-19Z" fill="#b98c62"/><path d="M${-25 + i * 1.3},${-50 + i * 9}H${25 - i * 1.3}L19,-3H-19Z" fill="#5fb1d2"/><path d="M-26,-56H26" stroke="#8f6c4c" stroke-width="6" stroke-linecap="round"/></g><ellipse cy="-28" rx="40" ry="46" fill="transparent"/>`, x, 975);
    return { el, string: i + 1 };
  });
  await answer(cups, SONG[5].pieces.slice(0, 3).map(p => p[1]));
  for (const c of cups) c.el.remove();
  await hear([SONG[5]], 5);
  rise();
  sc.locked = false;
  await say('Now for home! It is just over the next rise.');
  exit(sc, 'right', sc.next);
}
