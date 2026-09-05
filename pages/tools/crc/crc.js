// 解析十六进制字符串（支持空格分隔或连续）
function parseHex(s) {
  s = (s || '').replace(/\s+/g, '');
  if (!s || s.length % 2 !== 0) return null;
  const bytes = [];
  for (let i = 0; i < s.length; i += 2) {
    const b = parseInt(s.substr(i, 2), 16);
    if (isNaN(b)) return null;
    bytes.push(b);
  }
  return bytes;
}

// CRC8：多项式 0x07，初始 0x00，无反射
function crc8(data) {
  let crc = 0x00;
  for (const b of data) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) : (crc << 1);
      crc &= 0xFF;
    }
  }
  return crc;
}

// CRC16-Modbus：多项式 0x8005（反 0xA001），初始 0xFFFF，反射输入输出
function crc16(data) {
  let crc = 0xFFFF;
  for (const b of data) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 0x0001) ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
    }
  }
  return crc;
}

// CRC32（ISO-HDLC）：多项式 0x04C11DB7（反 0xEDB88320），初始 0xFFFFFFFF，反射
function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (const b of data) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 1) ? ((crc >>> 1) ^ 0xEDB88320) : (crc >>> 1);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function hexStr(v, len) {
  let s = v.toString(16).toUpperCase();
  while (s.length < len) s = '0' + s;
  return s;
}

Page({
  data: {
    crcType: 'crc16',
    input: '',
    result: '',
    resultDetail: '',
    error: ''
  },

  setType(e) { this.setData({ crcType: e.currentTarget.dataset.type }); this.compute(); },
  onInput(e) { this.setData({ input: e.detail.value }); this.compute(); },

  compute() {
    this.setData({ result: '', resultDetail: '', error: '' });
    const s = this.data.input;
    if (!s.trim()) return;
    const bytes = parseHex(s);
    if (bytes === null) {
      this.setData({ error: '请输入有效的十六进制（如 01 03 00 00 00 01）' });
      return;
    }
    if (bytes.length === 0) return;

    let result;
    let detail;
    if (this.data.crcType === 'crc8') {
      result = hexStr(crc8(bytes), 2);
      detail = 'CRC8（多项式 0x07）';
    } else if (this.data.crcType === 'crc16') {
      const v = crc16(bytes);
      result = hexStr(v, 4);
      // Modbus 帧内低字节在前
      detail = 'CRC16-Modbus（帧内先低字节 0x' + hexStr(v & 0xFF, 2) + ' 后高字节 0x' + hexStr(v >> 8, 2) + '）';
    } else {
      result = hexStr(crc32(bytes), 8);
      detail = 'CRC32（ISO-HDLC）';
    }
    this.setData({ result: '0x' + result, resultDetail: detail });
  }
});
