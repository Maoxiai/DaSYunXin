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
      chips: chips.map((c, i) => Object.assign({}, c, {
        spec: util.specLine(c),
        _delay: Math.min(i, 12) * 40
      }))
    });
  },

  openDetail(e) {
    tt.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    });
  }
});
