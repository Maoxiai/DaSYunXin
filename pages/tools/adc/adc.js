function sig(v) {
  if (v === 0) return '0';
  const r = Number(v.toPrecision(5));
  let s = String(r);
  if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

const BIT_OPTIONS = [8, 10, 12, 16];

Page({
  data: {
    vref: '3.3',
    bits: 12,
    // 预计算的选项列表：每项含选中标记，模板不做 === 比较
    bitList: [],
    reading: '',
    voltage: '',
    // 预计算的展示文本
    full: 4095,
    rangeText: '',
    lsbText: '',
    hint: '',
    outVoltage: '',
    outReading: '',
    error: ''
  },

  onLoad() {
    this.recalc();
  },

  onVref(e) {
    this.setData({ vref: e.detail.value });
    this.recalc();
  },

  setBits(e) {
    this.setData({ bits: Number(e.currentTarget.dataset.bits) });
    this.recalc();
  },

  onReading(e) {
    this.setData({ reading: e.detail.value, voltage: '' });
    this.recalc();
  },

  onVoltage(e) {
    this.setData({ voltage: e.detail.value, reading: '' });
    this.recalc();
  },

  recalc() {
    const d = {
      outVoltage: '', outReading: '', error: ''
    };
    const vref = parseFloat(this.data.vref);

    // 选项选中标记（在 JS 层比较，模板只读布尔）
    d.bitList = BIT_OPTIONS.map((b) => ({
      v: b,
      label: b + ' 位',
      sel: b === this.data.bits
    }));

    if (isNaN(vref) || vref <= 0) {
      d.error = '请输入有效的参考电压';
      d.bitList = this.data.bitList.length ? d.bitList : BIT_OPTIONS.map((b) => ({ v: b, label: b + ' 位', sel: b === this.data.bits }));
      this.setData(d);
      return;
    }
    const bits = this.data.bits;
    const full = Math.pow(2, bits) - 1;
    const lsbVal = vref / full;
    d.full = full;
    d.rangeText = '0 ~ ' + full;
    d.lsbText = sig(lsbVal) + ' V';
    // 整句在 JS 拼好，模板零运算
    d.hint = '满量程读数 ' + full + '（2^' + bits + ' - 1），1 LSB ≈ ' + d.lsbText;

    const reading = this.data.reading.trim();
    const voltage = this.data.voltage.trim();
    if (reading && voltage) {
      d.error = '读数与电压都填写了，请清空其一自动换算';
      this.setData(d);
      return;
    }
    if (reading) {
      const n = parseInt(reading, 10);
      if (isNaN(n) || n < 0 || n > full) {
        d.error = '读数需为 0 ~ ' + full + ' 的整数';
        this.setData(d);
        return;
      }
      d.outVoltage = sig(n / full * vref) + ' V';
    } else if (voltage) {
      const v = parseFloat(voltage);
      if (isNaN(v) || v < 0) {
        d.error = '电压需为非负数值';
        this.setData(d);
        return;
      }
      if (v > vref) {
        d.error = '电压超过参考电压 ' + vref + 'V，读数将饱和于 ' + full;
        this.setData(d);
        return;
      }
      d.outReading = String(Math.round(v / vref * full));
    }
    this.setData(d);
  }
});
