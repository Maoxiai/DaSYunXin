function parseNum(s) {
  s = (s || '').trim();
  const m = s.match(/^(\d+\.?\d*)$/);
  return m ? parseFloat(m[1]) : null;
}

function sig(v) {
  const r = Number(v.toPrecision(4));
  let s = String(r);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

// 续航时长格式化：<1h 显示分钟，>=24h 拆天数
function fmtDuration(hours) {
  if (hours < 1) {
    return sig(hours * 60) + ' 分钟';
  }
  if (hours < 24) {
    return sig(hours) + ' 小时';
  }
  const days = Math.floor(hours / 24);
  const rest = hours - days * 24;
  if (rest < 0.5) return days + ' 天';
  return days + ' 天 ' + sig(Math.round(rest)) + ' 小时';
}

// 预设统一用 v 字段，模板绑定 {{item.v}}（与其他工具页一致）
const BAT_PRESETS = [
  { label: 'CR2032 纽扣 220mAh', v: '220' },
  { label: 'AA 碱性 2500mAh', v: '2500' },
  { label: '18650 锂电 3000mAh', v: '3000' },
  { label: '聚合物 1000mAh', v: '1000' }
];

const LOAD_PRESETS = [
  { label: '休眠 0.01mA', v: '0.01' },
  { label: 'BLE 广播 5mA', v: '5' },
  { label: 'WiFi 联网 80mA', v: '80' },
  { label: '全速运行 100mA', v: '100' }
];

Page({
  data: {
    cap: '3000',
    cur: '20',
    efficiency: '100',
    voltage: '3.7',
    batPresets: BAT_PRESETS,
    loadPresets: LOAD_PRESETS,
    hasResult: false,
    duration: '',
    durationText: '',
    whText: '',
    error: ''
  },

  onLoad() {
    this.compute();
  },

  onCap(e) { this.setData({ cap: e.detail.value }); this.compute(); },
  onCur(e) { this.setData({ cur: e.detail.value }); this.compute(); },
  onEff(e) { this.setData({ efficiency: e.detail.value }); this.compute(); },
  onVoltage(e) { this.setData({ voltage: e.detail.value }); this.compute(); },

  setBatPreset(e) {
    this.setData({ cap: e.currentTarget.dataset.v });
    this.compute();
  },

  setLoadPreset(e) {
    this.setData({ cur: e.currentTarget.dataset.v });
    this.compute();
  },

  compute() {
    this.setData({ hasResult: false, duration: '', durationText: '', whText: '', error: '' });
    const cap = parseNum(this.data.cap);       // mAh
    const cur = parseNum(this.data.cur);       // mA
    const eff = this.data.efficiency.trim() ? parseNum(this.data.efficiency) : 100; // %
    const vol = this.data.voltage.trim() ? parseNum(this.data.voltage) : null;      // V，可选

    if (cap === null) { this.setData({ error: '电池容量格式不正确' }); return; }
    if (cur === null) { this.setData({ error: '负载电流格式不正确' }); return; }
    if (eff === null || eff <= 0 || eff > 100) {
      this.setData({ error: '效率需为 1~100（DC-DC 典型 85，LDO 视压差更低）' });
      return;
    }
    if (vol !== null && vol <= 0) { this.setData({ error: '电池电压需大于 0' }); return; }
    if (cap <= 0) { this.setData({ error: '电池容量需大于 0' }); return; }
    if (cur <= 0) { this.setData({ error: '负载电流需大于 0' }); return; }

    // 续航 = 容量 × 效率 / 电流
    const hours = cap * (eff / 100) / cur;
    const whText = vol !== null
      ? '电池能量 = ' + sig(cap * vol / 1000) + ' Wh'
      : '';
    this.setData({
      hasResult: true,
      duration: sig(hours),
      durationText: fmtDuration(hours),
      whText
    });
  }
});
