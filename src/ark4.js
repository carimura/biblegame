// Noah's Ark, scene 4: the flood, and the storm. Genesis 7:11, 7:17.
// The rain falls, the waters rise over the country where the ark was built, and lift it. Then the storm, seen as
// the ark is always seen on the waters, from the side: a wide sea under a low sky, the flood driving her on, and the
// player helping her through it. She has no sail and no rudder; she goes up and down the picture (further off, or
// nearer) to wherever the pointer is, as fast as so great a boat can. Towards her come the tops of drowned
// mountains and whole trees afloat (which drift across as they come): she cannot go through these, and is held
// against one until she is taken round it. Then currents, which sweep her a good way back if she goes into one. Then
// lightning, which strikes where a pale ring lies on the water as the ring reaches her: if she is under it she is
// driven right back to where the lightning began. What is lower in the picture is nearer, and is drawn in front.
// It can be got wrong any number of times, and there is no clock: nothing is lost but ground, and at the end not a
// plank is broken. "God kept them all safe" is the storyteller's, and Chad's: the text's own word for it is that
// God remembered Noah (8:1), which comes in its place.
import { overlay, stage, sleep, tween, smooth, when, clamp, fade } from './engine.js';
import { cut } from './art.js';
import { hammer, thunder, flow, rush, music } from './audio.js';
import { verse, tell, light } from './theatre.js';
import { waters, drowned, picture, HULL, VOICE } from './ark.js';

const HIGH = 430; // where the face of the sea lies when the flood is at its height
const AT = 360, END = 12700; // where along the picture the ark rides, and how long the storm's course is
const LANE = y => 245 + (y - 70) * 0.79; // the course was laid out for a sea 70 to 730 deep: this one lies from 245 to 766
// The course: [how far along it lies, what it is, where across the picture, and one thing more]. A `rock` has a
// size; a `log` drifts across at a speed; a `stream` is a current (the arrows on it are drawn one way or the other);
// a `bolt` is where lightning will strike. Three stretches, each with something new, and a breath between them.
const COURSE = [
  [1100, 'rock', 400, 1.2], [1600, 'rock', 200, 1], [1600, 'rock', 620, 1], [2100, 'rock', 420, 1.3], [2100, 'rock', 720, 1], [2600, 'rock', 120, 1], [2600, 'rock', 330, 1.1], [3100, 'rock', 560, 1.2], [3100, 'rock', 250, 1],
  [3900, 'stream', 250, 220], [4500, 'rock', 650, 1.2], [5000, 'log', 300, 70], [5400, 'log', 560, -80], [5900, 'stream', 560, -220], [6500, 'rock', 140, 1.2], [6500, 'rock', 420, 1], [7000, 'log', 200, 90], [7300, 'rock', 640, 1.1], [7700, 'log', 480, -90],
  [8500, 'bolt', 400], [8900, 'bolt', 200], [8900, 'rock', 620, 1.1], [9300, 'bolt', 560], [9600, 'rock', 300, 1.2], [10000, 'stream', 400, 240], [10500, 'bolt', 640], [10500, 'log', 150, 60], [10900, 'rock', 450, 1.3], [10900, 'bolt', 180],
  [11300, 'bolt', 330], [11500, 'rock', 660, 1], [11800, 'bolt', 520], [12100, 'rock', 200, 1.2], [12100, 'log', 600, -70],
];
const SAID = [
  [0, 'The storm drives the ark on, among the tops of the drowned mountains. She cannot go through them: move the pointer up and down, and take her round!'],
  [3500, 'Wild currents! Keep out of them, or they sweep her back. And whole trees are afloat.'],
  [8000, 'Lightning! A pale ring on the water shows where it will strike. Go round every ring: if she is struck, she is driven back to here.'],
];
const HELD = { rock: 'She is held against a mountain top. Take her round it: up, or down.', log: 'A great tree lies across her way. Take her round it.' };
// How each thing is drawn, where it stands in the water at (0,0); and how near the ark may come to it, along the
// water and across it, before she meets it.
const foam = w => `<path d="M${-w},5${'q10,-12 20,0t20,0'.repeat(Math.round(w / 20))}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>`;
const ART = {
  rock: s => `<g transform="scale(${s})">${cut('<path d="M-70,8L-36,-74L-10,-40L22,-108L74,8Z" fill="#59636f"/><path d="M22,-108L42,-62L20,-74L8,-52L-2,-78Z" fill="#c9d6de"/>', 1)}${foam(80)}</g>`,
  log: () => `<g transform="translate(0,-8)">${cut('<path d="M78,-5l36,-24M78,5l38,20M82,0h44" stroke="#6a4c33" stroke-width="9" stroke-linecap="round"/><rect x="-84" y="-16" width="168" height="32" rx="15" fill="#7a5a3c"/><path d="M-56,-6h74M-22,6h64" stroke="#5b4530" stroke-width="3"/><circle cx="-92" cy="-14" r="20" fill="#5f8a52"/><circle cx="-104" cy="10" r="17" fill="#4f7a45"/>', 1)}</g>${foam(120)}`,
  stream: push => `<rect x="-300" y="-92" width="600" height="184" rx="60" fill="#fff" opacity=".12"/><path class="flowing" d="${[-220, -110, 0, 110, 220].map(x => [-44, 0, 44].map(y => `M${x - 26},${y - 11 * Math.sign(push)}l26,${22 * Math.sign(push)}l26,${-22 * Math.sign(push)}`).join('')).join('')}" fill="none" stroke="#dcecf5" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`,
  bolt: () => '<ellipse class="mark" rx="88" ry="30"/>',
};
const ROOM = { rock: s => [58 * s + 88, 46], log: () => [180, 40], stream: () => [300, 110] };
const meets = (t, gone, y) => Math.abs(t.far - gone) < ROOM[t.kind](t.more)[0] && Math.abs(t.y - y) < ROOM[t.kind](t.more)[1];

