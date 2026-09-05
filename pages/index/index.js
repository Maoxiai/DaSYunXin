const util = require('../../utils/util.js');

// 把历史字符串数组转成带 stagger 延迟的对象数组，供模板弹入动画使用
function historyItems(arr) {
  return (arr || []).map((kw, i) => ({ kw, _delay: Math.min(i, 10) * 40 }));
}

Page({
  data: {
    searchKeyword: '',
    hasInput: false,
    suggestions: [],
    history: [],
    hotChips: [],
    // null = 还未搜索（展示历史+热门）；数组 = 搜索结果
    results: null,
    isLoading: false,
    ripples: []
  },

  onLoad() {
    this.setData({
      history: historyItems(util.getHistory()),
      hotChips: util.getHotChips(24).map((c, i) => Object.assign({}, c, { _delay: Math.min(i, 12) * 40 }))
    });
  },

  onShow() {
    // 从详情页返回时刷新历史
    this.setData({ history: historyItems(util.getHistory()) });
  },

  // 输入框采用半受控模式：输入/粘贴时不回写 value，避免 setData 重渲染干扰粘贴；
  // 真实输入值存 this.keyword，searchKeyword 仅在程序化设置（清空/回填）时更新
  onInput(e) {
    this.keyword = e.detail.value;
    const keyword = this.keyword;
    const suggestions = keyword.trim().length >= 2 ? util.searchChips(keyword, 8) : [];
    this.setData({ suggestions, hasInput: keyword.length > 0 });
  },

  clearInput() {
    this.keyword = '';
    this.setData({ searchKeyword: '', hasInput: false, suggestions: [], results: null });
  },

  // 点击搜索按钮时触发波纹涟漪动效
  triggerRipple() {
    const id = (this._rippleId = (this._rippleId || 0) + 1);
    const ripples = this.data.ripples.concat({ id });
    this.setData({ ripples });
    setTimeout(() => {
      this.setData({ ripples: this.data.ripples.filter((r) => r.id !== id) });
    }, 700);
  },

  onSearch() {
    this.triggerRipple();
    const keyword = (this.keyword !== undefined ? this.keyword : this.data.searchKeyword).trim();
    if (keyword.length < 2) {
      tt.showToast({ title: '请至少输入 2 个字符', icon: 'none' });
      return;
    }
    this.setData({ isLoading: true, suggestions: [] });
    // 本地库搜索（离线可用），后续可叠加远程 API 增补
    const results = util.searchChips(keyword).map((c, i) => Object.assign({}, c, { spec: util.specLine(c), _delay: Math.min(i, 12) * 50 }));
    const history = historyItems(util.addHistory(keyword));
    this.setData({ results, history, isLoading: false });
  },

  selectSuggestion(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.keyword = keyword;
    this.setData({ searchKeyword: keyword, hasInput: true });
    this.onSearch();
  },

  tapHistory(e) {
    const keyword = e.currentTarget.dataset.kw;
    this.keyword = keyword;
    this.setData({ searchKeyword: keyword, hasInput: true });
    this.onSearch();
  },

  removeHistoryItem(e) {
    const history = historyItems(util.removeHistory(e.currentTarget.dataset.kw));
    this.setData({ history });
  },

  clearHistory() {
    tt.showModal({
      title: '提示',
      content: '确定清空全部搜索历史吗？',
      confirmColor: '#4A90E2',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: historyItems(util.clearHistory()) });
        }
      }
    });
  },

  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
});
