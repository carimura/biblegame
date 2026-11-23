// Stage, scenes and their parallax layers, the hero the player walks and the flock that follows, speech and notes.
import { step as footfall, tick as page } from './audio.js';

const NS = 'http://www.w3.org/2000/svg';

export const stage = document.getElementById('stage');
// The game keeps its own clock, which stops while the game is paused (the Esc key): whatever waits or moves by it
// stops too, and goes on from where it was.
let paused, since, lost = 0, resume; // while paused: a promise that it is over, and when it began; `lost` is all the time spent paused
const clock = () => (paused ? since : performance.now()) - lost;
export function pause(on) {
  if (on === !!paused) return;
  if (on) [since, paused] = [performance.now(), new Promise(r => (resume = r))];
  else {
    lost += performance.now() - since;
    paused = null;
    resume();
  }
  stage.classList.toggle('paused', on);
}
export const sleep = async ms => {
  const end = clock() + ms;
  do {
    await new Promise(r => setTimeout(r, end - clock()));
    await paused; // if the game is paused the wait stops here, and afterwards runs for whatever was left of it
  } while (end - clock() > 4);
};
export const click = el => new Promise(r => el.addEventListener('pointerdown', r, { once: true }));
// Like click, but the click stops there: it does not also send the hero walking.
export const tap = el => new Promise(r => el.addEventListener('pointerdown', e => (e.stopPropagation(), r()), { once: true }));
export const when = test => new Promise(r => (function check() { test() ? r() : requestAnimationFrame(check); })());
export const smooth = t => t * t * (3 - 2 * t);
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function html(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup;
  return t.content.firstElementChild;
}

const ARROW = '<svg viewBox="0 0 60 60" width="58"><path d="M8,30H46M30,13L48,30L30,47" fill="none" stroke="#b65a3c" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const world = html('<div id="world"></div>');
// Everything that is not scenery sits in the hud, laid out at 1600x900 and scaled as one piece.
export const hud = html(`<div id="hud"><div class="bubble card"></div><div class="note card"></div><div class="way left card">${ARROW}</div><div class="way right card">${ARROW}</div><div id="fade"></div></div>`);
stage.append(world, hud);
const bubble = hud.querySelector('.bubble'), note = hud.querySelector('.note'), veil = hud.querySelector('#fade');
const way = { left: hud.querySelector('.way.left'), right: hud.querySelector('.way.right') };

// ---- Scenes and layers ----
// Each scene is drawn for a view of 1600x900. Its layers are resized to the window (not zoomed), so nothing inside
// them shifts. A window wider than that shows more of the scene to either side (`VW`, up to 2000), and a taller one
// more sky above (`VH`, up to 1040), so an ordinary screen is filled to its edges instead of barred with black.
let active, building, fading, scale = 1, VW = 1600, VH = 900;
function pan() {
  for (const [el, f] of active.layers) el.style.transform = `translate3d(${-active.cam * f * scale}px,0,0)`;
}
function fit() {
  scale = Math.min(innerWidth / 1600, innerHeight / 900);
  VW = Math.min(innerWidth / scale, 2000);
  VH = Math.min(innerHeight / scale, 1040);
  stage.style.width = VW * scale + 'px';
  stage.style.height = VH * scale + 'px';
  stage.style.setProperty('--s', scale);
  hud.style.width = VW + 'px';
  hud.style.height = VH + 'px';
  if (!active) return;
  for (const [el, f, wide] of active.layers) {
    const w = wide ?? VW + (active.W * active.zoom - VW) * f; // as wide as it must be to pan at its speed across the scene
    el.setAttribute('viewBox', `0 0 ${w} 900`);
    el.style.width = w * scale + 'px';
    el.style.height = 900 * scale + 'px';
    el.style.top = (VH - 900) * scale + 'px'; // any extra height goes above, as sky
  }
  active.cam = clamp(active.cam, 0, camMax());
  pan();
}
addEventListener('resize', fit);
fit();

