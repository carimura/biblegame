// Noah's Ark, scene 2: two by two. Genesis 6:19–20, 7:8–9.
// It runs straight on from the building, in the same place: the great door is let down for a ramp, and the animals
// come to Noah, as God said they would, but in a muddle: every one stops far from its mate. A click on one and
// Noah goes over to it, and it follows him, as many as four at a time. At the foot of the ramp those whose mates
// are there go up and in, two by two, and the odd ones stay there and wait for theirs. Every kind has its own way.
// Sheep and goats look alike. The lion's mate has no mane. The tortoises cannot be led at all: once found they
// come in their own time. The birds fly down from their trees. And the giraffes are too tall for the door, and must
// duck. With every pair that goes in the sky darkens and the clouds gather; from the third pair on each is answered
// by lightning, but not as it goes in: the lightning waits until Noah is out fetching more, with animals behind
// him and a quiet moment since the last of them called, so that the weather is not lost in the noise of the
// boarding. No rain falls yet: the rain comes on the day they are all in (Genesis 7:11–13).
import { actor, walk, glide, smooth, sleep, when, tap, say, tell, hush, reach, roam, still, lead, apart } from './engine.js';
import { knock, groan, music } from './audio.js';
import { verse, patience } from './theatre.js';
import { counter } from './shared.js';
import { W, ARK, sc, below, field, ark, noah, creature, enter, strike, VOICE } from './ark.js';

const FOOT = [1850, 716], DOORWAY = [1600, 540]; // the foot of the ramp, and the door at its head
// Where each one stands when it has come: [its kind, x, y]. The birds are up in the two trees.
const HERD = [
  ['sheep', 640, 790], ['goat', 760, 850], ['lioness', 860, 980], ['ox', 440, 930], ['elephant', 400, 730], ['giraffe', 850, 700], ['raven', 262, 322], ['dove', 398, 304], ['tortoise', 1230, 975],
  ['sheep', 2560, 900], ['goat', 2480, 770], ['lion', 2380, 960], ['ox', 2840, 745], ['elephant', 2760, 905], ['giraffe', 2400, 700], ['raven', 2952, 292], ['dove', 2812, 312], ['tortoise', 2260, 990],
];
const flies = a => a.kind === 'raven' || a.kind === 'dove';
const pace = a => (a.kind === 'tortoise' ? 60 : 250);
const PAIRS = HERD.length / 2;

let herd, tow = [], queue = [], aboard = 0, boarding = 0, owed = 0, loud = 0, help, count;

// A pair goes up the ramp and in at the door, one behind the other.
async function board(pair) {
  boarding++;
  await Promise.all(pair.map(async (a, i) => {
    await a.aside; // (if it is still on its way to where it was to wait)
    await sleep(i * 450);
    await walk(a, FOOT[0] - 30 + i * 10, FOOT[1] - 6, pace(a));
    if (a.kind === 'giraffe') {
      await walk(a, DOORWAY[0] + 120 - i * 70, DOORWAY[1] + 82 - i * 46, 200);
      a.classList.add('key', 'next');
      tell('The giraffes are too tall for the door! Click each one, and it will duck its head.');
      await tap(a);
      a.classList.remove('key', 'next');
      a.classList.add('duck');
      await sleep(500);
    }
    await walk(a, DOORWAY[0] + 6, DOORWAY[1], pace(a) * 0.8);
    a.style.transition = 'opacity .45s';
    a.style.opacity = 0;
    await sleep(450);
    a.remove();
  }));
  count(ark.querySelector('.hole'));
  sc.el.style.setProperty('--gloom', (++aboard / PAIRS) * 0.85);
  boarding--;
  loud = performance.now();
  if (aboard > 2) owed = 0.04 + aboard * 0.02; // lightning is owed for this pair: far off at first, nearer with every one
  if (aboard === PAIRS - 1 && herd.some(a => a.kind === 'tortoise' && a.isConnected)) tell('Now we wait for the tortoises. There is no hurrying a tortoise!');
  help.again();
}
// These have come to the foot of the ramp. Any whose mate is there too goes in with it; the rest stand to one side
// and wait for theirs. Says whether any went in.
function muster(come) {
  const pairs = [];
  for (const a of come) {
    const mate = queue.find(b => b.kind === a.kind);
    queue = mate ? queue.filter(b => b !== mate) : [...queue, a];
    if (mate) pairs.push([mate, a]);
  }
  for (const a of come.filter(a => queue.includes(a))) {
    a.spot = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(k => !queue.some(b => b !== a && b.spot === k)); // the first place free
    a.aside = walk(a, FOOT[0] + 150 + (a.spot % 3) * 105, FOOT[1] + 10 + ((a.spot / 3) | 0) * 85, pace(a));
  }
  pairs.forEach(board);
  return pairs.length;
}
// An animal that has come waits to be found. Clicked, with Noah beside it, it joins those that follow him.
async function wait(a) {
  for (;;) {
    await reach(a, flies(a) ? 400 : 175, true);
    a.classList.remove('next');
    if (a.kind === 'tortoise') {
      // A tortoise sets off for the ramp by itself, slowly.
      tell('A tortoise cannot be hurried. It will come in its own time.');
      await walk(a, FOOT[0] + 60, FOOT[1] + 30, pace(a));
      return muster([a]);
    } else if (tow.length < 4) break;
    else tell('That is as many as will follow me at once. Let us take these to the ramp first.');
  }
  if (flies(a)) {
    a.classList.add('aloft');
    await glide(a, noah.pos[0] + 70, noah.pos[1] + 12, 800, smooth);
    a.classList.remove('aloft');
  }
  VOICE[a.kind]();
  loud = performance.now();
  a.classList.add('play'); // a hop: it is coming
  setTimeout(() => a.classList.remove('play'), 600);
  tow.push(a);
  lead(tow);
}

