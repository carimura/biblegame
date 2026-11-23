// What the scenes share: the cast, and the notes on the things God made.
import { wonder, hud, html } from './engine.js';
import { pluck, blip, bleat, chirp, STRINGS } from './audio.js';

export const cast = { david: null, flock: [] }; // filled in by scene 1, where the story starts

export const LORD = 'L<span class="sc">ord</span>'; // small capitals, as the NKJV prints it
export const chime = i => () => pluck(STRINGS[i], 0.45);

// A sheep bleats in its own voice (a lamb's is higher), and "Baaaa!" shows above it for a moment.
export function baa(s, silently) {
  bleat((s.voice ??= (s.classList.contains('lamb') ? 430 : 210) + Math.random() * 45));
  if (silently) return;
  const tag = s.querySelector('.tag text');
  s.dataset.name ??= tag.textContent;
  tag.textContent = 'Baaaa!';
  s.classList.add('named');
  clearTimeout(s.baaTimer);
  s.baaTimer = setTimeout(() => {
    s.classList.remove('named');
    tag.textContent = s.dataset.name;
  }, 1300);
}

// The whole song: each line of the psalm in small pieces of [string, beats]. A scene teaches one line; the last plays them all.
// The words are NKJV, checked against the published text.
const n = (...notes) => notes.map(x => (Array.isArray(x) ? x : [x, 1]));
export const SONG = [
  { ref: 'Psalm 23:1', pieces: [[`The ${LORD} is my`, n(0, 1, 2, 3)], ['shepherd; I', n(4, 3, 2)], ['shall not want.', n([3, 2], 2, [1, 3])]] },
  { ref: 'Psalm 23:2', pieces: [['He makes me', n(2, 3, 4)], ['to lie down', n(5, 4, [3, 2])], ['in green pastures;', n(2, 3, [2, 2], [1, 3])]] },
  { ref: 'Psalm 23:2', pieces: [['He leads me', n(4, 5, [6, 2])], ['beside the', n(5, 4, 3)], ['still waters.', n([4, 2], 2, [1, 3])]] },
  { ref: 'Psalm 23:3', pieces: [['He restores my soul;', n(1, 2, 3, 2, [1, 2])], ['He leads me', n(3, 4, 5)], ['in the paths', n(6, 5, [4, 2])], ['of righteousness', n(3, 4, 3, [2, 2])], ['For His name’s sake.', n(2, 3, 2, [1, 3])]] },
  { ref: 'Psalm 23:4', pieces: [['Yea, though I walk', n(0, 1, 2, [3, 2])], ['through the valley', n(4, 4, 3, [2, 2])], ['of the shadow of death,', n(1, 1, 2, 2, 1, [0, 2])], ['I will fear no evil;', n(3, 4, 5, 5, 4, [3, 2])], ['For You are with me;', n(4, 5, 6, 5, [4, 2])], ['Your rod and Your staff,', n(3, 3, 4, 3, [2, 2])], ['they comfort me.', n(2, 3, 2, [1, 3])]] },
  { ref: 'Psalm 23:5', pieces: [['You prepare a table', n(1, 2, 3, 3, 4, [3, 2])], ['before me', n(2, 3, [4, 2])], ['in the presence', n(5, 5, 4, [3, 2])], ['of my enemies;', n(2, 2, 3, 2, [1, 2])], ['You anoint my head', n(3, 4, 5, 6, [5, 2])], ['with oil;', n(4, [3, 2])], ['My cup runs over.', n(2, 3, 2, 1, [1, 3])]] },
  { ref: 'Psalm 23:6', pieces: [['Surely goodness', n(0, 1, 2, 3)], ['and mercy', n(3, 4, [3, 2])], ['shall follow me', n(2, 3, 4, [5, 2])], ['All the days of my life;', n(6, 5, 4, 3, 2, [3, 2])], ['And I will dwell', n(1, 2, 3, [4, 2])], [`in the house of the ${LORD}`, n(5, 5, 4, 3, 2, [1, 2])], ['Forever.', n(3, 2, [1, 4])]] },
];
// Line `i` of the song, as the harp wants it.
export const line = i => SONG[i].pieces.map(([words, notes]) => ({ words, notes }));

// A card naming the place, for a few seconds.
let sign;
export async function post(name, small = '') {
  if (!sign) hud.append((sign = html('<div class="place card"></div>')));
  sign.innerHTML = name + (small && `<small>${small}</small>`);
  sign.classList.add('on');
  await new Promise(done => setTimeout(done, 6000));
  sign.classList.remove('on');
}

