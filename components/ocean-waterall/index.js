Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
  },
  properties: {
    list: {
      type: Array,
      value: []
    },
    column: {
      type: Number,
      value: 2
    },
    refresh: {
      type: Boolean,
      value: false
    }
  },
  data: {
    flowData: {},
    columnHeights: {}
  },
  observers: {
    'list': function (newVal, oldVal) {
      console.log(newVal, oldVal,'newVal, oldVal')
      if (!newVal || newVal.length === 0) return;
      if (this.data.refresh || oldVal === undefined) {
        this.resetColumns();
        this.updateWaterfallLayout(newVal);
      } else {
        const newItems = newVal.slice(oldVal.length);
        console.log(newItems, "newItems");
        this.updateWaterfallLayout(newItems);
      }
    }
  },
  methods: {
    resetColumns() {
      const columns = {};
      const heights = {};
      for (let i = 1; i <= this.data.column; i++) {
        columns[`column_${i}`] = [];
        heights[`column_${i}`] = 0;
      }
      this.setData({
        flowData: columns,
        columnHeights: heights
      });
    },
    async updateWaterfallLayout(newItems = []) {
      for (
        let originalIndex = 0;
        originalIndex < newItems.length;
        originalIndex++
      ) {
        const item = newItems[originalIndex];

        // 找到最短的列
        let shortestColumn = Object.keys(this.data.columnHeights).reduce(
          (shortest, currentColumn) =>
            this.data.columnHeights[currentColumn] < this.data.columnHeights[shortest]
              ? currentColumn
              : shortest
        );

        // 将项目及其原始索引添加到最短的列中
        const updatedFlowData = JSON.parse(JSON.stringify(this.data.flowData))
        updatedFlowData[shortestColumn].push({ ...item, index: originalIndex });
        
        this.setData({
          flowData: updatedFlowData
        })
        // 使用 nextTick 确保 DOM 已更新
        await wx.nextTick();

        // 更新列的高度
        await this.calculateColumnHeight(shortestColumn.replace("column_", ""));
      }
    },
    calculateColumnHeight(columnIndex) {
      // 使用SelectorQuery获取元素尺寸信息
      const query = wx.createSelectorQuery().in(this);
      query.select(`#cont_${columnIndex}`).boundingClientRect(rect => {
        if (rect) {
          const heights = this.data.columnHeights;
          heights[`column_${columnIndex}`] = rect.height;
          this.setData({ columnHeights: heights });
        }
      }).exec();
    }
  },
  ready() {
    // 初始化列数据和高度
    const columns = {};
    const heights = {};
    for (let i = 1; i <= this.data.column; i++) {
      columns[`column_${i}`] = [];
      heights[`column_${i}`] = 0;
    }
    this.setData({
      flowData: columns,
      columnHeights: heights
    });
  }
});