// E24 标准阻值系列（1% / 5% 精度常用）
const E24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];

// 取不小于 r 的最小 E24 标准阻值（保证实际电流不超过目标）
function nextE24(r) {
  if (r <= 1) return 1;
  let decade = 1;
  while (r / decade >= 10) decade *= 10;
  const norm = r / decade;
  for (const v of E24) {
    if (v >= norm - 1e-9) {
      let val = v * decade;
      // 修整浮点尾数
      val = Math.round(val * 100) / 100;
      return val;
    }
  }
  return 10 * decade;
}

function fmtRes(v) {
  let unit;
  let val;
  if (v >= 1e6) { unit = 'MΩ'; val = v / 1e6; }
  else if (v >= 1e3) { unit = 'kΩ'; val = v / 1e3; }
  else { unit = 'Ω'; val = v; }
  val = Math.round(val * 100) / 100;
  let s = String(val);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s + unit;
}

// 常见 LED 正向压降预设（V）
const VF_PRESETS = [
  { name: '红 2.0', v: '2.0' },
  { name: '黄 2.1', v: '2.1' },
  { name: '绿 2.2', v: '2.2' },
  { name: '蓝 3.0', v: '3.0' },
  { name: '白 3.3', v: '3.3' }
];

Page({
  data: {
    vs: '5',
    vf: '2.0',
    i: '10',
    vfPresets: VF_PRESETS,
    result: null,
    error: ''
  },

  onField(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
    this.compute();
  },

  setVf(e) {
    this.setData({ vf: e.currentTarget.dataset.v });
    this.compute();
  },

  setCurrent(e) {
    this.setData({ i: e.currentTarget.dataset.i });
    this.compute();
  },

  compute() {
    this.setData({ result: null, error: '' });
    const vs = parseFloat(this.data.vs);
    const vf = parseFloat(this.data.vf);
    const i = parseFloat(this.data.i); // mA
    if (isNaN(vs) || isNaN(vf) || isNaN(i)) return;
    if (i <= 0) {
      this.setData({ error: '电流需大于 0（常用 5~20mA）' });
      return;
    }
    if (vs <= vf) {
      this.setData({ error: '电源电压需大于 LED 正向压降（当前 ' + vs + 'V ≤ ' + vf + 'V）' });
      return;
    }

    const rIdeal = (vs - vf) / (i / 1000);
    const rStd = nextE24(rIdeal);
    const iStd = (vs - vf) / rStd * 1000;         // mA
    const pRes = (vs - vf) * (vs - vf) / rStd;     // W，电阻消耗
    const pLed = vf * iStd / 1000;                 // W，LED消耗

    this.setData({
      result: {
        rIdeal: fmtRes(rIdeal),
        rStd: fmtRes(rStd),
        iStd: (Math.round(iStd * 100) / 100) + ' mA',
        pRes: pRes >= 0.1 ? (Math.round(pRes * 1000) / 1000) + ' W' : (Math.round(pRes * 1e6) / 1000) + ' mW',
        pLed: (Math.round(pLed * 1000) / 1000) + ' W',
        hint: pRes * 2 <= 0.125 ? '0805 (1/8W) 贴片可用' : pRes * 2 <= 0.25 ? '建议 1/4W 及以上封装' : '功率偏大，建议用恒流驱动'
      }
    });
  },

  onLoad() {
    this.compute();
  }
});
