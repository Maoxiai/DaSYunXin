function ipToInt(ip) {
  const parts = (ip || '').trim().split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = parseInt(p, 10);
    if (isNaN(v) || v < 0 || v > 255) return null;
    n = (n << 8) | v;
  }
  return n >>> 0;
}

function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

const PREFIX_PRESETS = [8, 16, 20, 24, 28, 30];

Page({
  data: {
    ip: '192.168.1.100',
    prefix: '24',
    prefixPresets: PREFIX_PRESETS,
    mask: '',
    network: '',
    broadcast: '',
    hosts: '',
    range: '',
    error: ''
  },

  onIp(e) { this.setData({ ip: e.detail.value }); this.compute(); },
  onPrefix(e) { this.setData({ prefix: e.detail.value }); this.compute(); },
  setPrefix(e) { this.setData({ prefix: e.currentTarget.dataset.v }); this.compute(); },

  compute() {
    this.setData({ mask: '', network: '', broadcast: '', hosts: '', range: '', error: '' });
    const ipInt = ipToInt(this.data.ip);
    const prefix = parseInt(this.data.prefix, 10);
    if (ipInt === null) {
      this.setData({ error: 'IP 地址格式不正确（如 192.168.1.100）' });
      return;
    }
    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      this.setData({ error: '前缀需为 0 ~ 32 的整数' });
      return;
    }

    const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const hosts = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.pow(2, 32 - prefix) - 2;

    let range;
    if (prefix >= 31) {
      range = intToIp(network) + ' ~ ' + intToIp(broadcast);
    } else {
      range = intToIp((network + 1) >>> 0) + ' ~ ' + intToIp((broadcast - 1) >>> 0);
    }

    this.setData({
      mask: intToIp(mask),
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      hosts: String(hosts),
      range
    });
  },

  onLoad() {
    this.compute();
  }
});
