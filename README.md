# The Shepherd's Song

A slow, scenic Bible game for children, made to look like cut paper. You help young David look after his father's
sheep through the lines of Psalm 23, one scene to a line, and learn the psalm as a song along the way.

No timers, no scores, nothing to lose. No ads, no accounts, and nothing is collected.

**Play it:** https://shepherds-song.com, or https://play.awakenusa.com (on a computer, with a mouse)

It is the first of eight stories on the game's map. The second is Creation: the seven days of Genesis 1, told as one
paper picture that begins black and gains something every day, with puzzles that ask a little more. It can be played
once The Shepherd's Song has been finished (the map opens it then). The third is Noah's Ark, in eight scenes: the ark is
built, filled, shut, driven through the storm, carried on the flood and set down, the dove brings back her olive leaf,
and the bow is set in the cloud. The other five are places kept for stories not yet made: Moses and the Sea,
David and Goliath, The Birth of Jesus, The Miracles of Jesus and The Resurrection.

How the whole game plays, puzzle by puzzle and word for word, with nothing about how this version is drawn or
coded, is in [GAMEPLAY.md](GAMEPLAY.md): it is written so that the game can be rebuilt in another engine and another look.

## Run it

Plain HTML, CSS and JavaScript modules. There is no build step and nothing to install.

```
python3 -m http.server --protocol HTTP/1.1
```

Then open http://localhost:8000. Run this way, every story that is built is open on the map from the start (on the
published game a story opens when the one before it is finished). Adding a scene's number to the address (`#5`)
starts at that scene of The Shepherd's Song, `#day2` at that day of Creation, and `#ark2` at that scene of Noah's Ark. Run this way there is also a short cut for
whoever is working on it: Shift+. (the `>` key) puts whatever Creation is waiting for (a puzzle, the winding of a day,
a verse) as it would be when done, and goes on.

## Where things are

- `index.html`: the page, the styles, and the filters that make shapes look like cut paper.
- `src/engine.js`: what every scene shares (walking, the camera, the flock that follows, speech, notes).
- `src/scene1.js` to `src/scene8.js`: the eight scenes. `src/land.js` builds the scenery for scenes 3 to 8.
- `src/harp.js`, `src/audio.js`: the song and every sound. `src/shared.js`: the melody and the note cards.
- `src/theatre.js`, `src/day1.js` to `src/day7.js`: Creation. One paper picture that every day adds to, and its days.
- `src/ark.js`, `src/ark1.js` to `src/ark8.js`: Noah's Ark. What its scenes share (the place, the ark, the animals, the
  sea), and the eight scenes.
- `src/map.js`: the map of the stories.
- `sounds/`: the recorded sounds.

## Publish it

`wrangler deploy` publishes `index.html`, `src/` and `sounds/` to Cloudflare (see `wrangler.jsonc`).

## Credits

- Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All
  rights reserved.
- The harp is from VSCO 2 Community Edition by Versilian Studios (public domain, CC0).
- The footsteps and the gate are from Kenney, kenney.nl (public domain, CC0).
- The ox, the goat, the thunder, the mallet ("Gavel, 1 blow"), the brush ("Brush on wood"), the slam of the great
  door ("Creaking barn door"), the rushing water ("Mountain stream #3") and the fish's splash ("Splash, Small #1") are from BigSoundBank by Joseph Sardin, bigsoundbank.com (public domain, CC0). The
  lion is from a recording released into the public domain on Wikimedia Commons ("Lion raring-sound1TamilNadu178.ogg",
  by Info-farmer), and so are the elephant ("Elephant voice - trumpeting.ogg", CC0), the dove ("Dove cooing.ogg"),
  the raven ("Yellowstone sound library - Common Raven - 001.mp3", U.S. National Park Service) and the rope being tied
  ("Lace cord rope.ogg", by stephan, from pdsounds.org).
- The drawings, the code and the tune were made for this game.
