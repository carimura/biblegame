// Scene 5: night under the stars. A rest scene, with no new line of the song and nothing to play.
// Gather sticks, light the fire, and hear the song so far (verses 1 to 3) as the flock goes to sleep. Then it is dark, then morning.
import { actor, exit, sleep, say, tell, hush, reach, lead, fade } from './engine.js';
import { land, come, gather, rise, roamer } from './land.js';
import { crackle, knock, rustle } from './audio.js';
import { hear } from './harp.js';
import { cast, SONG, LORD, baa, counter, post } from './shared.js';

const W = 2600;
const FIRE = [1400, 850];
const STICKS = [[620, 900], [1050, 720], [2150, 930]];
const GREEN = [[860, 965], [1760, 715]]; // leafy branches, too green and wet to burn
const BEDS = [[1180, 800, 1], [1230, 905, 1], [1610, 790, -1], [1640, 900, -1], [1320, 960, 1]]; // round the fire, facing it
const find = roamer(W);

let sc, field, fire, sticks, greens, begun = false, lit = false, hushFire;

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 53,
    sky: '#141a3c', bands: ['#1b2350', '#232c60', '#2d3870', '#3a467e'], moon: [1320, 78], stars: 34,
    far: ['#3d4a78', '#35416c'], mid: '#3f5a60', near: '#3b5a52',
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
  greens = GREEN.map(([x, y]) => actor(field, 'stick', '<g filter="url(#paperS)"><path d="M-40,-6L38,-18M-4,-10L20,-34" stroke="#7f9a58" stroke-width="9" stroke-linecap="round"/><g fill="#5f9a4a"><ellipse cx="30" cy="-34" rx="15" ry="8" transform="rotate(-40 30 -34)"/><ellipse cx="44" cy="-10" rx="15" ry="8" transform="rotate(20 44 -10)"/><ellipse cx="-34" cy="-22" rx="14" ry="7" transform="rotate(30 -34 -22)"/><ellipse cx="6" cy="-40" rx="13" ry="7" transform="rotate(-70 6 -40)"/></g></g><circle cy="-16" r="56" fill="transparent"/>', x, y));
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
  tell('Find three dry sticks, then bring them to the ring of stones.');
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
    await reach(s);
    count(s);
    s.remove();
    rustle();
  }));
  enough = true;
  tell('That is enough. Now to the ring of stones.');
  await reach(fire, 200);
  hush();
  knock();
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
