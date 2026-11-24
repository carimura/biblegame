// Noah's Ark, scene 1: the ark is built. Genesis 6:8–16, 22.
// Its frame stands ready, and six parts lie before it: three decks, the door, the window and the roof. A part is
// made fast to the rope and hauled up on the windlass (pressed and held). Nothing stops it but letting go: it has to
// be brought level with its place by hand (the outline lights when it is), and a click on the part then sets it in.
// Clicked when it is level with nothing, a little rope is let out. Where each belongs is in God's own words, the
// plan, which can be read again at any time: the door in the side (not the roof), the window up under the roof (not
// down by the keel), three decks, each resting on the one below and each timber cut to the length of one of them (a
// short one, a middling one and a long one), and the roof last of all. Then, close up, the planks are pegged (a
// mallet goes to and fro, and a click brings it down, on a peg or not) and the gaps between them brushed with pitch.
import { actor, place, tween, smooth, clamp, sleep, when, say, tell, hush, hint, reach, roam, go, still, overlay, html, hud } from './engine.js';
import { cut } from './art.js';
import { knock, tick, tie, hammer, swish, music, pluck, STRINGS } from './audio.js';
import { verse, patience } from './theatre.js';
import { LORD, counter } from './shared.js';
import { ARK, DOOR, SHUTTER, find, below, ark, berths, built, enter } from './ark.js';

const PLAN = 'And this is how you shall make it: The length of the ark shall be three hundred cubits, its width fifty cubits, and its height thirty cubits. You shall make a window for the ark, and you shall finish it to a cubit from above; and set the door of the ark in its side. You shall make it with lower, second, and third decks.';
const TOP = [ARK[0], 30], WINCH = [2040, 700], STAND = [2132, 718]; // the head of the sheer legs, the windlass, and where Noah stands to turn it
const REST = [ARK[0], 470]; // where the end of the rope hangs when nothing is on it
// The parts lying ready: [what it is, where it lies, and for a deck timber how long a deck it is cut for]; how each
// is drawn, about its own middle; and how far above its middle the rope is made fast. The three decks are of three
// lengths (`DECKS`, lowest first), and each timber fits one of them. A timber is drawn far shorter than the deck it
// stands for (`drawn` is half its length), but plainly short, middling or long as that is; and the three lie with
// their left ends together, so that they can be told apart at a glance.
const DECKS = [1208, 1300, 1120];
const PARTS = [['deck', 1800, 846, 1300], ['deck', 1602, 878, 1120], ['deck', 1699, 910, 1208], ['roof', 1800, 958], ['door', 1680, 742], ['window', 1905, 786]];
const drawn = len => (len - 1000) * 1.1;
const TOKEN = {
  deck: (len, h = drawn(len)) => cut(`<rect x="${-h}" y="-11" width="${2 * h}" height="22" rx="3" fill="#e3c08a"/><path d="M${12 - h},-11v22M${h - 12},-11v22" stroke="#a67c55" stroke-width="3"/>`, 1),
  roof: cut('<path d="M-150,25L-136,-25H136L150,25Z" fill="#74492c"/><path d="M-142,5H142M-146,-9H146" stroke="#5f3a22" stroke-width="4"/>', 1),
  door: DOOR,
  window: SHUTTER,
};
const HALF = { deck: 11, roof: 25, door: 85, window: 30 };

let rig, winch, rope, span, parts, hook = null, held = false, plan;

