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
  if (hz >= 1e9) { val = hz / 1e9; unit = 'GHz'; }
  else if (hz >= 1e6) { val = hz / 1e6; unit = 'MHz'; }
  else if (hz >= 1e3) { val = hz / 1e3; unit = 'kHz'; }
  else { val = hz; unit = 'Hz'; }
  return sig(val) + ' ' + unit;
}

const FREQ_UNITS = { hz: 1, khz: 1e3, mhz: 1e6, ghz: 1e9 };
const TIME_UNITS = { s: 1, ms: 1e-3, us: 1e-6, ns: 1e-9 };
const BAUD_PRESETS = [9600, 57600, 115200, 460800, 921600];

Page({
  data: {
    // 功率换算
    powerDir: 'toMw', // toMw: dBm→mW; toDbm: mW→dBm
    powerVal: '30',
    powerMain: '',
    powerSub: '',
    // 频率/周期
    timeMode: 'freq', // freq: 输入频率求周期; period: 输入周期求频率
    timeVal: '1000',
    freqUnit: 'mhz',
    timeUnit: 'us',
    timeResult: '',
    timeResultLabel: '',
    // 波特率
    baud: '115200',
    baudByte: '',
    baudKb: '',
    baudPresets: BAUD_PRESETS
  },

  onLoad() {
    this.computePower();
    this.computeTime();
    this.computeBaud();
  },

  // ============ 功率换算 ============
  setPowerDir(e) {
    this.setData({ powerDir: e.currentTarget.dataset.dir, powerMain: '', powerSub: '' });
    this.computePower();
  },

  onPowerInput(e) {
    this.setData({ powerVal: e.detail.value });
    this.computePower();
  },

  computePower() {
    const v = parseFloat(this.data.powerVal);
    if (isNaN(v)) {
      this.setData({ powerMain: '', powerSub: '' });
      return;
    }
    if (this.data.powerDir === 'toMw') {
      const mw = Math.pow(10, v / 10);
      let main = sig(mw) + ' mW';
      let sub = '';
      if (mw >= 1) sub = '即 ' + sig(mw / 1000) + ' W';
      else sub = '即 ' + sig(mw * 1000) + ' μW';
      this.setData({ powerMain: main, powerSub: sub });
    } else {
      if (v <= 0) {
        this.setData({ powerMain: '', powerSub: '功率必须大于 0' });
        return;
      }
      const dbm = 10 * Math.log10(v);
      this.setData({ powerMain: sig(dbm) + ' dBm', powerSub: '' });
    }
  },

  // ============ 频率/周期 ============
  setTimeMode(e) {
    this.setData({ timeMode: e.currentTarget.dataset.mode, timeResult: '' });
    this.computeTime();
  },

  onTimeValInput(e) {
    this.setData({ timeVal: e.detail.value });
    this.computeTime();
  },

  setFreqUnit(e) {
    this.setData({ freqUnit: e.currentTarget.dataset.unit });
    this.computeTime();
  },

  setTimeUnit(e) {
    this.setData({ timeUnit: e.currentTarget.dataset.unit });
    this.computeTime();
  },

  computeTime() {
    const v = parseFloat(this.data.timeVal);
    if (isNaN(v) || v <= 0) {
      this.setData({ timeResult: '', timeResultLabel: '' });
      return;
    }
    if (this.data.timeMode === 'freq') {
      const hz = v * FREQ_UNITS[this.data.freqUnit];
      this.setData({ timeResult: fmtTime(1 / hz), timeResultLabel: '对应周期 T' });
    } else {
      const sec = v * TIME_UNITS[this.data.timeUnit];
      this.setData({ timeResult: fmtFreq(1 / sec), timeResultLabel: '对应频率 f' });
    }
  },

  // ============ 波特率 ============
  onBaudInput(e) {
    this.setData({ baud: e.detail.value });
    this.computeBaud();
  },

  setBaudPreset(e) {
    this.setData({ baud: String(e.currentTarget.dataset.value) });
    this.computeBaud();
  },

  computeBaud() {
    const b = parseFloat(this.data.baud);
    if (isNaN(b) || b <= 0) {
      this.setData({ baudByte: '', baudKb: '' });
      return;
    }
    // 1 字节 = 10 位（起始 + 8 数据 + 停止）
    this.setData({
      baudByte: fmtTime(10 / b),
      baudKb: fmtTime(10240 / b)
    });
  }
});
