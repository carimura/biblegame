// Noah's Ark, scene 5: forty days and forty nights. Genesis 7:12.
// Inside: the ark cut open again, rocking hard, with every pair where the player settled it in scene 3. Two nights
// are played. Each begins with a look at who is where, for as long as is wanted; then the lamp is put out, and the
// storm frightens one pair after another (two the first night, three the second). Each calls, and has to be found
// in the dark: a click takes the lamp to a stall. The wrong stall shows who is really there, and three wrong ones in
// a night make the right stall glimmer. Every morning a mark is made on the wall, and after the second they run on
// to forty.
import { sleep } from './engine.js';
import { knock, thunder, flow, music } from './audio.js';
import { verse, patience } from './theatre.js';
import { boat, picture, hold, pens, into, out, NAMES, VOICE } from './ark.js';

// A mark on the wall for a day gone: four strokes, and a fifth across them.
function mark(tally, n) {
  const x = (((n - 1) / 5) | 0) * 44, k = (n - 1) % 5;
  tally.insertAdjacentHTML('beforeend', k < 4 ? `<path d="M${x + k * 9},0v34"/>` : `<path d="M${x - 6},28L${x + 33},6"/>`);
}

// One night: `calls` pairs are frightened, one after another, and each has to be found in the dark.
async function night(calls, { svg, cue }) {
  const stalls = [...svg.querySelectorAll('.pen')], covers = [...svg.querySelectorAll('.dark')], lot = kind => svg.querySelector(`.lot[data-kind=${kind}]`);
  const who = k => (k === 10 ? 'giraffe' : Object.keys(pens).find(kind => pens[kind] === k));
  const loud = ['elephant', 'ox', 'lion', 'sheep', 'goat', 'raven', 'dove'].sort(() => Math.random() - 0.5).slice(0, calls);
  cue('Night is coming. Look well where every pair has its room. Then click, to put out the lamp.');
  await new Promise(done => (svg.onpointerdown = done));
  svg.classList.add('night');
  knock();
  await sleep(1500);
  for (const kind of loud) {
    const help = patience([() => stalls[pens[kind]].classList.add('next')], 3);
    thunder(0.16);
    await sleep(1300);
    VOICE[kind]();
    cue(`Thunder! The ${NAMES[kind]} are frightened. Where are they? Click their stall, to take the lamp to them.`);
    await new Promise(done => (svg.onpointerdown = e => {
      const k = stalls.indexOf(e.target.closest('.pen'));
      if (k < 0) return;
      covers[k].classList.add('lit');
      if (k === pens[kind]) return done();
      VOICE[kind]();
      cue(who(k) ? `No: here are the ${NAMES[who(k)]}, fast asleep. Listen for the ${NAMES[kind]}!` : `No: this stall is empty. Listen for the ${NAMES[kind]}!`);
      setTimeout(() => covers[k].classList.remove('lit'), 1600);
      help.tried();
    }));
    svg.onpointerdown = null;
    stalls[pens[kind]].classList.remove('next');
    lot(kind).classList.add('calls');
    cue(`There they are. Hush now: you are safe in the ark.`);
    await sleep(2200);
    lot(kind).classList.remove('calls');
    covers[pens[kind]].classList.remove('lit');
    await sleep(500);
  }
  svg.classList.remove('night');
}

// Jump past this scene, for starting further on: the rain over, and the ark riding the flood at its height.
export const skip = () => picture({ storm: 0.7, rain: 0 });

export async function play() {
  music('flood');
  const dry = flow(0.05), inside = hold(), tally = inside.svg.querySelector('.tally'); // the rain, heard from within
  inside.place();
  inside.svg.style.setProperty('--tilt', '0deg');
  inside.svg.classList.add('rocking');
  for (const s of inside.svg.querySelectorAll('.sum')) s.textContent = '';
  inside.cue('Inside the ark everyone is dry, and safe. But the storm is loud, and the nights are long.');
  await into(boat.querySelector('.hatch'));
  inside.el.classList.add('on');
  picture({ rain: 0 }); // (so close, the rain behind the picture would be great bars of white)
  await sleep(4200);
  for (let n = 1; n <= 2; n++) {
    await night(n + 1, inside);
    mark(tally, n);
    knock();
    inside.cue(['Morning! One day gone: a mark on the wall for it.', 'Morning again. Two days. And still it rains.'][n - 1]);
    await sleep(3200);
  }
  inside.cue('Day after day, and night after night…');
  for (let n = 3; n <= 40; n++) (await sleep(n < 12 ? 260 : 110), mark(tally, n));
  inside.cue('Forty days, and forty nights.');
  await sleep(3200);
  dry();
  await out();
  inside.el.classList.remove('on');
  await sleep(900);
  await verse('And the rain was on the earth forty days and forty nights.', 'Genesis 7:12');
  picture({ storm: 0.7 });
  await sleep(2500);
}