// Start a scene. Layers and washes made after this belong to it. `W` is how wide its ground is, in ground units:
// the ground and everything standing on it is drawn at `zoom`, shifted down the screen by `lift`.
export function scene(W, zoom = 1, lift = 0) {
  building = { el: html('<div class="scene" hidden></div>'), W, zoom, lift, layers: [], cam: 0, exits: {}, arrows: {} };
  world.append(building.el);
  return building;
}

export function show(sc) {
  if (active) {
    active.leave?.(); // a scene may have something to stop as it goes: running water, a fire
    if (active !== fading) active.el.hidden = true;
  }
  active = sc;
  sc.el.hidden = false;
  fit();
}

// Is this the scene on show? A scene's story checks before acting on where the hero stands, since he may have walked back to another.
export const on = sc => sc === active;

// A layer is an SVG as wide as it needs to be to pan at speed `f` across the scene (`fit` sizes it), or exactly
// `wide` if given. `dy` moves its drawing up or down.
export function layer(f, inner, cls = '', dy = 0, wide) {
  const el = document.createElementNS(NS, 'svg');
  el.setAttribute('class', 'layer ' + cls);
  el.innerHTML = dy ? `<g transform="translate(0,${dy})">${inner}</g>` : inner;
  building.el.append(el);
  building.layers.push([el, f, wide]);
  return el;
}

// A layer of the ground itself, where actors stand. Returns the group to draw in; positions in it are ground units.
export const plane = (inner = '', cls = '') =>
  layer(1, `<g class="${cls}" transform="translate(0,${building.lift}) scale(${building.zoom})">${inner}</g>`).firstElementChild;

// A full-screen wash (haze, vignette) sitting between layers.
export const fx = (style, cls = '') => building.el.append(html(`<div class="fx ${cls}" style="${style}"></div>`));

export function overlay(inner) {
  const el = html(`<div class="overlay">${inner}</div>`);
  hud.append(el);
  return el;
}

// For the ending the world is shown small, in a window beside the words (`#stage.inset` in index.html).
export const inset = () => stage.classList.add('inset');
// Change what the world shows (`change` shows another scene), the old picture fading away over the new one. The hero
// and the flock go to the new scene at once, so stand-ins are left where they stood for as long as the fade takes.
export async function dissolve(change) {
  const old = (fading = active), twins = [...old.el.querySelectorAll('.david,.sheep')].filter(a => !a.parentNode.closest('.david')).map(a => a.parentNode.insertBefore(a.cloneNode(true), a));
  for (const t of twins) t.classList.remove('walk');
  change();
  fading = null;
  const look = old.el.style; // (set one by one: the scene keeps other things here, such as where its lamp is)
  look.zIndex = 1;
  look.transition = 'opacity 1.3s ease-in-out';
  old.el.getBoundingClientRect();
  look.opacity = 0;
  await sleep(1300);
  if (active !== old) old.el.hidden = true;
  look.zIndex = look.transition = look.opacity = '';
  for (const t of twins) t.remove();
}

export async function fade(dark) {
  veil.classList.toggle('on', dark);
  await sleep(800);
}

// ---- Actors ----
export function actor(parent, cls, inner, x, y) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', cls);
  g.innerHTML = inner;
  // Everyone steps to their own rhythm, so a group never moves as one.
  g.style.setProperty('--tempo', (0.36 + Math.random() * 0.16).toFixed(2) + 's');
  g.style.setProperty('--phase', (-Math.random()).toFixed(2) + 's');
  parent.append(g);
  place(g, x, y);
  return g;
}

export function place(g, x, y) {
  if (g.pos && Math.abs(x - g.pos[0]) > 0.5) g.style.setProperty('--dir', x < g.pos[0] ? -1 : 1); // face the way you go
  g.pos = [x, y];
  g.setAttribute('transform', `translate(${x},${y})`);
}

