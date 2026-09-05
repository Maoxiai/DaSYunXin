const util = require('../../utils/util.js');

Page({
  data: {
    favCount: 0,
    favPreview: [],
    viewCount: 0,
    viewPreview: []
  },

  onShow() {
    this.refresh();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  refresh() {
    const favorites = util.getFavorites();
    const views = util.getViewHistory();
    this.setData({
      favCount: favorites.length,
      favPreview: favorites.slice(0, 3).map((f, i) => Object.assign({}, f, { _delay: i * 60 })),
      viewCount: views.length,
      viewPreview: views.slice(0, 3).map((v, i) => Object.assign({}, v, { _delay: i * 60 }))
    });
  },

  openDetail(e) {
    tt.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    });
  },

  goFavorites() {
    tt.navigateTo({ url: '/pages/mine/favorites/favorites' });
  },

  goHistory() {
    tt.navigateTo({ url: '/pages/mine/history/history' });
  },

  removeFav(e) {
    util.removeFavoriteById(e.currentTarget.dataset.id);
    this.refresh();
    tt.showToast({ title: '已取消收藏', icon: 'none' });
  },

  clearViews() {
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
  },

  copyFeedback() {
    tt.setClipboardData({
      data: '2312891301@qq.com',
      success: () => tt.showToast({ title: '邮箱已复制', icon: 'none' })
    });
  }
});
