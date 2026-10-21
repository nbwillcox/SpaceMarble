/* Chaos test: random steering on every race, checking the physics invariants (no NaN, never embedded in a wall, never stuck forever).  node tests/fuzz.js [seconds] [seed] */
const fs = require('fs'), path = require('path'), vm = require('vm');
global.window = global; global.location = { search: '' };
global.localStorage = { getItem() { return null; }, setItem() {} };
global.matchMedia = () => ({ matches: false });
const dir = path.join(__dirname, '..', 'js');
for (const f of ['util', 'config', 'world', 'builder', 'sim', 'levels']) vm.runInThisContext(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'), { filename: f + '.js' });
const G = global.SGS;
const secs = +process.argv[2] || 120;
let seed = +process.argv[3] || 1;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
let bad = 0;
for (const lv of G.LEVELS) {
  const level = lv.build(), sim = new G.Sim(level, {});
  sim.start();
  let ix = 0, iy = 0, hold = 0, maxV = 0, embedded = 0, nan = 0, stuck = 0, lastPos = [sim.m.x, sim.m.y], stuckT = 0, causes = {}, falls = 0, finished = 0, bumps = 0;
  const dt = 1 / 120;
  for (let t = 0; t < secs * 120; t++) {
    if (hold <= 0) { const a = rnd() * Math.PI * 2, mag = rnd() < 0.15 ? 0 : 0.4 + rnd() * 0.6; ix = Math.cos(a) * mag; iy = Math.sin(a) * mag; hold = 0.2 + rnd() * 1.2; if (rnd() < 0.4) { /* lean towards the course */ const p = level.path[Math.min(level.path.length - 1, sim.pi + 4)]; const wx = p.x - sim.m.x, wy = p.y - sim.m.y, d = Math.hypot(wx, wy) || 1; ix = (wx - wy) / d * 0.7071; iy = (wx + wy) / d * 0.7071; } }
    hold -= dt;
    sim.step(dt, { wx: (ix + iy) * 0.7071, wy: (iy - ix) * 0.7071 });
    const m = sim.m;
    for (const e of sim.events) { if (e.type === 'shatter') causes[e.cause] = (causes[e.cause] || 0) + 1; if (e.type === 'fall') falls++; if (e.type === 'bump') bumps++; }
    if (![m.x, m.y, m.z, m.vx, m.vy, m.vz].every(Number.isFinite)) { nan++; break; }
    maxV = Math.max(maxV, Math.hypot(m.vx, m.vy));
    if (!m.dead && !m.falling) {
      const g = sim.world.heightAt(m.x, m.y);
      if (g > -Infinity && g > m.z + 0.6) embedded++;
    }
    if (sim.state === 'finish') { finished++; sim.state = 'play'; sim.time += 30; const p = level.path[0]; m.x = p.x; m.y = p.y; m.z = sim.world.heightAt(p.x, p.y); m.vx = m.vy = 0; sim.pi = 0; }
    if (sim.state === 'timeup') { sim.state = 'play'; sim.time = 60; }
    if (t % 600 === 0) { const d = Math.hypot(m.x - lastPos[0], m.y - lastPos[1]); stuckT = d < 0.05 && !m.dead && !m.falling ? stuckT + 1 : 0; lastPos = [m.x, m.y]; if (stuckT > 6) stuck++; }
  }
  const flag = nan || embedded > 5 ? '  <-- PROBLEM' : '';
  if (flag) bad++;
  console.log('L' + level.id + ' maxV=' + maxV.toFixed(1) + ' embedded=' + embedded + ' nan=' + nan + ' stuck=' + stuck + ' falls=' + falls + ' bumps=' + bumps + ' finishes=' + finished + ' deaths=' + sim.deaths + ' ' + JSON.stringify(causes) + flag);
}
process.exit(bad ? 1 : 0);
