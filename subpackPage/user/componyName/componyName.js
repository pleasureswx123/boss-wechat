import { getCompanySimplelist } from '../../../http/user'
import { showToast } from '../../../utils/util'
Page({
  data: {
    name: '',
    timefn: null, // 定时器
    searchListAsync: [], // 检索用户搜索的内容
  },
  confirmValue(event) {
    this.setData({
      name: event.detail.value
    })
    if(event.detail.value == '') return this.setData({timefn: null,searchListAsync: []})
    this.setData({
      timefn: this.debounce(() => {
        this.searchResultLikst(event)
      }, 500)
    })
    this.data.timefn()
  },
  // 聚焦事件
  inputFocus(event){
    this.searchResultLikst(event)
  },
  goBack() {
    let pages = getCurrentPages();
    let beforePage = pages[pages.length - 2];
    beforePage.setCompany(this.data.name);
    wx.navigateBack()
  },
  onLoad(options) {
    this.setData({
      name: options.val
    })
  },
  debounce(func, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  },
  // 聚焦事件和input事件使用(模糊匹配结收拾结果)
  searchResultLikst(event) {
    if (event.detail.value.trim()) {
      getCompanySimplelist({ name: event.detail.value }).then(res => {
        console.log(res, '模糊匹配')
        if (res.rows.length <= 10) {
          const regex = new RegExp(event.detail.value, "gi");
          const highlightedResult = res.rows.map((item, index) => {
            return {
              ...item,
              highlightedResult: item.name.replace(regex, (match) => `<span style="color: #FE0201;">${match}</span>`)
            }
          });
          console.log(highlightedResult);
          let searchListAsync = highlightedResult
          this.setData({
            searchListAsync
          })
        } else {
          const regex = new RegExp(event.detail.value, "gi");
          const highlightedResult = res.rows.map((item, index) => {
            return {
              ...item,
              highlightedResult: item.name.replace(regex, (match) => `<span style="color: #FE0201;">${match}</span>`)
            }
          });
          let searchListAsync = res.rows.slice(0, 10)
          this.setData({
            searchListAsync
          })
        }
      })
    } else {
      this.setData({
        searchListAsync: []
      })
    }
  },
  // 选择一个公司
  selectComponyName(event){
    console.log(event)
    let item = event.currentTarget.dataset.componyitem
    this.setData({
      name: item.name,
      searchListAsync: []
    })
  }
})