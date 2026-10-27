# SpaceMarble

A free, original neon isometric marble racer, with a head nod to the classic 80s arcade marble game. You steer a glass marble down six floating space tracks against the clock: down steep ramps, over launch jumps and bridges no wider than a tile, past lasers, crushers, spikes, sweeping bars and crumbling floors, while steel orbs, munchers, acid coils and void vacuums try to crack it.

**Play it in your browser:** https://nbwillcox.github.io/SpaceMarble/

Everything is generated in code: the tiles, marble, traps and creatures are drawn on the fly, and all the sound (including the rolling hiss that follows the marble, the glass cracks and the chiptune tunes) is synthesized with the Web Audio API. There are no image or audio files and no build step. A sibling of [SpaceGalaShooter](https://github.com/nbwillcox/SpaceGalaShooter), [SpaceKong](https://github.com/nbwillcox/SpaceKong), [SpaceQix](https://github.com/nbwillcox/SpaceQix) and the rest of the series.

## Controls

| Action | Keys |
| --- | --- |
| Roll the marble | `←` `↑` `↓` `→` or `W` `A` `S` `D` (a gamepad stick or d-pad works too) |
| Roll towards the pointer | hold the left mouse button |
| Pause | `P` or `Esc` |
| Restart the race | `R` |
| Re-centre the tilt | `C` (or the gamepad's X button) |

Up on the keyboard rolls the marble up the screen, away from you, whatever way the track bends.

### On a phone or tablet

Play in any orientation. Tilt your device to roll the marble (the angle you hold it at when the countdown starts is 'flat'; tap **RECENTER** to reset it), or drag a thumb on the screen if your device has no tilt sensor. On iPhone and iPad, allow motion access when asked. The pause button opens the menu. The on-screen controls appear on touch devices automatically; Settings has size, opacity and a left-handed layout. Use your browser's *Add to Home Screen* to install it as a full-screen app.

### Controller

Plug in a gamepad and it just works: the stick or D-pad rolls the marble, **X** recentres, **Y** restarts, **Start** pauses. In menus the D-pad / left stick moves the highlight, **A** selects, **B** goes back and **Start** plays or resumes. **Settings -> Controller** has a dead-zone slider and lets you remap every button.

## The six races

1. **Practice Race, Launch Deck:** a gentle first run: ramps, a hairpin, a narrow lane and a stair of drops.
2. **Beginner Race, Crystal Reach:** a steel orb gives chase, the floor crumbles under you, and there is your first jump.
3. **Intermediate Race, Frost Foundry:** sheet ice, laser gates, an acid pool, a glass bridge, a muncher, a hydraulic press, a spike plate and an acid coil.
4. **Aerial Race, Skyrail:** three launch jumps, a railless bridge under turret fire, a void vacuum, a mine field and a glass runway.
5. **Silly Race, Pinball Garden:** conveyors, sticky goo, pinball bumpers, a spinning sweeper, opening and closing gates and a trampoline over a collapsing floor.
6. **Ultimate Race, Event Horizon:** all of it at once, with less time on the clock.

Reach the checkered finish pad before the timer runs out. Time you have left is a bonus and is carried over to the next race (up to 25 seconds). Finishing a race unlocks the next one in Race Select.

## Gameplay

- **Speed is the point:** ramps feed the marble speed, and a launch ramp at the end of a drop will throw it across a gap.
- **Cracks:** the marble has three hull segments. A hard landing, an orb or a muncher bite cracks it (you can see the fractures spread), and one more hit shatters it. Falling too far shatters it outright. Lasers, crushers, spikes, mines and vacuums shatter it at once.
- **When it breaks** you respawn a few tiles back on the track, and the clock keeps running.
- **Falling off** the track costs you the time it takes to respawn.
- **Smashing:** hit a steel orb at speed and it shatters instead (+500), and a fast marble flattens a muncher (+750).
- **Pickups:** green time crystals add seconds, gold gems add points.
- **Crumbling tiles** crack and fall when you stand on them, and grow back a few seconds later.
- **Fragile glass** takes a gentle roll but shatters under speed or a hard landing, so ease off the tilt; it re-forms after a few seconds.
- **Acid, ice and goo** burn, slide and drag; **boost strips** and **conveyors** push; **pads** throw you upward; **bumpers** pinball you away.
- **Score:** points for pickups and smashes, 100 per second left on the clock and 1,000 x the race number. Local top-10 high scores and each race's best time are kept in your browser.

## Run it locally

Open `index.html` in a browser, or serve the folder with any static server, for example `python -m http.server`. Test flags: `?level=N` starts on race N (1 to 6), `?god=1` makes the marble immune to everything but still physical, `?at=0.5` drops it half way along the course, `?zoom=2` magnifies the view, `?bot=1` lets the built-in autopilot drive, `?touch=1` forces the touch controls on a desktop.

`node tests/run.js` runs the autopilot over every race with no browser (the physics, traps and enemies are DOM-free), and `node tests/map.js 3` prints a top-down map of a race.

## License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/): free to play, share and remix for non-commercial use, with a link back to https://github.com/nbwillcox/SpaceMarble. SpaceMarble is an original game inspired by the arcade golden age; it uses no art, sounds or code from any commercial game.
