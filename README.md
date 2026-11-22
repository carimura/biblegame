# The Shepherd's Song

A slow, scenic Bible game for children, made to look like cut paper. You help young David look after his father's
sheep through the lines of Psalm 23, one scene to a line, and learn the psalm as a song along the way.

No timers, no scores, nothing to lose. No ads, no accounts, and nothing is collected.

**Play it:** https://play.awakenusa.com (on a computer, with a mouse)

It is the first of eight stories on the game's map. The other seven are places kept for stories not yet made:
Creation, Noah's Ark, Moses and the Sea, David and Goliath, The Birth of Jesus, The Miracles of Jesus and
The Resurrection.

## Run it

Plain HTML, CSS and JavaScript modules. There is no build step and nothing to install.

```
python3 -m http.server --protocol HTTP/1.1
```

Then open http://localhost:8000. Adding a scene's number to the address (`#5`) starts at that scene.

## Where things are

- `index.html`: the page, the styles, and the filters that make shapes look like cut paper.
- `src/engine.js`: what every scene shares (walking, the camera, the flock that follows, speech, notes).
- `src/scene1.js` to `src/scene8.js`: the eight scenes. `src/land.js` builds the scenery for scenes 3 to 8.
- `src/harp.js`, `src/audio.js`: the song and every sound. `src/shared.js`: the melody and the note cards.
- `src/map.js`: the map of the stories.
- `sounds/`: the recorded sounds.

## Publish it

`wrangler deploy` publishes `index.html`, `src/` and `sounds/` to Cloudflare (see `wrangler.jsonc`).

## Credits

- Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All
  rights reserved.
- The harp is from VSCO 2 Community Edition by Versilian Studios (public domain, CC0).
- The footsteps and the gate are from Kenney, kenney.nl (public domain, CC0).
- The drawings, the code and the tune were made for this game.
