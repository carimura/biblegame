// The song. At the harp David plays a few notes and the player plays them back (no way to lose); the same game can
// be played on things in a scene instead. Then the line plays through with its words filling the screen.
import { pluck, strum, anthem, quiet, swell, STRINGS } from './audio.js';
import { overlay, sleep, click, roam, hud, html, inset } from './engine.js';
import { cut } from './art.js';

const BEAT = 520;
const yoke = x => 95 + ((x - 105) * 30) / 430; // the crossbar slants, so low strings are longer

const el = overlay(`<p class="cue"></p>
<svg class="lyre" viewBox="0 0 640 700">
  ${cut('<path d="M195,490C150,380 110,260 150,110M445,490C490,380 530,260 490,110" fill="none" stroke="#8a5a37" stroke-width="34" stroke-linecap="round"/>')}
  ${cut('<path d="M170,470Q320,440 470,470L500,640Q320,690 140,640Z" fill="#a8744b"/>')}
  ${cut('<path d="M105,95L535,125" stroke="#74492c" stroke-width="30" stroke-linecap="round"/>')}
  <circle cx="320" cy="585" r="24" fill="#5b3b26"/><rect x="200" y="504" width="240" height="13" rx="5" fill="#5b3b26"/>
  ${STRINGS.map((_, i) => {
    const x1 = 170 + i * 50, at = `x1="${x1}" y1="${yoke(x1)}" x2="${215 + i * 35}" y2="510"`;
    return `<g class="string" data-i="${i}"><line class="vis" ${at}/><line class="hit" ${at}/></g>`;
  }).join('')}
</svg>
<p class="verse"></p>`);

const strings = [...el.querySelectorAll('.string')], verse = el.querySelector('.verse');
el.classList.add('harp');
const cue = text => (el.querySelector('.cue').textContent = text);
const MORE = '<small class="more">click to continue</small>';
// What is said when it is the player's turn to play: spelled out the first time, short after that.
let shown = false;
const turn = () => (shown ? 'Your turn!' : ((shown = true), 'Can you play the notes like I just did? Try!'));
// A line has been played: its reference comes up, and it stays to be read until a click.
async function linger() {
  verse.classList.add('done');
  await sleep(700);
  await click(el);
}

function ring(i) {
  pluck(STRINGS[i]);
  strings[i].classList.remove('ring');
  strings[i].getBoundingClientRect(); // restart the wobble
  strings[i].classList.add('ring');
}

// notes: [[string, beats], ...]
async function play(notes, beat = BEAT) {
  for (const [i, beats] of notes) {
    ring(i);
    await sleep(beats * beat);
  }
}

// One line of the psalm played right through, each phrase of its words lighting as it comes. The tune goes alone
// until its very last note, which comes home with a few strings rolled above it: `full` is how far the song has
// come, and the roll grows with it.
async function recite(chunks, spans, full, beat) {
  for (const [n, c] of chunks.entries()) {
    const last = n === chunks.length - 1;
    spans[n].className = 'now';
    await play(last ? c.notes.slice(0, -1) : c.notes, beat);
    if (last) {
      strum(full);
      await play(c.notes.slice(-1), beat);
    }
    spans[n].className = 'got';
  }
}

// Wait for the player to play `notes` back. With `guide`, the next string glows.
function echo(notes, guide) {
  return new Promise(done => {
    let k = 0;
    const mark = on => strings.forEach((s, i) => s.classList.toggle('next', on && guide && i === notes[k][0]));
    mark(true);
    el.onpointerdown = e => {
      const s = e.target.closest('.string');
      if (!s) return;
      ring(+s.dataset.i);
      const right = +s.dataset.i === notes[k][0];
      if (right && ++k < notes.length) return mark(true);
      el.onpointerdown = null;
      mark(false);
      setTimeout(done, 600, right);
    };
  });
}

// David plays `notes`, then the player plays them back. It goes round until they have it.
async function round(notes) {
  for (let guide = false; ; guide = true) {
    cue(guide ? 'Let’s listen again…' : 'Listen…');
    await sleep(guide ? 1100 : 500);
    await play(notes);
    cue(turn());
    if (await echo(notes, guide)) return;
  }
}

// chunks: [{ words, notes }, ...] for one line of the psalm. The player learns its first three pieces by ear (more
// than that is a long sit at the harp). Then the words take over the screen and the whole line plays by itself,
// and stays to be read until a click. With `whole`, the player plays those pieces back in one go as well: too
// hard for the first scenes, kept for later. With `full` null there is no reading back of this line alone: the harp
// is left on the screen for `psalm` to follow straight on (the last scene).
export async function teach(chunks, ref, full = 0, whole = false) {
  verse.className = 'verse';
  verse.innerHTML = chunks.map(c => `<span>${c.words}</span>`).join(' ') + `<small>${ref}</small>` + MORE;
  const spans = [...verse.querySelectorAll(':scope > span')], light = (list, cls) => list.forEach(s => (s.className = cls));
  const mine = chunks.slice(0, 3);
  cue('');
  quiet(true);
  el.classList.add('on');
  await sleep(1300);

  for (const [n, c] of mine.entries()) {
    light([spans[n]], 'now');
    await round(c.notes);
    light([spans[n]], 'got');
    cue('Beautiful!');
    await sleep(1100);
  }
  if (whole) {
    cue('Now all together…');
    await sleep(1200);
    light(spans.slice(0, mine.length), 'now');
    await round(mine.flatMap(c => c.notes));
  }

  cue('');
  if (full === null) return;
  light(spans, '');
  el.classList.add('read');
  await sleep(1700);
  await recite(chunks, spans, full, BEAT);
  await linger();
  await close();
}