export const skip = () => {}; // (it leaves the ark as it found it)
export async function play() {
  enter(1560, 820);
  music('coming');
  count = counter();
  // The birds are in their trees and the tortoises already here; the rest come in from either side.
  herd = HERD.map(([kind, x, y], i) => {
    const comes = y > 600 && kind !== 'tortoise', a = actor(field, 'creature ' + kind, creature(kind), comes ? (x < ARK[0] ? -160 : W + 160) : x, y);
    a.kind = kind === 'lioness' ? 'lion' : kind;
    a.style.setProperty('--dir', x < ARK[0] ? 1 : -1); // every one faces the ark
    a.come = () => (comes ? sleep((i % 9) * 350).then(() => walk(a, x, y, 300)) : Promise.resolve()).then(() => wait(a));
    return a;
  });
  // The great door is let down, and makes the ramp. (It is clicked on the ground before it, where Noah can go.)
  if (!ark.classList.contains('open')) {
    const door = actor(below, 'doorway', '<rect x="-64" y="-338" width="128" height="178" fill="transparent"/>', ARK[0], 704);
    await say('Now the great door. It lets down to the ground, and makes a ramp for them to come in by.');
    tell('Click the door of the ark, to let it down.');
    roam(true);
    await reach(door, 175, true);
    roam(false);
    hush();
    door.remove();
    groan();
    ark.classList.add('open');
    await sleep(3000);
  }
  await verse('And of every living thing of all flesh you shall bring two of every sort into the ark, to keep them alive with you; they shall be male and female.', 'Genesis 6:19');
  await verse('Of the birds after their kind, of animals after their kind, and of every creeping thing of the earth after its kind, two of every kind will come to you to keep them alive.', 'Genesis 6:20');
  // A try that gets nowhere is coming to the ramp with nothing but odd ones. After two, Noah says a little more;
  // after two more, the mate of one that is waiting there glows.
  help = patience([
    () => tell('Two by two! Some that look alike are not mates. And some mates do not look alike: the lion’s mate has no mane.'),
    () => herd.find(a => a.task && queue.some(b => b.kind === a.kind))?.classList.add('next'),
  ], 2);
  for (const a of herd) a.come();
  await say('Look! They are coming, just as God said. Two of every kind.');
  await say('But what a muddle! Every one has stopped far from its mate: some on this side of the ark, and some on that.');
  await say('Click an animal, and it will follow me. Lead them to the foot of the ramp. They are to go in two by two, each with its mate.');
  roam(true);
  // Lightning that is owed comes while Noah is away from the ramp leading animals, when it has been quiet a while.
  (async () => {
    for (;;) {
      await when(() => aboard === PAIRS || (owed && !boarding && tow.length && !still() && performance.now() - loud > 2500 && apart(noah, { pos: FOOT }) > 420));
      if (aboard === PAIRS) return;
      strike(owed);
      owed = 0;
    }
  })();
  // Whenever Noah stops at the foot of the ramp, those that follow him have come to it.
  for (;;) {
    await when(() => aboard === PAIRS || (tow.length && still() && apart(noah, { pos: FOOT }) < 190));
    if (aboard === PAIRS) break;
    const come = tow;
    lead((tow = []));
    if (muster(come)) knock();
    else (tell('Two by two! These will wait here until their mates come.'), help.tried());
  }
  help.stop();
  roam(false);
  await sleep(1500);
  await say('Every kind is aboard, two by two.');
  await verse('Of clean animals, of animals that are unclean, of birds, and of everything that creeps on the earth, two by two they went into the ark to Noah, male and female, as God had commanded Noah.', 'Genesis 7:8–9');
  strike(0.26);
  await say('Listen to the thunder! And look how dark the sky has grown. But the rain has not come yet.');
}
