# The Shepherd's Song: gameplay

This is everything about how the game plays, written so that it can be rebuilt from scratch in another engine and
another look. It says what the player does, what each puzzle's rules and answers are, when help is given, and every
word that is shown. It says nothing about how the present version is drawn or coded, except where a number is
needed to rebuild a puzzle.

The present version is a web page in cut-paper style (`index.html`, `src/`). None of that has to be kept. What has
to be kept is in "What must not change" below.

Contents: the game in brief; what must not change; the frame every story shares; story 1, The Shepherd's Song;
story 2, Creation; story 3, Noah's Ark; sound and music; and three appendices (the psalm's tune, the note cards,
and every line shown to the player, scene by scene).

## The game in brief

A slow, scenic Bible game for children of about seven (the first story should also work for a child of four or
five, with help). It is played on a computer with a mouse: clicking, pressing and holding, and dragging. There is
no keyboard play (the Escape key pauses).

The game opens on a map: one road over hills with a round picture for each of eight stories. Three are built:

1. **The Shepherd's Song** (Psalm 23), eight scenes. The introduction: easy, guided. Young David leads his
   father's sheep to grass and water and home again, one scene to each line of the psalm, and teaches the player
   the psalm as a song.
2. **Creation** (Genesis 1:1 to 2:3), seven days. One picture that begins black and gains something every day.
   Harder: real puzzles.
3. **Noah's Ark** (Genesis 6 to 9), eight scenes. The most action, and the hardest puzzles so far.

The other five are places kept on the map, gray, with a name and a picture and nothing else: Moses and the Sea,
David and Goliath, The Birth of Jesus, The Miracles of Jesus, The Resurrection.

## What must not change

These are the rules the game was built to. They matter more than any one puzzle.

- **Nothing can be lost.** No timers, no scores, no lives, no fail states, nothing to start over from the
  beginning. A wrong try is answered and the player tries again. (The one place with a setback is Noah's storm,
  where the player loses ground, never the game.)
- **Slow and gentle.** Scene follows scene without hurry. No fast action, nothing frightening that is not at once
  shown to be safe. Nothing addictive: no rewards for coming back, no collecting, no shop.
- **Scripture is exact.** Every verse is the New King James Version, word for word, with its reference, and was
  checked against the published text. Where a verse is part of a longer speech it keeps the quotation mark it is
  printed with. "LORD" is set in small capitals, as the NKJV prints it. Do not paraphrase a verse, and do not put
  words in God's mouth that are not verses. The NKJV credit line (see the README) must be shown.
- **What is not in the text is not claimed.** The storyteller's own words are plain and few, and keep to what the
  text says. Examples: the ark is given no sail, rudder or oar, because Genesis names none; the animals in the ark
  are not afraid of one another; no rain falls before the day Genesis says it does; God is never drawn.
- **People are drawn plainly.** The game should not settle what people of the Bible looked like. Figures are
  simple, and where a face is not needed there is none.
- **Help comes from trying, not from waiting.** Nobody is hurried: a player who sits and thinks is left alone for
  as long as they like. Help is given after tries that get nowhere, in two steps: first a little more is said,
  then the next move is shown (a glow on the thing to click). A try that is simply not allowed is answered at
  once, in words that say why. (The Shepherd's Song, the oldest story, still shows a ring after a wait in a few
  places; that is noted where it happens, and may be changed to the same rule.)
- **Every puzzle shows its progress** as it is made, and none can be put into a state it cannot be finished from
  (where that could happen, a way back is given).
- **No reading aloud yet.** Everything said is text. There is a good deal of it, in short pieces, and each piece
  waits for a click.
- **Music is wordless**, calm and beautiful, with a different music for each place so that arriving somewhere is
  heard as well as seen.

## The frame every story shares

