// 电阻输入解析：470 = 470Ω，4.7k = 4.7kΩ，1M = 1MΩ
function parseRes(s) {
  s = (s || '').trim();
  const m2 = s.match(/^(\d+\.?\d*)\s*[mM]$/);
  if (m2) return parseFloat(m2[1]) * 1e6;
  const m = s.match(/^(\d+\.?\d*)\s*([kK])?$/);
  if (!m) return null;
  let v = parseFloat(m[1]);
  if (m[2]) v *= 1e3;
  return v;
}

function parseCap(s, unit) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  if (!m) return null;
  const mul = { pf: 1e-12, nf: 1e-9, uf: 1e-6 }[unit];
  return parseFloat(m[1]) * mul; // F
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

const CAP_PRESETS = [
  { label: '10nF', v: '10', unit: 'nf' },
  { label: '100nF', v: '100', unit: 'nf' },
  { label: '1μF', v: '1', unit: 'uf' },
  { label: '10μF', v: '10', unit: 'uf' }
];

Page({
  data: {
    mode: 'astable', // astable 无稳态 | monostable 单稳态
    // 无稳态：R1、R2、C
    r1: '10k',
    r2: '47k',
    c: '10',
    capUnit: 'nf',
    capPresets: CAP_PRESETS,
    // 单稳态：R、C（复用 c/capUnit）
    r: '100k',
    // 预计算结果
    freq: '',
    period: '',
    tHigh: '',
    tLow: '',
    duty: '',
    pulse: '',
    error: ''
  },

  onLoad() {
    this.compute();
  },

  setMode(e) {
    this.setData({ mode: e.currentTarget.dataset.mode });
    this.compute();
  },

  onR1(e) { this.setData({ r1: e.detail.value }); this.compute(); },
  onR2(e) { this.setData({ r2: e.detail.value }); this.compute(); },
  onR(e) { this.setData({ r: e.detail.value }); this.compute(); },
  onC(e) { this.setData({ c: e.detail.value }); this.compute(); },

  setCapUnit(e) {
    this.setData({ capUnit: e.currentTarget.dataset.unit });
    this.compute();
  },

  setCapPreset(e) {
    this.setData({ c: e.currentTarget.dataset.v, capUnit: e.currentTarget.dataset.unit });
    this.compute();
  },

  compute() {
    this.setData({ freq: '', period: '', tHigh: '', tLow: '', duty: '', pulse: '', error: '' });
    const c = parseCap(this.data.c, this.data.capUnit);

    if (this.data.mode === 'astable') {
      const r1 = parseRes(this.data.r1);
      const r2 = parseRes(this.data.r2);
      if (this.data.r1.trim() && r1 === null) {
        this.setData({ error: 'R1 格式不正确（支持 470 / 4.7k / 1M）' });
        return;
      }
      if (this.data.r2.trim() && r2 === null) {
        this.setData({ error: 'R2 格式不正确（支持 470 / 4.7k / 1M）' });
        return;
      }
      if (this.data.c.trim() && c === null) {
        this.setData({ error: '电容数值格式不正确' });
        return;
      }
      if (!r1 || !r2 || !c || r1 <= 0 || r2 <= 0 || c <= 0) return;

      // 无稳态：T = 0.693 × (R1 + 2R2) × C
      const tHigh = 0.693 * (r1 + r2) * c;
      const tLow = 0.693 * r2 * c;
      const period = tHigh + tLow;
      const freq = 1 / period;
      const duty = (r1 + r2) / (r1 + 2 * r2) * 100;
      this.setData({
        freq: fmtFreq(freq),
        period: fmtTime(period),
        tHigh: fmtTime(tHigh),
        tLow: fmtTime(tLow),
        duty: sig(Math.round(duty * 10) / 10) + '%'
      });
    } else {
      const r = parseRes(this.data.r);
      if (this.data.r.trim() && r === null) {
        this.setData({ error: 'R 格式不正确（支持 470 / 4.7k / 1M）' });
        return;
      }
      if (this.data.c.trim() && c === null) {
        this.setData({ error: '电容数值格式不正确' });
        return;
      }
      if (!r || !c || r <= 0 || c <= 0) return;

      // 单稳态：t = 1.1 × R × C
      const t = 1.1 * r * c;
      this.setData({ pulse: fmtTime(t) });
    }
  }
});
