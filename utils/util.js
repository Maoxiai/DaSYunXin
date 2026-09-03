// 猫夏云芯 通用工具：搜索、本地存储、手册打开
const chipsData = require('../data/chips.js');

const HISTORY_KEY = 'das_history';        // 搜索历史（关键词）
const FAVORITES_KEY = 'das_favorites';    // 收藏（芯片对象）
const VIEW_KEY = 'das_viewHistory';       // 浏览历史（芯片对象）

// ============ 搜索 ============

// 本地库搜索：完全匹配 > 前缀 > 包含 > 厂商/品类/简介
function searchChips(keyword, limit) {
  const kw = (keyword || '').trim().toLowerCase();
  if (!kw) return [];
  const result = [];
  for (const chip of chipsData.chips) {
    const model = (chip.model || '').toLowerCase();
    const vendor = (chip.vendor || '').toLowerCase();
    const summary = (chip.summary || '').toLowerCase();
    const category = (chip.category || '').toLowerCase();
    let score = -1;
    if (model === kw) score = 100;
    else if (model.indexOf(kw) === 0) score = 80;
    else if (model.indexOf(kw) > -1) score = 60;
    else if (vendor.indexOf(kw) > -1) score = 30;
    else if (category.indexOf(kw) > -1 || summary.indexOf(kw) > -1) score = 20;
    if (score > 0) {
      result.push({ chip, score });
    }
  }
  result.sort((a, b) => (b.score - a.score) || (b.chip.hot - a.chip.hot));
  const list = result.map((r) => r.chip);
  return limit ? list.slice(0, limit) : list;
}

function getChipById(id) {
  if (!id) return null;
  return chipsData.chips.find((c) => c.id === id) || null;
}

function getChipByModel(model) {
  if (!model) return null;
  const kw = model.toLowerCase();
  return chipsData.chips.find((c) => (c.model || '').toLowerCase() === kw) || null;
}

function getHotChips(limit) {
  const list = chipsData.chips.slice().sort((a, b) => b.hot - a.hot);
  return limit ? list.slice(0, limit) : list;
}

// 结果卡片规格行
function specLine(chip) {
  const parts = [];
  if (chip.core) parts.push(chip.core);
  if (chip.freq) parts.push(chip.freq);
  if (chip.flash && chip.ram) parts.push(chip.flash + ' / ' + chip.ram);
  if (chip.keySpec) parts.push(chip.keySpec);
  if (chip.package) parts.push(chip.package);
  return parts.join(' · ');
}

// ============ 分类分组 ============

function groupBy(field) {
  const map = {};
  for (const c of chipsData.chips) {
    if (c[field]) map[c[field]] = (map[c[field]] || 0) + 1;
  }
  return Object.keys(map)
    .map((name) => ({ name, count: map[name] }))
    .sort((a, b) => b.count - a.count);
}

function getVendorGroups() {
  return groupBy('vendor');
}

function getCategoryGroups() {
  return groupBy('category');
}

function getChipsByVendor(vendor) {
  return chipsData.chips
    .filter((c) => c.vendor === vendor)
    .sort((a, b) => b.hot - a.hot);
}

function getChipsByCategory(category) {
  return chipsData.chips
    .filter((c) => c.category === category)
    .sort((a, b) => b.hot - a.hot);
}

// ============ 搜索历史 ============

function getHistory() {
  try {
    return tt.getStorageSync(HISTORY_KEY) || [];
  } catch (e) {
    return [];
  }
}

function addHistory(keyword) {
  const kw = (keyword || '').trim();
  if (!kw) return getHistory();
  let list = getHistory().filter((x) => x !== kw);
  list.unshift(kw);
  if (list.length > 20) list = list.slice(0, 20);
  tt.setStorageSync(HISTORY_KEY, list);
  return list;
}

function removeHistory(keyword) {
  const list = getHistory().filter((x) => x !== keyword);
  tt.setStorageSync(HISTORY_KEY, list);
  return list;
}

function clearHistory() {
  tt.setStorageSync(HISTORY_KEY, []);
  return [];
}

// ============ 收藏 ============

function getFavorites() {
  try {
    return tt.getStorageSync(FAVORITES_KEY) || [];
  } catch (e) {
    return [];
  }
}

function isFavorite(id) {
  return getFavorites().some((f) => f.id === id);
}

// 返回切换后的收藏状态
function toggleFavorite(chip) {
  let list = getFavorites();
  if (list.some((f) => f.id === chip.id)) {
    list = list.filter((f) => f.id !== chip.id);
    tt.setStorageSync(FAVORITES_KEY, list);
    return false;
  }
  list.unshift({
    id: chip.id,
    model: chip.model,
    vendor: chip.vendor,
    category: chip.category,
    time: Date.now()
  });
  if (list.length > 200) list = list.slice(0, 200);
  tt.setStorageSync(FAVORITES_KEY, list);
  return true;
}

