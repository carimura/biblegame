// Sound: a recorded harp, a few recorded effects, and quiet sustained chords and other effects that are synthesised.
let ctx, out, bus, sfx, pad, bed, mix, held, noise, ready, grand;

// The harp's seven strings, low to high (D major pentatonic).
export const STRINGS = [220, 293.66, 329.63, 369.99, 440, 493.88, 587.33];

// Whether sound is getting out yet: a browser holds it back on a page newly opened, until the page is clicked.
export const sounding = () => ctx?.state === 'running';
export function start() {
  if (ctx) return void ctx.resume(); // (made on the map, perhaps before any click: no sound comes out until one sets it going)
  ctx = new AudioContext();
  const limit = ctx.createDynamicsCompressor(); // lets the loud moments be loud without crackling
  limit.threshold.value = -10;
  limit.knee.value = 6;
  limit.ratio.value = 12;
  limit.attack.value = 0.003;
  limit.release.value = 0.15;
  out = ctx.createGain(); // everything goes out through here, so that a pause can silence it all
  limit.connect(out).connect(ctx.destination);
  bus = ctx.createGain();
  bus.connect(limit);
  sfx = ctx.createGain(); // steps, knocks, bleats: turned well up so they carry over the music
  sfx.gain.value = 2.6;
  sfx.connect(bus);

  // Reverb from a decaying noise burst.
  const n = ctx.sampleRate * 3.5, ir = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3;
  }
  const conv = ctx.createConvolver(), wet = ctx.createGain();
  conv.buffer = ir;
  wet.gain.value = 0.3;
  bus.connect(conv).connect(wet).connect(limit);

  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); // a second of hiss, the raw stuff of steps and knocks
  for (let i = 0, d = noise.getChannelData(0); i < d.length; i++) d[i] = Math.random() * 2 - 1;

  // The chords share one soft, slowly swelling voice.
  const lfo = ctx.createOscillator(), depth = ctx.createGain();
  bed = ctx.createGain();
  bed.gain.value = 0.014; // a quiet bed: measured, anything louder drowns the steps and bleats
  mix = ctx.createGain(); // how loud this place's music is, and where it is turned down while the song is being played
  bed.connect(mix).connect(bus);
  pad = ctx.createBiquadFilter();
  pad.type = 'lowpass';
  pad.frequency.value = 700;
  pad.connect(bed);
  lfo.frequency.value = 0.05;
  depth.gain.value = 0.005;
  lfo.connect(depth).connect(bed.gain);
  lfo.start();
  held = chord('D');
  for (const name of ['gate', 'step1', 'step2', 'step3', 'step4', 'step5', 'moo', 'roar', 'trumpet', 'maa', 'caw', 'coo', 'thunder', 'tie', 'hammer', 'swish', 'door', 'rush', 'plop']) load(name);
  ready = Promise.all(HARP.map(([, name]) => load(name)));
}

// Recorded sounds (public domain: effects from kenney.nl, the harp from VSCO 2, the ox, the goat and the thunder from
// BigSoundBank, with the mallet, the brush, the slam of the great door and the rushing water; the lion, the elephant, the raven,
// the dove and the rope from Wikimedia Commons). Nothing plays until a recording has arrived.
const clips = {};
const load = (name, again = true) => fetch(`sounds/${name}.wav`).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => clips[name] = buf).catch(() => again && load(name, false)); // one more try if it fails to arrive
function clip(name, gain) {
  if (!clips[name]) return;
  const src = ctx.createBufferSource(), g = ctx.createGain();
  src.buffer = clips[name];
  g.gain.value = gain;
  src.connect(g).connect(sfx);
  src.start();
}

// The harp: a recording of a concert harp (public domain, from Versilian Studios' VSCO 2 Community Edition). Seven of
// its notes are kept, each with the pitch it was measured to sound at, and any note is played from the nearest of
// them, a little faster or slower. (It used to be synthesised, and that sounded twangy.)
const HARP = [[245.01, 'harpB3'], [291.52, 'harpD4'], [348.99, 'harpF4'], [437.67, 'harpA4'], [519.95, 'harpC5'], [654.98, 'harpE5'], [781.46, 'harpG5']];
export function pluck(freq, gain = 0.5) {
  if (!ctx) return;
  const [f, name] = HARP.reduce((a, b) => (Math.abs(Math.log(b[0] / freq)) < Math.abs(Math.log(a[0] / freq)) ? b : a));
  if (!clips[name]) return;
  const src = ctx.createBufferSource(), g = ctx.createGain();
  src.buffer = clips[name];
  src.playbackRate.value = freq / f;
  g.gain.value = gain;
  src.connect(g).connect(bus);
  src.start();
}

