const util = require('../../utils/util.js');

Page({
  data: {
    favorites: [],
    views: []
  },

  onShow() {
    this.setData({
      favorites: util.getFavorites(),
      views: util.getViewHistory()
    });
  },

  openDetail(e) {
    tt.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    });
  },

  removeFav(e) {
    const favorites = util.removeFavoriteById(e.currentTarget.dataset.id);
    this.setData({ favorites });
    tt.showToast({ title: '已取消收藏', icon: 'none' });
  },

  clearViews() {
    tt.showModal({
      title: '提示',
      content: '确定清空浏览历史吗？',
      confirmColor: '#4A90E2',
      success: (res) => {
        if (res.confirm) {
          this.setData({ views: util.clearViewHistory() });
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
