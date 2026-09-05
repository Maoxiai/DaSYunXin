function parseNum(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  return m ? parseFloat(m[1]) : null;
}

function sig(v) {
  if (v === 0) return '0';
  const r = Number(v.toPrecision(4));
  let s = String(r);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

function fmtFreq(hz) {
  let val;
  let unit;
  if (hz >= 1e6) { val = hz / 1e6; unit = 'MHz'; }
  else if (hz >= 1e3) { val = hz / 1e3; unit = 'kHz'; }
  else { val = hz; unit = 'Hz'; }
  return sig(val) + ' ' + unit;
}

const CLOCK_PRESETS = [16, 48, 64, 72, 84, 168];

Page({
  data: {
    clock: '72',
    psc: '71',
    arr: '999',
    duty: '50',
    clockPresets: CLOCK_PRESETS,
    freq: '',
    resolution: '',
    step: '',
    ccr: '',
    error: ''
  },

  onClock(e) { this.setData({ clock: e.detail.value }); this.compute(); },
  onPsc(e) { this.setData({ psc: e.detail.value }); this.compute(); },
  onArr(e) { this.setData({ arr: e.detail.value }); this.compute(); },
  onDuty(e) { this.setData({ duty: e.detail.value }); this.compute(); },
  setClock(e) { this.setData({ clock: e.currentTarget.dataset.v }); this.compute(); },

  compute() {
    this.setData({ freq: '', resolution: '', step: '', ccr: '', error: '' });
    const clk = parseNum(this.data.clock);
    const psc = parseInt(this.data.psc, 10);
    const arr = parseInt(this.data.arr, 10);
    const duty = parseNum(this.data.duty);

    if (clk === null || clk <= 0) { this.setData({ error: '时钟频率需大于 0' }); return; }
    if (isNaN(psc) || isNaN(arr) || psc < 0 || psc > 65535 || arr < 0 || arr > 65535) {
      this.setData({ error: 'PSC / ARR 取值范围 0 ~ 65535' });
      return;
    }
    if (arr === 0) { this.setData({ error: 'ARR 需大于 0' }); return; }
    if (duty === null || duty < 0 || duty > 100) {
      this.setData({ error: '占空比需为 0 ~ 100%' });
      return;
    }

    const f = clk * 1e6 / ((psc + 1) * (arr + 1));
    const resolution = Math.log2(arr + 1);
    const step = 100 / (arr + 1);
    const ccr = Math.round(duty * (arr + 1) / 100);

    this.setData({
      freq: fmtFreq(f),
      resolution: sig(resolution) + ' bit',
      step: sig(step) + '%',
      ccr: String(ccr)
    });
  },

  onLoad() {
    this.compute();
  }
});
