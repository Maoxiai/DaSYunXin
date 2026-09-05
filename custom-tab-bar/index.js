Component({
  data: {
    selected: 0,
    color: '#999999',
    selectedColor: '#4A90E2',
    indicatorLeft: 12.5,
    list: [
      { pagePath: '/pages/index/index', text: '首页', iconPath: '/assets/tabbar/home.png', selectedIconPath: '/assets/tabbar/home-active.png', sel: true },
      { pagePath: '/pages/category/category', text: '分类', iconPath: '/assets/tabbar/category.png', selectedIconPath: '/assets/tabbar/category-active.png', sel: false },
      { pagePath: '/pages/tools/tools', text: '工具箱', iconPath: '/assets/tabbar/tools.png', selectedIconPath: '/assets/tabbar/tools-active.png', sel: false },
      { pagePath: '/pages/mine/mine', text: '我的', iconPath: '/assets/tabbar/mine.png', selectedIconPath: '/assets/tabbar/mine-active.png', sel: false }
    ]
  },

  // 选中态变化时同步 list 的 sel 与指示器位置
  observers: {
    selected: function (selected) {
      const list = this.data.list.map((item, i) => Object.assign({}, item, { sel: i === selected }));
      this.setData({ list, indicatorLeft: selected * 25 + 12.5 });
    }
  },

  methods: {
    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index);
      const path = e.currentTarget.dataset.path;
      this.setData({ selected: index });
      tt.switchTab({ url: path });
    }
  }
});
