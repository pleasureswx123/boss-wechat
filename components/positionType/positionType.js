// import { dictionaryPosts } from '../../http/api'
import { getpostsSimpleBy } from '../../http/index'
import { debounce } from '../../utils/util'
var app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    positionTypeHeight: {
      type: Number,
      value: 0
    },
    transmitData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    industrySech: "",
    leftList: [],
    rightList: [],
    active: 0,
    timefn: null,
    globalBottom: app.globalData.globalBottom,
    baseImageUrl: app.globalData.baseImgUrl
  },
  lifetimes: {
    ready() {
      this.getDictionaryPosts()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('onClose')
    },
    changeItem(e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        active: index,
        rightList: this.data.leftList[index].subList
      })
    },
    searchChange(event) {
      this.setData({
        industrySech: event.detail.value
      })
      if (!this.data.timefn) {
        this.data.timefn = debounce(async () => {
          if (this.data.industrySech.trim() == '') {
            console.log(333)
            this.getDictionaryPosts()
            return
          }
          let _leftList = this.findFirstLevelData(this.data.leftList, this.data.industrySech)
          const uniqueArr = _leftList.reduce((prev, curr) => {
            if (!prev.includes(curr)) {
              prev.push(curr);
            }
            return prev;
          }, []);
          console.log(uniqueArr, '111')
          let _leftIndex = this.data.leftList.findIndex(e => e.select)
          console.log(_leftIndex, '888')
          this.setData({
            leftList: uniqueArr,
            active: _leftIndex,
            rightList: uniqueArr[_leftIndex].subList
          })
        }, 500)
      }
      this.data.timefn()
    },
    // 补充(ghy)
    // 根据符合要求的数组去查找数据中第一层数据 返回值是接口数据中第一层数据
    findFirstLevelData: function (data, targetName) {
      const targetData = this.findDataByName(data, targetName);
      if (targetData.length > 0) {
        return this.findLeftListData(targetData, data)
      }
      return null;
    },
    // 查找出第一层数据
    findLeftListData(targetData, data) {
      let firstLevelData = [];
      targetData.map(i => {
        data.map(e => {
          if (e.name == i.name) {
            firstLevelData.push(e)
          } else {
            e.subList.map(ie => {
              if (ie.name == i.name) {
                firstLevelData.push(e)
              } else {
                ie.subList.map(m => {
                  if (m.name == i.name) {
                    firstLevelData.push(e)
                  }
                })
              }
            })
          }
        })
      })
      let a = [];
      data.map(item => {
        item.select = false
        firstLevelData.map(it => {
          if (it.code == item.code) {
            item.select = true
          }
        })
        a.push(item)
      })
      return a;
    },
    // 查找出数据中符合要求的内容 返回值是一个数组
    findDataByName: function (data, targetName) {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.name.includes(targetName)) {
          result.push({ ...item, select: true });
        } else if (item.searchName?.includes(targetName)) {
          result.push({ ...item, select: true });
        }
        if (item.subList && item.subList.length > 0) {
          const childResult = this.findDataByName(item.subList, targetName);
          result.push(...childResult);
        }
      }
      return result;
    },
    // 处理数据 (处理数据中第三层数据英文字符串 小写)
    transition(name) {
      var pattern = new RegExp("[A-Za-z]+");
      if (pattern.test(name)) {
        name = name.toLowerCase()
        return name
      } else {
        return name
      }
    },

    getDictionaryPosts() {
      let _id = this.data.transmitData && this.data.transmitData.id || 0
      getpostsSimpleBy(_id).then(res => {
        if (res.code == 200) {
          // 循环调用处理数据方法,为其第三层数据新增一个处理好英文字符的数据
          // 暂时只增加英文全部小写的字段 (searchName)
          let leftList = res.data.map(item => {
            let subList = item.subList.map(i => {
              let subList = i.subList.map(e => {
                let searchName = this.transition(e.name)
                return {
                  ...e,
                  searchName: searchName
                }
              })
              return {
                id: i.id,
                code: i.code,
                name: i.name,
                remark: i.remark,
                subList: subList
              }
            })
            return {
              id: item.id,
              code: item.code,
              name: item.name,
              remark: item.remark,
              subList: subList,
              // select: true,
              // pitch: false
            }
          })
          this.setData({
            leftList: leftList,
            rightList: res.data[0].subList
          })
        }
      })
    },
    selectedItem(e) {
      let {item} = e.currentTarget.dataset
      // let pages = getCurrentPages();
      // let beforePage = pages[pages.length - 2];
      // beforePage.selectedPost(item);
      this.triggerEvent('onClick', item)
      // wx.navigateBack({
      //     delta: 1 //返回上一级页面
      // })
    },
  }
})