// The picture: a low stormy sky, and the sea in rows of waves, darker as they come nearer. The ark is the one from
// the scenes on either side of this, at half the size, rocking as she does there.
const sea = overlay(`<p class="cue long"></p><svg class="ride" viewBox="0 0 1600 800">
  ${cut('<rect x="14" y="14" width="1572" height="772" rx="26" fill="#3f6f93"/>')}
  <svg x="14" y="14" width="1572" height="772" viewBox="14 14 1572 772"><rect width="1600" height="190" fill="#4a5362"/>
  ${cut('<path d="M0,0H1600V96q-90,44 -190,8q-100,52 -220,6q-110,46 -240,2q-120,50 -250,6q-130,42 -260,0q-120,46 -230,4q-110,40 -210,-26Z" fill="#373e4b"/>')}
  <g class="swell">${Array.from({ length: 11 }, (_, i) => `<path d="M${-200 + (i % 2) * 36},${168 + i * 58}${'q18,-14 36,0t36,0'.repeat(28)}V800H-200Z" fill="hsl(205,38%,${44 - i * 1.8}%)"/>`).join('')}</g>
  <g class="things"></g>
  <g class="craft"><g><g class="roll"><g transform="scale(.5)">${HULL}</g></g>${foam(120)}</g></g>
  <g class="things"></g></svg>
</svg><div class="fx rain" style="opacity:.8"></div><div class="fx glare"></div>`);
sea.classList.add('harp');
sea.style.background = '#1f2438'; // its own picture: nothing of the scene shows through
const svg = sea.querySelector('svg'), cue = text => (sea.firstChild.textContent = text);

