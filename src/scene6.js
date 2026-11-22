// Scene 6: the valley of the shadow. "Yea, though I walk through the valley of the shadow of death, I will fear no evil;
// For You are with me; Your rod and Your staff, they comfort me."
// It is dark, and three frightening shapes stand in the way. Walk up to each with the lamp and it turns out to be nothing to fear.
// One sheep takes fright and hides: work out which by the names the lamp shows. Then the stars play the next line.
import { actor, exit, sleep, say, tell, hush, reach, clamp, wonder, lead, walk, apart, hud, html } from './engine.js';
import { land, come } from './land.js';
import { hoot, rustle, blip } from './audio.js';
import { answer, hear } from './harp.js';
import { cast, SONG, NOTES, chime, baa, post } from './shared.js';

const W = 3000;
let sc, field, shades, begun = false, limit = 0;

const eyes = '<g class="eyes" fill="#ffe27a"><ellipse cx="-16" cy="-96" rx="9" ry="7"/><ellipse cx="16" cy="-96" rx="9" ry="7"/></g>';
// Each shape: where it is, what it looks like in the dark, what the lamp shows it to be, and what David says.
const SHAPES = [
  { at: [900, 800], said: 'Only an owl, out hunting mice! Good night, owl.', note: NOTES.owl, sound: hoot,
    dark: `<path d="M-52,0Q-70,-90 -30,-140Q0,-170 34,-140Q72,-88 52,0Z" fill="#17142a"/>${eyes}`,
    seen: '<path d="M-10,0V-60" stroke="#6b4a30" stroke-width="22" stroke-linecap="round"/><ellipse cx="0" cy="-104" rx="38" ry="48" fill="#9a7a56"/><ellipse cx="0" cy="-92" rx="26" ry="30" fill="#d9c3a0"/><circle cx="-13" cy="-118" r="12" fill="#f6efe0"/><circle cx="13" cy="-118" r="12" fill="#f6efe0"/><circle cx="-13" cy="-118" r="5" fill="#2b1f1a"/><circle cx="13" cy="-118" r="5" fill="#2b1f1a"/><path d="M-6,-106L0,-94L6,-106Z" fill="#e0a13c"/><path d="M-34,-142L-22,-128M34,-142L22,-128" stroke="#9a7a56" stroke-width="8" stroke-linecap="round"/>' },
  { at: [1680, 880], said: 'Rock badgers! A whole family, more frightened of us than we are of them.', note: NOTES.badger, sound: () => blip(1200, 0.12),
    dark: `<path d="M-110,0Q-120,-80 -50,-104Q0,-150 60,-108Q124,-84 112,0Z" fill="#17142a"/><g transform="translate(-34,24)">${eyes}</g><g transform="translate(40,10) scale(.8)">${eyes}</g>`,
    seen: '<path d="M-110,0Q-116,-58 -40,-64Q40,-74 112,0Z" fill="#8f8a84"/><g fill="#8a6a4c"><ellipse cx="-40" cy="-74" rx="34" ry="19"/><circle cx="-12" cy="-84" r="13"/><ellipse cx="44" cy="-56" rx="28" ry="16"/><circle cx="68" cy="-64" r="11"/></g><circle cx="-7" cy="-87" r="2.6" fill="#2b1f1a"/><circle cx="72" cy="-66" r="2.4" fill="#2b1f1a"/>' },
  { at: [2430, 790], said: 'A thorn bush, shaking in the wind. That is all it ever was.', note: NOTES.fear, sound: rustle,
    dark: `<path d="M-90,0Q-130,-70 -70,-120Q-20,-176 40,-130Q120,-96 92,0Z" fill="#17142a"/>${eyes}`,
    seen: '<ellipse cx="-44" cy="-44" rx="64" ry="42" fill="#4d6b3f"/><ellipse cx="42" cy="-50" rx="68" ry="48" fill="#567545"/><ellipse cx="0" cy="-88" rx="60" ry="40" fill="#62824e"/><path d="M-90,-56l-20,-12M-62,-96l-8,-22M-10,-126l-2,-24M44,-112l12,-22M92,-76l22,-10" stroke="#6b5a3a" stroke-width="5" stroke-linecap="round"/><circle cx="-12" cy="-96" r="6" fill="#ffe27a"/><circle cx="14" cy="-96" r="6" fill="#ffe27a"/>' },
];

// David will not lead the flock past a shape he has not yet looked at.
const find = (x, y) => [[clamp(x, 30, limit), clamp(y, 650, 1010)]];