// The sheer legs standing over the ark with the rope through the block at their head, the windlass that hauls on
// it, and the parts.
function rigging() {
  rig = actor(below, 'rigging', cut(`<path d="M1200,672L${TOP}L2000,672" fill="none" stroke="#8a6445" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${TOP[0]}" cy="${TOP[1] + 16}" r="15" fill="#5b4530"/>`) + '<path class="span"/><path class="cord"/>', 0, 0);
  [span, rope] = rig.querySelectorAll('.span,.cord');
  winch = actor(below, 'winch', cut('<path d="M-46,0L-32,-80H-20L-8,0ZM8,0L20,-80H32L46,0Z" fill="#8a6445"/><rect x="-40" y="-78" width="80" height="36" rx="15" fill="#c79a62"/><path d="M-22,-78v36M0,-78v36M22,-78v36" stroke="#a67c55" stroke-width="3"/><g class="crank"><path d="M46,-60V-100" fill="none" stroke="#5b4530" stroke-width="9" stroke-linecap="round"/><circle cx="46" cy="-100" r="10" fill="#b65a3c"/></g><circle cx="46" cy="-60" r="8" fill="#5b4530"/>', 1) + '<circle cy="-50" r="80" fill="transparent"/>', ...WINCH);
  winch.onpointerdown = e => {
    e.stopPropagation(); // not a click to walk by
    e.target.setPointerCapture(e.pointerId);
    held = true;
  };
  winch.onpointerup = winch.onpointercancel = () => (held = false);
  parts = PARTS.map(([kind, x, y, len]) => {
    const w = len ? drawn(len) : 90, h = HALF[kind] + (len ? 5 : 20); // what a click may land on (the timbers lie close together)
    return Object.assign(actor(below, 'part', (len ? TOKEN.deck(len) : TOKEN[kind]) + `<rect x="${-w}" y="${-h}" width="${2 * w}" height="${2 * h}" fill="transparent"/>`, x, y), { kind, len, lie: [x, y] });
  });
  line();
}
// The rope: from the windlass up over the block, and down to whatever hangs on it. And, once a timber is up by the
// frame, a dashed line through it for how far the deck it stands for would really reach.
function line() {
  rope.setAttribute('d', `M${WINCH[0]},${WINCH[1] - 60}L${TOP[0]},${TOP[1] + 16}L${hook ? [hook.pos[0], hook.pos[1] - HALF[hook.kind]] : REST}`);
  span.setAttribute('d', hook?.len && hook.pos[1] < ARK[1] ? `M${hook.pos[0] - hook.len / 2},${hook.pos[1]}h${hook.len}` : '');
}

// Let a part down again to where it lay.
async function lower(part) {
  const [x, y] = part.pos;
  await tween(1300, k => (place(part, x + (part.lie[0] - x) * k, y + (part.lie[1] - y) * k), line()), smooth);
  hook = null;
  line();
}
// A part hangs on the rope, and the places it could go are outlined. While the windlass is held it rises, swinging
// in under the head of the legs; let go, and it hangs where it is. Nothing stops it at a place: when it hangs level
// with one (within `NEAR`), that outline lights, and a click on the part sets it in there. A click when it is level
// with nothing lets out a little rope, a shade less than the room there is at a place, so that a part hauled just
// too high comes down level. Gives back the place chosen.
const NEAR = 22;
async function hoist(part) {
  const open = berths.filter(b => b.kind === part.kind && !b.filled), high = open.map(b => ARK[1] - b.h), top = Math.min(...high) - 30;
  let clicked = false, slack = 0, beat = 0, last = performance.now(), at;
  for (const b of open) b.el.classList.add('on');
  part.classList.add('key');
  part.onpointerdown = e => (e.stopPropagation(), (clicked = true));
  await when(() => {
    const now = performance.now(), dt = Math.min(50, now - last) / 1000, [x, y] = part.pos, up = held && !slack && y > top;
    const move = slack ? Math.min(slack, 150 * dt) : up ? -Math.min(y - top, 170 * dt) : 0;
    last = now;
    winch.classList.toggle('turning', up);
    if (slack) slack -= move;
    if (move) (place(part, x + (ARK[0] - x) * Math.min(1, dt * 4), y + move), line());
    if (up) y + move > top ? hush() : tell('That is as high as it will go. Click it, and I will let out a little rope.');
    if (up && (beat += dt) > 0.14) (beat = 0), tick();
    at = open.find(b => Math.abs(ARK[1] - b.h - part.pos[1]) < NEAR);
    for (const b of open) b.el.classList.toggle('at', b === at);
    if (!clicked) return false;
    clicked = false;
    if (at) return true;
    if (part.pos[1] > Math.max(...high) + NEAR) tell('It is not up by its place yet. Press and hold the windlass, to haul it up.');
    else (tell('It is not level with a place. I will let out a little rope.'), (slack = 2 * NEAR - 4));
    return false;
  });
  part.onpointerdown = null;
  part.classList.remove('key');
  for (const b of open) b.el.classList.remove('on', 'at');
  winch.classList.remove('turning');
  hush();
  return at;
}
// How many decks are in; and what is wrong with putting this part in that place, if anything is.
const decked = () => berths.filter(b => b.kind === 'deck' && b.filled).length;
function wrong(part, berth, left) {
  if (part.len > DECKS[berth.k]) return 'This timber is too long for that deck. See how it sticks out past the frame!';
  if (part.len < DECKS[berth.k]) return 'This timber is too short for that deck. It does not reach the frame at both ends.';
  if (part.len && berth.k !== decked()) return 'Nothing holds it up there yet! Each deck rests on the one below it: the lower deck comes first.';
  if (part.kind === 'roof' && left > 1) return 'The roof goes on last of all, or how would we get the rest in?';
  if (berth.k === 'top') return 'A door in the roof? How would the animals climb up to it! Read the plan again: where does the door go?';
  if (berth.k === 'low') return 'A window down by the keel? The water would pour in! Read the plan again: where does the window go?';
}
const PRAISE = { deck: ['The lower deck is in!', 'The second deck!', 'And the third deck. Three, as the plan says.'], door: ['The door, in its side, as the plan says.'], window: ['The window, up under the roof.'], roof: ['And the roof over it all!'] };

