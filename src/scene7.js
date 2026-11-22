// Scene 7: the table. "You prepare a table before me in the presence of my enemies; You anoint my head with oil; My cup runs over."
// A high meadow, but it has to be made ready: pull the bitter weeds (and leave the good plants), fetch the oil jar and
// oil each sheep's head against the flies, fill the trough until it runs over. Then cups of water ring the next line.
import { actor, place, exit, sleep, say, tell, hush, hint, reach, lead } from './engine.js';
import { land, come, gather, rise, roamer } from './land.js';
import { rustle, lap, splash, knock } from './audio.js';
import { answer, hear } from './harp.js';
import { cast, SONG, baa, counter, post } from './shared.js';

const W = 3000;
const WEEDS = [[760, 860], [1300, 720], [1820, 940]];
const MEADOW = [[1250, 800], [1420, 900], [1560, 770], [1700, 880], [1480, 990]];
const TROUGH = [2300, 860];
const HERBS = [[1040, 955], [1570, 668]]; // good plants, to be left for the sheep
const OIL = [1010, 770]; // where the oil jar stands
const CUPS = [2000, 2085, 2170, 2255, 2340]; // a row of cups in front of the trough
const find = roamer(W);

let sc, field, weeds, herbs, oil, jar, trough, begun = false;

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 71,
    sky: '#8ec3e0', bands: ['#a3cfe6', '#bcdcea', '#d6e9ee', '#f1f2e0'], sun: [1150, 150, 60, '#fff8dc'], clouds: '#fffaf0',
    far: ['#b9d6b0', '#a6cb9c'], haze: 'rgba(255,246,214,.4)', mid: '#97c883', near: '#88c070',
    ground: ['#86c064', '#79b458', '#6da84e', '#629c45'], flowers: 330,
    trees: [[330, 640, 1], [2700, 650, 1.25]],
  }));
  weeds = WEEDS.map(([x, y]) => actor(field, 'weed', `<g filter="url(#paperS)"><path d="M0,0V-66M0,-30L-30,-58M0,-40L30,-66M0,-14L-26,-28M0,-18L26,-34" stroke="#3f5a44" stroke-width="7" stroke-linecap="round"/><path d="M-12,-66l12,-30l12,30zM-40,-56l8,-22l12,16zM22,-62l12,-22l8,22z" fill="#5a4a6e"/><circle cx="-6" cy="-52" r="5" fill="#2b2238"/><circle cx="10" cy="-44" r="5" fill="#2b2238"/></g><ellipse cy="-46" rx="62" ry="62" fill="transparent"/>`, x, y));
  herbs = HERBS.map(([x, y]) => actor(field, 'herb', '<g filter="url(#paperS)"><path d="M0,0V-50M0,-22L-24,-40M0,-30L24,-48M0,-10L-20,-18M0,-12L20,-22" stroke="#5c9a4a" stroke-width="7" stroke-linecap="round"/><g fill="#f2cf58"><circle cy="-58" r="12"/><circle cx="-28" cy="-46" r="9"/><circle cx="28" cy="-54" r="9"/></g></g><ellipse cy="-36" rx="58" ry="54" fill="transparent"/>', x, y));
  oil = actor(field, 'oil', '<g filter="url(#paperS)"><path d="M-17,0Q-27,-26 -9,-40V-50H9V-40Q27,-26 17,0Z" fill="#c9a86a"/><rect x="-12" y="-58" width="24" height="10" rx="4" fill="#8a6a3c"/><path d="M-15,-18Q0,-12 15,-18" fill="none" stroke="#a88a52" stroke-width="4"/></g><circle cy="-28" r="54" fill="transparent"/>', ...OIL);
  // The spring comes out of a jar-shaped rock; the trough beside it fills a third at a time.
  jar = actor(field, 'jar', '<g filter="url(#paperS)"><path d="M-44,0Q-64,-60 -30,-96Q0,-116 30,-96Q64,-60 44,0Z" fill="#b08a66"/><ellipse cy="-98" rx="26" ry="9" fill="#7d5c41"/><path d="M-40,-50Q0,-40 40,-50" fill="none" stroke="#8f6c4c" stroke-width="5"/></g><ellipse cy="-52" rx="70" ry="70" fill="transparent"/>', TROUGH[0] - 150, TROUGH[1] - 6);
  trough = actor(field, 'trough', '<g filter="url(#paperS)"><path d="M-96,-44H96L84,0H-84Z" fill="#a9a39c"/><path d="M-84,-38H84L78,-18H-78Z" fill="#6f6a66"/></g><g class="water"><path d="M-82,-37H82L77,-20H-77Z" fill="#5fb1d2"/></g><g class="spill" fill="none" stroke="#7cc4de" stroke-width="7" stroke-linecap="round"><path d="M-92,-42q-12,20 -10,44"/><path d="M92,-42q12,20 10,44"/><path d="M-20,-44v-10M24,-44v-12"/></g>', ...TROUGH);
  sc.next = next;
  exit(sc, 'left', back, false);
}

export function enter(side, look) {
  come(sc, field, find, side, 'table');
  if (look) return; // only looked back at, from the ending: nothing begins
  if (!begun) story();
  begun = true;
}

async function story() {
  const flock = cast.flock;
  sc.locked = true; // no wandering off while he explains
  post('The table');
  await sleep(1800);
  await say('Out of the valley, and up to the high meadow! It is spread out like a table for them.');
  await say('But a good shepherd makes the table ready first.');

  tell('Three bitter weeds grow here: the dark, spiky ones. Pull them out, so no sheep eats one.');
  sc.locked = false;
  let count = counter(), weeding = true;
  for (const h of herbs)
    (async () => {
      for (;;) {
        await reach(h);
        if (!weeding) return;
        rustle();
        tell('That one is good to eat! Leave it for the sheep. The bitter weeds are dark and spiky.');
      }
    })();
  await Promise.all(weeds.map(async w => {
    await reach(w);
    count(w);
    w.remove();
    rustle();
  }));
  weeding = false;
  hush();
  await sleep(1700);

  await say('Now it is safe to eat. Go on, little ones.');
  sc.locked = true;
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
  count = counter();
  await Promise.all(flock.map(async s => {
    await reach(s);
    s.querySelector('.head').insertAdjacentHTML('beforeend', '<circle cx="42" cy="-76" r="6" fill="#e9c24a"/>');
    baa(s, true);
    count(s);
  }));
  hush();
  oil.remove();
  await sleep(1700);

  await say('And they will want water. More than enough of it.');
  tell('Fill the trough from the spring, until it runs over.');
  for (let fill = 1; fill <= 3; fill++) {
    await reach(jar, 200);
    trough.dataset.fill = fill;
    for (let k = 0; k < 4; k++) setTimeout(lap, k * 110);
    if (fill === 3) splash();
  }
  hush();
  await sleep(1500);

  await say('A table made ready, oil on every head, and a cup that runs over.');
  await say('That is how the Lord treats me.');

  // No harp here: a row of cups, each holding less water than the last (so ringing higher), plays the next part of the song.
  await say('See these cups? Each one holds a little less water than the last, so each rings its own note. They play the next part of my song. Tap them to play it back.');
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
