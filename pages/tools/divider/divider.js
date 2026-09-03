// 智能解析电阻输入：纯数字=Ω，4.7k=4.7kΩ，1M=1MΩ
function parseRes(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)\s*([kK])?$/);
  if (!m) return null;
  let v = parseFloat(m[1]);
  if (m[2]) v *= 1e3;
  return v;
}

function parseResM(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)\s*M$/);
  if (!m) return null;
  return parseFloat(m[1]) * 1e6;
}

function parseVolt(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  if (!m) return null;
  return parseFloat(m[1]);
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

function fmtCurrent(i) {
  if (i >= 1e-3) {
    return (Math.round(i * 1e5) / 100) + ' mA';
  }
  return (Math.round(i * 1e6 * 100) / 100) + ' μA';
}

const FIELD_DEFS = [
  { key: 'vin', label: '输入电压 Vin', unit: 'V', ph: '如 5' },
  { key: 'r1', label: '上臂电阻 R1', unit: 'Ω/k/M', ph: '如 10k' },
  { key: 'vout', label: '输出电压 Vout', unit: 'V', ph: '如 3.3' },
  { key: 'r2', label: '下臂电阻 R2', unit: 'Ω/k/M', ph: '如 6.8k' }
];

Page({
  data: {
    fields: FIELD_DEFS,
    values: { vin: '', r1: '', vout: '', r2: '' },
    resultLabel: '',
    resultValue: '',
    currentText: '',
    error: ''
  },

  onFieldInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ ['values.' + key]: e.detail.value });
    this.solve();
  },

  solve() {
    this.setData({ resultLabel: '', resultValue: '', currentText: '', error: '' });
    const vals = this.data.values;
    const empty = [];
    if (!vals.vin.trim()) empty.push('vin');
    if (!vals.r1.trim()) empty.push('r1');
    if (!vals.vout.trim()) empty.push('vout');
    if (!vals.r2.trim()) empty.push('r2');

    if (empty.length === 0) {
      this.setData({ error: '四项都已填写，留空任意一项即可自动求解该项' });
      return;
    }
    if (empty.length > 1) {
      this.setData({ error: '请填写其中三项，留空一项自动计算' });
      return;
    }

    // 解析已填项
    const v = {
      vin: vals.vin.trim() ? parseVolt(vals.vin) : null,
      vout: vals.vout.trim() ? parseVolt(vals.vout) : null,
      r1: vals.r1.trim() ? (parseRes(vals.r1) !== null ? parseRes(vals.r1) : parseResM(vals.r1)) : null,
      r2: vals.r2.trim() ? (parseRes(vals.r2) !== null ? parseRes(vals.r2) : parseResM(vals.r2)) : null
    };
    for (const key of ['vin', 'vout', 'r1', 'r2']) {
      if (key !== empty[0]) {
        if (v[key] === null) {
          this.setData({ error: '已填写项格式不正确（电阻支持 470 / 4.7k / 1M）' });
          return;
        }
        if (v[key] <= 0) {
          this.setData({ error: '已填写项数值必须大于 0' });
          return;
        }
      }
    }

    const target = empty[0];
    let result = null;
    let label = '';
    let unit = '';

    if (target === 'vout') {
      result = v.vin * v.r2 / (v.r1 + v.r2);
      label = '输出电压 Vout';
      unit = 'V';
    } else if (target === 'vin') {
      result = v.vout * (v.r1 + v.r2) / v.r2;
      label = '输入电压 Vin';
      unit = 'V';
    } else if (target === 'r1') {
      result = v.r2 * (v.vin - v.vout) / v.vout;
      label = '上臂电阻 R1';
    } else if (target === 'r2') {
      if (v.vin - v.vout <= 0) {
        this.setData({ error: 'Vin 必须大于 Vout 才能求解 R2' });
        return;
      }
      result = v.r1 * v.vout / (v.vin - v.vout);
      label = '下臂电阻 R2';
    }

    if (result === null || isNaN(result)) {
      this.setData({ error: '计算失败，请检查输入' });
      return;
    }
    if (result <= 0) {
      this.setData({ error: '计算结果为非正值，请检查输入关系（如 Vout 应小于 Vin）' });
      return;
    }

    const resultValue = (target === 'r1' || target === 'r2')
      ? fmtRes(result)
      : (Math.round(result * 1000) / 1000) + ' ' + unit;

    // 分压电流（补全后 R1、R2、Vin 均已知）
    let r1v = v.r1;
    let r2v = v.r2;
    let vinv = v.vin;
    if (target === 'r1') r1v = result;
    if (target === 'r2') r2v = result;
    if (target === 'vin') vinv = result;
    let currentText = '';
    if (r1v && r2v && vinv) {
      currentText = '分压电流 I ≈ ' + fmtCurrent(vinv / (r1v + r2v));
    }
    this.setData({ resultLabel: label, resultValue, currentText });
  }
});