// Bring the screen up for reading only. The harp is put away first, while the screen is still unseen: otherwise it
// showed for a moment and faded as the words came up.
function reading() {
  el.classList.add('read');
  el.getBoundingClientRect();
  el.classList.add('on');
}

async function close() {
  el.classList.remove('on');
  quiet(false);
  await sleep(1000);
  el.classList.remove('read');
}

// Several lines of the song on one page. The page starts with no words on it: `through` plays the lines straight
// through, and each phrase drops into its place, large and bright, as it is played, then settles. `look(n)` is
// called as line n begins.
const leaf = song => song.map(({ pieces }) => `<p>${pieces.map(([words]) => `<span>${words}</span>`).join(' ')}</p>`).join('');
async function through(song, full, look) {
  const spans = [...verse.querySelectorAll('p > span')];
  for (let n = 0, at = 0; n < song.length; at += song[n++].pieces.length) {
    look?.(n);
    await recite(song[n].pieces.map(([, notes]) => ({ notes })), spans.slice(at), full, 440); // a little quicker than when it is being taught
  }
}

// The song played through with its words filling the screen, which stay to be read until a click. Nothing to do but
// listen. One line is shown large; several (the song so far, by the fire) go together on one page.
export async function hear(song, full) {
  quiet(true);
  cue('');
  verse.innerHTML = '';
  reading();
  await sleep(1300);
  if (song.length > 1) {
    verse.className = 'verse page few';
    verse.innerHTML = '<h2>Our song so far</h2>' + leaf(song) + `<small>${song[0].ref}–${song.at(-1).ref.split(':')[1]}</small>` + MORE;
    await sleep(500);
    await through(song, full);
  } else {
    const [{ ref, pieces }] = song;
    verse.className = 'verse';
    verse.innerHTML = pieces.map(([words]) => `<span>${words}</span>`).join(' ') + `<small>${ref}</small>` + MORE;
    await sleep(500);
    await recite(pieces.map(([, notes]) => ({ notes })), [...verse.querySelectorAll(':scope > span')], full, 440);
  }
  await linger();
  verse.classList.add('gone');
  await sleep(500);
  await close();
}

// The end of the chapter: the whole psalm on one page, played straight through without a pause, its words dropping
// in as they are played, over chords grown loud. The world draws back into a little window beside the words, and
// `look(n)` is called as line n begins, so that the window can show the scene the line belongs to.
// If there is a recording for the ending (see `anthem`) that plays instead, with the whole psalm lit to read.
export async function psalm(song, look) {
  quiet(true);
  cue('');
  verse.classList.add('gone'); // if it follows straight on from the harp, the line under the harp fades first
  await sleep(500);
  verse.className = 'verse page gone';
  verse.innerHTML = '<h2>Psalm 23</h2>' + leaf(song) + '<h3>Chapter 1 complete</h3><small>click to go back to the map</small>';
  reading();
  inset();
  swell();
  await sleep(1600); // the harp fades, the world draws back, and the page takes its place, unseen until it is there
  verse.classList.remove('gone');
  await sleep(800);
  const recorded = await anthem();
  if (recorded) {
    verse.querySelectorAll('p > span').forEach(s => (s.className = 'got'));
    await sleep(recorded);
  } else await through(song, 6, look);
  verse.classList.add('done');
  await sleep(1500);
  await click(el);
}

// The same listen-and-answer game, played on things in the scene instead of the harp. `keys` are those things:
// { el, string } for the harp string each stands for, with its own `sound` if it has one. `phrases` are pieces of
// the tune, each [[string, beats], ...]. A card at the top of the screen says whose turn it is.
const sign = html('<div class="place card"></div>');
hud.append(sign);
export async function answer(keys, phrases) {
  const say = text => (sign.classList.toggle('on', !!text), text && (sign.textContent = text));
  const strike = k => {
    k.sound ? k.sound() : pluck(STRINGS[k.string] * 2, 0.4);
    k.el.classList.remove('play');
    k.el.getBoundingClientRect(); // restart its movement
    k.el.classList.add('play');
  };
  let heard;
  const over = new AbortController(); // when the game is done its things stop being keys (the sheep went on singing)
  for (const k of keys) {
    k.el.classList.add('key');
    k.el.addEventListener('pointerdown', e => {
      e.stopPropagation();
      strike(k);
      heard?.(k);
    }, { signal: over.signal });
  }
  roam(false); // he stands and listens
  quiet(true);
  for (const notes of phrases)
    for (let guide = false, right = false; !right; guide = true) {
      say(guide ? 'Let’s listen again…' : 'Listen…');
      await sleep(guide ? 1300 : 900);
      for (const [i, beats] of notes) {
        strike(keys.find(k => k.string === i));
        await sleep(beats * BEAT);
      }
      say(turn());
      right = await new Promise(done => {
        let n = 0;
        const mark = on => keys.forEach(k => k.el.classList.toggle('next', on && guide && k.string === notes[n][0]));
        mark(true);
        heard = k => {
          const ok = k.string === notes[n][0];
          if (ok && ++n < notes.length) return mark(true);
          heard = null;
          mark(false);
          setTimeout(done, 700, ok);
        };
      });
      if (right) {
        say('Beautiful!');
        await sleep(1200);
      }
    }
  say('');
  over.abort();
  for (const k of keys) k.el.classList.remove('key', 'play');
  quiet(false);
  roam(true);
}
