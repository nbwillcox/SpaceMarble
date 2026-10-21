/* How far does a launch ramp throw the marble?  node tests/jump.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
global.window = global; global.location = { search: '' };
global.localStorage = { getItem() { return null; }, setItem() {} };
global.matchMedia = () => ({ matches: false });
const dir = path.join(__dirname, '..', 'js');
for (const f of ['util', 'config', 'world', 'builder', 'sim', 'levels']) vm.runInThisContext(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'), { filename: f + '.js' });
const G = global.SGS, S = G.C.S;
function trial(approachDz, approachLen, rise, rampLen, gap, landDz) {
  const b = new G.Builder({});
  b.setPos(0, 0.5, 0, 12); b.width(3);
  b.strip(6, { w: 3, surf: S.START, capStart: true });
  b.start = b.on(2, 0);
  b.strip(approachLen, { dz: approachDz });
  b.strip(rampLen, { dz: rise });
  b.gap(gap, landDz);
  b.strip(10, { capEnd: true });
  b.strip(3, { surf: S.GOAL, capEnd: true });
  for (const c of b.segCells(0, 3, -9, 9)) b.goalCells.push(c);
  const lv = b.finish({ time: 99, seed: 1 });
  const sim = new G.Sim(lv, { god: true });
  sim.start(); sim.bot = true;
  let ticks = 0, peakv = 0;
  while (ticks < 120 * 30 && sim.state === 'play') { sim.step(1 / 120, {}); ticks++; peakv = Math.max(peakv, Math.hypot(sim.m.vx, sim.m.vy)); }
  return { ok: sim.state === 'finish' && sim.falls === 0, peakv: +peakv.toFixed(1) };
}
const args = process.argv.slice(2);
if (args[0]) G.C.FRIC = +args[0];
console.log('FRIC', G.C.FRIC, 'ACC', G.C.ACC);
for (const [dz, len, rise, rl, ld] of [[-3, 10, 0.9, 3, 0], [-3, 10, 1.2, 3, -0.6], [-4, 12, 1.2, 3, -0.8], [-4, 12, 1.5, 3, -1.0], [-5, 14, 1.5, 3, -1.2], [-5, 14, 1.8, 3, -1.5]]) {
  let max = 0, pv = 0;
  for (let gap = 2; gap <= 12; gap++) { const r = trial(dz, len, rise, rl, gap, ld); pv = r.peakv; if (r.ok) max = gap; }
  console.log('approach', dz + '/' + len, 'launch rise', rise + '/' + rl, 'landing', ld, '=> biggest gap', max, 'peak v', pv);
}