async function raise() {
  const count = counter();
  let left = [...parts];
  // Every wrong try is answered in words at once. After two of them, a part that could go in next glows.
  const help = patience([() => (left.find(p => p.len === DECKS[decked()]) ?? left.find(p => p.kind !== 'roof') ?? left[0]).classList.add('next')], 2);
  while (left.length) {
    roam(true);
    const part = await Promise.race(left.map(p => reach(p, 175, true).then(() => p)));
    for (const p of left) (p.task = null), p.classList.remove('live', 'next');
    roam(false);
    hook = part;
    line();
    tie();
    go(find(...STAND));
    await when(still);
    // (the first time, a ring shows what is to be pressed and held: that is new here)
    const ring = left.length < 6 ? () => {} : (tell('The rope is fast. Press and hold the windlass, to haul it up. Let go when it hangs level with its place, and click it to set it in.'), hint(below, WINCH[0], WINCH[1] - 50));
    const berth = await hoist(part);
    ring();
    const why = wrong(part, berth, left.length);
    if (why) {
      tell(why);
      await lower(part);
      help.tried();
      continue;
    }
    berth.filled = true;
    berth.fit.classList.add('in');
    part.remove();
    left = left.filter(p => p !== part);
    hook = null;
    line();
    hammer();
    pluck(STRINGS[6 - left.length], 0.4);
    count(berth.el);
    tell(PRAISE[part.kind][part.kind === 'deck' ? berth.k : 0] + (left.length ? ' Click another part.' : ''));
    help.again();
  }
  help.stop();
}

// The side of the ark, close up: four planks, six pegs standing proud of them, and the gaps between the planks.
const SEAMS = [160, 280, 400].flatMap(y => Array.from({ length: 10 }, (_, i) => [80 + i * 100, y])), PEGS = [150, 300, 450, 600, 750, 900];
const wall = overlay(`<p class="cue"></p>
<svg class="hullside" viewBox="0 0 1060 560">
  ${[0, 1, 2, 3].map(k => cut(`<rect class="plank" x="30" y="${40 + k * 120}" width="1000" height="120" fill="${k % 2 ? '#cba06a' : '#d6ae78'}"/>`)).join('')}
  ${SEAMS.map(([x, y]) => `<rect class="seam" x="${x - 50}" y="${y - 6}" width="100" height="12"/>`).join('')}
  ${PEGS.map(x => `<g transform="translate(${x},220)"><g class="peg" data-n="0"><circle class="cast" cx="7" cy="9" r="20"/><circle r="20" fill="#ead7ac"/><circle r="9" fill="none" stroke="#c9a86a" stroke-width="3"/></g></g>`).join('')}
  <g class="mallet"><g>${cut('<path d="M12,22L128,188L150,172L34,6Z" fill="#b98a55"/><rect x="-36" y="-30" width="72" height="60" rx="8" fill="#8a6445"/>', 1)}</g></g>
  <g class="brush">${cut('<path d="M14,-6L150,-128L166,-110L30,12Z" fill="#b98a55"/><path d="M-26,8L16,-22L34,6L-8,36Z" fill="#2a221f"/>', 1)}</g>
</svg>`);
wall.classList.add('harp');
const svg = wall.querySelector('svg'), cue = text => (wall.querySelector('.cue').textContent = text);

