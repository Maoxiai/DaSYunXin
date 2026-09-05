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

Page({
  data: {
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    result: '',
    detail: '',
    error: ''
  },

  onR1(e) { this.setData({ r1: e.detail.value }); this.compute(); },
  onR2(e) { this.setData({ r2: e.detail.value }); this.compute(); },
  onR3(e) { this.setData({ r3: e.detail.value }); this.compute(); },
  onR4(e) { this.setData({ r4: e.detail.value }); this.compute(); },

  compute() {
    this.setData({ result: '', detail: '', error: '' });
    const raws = [this.data.r1, this.data.r2, this.data.r3, this.data.r4];
    const vals = [];
    for (const s of raws) {
      if (!s.trim()) continue;
      const v = parseRes(s);
      if (v === null) {
        this.setData({ error: '电阻格式不正确（支持 470 / 4.7k / 1M）' });
        return;
      }
      if (v <= 0) {
        this.setData({ error: '电阻值需大于 0' });
        return;
      }
      vals.push(v);
    }
    if (vals.length === 0) return;
    if (vals.length === 1) {
      this.setData({ result: fmtRes(vals[0]), detail: '单个电阻无需并联，总阻值即其本身' });
      return;
    }
    let sum = 0;
    for (const v of vals) sum += 1 / v;
    const total = 1 / sum;
    this.setData({
      result: fmtRes(total),
      detail: vals.length + ' 个电阻并联'
    });
  }
});
