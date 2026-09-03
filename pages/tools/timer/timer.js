function fmtPeriod(sec) {
  let val;
  let unit;
  if (sec < 1e-3) { val = sec * 1e6; unit = 'μs'; }
  else if (sec < 1) { val = sec * 1e3; unit = 'ms'; }
  else { val = sec; unit = 's'; }
  return sigRound(val) + ' ' + unit;
}

function fmtFreq(hz) {
  let val;
  let unit;
  if (hz >= 1e6) { val = hz / 1e6; unit = 'MHz'; }
  else if (hz >= 1e3) { val = hz / 1e3; unit = 'kHz'; }
  else { val = hz; unit = 'Hz'; }
  return sigRound(val) + ' ' + unit;
}

// 保留 4 位有效数字并去掉多余的 0
function sigRound(v) {
  if (v === 0) return '0';
  const r = Number(v.toPrecision(4));
  let s = String(r);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

const CLOCK_PRESETS = [8, 16, 48, 64, 72, 84, 168];

Page({
  data: {
    mode: 'forward', // forward: 求周期; reverse: 求 PSC/ARR
    clock: '72',
    psc: '71',
    arr: '999',
    period: '',
    freq: '',
    forwardError: '',
    target: '500',
    unit: 'ms', // us | ms | s
    suggestions: [],
    reverseError: ''
  },

  setMode(e) {
    this.setData({ mode: e.currentTarget.dataset.mode });
  },

  setPreset(e) {
    this.setData({ clock: e.currentTarget.dataset.value });
    this.computeForward();
    this.computeReverse();
  },

  onClockInput(e) {
    this.setData({ clock: e.detail.value });
    this.computeForward();
    this.computeReverse();
  },

  onPscInput(e) {
    this.setData({ psc: e.detail.value });
    this.computeForward();
  },

  onArrInput(e) {
    this.setData({ arr: e.detail.value });
    this.computeForward();
  },

  onTargetInput(e) {
    this.setData({ target: e.detail.value });
    this.computeReverse();
  },

  setUnit(e) {
    this.setData({ unit: e.currentTarget.dataset.unit });
    this.computeReverse();
  },

  parseClock() {
    const f = parseFloat(this.data.clock);
    if (isNaN(f) || f <= 0) return null;
    return f * 1e6;
  },

  // 正向：由 PSC/ARR 求周期
  computeForward() {
    this.setData({ period: '', freq: '', forwardError: '' });
    const f = this.parseClock();
    const psc = parseInt(this.data.psc, 10);
    const arr = parseInt(this.data.arr, 10);
    if (!f) {
      this.setData({ forwardError: '请输入有效的定时器时钟频率（MHz）' });
      return;
    }
    if (isNaN(psc) || isNaN(arr) || psc < 0 || psc > 65535 || arr < 0 || arr > 65535) {
      this.setData({ forwardError: 'PSC / ARR 取值范围 0 ~ 65535' });
      return;
    }
    const sec = (psc + 1) * (arr + 1) / f;
    this.setData({ period: fmtPeriod(sec), freq: fmtFreq(1 / sec) });
  },

  // 反向：由目标周期求 PSC/ARR 组合
  computeReverse() {
    this.setData({ suggestions: [], reverseError: '' });
    const f = this.parseClock();
    const t = parseFloat(this.data.target);
    if (!f || isNaN(t) || t <= 0) {
      this.setData({ reverseError: '请输入有效的时钟频率与目标周期' });
      return;
    }
    const unitMul = { us: 1e-6, ms: 1e-3, s: 1 }[this.data.unit];
    const sec = t * unitMul;
    const cycles = f * sec;
    if (cycles < 1) {
      this.setData({ reverseError: '目标周期过短，小于一个时钟周期（' + fmtPeriod(1 / f) + '）' });
      return;
    }
    if (cycles > 65536 * 65536) {
      this.setData({ reverseError: '目标周期过长，超出 16 位定时器最大计时范围，需软件扩展或降低时钟' });
      return;
    }

    const out = [];
    const seen = {};
    const addPsc = (psc) => {
      if (psc < 0 || psc > 65535) return;
      const div = psc + 1;
      let arr = Math.round(cycles / div) - 1;
      if (arr < 0) arr = 0;
      if (arr > 65535) return;
      const actualCycles = div * (arr + 1);
      const err = Math.abs(actualCycles - cycles) / cycles;
      const key = psc + '-' + arr;
      if (!seen[key]) {
        seen[key] = 1;
        out.push({ psc, arr, err, actual: actualCycles });
      }
    };
    // ARR 拉满选项（周期最长方向）
    const minDiv = Math.ceil(cycles / 65536);
    if (minDiv >= 1) addPsc(minDiv - 1);
    // 均衡选项（PSC ≈ ARR ≈ √cycles）
    const sqrtDiv = Math.round(Math.sqrt(cycles));
    for (let d = Math.max(1, sqrtDiv - 8); d <= sqrtDiv + 8; d++) addPsc(d - 1);
    // 短周期选项
    addPsc(0);

    out.sort((a, b) => a.err - b.err);
    const suggestions = out.slice(0, 3).map((s) => ({
      psc: s.psc,
      arr: s.arr,
      period: fmtPeriod(s.actual / f),
      freq: fmtFreq(f / s.actual),
      errText: s.err < 1e-9 ? '精确' : '误差 ' + (Math.round(s.err * 10000) / 100) + '%'
    }));
    this.setData({ suggestions });
  },

  onLoad() {
    this.computeForward();
    this.computeReverse();
  }
});
