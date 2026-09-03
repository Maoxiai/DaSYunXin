const util = require('../../utils/util.js');

Page({
  data: {
    title: '',
    chips: []
  },

  onLoad(options) {
    const type = decodeURIComponent(options.type || 'category');
    const value = decodeURIComponent(options.value || '');
    if (!value) {
      tt.navigateBack();
      return;
    }
    let chips;
    if (type === 'vendor') {
      chips = util.getChipsByVendor(value);
    } else {
      chips = util.getChipsByCategory(value);
    }
    tt.setNavigationBarTitle({ title: value });
    this.setData({
      title: value,
      chips: chips.map((c) => Object.assign({}, c, { spec: util.specLine(c) }))
    });
  },

  openDetail(e) {
    tt.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    });
  }
});