export function build(next, back) {
  ({ sc, field } = land({
    W, seed: 61,
    sky: '#241f3d', bands: ['#2c2648', '#352e54', '#3f3760', '#4a416c'], stars: 9,
    far: ['#4a4563', '#3f3a58'], mid: '#3c4a48', near: '#35443c',
    ground: ['#6a8a5c', '#5f7f52', '#547449', '#496940'], flowers: 30,
    // Cliffs on either hand.
    props: ({ cut, r }) => cut(Array.from({ length: 9 }, (_, i) => { const x = i * 350 - 60 + r() * 60, h = 250 + r() * 130; return `<path d="M${x},626L${x + 30},${626 - h * 0.8}L${x + 110},${626 - h}L${x + 230},${626 - h * 0.86}L${x + 300},626Z" fill="${i % 2 ? '#4f4a5e' : '#5a5568'}"/>`; }).join('')),
    dark: 'linear-gradient(#a79fc4,#5d5888 40%,#33305a 60%)', // dim everywhere, darker on the ground
  }));
  shades = SHAPES.map(({ at, dark, seen }) => actor(field, 'shade', `<g class="dark">${dark}</g><g class="seen" filter="url(#paperS)">${seen}</g><ellipse cy="-70" rx="130" ry="100" fill="transparent"/>`, ...at));
  limit = SHAPES[0].at[0] - 150;
  sc.light = () => [cast.david.pos[0], cast.david.pos[1] - 110]; // his lamp goes with him
  sc.el.classList.add('lit');
  sc.next = next;
  exit(sc, 'left', back, false);
}

export function enter(side, look) {
  come(sc, field, find, side, 'valley');
  if (look) return; // only looked back at, from the ending: nothing begins
  if (!begun) story();
  begun = true;
}

async function story() {
  sc.locked = true; // no wandering off while he explains
  post('The valley of the shadow');
  await sleep(1800);
  await say('The way home goes through this valley. It is dark, and the sheep are afraid.');
  await say('But I have my lamp. And I am not alone here.');
  tell('Stay close. If something looks frightening, walk right up to it with the lamp.');
  sc.locked = false;

  for (const [i, shape] of SHAPES.entries()) {
    await reach(shades[i], 230);
    shades[i].classList.add('known');
    shape.sound();
    tell(shape.said);
    wonder(shades[i], shape.note, chime(1 + i));
    limit = i < 2 ? SHAPES[i + 1].at[0] - 150 : W - 40;
  }
  // At the last shadow one of the ewes took fright and slipped away into the dark.
  const flock = cast.flock, dv = cast.david, gone = flock.filter(s => !s.classList.contains('lamb'))[1], rest = flock.filter(s => s !== gone);
  const name = s => s.dataset.name ?? s.querySelector('.tag text').textContent;
  lead(rest);
  walk(gone, 2800, 1000, 260).then(() => gone.classList.add('resting'));
  await sleep(2600);

  await say('Three shadows, and nothing in them to harm us.');
  await say('Now let me count my flock. One, two, three, four… One is missing! She took fright and ran.');
  tell('Who is it? Walk close to each sheep and my lamp will show its name. Then tell me who is missing.');
  // The lamp shows the name of any sheep he is standing near. The names to choose from wait along the bottom.
  const lamp = setInterval(() => rest.forEach(s => s.classList.toggle('named', apart(s, dv) < 190)), 150);
  const names = html(`<div class="choices">${[...flock].sort((a, b) => name(a).localeCompare(name(b))).map(s => `<b class="card">${name(s)}</b>`).join('')}</div>`);
  hud.append(names);
  await new Promise(done => (names.onpointerdown = e => {
    const pick = e.target.closest('b')?.textContent;
    if (!pick) return;
    if (pick === name(gone)) return done();
    tell(`No, ${pick} is here with us. Look again.`);
  }));
  clearInterval(lamp);
  names.remove();
  rest.forEach(s => s.classList.remove('named'));
  tell(`Yes, ${name(gone)}! Call her. ${name(gone)}!`);
  await sleep(1400);
  gone.classList.remove('resting');
  baa(gone);
  await walk(gone, dv.pos[0] + 90, dv.pos[1] + 16, 230);
  baa(gone, true);
  lead(flock);
  await say('There she is. Even in the dark I know every one of my sheep by name.');
  await say('And I am not afraid here. The Lord is with me, as I am with my sheep.');

  // No harp here: the stars play the next part of the song, and the player taps them back.
  await say('Look up! The stars are out, even over this valley. They are playing the next part of my song. Tap them to play it back.');
  hush();
  const sky = sc.layers[0][0];
  sky.insertAdjacentHTML('beforeend', [0, 1, 2, 3, 4].map(i => `<g transform="translate(${420 + i * 190},${[120, 172, 196, 172, 120][i]})"><path class="tw" d="M0,-34Q5,-5 34,0Q5,5 0,34Q-5,5 -34,0Q-5,-5 0,-34Z" fill="#fdf1cf"/><circle r="52" fill="transparent"/></g>`).join(''));
  const stars = [...sky.children].slice(-5);
  await answer(stars.map((el, string) => ({ el, string })), SONG[4].pieces.slice(0, 2).map(p => p[1]));
  for (const el of stars) el.remove();
  await hear([SONG[4]], 4);
  await say('Look, light ahead! We are nearly through.');
  exit(sc, 'right', sc.next);
}