**The map.** Stories stand along one road in order. A story that can be played is in colour and a ring beckons
from it; the rest are gray and do not answer. Finishing a story gives it a gold rim, which is remembered on that
computer, and opens the next story if it is built: the next time the map comes up, that story turns from gray to
colour with a flash. The map has its own small tune. Clicking a story shows a title card ("Chapter 1 / The
Shepherd's Song / Psalm 23 / click to begin"), and the end of a story shows "Chapter 1 complete" and goes back to
the map.

**Pausing.** Escape brings up a pause screen, which offers "Keep playing" and "Back to the journey map".

**Verse cards.** Scripture fills the screen, large, with its reference under it, and stays until a click.

**The speaker.** In the two stories where someone is walked (David, Noah), he speaks in a bubble over his head,
one short piece at a time, each waiting for a click. An instruction stays up until it is done.

**The storyteller's card.** Where nobody is walked, a small card low on the screen says what is happening and what
to try. It has no face and no name.

**Walking** (The Shepherd's Song, and scenes 1 to 3 of Noah's Ark). The scene is a wide place, wider than the
screen, seen from the side. A click on the ground walks the hero there; the view follows him. A thing does
something only when he is beside it: a click on it from far off walks him over, and (in Noah's Ark) he does it as
he arrives. Followers (the flock; animals being led) walk after him in a line, each a little differently. In The
Shepherd's Song the next scene is reached by walking off the edge of this one, where an arrow shows; he can walk
back, but no arrow invites it.

**Things to wonder at** (The Shepherd's Song, and the seventh day of Creation). The moon, stars, sun, trees,
flowers, birds and so on can be clicked at any time for a small card: one plain sentence and a verse about the
thing God made. They are in appendix B. They are never needed to go on.

**Counting.** When things are gathered or counted, a number pops over each one in turn (1, 2, 3…).

**A puzzle solved** is hailed: a flourish on the harp, and gold stars thrown out over the picture.

## Story 1: The Shepherd's Song (Psalm 23)

David, a boy, is taking five sheep over the hills: Barley, Fig, Olive, Honey, and a lamb called Pip. He asks the
player to help look after them, and as they go he teaches the player a song he is making about the Lord. (The
Bible does not say when David wrote the psalm: setting it in his shepherd years is the game's frame, not a claim.)

Each scene is one line of the psalm, with one thing to do, and ends by teaching that line of the song.

**How a line is taught.** There is a small harp of seven strings. David plays a short phrase (three or four
notes); the strings light as they sound. Then it is the player's turn to click the same strings in the same order.
If a note is wrong, he says "Let's listen again…", plays the phrase again, and this time the next string to click
glows. It goes round until the player has it; it cannot be failed. The first three phrases of a line are learned
this way. Then the whole line's words fill the screen and the line is played right through, each phrase of the
words lighting as it is sung, with the reference. In scenes 3, 4, 6 and 7 the same game is played on things in the
scene instead of the harp (rings on water, sheep, stars, cups): each thing is one string. The tune is in
appendix A.

| # | Scene | Line of the psalm | What the player does |
|---|---|---|---|
| 1 | The sheepfold at dawn | 23:1 | Walk David to the gate of the pen (a ring shows it) and click it open. Click each of four sleeping sheep to call it out by name (each has a ring). One is missing: walk into the pen and find Pip behind the hay. Then David says every place has things that can be clicked ("Click the tree, the moon, or the flowers") and waits while they are tried. **Song:** at the harp. |
| 2 | Green pastures | 23:2a | Three patches of grass. Lead the flock to each: the thin dry grass will not do, nor the thistles; the clover is right, and they eat. Then walk to each sheep and click it to pet it, and it lies down. **Song:** at the harp. |
| 3 | Still waters | 23:2b | The sheep will not drink where the water rushes. The pool pours out through a gap that shows three stone-shaped places. Pick up three stones, one at a time, and carry each to the gap (rings show what to click; David says each step). The pool goes still and the flock drinks. **Song:** rings on the still water play the line, each with a drop-of-water sound in its note; click them back. |
| 4 | The lost sheep | 23:3 | Pip has wandered off. Her bleat is louder the nearer David is. Tufts of wool on thorn thickets mark her way; two thickets have no wool and are the wrong way. Nothing gives her own thicket away. Found, she runs out and jumps into his arms, and he carries her back the way he came. (Time-based help here: after 25 seconds a ring shows on the first thicket of her trail, and so on; after 20 seconds carrying her, a ring and an arrow show where the flock waits.) **Song:** the glad flock lines up and each sheep sings one note; click the sheep. |
| 5 | Night under the stars | (rest scene; Psalm 4:8) | Find three dry sticks and bring them to a ring of stones; two green leafy branches will not do. Then, close up, lay the fire: five things (dry grass, twigs, sticks, a branch, a log) must be put on smallest first; two more (a green branch, wet leaves) will not burn at all. One clicked out of turn only shakes, and David says why. Then click two stones together three times for a spark. No new line: the song so far (verses 1 to 3) plays through on one page while the flock goes to sleep. Dark; then dawn. |
| 6 | The valley of the shadow | 23:4 | Dark, with a lamp that lights a little way round David. Three shapes with eyes stand in the way. Walk up to each and the lamp shows what it is: an owl, a family of rock badgers, a thorn bush. Each comes with a note card and its verse. Then one ewe takes fright and runs off. The lamp shows the name of any sheep David stands near; the player works out who is missing and picks her name from the five along the bottom. **Song:** five big stars play the line; click them back. |
| 7 | The table | 23:5 | A high meadow. Fetch the oil jar and click each sheep to put oil on its head against the flies. Then the trough is dry. Close up, seen from above: five stones from the spring to the trough, each with a groove (one straight, four bent). A click turns a stone a quarter turn; water shows in every stone it has reached; when it gets all the way, the trough runs over. **Song:** five cups holding less and less water ring the line (less water rings higher); click them back. |
| 8 | Home | 23:6 | The gate of the fold has a picture lock, and the key is the song. Four lines of the psalm are shown, each with one word left out and a wheel in its place showing a picture with its word: "He makes me to lie down in [green pastures]", "He leads me beside the [still waters]", "Yea, though I walk through the [valley]", "My [cup] runs over." Each wheel shows the same four pictures (green pastures, still waters, valley, cup) and every wheel starts wrong. A click turns a wheel. Nothing says a line is right until all four are: then the gate opens. (Time-based help: after 40 seconds the right lines turn green.) Count the flock in. Learn the last line at the harp. Then the whole psalm comes up and is played straight through over swelling music, while a small window looks back at each scene as its line is played. "Chapter 1 complete." |

## Story 2: Creation (Genesis 1:1 to 2:3)

Nobody walks, and nobody is drawn until the sixth day. There is one picture. It begins black, and each day adds to
it, so that by the seventh day the whole world is in it. The player works the picture itself and the simple
machinery that moves it (a wheel, cogs, cords, weights), like a toy theatre. Each thing begins with its verse
filling the screen ("Then God said…"); what the player then solves is the telling of it. God's acts are given only
in the verses.

**The wheel of day and night** closes every day. Day 1 makes it: a great wheel, half light and half dark, set
half below the horizon behind the sea. From then on each day ends with the player pressing and holding a crank
handle to wind it right round (about 12 seconds): the light goes down, the dark comes up, the light comes back,
and "So the evening and the morning were the … day." From day 4 the sun, moon and stars go round with it.

**Seven small round pictures** along the top, numbered 1 to 7, show what was made each day. Each is gray until its
day is done, then takes its colour and a gold rim.

**Two ways to swap.** Wherever two things change places, the player may click one and then the other, or drag one
onto the other.

| Day | Verses | What happens, and what is solved |
|---|---|---|
| 1 | 1:1–5 | **Black.** Verses 1 and 2 are read on the dark. The pointer stirs the deep: rings spread on black water wherever it moves, each with a low drop of sound. After eight rings, "Then God said, 'Let there be light'" comes up, and on the click light floods everything. **Divide the light from the darkness:** four round discs lie one on another, biggest at the bottom, each half light and half dark, all turned differently. A click turns a disc an eighth of a turn, and the disc lying on it turns as far back the other way. All four must end with light on the same side. (So: set the biggest first and work inward; about ten clicks.) Divided, the wheel sinks half behind the deep and grows to fill the sky. **Make it turn:** between the crank handle and the great wheel are four pegs, and five loose cogs of sizes 25, 40, 40, 55 and 70. Each peg takes only one size (from the handle: 55, 25, 70, 40; one 40 is spare): a cog too big will not sit, one too small sits but plainly does not reach its neighbour, and holding the handle shows how far the turning gets. Then wind the first evening and morning. **Help:** discs, 8 fruitless clicks for words and 8 more for a glow on the disc to turn; cogs, 3 and 3. |
| 2 | 1:6–8 | Water fills the whole picture. **Divide the waters:** three pale waves are to be the waters above. Each hangs on a cord over a pulley with a hook on the other end, and has a weight shown as drops on a tag: 4, 6 and 7. Lifted by hand a water sinks back. It stays up, at its mark, when the weights on its hook add up to its own. The loose weights are 1, 2, 2, 3, 4 and 5 (17 in all, so every one is needed). Too little and the water hangs low; too much and it is hauled past its mark. Four ways solve it: 4 / 1+5 / 2+2+3; 4 / 1+2+3 / 2+5; 1+3 / 2+4 / 2+5; 2+2 / 1+5 / 3+4. Then the waters below settle, a gap opens, and the sky is unrolled across it like a curtain. Wind the second day. (This day has no "it was good": the text has none.) |
| 3 | 1:9–13 | **Gather the waters into one place:** a sorting puzzle on a card. Four piles that hold four pieces each. Twelve pieces: four of water and eight of earth. From the bottom up they begin: earth-water-water-earth; water-earth-earth-earth; water-earth-earth-earth; and one pile empty. A click on a pile lifts its top piece and a click on another puts it there; water may lie only on water and earth only on earth, or in an empty pile. Done when all four waters are in one pile (ten moves at least; it can never be spoiled). Then the sea sinks and four bare hills rise. **Plant it:** three seeds, one of each kind the verse names (grass, a herb with a seed head, a fruit tree). A seed dropped on dry ground grows; on the sea, it comes back. A plant that is clicked gives a seed of its own kind. A hill turns green when all three kinds grow on it; done when all four hills are green (twelve plants at least). Wind the third day. **Help:** piles, 4 moves that bring it no nearer for words, 4 more for a glow on the pile to take from and then the pile to put on; planting, 3 seeds planted where their kind already grows bring a line about the bare hill. |
| 4 | 1:14–19 | Carry the sun up to a dashed ring that marks its place in the sky. "Now the lesser light, to rule the night. But where is the night?" Nothing else answers: the player must wind the wheel half round, and the sun goes down as the dark comes up. **The moon's shapes:** seven on a card: a sliver, a half and a nearly full moon lit on one side, the full moon, and the same three lit on the other side. The first sliver is pinned in the first place; the other six are out of order. Swap them until they run as the moon does, waxing to full and waning (five swaps at least). Then set the moon in the same ring, in the night sky, and hang stars with a click each, a harp note to each, as many as the player likes (seven at least). Wind on to morning: the sun comes up again. **Help:** 4 swaps that put nothing in place for words, 4 more for a glow on the first wrong place and the shape that belongs there. |
| 5 | 1:20–23 | **A fish, then a bird, each put together from pieces** (five and six). Only the creature's shadow is given. Every piece lies turned a quarter, a half or three quarters round: a click turns a piece a quarter turn, and a piece dragged to the place of its shape, lying the right way, sits there. A place takes any piece of its shape (the fish's two halves are one shape, and so are its two fins). Made, the fish swims off into the sea and the bird flies into the sky; after "Be fruitful and multiply" there are more of each, and a great sea creature comes by. They go on crossing the picture for the rest of the story. Wind the fifth day. **Help:** 4 pieces dropped where they do not fit for words, 4 more and the shadow shows where its pieces join. |
| 6 | 1:24–27, 31 | **Each according to its kind:** an ox, a sheep, a tortoise and a lion, each in three parts (front, middle, back), with the twelve parts mixed. Any two parts change places, so a head can go where a tail belongs. They begin with five parts in the wrong kind of place. Done when every animal is whole and the right way round (seven swaps at least). The sheep and the ox are both pale, to be mistaken for each other. An animal made whole jumps and makes its sound. Then they stand on the land. **People, sewn on a card:** a card with twenty holes and thirty dotted lines between them, which make a man and a woman hand in hand. A click on a hole puts the needle in; a click on the next hole along a dotted line sews that line. The thread must go along every line and along none twice (one stroke, without lifting the pencil). It can only be done by starting at one of the two free hands. When the thread can go no further and lines are still bare, the card says so; "Go back" pulls out one stitch per click. Sewn, the card goes and two plain figures without faces stand on the hill. Then "very good", and the sixth day is wound. **Help:** animals, 4 and 4, as for the moon; sewing, stuck twice for words, four times and the hole to begin from glows, six times and the next thing to click glows. |
| 7 | 2:1–3 | Nothing to solve. The music becomes the fullest of the story. The crank and cogs are put away. **Everything that was made now answers a click**, each with its note card, a sound and a movement: the sky, the waters above, the sun, the sea, each hill, each plant, the fish and the sea creature, the birds, the ox, the lion, the sheep, the tortoise, the people. After a little while a card marked "Rest" comes, and waits as long as the player likes. Then the last verses. There is no evening and morning for this day: the text has none. "Chapter 2 complete." |

## Story 3: Noah's Ark (Genesis 6 to 9)

Noah is walked in scenes 1 to 3, on land before the ark. From the moment the door is shut nobody is walked: the
player works the picture (the storm, the lamp, the waves, the dove, the bow). The ark is in every scene. Colour is
held back (timber and dust, then storm) until the green land and the bow at the end. The reason for the flood is
said once, plainly, in the first verses, and not dwelt on.

Scenes 1, 2 and 3 are one place and run on without a break.

### Scene 1: The ark is built (6:11, 6:8, 6:13–16, 6:22)

The bare frame of the ark stands on blocks, very large beside Noah. Noah reads God's plan for it (6:14–16); it can
be read again at any time from a card in the corner ("The plan").

**To work out.** Six parts lie on the ground: three deck timbers of three clearly different lengths, the door,
the window and the roof. Where each goes is in the plan.

- Each timber fits one deck only (the middle deck is the longest, the lowest next, the top the shortest).
- Each deck rests on the one below: lowest first.
- The door has two outlined places: in the side (right) and in the roof (wrong).
- The window has two: up under the roof (right) and down by the keel (wrong).
- The roof goes on last.

**To do.** Click a part: Noah walks to it and ties the rope to it, then walks to the windlass. Press and hold the
windlass to haul the part up; it rises steadily and stops only when let go. When it hangs level with a place, that
place's outline lights; click the part to set it in. A click when it is level with nothing lets out a little rope.
A wrong place brings it down again with Noah's reason (the reasons are in appendix C). After two wrong tries, a
part that could go in next glows.

Then, close up on the side of the hull: a mallet moves to and fro over six pegs, and a click brings it down. Two
blows drive a peg home; a miss costs nothing but the moment. Then press and drag a brush along every gap between
the planks to cover it with pitch.

### Scene 2: Two by two (6:19–20, 7:8–9)

Noah says the great door must come down. The player clicks it; it lets down from its sill to the ground as a ramp.
The music changes.

Eighteen animals of nine kinds come, but every one stops far from its mate, some on each side of the ark: sheep,
goats, lions, oxen, elephants, giraffes, ravens, doves and tortoises. The birds sit in two trees.

**To do.** Click an animal and Noah walks to it; it then follows him, up to four at a time (a fifth is told to
wait). Lead them to the foot of the ramp and stop there. Any whose mate is also there go up and in together; the
odd ones stand aside and wait for theirs. A number counts each pair in.

**To work out.** Sheep and goats look alike. The lion's mate has no mane. Tortoises cannot be led: clicked, each
sets off for the ramp by itself, very slowly. Birds fly down to Noah when clicked. The giraffes are too tall for
the door: each stops at it and must be clicked to duck.

**Help.** Coming to the ramp with nothing but odd ones is a fruitless try. After two, Noah says more ("Some that
look alike are not mates…"); after two more, the mate of one that is waiting glows.

**The weather.** The sky darkens a little with every pair and storm clouds gather. From the third pair on, each is
answered by a flash of far lightning and thunder, a little nearer each time. The lightning never comes at the
moment of boarding: it waits until Noah is away from the ramp, leading animals, with a quiet moment since the last
call. No rain falls yet.

### Scene 3: A room for everyone (6:21, 7:1, 7:7, 7:16)

Noah walks to the ramp, and the view flies in at the dark doorway. Inside, the ark is shown cut open like a doll's
house.

**The stalls.** Three decks, with a ladder up the middle. Ten ordinary stalls and one tall one:

| | Left, outer | Left, inner | Right, inner | Right, outer |
|---|---|---|---|---|
| Top deck (under the roof; the window is over the two inner stalls) | 6 | 7 | 8 | 9 |
| Middle deck | 3 | tall stall (giraffes) | 4 | 5 |
| Lowest deck | 0 (the hay is here) | tall stall (giraffes) | 1 | 2 (the water casks are here) |

The giraffes stand in the tall stall and cannot be moved. The other eight pairs begin in a muddle: elephants in 0,
sheep in 1, oxen in 2, goats in 3, doves in 4, lions in 5, ravens in 6, tortoises in 7; stalls 8 and 9 empty.

**To do.** Click two stalls and what is in them changes places (an empty stall counts). Click one stall to hear
what its pair wants.

**The rules.**

- Refused at once, in words: the great beasts (elephants, oxen) may stand only on the lowest deck; the middling
  ones (lions, sheep, goats) not on the top deck; only the small ones (tortoises, ravens, doves) fit under the roof.
- Shown by a pair fidgeting (birds beat their wings), and said when it is clicked:
  the oxen want stall 0, by the hay;
  the elephants want stall 2, by the water;
  the sheep and the goats want to stand side by side (same deck, same side, next to each other);
  the ravens and the doves each want one of the two stalls under the window (7 or 8);
  the tortoises want the lowest deck (they cannot climb a ladder).
- The ark must stand level. Each pair has a weight, shown as dots: elephants 5, oxen 4, giraffes 3, lions 3,
  sheep 2, goats 2, tortoises 1, ravens 1, doves 1. The sum on each side of the ladder is shown under it, and the
  whole ark leans toward the heavier side.

Nothing in the ark is afraid of anything else.

**The answer.** Four arrangements satisfy every pair, and all four happen to be level. One is: oxen 0, tortoises
1, elephants 2, lions 3, sheep 4, goats 5, ravens 7, doves 8 (11 on each side). From the muddle it takes five
swaps at least: 0 with 2, 1 with 4, 1 with 7, 3 with 5, 6 with 8.

**Help.** Three swaps that mend nothing (or are refused) and more is said; three more and two stalls that should
change places glow.

Then the view comes back outside. God's word to Noah (7:1). His wife, his three sons and their wives walk up the
ramp and in, and Noah last. The great door lies open on the ground: the player is asked to click it shut, twice,
and it only shakes ("It is far too heavy"; "No one can lift it"). Then the verse: "…and the LORD shut him in."
The door rises and shuts by itself, with a slam. Lightning; and the rain begins.

### Scene 4: The flood, and the storm (7:11, 7:17)

The waters rise over the land (about 13 seconds, nothing to do), cover it, and lift the ark.

Then the storm: the action scene of the game. A wide sea under a low stormy sky, in heavy rain, with the ark seen
from the side, rocking. The storm drives her from left to right: the ark stays a third of the way across and the
sea comes toward her. The player moves the pointer up and down, and the ark moves up and down the picture toward
it (further off, or nearer), steadily, not at once. She has no rudder and no sail: the words say so.

Three stretches, each adding something:

1. **Mountain tops.** She cannot go through them. If one is in her way she is held against it, the sea stops
   moving, she shudders and an animal calls out, until she is steered up or down round it.
2. **Currents and floating trees.** A current is a wide pale patch of water with arrows on it: if she goes into
   one it sweeps her quickly a good way back, and she must go round it. A floating tree drifts slowly up and down
   the sea, turning back at its edges or at the ark; it stops her like a mountain.
3. **Lightning.** A pale ring lies on the water where lightning will strike, and comes toward her with the sea.
   The bolt falls as the ring reaches her. If she is under it she is driven back to the place where the lightning
   stretch began, and tries again. (Not to the start of the whole storm.)

A careful run takes about 45 seconds. There is no clock, and nothing can be lost but ground. It ends: "Rocks and
wild water, great trees and lightning: and not one plank of her is broken. God kept them all safe."

The course, for rebuilding. The sea is 12,700 long and 660 across (0 is the far edge), and about 1,600 of its
length is in view at once. She is driven along at 280 a second, rising to 380 by the end, and can cross the whole
sea in about a second and a half. The ark is about 200 long. Each entry is how far along, what, how far across,
and one more number: a mountain's size (at size 1 it is about 140 long), or a tree's drift across in a second (a
tree is about 190 long). A mountain or a tree stops her when it is ahead of her and within about 55 across; a
current is 600 long and 280 across, and sweeps her back 700; a bolt strikes anything within about 65 across of
its ring.

```
Stretch 1 (mountains):
1100 rock 330 1.2 | 1600 rock 130 1.0 | 1600 rock 550 1.0 | 2100 rock 350 1.3 | 2100 rock 650 1.0
2600 rock 50 1.0  | 2600 rock 260 1.1 | 3100 rock 490 1.2 | 3100 rock 180 1.0
Stretch 2 (from 3500: currents and trees):
3900 current 180 | 4500 rock 580 1.2 | 5000 tree 230 +70 | 5400 tree 490 -80 | 5900 current 490
6500 rock 70 1.2 | 6500 rock 350 1.0 | 7000 tree 130 +90 | 7300 rock 570 1.1 | 7700 tree 410 -90
Stretch 3 (from 8000: lightning):
8500 bolt 330 | 8900 bolt 130 | 8900 rock 550 1.1 | 9300 bolt 490 | 9600 rock 230 1.2
10000 current 330 | 10500 bolt 570 | 10500 tree 80 +60 | 10900 rock 380 1.3 | 10900 bolt 110
11300 bolt 260 | 11500 rock 590 1.0 | 11800 bolt 450 | 12100 rock 130 1.2 | 12100 tree 530 -70
```

### Scene 5: Forty days and forty nights (7:12)

The view flies in at the ark on the sea. Inside again: the same cut-open ark, now rocking hard, with every pair
where the player put it in scene 3.

Two nights. Before each, the player may look at who is where for as long as they like; a click puts out the lamp
and every stall goes dark. Then thunder frightens one pair after another (two pairs the first night, three the
second, chosen at random from the elephants, oxen, lions, sheep, goats, ravens and doves). Each calls in its own
voice and is named in words, and the player clicks the stall they think it is in, which takes the lamp there. The
right stall: "There they are. Hush now: you are safe in the ark." A wrong stall shows who is really there, asleep.
**Help:** three wrong stalls for one pair and the right one glimmers.

Each morning a mark is made on the wall. After the second the marks run on by themselves to forty. The view comes
back outside, and the verse is read.

### Scene 6: The ark on the waters (7:18, 7:24, 8:1, 8:4)

"The ark has no sail, and no rudder. The waters carry her, where God wills."

A sliding puzzle, seen from above. The flood is a grid of squares; some squares hold drowned mountain tops (dark
shapes under the water). The ark sits on one square, and a circle marks another. Four arrows stand round the sea.
Clicking an arrow sends a wave from that side: the ark slides that way, to the sound of rushing water, and cannot
stop until she bumps into a mountain or the edge. The player must bring her to rest exactly in the circle.

Three seas (S the ark, G the circle, # a mountain):

```
First (3 waves at least)   Second (6)        Third (8): the circle is Ararat
....#.                     ..#..#..          .#...##..
.S....                     ..G.....          .........
...#G.                     ...#.S..          ....#.S.#
.#...#                     .#...#..          #G.#..#..
                           ..#...#.          ..#......
                                             .....#...
```

Between the second and third come the verses "the waters prevailed… one hundred and fifty days" and "Then God
remembered Noah…", and the storm clears. After the third, back in the side view, the waters go down (10 seconds),
the mountains show, and the ark comes to rest on the broad top of Ararat.

**Help:** four waves that bring her no nearer (counted in waves still needed) and more is said; four more and the
arrow of a wave that helps glows.

### Scene 7: The raven and the dove (8:6–12)

The ark rests on the mountain with water all round. A click on the ark opens its window. The raven flies out and
goes to and fro across the sky for the rest of the scene.

Then the dove, three times, and the player flies her. The control is as plain as it can be: a click on the dove
sends her out; she then follows the pointer wherever it goes over the picture; a click asks her to come down at
that place. She never moves by herself and is never hidden: between flights she sits at the window. A glowing ring
shows where to click whenever there is exactly one right place.

1. **Only water.** Wherever she is asked to come down there is water, and she cannot rest. After three tries the
   player is told to bring her home, and clicks the window. (8:9)
2. Seven days pass (see below). The waters are lower, and three treetops stand out of them: **a palm, a fig and an
   olive**. Each names itself when she alights on it ("This is a palm tree: its leaves are great fans. Not the
   olive."). On the olive she plucks a leaf, and the player brings her home with it. **Help:** after two wrong
   trees the olive is ringed. Evening falls, and the verse is read. (8:11)
3. Seven days more. The ground is dry and green. Wherever the player lets her down on the land, she stays. (8:12)

**Seven days passing** is shown in the sky: from noon the sun goes over and sets on the right, the moon rises on
the left and crosses, the sun comes up again, seven times round, with the light going and coming and a dot counted
for each day.

### Scene 8: Dry ground, and the bow (8:15–20, 8:22, 9:1, 9:11–13, 9:16)

This is the height of the whole story.

**Out.** The land is green. Nine clicks on the ark let out the nine pairs, one pair to a click, each with its own
voice, bounding down the mountain to a place on the land (the birds fly): sheep, goats, oxen, lions, elephants,
giraffes, ravens, doves, and last of all the tortoises. Then Noah and his family stand before the ark.

**The altar.** Close up: nine stones lie about (three long, three middling, three short: 3, 2 and 1 units), and a
marked place six units wide and three courses high. Drag each stone to where it should lie.

- A stone must lie inside the marked place and rest on stones (or on the ground).
- No gap between two stones may stand right over a gap in the course below (or under one in the course above):
  every stone must lie across a gap. This is how a real wall is laid.
- A stone that would break a rule goes back where it came from, with the reason. A stone with nothing on it can be
  taken off again.

**Help:** three stones sent back and the rule is said plainly; three more and a way to begin is given ("Try two
long stones for the lowest course, and then a middling one to begin the next.").

**The promise, and the bow.** "While the earth remains…" (8:22), God's blessing (9:1) and His promise (9:11) are
read. Then a cloud comes over the earth again, with rain and a little thunder, and the sign is announced
(9:12–13). The player sets the bow in the cloud: pressing on a glowing ring where it rises on the left, and
sweeping right over the sky and down the other side. The bow is drawn, seven colours at once, exactly as far as
the pointer has gone; it cannot be jumped ahead. A harp note sounds for each seventh of the way, and every pair of
animals leaps and calls as the bow passes over it. These are the first bright colours in the story.

When it stands whole the rain stops, the light comes back, and every pair and the family leap together. The last
verse (9:16) is read with the bow behind it. Then the animals go out two by two, to both sides and right out of
the picture, to fill the earth, the tortoises last. "Chapter 3 complete", with the bow still showing behind.

## Sound and music

Music is quiet, wordless and different in every place. Roughly:

- **The map:** a small easy tune on the harp over eight slow chords.
- **The Shepherd's Song:** warm slow chords with a few harp notes; bright in the pastures, high and rippling by
  the water, low and searching for the lost sheep, slow and still at night, dark and uneasy in the valley (trembling
  low strings and a slow drum), sunny at the table, and fullest at home. The psalm's own tune is played on the
  harp, alone, with nothing under it but a few strings rolled on the last note of a line.
- **Creation:** one low unmoving chord before light; then a different music for each day; on the seventh the
  loudest and brightest, with a drum on every beat.
- **Noah's Ark:** a work song for the building (it swings in threes, a drum on every beat, a tune on the harp);
  striding music over a slow drum as the animals come under a darkening sky; low trembling strings for the flood;
  wide and slow, a note now and then, for the ark alone on the water; light and hopeful for the dove; the fullest
  and brightest for dry ground and the bow.

Sounds that matter to play: footsteps; a bleat for each sheep (a lamb's is higher); each animal's own voice (ox,
goat, lion, elephant, raven, dove; the giraffe and tortoise are nearly silent); thunder; rain; rushing water; the
knock of a thing set in place; a rope tied; a deep wooden mallet; a brush on wood; a great door's rumble and slam;
a drop of water with a pitch (the song on the still water); a count that rises as things are counted.

The present recordings are all public domain and are listed in the README.

## For whoever rebuilds it

- The look is free. The present one is cut paper; anything gentle and beautiful will do, so long as the rules in
  "What must not change" hold (above all: plain people, God never drawn, nothing photoreal that would settle what
  Bible times looked like).
- Every puzzle here was checked by a script that tried every arrangement, to be sure it has an answer, cannot be
  spoiled, and takes about the number of moves given. If a puzzle's numbers are changed, check it again.
- The words in appendix C are the game's script. Verses must be kept exactly. The storyteller's lines may be
  reworded, but each was written to be read by a seven-year-old and to keep to the text.
- The Shepherd's Song still has a few time-based rings (scenes 4, 5 and 8). The later rule is help by tries only.
- Nothing has been played by a child yet, and the sounds were chosen without being heard by their author: treat
  pacing, difficulty and sound as first drafts.

## Appendix A: the psalm's tune

The harp has seven strings, low to high: A3, D4, E4, F sharp 4, A4, B4, D5 (220, 293.66, 329.63, 369.99, 440,
493.88 and 587.33 Hz). They are numbered 1 to 7 here. Each line of the psalm is sung in short phrases; a note is one
beat long (about half a second) unless a longer length follows it in brackets. The tune was written for this game.

**Psalm 23:1**

| Words | Strings |
|---|---|
| The LORD is my | 1, 2, 3, 4 |
| shepherd; I | 5, 4, 3 |
| shall not want. | 4 (2 beats), 3, 2 (3 beats) |

**Psalm 23:2**

| Words | Strings |
|---|---|
| He makes me | 3, 4, 5 |
| to lie down | 6, 5, 4 (2 beats) |
| in green pastures; | 3, 4, 3 (2 beats), 2 (3 beats) |

**Psalm 23:2**

| Words | Strings |
|---|---|
| He leads me | 5, 6, 7 (2 beats) |
| beside the | 6, 5, 4 |
| still waters. | 5 (2 beats), 3, 2 (3 beats) |

**Psalm 23:3**

| Words | Strings |
|---|---|
| He restores my soul; | 2, 3, 4, 3, 2 (2 beats) |
| He leads me | 4, 5, 6 |
| in the paths | 7, 6, 5 (2 beats) |
| of righteousness | 4, 5, 4, 3 (2 beats) |
| For His name’s sake. | 3, 4, 3, 2 (3 beats) |

**Psalm 23:4**

| Words | Strings |
|---|---|
| Yea, though I walk | 1, 2, 3, 4 (2 beats) |
| through the valley | 5, 5, 4, 3 (2 beats) |
| of the shadow of death, | 2, 2, 3, 3, 2, 1 (2 beats) |
| I will fear no evil; | 4, 5, 6, 6, 5, 4 (2 beats) |
| For You are with me; | 5, 6, 7, 6, 5 (2 beats) |
| Your rod and Your staff, | 4, 4, 5, 4, 3 (2 beats) |
| they comfort me. | 3, 4, 3, 2 (3 beats) |

**Psalm 23:5**

| Words | Strings |
|---|---|
| You prepare a table | 2, 3, 4, 4, 5, 4 (2 beats) |
| before me | 3, 4, 5 (2 beats) |
| in the presence | 6, 6, 5, 4 (2 beats) |
| of my enemies; | 3, 3, 4, 3, 2 (2 beats) |
| You anoint my head | 4, 5, 6, 7, 6 (2 beats) |
| with oil; | 5, 4 (2 beats) |
| My cup runs over. | 3, 4, 3, 2, 2 (3 beats) |

**Psalm 23:6**

| Words | Strings |
|---|---|
| Surely goodness | 1, 2, 3, 4 |
| and mercy | 4, 5, 4 (2 beats) |
| shall follow me | 3, 4, 5, 6 (2 beats) |
| All the days of my life; | 7, 6, 5, 4, 3, 4 (2 beats) |
| And I will dwell | 2, 3, 4, 5 (2 beats) |
| in the house of the LORD | 6, 6, 5, 4, 3, 2 (2 beats) |
| Forever. | 4, 3, 2 (4 beats) |

Which lines are taught where: 23:1 in scene 1; "He makes me to lie down…" in scene 2; "He leads me beside…" in
scene 3; 23:3 in scene 4; 23:4 in scene 6; 23:5 in scene 7; 23:6 in scene 8. Only the first three phrases of a line
are played back by the player; the rest is heard.


## Appendix B: the note cards

Shown when a thing is clicked: one plain sentence, a verse (NKJV), and its reference. A line break in a verse is
shown here as " / ".

| Thing | Sentence | Verse | Reference |
|---|---|---|---|
| moon | God made the moon to light the night. | Then God made two great lights: the greater light to rule the day, and the lesser light to rule the night. He made the stars also. | Genesis 1:16 |
| stars | God made every star, and He knows each one. | He counts the number of the stars; / He calls them all by name. | Psalm 147:4 |
| sun | God made the sun to light the day. | From the rising of the sun to its going down / The LORD’s name is to be praised. | Psalm 113:3 |
| tree | God made the trees. This one is an olive tree. | But I am like a green olive tree in the house of God; / I trust in the mercy of God forever and ever. | Psalm 52:8 |
| flower | God made the flowers. Jesus said: | Consider the lilies of the field, how they grow: they neither toil nor spin; and yet I say to you that even Solomon in all his glory was not arrayed like one of these. | Matthew 6:28–29 |
| bird | God made the birds, and He feeds them. Jesus said: | Look at the birds of the air, for they neither sow nor reap nor gather into barns; yet your heavenly Father feeds them. | Matthew 6:26 |
| deer | God gives every creature water to drink. | As the deer pants for the water brooks, / So pants my soul for You, O God. | Psalm 42:1 |
| spring | God sends the water that fills the streams. | He sends the springs into the valleys; / They flow among the hills. / They give drink to every beast of the field; / The wild donkeys quench their thirst. | Psalm 104:10–11 |
| owl | God made the night, and the creatures that wake in it. | You make darkness, and it is night, / In which all the beasts of the forest creep about. | Psalm 104:20 |
| badger | God made the rock badgers, small as they are, and gave them a safe home. | The rock badgers are a feeble folk, / Yet they make their homes in the crags; | Proverbs 30:26 |
| fear | When something frightens us, we can trust God. | Whenever I am afraid, / I will trust in You. | Psalm 56:3 |
| heaven | God made the sky, and it tells how great He is. | The heavens declare the glory of God; / And the firmament shows His handiwork. | Psalm 19:1 |
| above | God set waters above the sky, and they praise Him too. | Praise Him, you heavens of heavens, / And you waters above the heavens! | Psalm 148:4 |
| land | God made the dry land, and the sea. | The sea is His, for He made it; / And His hands formed the dry land. | Psalm 95:5 |
| plant | God made every growing thing, each with its own seed. | He causes the grass to grow for the cattle, / And vegetation for the service of man, / That he may bring forth food from the earth, | Psalm 104:14 |
| fish | God filled the sea with living things, great and small. | This great and wide sea, / In which are innumerable teeming things, / Living things both small and great. | Psalm 104:25 |
| beast | God made every animal, and every one is His. | For every beast of the forest is Mine, / And the cattle on a thousand hills. | Psalm 50:10 |
| people | God made people in His own image. And He made you. | I will praise You, for I am fearfully and wonderfully made; / Marvelous are Your works, / And that my soul knows very well. | Psalm 139:14 |

(`fear` is said in the valley, of the thorn bush. `heaven` to `people` are for the seventh day of Creation.)


## Appendix C: every line shown to the player

Taken from the game's own files, scene by scene, roughly in the order they are used (lines that answer a wrong try
are grouped where the code keeps them, which is often before the scene's opening lines). Verses are NKJV, exact, with
their references in brackets. "LORD" is set in small capitals in the game. The lines of Psalm 23 itself are in
appendix A, and the note cards in appendix B.

### The Shepherd's Song, scene 1

- Good morning! I’m David. I look after my father’s sheep.
- Today I am taking them over the hills, to good grass and water. Will you come and help me look after them?
- As we walk I’ll teach you a song I am making. It is about the Lord, who looks after me just as I look after them.
- My sheep are still asleep in their pen. Our first job is to bring them out!
- Click where you want me to walk. Let’s go to the gate.
- Here we are! Click the gate to open it.
- Now wake them and call them out of the pen. Click each sleeping sheep!
- One, two, three, four… One is missing! Where is little Pip? Let’s look inside the pen.
- There she is, behind the hay! Click her to call her out.
- Five! Every one is here. Not one is lost.
- Every place we come to has things you can click as well.
- Try it! Click the tree, the moon, or the flowers.
- Now listen. This is how my song begins…
- That’s the start of our song!
- Green pastures are just over the hill. Lead the way, and the flock will follow.

### The Shepherd's Song, scene 2

- Green pastures! The flock is hungry after the walk.
- But not all grass is good grass. Let’s find the best for them.
- The grass here is thin and dry. They would still be hungry. Let’s look further on.
- Thistles! They would prickle the sheep’s noses. Not here.
- Deep, sweet clover! Eat up, little ones.
- They have eaten their fill.
- But a sheep only lies down when it feels safe, with its shepherd close by. Walk to each one and pet it.
- All five, lying down in green pastures. They have all they need, and their shepherd is near.
- That is how the Lord cares for me. Listen, this is the next part of my song…
- They will be thirsty now. Still waters are not far from here.

### The Shepherd's Song, scene 3

- Water! Hear it? And the flock is thirsty.
- But sheep will not drink where the water rushes. It frightens them.
- See the gap at the bottom of the pool, where the water pours out? If we block it with stones, the pool will go still.
- Find a stone and click it to pick it up.
- Now carry it to the gap, where the water pours out.
- The stones go here. First find one and pick it up.
- One stone in! Two more.
- Two! One more stone.
- Look! The water has gone still and deep.
- Come and drink, little ones.
- They drink their fill, with nothing to fear.
- The Lord leads me to quiet places too.
- Do you know, God’s song is in everything He has made: the wind, the birds, even the water.
- Look, rings on the still water! It is playing the next part of my song. Tap the rings to play it back.
- Rested and watered. Let’s go on, and stay together!

### The Shepherd's Song, scene 4

- One, two, three, four… Wait. Where is Pip?
- She has wandered off! Stay here, flock. I must go and find her.
- Listen for her. And look for wool caught on the thorns.
- A tuft of wool! She came this way.
- More wool. We are getting closer. Listen!
- No wool on this one. She did not come this way.
- There you are, Pip! Caught fast in the brambles.
- I have you! Now let’s carry you back to the other sheep, back the way we came.
- Back with the flock! See how glad they are.
- When one of mine is lost, I go after it and carry it home. The Lord does that for me.
- Listen! They are so glad that they are singing. Every sheep has a note of its own.
- The day is nearly done. Let’s find a place to rest for the night.

### The Shepherd's Song, scene 5

- That branch is green and wet. It would only smoke!
- Those leaves are wet. They would only smoke!
- A fire has to grow: put the smallest thing on first. And only dry things burn!
- That one is too big to catch yet. Find something smaller.
- Dry grass: that catches first.
- Then little twigs.
- Then our sticks.
- Then the branch.
- Now strike the two stones together to make a spark. Click them!
- A spark! Strike again.
- The grass is glowing. Once more!
- Night under the stars
- The sun has set, and the night will be cold. Let’s make a fire.
- Dry sticks burn well. Green branches with leaves on only smoke.
- Find three dry sticks, then bring them to the ring of stones. Look all around: one is further along.
- That branch is green and wet. It would only smoke. Look for a dry stick.
- That is enough. Now to the ring of stones.
- Warm and bright! Come close, little flock.
- I will play them to sleep with our song, as far as we have come. Just listen this time.
- “I will both lie down in peace, and sleep; For You alone, O LORD, make me dwell in safety.” [Psalm 4:8]
- linear-gradient(#fff,#f6ded6 40%,#c9c2e0 52%,#b4b9e0 62%)
- Morning! The Lord has kept us safe all night.
- The way home goes through the valley. Stay close to me.

### The Shepherd's Song, scene 6

- Only an owl, out hunting mice! Good night, owl.
- Rock badgers! A whole family, more frightened of us than we are of them.
- A thorn bush, shaking in the wind. That is all it ever was.
- linear-gradient(#a79fc4,#5d5888 40%,#33305a 60%)
- The valley of the shadow
- The way home goes through this valley. It is dark, and the sheep are afraid.
- But I have my lamp. And I am not alone here.
- Stay close. If something looks frightening, walk right up to it with the lamp.
- Three shadows, and nothing in them to harm us.
- Now let me count my flock. One, two, three, four… One is missing! She took fright and ran.
- Who is it? Walk close to each sheep and my lamp will show its name. Then tell me who is missing.
- No, [name] is here with us. Look again.
- Yes, [name]! Call her. [name]!
- There she is. Even in the dark I know every one of my sheep by name.
- And I am not afraid here. The Lord is with me, as I am with my sheep.
- Look up! The stars are out, even over this valley. They are playing the next part of my song. Tap them to play it back.
- Look, light ahead! We are nearly through.

### The Shepherd's Song, scene 7

- Click a stone to turn it. Make a way for the water, down to the trough.
- Out of the valley, and up to the high meadow! It is spread out like a table for them.
- Eat all you want, little ones.
- The flies bother them, though. A little oil on each head keeps the flies away.
- First fetch the oil. It is in the little jar, back the way we came.
- Now go to each sheep and put oil on its head.
- And they will want water, but the trough is dry! Stone channels bring the water down from the spring, and they have been knocked about.
- Let’s set them right. Come over to the spring, by the trough.
- A table made ready, oil on every head, and a cup that runs over.
- That is how the Lord treats me.
- See these cups? Each one holds a little less water than the last, and the less water in a cup, the higher it rings. They play the next part of my song. Tap them to play it back.
- Now for home! It is just over the next rise.

### The Shepherd's Song, scene 8

- He makes me to lie down in
- He leads me beside the
- Yea, though I walk through the
- Home! There is the fold, and my father’s house beyond it.
- Lead them to the gate, and we will count them in.
- The gate is tied shut with my father’s picture lock. I know the key: it is our song!
- Five. Every one is home. Not one is lost.
- Goodness and mercy have followed us all the way. Thank you for helping me today!
- Listen, this is the last part of my song. Then we will hear it whole…

### Creation, day 1

- Everything is dark. Move over the deep, dark water.
- Light! But the light and the dark are all mixed together. Click a wheel to turn it, and watch the next one in: it turns back the other way. Can you get all the light onto one side?
- Turning a wheel upsets the one lying on it. So begin with the biggest one that is out of place, and when it lies right, leave it alone.
- Evening… and now it is night. Keep winding: morning is coming!
- That one is too big to sit there.
- Day must turn to night, and night to day again. Press and hold the handle to wind the great wheel round.
- The handle turns, but the turning does not reach the great wheel. Put a cog on each peg, so that the teeth of each one meet the next.
- Begin by the handle. Which cog reaches from the nearest peg to the small cog beside the handle? Hold the handle to see how far the turning gets.
- It turns! Keep holding.
- In the beginning God created the heavens and the earth. [Genesis 1:1]
- The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters. [Genesis 1:2]
- Then God said, “Let there be light”; and there was light. [Genesis 1:3]
- And God saw the light, that it was good; and God divided the light from the darkness. [Genesis 1:4]
- God called the light Day, and the darkness He called Night. [Genesis 1:5]
- So the evening and the morning were the first day. [Genesis 1:5]

### Creation, day 2

- Too heavy! That water is hauled up past its place. Take something off.
- That helps, but it still hangs low. It needs more weight.
- That one hangs true!
- The second day. There is light now, and there is water: water everywhere, high and low, with no room between.
- Then God said, “Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.” [Genesis 1:6]
- A firmament is a wide open space: the sky. To make room for it, the pale waters must go up high. Try lifting one!
- It sinks back: water is heavy! Hang weights on its hook to hold it up. The drops on its tag show how heavy it is.
- One hook can carry two weights, or three. Count the drops on a water, then find weights whose dots make just that many. Every weight is wanted.
- Try this: the water with seven drops takes the 5 and a 2. Then the 4 holds up the water with four drops.
- All three hang true!
- Thus God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament; and it was so. [Genesis 1:7]
- And God called the firmament Heaven. [Genesis 1:8]
- Evening is coming. Press and hold the handle to wind the great wheel round.
- So the evening and the morning were the second day. [Genesis 1:8]

### Creation, day 3

- Earth and water lie all mixed together. Gather all the water into one place! Click a pile, then another, and the top piece moves across. Or carry the piece there.
- To get at a piece that lies underneath, first move what is on top of it somewhere else.
- That pile is full: it holds four.
- Water lies only on water, and earth only on earth. Or in an empty place.
- The waters are gathered together into one place!
- A seed needs dry ground.
- Three seeds, one of each kind: grass, a herb that bears seed, and a fruit tree. Carry each one to dry ground.
- Every plant has its seed in itself. Click a plant, and it gives you a seed of its own kind. A hill turns green when all three kinds grow on it. Make every hill green!
- Which hill is still bare earth? Look at what grows on it already, and bring it a seed of each kind it lacks.
- Then God said, “Let the waters under the heavens be gathered together into one place, and let the dry land appear”; and it was so. [Genesis 1:9]
- And God called the dry land Earth, and the gathering together of the waters He called Seas. And God saw that it was good. [Genesis 1:10]
- Then God said, “Let the earth bring forth grass, the herb that yields seed, and the fruit tree that yields fruit according to its kind, whose seed is in itself, on the earth”; and it was so. [Genesis 1:11]
- And the earth brought forth grass, the herb that yields seed according to its kind, and the tree that yields fruit, whose seed is in itself according to its kind. And God saw that it was good. [Genesis 1:12]
- Evening is coming. Press and hold the handle to wind the great wheel round.
- So the evening and the morning were the third day. [Genesis 1:13]

### Creation, day 4

- Its place is the ring, high in the sky. Carry it there, and let it go.
- Night by night the moon’s light grows until the moon is full, and then it goes again. The first night is pinned in its place. Put the others in order after it: click two, or carry one onto another, and they change places.
- After the pinned one, each night has a little more light, on the same side, until the moon is full. Then the dark comes in from that same side, a little more each night.
- Then God said, “Let there be lights in the firmament of the heavens to divide the day from the night; and let them be for signs and seasons, and for days and years; and let them be for lights in the firmament of the heavens to give light on the earth”; and it was so. [Genesis 1:14–15]
- Here is the greater light, to rule the day. Carry it up to the ring, and set it in the sky.
- Now the lesser light, to rule the night. But where is the night?
- The night is on the far side of the great wheel. Press and hold the handle, and bring it round.
- Now set the lesser light in the night sky: carry it up to the ring.
- He made the stars also. Click the dark sky to hang them: as many as you like.
- Then God made two great lights: the greater light to rule the day, and the lesser light to rule the night. He made the stars also. [Genesis 1:16]
- God set them in the firmament of the heavens to give light on the earth, and to rule over the day and over the night, and to divide the light from the darkness. And God saw that it was good. [Genesis 1:17–18]
- Morning is coming. Press and hold the handle to wind the great wheel on.
- So the evening and the morning were the fourth day. [Genesis 1:19]

### Creation, day 5

- Look at the corners of the shadow. Which piece has a corner just like that one? Click the piece until it lies the same way.
- Then God said, “Let the waters abound with an abundance of living creatures, and let birds fly above the earth across the face of the firmament of the heavens.” [Genesis 1:20]
- Here are the pieces of a creature for the waters. Fit them into its shadow. Click a piece to turn it.
- And here is one for the sky. Turn its pieces, and fit them into its shadow.
- So God created great sea creatures and every living thing that moves, with which the waters abounded, according to their kind, and every winged bird according to its kind. And God saw that it was good. [Genesis 1:21]
- And God blessed them, saying, “Be fruitful and multiply, and fill the waters in the seas, and let birds multiply on the earth.” [Genesis 1:22]
- Evening is coming. Press and hold the handle to wind the great wheel round.
- So the evening and the morning were the fifth day. [Genesis 1:23]

### Creation, day 6

- Every animal is to be according to its kind. But these are all mixed up! Click any two parts, or carry one onto another, and they change places.
- Find the lion’s head, and put it at the front of one place. Which middle is the same colour? Which back legs? Two are pale: the sheep is woolly all over, and the ox is smooth, with brown patches.
- A man and a woman, to be sewn with one long thread: along every dotted line, and never along the same line twice. Click a hole to begin there.
- Stuck again! Go back to the very beginning, and this time begin at a hole where only one line ends. And sew each part all the way round before the thread leaves it.
- Now click the next hole along a dotted line, and the next. “Go back” pulls the last stitch out again.
- That line is sewn already. The thread goes along each line only once.
- The thread goes along a dotted line, from one hole to the next one on it.
- The thread can go no further, and some lines are still bare. Go back a few stitches and try another way, or all the way back to begin at another hole.
- It is sewn: one thread, all the way round!
- Then God said, “Let the earth bring forth the living creature according to its kind: cattle and creeping thing and beast of the earth, each according to its kind”; and it was so. [Genesis 1:24]
- And God made the beast of the earth according to its kind, cattle according to its kind, and everything that creeps on the earth according to its kind. And God saw that it was good. [Genesis 1:25]
- Then God said, “Let Us make man in Our image, according to Our likeness; let them have dominion over the fish of the sea, over the birds of the air, and over the cattle, over all the earth and over every creeping thing that creeps on the earth.” [Genesis 1:26]
- So God created man in His own image; in the image of God He created him; male and female He created them. [Genesis 1:27]
- Then God saw everything that He had made, and indeed it was very good. [Genesis 1:31]
- Evening is coming. Press and hold the handle to wind the great wheel round.
- So the evening and the morning were the sixth day. [Genesis 1:31]

### Creation, day 7

- Thus the heavens and the earth, and all the host of them, were finished. [Genesis 2:1]
- The seventh day. The work is finished! Click on anything that was made.
- And on the seventh day God ended His work which He had done, and He rested on the seventh day from all His work which He had done. [Genesis 2:2]
- Then God blessed the seventh day and sanctified it, because in it He rested from all His work which God had created and made. [Genesis 2:3]
- Creation / Chapter 2 complete / click to go back to the map

### Noah's Ark, scene 1

- And this is how you shall make it: The length of the ark shall be three hundred cubits, its width fifty cubits, and its height thirty cubits. You shall make a window for the ark, and you shall finish it to a cubit from above; and set the door of the ark in its side. You shall make it with lower, second, and third decks.
- That is as high as it will go. Click it, and I will let out a little rope.
- It is not up by its place yet. Press and hold the windlass, to haul it up.
- It is not level with a place. I will let out a little rope.
- This timber is too long for that deck. See how it sticks out past the frame!
- This timber is too short for that deck. It does not reach the frame at both ends.
- Nothing holds it up there yet! Each deck rests on the one below it: the lower deck comes first.
- The roof goes on last of all, or how would we get the rest in?
- A door in the roof? How would the animals climb up to it! Read the plan again: where does the door go?
- A window down by the keel? The water would pour in! Read the plan again: where does the window go?
- The lower deck is in!
- The second deck!
- And the third deck. Three, as the plan says.
- The door, in its side, as the plan says.
- The window, up under the roof.
- And the roof over it all!
- The rope is fast. Press and hold the windlass, to haul it up. Let go when it hangs level with its place, and click it to set it in.
- Click another part.
- Drive the pegs home! Click to bring the mallet down, when it is over a peg.
- Now the pitch, to keep the water out. Press, and brush it along every gap between the planks.
- Every gap is covered.
- The earth also was corrupt before God, and the earth was filled with violence. [Genesis 6:11]
- But Noah found grace in the eyes of the LORD. [Genesis 6:8]
- I am Noah. God has spoken to me, and this is what He said.
- And God said to Noah, “The end of all flesh has come before Me, for the earth is filled with violence through them; and behold, I will destroy them with the earth. Make yourself an ark of gopherwood; make rooms in the ark, and cover it inside and outside with pitch. [Genesis 6:13–14]
- A flood is coming, over the whole earth. But God has told me how my family will be kept safe through it: in an ark! A great boat, with room for us and for the animals.
- My sons and I have raised its frame. Will you help me build the rest?
- It must be made just as God said. This is His plan for it. [Genesis 6:15–16]
- A cubit is as long as my arm, from the elbow to the fingertips. Three hundred of them: that is a very great boat! [Genesis 6:15–16]
- You can read the plan again whenever you like: click “The plan”, up in the corner.
- The parts lie ready, and there is a rope to haul them up with. Mind the deck timbers: they are cut to three lengths, one for each deck.
- Click a part, and I will make the rope fast to it.
- Every part is in its place! Now my sons and I will close in the sides with planks.
- The planks must be pegged fast. And every gap between them must be covered with pitch, inside and out. Pitch is black and sticky, and it keeps the water out.
- It is done, every cubit of it, just as God said.
- Thus Noah did; according to all that God commanded him, so he did. [Genesis 6:22]

### Noah's Ark, scene 2

- The giraffes are too tall for the door! Click each one, and it will duck its head.
- Now we wait for the tortoises. There is no hurrying a tortoise!
- A tortoise cannot be hurried. It will come in its own time.
- That is as many as will follow me at once. Let us take these to the ramp first.
- Now the great door. It lets down to the ground, and makes a ramp for them to come in by.
- Click the door of the ark, to let it down.
- And of every living thing of all flesh you shall bring two of every sort into the ark, to keep them alive with you; they shall be male and female. [Genesis 6:19]
- Of the birds after their kind, of animals after their kind, and of every creeping thing of the earth after its kind, two of every kind will come to you to keep them alive. [Genesis 6:20]
- Two by two! Some that look alike are not mates. And some mates do not look alike: the lion’s mate has no mane.
- Look! They are coming, just as God said. Two of every kind.
- But what a muddle! Every one has stopped far from its mate: some on this side of the ark, and some on that.
- Click an animal, and it will follow me. Lead them to the foot of the ramp. They are to go in two by two, each with its mate.
- Two by two! These will wait here until their mates come.
- Every kind is aboard, two by two.
- Of clean animals, of animals that are unclean, of birds, and of everything that creeps on the earth, two by two they went into the ark to Noah, male and female, as God had commanded Noah. [Genesis 7:8–9]
- Listen to the thunder! And look how dark the sky has grown. But the rain has not come yet.

### Noah's Ark, scene 3

- The oxen are lowing for their hay. They eat the most of all: they want the stall by the hay.
- The elephants are thirsty. They drink the most of all: they want the stall by the water casks.
- The sheep are looking for the goats. They are one flock, and want to stand side by side.
- The goats are looking for the sheep. They are one flock, and want to stand side by side.
- The ravens beat their wings. Birds want to be by the window: in one of the two stalls right under it.
- The doves beat their wings. Birds want to be by the window: in one of the two stalls right under it.
- The tortoises have pulled in their heads. A tortoise cannot climb a ladder: they belong on the lowest deck.
- Click any pair that fidgets, and it will tell you what it wants. Begin with the great beasts: the hay is at one end of the lowest deck, and the water at the other.
- Every pair needs a room that suits it. Click a pair to hear what it wants. Click two stalls, and they change places.
- The giraffes can stand nowhere else: only this stall is tall enough for them.
- The [animals]. They weigh [number].
- There is no room for the [animals] under the roof. Only the smallest fit up there.
- The [animals] are too heavy for the upper decks. The great beasts must stand on the lowest.
- Nearly there: one pair still fidgets. Click it to hear what it wants.
- Not everyone is content yet: [number] pairs still fidget. Click one to hear what it wants.
- Every pair has a room that suits it, and the ark stands level.
- And you shall take for yourself of all food that is eaten, and you shall gather it to yourself; and it shall be food for you and for them.” [Genesis 6:21]
- The food is stowed, and the animals are aboard. But they went in anyhow, and every pair needs a room that suits it.
- Come inside, and help me settle them.
- Then the LORD said to Noah, “Come into the ark, you and all your household, because I have seen that you are righteous before Me in this generation. [Genesis 7:1]
- Come, all of you! My wife; my sons Shem, Ham and Japheth; and their wives.
- And now I go in myself.
- So Noah, with his sons, his wife, and his sons’ wives, went into the ark because of the waters of the flood. [Genesis 7:7]
- Everyone is in. But the great door stands open: it is their ramp, lying on the ground. Click it, to lift it shut.
- It does not move. It is far too heavy. Try again!
- No one can lift it: not from outside, and not from within.
- So those that entered, male and female of all flesh, went in as God had commanded him; and the LORD shut him in. [Genesis 7:16]
- And the rain began.

### Noah's Ark, scene 4

- The storm drives the ark on, among the tops of the drowned mountains. She cannot go through them: move the pointer up and down, and take her round!
- Wild currents! Keep out of them, or they sweep her back. And whole trees are afloat.
- Lightning! A pale ring on the water shows where it will strike. Go round every ring: if she is struck, she is driven back to here.
- She is held against a mountain top. Take her round it: up, or down.
- A great tree lies across her way. Take her round it.
- The current sweeps her back! Go round it.
- Struck by lightning! She is driven back. Go round the pale rings.
- Rocks and wild water, great trees and lightning: and not one plank of her is broken. God kept them all safe.
- In the six hundredth year of Noah’s life, in the second month, the seventeenth day of the month, on that day all the fountains of the great deep were broken up, and the windows of heaven were opened. [Genesis 7:11]
- The waters rise.
- Now the flood was on the earth forty days. The waters increased and lifted up the ark, and it rose high above the earth. [Genesis 7:17]

### Noah's Ark, scene 5

- Night is coming. Look well where every pair has its room. Then click, to put out the lamp.
- Thunder! The [animals] are frightened. Where are they? Click their stall, to take the lamp to them.
- No: here are the [animals], fast asleep. Listen for the [animals]!
- No: this stall is empty. Listen for the [animals]!
- There they are. Hush now: you are safe in the ark.
- Inside the ark everyone is dry, and safe. But the storm is loud, and the nights are long.
- Morning! One day gone: a mark on the wall for it.
- Morning again. Two days. And still it rains.
- Day after day, and night after night…
- Forty days, and forty nights.
- And the rain was on the earth forty days and forty nights. [Genesis 7:12]

### Noah's Ark, scene 6

- She only stops when she bumps into a mountain, or the edge. Which mountain would stop her at the circle?
- She is in the circle!
- The waters prevailed and greatly increased on the earth, and the ark moved about on the surface of the waters. [Genesis 7:18]
- The ark has no sail, and no rudder. The waters carry her, where God wills.
- Get the ark to the circle! Click an arrow to push her that way. She cannot stop by herself: she goes on until she bumps into a mountain, or the edge.
- Get the ark to the circle again. She only stops at a mountain, or the edge: use the mountains to stop her where you want her.
- And the waters prevailed on the earth one hundred and fifty days. [Genesis 7:24]
- Then God remembered Noah, and every living thing, and all the animals that were with him in the ark. And God made a wind to pass over the earth, and the waters subsided. [Genesis 8:1]
- The waters are going down. The circle is over the mountains of Ararat. Get the ark there!
- The waters go down…
- Then the ark rested in the seventh month, the seventeenth day of the month, on the mountains of Ararat. [Genesis 8:4]

### Noah's Ark, scene 7

- This is a palm tree: its leaves are great fans. Not the olive. Try another tree!
- This is a fig tree: its leaves are broad, like hands. Not the olive. Try another tree!
- He waited yet another seven days.
- So it came to pass, at the end of forty days, that Noah opened the window of the ark which he had made. [Genesis 8:6]
- The ark rests on the mountain, and there is water all round it. Click the ark, to open its window.
- Then he sent out a raven, which kept going to and fro until the waters had dried up from the earth. [Genesis 8:7]
- He also sent out from himself a dove, to see if the waters had receded from the face of the ground. [Genesis 8:8]
- Only water here. She cannot rest on water! Try somewhere else.
- Water here too. Try once more, further off.
- Water, as far as she can see. There is nowhere to rest: bring her home. Click the window of the ark.
- Now the dove, at the window. Click her, to send her out. She will follow your pointer: click where she should try to come down.
- She is back at the window. But she has not looked far yet: click her, and send her out over the water.
- But the dove found no resting place for the sole of her foot, and she returned into the ark to him, for the waters were on the face of the whole earth. So he put out his hand and took her, and drew her into the ark to himself. [Genesis 8:9]
- And he waited yet another seven days, and again he sent the dove out from the ark. [Genesis 8:10]
- The waters have gone down, and three treetops stand out of them. One is an olive tree. Click the dove to send her out, then click a treetop.
- The olive tree! Its leaves are small and narrow. She plucks one. Now bring her home with it: click the window of the ark.
- She is back at the window, with nothing. Click her, and send her to a treetop.
- Not here: this is water. Bring her home, to the window of the ark.
- Only water there. Click a treetop!
- Then the dove came to him in the evening, and behold, a freshly plucked olive leaf was in her mouth; and Noah knew that the waters had receded from the earth. [Genesis 8:11]
- The ground is drying, and green again. Send her out once more, and let her come down wherever you like.
- She is at the window again. Click her: there is dry ground for her now.
- She has found a place of her own, and she stays.
- So he waited yet another seven days and sent out the dove, which did not return again to him anymore. [Genesis 8:12]

### Noah's Ark, scene 8

- A wall is strong when every stone lies across the gap between two stones beneath it. No gap may stand right over another.
- Stuck? A stone with nothing on it can be taken off again. Try two long stones for the lowest course, and then a middling one to begin the next.
- Help Noah build the altar: three courses of stone, each as wide as the place marked. Carry a stone to where it should lie.
- Another stone rests on that one. Take the upper one off first.
- It would stick out past the side of the altar.
- There is a stone there already.
- Nothing is under it there. A stone must rest on stones.
- A gap would stand right over a gap, and the altar would split there. Every stone must lie across a gap.
- The altar is built.
- Then God spoke to Noah, saying, “Go out of the ark, you and your wife, and your sons and your sons’ wives with you. [Genesis 8:15–16]
- The ground is dry. Click the ark, and let them out, two by two!
- And last of all…
- So Noah went out, and his sons and his wife and his sons’ wives with him. Every animal, every creeping thing, every bird, and whatever creeps on the earth, according to their families, went out of the ark. [Genesis 8:18–19]
- Then Noah built an altar to the LORD, and took of every clean animal and of every clean bird, and offered burnt offerings on the altar. [Genesis 8:20]
- “While the earth remains, / Seedtime and harvest, / Cold and heat, / Winter and summer, / And day and night / Shall not cease.” [Genesis 8:22]
- So God blessed Noah and his sons, and said to them: “Be fruitful and multiply, and fill the earth. [Genesis 9:1]
- Thus I establish My covenant with you: Never again shall all flesh be cut off by the waters of the flood; never again shall there be a flood to destroy the earth.” [Genesis 9:11]
- But look: a cloud comes over the earth again. And rain!
- And God said: “This is the sign of the covenant which I make between Me and you, and every living creature that is with you, for perpetual generations: I set My rainbow in the cloud, and it shall be for the sign of the covenant between Me and the earth. [Genesis 9:12–13]
- Set the bow in the cloud! Press on the ring, and sweep right over the sky, all the way down to the other side.
- The rainbow shall be in the cloud, and I will look on it to remember the everlasting covenant between God and every living creature of all flesh that is on the earth.” [Genesis 9:16]
- And they went out, two by two, to fill the earth.
- Noah’s Ark / Chapter 3 complete / click to go back to the map