// The mallet goes to and fro over the pegs, and a click brings it down where it is. Over a peg, the peg goes in
// (twice drives it home); anywhere else it only knocks on the plank, and takes a moment to come up again.
async function pegs() {
  const mallet = svg.querySelector('.mallet'), all = [...svg.querySelectorAll('.peg')];
  let x = 90, way = 1, then = performance.now(), ready = 0;
  cue('Drive the pegs home! Click to bring the mallet down, when it is over a peg.');
  wall.classList.add('on');
  svg.onpointerdown = () => {
    const now = performance.now(), peg = all.find((p, i) => Math.abs(PEGS[i] - x) < 46 && p.dataset.n < 2);
    if (now < ready) return;
    mallet.classList.remove('hit');
    mallet.getBoundingClientRect(); // so that it comes down afresh
    mallet.classList.add('hit');
    ready = now + (peg ? 180 : 500);
    if (peg) peg.dataset.n++;
    hammer();
  };
  await when(() => {
    const now = performance.now();
    x += (way * 300 * Math.min(50, now - then)) / 1000;
    then = now;
    if (x > 970 || x < 90) (way = -way), (x = clamp(x, 90, 970));
    mallet.setAttribute('transform', `translate(${x},196)`);
    return all.every(p => p.dataset.n > 1);
  });
  svg.onpointerdown = null;
  await sleep(700);
}
// Then the pitch: press, and the brush covers whatever gap it passes over.
async function pitch() {
  const seams = [...svg.querySelectorAll('.seam')], brush = svg.querySelector('.brush');
  let left = seams.length, swept = 0;
  svg.classList.add('tar');
  cue('Now the pitch, to keep the water out. Press, and brush it along every gap between the planks.');
  await new Promise(done => (svg.onpointermove = svg.onpointerdown = e => {
    const b = svg.getBoundingClientRect(), x = ((e.clientX - b.left) * 1060) / b.width, y = ((e.clientY - b.top) * 560) / b.height;
    brush.setAttribute('transform', `translate(${x},${y})`);
    if (!e.buttons) return;
    seams.forEach((s, i) => {
      if (s.classList.contains('done') || Math.abs(SEAMS[i][0] - x) > 72 || Math.abs(SEAMS[i][1] - y) > 46) return;
      s.classList.add('done');
      if (e.timeStamp - swept > 320) (swept = e.timeStamp), swish(); // one stroke of the brush, however many gaps it covers
      if (!--left) done();
    });
  }));
  svg.onpointermove = svg.onpointerdown = null;
  svg.classList.add('tarred');
  cue('Every gap is covered.');
  await sleep(2400);
  wall.classList.remove('on');
  await sleep(900);
}

// Jump past this scene, for starting further on: the ark built, planked and pitched.
export const skip = built;

export async function play() {
  music('yard');
  enter(1500, 800);
  rigging();
  await verse('The earth also was corrupt before God, and the earth was filled with violence.', 'Genesis 6:11');
  await verse(`But Noah found grace in the eyes of the ${LORD}.`, 'Genesis 6:8');
  await say('I am Noah. God has spoken to me, and this is what He said.');
  await verse('And God said to Noah, “The end of all flesh has come before Me, for the earth is filled with violence through them; and behold, I will destroy them with the earth. Make yourself an ark of gopherwood; make rooms in the ark, and cover it inside and outside with pitch.', 'Genesis 6:13–14');
  await say('A flood is coming, over the whole earth. But God has told me how my family will be kept safe through it: in an ark! A great boat, with room for us and for the animals.');
  await say('My sons and I have raised its frame. Will you help me build the rest?');
  await say('It must be made just as God said. This is His plan for it.');
  await verse(PLAN, 'Genesis 6:15–16');
  await say('A cubit is as long as my arm, from the elbow to the fingertips. Three hundred of them: that is a very great boat!');
  // The plan can be read again at any time.
  let reading = false;
  plan = html('<b class="card planbtn">The plan</b>');
  hud.prepend(plan);
  plan.onpointerdown = async e => {
    e.stopPropagation();
    if (reading) return;
    reading = true;
    await verse(PLAN, 'Genesis 6:15–16');
    reading = false;
  };
  await say('You can read the plan again whenever you like: click “The plan”, up in the corner.');
  await say('The parts lie ready, and there is a rope to haul them up with. Mind the deck timbers: they are cut to three lengths, one for each deck.');
  tell('Click a part, and I will make the rope fast to it.');
  await raise();

  await sleep(1200);
  await say('Every part is in its place! Now my sons and I will close in the sides with planks.');
  for (const el of [rig, winch]) (el.style.transition = 'opacity 1.5s'), (el.style.opacity = 0);
  ark.classList.add('planked');
  for (let k = 0; k < 8; k++) (await sleep(320), hammer());
  rig.remove();
  winch.remove();
  await sleep(900);
  await say('The planks must be pegged fast. And every gap between them must be covered with pitch, inside and out. Pitch is black and sticky, and it keeps the water out.');
  await pegs();
  await pitch();
  ark.classList.add('pitched');
  await sleep(2800);
  await say('It is done, every cubit of it, just as God said.');
  await verse('Thus Noah did; according to all that God commanded him, so he did.', 'Genesis 6:22');
  plan.remove();
}
