// The fourth day: sun, moon and stars. Genesis 1:14–19.
// The lights are set in the sky, and whatever is set there turns with the great wheel. The sun is set by day, in a
// ring that marks its place. The lesser light is to rule the night, but the night is on the far side of the wheel:
// there is nothing for it but to wind the wheel round, and the sun goes down as the dark comes up. There the moon's
// seven shapes are put in order, as its light grows to the full and goes again (click two, or carry one onto another, and they change places;
// the first is pinned in its place, to show where to begin), the moon is set in the night sky, and stars are hung
// with a click each. Then the wheel is wound on to morning, and the sun comes up again.
import { stage, html, sleep, when, apart, leap } from './engine.js';
import { cut } from './art.js';
import { music, knock, pluck, shine, STRINGS } from './audio.js';
import { rank, sheet, scrap, piece, slide, gone, carry, at, verse, tell, days, patience, solved, pairs } from './theatre.js';
import { ride, angle, turn } from './day1.js';

const SUN = `<circle r="120" fill="#ffe9a8" opacity=".25"/><circle r="90" fill="#ffe08a" opacity=".4"/>${cut(
  `<path d="M${Array.from({ length: 24 }, (_, i) => [Math.cos(i * 0.2618) * (i % 2 ? 62 : 82), Math.sin(i * 0.2618) * (i % 2 ? 62 : 82)].map(v => v.toFixed(1))).join('L')}Z" fill="#f7b93c"/><circle r="56" fill="#f8cf58"/>`)}`;
const MOON = `<circle r="72" fill="#f6efd8" opacity=".16"/>${cut('<circle r="44" fill="#f6efd8"/><circle cx="-14" cy="-10" r="9" fill="#e6dcbc"/><circle cx="16" cy="14" r="12" fill="#e6dcbc"/><circle cx="12" cy="-20" r="5" fill="#e6dcbc"/>', 1)}`;
const star = big => `<path transform="scale(${big.toFixed(2)})" d="M0,-10Q1.5,-1.5 10,0Q1.5,1.5 0,10Q-1.5,1.5 -10,0Q-1.5,-1.5 0,-10Z" fill="#fdf1cf"/>`;
const PLACE = { pos: [800, 380] }; // where a great light is set: the top of the sky
const NIGHT = [PLACE.pos, [300, 380, 1.5], [460, 470, 1], [620, 350, 1.8], [980, 500, 1.1], [900, 360, 1.3], [1180, 480, 1.6], [1240, 370, 1], [560, 540, 1.2], [200, 500, 1.4]]; // a night sky, for starting at a later day: where the moon is, then the stars

let lights, tray, sun, moon, help;
const stars = [];

export function build() {
  lights = rank.sky.appendChild(html('<div class="riding"></div>'));
  ride(lights);
}

// Set something in the sky at a place in the picture. It stays where it is put on the wheel, and goes round with
// it. (`round`: how far round the wheel is taken to be; as it is now, unless told.)
function set(art, x, y, size, round = angle()) {
  const a = (-round * Math.PI) / 180, dx = x - 800, dy = y - 830, el = scrap(art, size, lights);
  el.style.transform = `translate(${dx * Math.cos(a) - dy * Math.sin(a)}px,${dx * Math.sin(a) + dy * Math.cos(a)}px) rotate(${-round}deg)`;
  return el;
}
// A great light to be carried into the sky: a ring shows its place, and let go in or near the ring it is set there.
function offer(art, done) {
  tray = sheet(cut('<rect x="40" y="640" width="260" height="240" rx="26" fill="#efe3c8"/>') + `<circle class="socket" cx="${PLACE.pos[0]}" cy="${PLACE.pos[1]}" r="66"/>`, 'fresh', rank.works);
  const p = piece(art + '<circle class="key" r="92" fill="transparent"/>', 170, 760, 130);
  const fix = () => {
    p.remove();
    gone(tray);
    shine();
    done(set(art, ...PLACE.pos, 130));
  };
  carry(p, () => (apart(p, PLACE) > 150 ? (tell('Its place is the ring, high in the sky. Carry it there, and let it go.'), slide(p, 170, 760)) : fix()));
  leap(fix);
}

