function parseNum(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  return m ? parseFloat(m[1]) : null;
}

function sig(v) {
  if (v === 0) return '0';
  const r = Number(v.toPrecision(6));
  let s = String(r);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

// 整数完整显示，小数保留有效数字
function fmtVal(v) {
  if (Number.isInteger(v) && Math.abs(v) < 1e15) return String(v);
  return sig(v);
}

// 各单位换算为 bit 的倍率（基数区分 1024 / 1000）
function buildUnits(base) {
  return {
    bit: 1,
    B: 8,
    KB: 8 * base,
    MB: 8 * base * base,
    GB: 8 * base * base * base,
    TB: 8 * base * base * base * base
  };
}

const UNIT_ORDER = [
  { key: 'bit', label: 'bit' },
  { key: 'B', label: 'B' },
  { key: 'KB', label: 'KB' },
  { key: 'MB', label: 'MB' },
  { key: 'GB', label: 'GB' },
  { key: 'TB', label: 'TB' }
];

Page({
  data: {
    value: '1',
    unit: 'GB',
    base: '1024', // 1024 二进制 | 1000 十进制
    unitOrder: UNIT_ORDER,
    outputs: [],
    error: ''
  },

  onValue(e) { this.setData({ value: e.detail.value }); this.compute(); },
  setUnit(e) { this.setData({ unit: e.currentTarget.dataset.unit }); this.compute(); },
  setBase(e) { this.setData({ base: e.currentTarget.dataset.base }); this.compute(); },

  compute() {
    this.setData({ outputs: [], error: '' });
    const v = parseNum(this.data.value);
    if (v === null || v < 0) {
      this.setData({ error: '请输入非负数值' });
      return;
    }
    const units = buildUnits(parseInt(this.data.base, 10));
    const bits = v * units[this.data.unit];

    const outputs = [];
    for (const u of UNIT_ORDER) {
      outputs.push({
        label: u.label,
        value: fmtVal(bits / units[u.key])
      });
    }
    this.setData({ outputs });
  },

  onLoad() {
    this.compute();
  }
});
