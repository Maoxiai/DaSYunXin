// 电阻输入解析：470 = 470Ω，4.7k = 4.7kΩ，1M = 1MΩ
function parseRes(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)\s*([kK])?$/);
  if (!m) return null;
  let v = parseFloat(m[1]);
  if (m[2]) v *= 1e3;
  // 兆欧简写 1M
  const m2 = (s || '').match(/^(\d+\.?\d*)\s*[mM]$/);
  if (m2) return parseFloat(m2[1]) * 1e6;
  return v;
}

function parseNum(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  return m ? parseFloat(m[1]) : null;
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

function fmtCurrent(a) {
  if (a >= 1) return (Math.round(a * 100) / 100) + ' A';
  if (a >= 1e-3) return (Math.round(a * 1e5) / 100) + ' mA';
  return (Math.round(a * 1e6 * 100) / 100) + ' μA';
}

function fmtPower(w) {
  if (w >= 1) return (Math.round(w * 1000) / 1000) + ' W';
  return (Math.round(w * 1e6) / 1000) + ' mW';
}

const LABELS = { v: '电压 V', i: '电流 I', r: '电阻 R', p: '功率 P' };

Page({
  data: {
    // 输入框独立字段（模板不做变量索引绑定）
    v: '',
    i: '',
    r: '',
    p: '',
    // 预计算的结果展示状态
    hasResult: false,
    resultRows: [],
    error: ''
  },

  // 4 个独立输入事件，避免 data-key + 模板循环
  onV(e) { this.setData({ v: e.detail.value }); this.solve(); },
  onI(e) { this.setData({ i: e.detail.value }); this.solve(); },
  onR(e) { this.setData({ r: e.detail.value }); this.solve(); },
  onP(e) { this.setData({ p: e.detail.value }); this.solve(); },

  // 解析为国际单位：V / A / Ω / W；返回 null 表示未填或格式错
  readRaw(key) {
    const s = this.data[key].trim();
    if (!s) return undefined; // 未填写
    if (key === 'v') return parseNum(s);
    if (key === 'i') {
      const n = parseNum(s);
      return n === null ? null : n / 1000; // mA → A
    }
    if (key === 'p') {
      const n = parseNum(s);
      return n === null ? null : n / 1000; // mW → W
    }
    return parseRes(s); // r
  },

  fmtOut(key, val) {
    if (key === 'v') return (Math.round(val * 1000) / 1000) + ' V';
    if (key === 'i') return fmtCurrent(val);
    if (key === 'r') return fmtRes(val);
    return fmtPower(val);
  },

  solve() {
    this.setData({ hasResult: false, resultRows: [], error: '' });
    const keys = ['v', 'i', 'r', 'p'];
    const raw = {};
    let filled = [];
    let bad = false;
    for (const k of keys) {
      const val = this.readRaw(k);
      raw[k] = val;
      if (val === undefined) continue;
      if (val === null || val <= 0) bad = true;
      filled.push(k);
    }
    if (filled.length === 0) return;
    if (bad) {
      this.setData({ error: '已填写项格式不正确或数值需大于 0（电阻支持 470 / 4.7k / 1M）' });
      return;
    }
    if (filled.length === 1) {
      this.setData({ error: '请再填写一项（共需两项，自动求其余两项）' });
      return;
    }
    if (filled.length > 2) {
      this.setData({ error: '已填写超过两项，请留空两项自动计算' });
      return;
    }

    const V = raw.v !== undefined ? raw.v : null;
    const I = raw.i !== undefined ? raw.i : null;
    const R = raw.r !== undefined ? raw.r : null;
    const P = raw.p !== undefined ? raw.p : null;

    let out = {};
    if (V !== null && I !== null) {
      out.r = V / I; out.p = V * I;
    } else if (V !== null && R !== null) {
      out.i = V / R; out.p = V * V / R;
    } else if (I !== null && R !== null) {
      out.v = I * R; out.p = I * I * R;
    } else if (V !== null && P !== null) {
      if (V === 0) { this.setData({ error: '计算失败，请检查输入' }); return; }
      out.i = P / V; out.r = V * V / P;
    } else if (I !== null && P !== null) {
      out.v = P / I; out.r = P / (I * I);
    } else if (R !== null && P !== null) {
      out.v = Math.sqrt(P * R); out.i = Math.sqrt(P / R);
    }

    // 结果行带唯一 id，供列表渲染
    const resultRows = [];
    let idx = 0;
    for (const k of keys) {
      if (out[k] === undefined) continue;
      resultRows.push({ id: idx++, label: LABELS[k], value: this.fmtOut(k, out[k]) });
    }
    this.setData({ hasResult: resultRows.length > 0, resultRows });
  }
});