// The moon's shapes, to be put in order: its light grows from one side, a sliver, a half, nearly all, until the moon
// is full; then the dark comes in from that same side, until a sliver is left on the other. The first sliver is
// pinned where it belongs, so there is no doubt which end to begin from.
async function phases() {
  const LIT = [0.22, 0.5, 0.8, 1, -0.8, -0.5, -0.22], order = [0, 3, 6, 5, 1, 2, 4]; // how much of each is lit (less than none: on its other side), and how they lie to begin with
  const shape = f => `<g transform="scale(${Math.sign(f)},1)"><circle r="40" fill="#2c3574"/><path d="M0,-40A40,40 0 0 1 0,40A${Math.abs(1 - 2 * Math.abs(f)) * 40},40 0 0 ${Math.abs(f) < 0.5 ? 0 : 1} 0,-40Z" fill="#f6efd8"/></g><circle r="52" fill="transparent"/>`;
  const card = sheet(cut('<rect x="370" y="330" width="860" height="170" rx="26" fill="#efe3c8"/>') + order.map(() => '<g class="key"></g>').join('') + cut('<circle cx="440" cy="374" r="12" fill="#b65a3c"/>', 1), 'fresh', rank.works);
  const slots = [...card.querySelectorAll('.key')], right = () => order.filter((v, i) => v === i).length; // (how many lie in their own places)
  slots[0].classList.remove('key'); // the pinned one is not to be moved
  let picked = null;
  const draw = () => slots.forEach((g, i) => {
    g.setAttribute('transform', `translate(${440 + i * 120},${i === picked ? 401 : 415})`);
    g.innerHTML = shape(LIT[order[i]]);
  });
  draw();
  tell('Night by night the moon’s light grows until the moon is full, and then it goes again. The first night is pinned in its place. Put the others in order after it: click two, or carry one onto another, and they change places.');
  help = patience([
    () => tell('After the pinned one, each night has a little more light, on the same side, until the moon is full. Then the dark comes in from that same side, a little more each night.'),
    () => [order.findIndex((v, i) => v !== i), order.indexOf(order.findIndex((v, i) => v !== i))].forEach(i => slots[i].classList.add('next')), // the first place that has the wrong shape, and the shape that belongs there
  ]);
  await new Promise(done => (leap(() => (order.sort((a, b) => a - b), (picked = null), draw(), done())), pairs(card, slots, i => { // (the short cut: in order)
    for (const g of slots) g.classList.remove('next');
    if (picked === null || picked === i) picked = picked === null ? i : null; // take a shape up, or put it down again
    else {
      const was = right();
      [order[picked], order[i]] = [order[i], order[picked]];
      picked = null;
      knock();
      right() > was || help.tried();
    }
    draw();
    if (right() === 7) done();
  }, () => slots[picked])));
  card.onpointerdown = null;
  help.stop();
  solved();
  tell('');
  await sleep(1300);
  gone(card);
}

// Jump past this day, for starting at a later one: the sun set by day, the moon and stars by night.
export function skip() {
  set(SUN, ...PLACE.pos, 130);
  NIGHT.forEach(([x, y, big], i) => set(i ? star(big) : MOON, x, y, i ? 30 : 80, 180));
  days(4);
}

export async function play() {
  music('lights');
  await sleep(1200);
  await verse('Then God said, “Let there be lights in the firmament of the heavens to divide the day from the night; and let them be for signs and seasons, and for days and years; and let them be for lights in the firmament of the heavens to give light on the earth”; and it was so.', 'Genesis 1:14–15');
  offer(SUN, el => (sun = el));
  tell('Here is the greater light, to rule the day. Carry it up to the ring, and set it in the sky.');
  await when(() => sun);
  await sleep(1800);
  tell('Now the lesser light, to rule the night. But where is the night?');
  help = patience([() => tell('The night is on the far side of the great wheel. Press and hold the handle, and bring it round.')], 2);
  const lost = e => e.target.closest('.piece') || help.tried(); // a click anywhere but on the handle and its cogs
  stage.addEventListener('pointerdown', lost);
  await turn(180);
  stage.removeEventListener('pointerdown', lost);
  help.stop();
  tell('');
  await sleep(900);
  await phases();
  offer(MOON, el => (moon = el));
  tell('Now set the lesser light in the night sky: carry it up to the ring.');
  await when(() => moon);
  await sleep(1200);
  tell('He made the stars also. Click the dark sky to hang them: as many as you like.');
  const hang = e => {
    const [x, y] = at(e);
    if (e.target.closest('.piece') || y < 310 || y > 600) return;
    stars.push(set(star(0.9 + Math.random()), x, y, 30));
    pluck(STRINGS[(stars.length * 3) % 7] * 2, 0.3);
  };
  stage.addEventListener('pointerdown', hang);
  leap(() => NIGHT.slice(1, 8).forEach(([x, y, big]) => stars.push(set(star(big), x, y, 30)))); // (the short cut: seven stars hung)
  await when(() => stars.length > 6);
  await sleep(4000);
  stage.removeEventListener('pointerdown', hang);
  tell('');
  await verse('Then God made two great lights: the greater light to rule the day, and the lesser light to rule the night. He made the stars also.', 'Genesis 1:16');
  await verse('God set them in the firmament of the heavens to give light on the earth, and to rule over the day and over the night, and to divide the light from the darkness. And God saw that it was good.', 'Genesis 1:17–18');
  tell('Morning is coming. Press and hold the handle to wind the great wheel on.');
  await turn(180);
  tell('');
  await sleep(1500);
  await verse('So the evening and the morning were the fourth day.', 'Genesis 1:19');
  days(4, true);
}
