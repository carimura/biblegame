// Noah's Ark, scene 3: a room for everyone. Genesis 6:21, 7:1, 7:7, 7:16.
// The ark is cut open: ten stalls on three decks, and a tall one for the giraffes, who can stand nowhere else. The
// pairs went in anyhow, and each needs a room that suits it. Click two stalls, and what is in them changes places.
// What will not fit is refused at once, in words: the great beasts are too heavy for the upper decks, and only the
// small ones fit under the roof. The rest the animals show, by fidgeting, and a click on a pair says what it wants:
// the oxen the stall by the hay, the elephants the stall by the water casks, the sheep and the goats (one flock) to
// stand side by side, the birds one of the two stalls under the window, and the tortoises, who cannot climb a
// ladder, the lowest deck. Nothing here is afraid of anything else: in the ark they are at peace. The ark leans to
// its heavier side as they are moved (each pair's weight is shown in dots, each side's sum beneath it), and when
// every pair is content it stands level: a script found that the four ways that content them all are level, of
// the 8,640 that fit. The muddle they begin in is five changes from the nearest.
// Then Noah's family goes in, and the door is too great to shut: "and the LORD shut him in."
import { actor, walk, sleep, tap, say, clamp } from './engine.js';
import { knock, groan, music } from './audio.js';
import { verse, patience, tell as card } from './theatre.js';
import { LORD } from './shared.js';
import { sc, field, ark, noah, enter, person, hold, pens, settle, strike, into, out, STALLS, HEAVY, RIGHT, NAMES } from './ark.js';

const FOOT = [1850, 716], DOORWAY = [1600, 540];
const COUNT = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
const TOP = { elephant: 0, ox: 0, lion: 1, sheep: 1, goat: 1, tortoise: 2, raven: 2, dove: 2 }; // the highest deck each can stand on
const kinds = Object.keys(pens), beside = (a, b) => STALLS[a][0] === STALLS[b][0] && STALLS[a][1] === STALLS[b][1] && Math.abs(STALLS[a][2] - STALLS[b][2]) === 1;
// What a pair wants that it has not got where it stands, if anything.
const WOE = {
  ox: () => pens.ox !== 0 && 'The oxen are lowing for their hay. They eat the most of all: they want the stall by the hay.',
  elephant: () => pens.elephant !== 2 && 'The elephants are thirsty. They drink the most of all: they want the stall by the water casks.',
  sheep: () => !beside(pens.sheep, pens.goat) && 'The sheep are looking for the goats. They are one flock, and want to stand side by side.',
  goat: () => !beside(pens.sheep, pens.goat) && 'The goats are looking for the sheep. They are one flock, and want to stand side by side.',
  raven: () => pens.raven !== 7 && pens.raven !== 8 && 'The ravens beat their wings. Birds want to be by the window: in one of the two stalls right under it.',
  dove: () => pens.dove !== 7 && pens.dove !== 8 && 'The doves beat their wings. Birds want to be by the window: in one of the two stalls right under it.',
  tortoise: () => STALLS[pens.tortoise][0] > 0 && 'The tortoises have pulled in their heads. A tortoise cannot climb a ladder: they belong on the lowest deck.',
};
const woe = kind => WOE[kind]?.() || '';
// What each side of the ark carries (the giraffes are on the left), and how many things are wrong.
const sides = () => [0, 1].map(k => kinds.reduce((n, kind) => n + (STALLS[pens[kind]][1] === k) * HEAVY[kind], k ? 0 : HEAVY.giraffe));
const wrongs = () => kinds.filter(woe).length + (sides()[0] !== sides()[1]);

