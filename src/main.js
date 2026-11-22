import { overlay, click, sleep, roam, fade, clamp, arrive, lead, go, dissolve } from './engine.js';
import { cast } from './shared.js';
import { start, sweep } from './audio.js';
import { map } from './map.js';
import * as fold from './scene1.js';
import * as pastures from './scene2.js';
import * as waters from './scene3.js';
import * as lost from './scene4.js';
import * as night from './scene5.js';
import * as valley from './scene6.js';
import * as table from './scene7.js';
import * as home from './scene8.js';

sessionStorage.removeItem('tries'); // everything arrived (see index.html)
const scenes = [fold, pastures, waters, lost, night, valley, table, home];

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
// to: David comes into it and walks on with the flock behind him, ending by what the line is about.
// For each line but the last: [its scene, where he starts, where he walks to, how far down the ground].
// The scenes are told they are only being looked back at, so one never visited (the game was started further on)
// does not begin its story.
const LOOK = [[0, 1000, 1560, 800], [1, 1900, 2460, 870], [2, 780, 1330, 965], [3, 1880, 2440, 830], [5, 700, 1260, 850], [6, 1440, 2000, 880]];
function recall(n) {
  const [i, from, to, y] = LOOK[n];
  dissolve(() => (scenes[i].enter('left', true), arrive(from, y), lead(cast.flock, -1), go([[to, y]])));
}

// The last scene has nowhere to go on to: it is given the look back instead.
for (let i = scenes.length - 1; i >= 0; i--) scenes[i].build(i < scenes.length - 1 ? () => travel(i + 1, 'left') : recall, () => travel(i - 1, 'right'));

// Adding a number to the address, such as #4, starts at that scene with the flock already gathered (and skips the map).
const first = clamp(+location.hash.slice(1) || 1, 1, scenes.length);
if (!location.hash) await map(); // the map of all the stories; this one is the only one built so far

const title = overlay('<div class="card title"><h3>Chapter 1</h3><h1>The Shepherd’s Song</h1><h2>Psalm 23</h2><p>click to begin</p></div>');
title.classList.add('on');
await click(title);
start(); // audio needs a click first
sweep();
title.classList.remove('on');
await sleep(1400);

if (first > 1) {
  fold.skip();
  await travel(first - 1, 'left');
} else await fold.play();