export function blip(freq, dur = 0.25) {
  if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
  o.type = 'triangle';
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(sfx);
  o.start(t);
  o.stop(t + dur);
}

// A short burst of filtered hiss.
function puff(dur, freq, gain, type = 'lowpass', q = 1) {
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), t = ctx.currentTime;
  src.buffer = noise;
  src.loop = true;
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(sfx);
  src.start(t, Math.random() * 0.9);
  src.stop(t + dur);
}

// A footstep in the grass: one of five recordings, picked at random.
export const step = () => ctx && clip('step' + (1 + Math.random() * 5 | 0), 0.16);
// A sheep tearing at the grass.
export const munch = () => ctx && puff(0.08, 650 + Math.random() * 350, 0.4, 'bandpass', 2);
// Turning to the next thing David says.
export const tick = () => ctx && puff(0.06, 2600, 0.45, 'bandpass', 3);
// Wood knocking on stone.
export function knock() {
  if (!ctx) return;
  puff(0.07, 900, 0.34);
  blip(190, 0.18);
}
// A wooden gate: the latch lifts and the hinge turns (a recording, as long as the gate takes to swing).
export const creak = () => ctx && clip('gate', 0.3);
// An ox lowing, and a lion's roar (recordings of the animals themselves: voices made up for them sounded like nothing of the kind).
export const moo = () => ctx && clip('moo', 0.18);
export const roar = () => ctx && clip('roar', 0.2);
// An elephant trumpeting, a goat, a raven, a dove, and thunder (near, or with less `gain` far off): recordings too.
export const trumpet = () => ctx && clip('trumpet', 0.2);
export const maa = () => ctx && clip('maa', 0.16);
export const caw = () => ctx && clip('caw', 0.16);
export const coo = () => ctx && clip('coo', 0.18);
export const thunder = (gain = 0.3) => ctx && clip('thunder', gain);
// A rope made fast: a cord drawn through and pulled tight (a recording).
export const tie = () => ctx && clip('tie', 0.24);
// A wooden mallet coming down on wood (a gavel, slowed to less than half its pitch, to be as deep as a shipwright's);
// a brush drawn along a plank; and a great door of timber: a barn door, slowed a little, its low rumble as it swings
// (everything in it above 650 Hz is taken out: nothing in this door squeaks) and then, two and a half seconds on,
// the slam as it comes home. Recordings.
export const hammer = () => ctx && clip('hammer', 0.3);
export const swish = () => ctx && clip('swish', 0.2);
export const groan = () => ctx && clip('door', 0.34);
// Water rushing by, for so long (a recording of a mountain stream in spate).
export function rush(ms) {
  if (!ctx || !clips.rush) return;
  const src = ctx.createBufferSource(), g = ctx.createGain(), t = ctx.currentTime, end = t + ms / 1000;
  src.buffer = clips.rush;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.08);
  g.gain.setValueAtTime(0.3, end);
  g.gain.linearRampToValueAtTime(0, end + 0.5);
  src.connect(g).connect(sfx);
  src.start(t, Math.random() * 1.5);
  src.stop(end + 0.55);
}
// A fish leaping and falling back: a recording of a splash in a pond.
export const plop = () => ctx && clip('plop', 0.3);
// Something dropped in water.
export function splash() {
  if (!ctx) return;
  puff(0.3, 1400, 0.45, 'bandpass', 0.8);
  blip(240, 0.12);
}
// A tongue lapping, or a drop falling.
export const lap = () => ctx && puff(0.05, 1900 + Math.random() * 500, 0.3, 'bandpass', 4);
// A drop falling into still water, at a pitch: a short pure note that slides quickly up to it.
export function drip(freq) {
  if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
  o.frequency.setValueAtTime(freq * 0.5, t);
  o.frequency.exponentialRampToValueAtTime(freq, t + 0.06);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
  o.connect(g).connect(bus);
  o.start(t);
  o.stop(t + 0.28);
}
// Something growing: a small whoosh, a breath of hiss that rises and is gone.
export function sprout() {
  if (!ctx) return;
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), t = ctx.currentTime;
  src.buffer = noise;
  f.type = 'bandpass';
  f.Q.value = 1.5;
  f.frequency.setValueAtTime(600, t);
  f.frequency.exponentialRampToValueAtTime(2400, t + 0.4);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.15, t + 0.18);
  g.gain.linearRampToValueAtTime(0, t + 0.45);
  src.connect(f).connect(g).connect(sfx);
  src.start(t, Math.random() * 0.5);
  src.stop(t + 0.46);
}
// Leaves and thorns stirred.
export const rustle = () => ctx && puff(0.35, 2800, 0.3, 'highpass');
// A small bird: three quick notes, each sliding upward.
export function chirp() {
  if (!ctx) return;
  [0, 0.13, 0.3].forEach((delay, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + delay, f = 2700 + Math.random() * 400 + i * 260;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 1.35, t + 0.07);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g).connect(sfx);
    o.start(t);
    o.stop(t + 0.11);
  });
}
// An owl: two soft falling notes.
export function hoot() {
  if (!ctx) return;
  for (const [delay, from] of [[0, 350], [0.42, 330]]) {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + delay;
    o.frequency.setValueAtTime(from, t);
    o.frequency.linearRampToValueAtTime(300, t + 0.3);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.05);
    g.gain.linearRampToValueAtTime(0, t + 0.34);
    o.connect(g).connect(sfx);
    o.start(t);
    o.stop(t + 0.36);
  }
}
// Running water. Call what it gives back to make it stop.
export function flow(level = 0.1) {
  if (!ctx) return () => {};
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = noise;
  src.loop = true;
  f.type = 'bandpass';
  f.frequency.value = 1100;
  f.Q.value = 0.6;
  g.gain.value = level;
  src.connect(f).connect(g).connect(sfx);
  src.start();
  return () => {
    const t = ctx.currentTime;
    g.gain.setValueAtTime(level, t);
    g.gain.linearRampToValueAtTime(0, t + 1.5);
    src.stop(t + 1.6);
  };
}
// A fire crackling. Call what it gives back to make it stop.
export function crackle() {
  const t = setInterval(() => ctx && Math.random() < 0.55 && puff(0.04, 3000 + Math.random() * 1500, 0.09, 'highpass'), 130);
  return () => clearInterval(t);
}

