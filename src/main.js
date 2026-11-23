import { overlay, click, sleep, roam, fade, clamp, arrive, lead, go, dissolve, pause } from './engine.js';
import { cast } from './shared.js';
import { start, sweep, mute } from './audio.js';
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

sessionStorage.removeItem('tries'); // everything arrived (see index.html)
const scenes = [fold, pastures, waters, lost, night, valley, table, home];
const creation = [light, sky]; // the days of Creation that are made so far

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
// `#day2` does the same for Creation: it starts at that day, with the days before it already made.
const first = clamp(+location.hash.slice(1) || 1, 1, scenes.length), day = clamp(+location.hash.slice(4) || 0, 0, creation.length);
const creating = location.hash ? day > 0 : (await map()) === 'creation'; // the map of all the stories
if (creating) {
  theatre(); // its black picture takes the place of the fold
  for (const d of creation) d.build();
}

const title = overlay(`<div class="card title"><h3>Chapter ${creating ? 2 : 1}</h3><h1>${creating ? 'Creation' : 'The Shepherd’s Song'}</h1><h2>${creating ? 'Genesis 1' : 'Psalm 23'}</h2><p>click to begin</p></div>`);
title.classList.add('on');
await click(title);
start(); // audio needs a click first
creating || sweep(); // Creation begins in silence
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

if (creating) {
  const from = Math.max(day, 1) - 1;
  for (const d of creation.slice(0, from)) d.skip();
  for (const d of creation.slice(from)) await d.play();
  const more = overlay('<div class="card title"><h3>Creation</h3><h1>To be continued</h1><p>The third day is still to be made. Click to go back to the map.</p></div>');
  more.classList.add('on');
  await sleep(900);
  await click(more);
  location.href = location.pathname;
} else if (first > 1) {
  fold.skip();
  await travel(first - 1, 'left');
} else await fold.play();
