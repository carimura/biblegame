import { overlay, click, sleep, roam, fade, clamp, arrive, lead, go, dissolve, pause } from './engine.js';
import { cast } from './shared.js';
import { start, sweep, mute, music } from './audio.js';
import { map } from './map.js';
import * as fold from './scene1.js';
import * as pastures from './scene2.js';
import * as waters from './scene3.js';
import * as lost from './scene4.js';
import * as night from './scene5.js';
import * as valley from './scene6.js';
import * as table from './scene7.js';
import * as home from './scene8.js';
import { build as theatre } from './theatre.js';
import * as light from './day1.js';
import * as sky from './day2.js';
import * as land from './day3.js';
import * as lights from './day4.js';
import * as life from './day5.js';
import * as beasts from './day6.js';
import * as sabbath from './day7.js';
import { build as shipyard } from './ark.js';
import * as building from './ark1.js';
import * as boarding from './ark2.js';
import * as stalls from './ark3.js';
import * as rain from './ark4.js';
import * as nights from './ark5.js';
import * as adrift from './ark6.js';
import * as dove from './ark7.js';
import * as bow from './ark8.js';

sessionStorage.removeItem('tries'); // everything arrived (see index.html)
const scenes = [fold, pastures, waters, lost, night, valley, table, home];
const creation = [light, sky, land, lights, life, beasts, sabbath]; // the seven days of Creation
const voyage = [building, boarding, stalls, rain, nights, adrift, dove, bow]; // the eight scenes of Noah's Ark

// Walk off one scene and into another, arriving on the given side of it.
async function travel(i, side) {
  roam(false);
  await fade(true);
  scenes[i].enter(side);
  await fade(false);
  roam(true);
}

// Each scene is told how to go on and how to go back. Built last to first, so the fold ends up as the scene on show.
// For the ending. As each line of the psalm is played, the little window looks back at the scene the line belongs
// to, one picture fading into the next. It is not a record of what the player did: David comes in and walks on, and
// the scene plays a little of itself (its `look`, if it has one: the flock grazing, drinking, the lamb carried back).
// For each line but the last: [its scene, where he starts, where he walks to, how far down the ground].
// The scenes are told they are only being looked back at, so their stories do not begin.
const LOOK = [[0, 1000, 1560, 800], [1, 1900, 2460, 870], [2, 780, 1330, 965], [3, 1880, 2440, 830], [5, 700, 1260, 850], [6, 1440, 2000, 880]];
function recall(n) {
  const [i, from, to, y] = LOOK[n];
  dissolve(() => {
    for (const s of cast.flock) s.classList.remove('grazing', 'resting'); // up from whatever the last scene had them doing
    scenes[i].enter('left', true);
    arrive(from, y);
    lead(cast.flock, -1);
    go([[to, y]]);
    scenes[i].look?.();
  });
}

// The last scene has nowhere to go on to: it is given the look back instead.
for (let i = scenes.length - 1; i >= 0; i--) scenes[i].build(i < scenes.length - 1 ? () => travel(i + 1, 'left') : recall, () => travel(i - 1, 'right'));

// Adding a number to the address, such as #4, starts at that scene with the flock already gathered (and skips the map).
// `#day2` does the same for Creation: it starts at that day, with the days before it already made. And `#ark2` for
// Noah's Ark: at that scene, with the ark as the scenes before it leave it.
const hash = location.hash, nth = +hash.slice(4) || 0, first = clamp(+hash.slice(1) || 1, 1, scenes.length);
const story = hash ? (hash.startsWith('#ark') ? 'ark' : nth ? 'creation' : 'shepherd') : await map(); // the map of all the stories
// Creation and Noah's Ark are told one part after another, each with a `play` and a `skip`.
const creating = story === 'creation', told = creating ? creation : story === 'ark' ? voyage : null;
if (creating) {
  theatre(); // its black picture takes the place of the fold
  for (const d of creation) d.build?.(); // (the last two days add nothing of their own until they are played)
} else if (told) shipyard(); // so does the place where the ark is built

const [chapter, name, text] = { shepherd: [1, 'The Shepherd’s Song', 'Psalm 23'], creation: [2, 'Creation', 'Genesis 1'], ark: [3, 'Noah’s Ark', 'Genesis 6–9'] }[story];
const title = overlay(`<div class="card title"><h3>Chapter ${chapter}</h3><h1>${name}</h1><h2>${text}</h2><p>click to begin</p></div>`);
title.classList.add('on');
await click(title);
start(); // audio needs a click first
music('still'); // the map's tune, which has gone on under the title, ends here
told || sweep(); // Creation and Noah's Ark begin in silence
title.classList.remove('on');

// From here on, the Esc key stops everything where it is and asks: go on, or back to the map?
const rest = overlay('<div class="card title"><h1>Paused</h1><div><b class="card">Keep playing</b><b class="card">Back to the journey map</b></div></div>');
rest.classList.add('pause');
const halt = on => (pause(on), mute(on), rest.classList.toggle('on', on));
addEventListener('keydown', e => e.key === 'Escape' && halt(!rest.classList.contains('on')));
rest.addEventListener('pointerdown', e => {
  e.stopPropagation(); // not a click for the game underneath
  const choice = e.target.closest('b');
  if (choice) choice.nextSibling ? halt(false) : (location.href = location.pathname);
});
await sleep(1400);

if (told) {
  const from = clamp(nth, 1, told.length) - 1;
  for (const d of told.slice(0, from)) d.skip();
  for (const d of told.slice(from)) await d.play();
  location.href = location.pathname; // the last part ends the chapter: back to the map
} else if (first > 1) {
  fold.skip();
  await travel(first - 1, 'left');
} else await fold.play();