// A recording for the very end of the chapter, if there is one: put it at sounds/finale.mp3 and it is played
// from `from` seconds in, in place of the harp. Gives back how long it will run, in milliseconds, or 0 if there is none.
export async function anthem(from = 0) {
  const buf = await fetch('sounds/finale.mp3').then(r => (r.ok ? r.arrayBuffer() : Promise.reject())).then(b => ctx.decodeAudioData(b)).catch(() => null);
  if (!buf) return 0;
  clearInterval(barTimer); // the scene's own music stops for it
  held(2);
  held = () => {};
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(out);
  src.start(0, from);
  return (buf.duration - from) * 1000;
}

// Light breaking: a bright chord that opens out from its lowest note and slowly fades.
export function shine() {
  if (!ctx) return;
  [293.66, 440, 587.33, 739.99, 880, 1174.66].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.09;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, t + 5);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + 5.1);
  });
}

// A run of harp notes, rising: setting out.
export function sweep() {
  ready.then(() => [1, 3, 4, 6].forEach((n, i) => setTimeout(() => pluck(STRINGS[n], 0.42), i * 95))); // once the harp has arrived
}
// A puzzle solved! The harp runs up through two octaves and comes down on a full chord, and bells ring out over it.
export function cheer() {
  if (!ctx) return;
  [293.66, 369.99, 440, 587.33, 739.99, 880, 1174.66].forEach((f, i) => setTimeout(pluck, i * 75, f, 0.4));
  setTimeout(() => [293.66, 440, 587.33, 739.99].forEach(f => pluck(f, 0.34)), 620);
  [1174.66, 1479.98, 1760, 2349.32].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + 0.62 + i * 0.11;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + 1.7);
  });
}

