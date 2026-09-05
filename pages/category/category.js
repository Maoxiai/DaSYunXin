const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'vendor', // vendor | category
    vendorGroups: [],
    categoryGroups: []
  },

  onLoad() {
    this.setData({
      vendorGroups: util.getVendorGroups().map((g, i) => Object.assign({}, g, { _delay: Math.min(i, 12) * 40 })),
      categoryGroups: util.getCategoryGroups().map((g, i) => Object.assign({}, g, { _delay: Math.min(i, 12) * 40 }))
    });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  openList(e) {
    const { type, value } = e.currentTarget.dataset;
    tt.navigateTo({
      url: '/pages/list/list?type=' + encodeURIComponent(type) + '&value=' + encodeURIComponent(value)
    });
  }
});
