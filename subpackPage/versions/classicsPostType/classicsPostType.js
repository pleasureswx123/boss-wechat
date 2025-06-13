import { dictionaryPosts } from '../../../http/api'
import { debounce, showToast } from '../../../utils/util'
import { getSimpleList, saveSelectpost, searchPostsList } from '../../../http/versions'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    industrySech: "",
    leftList: [],
    rightList: [],
    active: 0,
    timefn: null,
    keyWord: '',
    maxlength: '-1',
    selectPostList: [], // 选择的职位
    selectList: [], // 搜索四级
    pageSize: 50, // 条数
    pageNum: 1 // 页码
  },
  changeItem(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      active: index,
      rightList: this.data.leftList[index].subList
    })
  },
  // 选择职位
  selectedItem(e) {
    let { item, code, index } = e.currentTarget.dataset
    console.log(item, '222')
    let _selectPostList = this.data.selectPostList
    const newArr = this.data.leftList
    // 找到祖父级对应索引
    let grandfatherIndex = this.data.leftList.findIndex(i => i.code == item.grandfatherCode)
    // 找到父级对应索引
    let fatherIndex = this.data.leftList[grandfatherIndex].subList.findIndex(e => e.code == item.fatherCode)
    // 判断是否相同
    if (newArr[grandfatherIndex].subList[fatherIndex].subList[index].code == code) {
      if (newArr[grandfatherIndex].subList[fatherIndex].subList[index].select) {
        // 更改状态并过滤
        newArr[grandfatherIndex].subList[fatherIndex].subList[index].select = false
        _selectPostList = _selectPostList.filter(e => e.code !== code)
        newArr[grandfatherIndex].selectNum = newArr[grandfatherIndex].selectNum - 1
      } else {
        if (_selectPostList.length > 2) {
          showToast('最多选择3个')
        } else {
          // 更改状态并追加
          newArr[grandfatherIndex].subList[fatherIndex].subList[index].select = true
          _selectPostList.push(newArr[grandfatherIndex].subList[fatherIndex].subList[index])
          newArr[grandfatherIndex].selectNum = newArr[grandfatherIndex].selectNum + 1
        }
      }
    }
    this.setData({
      leftList: newArr,
      rightList: newArr[this.data.active].subList,
      selectPostList: _selectPostList
    })
  },
  onLoad(options) {
    if (options.step) {
      this.setData({
        step: options.step
      })
    }
    if (options.type == 'addPost') {
      this.setData({
        type: options.type
      })
    }
    this.setData({ postList: JSON.parse(options.postList) })
    console.log(this.data.postList, '0000')
    this.simpleList(JSON.parse(options.postList))
  },
  // 获取经典版职位列表
  async simpleList(_postList) {
    const res = await getSimpleList()
    let _selectPostList = this.data.selectPostList
    if (res.code !== 200) return showToast(res.msg)
    let leftList = res.data.map(item => {
      item.selectNum = 0
      let subList = item.subList.map(i => {
        let subList2 = i.subList.map(e => {
          e.select = false
          _postList.map(it => {
            if (it.postId == e.code) {
              e.id = it.id
              _selectPostList.push({ ...e, fatherCode: i.code, grandfatherCode: item.code })
              e.select = true
            }
          })
          if (e.select) {
            item.selectNum = item.selectNum + 1
          }
          return {
            ...e,
            select: e.select,
            fatherCode: i.code,
            grandfatherCode: item.code
          }
        })
        return {
          ...i,
          subList: subList2
        }
      })
      return {
        ...item,
        subList: subList,
        selectNum: item.selectNum
      }
    })
    console.log(_selectPostList, '1111')
    this.setData({
      leftList: leftList,
      rightList: leftList[0].subList,
      selectPostList: _selectPostList
    })
    console.log(this.data.leftList, '9999')
  },
  // 底部区域列表删除
  deleteCurrent(event) {
    let { item, code, index } = event.currentTarget.dataset
    console.log(item)
    this.data.selectPostList = this.data.selectPostList.filter(e => e.code !== code)
    const newArr = this.data.leftList
    // 找到祖父级对应索引
    let grandfatherIndex = this.data.leftList.findIndex(i => i.code == item.grandfatherCode)
    // 找到父级对应索引
    let fatherIndex = this.data.leftList[grandfatherIndex].subList.findIndex(e => e.code == item.fatherCode)
    newArr[grandfatherIndex].selectNum = newArr[grandfatherIndex].selectNum - 1
    newArr[grandfatherIndex].subList[fatherIndex].subList.map(i => {
      if (i.code == code) {
        i.select = false
      }
      return i
    })

    this.setData({
      leftList: newArr,
      rightList: newArr[this.data.active].subList,
      selectPostList: this.data.selectPostList,
    })
  },
  // 底部按钮清除事件
  cancelFn() {
    // 清空选中列表
    // 恢复两边选中状态
    let leftList = this.data.leftList.map(item => {
      item.selectNum = 0
      let subList = item.subList.map(i => {
        let subList2 = i.subList.map(e => {
          e.select = false
          return {
            ...e,
            select: e.select,
            fatherCode: i.code,
            grandfatherCode: item.code
          }
        })
        return {
          ...i,
          subList: subList2
        }
      })
      return {
        ...item,
        subList: subList,
        selectNum: item.selectNum
      }
    })
    this.setData({
      leftList: leftList,
      rightList: leftList[this.data.active].subList,
      selectPostList: []
    })
  },
  // 底部按钮确定事件
  async confirmSave() {
    // 从用户第一次登陆获取到的地址信息
    // let postArea = wx.getStorageSync('postArea')
    // let params = {
    //   cityId: postArea.id,
    //   cityName: postArea.name,
    //   ids: this.data.selectPostList.map(item => {
    //     return {
    //       postId: item.code,
    //       postName: item.name,
    //       id: item.id ? item.id : ''
    //     }
    //   })
    // }
    // 首页点击添加求职期望使用
    if (this.data.step == 1) {
      const eventChannel = this.getOpenerEventChannel();
      // 触发事件并传递数据
      eventChannel.emit('selectTags', {
        selectTags: {
          ids: this.data.selectPostList.map(item => {
            return {
              postId: item.code,
              postName: item.name,
              id: item.id ? item.id : ''                                                       
            }
          })
        }
      });
      wx.navigateBack({
        delta: 1 //返回上一级页面
      })
    } else {
      // const res = await saveSelectpost(params)
      // if (res.code !== 200) return showToast(res.msg)
      // showToast('保存成功')
      const eventChannel = this.getOpenerEventChannel();
      let ids = this.data.selectPostList.map(item=>{
        return{
          postId: item.code,
          postName: item.name,
          id: item.id ? item.id : ''
        }
      })
      eventChannel.emit('changePostList',ids);
      wx.navigateBack({
        delta: 1 //返回上一级页面
      })
    }
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
  // input事件
  input(event) {
    // console.log(event, '0000')
    this.setData({
      timefn: this.debounce(() => {
        this.searchResultLikst(event)
      }, 500),
      keyWord: event.detail.value
    })
    this.data.timefn()
  },
  // 聚焦事件和input事件使用(模糊匹配结收拾结果)
  searchResultLikst(event) {
    if (event.detail.value.trim()) {
      let params = {
        pageSize: this.data.pageSize,
        pageNum: this.data.pageNum,
        keyWord: event.detail.value,
        calsses: true, // 经典版搜索
      }
      searchPostsList(params).then(res => {
        console.log(res, '模糊匹配')
        const regex = new RegExp(event.detail.value, "gi");
        const highlightedResult = res.data.list.map((item, index) => {
          return {
            ...item,
            highlightedResult: item.textName.replace(regex, (match) => `<span style="color: red;">${match}</span>`)
          }
        });
        // console.log(highlightedResult,'模糊匹配');
        let selectList = highlightedResult
        this.setData({
          selectList
        })
      })
    } else {
      this.setData({
        selectList: []
      })
    }
  },
  // 搜索列表选中某一个岗位
  searchTap(event) {
    let { clevel1, clevel2, clevel3 } = event.currentTarget.dataset.item
    let _selectPostList = this.data.selectPostList
    // 求职期望已经选择完了
    if (_selectPostList.length >= 3) {
      this.clearKeyWord()
      return showToast('最多选择三个')
    }
    // 根据对应code查找选中的三级
    const newArr = this.data.leftList
    // 找到祖父级对应索引
    let grandfatherIndex = this.data.leftList.findIndex(i => i.code == clevel1)
    // 找到父级对应索引
    let fatherIndex = this.data.leftList[grandfatherIndex].subList.findIndex(e => e.code == clevel2)
    // 判断是否相同
    newArr[grandfatherIndex].subList[fatherIndex].subList.map(item => {
      if (item.code == clevel3) {
        if (item.select) {
          // 更改状态并过滤
          item.select = false
          _selectPostList = _selectPostList.filter(e => e.code !== clevel3)
          newArr[grandfatherIndex].selectNum = newArr[grandfatherIndex].selectNum - 1
        } else {
          if (_selectPostList.length > 2) {
            showToast('最多选择3个')
          } else {
            // 更改状态并追加
            item.select = true
            _selectPostList.push(item)
            newArr[grandfatherIndex].selectNum = newArr[grandfatherIndex].selectNum + 1
          }
        }
      }
    })
    this.setData({
      leftList: newArr,
      rightList: newArr[this.data.active].subList,
      selectPostList: _selectPostList
    })
    this.clearKeyWord()
  },
  // 清除控件清除输入内容
  clearKeyWord() {
    this.setData({ keyWord: '', selectList: [] })
  }
})