/* ASCII top-down map of a level: node tests/map.js 1 [x0 y0 x1 y1]. Digits = height (0-9, tenths of the max), letters mark surfaces, # = rail edge side. */
const fs = require('fs'), path = require('path'), vm = require('vm');
global.window = global; global.location = { search: '' };
global.localStorage = { getItem() { return null; }, setItem() {} };
global.matchMedia = () => ({ matches: false });
const dir = path.join(__dirname, '..', 'js');
for (const f of ['util', 'config', 'world', 'builder', 'sim', 'levels']) vm.runInThisContext(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'), { filename: f + '.js' });
const G = global.SGS, id = +process.argv[2] || 1;
const lv = G.LEVELS.find((l) => l.id === id).build(), W = lv.world;
const [a, b, c, d] = process.argv.slice(3).map(Number);
const x0 = a || 0, y0 = b || 0, x1 = c || W.w - 1, y1 = d || W.d - 1;
const sym = { 0: '.', 1: 'i', 2: 'g', 3: '>', 4: '=', 5: 'a', 6: 'c', 7: 'b', 8: 'G', 9: 'S', 10: 'o' };
const pathAt = new Map(lv.path.map((p, i) => [Math.floor(p.x) + ',' + Math.floor(p.y), i]));
let out = '    ' + Array.from({ length: x1 - x0 + 1 }, (_, i) => String((x0 + i) % 10)).join('') + '\n';
for (let y = y0; y <= y1; y++) {
  let row = String(y).padStart(3) + ' ';
  for (let x = x0; x <= x1; x++) {
    const i = W.idx(x, y);
    if (i < 0 || !W.kind[i]) { row += ' '; continue; }
    const h = Math.max(0, Math.min(9, Math.round((W.hz[i] - W.zmin) / Math.max(1, W.zmax - W.zmin) * 9)));
    row += pathAt.has(x + ',' + y) && process.argv.includes('--path') ? '*' : W.surf[i] ? sym[W.surf[i]] : String(h);
  }
  out += row + '\n';
}
console.log(out);
console.log('size', W.w, W.d, 'z', W.zmin.toFixed(1), W.zmax.toFixed(1), 'start', lv.start.x.toFixed(1), lv.start.y.toFixed(1));
