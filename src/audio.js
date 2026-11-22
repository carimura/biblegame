// Sound: a recorded harp, a few recorded effects, and quiet sustained chords and other effects that are synthesised.
let ctx, bus, sfx, pad, bed, held, noise, ready, grand;

// The harp's seven strings, low to high (D major pentatonic).
export const STRINGS = [220, 293.66, 329.63, 369.99, 440, 493.88, 587.33];

export function start() {
  if (ctx) return;
  ctx = new AudioContext();
  const limit = ctx.createDynamicsCompressor(); // lets the loud moments be loud without crackling
  limit.threshold.value = -10;
  limit.knee.value = 6;
  limit.ratio.value = 12;
  limit.attack.value = 0.003;
  limit.release.value = 0.15;
  limit.connect(ctx.destination);
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
  bed.connect(bus);
  pad = ctx.createBiquadFilter();
  pad.type = 'lowpass';
  pad.frequency.value = 700;
  pad.connect(bed);
  lfo.frequency.value = 0.05;
  depth.gain.value = 0.005;
  lfo.connect(depth).connect(bed.gain);
  lfo.start();
  held = chord('D');
  for (const name of ['gate', 'step1', 'step2', 'step3', 'step4', 'step5']) load(name);
  ready = Promise.all(HARP.map(([, name]) => load(name)));
}

// Recorded sounds (public domain: effects from kenney.nl, the harp from VSCO 2). Nothing plays until a recording has arrived.
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
// Something dropped in water.
export function splash() {
  if (!ctx) return;
  puff(0.3, 1400, 0.45, 'bandpass', 0.8);
  blip(240, 0.12);
}
// A tongue lapping, or a drop falling.
export const lap = () => ctx && puff(0.05, 1900 + Math.random() * 500, 0.3, 'bandpass', 4);
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
  src.connect(ctx.destination);
  src.start(0, from);
  return (buf.duration - from) * 1000;
}

// A run of harp notes, rising: setting out.
export function sweep() {
  ready.then(() => [1, 3, 4, 6].forEach((n, i) => setTimeout(() => pluck(STRINGS[n], 0.42), i * 95))); // once the harp has arrived
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

const CHORD = {
  D: [73.42, 110, 146.83, 220, 293.66, 369.99],
  G: [98, 146.83, 196, 246.94, 293.66, 392],
  A: [110, 164.81, 220, 277.18, 329.63],
  Bm: [123.47, 185, 246.94, 293.66, 369.99],
  C: [65.41, 130.81, 196, 261.63, 329.63, 392],
  Em: [82.41, 123.47, 164.81, 246.94, 329.63, 392],
  Am: [110, 164.81, 220, 261.63, 329.63, 440],
};
// Fade a chord in over `rise` seconds. Returns a function that fades it out again over however many it is given.
// `oct` moves the whole chord up or down by octaves; `wave` is the voice it is played in.
function chord(name, rise = 4, oct = 1, wave = 'triangle') {
  const g = ctx.createGain(), t = ctx.currentTime, level = { sawtooth: 0.7, sine: 0.6 }[wave] ?? 1; // evened out by measuring: these two voices come out louder
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(level, t + rise);
  g.connect(pad);
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
    oscs.forEach(o => o.stop(t + fall + 0.1));
  };
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
// order, -1 for a rest; `every`: how many to a bar). Until the first call the music just sits on its opening chord.
const SONGS = {
  fold: { loop: ['G', 'D', 'A', 'Bm', 'G', 'A', 'D', 'D'], bar: 7000, tone: 700 },
  pastures: { loop: ['G', 'C', 'G', 'D', 'Em', 'C', 'D', 'G'], bar: 6000, tone: 1400, lilt: [0, 2, 1, 3], every: 8 }, // bright, a rising lilt
  waters: { loop: ['D', 'G', 'D', 'A', 'Bm', 'G', 'A', 'D'], bar: 6000, tone: 1000, oct: 2, wave: 'sine', lilt: [0, 1, 2, 3, 2, 1], every: 12 }, // high and clear, rippling
  lost: { loop: ['Em', 'C', 'G', 'D', 'Em', 'C', 'D', 'Em'], bar: 7000, tone: 420, lilt: [3, -1, -1, 1, -1, -1], every: 6 }, // low and searching: a few lone notes
  night: { loop: ['G', 'Em', 'C', 'D'], bar: 9000, tone: 520, wave: 'sine', lilt: [3, -1, -1, -1], every: 2 }, // slow and still, a high note now and then
  valley: { loop: ['Em', 'Bm', 'C', 'Em', 'Am', 'Em', 'Bm', 'Em'], bar: 8000, tone: 420, wave: 'sawtooth' }, // dark, low strings, nothing over the top
  table: { loop: ['G', 'D', 'Em', 'C', 'G', 'C', 'D', 'G'], bar: 5000, tone: 1500, lilt: [0, 3, 1, 3, 2, 3], every: 6 }, // sunny and quick, rocking
  home: { loop: ['D', 'A', 'Bm', 'G', 'D', 'G', 'A', 'D'], bar: 7500, tone: 1100, wave: 'sawtooth', lilt: [0, 1, 2, 3, 2, 1, 0, -1], every: 8 }, // warm strings, the fullest
};
let song, barTimer, liltTimer, quieted = false;
export function music(name) {
  if (!ctx || grand || song === name) return;
  song = name;
  clearInterval(barTimer);
  clearInterval(liltTimer);
  const { loop, bar, tone, oct = 1, wave, lilt, every } = SONGS[name];
  let i = 0, k = 0, now, first = true;
  const next = () => {
    held(first ? 1.2 : 5); // coming into a place the old music clears quickly, so the new is heard arriving
    held = chord((now = loop[i++ % loop.length]), first ? 2 : 4, oct, wave);
    first = false;
  };
  pad.frequency.setTargetAtTime(tone, ctx.currentTime, 0.4);
  next();
  barTimer = setInterval(next, bar);
  // The lilt picks out the upper notes of the chord, an octave up.
  if (lilt)
    liltTimer = setInterval(() => {
      const n = lilt[k++ % lilt.length];
      if (!quieted && n >= 0) pluck(CHORD[now][2 + (n % (CHORD[now].length - 2))] * 2, 0.11);
    }, bar / every);
}
// The ending: under the whole psalm the chords come up to three times as loud, and brighter. From then on the music
// stays as it is whatever scene is shown (the ending looks back at them all), and steps and bleats make no sound.
export function swell() {
  const t = ctx.currentTime;
  grand = true;
  bed.gain.setTargetAtTime(0.042, t, 1.5);
  pad.frequency.setTargetAtTime(1900, t, 1.5);
  sfx.gain.setTargetAtTime(0, t, 0.2);
}
// The lilt steps aside while the harp is being taught.
export const quiet = on => (quieted = on);