// Run `step(0..1)` every frame for `ms`.
export function tween(ms, step, ease = t => t) {
  return new Promise(done => {
    const t0 = clock();
    (function frame() {
      const t = ms ? Math.min(1, (clock() - t0) / ms) : 1;
      step(ease(t));
      t < 1 ? requestAnimationFrame(frame) : done();
    })();
  });
}

export function glide(g, x, y, ms, ease) {
  const [x0, y0] = g.pos;
  return tween(ms, k => place(g, x0 + (x - x0) * k, y0 + (y - y0) * k), ease);
}

export async function walk(g, x, y, speed = 150) {
  g.classList.add('walk');
  await glide(g, x, y, (Math.hypot(x - g.pos[0], y - g.pos[1]) / speed) * 1000);
  g.classList.remove('walk');
}

// ---- The hero ----
// A click on the ground walks the hero there. The scene's `finder(x, y)` turns the click into waypoints
// [x, y, thenDo]; that is where a scene keeps him out of walls. The camera follows him.
const SPEED = 200;
let hero, finder, route = [], roaming = false, talking = false, waiting, paced = 0;

export function control(g, find) {
  hero = g;
  finder = find;
  route = [];
}
export const roam = on => (roaming = on);
export const free = () => roaming && !talking;
export const still = () => !route.length;
export function go(points) {
  route = points;
  hero.classList.toggle('walk', route.length > 0);
  if (route.length) hush(); // setting off puts away whatever he was saying
}
// Where on the ground a click landed.
export function spot(e) {
  const box = stage.getBoundingClientRect();
  return [((e.clientX - box.left) / scale + active.cam) / active.zoom, ((e.clientY - box.top) / scale - (VH - 900) - active.lift) / active.zoom];
}
// How far the camera may pan.
const camMax = () => active.hold ?? active.W * active.zoom - VW;
// Stand the hero somewhere at once, with the camera on him.
export function arrive(x, y) {
  place(hero, x, y);
  go([]);
  active.cam = clamp(x * active.zoom - VW / 2, 0, camMax());
}

// A way off the edge of the scene: walking the hero to within `EDGE` of that side calls `fn`. `arrow` says whether
// to point it out. (He arrives in a scene well clear of that, `IN` from its edge.)
const EDGE = 160;
export const IN = 330;
export function exit(sc, side, fn, arrow = true) {
  sc.exits[side] = fn;
  sc.arrows[side] = arrow;
}
// Things ringed for the player to find (see `hint`). An arrow also shows on a side of the screen that has one out of
// sight beyond it, and a click on that arrow walks the hero to it.
const hints = new Set();
const beyond = side => [...hints].find(h => active.el.contains(h) && (side === 'left' ? h.at * active.zoom < active.cam + 40 : h.at * active.zoom > active.cam + VW - 40));
for (const side in way)
  way[side].addEventListener('pointerdown', e => {
    e.stopPropagation();
    if (free()) go(finder(beyond(side)?.at ?? (side === 'right' ? active.W : 0), hero.pos[1]));
  });

stage.addEventListener('pointerdown', e => {
  if (talking) return waiting?.();
  if (e.target.closest('.bubble')) return hush(); // a click on something he said earlier puts it away
  if (roaming && !e.target.closest('#hud')) go(finder(...spot(e)));
});

// Something the hero does only when he is beside it: a click from further off just walks him over.
// Resolves once he has done it.
export const reach = (el, range = 175) =>
  new Promise(done => {
    el.classList.add('live');
    el.task = () => {
      const [x, y] = el.pos;
      if (Math.hypot(x - hero.pos[0], y - hero.pos[1]) > range) return go(finder(x + (hero.pos[0] < x ? -95 : 95), y + 14));
      el.task = null;
      el.classList.remove('live');
      done();
    };
    if (el.classList.contains('wonder') || el.reachable) return; // already listening for clicks
    el.reachable = true;
    el.addEventListener('pointerdown', e => {
      if (!el.task || !free()) return;
      e.stopPropagation();
      el.task();
    });
  });
