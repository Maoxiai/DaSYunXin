const util = require('../../../utils/util.js');

Page({
  data: {
    all: [],
    list: [],
    total: 0,
    vendors: [],
    keyword: '',
    hasInput: false,
    vendor: ''
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const all = util.getFavorites();
    this.setData({ all, total: all.length });
    this.applyFilter();
  },

  onInput(e) {
    this.keyword = e.detail.value;
    this.setData({ hasInput: this.keyword.length > 0 });
    this.applyFilter();
  },

  clearInput() {
    this.keyword = '';
    this.setData({ hasInput: false });
    this.applyFilter();
  },

  setVendor(e) {
    const v = e.currentTarget.dataset.v;
    this.setData({ vendor: v });
    this.applyFilter();
  },

  applyFilter() {
    const kw = (this.keyword || '').trim().toLowerCase();
    let list = this.data.all;
    if (this.data.vendor) {
      list = list.filter((f) => f.vendor === this.data.vendor);
    }
    if (kw) {
      list = list.filter((f) => f.model.toLowerCase().indexOf(kw) > -1 || f.vendor.toLowerCase().indexOf(kw) > -1);
    }

    // 厂商筛选 chips：sel 在 JS 层预计算
    const names = {};
    for (const f of this.data.all) names[f.vendor] = (names[f.vendor] || 0) + 1;
    const vendors = [{ name: '', label: '全部', count: this.data.all.length, sel: this.data.vendor === '' }];
    for (const n of Object.keys(names)) {
      vendors.push({ name: n, label: n, count: names[n], sel: this.data.vendor === n });
    }

    this.setData({
      list: list.map((f, i) => Object.assign({}, f, { _delay: Math.min(i, 10) * 40 })),
      vendors
    });
  },

  openDetail(e) {
    tt.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  removeFav(e) {
    util.removeFavoriteById(e.currentTarget.dataset.id);
    this.refresh();
    tt.showToast({ title: '已取消收藏', icon: 'none' });
  }
});