// Notes on the things God made. Scripture is NKJV, checked against the published text.
export const note = (lead, verse, ref) => `<b>${lead}</b><q>${verse}</q><cite>${ref}</cite>`;
export const NOTES = {
  moon: note('God made the moon to light the night.', 'Then God made two great lights: the greater light to rule the day, and the lesser light to rule the night. He made the stars also.', 'Genesis 1:16'),
  stars: note('God made every star, and He knows each one.', 'He counts the number of the stars;<br>He calls them all by name.', 'Psalm 147:4'),
  sun: note('God made the sun to light the day.', `From the rising of the sun to its going down<br>The ${LORD}’s name is to be praised.`, 'Psalm 113:3'),
  tree: note('God made the trees. This one is an olive tree.', 'But I am like a green olive tree in the house of God;<br>I trust in the mercy of God forever and ever.', 'Psalm 52:8'),
  flower: note('God made the flowers. Jesus said:', 'Consider the lilies of the field, how they grow: they neither toil nor spin; and yet I say to you that even Solomon in all his glory was not arrayed like one of these.', 'Matthew 6:28–29'),
  bird: note('God made the birds, and He feeds them. Jesus said:', 'Look at the birds of the air, for they neither sow nor reap nor gather into barns; yet your heavenly Father feeds them.', 'Matthew 6:26'),
  deer: note('God gives every creature water to drink.', 'As the deer pants for the water brooks,<br>So pants my soul for You, O God.', 'Psalm 42:1'),
  spring: note('God sends the water that fills the streams.', 'He sends the springs into the valleys;<br>They flow among the hills.<br>They give drink to every beast of the field;<br>The wild donkeys quench their thirst.', 'Psalm 104:10–11'),
  owl: note('God made the night, and the creatures that wake in it.', 'You make darkness, and it is night,<br>In which all the beasts of the forest creep about.', 'Psalm 104:20'),
  badger: note('God made the rock badgers, small as they are, and gave them a safe home.', 'The rock badgers are a feeble folk,<br>Yet they make their homes in the crags;', 'Proverbs 30:26'),
  fear: note('When something frightens us, we can trust God.', 'Whenever I am afraid,<br>I will trust in You.', 'Psalm 56:3'),
  light: note('God made the light, and it was good.', 'This is the message which we have heard from Him and declare to you, that God is light and in Him is no darkness at all.', '1 John 1:5'),
  dark: note('God called the darkness Night. Nothing is hidden from Him in it.', 'Indeed, the darkness shall not hide from You,<br>But the night shines as the day;<br>The darkness and the light are both alike to You.', 'Psalm 139:12'),
  heaven: note('God made the sky, and it tells how great He is.', 'The heavens declare the glory of God;<br>And the firmament shows His handiwork.', 'Psalm 19:1'),
  above: note('God set waters above the sky, and they praise Him too.', 'Praise Him, you heavens of heavens,<br>And you waters above the heavens!', 'Psalm 148:4'),
};

// Counting out loud. Gives back a function: hand it each thing as it is collected or counted, and that thing's
// number shows above it for a moment.
export function counter() {
  let k = 0;
  return from => {
    const box = hud.getBoundingClientRect(), s = box.width / hud.offsetWidth, r = (from.querySelector('.bob') ?? from).getBoundingClientRect();
    const n = html(`<b class="count card" style="left:${(r.left + r.width / 2 - box.left) / s}px;top:${(r.top - box.top) / s}px">${++k}</b>`);
    hud.append(n);
    blip(660 + k * 40, 0.18);
    setTimeout(() => n.remove(), 2000);
  };
}

// Make a scene's moon, stars, sun, trees and birds answer a click, and its poppies too unless they would get in the way of walking.
export function wonders(root, poppies = true) {
  for (const [what, text, string] of [['.moon', NOTES.moon, 6], ['.stars', NOTES.stars, 5], ['.sun', NOTES.sun, 4], ['.tree', NOTES.tree, 1], ...(poppies ? [['.poppy', NOTES.flower, 3]] : [])])
    for (const el of root.querySelectorAll(what)) wonder(el, text, chime(string));
  for (const el of root.querySelectorAll('.flier')) wonder(el, NOTES.bird, chirp); // the birds crossing the sky
}
