const BASES = {
  dec: { radix: 10, label: '十进制', pattern: /^[0-9]*$/ },
  hex: { radix: 16, label: '十六进制', pattern: /^[0-9a-fA-F]*$/ },
  bin: { radix: 2, label: '二进制', pattern: /^[01]*$/ },
  oct: { radix: 8, label: '八进制', pattern: /^[0-7]*$/ }
};

Page({
  data: {
    inputBase: 'dec',
    inputValue: '',
    bitWidth: 32,
    error: '',
    outputs: []
  },

  onBaseChange(e) {
    this.setData({ inputBase: e.currentTarget.dataset.base, error: '' });
    this.convert();
  },

  onWidthChange(e) {
    this.setData({ bitWidth: Number(e.currentTarget.dataset.width) });
    this.convert();
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
    this.convert();
  },

  convert() {
    const { inputBase, inputValue, bitWidth } = this.data;
    const raw = inputValue.trim();
    if (!raw) {
      this.setData({ outputs: [], error: '' });
      return;
    }
    const base = BASES[inputBase];
    if (!base.pattern.test(raw)) {
      this.setData({ outputs: [], error: base.label + '输入格式不正确' });
      return;
    }
    let value = parseInt(raw, base.radix);
    if (isNaN(value)) {
      this.setData({ outputs: [], error: '无法解析' });
      return;
    }
    if (value > 0xFFFFFFFF) {
      this.setData({ outputs: [], error: '数值超出 32 位范围' });
      return;
    }
    let overflow = value >= Math.pow(2, bitWidth);

    // 二进制按位宽分组展示
    let bin = value.toString(2);
    let hex = value.toString(16).toUpperCase();
    if (!overflow) {
      bin = bin.padStart(bitWidth, '0');
      hex = hex.padStart(bitWidth / 4, '0');
    }
    let binGrouped = bin.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');

    let ascii = '';
    if (value >= 32 && value <= 126) {
      ascii = "'" + String.fromCharCode(value) + "'";
    }

    const outputs = [
      { key: 'dec', label: '十进制 DEC', value: value.toString(10) },
      { key: 'hex', label: '十六进制 HEX', value: '0x' + hex },
      { key: 'bin', label: '二进制 BIN', value: binGrouped },
      { key: 'oct', label: '八进制 OCT', value: '0o' + value.toString(8) }
    ];
    if (ascii) {
      outputs.push({ key: 'ascii', label: 'ASCII 字符', value: ascii });
    }
    this.setData({ outputs, error: overflow ? '数值超出 ' + bitWidth + ' 位无符号范围' : '' });
  },

  copyRow(e) {
    const value = e.currentTarget.dataset.value;
    tt.setClipboardData({
      data: value,
      success: () => tt.showToast({ title: '已复制', icon: 'none' })
    });
  }
});
