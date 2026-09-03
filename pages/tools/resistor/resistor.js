// 色环颜色定义
const DIGITS = [
  { name: '黑', value: 0, sub: '0', color: '#1a1a1a' },
  { name: '棕', value: 1, sub: '1', color: '#8B4513' },
  { name: '红', value: 2, sub: '2', color: '#E53935' },
  { name: '橙', value: 3, sub: '3', color: '#FB8C00' },
  { name: '黄', value: 4, sub: '4', color: '#FDD835' },
  { name: '绿', value: 5, sub: '5', color: '#43A047' },
  { name: '蓝', value: 6, sub: '6', color: '#1E88E5' },
  { name: '紫', value: 7, sub: '7', color: '#8E24AA' },
  { name: '灰', value: 8, sub: '8', color: '#9E9E9E' },
  { name: '白', value: 9, sub: '9', color: '#FFFFFF' }
];

const MULTIPLIERS = [
  { name: '黑', value: 1, sub: '×1', color: '#1a1a1a' },
  { name: '棕', value: 10, sub: '×10', color: '#8B4513' },
  { name: '红', value: 100, sub: '×100', color: '#E53935' },
  { name: '橙', value: 1e3, sub: '×1k', color: '#FB8C00' },
  { name: '黄', value: 1e4, sub: '×10k', color: '#FDD835' },
  { name: '绿', value: 1e5, sub: '×100k', color: '#43A047' },
  { name: '蓝', value: 1e6, sub: '×1M', color: '#1E88E5' },
  { name: '紫', value: 1e7, sub: '×10M', color: '#8E24AA' },
  { name: '灰', value: 1e8, sub: '×100M', color: '#9E9E9E' },
  { name: '白', value: 1e9, sub: '×1G', color: '#FFFFFF' },
  { name: '金', value: 0.1, sub: '×0.1', color: '#D4AF37' },
  { name: '银', value: 0.01, sub: '×0.01', color: '#C0C0C0' }
];

const TOLERANCES = [
  { name: '棕', value: '±1%', sub: '±1%', color: '#8B4513' },
  { name: '红', value: '±2%', sub: '±2%', color: '#E53935' },
  { name: '绿', value: '±0.5%', sub: '±0.5%', color: '#43A047' },
  { name: '蓝', value: '±0.25%', sub: '±0.25%', color: '#1E88E5' },
  { name: '紫', value: '±0.1%', sub: '±0.1%', color: '#8E24AA' },
  { name: '金', value: '±5%', sub: '±5%', color: '#D4AF37' },
  { name: '银', value: '±10%', sub: '±10%', color: '#C0C0C0' }
];

const TEMPCOS = [
  { name: '棕', value: '100ppm/K', sub: '100', color: '#8B4513' },
  { name: '红', value: '50ppm/K', sub: '50', color: '#E53935' },
  { name: '橙', value: '15ppm/K', sub: '15', color: '#FB8C00' },
  { name: '黄', value: '25ppm/K', sub: '25', color: '#FDD835' },
  { name: '蓝', value: '10ppm/K', sub: '10', color: '#1E88E5' },
  { name: '紫', value: '5ppm/K', sub: '5', color: '#8E24AA' }
];

// 默认示例：4环=黄紫红金 5环=棕黑黑红棕 6环=棕黑黑红棕棕
const DEFAULTS = {
  4: [4, 7, 2, 5],
  5: [1, 0, 0, 2, 0],
  6: [1, 0, 0, 2, 0, 0]
};

function fmtRes(v) {
  let unit;
  let val;
  if (v >= 1e9) { unit = 'GΩ'; val = v / 1e9; }
  else if (v >= 1e6) { unit = 'MΩ'; val = v / 1e6; }
  else if (v >= 1e3) { unit = 'kΩ'; val = v / 1e3; }
  else if (v >= 1) { unit = 'Ω'; val = v; }
  else { unit = 'mΩ'; val = v * 1000; }
  val = Math.round(val * 100) / 100;
  let s = String(val);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s + unit;
}

Page({
  data: {
    bandCount: 4,
    config: [],
    bands: [],      // 电阻可视化色带
    resultText: '',
    resultDetail: ''
  },

  onLoad() {
    this.applyCount(4);
  },

  setCount(e) {
    this.applyCount(Number(e.currentTarget.dataset.count));
  },

  applyCount(count) {
    const digitCount = count === 4 ? 2 : 3;
    const defaults = DEFAULTS[count];
    const config = [];
    for (let i = 0; i < digitCount; i++) {
      config.push({
        key: 'd' + i,
        label: '第' + (i + 1) + '环',
        role: '数字',
        colors: DIGITS,
        selected: defaults[i]
      });
    }
    config.push({
      key: 'm',
      label: '第' + (digitCount + 1) + '环',
      role: '倍率',
      colors: MULTIPLIERS,
      selected: defaults[digitCount]
    });
    config.push({
      key: 't',
      label: '第' + (digitCount + 2) + '环',
      role: '精度',
      colors: TOLERANCES,
      selected: defaults[digitCount + 1]
    });
    if (count === 6) {
      config.push({
        key: 'tc',
        label: '第6环',
        role: '温度系数',
        colors: TEMPCOS,
        selected: defaults[5]
      });
    }
    this.setData({ bandCount: count, config });
    this.compute();
  },

  selectColor(e) {
    const { bindex, cindex } = e.currentTarget.dataset;
    const key = 'config[' + bindex + '].selected';
    this.setData({ [key]: cindex });
    this.compute();
  },

  compute() {
    const config = this.data.config;
    const digitCount = this.data.bandCount === 4 ? 2 : 3;
    const bands = config.map((c) => ({
      color: c.selected >= 0 ? c.colors[c.selected].color : '#e8e8e8'
    }));

    for (const c of config) {
      if (c.selected < 0) {
        this.setData({ bands, resultText: '请选择颜色', resultDetail: '' });
        return;
      }
    }

    let digits = 0;
    const digitVals = [];
    for (let i = 0; i < digitCount; i++) {
      const v = config[i].colors[config[i].selected].value;
      digitVals.push(v);
      digits = digits * 10 + v;
    }
    const multCfg = config[digitCount];
    const mult = multCfg.colors[multCfg.selected];
    const tolCfg = config[digitCount + 1];
    const tol = tolCfg.colors[tolCfg.selected];
    const resistance = digits * mult.value;

    let detail = digitVals.join('') + ' × ' + mult.sub + '  ' + tol.value;
    let text = fmtRes(resistance) + '  ' + tol.value;
    if (this.data.bandCount === 6) {
      const tcCfg = config[digitCount + 2];
      const tc = tcCfg.colors[tcCfg.selected];
      text += '  ' + tc.value;
      detail += '  ' + tc.value;
    }
    this.setData({ bands, resultText: text, resultDetail: detail });
  }
});