// A sheep's bleat. `f0` is the pitch of its voice: about 230 for a grown ewe, twice that for a lamb.
export function bleat(f0 = 230, loud = 1) {
  if (!ctx) return;
  const t = ctx.currentTime, dur = 1.1, small = f0 > 330 ? 1.25 : 1; // a lamb's mouth is smaller, so it rings higher
  const voice = ctx.createOscillator(), quaver = ctx.createOscillator(), rasp = ctx.createOscillator();
  const bend = ctx.createGain(), grit = ctx.createGain(), shake = ctx.createGain(), amp = ctx.createGain(), out = ctx.createGain();
  voice.type = 'sawtooth';
  voice.frequency.setValueAtTime(f0 * 0.9, t);
  voice.frequency.linearRampToValueAtTime(f0, t + 0.15);
  voice.frequency.linearRampToValueAtTime(f0 * 0.84, t + dur);
  quaver.frequency.value = 9; // the "a-a-a-a": the voice wavers in pitch and in loudness
  bend.gain.value = f0 * 0.045;
  shake.gain.value = 0.42;
  amp.gain.value = 0.58;
  quaver.connect(bend).connect(voice.frequency);
  quaver.connect(shake).connect(amp.gain);
  rasp.frequency.value = 31; // and a little roughness
  grit.gain.value = f0 * 0.02;
  rasp.connect(grit).connect(voice.frequency);
  voice.connect(amp);
  // Two resonances of the mouth turn the buzz into "aa". The lower one opens up as the mouth does: "b-aa".
  const mouth = [[760, 5, 1], [1250, 7, 0.55]].map(([f, q, level]) => {
    const res = ctx.createBiquadFilter(), g = ctx.createGain();
    res.type = 'bandpass';
    res.frequency.value = f * small;
    res.Q.value = q;
    g.gain.value = level;
    amp.connect(res).connect(g).connect(out);
    return res;
  });
  mouth[0].frequency.setValueAtTime(320, t);
  mouth[0].frequency.exponentialRampToValueAtTime(760 * small, t + 0.1);
  out.gain.setValueAtTime(0, t);
  out.gain.linearRampToValueAtTime(0.42 * loud, t + 0.06);
  out.gain.setValueAtTime(0.42 * loud, t + dur - 0.3);
  out.gain.linearRampToValueAtTime(0, t + dur);
  out.connect(sfx);
  for (const o of [voice, quaver, rasp]) {
    o.start(t);
    o.stop(t + dur);
  }
}

// A big animal's voice, made up: a low, dark note that rises a little and falls away. With `rough`, breath is mixed
// into it. (Creation's ox and lion have recordings now, `moo` and `roar`: this one did not sound like an animal.)
export function low(f0, dur = 1.2, rough) {
  if (!ctx) return;
  const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(), t = ctx.currentTime;
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(f0 * 0.8, t);
  o.frequency.linearRampToValueAtTime(f0, t + dur * 0.3);
  o.frequency.linearRampToValueAtTime(f0 * 0.72, t + dur);
  f.type = 'lowpass';
  f.frequency.value = f0 * 4;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.11, t + 0.12); // (measured: its peaks about as high as a sheep's bleat)
  g.gain.setValueAtTime(0.11, t + dur - 0.35);
  g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(f).connect(g).connect(sfx);
  o.start(t);
  o.stop(t + dur);
  if (rough) puff(dur, f0 * 3, 0.3);
}

const CHORD = {
  D: [73.42, 110, 146.83, 220, 293.66, 369.99],
  G: [98, 146.83, 196, 246.94, 293.66, 392],
  A: [110, 164.81, 220, 277.18, 329.63],
  Bm: [123.47, 185, 246.94, 293.66, 369.99],
  C: [65.41, 130.81, 196, 261.63, 329.63, 392],
  Em: [82.41, 123.47, 164.81, 246.94, 329.63, 392],
  Am: [110, 164.81, 220, 261.63, 329.63, 440],
  F: [87.31, 130.81, 174.61, 261.63, 349.23, 440],
  Dm: [73.42, 146.83, 220, 293.66, 349.23],
  B: [123.47, 185, 246.94, 311.13, 369.99],
};
// Fade a chord in over `rise` seconds. Returns a function that fades it out again over however many it is given.
// `oct` moves the whole chord up or down by octaves; `wave` is the voice it is played in; `throb` makes it tremble
// that many times a second, like bowed strings.
function chord(name, rise = 4, oct = 1, wave = 'triangle', throb) {
  const g = ctx.createGain(), t = ctx.currentTime, level = { sawtooth: 0.7, sine: 0.6 }[wave] ?? 1; // evened out by measuring: these two voices come out louder
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(level, t + rise);
  const out = throb ? ctx.createGain() : g, shake = throb && ctx.createOscillator();
  if (throb) {
    const depth = ctx.createGain();
    shake.frequency.value = throb;
    depth.gain.value = 0.4;
    shake.connect(depth).connect(out.gain);
    shake.start();
    g.connect(out);
  }
  out.connect(pad);
  const oscs = CHORD[name].flatMap(f =>
    [-4, 4].map(detune => {
      const o = ctx.createOscillator();
      o.type = wave;
      o.frequency.value = f * oct;
      o.detune.value = detune;
      o.connect(g);
      o.start();
      return o;
    })
  );
  return (fall = 5) => {
    const t = ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0, t + fall);
    oscs.concat(shake || []).forEach(o => o.stop(t + fall + 0.1));
  };
}
// A low, soft drum.
function thud() {
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(48, t + 0.25);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.1, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
  o.connect(g).connect(bus);
  o.start(t);
  o.stop(t + 0.75);
}