// The storm. Everything on the course comes towards the ark as she is driven on, faster as the storm goes on.
async function storm() {
  const swell = svg.querySelector('.swell'), [back, front] = svg.querySelectorAll('.things'), craft = svg.querySelector('.craft'), glare = sea.querySelector('.glare');
  const course = COURSE.map(([far, kind, y, more]) => ({ far, kind, y: LANE(y), more })), solid = course.filter(t => t.kind === 'rock' || t.kind === 'log');
  let y = 500, aim = 500, gone = 0, to = null, held = null, said = 0, last = performance.now(); // (`to`: where she is being carried back to, if she is)
  sea.onpointermove = e => { const b = svg.getBoundingClientRect(); aim = ((e.clientY - b.top) * 800) / b.height + 36; }; // (the pointer is at her middle; `y` is her keel)
  // She has met something: she shudders, and somebody on board has something to say about it.
  const bump = () => {
    hammer();
    Object.values(VOICE)[(Math.random() * 6) | 0]();
    craft.classList.remove('hit');
    craft.getBoundingClientRect(); // so that she shudders afresh
    craft.classList.add('hit');
  };
  sea.classList.add('on');
  await when(() => {
    const now = performance.now(), dt = stage.classList.contains('paused') ? 0 : Math.min(50, now - last) / 1000;
    last = now;
    if (to !== null) {
      // carried back, fast, and never set down on top of anything
      gone = Math.max(to, gone - 2200 * dt);
      if (gone === to) to = solid.some(t => meets(t, gone, y)) ? to - 40 : null;
    } else {
      // driven on, unless a mountain or a tree is in her way; and across, unless one is beside her
      const on = gone + (280 + (100 * gone) / END) * dt, up = clamp(y + clamp(aim - y, -430 * dt, 430 * dt), 245, 766), was = held;
      held = solid.find(t => meets(t, on, y)) ?? null;
      gone = held ? Math.max(gone, held.far - ROOM[held.kind](held.more)[0]) : on; // (held: right up against it)
      if (held && !was) (bump(), cue(HELD[held.kind]));
      if (was && !held) cue(SAID[said - 1][1]);
      if (!solid.some(t => meets(t, gone, up) && !meets(t, gone, y))) y = up;
      if (SAID[said] && gone >= SAID[said][0]) cue(SAID[said++][1]);
      if (course.some(t => t.kind === 'stream' && meets(t, gone, y))) {
        // into a current: it sweeps her back
        to = gone - 700;
        rush(700);
        cue('The current sweeps her back! Go round it.');
      }
    }
    swell.setAttribute('transform', `translate(${-(gone % 144)},0)`);
    for (const t of course) {
      const x = AT + t.far - gone;
      if (t.struck && !(t.struck = x <= AT + 20)) continue; // (lightning that has struck is ready again once she is back before it)
      if (t.struck || x > 1750 || x < -320) {
        t.el?.remove();
        t.el = null;
        continue;
      }
      if (!t.el) {
        back.insertAdjacentHTML(t.kind === 'stream' ? 'afterbegin' : 'beforeend', `<g class="thing" data-kind="${t.kind}">${ART[t.kind](t.more)}</g>`);
        t.el = t.kind === 'stream' ? back.firstChild : back.lastChild;
      }
      if (t.kind === 'log') {
        // it drifts across, and turns back at the edge of the sea, or at the ark
        const drift = clamp(t.y + t.more * dt, 250, 760);
        if (drift === 250 || drift === 760 || (!meets(t, gone, y) && meets({ ...t, y: drift }, gone, y))) t.more = -t.more;
        else t.y = drift;
      }
      t.el.setAttribute('transform', `translate(${x},${t.y})`);
      if (t.kind !== 'stream' && t.el.parentNode !== (t.y > y ? front : back)) (t.y > y ? front : back).append(t.el); // nearer than the ark, or further off
      if (t.kind !== 'bolt' || x > AT + 20) continue;
      // the lightning strikes, where its ring is now
      const el = t.el;
      t.struck = true;
      t.el = null;
      el.innerHTML = cut('<path d="M-6,0L-50,-330H-14L-58,-800H40L8,-420H44Z" fill="#fffdf2" stroke="#f0bf2e" stroke-width="6" stroke-linejoin="round"/>', 1);
      setTimeout(() => el.remove(), 380);
      glare.classList.remove('on');
      glare.getBoundingClientRect();
      glare.classList.add('on');
      thunder(0.24);
      if (to === null && Math.abs(t.y - y) < 52) {
        // and she was under it: back to where the lightning began
        to = SAID[2][0] - 100;
        bump();
        cue('Struck by lightning! She is driven back. Go round the pale rings.');
      }
    }
    craft.setAttribute('transform', `translate(${AT},${y})`);
    return gone > END;
  });
  sea.onpointermove = null;
  cue('Rocks and wild water, great trees and lightning: and not one plank of her is broken. God kept them all safe.');
  await sleep(6000);
  sea.classList.remove('on');
  back.innerHTML = front.innerHTML = '';
  await sleep(900);
}

// Jump past this scene, for starting further on: the flood at its height, the ark riding it, and the rain still falling.
export function skip() {
  waters();
  drowned();
  picture({ level: HIGH, rest: 0, storm: 0.85, rain: 0.9 });
  light(0.6);
}

export async function play() {
  await fade(true);
  waters();
  picture({ storm: 0.85, rain: 0.9 });
  light(0.6); // under the storm the waters are dark
  music('flood');
  const dry = flow(0.07); // the rain
  await fade(false);
  await verse('In the six hundredth year of Noah’s life, in the second month, the seventeenth day of the month, on that day all the fountains of the great deep were broken up, and the windows of heaven were opened.', 'Genesis 7:11');
  // The waters rise over the land, and when they reach the ark they lift it.
  tell('The waters rise.');
  thunder();
  await tween(13000, k => picture({ level: 940 + (HIGH - 940) * k, rest: 940 + (HIGH - 940) * k + 88 < 566 ? 0 : 566 }), smooth);
  drowned();
  tell();
  await verse('Now the flood was on the earth forty days. The waters increased and lifted up the ark, and it rose high above the earth.', 'Genesis 7:17');
  await storm();
  dry();
}
