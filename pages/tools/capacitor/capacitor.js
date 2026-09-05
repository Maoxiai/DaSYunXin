function parseCap(s, unit) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  if (!m) return null;
  const mul = { pf: 1e-12, nf: 1e-9, uf: 1e-6 }[unit];
  return parseFloat(m[1]) * mul;
}

function fmtCap(f) {
  let val;
  let unit;
  if (f >= 1e-3) { val = f * 1e3; unit = 'mF'; }
  else if (f >= 1e-6) { val = f * 1e6; unit = 'μF'; }
  else if (f >= 1e-9) { val = f * 1e9; unit = 'nF'; }
  else { val = f * 1e12; unit = 'pF'; }
  val = Math.round(val * 100) / 100;
  let s = String(val);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s + ' ' + unit;
}

Page({
  data: {
    mode: 'parallel', // parallel 并联 | series 串联
    c1: '',
    c1unit: 'nf',
    c2: '',
    c2unit: 'nf',
    result: '',
    detail: '',
    error: ''
  },

  setMode(e) { this.setData({ mode: e.currentTarget.dataset.mode }); this.compute(); },
  onC1(e) { this.setData({ c1: e.detail.value }); this.compute(); },
  onC2(e) { this.setData({ c2: e.detail.value }); this.compute(); },
  setC1Unit(e) { this.setData({ c1unit: e.currentTarget.dataset.unit }); this.compute(); },
  setC2Unit(e) { this.setData({ c2unit: e.currentTarget.dataset.unit }); this.compute(); },

  compute() {
    this.setData({ result: '', detail: '', error: '' });
    const s1 = this.data.c1;
    const s2 = this.data.c2;
    if (!s1.trim() || !s2.trim()) return;
    const c1 = parseCap(s1, this.data.c1unit);
    const c2 = parseCap(s2, this.data.c2unit);
    if (c1 === null || c2 === null) {
      this.setData({ error: '电容数值格式不正确' });
      return;
    }
    if (c1 <= 0 || c2 <= 0) {
      this.setData({ error: '电容值需大于 0' });
      return;
    }
    if (this.data.mode === 'parallel') {
      this.setData({
        result: fmtCap(c1 + c2),
        detail: '并联：C = C1 + C2'
      });
    } else {
      this.setData({
        result: fmtCap(c1 * c2 / (c1 + c2)),
        detail: '串联：C = C1 × C2 / (C1 + C2)'
      });
    }
  }
});