// How a line of the song comes home: under its last note (always the D string) the strings above it are rolled
// upward, more of them as the song grows. Nothing low is played: a bass note under the tune was tried twice, and
// both times it sounded wrong.
export function strum(full) {
  if (full > 1) [3, 4, 6].slice(0, full > 3 ? 3 : 2).forEach((n, i) => setTimeout(pluck, 90 + i * 90, STRINGS[n], full > 5 ? 0.26 : 0.16)); // loudest in the whole psalm at the end
}

// Each place has its own music, made to sound unlike its neighbours so that arriving somewhere is heard as well as
// seen: its own chords and pace, how bright or muffled it is (`tone`), how high it sits (`oct`), the voice it is
// played in (`wave`), and for some a lilt of harp notes over the top (`lilt`: which notes of the chord, in what
// order, -1 for a rest; `every`: how many to a bar). The valley is the tense one: louder (`level`), its strings
// trembling (`throb`), a slow drum under it (`pulse`: beats to a bar). `ring` is how loud the lilt is. Until the
// first call the music just sits on its opening chord. The map has a tune of its own on the harp in place of a
// lilt (`air`: which of the harp's seven strings, note by note, -1 for a rest). The building of the ark has a tune
// too, but not on those strings: it has a note they have not got (`riff`: semitones above the D string, -1 for a rest).
const SONGS = {
  map: { loop: ['D', 'G', 'A', 'D', 'Bm', 'G', 'A', 'D'], bar: 6000, tone: 1000, every: 8, ring: 0.15,
    air: [3, 4, 6, 4, 3, 4, 5, -1, 5, 6, 5, 4, 5, -1, 4, -1, 4, 2, 3, 2, 1, 2, -1, -1, 1, 3, 4, 3, 1, -1, -1, -1] }, // choosing a story: a small, easy tune, four bars long, which comes round twice over the chords
  still: { loop: ['D'], bar: 3.6e6, tone: 700 }, // a story about to begin: the one chord, as it is before any music
  fold: { loop: ['G', 'D', 'A', 'Bm', 'G', 'A', 'D', 'D'], bar: 7000, tone: 700 },
  pastures: { loop: ['G', 'C', 'G', 'D', 'Em', 'C', 'D', 'G'], bar: 6000, tone: 1400, lilt: [0, 2, 1, 3], every: 8 }, // bright, a rising lilt
  waters: { loop: ['D', 'G', 'D', 'A', 'Bm', 'G', 'A', 'D'], bar: 6000, tone: 1000, oct: 2, wave: 'sine', lilt: [0, 1, 2, 3, 2, 1], every: 12 }, // high and clear, rippling
  lost: { loop: ['Em', 'C', 'G', 'D', 'Em', 'C', 'D', 'Em'], bar: 7000, tone: 420, lilt: [3, -1, -1, 1, -1, -1], every: 6 }, // low and searching: a few lone notes
  night: { loop: ['G', 'Em', 'C', 'D'], bar: 9000, tone: 520, wave: 'sine', lilt: [3, -1, -1, -1], every: 2 }, // slow and still, a high note now and then
  valley: { loop: ['Em', 'F', 'Em', 'Dm', 'Em', 'C', 'B', 'Em'], bar: 6000, tone: 620, wave: 'sawtooth', level: 1.8, throb: 5.5, pulse: 3, lilt: [3, -1, -1, 1, -1, 2, -1, -1], every: 4 }, // dark and uneasy: trembling low strings that keep slipping a half-step, a slow drum, a lone high note now and then
  table: { loop: ['G', 'D', 'Em', 'C', 'G', 'C', 'D', 'G'], bar: 5000, tone: 1500, lilt: [0, 3, 1, 3, 2, 3], every: 6 }, // sunny and quick, rocking
  home: { loop: ['D', 'A', 'Bm', 'G', 'D', 'G', 'A', 'D'], bar: 7500, tone: 1100, wave: 'sawtooth', lilt: [0, 1, 2, 3, 2, 1, 0, -1], every: 8 }, // warm strings, the fullest
  // Creation: its music is made as the world is.
  void: { loop: ['Dm'], bar: 12000, tone: 300, oct: 0.5, level: 3 }, // before light: one low chord that never moves
  light: { loop: ['D', 'A', 'Bm', 'G', 'D', 'G', 'A', 'D'], bar: 6500, tone: 1700, oct: 2, wave: 'sine', lilt: [0, 2, 3, 2, 1, 3], every: 6 }, // the first day: high and bright
  sky: { loop: ['G', 'D', 'Em', 'C', 'G', 'C', 'D', 'G'], bar: 7000, tone: 1300, oct: 2, lilt: [3, -1, 2, -1, 3, 1, -1, -1], every: 8 }, // the second: wide and airy
  land: { loop: ['G', 'C', 'D', 'G', 'Em', 'C', 'D', 'G'], bar: 6500, tone: 1200, lilt: [0, 1, 2, 1], every: 4 }, // the third: warm, with a steady step
  lights: { loop: ['D', 'Bm', 'G', 'A', 'D', 'G', 'A', 'D'], bar: 7000, tone: 1500, oct: 2, wave: 'sine', lilt: [3, 2, 3, 1, 3, 2, 0, -1], every: 8 }, // the fourth: clear, and twinkling
  life: { loop: ['G', 'Em', 'C', 'D', 'G', 'C', 'D', 'G'], bar: 5000, tone: 1500, lilt: [0, 3, 1, 3, 2, 3], every: 6 }, // the fifth: quick and darting
  beasts: { loop: ['D', 'G', 'A', 'D', 'Bm', 'G', 'A', 'D'], bar: 6000, tone: 1300, wave: 'sawtooth', lilt: [0, 2, 1, 3], every: 4 }, // the sixth: warm strings, striding
  // Noah's Ark
  // The building: a work song. Nothing before it sounds like this: it swings in threes, four beats to the bar with
  // the drum on every one, like mallets; its chords go down a whole step to C and back (the old way, where every
  // other place keeps to the plain major); and over them the harp has a tune of its own, eight bars long.
  yard: { loop: ['D', 'C', 'D', 'G', 'D', 'C', 'G', 'D'], bar: 5400, tone: 1200, every: 12, pulse: 4, ring: 0.2,
    riff: [0, -1, 4, 7, -1, 7, 9, 7, 4, 0, -1, -1, 10, -1, 5, 2, -1, 5, 10, -1, -1, 5, -1, -1, 0, -1, 4, 7, -1, 7, 12, -1, 9, 7, -1, -1, 9, -1, 5, 9, -1, 12, 9, -1, 7, 5, -1, -1,
      0, -1, 4, 7, -1, 7, 9, 7, 4, 0, -1, -1, 10, -1, 14, 12, -1, 10, 5, -1, -1, 2, -1, -1, 5, -1, 9, 12, -1, 9, 7, -1, 5, -1, -1, -1, 4, -1, 2, 0, -1, -1, -1, -1, -1, -1, -1, -1] },
  coming: { loop: ['Em', 'C', 'G', 'D', 'Em', 'C', 'D', 'Em'], bar: 5000, tone: 900, wave: 'sawtooth', pulse: 2, lilt: [0, 2, 1, 3], every: 4 }, // the animals come under a darkening sky: striding, over a slow drum
  flood: { loop: ['Dm', 'Am', 'Dm', 'C', 'Dm', 'F', 'Am', 'Dm'], bar: 7000, tone: 520, wave: 'sawtooth', level: 1.5, throb: 4, pulse: 2 }, // the rain and the rising waters: low, trembling, a slow drum
  adrift: { loop: ['Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'Am'], bar: 8000, tone: 800, oct: 2, wave: 'sine', lilt: [3, -1, -1, 1, -1, -1, 2, -1], every: 8 }, // the ark alone on the waters: wide and slow, a note now and then
  olive: { loop: ['G', 'D', 'Em', 'C', 'G', 'C', 'D', 'G'], bar: 6500, tone: 1400, oct: 2, lilt: [0, 2, 3, -1, 1, 3, 2, -1], every: 8 }, // the dove: light and hopeful
  bow: { loop: ['D', 'A', 'Bm', 'G', 'D', 'G', 'A', 'D'], bar: 5000, tone: 2200, wave: 'sawtooth', level: 2.6, pulse: 4, lilt: [0, 1, 2, 3, 2, 3, 1, 3], every: 8, ring: 0.18 }, // dry ground and the bow: the fullest and brightest of the chapter
  rest: { loop: ['D', 'A', 'Bm', 'G', 'D', 'G', 'A', 'D'], bar: 4400, tone: 2400, wave: 'sawtooth', level: 3, pulse: 4, lilt: [0, 1, 2, 3, 2, 3, 1, 3], every: 8, ring: 0.2 }, // the seventh: it is finished! The loudest and brightest of them all: full strings, a drum on every beat, the harp running
};
let song, wanted, barTimer, liltTimer, pulseTimer, quieted = false, loud = 1;
export function music(name) {
  if (!ctx || grand || song === name) return;
  // Asked for before sound is allowed out (on the map, before any click): it begins when it is, with whatever was asked for last.
  if (ctx.state !== 'running') return void ((wanted = name), (ctx.onstatechange = () => ctx.state === 'running' && music(wanted)));
  song = wanted = name;
  clearInterval(barTimer);
  clearInterval(liltTimer);
  clearInterval(pulseTimer);
  const { loop, bar, tone, oct = 1, wave, lilt, air, riff, every, level = 1, throb, pulse, ring = 0.11 } = SONGS[name];
  loud = level;
  quiet(quieted);
  let i = 0, k = 0, now, first = true;
  const next = () => {
    held(first ? 1.2 : 5); // coming into a place the old music clears quickly, so the new is heard arriving
    held = chord((now = loop[i++ % loop.length]), first ? 2 : 4, oct, wave, throb);
    first = false;
  };
  pad.frequency.setTargetAtTime(tone, ctx.currentTime, 0.4);
  next();
  barTimer = setInterval(next, bar);
  // The lilt picks out the upper notes of the chord, an octave up.
  if (lilt)
    liltTimer = setInterval(() => {
      const n = lilt[k++ % lilt.length];
      if (!quieted && n >= 0) pluck(CHORD[now][2 + (n % (CHORD[now].length - 2))] * 2, ring);
    }, bar / every);
  // The tune begins with the first chord, once the harp has arrived.
  const tune = riff ?? air, sing = () => (n => !quieted && n >= 0 && pluck(riff ? 293.66 * 2 ** (n / 12) : STRINGS[n], ring))(tune[k++ % tune.length]);
  if (tune) ready.then(() => song === name && (sing(), (liltTimer = setInterval(sing, bar / every))));
  if (pulse) pulseTimer = setInterval(() => quieted || thud(), bar / pulse);
}
// The ending: under the whole psalm the chords come up to three times as loud, and brighter. From then on the music
// stays as it is whatever scene is shown (the ending looks back at them all), and steps and bleats make no sound.
export function swell() {
  const t = ctx.currentTime;
  grand = true;
  mix.gain.setTargetAtTime(1, t, 1.5);
  bed.gain.setTargetAtTime(0.042, t, 1.5);
  pad.frequency.setTargetAtTime(1900, t, 1.5);
  sfx.gain.setTargetAtTime(0, t, 0.2);
}
// Silence while the game is paused. (Sound goes on being made underneath: only the way out is shut.)
export const mute = on => ctx && out.gain.setTargetAtTime(on ? 0 : 1, ctx.currentTime, 0.05);
// While the song is being taught, or played on something, the music drops well back so the notes are heard alone:
// the lilt and the drum stop, and the chords fall to a fifth of their loudness.
export function quiet(on) {
  quieted = on;
  if (ctx && !grand) mix.gain.setTargetAtTime(on ? loud * 0.2 : loud, ctx.currentTime, 0.4);
}