export const apart = (a, b) => Math.hypot(a.pos[0] - b.pos[0], a.pos[1] - b.pos[1]);

// ---- The flock ----
// The flock follows in the hero's footsteps, each sheep in its own way: how far back it keeps (and to which side),
// how far he must get ahead before it bothers to move, and how fast it trots to catch up.
const HABIT = [
  [95, 14, 45, 1.25],
  [205, -10, 85, 1.1],
  [300, 18, 30, 1.3],
  [420, -6, 100, 1.15],
  [515, 10, 60, 1.2],
];
let flock = [], trail = [];

// `dir` lays a first trail behind the hero (-1: off to his left) and stands the flock on it.
export function lead(list, dir) {
  flock = list;
  trail = [];
  if (!dir) return;
  for (let d = 800; d >= 0; d -= 10) trail.push([hero.pos[0] + dir * d, hero.pos[1]]);
  flock.forEach((s, i) => {
    place(s, ...behind(i));
    s.style.setProperty('--dir', -dir);
  });
}
// Where follower `i` belongs along the trail. Nothing, if the trail is not that long yet.
function behind(i) {
  let [D, side] = HABIT[i], [px, py] = hero.pos;
  for (let k = trail.length - 1; k >= 0; k--) {
    const [x, y] = trail[k], d = Math.hypot(px - x, py - y);
    if (d >= D) return [px + ((x - px) * D) / d, py + ((y - py) * D) / d + side];
    D -= d;
    [px, py] = [x, y];
  }
}

let last = performance.now();
(function tick(now) {
  const dt = Math.min(50, now - last) / 1000;
  last = now;
  if (hero && active && !paused) {
    // Walk the route.
    for (let step = SPEED * dt; route.length && step > 0; ) {
      const [x, y, then] = route[0], dx = x - hero.pos[0], dy = y - hero.pos[1], d = Math.hypot(dx, dy);
      if (d > step) {
        place(hero, hero.pos[0] + (dx / d) * step, hero.pos[1] + (dy / d) * step);
        paced += step;
        break;
      }
      place(hero, x, y);
      paced += d;
      step -= d;
      route.shift();
      then?.();
      if (!route.length) hero.classList.remove('walk');
    }

    if (paced > 88) { // one footfall to each swing of his legs
      paced = 0;
      footfall();
    }

    // Leave footprints for the flock, and move each sheep toward its place.
    const here = hero.parentNode, mark = trail.at(-1);
    if (flock.length && here === flock[0].parentNode && (!mark || Math.hypot(hero.pos[0] - mark[0], hero.pos[1] - mark[1]) > 10)) {
      trail.push([...hero.pos]);
      if (trail.length > 140) trail.shift();
    }
    flock.forEach((s, i) => {
      const t = behind(i), d = t ? Math.hypot(t[0] - s.pos[0], t[1] - s.pos[1]) : 0;
      s.going = d > (s.going ? 4 : HABIT[i][2]);
      if (s.going) {
        const step = Math.min(d, SPEED * HABIT[i][3] * dt);
        place(s, s.pos[0] + ((t[0] - s.pos[0]) / d) * step, s.pos[1] + ((t[1] - s.pos[1]) / d) * step);
      }
      s.classList.toggle('walk', s.going);
    });

    // In a `deep` layer, whoever stands lower on the screen is drawn in front.
    if (here.classList.contains('deep')) {
      const now = [...here.children].filter(c => c.pos), sorted = [...now].sort((a, b) => a.pos[1] - b.pos[1]);
      if (sorted.some((c, i) => c !== now[i])) here.append(...sorted);
    }

    // The camera only moves when the hero nears the side of the screen, and never past where the scene holds it.
    const hx = hero.pos[0] * active.zoom, want = clamp(clamp(active.cam, hx - VW / 2 - 250, hx - VW / 2 + 250), 0, camMax());
    active.cam += (want - active.cam) * Math.min(1, dt * 3.5);
    pan();
    if (bubble.classList.contains('on')) aim();
    for (const side in way) way[side].classList.toggle('on', !!(active.arrows[side] || beyond(side)));

    const { left, right } = active.exits, off = right && hero.pos[0] >= active.W - EDGE ? right : left && hero.pos[0] <= EDGE ? left : null;
    // A scene may keep one spot lit (a fire, a lamp): tell its glow where that is on screen.
    if (active.light) {
      const [x, y] = active.light();
      active.el.style.setProperty('--lx', (x * active.zoom - active.cam) * scale + 'px');
      active.el.style.setProperty('--ly', (y * active.zoom + active.lift + VH - 900) * scale + 'px');
    }

    if (off && free() && !active.locked) {
      roaming = false;
      go([]);
      off();
    }
  }
  requestAnimationFrame(tick);
})(last);

