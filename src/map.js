// The map: one road through the stories. The shepherd's song comes first, as the way in; the rest follow in the order
// they happened. A story that can be played is in colour, and its rim turns gold once it has been finished.
// Finishing a story opens the next one, if it is built: back on the map it turns from gray to colour in a flash.
// The rest are gray: stories not yet earned, and places kept for stories not built yet (see the project notes),
// each with a small picture so the map can be looked at before they exist.
import { overlay, sleep, when, LOCAL } from './engine.js';
import { rnd, cut, hills, olive, tufts, sheep } from './art.js';
import { start, music, sounding } from './audio.js';

const STAR = 'M0,-10Q1.5,-1.5 10,0Q1.5,1.5 0,10Q-1.5,1.5 -10,0Q-1.5,-1.5 0,-10Z';
const CLOUD = 'M0,0q40,-28 92,-14q32,-26 84,-8q54,-10 74,14q22,12 -8,18h-236q-34,-4 -6,-10z';
const FISH = 'M-20,0Q-4,-11 13,0Q-4,11 -20,0ZM11,0L24,-8V8Z';
const sky = fill => `<rect x="-74" y="-74" width="148" height="148" fill="${fill}"/>`;
const p = (d, fill, more = '') => `<path d="${d}" fill="${fill}" ${more}/>`;
const star = (x, y, s) => p(STAR, '#fdf1cf', `transform="translate(${x},${y}) scale(${s})"`);
const waves = (y, fill) => cut(p(`M-74,${y}q9,-9 18.5,0${'t18.5,0'.repeat(7)}V74H-74Z`, fill), 1);
const stars = star(-52, -46, 0.5) + star(-22, -58, 0.4) + star(-58, -10, 0.35) + star(52, -52, 0.4) + star(58, -14, 0.3);

