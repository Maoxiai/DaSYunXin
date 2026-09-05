// 预生成可打印 ASCII 码表（32 ~ 126）
const ALL_ROWS = [];
for (let i = 32; i <= 126; i++) {
  ALL_ROWS.push({
    dec: String(i),
    hex: i.toString(16).toUpperCase().padStart(2, '0'),
    char: String.fromCharCode(i)
  });
}

// 常用控制字符（补充参考）
const CTRL_ROWS = [
  { dec: '0', hex: '00', char: 'NUL' },
  { dec: '9', hex: '09', char: 'TAB' },
  { dec: '10', hex: '0A', char: 'LF' },
  { dec: '13', hex: '0D', char: 'CR' },
  { dec: '27', hex: '1B', char: 'ESC' },
  { dec: '127', hex: '7F', char: 'DEL' }
];

Page({
  data: {
    rows: ALL_ROWS,
    ctrlRows: CTRL_ROWS,
    keyword: '',
    hasInput: false,
    count: 0
  },

  onInput(e) {
    const kw = e.detail.value;
    this.keyword = kw;
    this.applyFilter();
    this.setData({ hasInput: kw.length > 0 });
  },

  clearInput() {
    this.keyword = '';
    this.setData({ keyword: '', hasInput: false, rows: ALL_ROWS, count: ALL_ROWS.length });
  },

  applyFilter() {
    const raw = (this.keyword || '').trim();
    if (!raw) {
      this.setData({ rows: ALL_ROWS, count: ALL_ROWS.length });
      return;
    }
    const kwLower = raw.toLowerCase();
    const filtered = ALL_ROWS.filter((r) => {
      // 字符精确匹配（大小写敏感），码值十进制/十六进制（hex 大小写不敏感）
      return r.char === raw || r.dec === raw || r.hex.toLowerCase() === kwLower;
    });
    this.setData({ rows: filtered, count: filtered.length });
  }
});
