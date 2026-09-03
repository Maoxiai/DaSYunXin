function parseRes(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)\s*([kKmM])?$/);
  if (!m) return null;
  let v = parseFloat(m[1]);
  if (m[2] === 'k' || m[2] === 'K') v *= 1e3;
  if (m[2] === 'M' || m[2] === 'm') v *= 1e6;
  return v;
}

function parseCap(s, unit) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  if (!m) return null;
  const v = parseFloat(m[1]);
  const mul = { pf: 1e-12, nf: 1e-9, uf: 1e-6, mf: 1e-3 }[unit];
  return v * mul; // F
}

function sig(v) {
  if (v === 0) return '0';
  const r = Number(v.toPrecision(4));
  let s = String(r);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

function fmtTime(sec) {
  let val;
  let unit;
  if (sec >= 1) { val = sec; unit = 's'; }
  else if (sec >= 1e-3) { val = sec * 1e3; unit = 'ms'; }
  else if (sec >= 1e-6) { val = sec * 1e6; unit = 'μs'; }
  else { val = sec * 1e9; unit = 'ns'; }
  return sig(val) + ' ' + unit;
}

function fmtFreq(hz) {
  let val;
  let unit;
  if (hz >= 1e6) { val = hz / 1e6; unit = 'MHz'; }
  else if (hz >= 1e3) { val = hz / 1e3; unit = 'kHz'; }
  else { val = hz; unit = 'Hz'; }
  return sig(val) + ' ' + unit;
}

// 充电到各倍数的时间（百分比 = 1 - e^(-n)）
const CHARGE_STEPS = [
  { n: 1, pct: '63.2%' },
  { n: 2, pct: '86.5%' },
  { n: 3, pct: '95.0%' },
  { n: 4, pct: '98.2%' },
  { n: 5, pct: '99.3%' }
];

const CAP_PRESETS = [
  { label: '100nF', v: '100', unit: 'nf' },
  { label: '1μF', v: '1', unit: 'uf' },
  { label: '10μF', v: '10', unit: 'uf' },
  { label: '100μF', v: '100', unit: 'uf' }
];

Page({
  data: {
    r: '10k',
    c: '100',
    capUnit: 'nf',
    capPresets: CAP_PRESETS,
    tau: '',
    steps: [],
    fc: '',
    error: ''
  },

  onLoad() {
    this.compute();
  },

  onR(e) {
    this.setData({ r: e.detail.value });
    this.compute();
  },

  onC(e) {
    this.setData({ c: e.detail.value });
    this.compute();
  },

  setCapUnit(e) {
    this.setData({ capUnit: e.currentTarget.dataset.unit });
    this.compute();
  },

  setCapPreset(e) {
    this.setData({ c: e.currentTarget.dataset.v, capUnit: e.currentTarget.dataset.unit });
    this.compute();
  },

  compute() {
    this.setData({ tau: '', steps: [], fc: '', error: '' });
    const r = parseRes(this.data.r);
    const c = parseCap(this.data.c, this.data.capUnit);
    if (this.data.r.trim() && r === null) {
      this.setData({ error: '电阻格式不正确（支持 470 / 4.7k / 1M）' });
      return;
    }
    if (this.data.c.trim() && c === null) {
      this.setData({ error: '电容数值格式不正确' });
      return;
    }
    if (!r || !c || r <= 0 || c <= 0) return;

    const tau = r * c;
    const steps = CHARGE_STEPS.map((s) => ({
      pct: s.pct,
      time: fmtTime(tau * s.n)
    }));
    const fc = 1 / (2 * Math.PI * r * c);
    this.setData({
      tau: fmtTime(tau),
      steps,
      fc: fmtFreq(fc)
    });
  }
});
