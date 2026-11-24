// The seventh day: rest. Genesis 2:1–3.
// Nothing to solve. The work is finished: the handle and its cogs are put away, and the music is the fullest of the
// whole chapter. Now everything that was made answers a click, each with a sound of its own, a movement, and a note
// of scripture: the sky, the waters above it, the sun, the land and its plants, the sea and what swims in it, the
// birds, the animals and the people. "Rest" is there for whenever the player has looked long enough; then the last
// two verses, and the chapter is done.
import { overlay, hud, html, sleep, click, tap, wonder, leap } from './engine.js';
import { music, quiet, shine, sweep, plop, flow, rustle, chirp, knock, drip, pluck, STRINGS } from './audio.js';
import { finish } from './map.js';
import { NOTES } from './shared.js';
import { rank, waves, verse, tell, days } from './theatre.js';
import { rest } from './day1.js';
import { VOICE } from './day6.js';

// What answers a click: [which things, their note, their sound]. How each of them moves is in index.html (`.play`).
// The music is loud today, so it drops back for a moment to let each sound be heard.
function wonders() {
  const rain = () => [0, 1, 2, 3].forEach(i => setTimeout(drip, i * 110, 880 - i * 110)), chord = () => [0, 2, 4, 6].forEach((n, i) => setTimeout(pluck, i * 60, STRINGS[n], 0.4));
  let hush;
  const heard = sound => () => (quiet(true), clearTimeout(hush), (hush = setTimeout(quiet, 1700, false)), sound());
  for (const [what, text, sound] of [
    [[rank.sky.querySelector('.sky > g')], NOTES.heaven, sweep],
    [[0, 1, 2].map(k => waves[k].firstElementChild), NOTES.above, rain],
    [[rank.sky.querySelector('.riding .piece')], NOTES.sun, shine],
    [[waves[3].firstElementChild], NOTES.land, () => setTimeout(flow(0.2), 500)], // the sea (a wash of water): the hindmost of its three waves, so that the fish swimming in front of it can be clicked too
    [[...rank.land.querySelectorAll('.land')].map(land => land.parentNode), NOTES.land, knock],
    [rank.land.querySelectorAll('.plant'), NOTES.plant, rustle],
    [rank.water.querySelectorAll('.made'), NOTES.fish, plop],
    [rank.sky.querySelectorAll('.made'), NOTES.bird, chirp],
    ...[...rank.land.querySelectorAll('.beast')].map((beast, i) => [[beast], NOTES.beast, VOICE[i]]), // the ox, the tortoise, the lion and the sheep
    [rank.land.querySelectorAll('.dolls'), NOTES.people, chord],
  ]) for (const el of what) wonder(el, text, heard(sound));
}

export async function play() {
  music('rest');
  await sleep(1500);
  await verse('Thus the heavens and the earth, and all the host of them, were finished.', 'Genesis 2:1');
  shine();
  rest();
  wonders();
  tell('The seventh day. The work is finished! Click on anything that was made.');
  await Promise.race([sleep(8000), new Promise(leap)]);
  tell(''); // (the card makes way for the button, which lies where it lay)
  const done = html('<div class="choices"><b class="card">Rest</b></div>');
  hud.append(done);
  await Promise.race([tap(done.firstChild), new Promise(leap)]);
  done.remove();
  await verse('And on the seventh day God ended His work which He had done, and He rested on the seventh day from all His work which He had done.', 'Genesis 2:2');
  await verse('Then God blessed the seventh day and sanctified it, because in it He rested from all His work which God had created and made.', 'Genesis 2:3');
  days(7, true);
  finish('creation'); // the map will show this story with its gold rim
  const end = overlay('<div class="card title"><h3>Creation</h3><h1>Chapter 2 complete</h1><p>click to go back to the map</p></div>');
  await sleep(2500);
  end.classList.add('on');
  shine();
  sweep();
  await sleep(900);
  await click(end);
}
