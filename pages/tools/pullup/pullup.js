function parseNum(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  return m ? parseFloat(m[1]) : null;
}

function parseCap(s, unit) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  if (!m) return null;
  const mul = { pf: 1e-12, nf: 1e-9 }[unit];
  return parseFloat(m[1]) * mul;
}

function fmtRes(v) {
  let unit;
  let val;
  if (v >= 1e6) { unit = 'MΩ'; val = v / 1e6; }
  else if (v >= 1e3) { unit = 'kΩ'; val = v / 1e3; }
  else { unit = 'Ω'; val = v; }
  val = Math.round(val * 10) / 10;
  let s = String(val);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s + unit;
}

// 常见标准电阻值，用于推荐
const STD_RES = [1000, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200, 10000];

Page({
  data: {
    vdd: '3.3',
    cap: '100',
    capUnit: 'pf',
    speed: 'fast', // fast 400k | standard 100k
    rpMin: '',
    rpMax: '',
    recommend: '',
    error: ''
  },

  onVdd(e) { this.setData({ vdd: e.detail.value }); this.compute(); },
  onCap(e) { this.setData({ cap: e.detail.value }); this.compute(); },
  setCapUnit(e) { this.setData({ capUnit: e.currentTarget.dataset.unit }); this.compute(); },
  setSpeed(e) { this.setData({ speed: e.currentTarget.dataset.speed }); this.compute(); },

  compute() {
    this.setData({ rpMin: '', rpMax: '', recommend: '', error: '' });
    const vdd = parseNum(this.data.vdd);
    const cbus = parseCap(this.data.cap, this.data.capUnit);
    if (vdd === null || vdd <= 0) { this.setData({ error: '电源电压需大于 0' }); return; }
    if (cbus === null || cbus <= 0) { this.setData({ error: '总线电容需大于 0' }); return; }

    const vol = 0.4;   // 低电平最大电压
    const iol = 0.003; // 最大灌电流 3mA
    const rpMin = (vdd - vol) / iol;
    const tr = this.data.speed === 'fast' ? 300e-9 : 1000e-9; // 上升时间
    const rpMax = tr / (0.8473 * cbus);

    // 从标准值中选落在范围内的
    const inRange = STD_RES.filter((r) => r >= rpMin && r <= rpMax);
    let recommend = '';
    if (inRange.length > 0) {
      // 选接近几何中间的值
      const mid = Math.sqrt(rpMin * rpMax);
      let best = inRange[0];
      for (const r of inRange) {
        if (Math.abs(r - mid) < Math.abs(best - mid)) best = r;
      }
      recommend = fmtRes(best);
    }

    this.setData({
      rpMin: fmtRes(rpMin),
      rpMax: fmtRes(rpMax),
      recommend: recommend
    });
  },

  onLoad() {
    this.compute();
  }
});