// [what it is kept under, its name, its picture (drawn in a circle 148 across, centred on 0,0), built or not]
const STORIES = [
  ['shepherd', 'The Shepherd’s Song',
    sky('#f7dfae') + '<circle cx="36" cy="-36" r="24" fill="#f8d77a" opacity=".45"/>' + cut('<circle cx="36" cy="-36" r="14" fill="#f6b84a"/>', 1) +
    cut(p('M-74,74V14Q-26,-12 26,10Q52,20 74,10V74Z', '#8fb45f'), 1) + `<g transform="translate(-6,56) scale(.72)">${sheep('')}</g>`, true],
  ['creation', 'Creation',
    sky('#a9d8ea') + '<rect x="-74" y="-74" width="74" height="148" fill="#27305f"/>' + star(-52, -48, 0.5) + star(-18, -58, 0.4) + star(-60, -12, 0.35) + star(-14, -18, 0.3) +
    cut(p('M0,-14a14,14 0 1 0 10,24a11,11 0 1 1 -10,-24z', '#fdf1cf', 'transform="translate(-40,-34)"'), 1) +
    '<circle cx="38" cy="-30" r="27" fill="#f8d77a" opacity=".4"/>' + cut('<circle cx="38" cy="-30" r="17" fill="#f6c54a"/>', 1) +
    waves(24, '#4f8fb5') + cut(p('M-74,74V56Q-30,30 14,50Q44,62 74,48V74Z', '#7da35a'), 1), true],
  ['ark', 'Noah’s Ark',
    sky('#c6dbe4') + cut([['#d9634a', 58], ['#f0c14d', 49], ['#6fa8c9', 40]].map(([c, r]) => `<path d="M${-r},22a${r},${r} 0 0 1 ${2 * r},0" fill="none" stroke="${c}" stroke-width="9"/>`).join(''), 1) +
    cut('<rect x="-24" y="-12" width="48" height="26" fill="#b98a55"/>' + p('M-31,-12L0,-30L31,-12Z', '#74492c') + '<rect x="-6" y="-6" width="12" height="12" rx="2" fill="#4a3c36"/>' + p('M-48,10H48Q42,40 24,42H-24Q-42,40 -48,10Z', '#8a5a37'), 1) +
    waves(36, '#4f8fb5') + waves(54, '#6fa8c9'), true],
  ['sea', 'Moses and the Sea',
    sky('#f6e3b4') + '<circle cy="-34" r="22" fill="#fff3c4"/>' + cut(p('M-24,74L-7,-14H7L24,74Z', '#e3c88e'), 1) +
    cut(p('M-74,-34Q-42,-50 -24,-26Q-10,-4 -24,74H-74Z', '#3f86b0') + p('M74,-34Q42,-50 24,-26Q10,-4 24,74H74Z', '#3f86b0'), 1) +
    cut(p('M-74,-34Q-42,-50 -24,-26Q-36,-34 -52,-28Q-64,-24 -74,-14Z', '#9fd0e6') + p('M74,-34Q42,-50 24,-26Q36,-34 52,-28Q64,-24 74,-14Z', '#9fd0e6'), 1) +
    cut('<path d="M0,62V22q0,-9 8,-9" fill="none" stroke="#7b5a3d" stroke-width="5" stroke-linecap="round"/>', 1)],
  ['goliath', 'David and Goliath', // a sling, and five smooth stones from the brook
    sky('#ead3a2') + cut(p('M-74,22Q-36,10 0,24T74,20V50Q36,56 0,48T-74,54Z', '#6fb0cf'), 1) +
    cut([[-40, 34, '#b9ad9c'], [-18, 41, '#cfc4b2'], [4, 33, '#a79a88'], [26, 41, '#b9ad9c'], [46, 33, '#cfc4b2']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="9" fill="${c}"/>`).join(''), 1) +
    cut('<path d="M-44,-56C-8,-62 -34,-22 -8,-18M44,-56C8,-62 34,-22 8,-18" fill="none" stroke="#7b5a3d" stroke-width="4" stroke-linecap="round"/><ellipse cy="-16" rx="15" ry="9" fill="#8a5a37"/>', 1)],
  ['birth', 'The Birth of Jesus',
    sky('#27305f') + stars + p('M-4,-40H4L16,10H-16Z', 'rgba(253,241,207,.3)') + cut(p(STAR, '#fdf1cf', 'transform="translate(0,-44) scale(2)"'), 1) +
    cut(p('M-74,40Q0,24 74,40V74H-74Z', '#4f5d4c'), 1) + '<rect x="-28" y="8" width="56" height="34" fill="#f3cf78"/>' +
    cut('<rect x="-33" y="4" width="6" height="40" fill="#8a5a37"/><rect x="27" y="4" width="6" height="40" fill="#8a5a37"/>' + p('M-44,6L0,-16L44,6L37,12H-37Z', '#74492c'), 1) +
    cut(p('M-13,28H13L9,42H-9Z', '#a8744b') + '<ellipse cy="27" rx="13" ry="5" fill="#f6e3a0"/>', 1)],
  ['miracles', 'The Miracles of Jesus', // five loaves and two fish
    sky('#bfe0ec') + cut(p('M-74,74V34Q-30,14 20,30Q50,38 74,28V74Z', '#8fb45f'), 1) +
    cut([-30, -15, 0, 15, 30].map((x, i) => `<ellipse cx="${x}" cy="${i % 2 ? 0 : 5}" rx="12" ry="9" fill="${i % 2 ? '#d9a865' : '#e2b877'}"/>`).join(''), 1) +
    cut(p(FISH, '#8fa9b8', 'transform="translate(-13,-20) rotate(-14)"') + p(FISH, '#a9bfcb', 'transform="translate(15,-30) rotate(12) scale(-1,1)"'), 1) +
    cut(p('M-42,10H42L33,52H-33Z', '#b98a55') + '<rect x="-46" y="5" width="92" height="11" rx="5" fill="#8a5a37"/><path d="M-37,28H37M-35,40H35" stroke="#8a5a37" stroke-width="2.5"/>', 1)],
  ['risen', 'The Resurrection', // morning in the garden: the stone rolled away, and light from the empty tomb
    sky('#fbe6ad') + '<circle cy="-20" r="52" fill="#fff6d2" opacity=".7"/>' + cut('<circle cy="-20" r="26" fill="#fff0b0"/>', 1) +
    cut(p('M-74,74V8Q-48,-18 -8,-12Q32,-18 58,8Q70,20 74,30V74Z', '#b9ad9c'), 1) +
    '<path d="M-22,74V34a22,22 0 0 1 44,0V74" fill="#fff3c4" stroke="#8f8474" stroke-width="5"/>' +
    cut('<circle cx="46" cy="46" r="21" fill="#9a8e7d"/>', 1) + cut(p('M-74,74V62Q0,54 74,62V74Z', '#7da35a'), 1) +
    [[-54, 66], [-36, 63], [-6, 66], [14, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#f6efe0"/>`).join('')],
];
const AT = STORIES.map((_, i) => [140 + i * 188.5, i % 2 ? 610 : 440]);

// Which stories are finished is kept in the browser, so the map remembers. If it cannot be kept, the map just forgets.
export function finish(id) { try { localStorage['done:' + id] = 1; } catch {} }
const finished = id => { try { return localStorage['done:' + id]; } catch {} };
// A story can be played once it is built and the story before it on the road has been finished (the first always
// can). The first time the map comes up after that, the story is still gray, and then takes its colours in a flash:
// `shown` remembers that this has been seen. (Where nothing can be kept, every story that is built can be played.)
// Played from the computer it is being made on (`LOCAL`), every story that is built is open and in colour from the
// start: nothing has to be finished first.
const playable = i => { try { return STORIES[i][3] && (LOCAL || !i || !!localStorage['done:' + STORIES[i - 1][0]]); } catch { return STORIES[i][3]; } };
const shown = id => { try { return LOCAL || localStorage['open:' + id]; } catch { return 1; } };

function country() {
  const r = rnd(23), pts = [[-240, 520], ...AT, [1840, 500]];
  let road = `M${pts[0]}`;
  for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], m = (x0 + x1) / 2; road += `C${m},${y0} ${m},${y1} ${x1},${y1}`; }
  // drawn 200 wider on each side and 80 taller than the 1600x900 view, for windows that show more
  return `<svg viewBox="0 0 1600 900" width="1600" height="900"><defs><linearGradient id="mapsky" x2="0" y2="1"><stop stop-color="#a9d3e6"/><stop offset=".42" stop-color="#f7ead0"/></linearGradient></defs>
    <rect x="-200" y="-80" width="2000" height="1060" fill="url(#mapsky)"/>
    <circle cx="1330" cy="170" r="120" fill="#f8d77a" opacity=".2"/><circle cx="1330" cy="170" r="80" fill="#f8d77a" opacity=".3"/>${cut('<circle cx="1330" cy="170" r="46" fill="#f8d77a"/>')}
    ${cut([[90, 190, 0.9], [560, 250, 0.6], [1010, 120, 0.7]].map(([x, y, s]) => p(CLOUD, '#fbf6ea', `transform="translate(${x},${y}) scale(${s})"`)).join(''), 1)}
    <g transform="translate(-200,0)">${[[310, 60, 320, '#c7d8c4'], [410, 60, 380, '#b3cd97'], [550, 50, 420, '#9dbf78'], [690, 50, 460, '#88ad63'], [820, 40, 500, '#739a52']].map(([y, amp, step, fill]) => cut(p(hills(2000, y, amp, step, r, 1000), fill))).join('')}
    ${tufts(90, 2000, 440, 960, r, [0, 0, 0])}</g>
    ${[[330, 372, 0.3], [905, 380, 0.26], [1560, 420, 0.3], [520, 850, 0.44], [900, 856, 0.4], [1290, 850, 0.4], [-60, 700, 0.4]].map(([x, y, s]) => `<g transform="translate(${x},${y})">${olive(r, s)}</g>`).join('')}
    ${cut(`<path d="${road}" fill="none" stroke="#f1e2bf" stroke-width="30" stroke-linecap="round"/>`)}<path d="${road}" fill="none" stroke="#c8a56f" stroke-width="5" stroke-dasharray="1 20" stroke-linecap="round"/></svg>`;
}

