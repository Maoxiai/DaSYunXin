const util = require('../../../utils/util.js');

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  const hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
  if (d.toDateString() === now.toDateString()) {
    return '今天 ' + hm;
  }
  const yest = new Date(now.getTime() - 86400000);
  if (d.toDateString() === yest.toDateString()) {
    return '昨天 ' + hm;
  }
  return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
}

Page({
  data: {
    list: [],
    total: 0
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const list = util.getViewHistory();
    this.setData({
      total: list.length,
      list: list.map((v, i) => Object.assign({}, v, {
        _delay: Math.min(i, 10) * 40,
        _time: formatTime(v.time)
      }))
    });
  },

  openDetail(e) {
    tt.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  clearAll() {
    tt.showModal({
      title: '提示',
      content: '确定清空浏览历史吗？',
      confirmColor: '#4A90E2',
      success: (res) => {
        if (res.confirm) {
          util.clearViewHistory();
          this.refresh();
        }
      }
    });
  }
});