// ---- Speech ----
// The bubble follows whoever is speaking. `tell` leaves it up; `say` waits for a click.
let who;
export const speaker = g => (who = g);
function aim() {
  bubble.style.left = clamp(who.pos[0] * active.zoom - active.cam, 300, VW - 300) + 'px';
  bubble.style.top = (who.pos[1] - 246) * active.zoom + active.lift + VH - 900 + 'px';
}
export function tell(text) {
  bubble.innerHTML = text;
  aim();
  bubble.classList.add('on');
}
export const hush = () => bubble.classList.remove('on');
export async function say(text) {
  talking = true;
  tell(text + '<i class="go">▸</i>');
  await sleep(450);
  await new Promise(done => (waiting = done));
  waiting = null;
  talking = false;
  page();
  hush();
  await sleep(350);
}

// A soft pulsing ring drawn in a layer of the ground, shown after `delay`. Returns a function that removes it.
export function hint(parent, x, y, delay = 0) {
  const ring = document.createElementNS(NS, 'circle');
  ring.setAttribute('class', 'beacon');
  ring.setAttribute('cx', x);
  ring.setAttribute('cy', y);
  ring.setAttribute('r', 46);
  ring.at = x;
  const t = setTimeout(() => (parent.append(ring), hints.add(ring)), delay);
  return () => {
    clearTimeout(t);
    ring.remove();
    hints.delete(ring);
  };
}

// Scenery that answers a click with a little movement (the CSS class `play`) and, if it has one, a note beside the pointer.
let noteTimer;
export function wonder(el, text, sound) {
  el.classList.add('wonder');
  el.addEventListener('pointerdown', e => {
    if (el.task && !free()) return; // mid-conversation: let the click turn the page
    e.stopPropagation(); // not a click for the hero
    if (el.task) return el.task(); // the scene has something else for this to do just now
    // Something he can act on wins the click, even from underneath a sheep that has wandered over it.
    const under = free() && document.elementsFromPoint(e.clientX, e.clientY).map(n => n.closest('.live')).find(n => n && n.task);
    if (under) return under.task();
    el.classList.remove('play');
    el.getBoundingClientRect(); // restart the movement
    el.classList.add('play');
    clearTimeout(el.playTimer);
    el.playTimer = setTimeout(() => el.classList.remove('play'), 2000);
    sound?.();
    if (!text) return; // a movement and a sound, but nothing to read

    const box = stage.getBoundingClientRect(), y = (e.clientY - box.top) / scale, below = y < 330;
    note.innerHTML = text;
    note.style.left = clamp((e.clientX - box.left) / scale, 270, VW - 270) + 'px';
    note.style.top = y + (below ? 46 : -120) + 'px'; // above, clear of whatever was clicked and its name tag
    note.classList.toggle('below', below);
    note.classList.add('on');
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => note.classList.remove('on'), 10000);
  });
}
stage.addEventListener('pointerdown', () => note.classList.remove('on'), true); // any click puts the note away
note.addEventListener('pointerdown', e => e.stopPropagation()); // and a click on the note itself does nothing more
