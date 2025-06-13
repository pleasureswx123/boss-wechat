import { apiCertification } from '../../../http/api'
import { setSave } from '../../../http/user'
import { debounce } from '../../../utils/util'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    industrySech: "",
    leftList: [],
    rightList: [],
    active: 0,
    timefn: null,
    selectTags: [], // 已选择资格证书
    imageUrl: app.globalData.baseImgUrl, //图片路径
    certificate: [],
    showSj: false,
    tmpIndex: null //临时记录下二级索引
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
      this.data.timefn = debounce(() => {
        let _leftList = this.data.leftList
        _leftList.map(e => {
          let select = false
          e.subList.map((item) => {
            if (this.data.industrySech == '') {
              item.select = true
              select = true
              return
            }
            if (item.name.indexOf(this.data.industrySech) != -1) {
              item.select = true
              select = true
            } else {
              item.select = false
            }
            return item
          })
          e.select = select
          return e
        })
        let _leftIndex = this.data.leftList.findIndex(e => e.select)
        this.setData({
          leftList: _leftList,
          active: _leftIndex,
          rightList: this.data.leftList[_leftIndex].subList
        })
      }, 500)
    }
    this.data.timefn()
  },
  apiCertification() {
    apiCertification().then(res => {
      if (res.code == 200) {
        // 防止第一次填写,没有数据
        this.setData({
          leftList: res.data.map(item => {
            return {
              ...item,
              selecetdNum: 0
            }
          }),
          rightList: res.data[0].subList
        })

        if (this.data.certificate.length > 0) {
          let leftList = []
          this.data.certificate.map(e => {
            leftList = this.data.leftList.map(item => {
              let subList = item.subList.map(i => {
                if (i.name == e) {
                  i.selected = true
                  item.selecetdNum += 1
                }
                if (i.subList.length > 0) {
                  i.subList.map(child => {
                    if (child.name == e) {
                      i.selected = true
                      child.selected = true
                      item.selecetdNum += 1
                    }
                  })
                }
                return {
                  ...i
                }
              })
              return {
                code: item.code,
                id: item.id,
                name: item.name,
                remark: item.remark,
                subList: subList,
                selecetdNum: item.selecetdNum // 当前每一项选中技能的个数
              }
            })
          })
          this.setData({
            leftList: leftList,
            rightList: res.data[0].subList
          })
          console.log(this.data.leftList, '资格证书')
        }
      }
    })
  },
  // 清除操作
  clearTab() {
    let _rightList = this.data.rightList
    let _leftList = this.data.leftList
    _rightList.map((item, index) => {
      item.selected = false
    })
    _leftList.map(item => {
      item.selecetdNum = 0
    })
    this.setData({
      leftList: _leftList,
      rightList: _rightList,
      selectTags: []
    })
  },
  closeSj() {
    this.setData({
      showSj: false,
      tmpIndex: null
    })
  },
  selectedItem(e) {
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let _key = null
    let _key1 = null
    let _key2 = null
    let _val = null
    if (item.subList && item.subList.length > 0) {
      this.setData({
        showSj: true,
        tmpIndex: index,
        sjList: item.subList
      })
      return
    }
    if (this.data.tmpIndex) {
      _key2 = 'rightList[' + this.data.tmpIndex + '].selected'
      _key = 'rightList[' + this.data.tmpIndex + '].subList[' + index + '].selected'
      _val = this.data.rightList[this.data.tmpIndex].subList[index].selected ? false : true
      _key1 = 'sjList[' + index + '].selected'
    } else {
      _key = 'rightList[' + index + '].selected'
      _val = this.data.rightList[index].selected ? false : true
    }
    let _selectTags = this.data.selectTags
    let _leftKey = 'leftList[' + this.data.active + '].selecetdNum'
    let _leftVal = 0
    if (_val && _selectTags.length >= 20) {
      wx.showToast({
        title: '最多选择20个',
        icon: 'none'
      })
      return
    }
    // 如果状态为选中
    if (_val) {
      _selectTags.push(item.name)
      _leftVal = this.data.leftList[this.data.active].selecetdNum += 1
    } else {
      _selectTags = _selectTags.filter(sitem => item.name != sitem)
      _leftVal = this.data.leftList[this.data.active].selecetdNum -= 1
    }
    this.setData({
      [_leftKey]: _leftVal,
      [_key]: _val,
      [_key1]: _val,
      selectTags: _selectTags
    })
    let lh =this.data.rightList[this.data.tmpIndex] && this.data.rightList[this.data.tmpIndex].subList && this.data.rightList[this.data.tmpIndex].subList.filter(cld => cld.selected == true)
    if(!lh) return
    if (lh.length > 0) {
      this.setData({
        [_key2]: true
      })
    } else {
      this.setData({
        [_key2]: false
      })
    }
  },
  clearSingle(e) {
    let litem = e.currentTarget.dataset.item
    let _selectTags = this.data.selectTags
    let _datalist = this.data.leftList
    let _sjList = this.data.sjList
    _selectTags = _selectTags.filter(item => item != litem)
    _datalist.map((item, index) => {
      item.subList.map(sitem => {
        if (sitem.subList.length > 0) {
          sitem.subList.map(child => {
            if (child.name == litem) {
              child.selected = false
              item.selecetdNum -= 1
              if (this.data.showSj) {
                _sjList.map(sj => {
                  if (sj.name == litem) {
                    sj.selected = false
                  }
                })
              }
              let lh = sitem.subList.filter(sl => sl.selected == true)
              if (lh.length > 0) {
                sitem.selected = true
              } else {
                sitem.selected = false
              }
            }
          })

        } else {
          if (sitem.name == litem) {
            sitem.selected = false
            item.selecetdNum -= 1
          }
        }
      })
    })
    this.setData({
      selectTags: _selectTags,
      leftList: _datalist,
      rightList: _datalist[this.data.active].subList,
      sjList: _sjList
    })
  },
  goBack() {
    console.log(this.data.selectTags, '000')
    let param = {
      certificate: this.data.selectTags.join(','),
      userId: wx.getStorageSync('userInfo').info.userId
    }
    setSave(param).then(res => {
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      setTimeout(() => {
        wx.navigateBack()
      }, 500);
    })
  },
  onLoad(options) {
    console.log(options, '传递')
    if (options.certificate !== 'null' && options.certificate !== 'undefined') {
      // 获取当前已经选择得资格证书
      let certificate = options.certificate
      if (certificate !== '') {
        this.setData({
          certificate: certificate.split(','),
          selectTags: certificate.split(',')
        })
      }
    }
    this.apiCertification()
  }
})