async function rooms() {
  const { el, svg, place, cue } = hold(), stalls = [...svg.querySelectorAll('.pen')], sums = svg.querySelectorAll('.sum');
  const lot = kind => svg.querySelector(`.lot[data-kind=${kind}]`), who = k => kinds.find(kind => pens[kind] === k);
  let picked = null;
  // Show how things stand: who is unhappy, which way the ark leans, and which stall has been clicked.
  const show = () => {
    const [l, r] = sides();
    place();
    for (const k of kinds) lot(k).classList.toggle(k === 'raven' || k === 'dove' ? 'aloft' : 'afraid', !!woe(k)); // a bird beats its wings, the rest fidget
    svg.style.setProperty('--tilt', clamp((r - l) * 1.2, -9, 9) + 'deg');
    sums[0].textContent = l;
    sums[1].textContent = r;
    stalls.forEach((s, k) => s.classList.toggle('picked', k === picked));
  };
  // After three changes that mend nothing, a little more is said; after three more, a change that helps is shown.
  const help = patience([
    () => cue('Click any pair that fidgets, and it will tell you what it wants. Begin with the great beasts: the hay is at one end of the lowest deck, and the water at the other.'),
    () => {
      const kind = kinds.find(k => woe(k) && pens[k] !== RIGHT[k] && (!who(RIGHT[k]) || TOP[who(RIGHT[k])] >= STALLS[pens[k]][0]));
      for (const k of kind ? [pens[kind], RIGHT[kind]] : []) stalls[k].classList.add('next');
    },
  ], 3);
  show();
  cue('Every pair needs a room that suits it. Click a pair to hear what it wants. Click two stalls, and they change places.');
  await into(ark.querySelector('.hole')); // in at the door
  el.classList.add('on');
  await new Promise(done => (svg.onpointerdown = e => {
    const k = stalls.indexOf(e.target.closest('.pen')), from = picked;
    if (k < 0) return;
    for (const s of stalls) s.classList.remove('next');
    if (k === 10) return cue('The giraffes can stand nowhere else: only this stall is tall enough for them.');
    picked = from === null ? k : null;
    if (from === null || from === k) {
      // one stall: say who is in it, and what is the matter with them
      if (picked !== null) cue(!who(k) ? 'An empty stall.' : woe(who(k)) || `The ${NAMES[who(k)]}. They weigh ${COUNT[HEAVY[who(k)]]}.`);
      return show();
    }
    // two stalls: what is in them changes places, if each will fit where the other was
    const [a, b] = [who(from), who(k)], before = wrongs(), misfit = [[a, k], [b, from]].find(([kind, to]) => kind && STALLS[to][0] > TOP[kind])?.[0];
    if (misfit) {
      knock();
      cue(TOP[misfit] ? `There is no room for the ${NAMES[misfit]} under the roof. Only the smallest fit up there.` : `The ${NAMES[misfit]} are too heavy for the upper decks. The great beasts must stand on the lowest.`);
      help.tried();
      return show();
    }
    if (a) pens[a] = k;
    if (b) pens[b] = from;
    knock();
    show();
    const left = wrongs(), sad = kinds.filter(woe);
    if (!left) return done();
    cue(sad.length === 1 ? 'Nearly there: one pair still fidgets. Click it to hear what it wants.' : `Not everyone is content yet: ${COUNT[sad.length]} pairs still fidget. Click one to hear what it wants.`);
    left < before ? help.again() : help.tried();
  }));
  svg.onpointerdown = null;
  cue('Every pair has a room that suits it, and the ark stands level.');
  await sleep(2800);
  await out();
  el.classList.remove('on');
  await sleep(900);
}

// Jump past this scene, for starting further on: every pair in a stall that suits it.
export const skip = settle;

export async function play() {
  ark.classList.add('open');
  enter(1700, 800);
  music('coming');
  sc.el.style.setProperty('--gloom', 0.85);
  await verse('And you shall take for yourself of all food that is eaten, and you shall gather it to yourself; and it shall be food for you and for them.”', 'Genesis 6:21');
  await say('The food is stowed, and the animals are aboard. But they went in anyhow, and every pair needs a room that suits it.');
  await walk(noah, FOOT[0] - 110, FOOT[1] + 40, 260); // to the foot of the ramp, where the door is in sight
  await say('Come inside, and help me settle them.');
  await rooms();

  await verse(`Then the ${LORD} said to Noah, “Come into the ark, you and all your household, because I have seen that you are righteous before Me in this generation.`, 'Genesis 7:1');
  await say('Come, all of you! My wife; my sons Shem, Ham and Japheth; and their wives.');
  // Noah's family goes up the ramp and in, and Noah after them.
  const kin = [['#a8705c', '#d9ccb5', 1], ['#7d8f6f', '#3b2a22'], ['#c2a56a', '#8a6a5a', 1], ['#8f7d5d', '#2b1f1a'], ['#8fa3a8', '#e6dcc8', 1], ['#6f7f8f', '#5b4530'], ['#a98a9f', '#cdbf9f', 1]];
  const inside = async (who, wait) => {
    await sleep(wait);
    await walk(who, FOOT[0] - 30, FOOT[1] - 6, 230);
    await walk(who, DOORWAY[0] + 6, DOORWAY[1], 190);
    who.style.transition = 'opacity .45s';
    who.style.opacity = 0;
  };
  await Promise.all(kin.map((look, i) => inside(actor(field, 'kin', person(...look), 2050 + i * 70, 760 + (i % 2) * 40), i * 600)));
  await say('And now I go in myself.');
  await inside(noah, 0);
  await verse('So Noah, with his sons, his wife, and his sons’ wives, went into the ark because of the waters of the flood.', 'Genesis 7:7');

  // The door: nothing the player does will shut it.
  const ramp = ark.querySelector('.ramp');
  ramp.classList.add('key');
  card('Everyone is in. But the great door stands open: it is their ramp, lying on the ground. Click it, to lift it shut.');
  for (const words of ['It does not move. It is far too heavy. Try again!', 'No one can lift it: not from outside, and not from within.']) {
    await tap(ramp);
    ramp.classList.remove('play');
    ramp.getBoundingClientRect(); // so that it shakes afresh
    ramp.classList.add('play');
    knock();
    card(words);
  }
  await sleep(2600);
  card();
  ramp.classList.remove('key');
  await verse(`So those that entered, male and female of all flesh, went in as God had commanded him; and the ${LORD} shut him in.`, 'Genesis 7:16');
  ark.classList.remove('open');
  groan(); // the great door is drawn up, creaking, and shuts
  await sleep(4200);
  strike(0.3);
  sc.el.style.setProperty('--gloom', 1);
  sc.el.style.setProperty('--rain', 0.8);
  card('And the rain began.');
  await sleep(6000);
  card();
}