// Show the map, and wait for a story to be chosen. The map has a small tune of its own. A browser lets no sound out
// of a page newly opened until it has been clicked, and nothing can be done about that: so until sound is getting
// out the map waits, dimmed, under "Click to begin", and the first click only wakes it and the tune (it chooses
// nothing). Coming back from a story, sound is let out at once, and the map is awake as soon as it shows.
export function map() {
  start();
  addEventListener('pointerdown', start, { once: true });
  music('map');
  const el = overlay(`<div class="map hushed">${country()}${STORIES.map(([id, name, art], i) => {
    const open = playable(i) && (!i || shown(id));
    return `<div class="stop${open ? ' open' : playable(i) ? ' due' : ''}${open && !finished(id) ? ' new' : ''}" data-id="${id}" style="left:${AT[i][0]}px;top:${AT[i][1]}px"><svg viewBox="-74 -74 148 148">${art}</svg><b class="card">${name}</b></div>`;
  }).join('')}<div class="place card on">Click to begin</div><small>Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved.</small></div>`);
  el.classList.add('on');
  // the finished ones take their gold rims as you watch
  setTimeout(() => el.querySelectorAll('.stop').forEach(s => finished(s.dataset.id) && s.classList.add('done')), 700);
  // and then the story that has just been earned opens, in a flash
  setTimeout(() => el.querySelectorAll('.stop.due').forEach(s => {
    s.className = 'stop open new opened';
    try { localStorage['open:' + s.dataset.id] = 1; } catch {}
  }), 2000);
  const wake = () => (el.firstChild.classList.remove('hushed'), (el.querySelector('.place').textContent = 'Choose a story'));
  when(sounding).then(wake);
  return new Promise(chosen => el.addEventListener('pointerdown', async e => {
    const stop = e.target.closest('.stop.open');
    if (el.querySelector('.hushed')) return wake(); // (even if no sound ever comes)
    if (!stop) return;
    el.classList.remove('on');
    chosen(stop.dataset.id);
    await sleep(1000);
    el.remove();
  }));
}
