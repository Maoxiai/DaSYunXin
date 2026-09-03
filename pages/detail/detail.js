const util = require('../../utils/util.js');

// 参数表字段定义（缺失字段自动跳过）
const PARAM_DEFS = [
  ['内核', 'core'],
  ['主频', 'freq'],
  ['Flash', 'flash'],
  ['RAM', 'ram'],
  ['GPIO', 'gpio'],
  ['接口/类型', 'interface'],
  ['关键特性', 'keySpec'],
  ['封装', 'package'],
  ['工作电压', 'voltage'],
  ['工作温度', 'temp']
];

Page({
  data: {
    chip: null,
    params: [],
    isFav: false
  },

  onLoad(options) {
    const chip = util.getChipById(options.id);
    if (!chip) {
      tt.showToast({ title: '未找到该芯片', icon: 'none' });
      setTimeout(() => tt.navigateBack(), 800);
      return;
    }
    const params = [];
    for (const item of PARAM_DEFS) {
      if (chip[item[1]]) {
        params.push({ k: item[0], v: chip[item[1]] });
      }
    }
    util.addViewHistory(chip);
    this.setData({ chip, params, isFav: util.isFavorite(chip.id) });
  },

  toggleFavorite() {
    if (!this.data.chip) return;
    const isFav = util.toggleFavorite(this.data.chip);
    this.setData({ isFav });
    tt.showToast({ title: isFav ? '已加入收藏' : '已取消收藏', icon: 'none' });
  },

  openManual() {
    if (!this.data.chip) return;
    util.openManual(this.data.chip);
  },

  copySearchUrl() {
    if (!this.data.chip) return;
    util.copyText(util.searchUrl(this.data.chip), '搜索链接已复制，请在浏览器打开');
  },

  tapAlt(e) {
    const model = e.currentTarget.dataset.model;
    const chip = util.getChipByModel(model);
    if (chip) {
      tt.navigateTo({ url: '/pages/detail/detail?id=' + chip.id });
    } else {
      tt.showToast({ title: '「' + model + '」暂未收录，可到首页搜索', icon: 'none' });
    }
  }
});
