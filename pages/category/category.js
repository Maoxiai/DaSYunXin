const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'vendor', // vendor | category
    vendorGroups: [],
    categoryGroups: []
  },

  onLoad() {
    this.setData({
      vendorGroups: util.getVendorGroups(),
      categoryGroups: util.getCategoryGroups()
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
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
