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
  },

  onUnload() {
    clearTimeout(this._timer_favCount);
    clearTimeout(this._timer_viewCount);
  },

  refresh() {
    const favorites = util.getFavorites();
    const views = util.getViewHistory();
    this.setData({
      favPreview: favorites.slice(0, 3).map((f, i) => Object.assign({}, f, { _delay: i * 60 })),
      viewPreview: views.slice(0, 3).map((v, i) => Object.assign({}, v, { _delay: i * 60 }))
    });
    this.animateCount('favCount', favorites.length);
    this.animateCount('viewCount', views.length);
  },

  // 统计数字滚动动画：从当前显示值平滑滚动到目标值
  animateCount(field, target) {
    const from = this.data[field] || 0;
    if (from === target) {
      this.setData({ [field]: target });
      return;
    }
    const frames = 20;
    const diff = target - from;
    let i = 0;
    const timerKey = '_timer_' + field;
    const step = () => {
      i++;
      // easeOutCubic 缓动，收尾更自然
      const p = 1 - Math.pow(1 - i / frames, 3);
      const cur = Math.round(from + diff * p);
      if (i >= frames) {
        this.setData({ [field]: target });
      } else {
        this.setData({ [field]: cur });
        this[timerKey] = setTimeout(step, 25);
      }
    };
    if (this[timerKey]) clearTimeout(this[timerKey]);
    this[timerKey] = setTimeout(step, 25);
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
