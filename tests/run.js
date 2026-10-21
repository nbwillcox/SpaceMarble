/* Headless bot test: node tests/run.js [level] [--god] [--verbose]. Loads the DOM-free modules and runs the autopilot over each level. */
const fs = require('fs'), path = require('path'), vm = require('vm');
global.window = global; global.location = { search: '' };
global.localStorage = { getItem() { return null; }, setItem() {} };
global.matchMedia = () => ({ matches: false });
const dir = path.join(__dirname, '..', 'js');
for (const f of ['util', 'config', 'world', 'builder', 'sim', 'levels']) vm.runInThisContext(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'), { filename: f + '.js' });
const G = global.SGS;
const args = process.argv.slice(2), god = args.includes('--god'), verbose = args.includes('--verbose');
const only = args.find((a) => /^\d+$/.test(a));
G.debug.bot = true;

for (const lv of G.LEVELS) {
  if (only && String(lv.id) !== only) continue;
  const level = lv.build();
  const sim = new G.Sim(level, { god });
  sim.start();
  const dt = 1 / 120;
  let ticks = 0, lastLog = 0, maxSpeed = 0, evCount = {}, stuck = 0, lastPi = 0;
  while (ticks < 120 * 240 && sim.state === 'play') {
    sim.step(dt, { wx: 0, wy: 0 });
    ticks++;
    for (const e of sim.events) { evCount[e.type + (e.type === 'shatter' ? ':' + e.cause : '')] = (evCount[e.type + (e.type === 'shatter' ? ':' + e.cause : '')] || 0) + 1; if (verbose && ['shatter', 'fall', 'crack', 'land', 'tilebreak', 'foeDie'].includes(e.type)) console.log('  t=' + (ticks / 120).toFixed(2), e.type, JSON.stringify(e, (k, v) => typeof v === 'number' ? +v.toFixed(2) : v)); }
    maxSpeed = Math.max(maxSpeed, Math.hypot(sim.m.vx, sim.m.vy));
    if (verbose && ticks - lastLog >= 120) { lastLog = ticks; console.log('  ' + (ticks / 120).toFixed(0) + 's pi=' + sim.pi + '/' + level.path.length + ' pos=' + sim.m.x.toFixed(1) + ',' + sim.m.y.toFixed(1) + ',' + sim.m.z.toFixed(1) + ' v=' + Math.hypot(sim.m.vx, sim.m.vy).toFixed(1)); }
  }
  const t = ticks / 120;
  console.log('L' + level.id + ' ' + level.name + ': ' + (sim.state === 'finish' ? 'FINISH' : sim.state.toUpperCase() + ' at path ' + sim.pi + '/' + level.path.length) + ' in ' + t.toFixed(1) + 's (limit ' + level.time + ', par ' + level.par + ') deaths=' + sim.deaths + ' falls=' + sim.falls + ' maxV=' + maxSpeed.toFixed(1) + ' cells=' + level.world.kind.reduce((a, v) => a + v, 0) + ' path=' + level.path.length + ' ' + JSON.stringify(evCount));
}