// ============ 浏览历史 ============

function getViewHistory() {
  try {
    return tt.getStorageSync(VIEW_KEY) || [];
  } catch (e) {
    return [];
  }
}

function removeFavoriteById(id) {
  const list = getFavorites().filter((f) => f.id !== id);
  tt.setStorageSync(FAVORITES_KEY, list);
  return list;
}

function clearViewHistory() {
  tt.setStorageSync(VIEW_KEY, []);
  return [];
}

function addViewHistory(chip) {
  if (!chip) return;
  let list = getViewHistory().filter((x) => x.id !== chip.id);
  list.unshift({
    id: chip.id,
    model: chip.model,
    vendor: chip.vendor,
    time: Date.now()
  });
  if (list.length > 50) list = list.slice(0, 50);
  tt.setStorageSync(VIEW_KEY, list);
}

// ============ 数据手册 ============

// 手册链接：优先官方 PDF 直链，缺失时用搜索引擎兜底
function manualUrl(chip) {
  if (chip.pdfUrl) return chip.pdfUrl;
  return searchUrl(chip);
}

// 搜索引擎兜底链接
function searchUrl(chip) {
  return 'https://www.bing.com/search?q=' + encodeURIComponent(chip.model + ' datasheet pdf');
}

// 复制失败按错误码细分提示（抖音隐私协议错误码见 tt.setClipboardData 官方文档）
function handleCopyFail(err) {
  const errNo = err && err.errNo;
  const msg = (err && err.errMsg) || '';
  console.error('[copy fail]', errNo, msg);
  if (errNo === 10201 || msg.indexOf('privacy permission is not authorized') > -1 || msg.indexOf('auth deny') > -1) {
    // 用户拒绝过隐私授权：引导再次点击，官方授权弹窗会再次弹出
    tt.showModal({
      title: '需要剪贴板授权',
      content: '复制功能需要您同意隐私授权。请再次点击按钮，并在弹出的授权提示中选择「允许」。',
      showCancel: false,
      confirmText: '知道了'
    });
  } else if (errNo === 10202 || msg.indexOf('not declared in the privacy agreement') > -1) {
    // 隐私协议未声明剪贴板信息类型：需开发者在抖音后台配置
    tt.showModal({
      title: '复制功能暂不可用',
      content: '剪贴板权限未在隐私协议中声明。请开发者到抖音开放平台后台「设置 - 基础设置 - 用户隐私保护协议」中添加「剪贴板」信息类型后重试。',
      showCancel: false,
      confirmText: '知道了'
    });
  } else {
    tt.showToast({ title: '复制失败，请重试', icon: 'none' });
  }
}

// 复制文本到剪贴板（需在用户点击事件的调用链中使用）
function copyText(text, tip) {
  tt.setClipboardData({
    data: text,
    success: () => {
      // 基础库 2.53.0+ 平台会自动弹「已设置剪切板内容」toast，自定义 toast 可覆盖
      if (tip) tt.showToast({ title: tip, icon: 'none' });
    },
    fail: (err) => handleCopyFail(err)
  });
}

// 查看数据手册：抖音真机无法直接加载未备案的厂商域名，
// 统一采用「复制直链 + 弹窗引导浏览器打开」方案
function openManual(chip) {
  const url = manualUrl(chip);
  const isPdf = /\.pdf(\?|$)/i.test(url);
  tt.setClipboardData({
    data: url,
    success: () => {
      tt.showModal({
        title: '手册链接已复制',
        content: (isPdf ? '已复制 PDF 直链' : '已复制手册获取页链接')
          + '，请在浏览器中粘贴打开即可查看。若链接失效，可点「搜索手册」获取最新结果。',
        showCancel: false,
        confirmText: '好的'
      });
    },
    fail: (err) => handleCopyFail(err)
  });
}

module.exports = {
  searchChips,
  getChipById,
  getChipByModel,
  getHotChips,
  specLine,
  getVendorGroups,
  getCategoryGroups,
  getChipsByVendor,
  getChipsByCategory,
  getHistory,
  addHistory,
  removeHistory,
  clearHistory,
  getFavorites,
  isFavorite,
  toggleFavorite,
  removeFavoriteById,
  getViewHistory,
  addViewHistory,
  clearViewHistory,
  manualUrl,
  searchUrl,
  openManual,
  copyText
};
