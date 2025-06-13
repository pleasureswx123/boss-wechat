import { getSelfJobExpectation, setSelfJobExpectation } from '../../../http/versions'
import { showToast } from '../../../utils/util'
var app = getApp()
let currentYear = new Date().getFullYear(); // 获取当前年份
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showXz: false,
    list: [{ value: '面议', label: '面议', children: [''] }],
    selectedValues: [0, 0], // 默认选中的值
    middle: false,
    wagesIndex: 0,
    wagesIndex2: 0,
    userInfo: null,
    ExpType: '请选择求职状态',
    imageUrl: app.globalData.baseImgUrl, //图片路径
    jobAddr: '请选择求职区域',
    cityShow: false,
    cityItem: '', // 传递给popup弹窗组件的对象数据
    copyCityItem: '', // 复制一份当前地址
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _statausData = wx.getStorageSync('dictionary')[34]
    this.setData({
      statausData: _statausData
    })
    this.getUserInfo()
    this.getSalary()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },
  changeSel(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.statausData
    for (let i = 0; i < list.length; i++) {
      list[i].selected = false
    }
    list[index].selected = true
    this.setData({
      statausData: list,
      ExpType: list[index].name,
      show: false,
      ['userInfo.jobWantedStatus']: list[index].code
    })
    console.log('code', list[index].code)
  },
  // 获取用户信息
  getUserInfo() {
    getSelfJobExpectation().then(result => {
      console.log(result, '用户信息')
      if (result.code == 200) {
        let statausData = this.data.statausData
        // result.data.areaInfo.cityName + 
        this.setData({
          cityAllName: (result.data.areaInfo.districtName || result.data.areaInfo.cityName) + (result.data.areaInfo.streetName || ''),
          postListName: result.data.exs.map(item => item.postName).join(","),
          ExpType: result.data.jobWantedStatus && statausData[result.data.jobWantedStatus - 1].name || '请选择求职状态',
          postList: result.data.exs.map(item => {
            return { ...item }
          }),
          userInfo: result.data,
          // cityItem: result.data.areaInfo,
          copyCityItem: result.data.areaInfo
        })
      }
    })
  },
  //弹出层隐藏
  onClose() {
    this.setData({ showXz: false, show: false })
  },
  // 选择月薪
  changeData(e) {
    console.log(e, '选择')
    const selectedValues = e.detail.value;
    this.setData({
      middle: true,
      selectedValues: selectedValues
    });
    if (e.detail.value[0] == 0) {
      this.setData({
        middle: false,
      });
    }
    // wx.setStorageSync('selectedValues', selectedValues);
    const yindex = e.detail.value[0] || 0,
      mindex = e.detail.value[2] || 0;
    console.log(yindex, mindex, '999')
    this.setData({
      wagesIndex: yindex,
      wagesIndex2: mindex,
      // list1: _list1,
      selArr: e.detail.value,
    })
  },
  // 选择月薪确定
  confirm() {
    let _lowestMoney = `userInfo.lowestMoney`
    let _maximumMoney = `userInfo.maximumMoney`
    let _expectedMoneyStatus = `userInfo.expectedMoneyStatus`
    let _low = '面议'
    let _max = '面议'
    let _status = 1
    _max = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].value || 0
    _low = this.data.list[this.data.wagesIndex].value
    _status = this.data.list[this.data.wagesIndex].value == '面议' ? 0 : 1
    this.setData({
      showXz: false,
      [_lowestMoney]: _low,
      [_maximumMoney]: _max,
      [_expectedMoneyStatus]: _status
    })
  },
  getSalary() {
    let _list = this.data.list
    const less30 = new Array(29).fill(1).map((e, i) => {
      const num = i + 1;
      const value = i + 1;
      const label = num >= 10 ? `${Math.floor(num / 10)}.${num % 10}万` : `${num}千`;
      return {
        value,
        label,
        children: [],
      };
    });
    const less100 = new Array(14).fill(1).map((e, i) => {
      const num = i * 5 + 30;
      const value = i * 5 + 30;
      const label = num >= 10 ? `${Math.floor(num / 10)}.${num % 10}万` : `${num}千`;
      return {
        value,
        label,
        children: [],
      };
    });

    const less160 = new Array(7).fill(1).map((e, i) => {
      const num = i * 10 + 100;
      const value = i * 10 + 100;
      const label = num >= 10 ? `${Math.floor(num / 10)}.${num % 10}万` : `${num}千`;
      return {
        value,
        label,
        children: [],
      };
    });
    const listA = [..._list, ...less30, ...less100, ...less160];

    listA.map(e => {
      if (e.value < 10) {
        for (let j = e.value; j < e.value + 5; j++) {
          e.children.push({
            value: j + 1,
            // label: `${j + 1}K`,
            label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
          })
        }
      } else {
        for (let j = e.value; j < e.value * 2; j++) {
          if (e.value < 40 && (j + 1) % 2 == 0) {
            const value = e.value % 2 == 0 ? j + 1 : j + 2;
            e.children.push({
              value,
              // label: `${value}K`,
              label: value >= 10 ? `${Math.floor(value / 10)}.${value % 10}万` : `${value}千`
            })
          } else if (e.value >= 40 && e.value < 80 && (j + 1) % 5 == 0) {
            e.children.push({
              value: j + 1,
              // label: `${j + 1}K`,
              label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
            })
          } else if (e.value >= 80 && e.value <= 160 && (j + 1) % 10 == 0) {
            e.children.push({
              value: j + 1,
              // label: `${j + 1}K`,
              label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
            })
          }
        }
      }
    })
    this.setData({
      list: listA,
    })
  },
  //跳转
  goOtherPage(e) {
    let type = e.currentTarget.dataset.type
    let that = this
    if (type == 'job') {
      wx.navigateTo({
        url: `/subpackPage/versions/classicsPostType/classicsPostType?step=1&postList=${JSON.stringify(this.data.postList)}`,
        events: {
          selectTags: function (data) {
            let _selectedList = data.selectTags.ids
            setTimeout(() => {
              that.setData({
                postListName: _selectedList.map(item => item.postName).join(","),
                ['userInfo.exs']: _selectedList
              })
            }, 100)
          }
        }
      })
    } else if (type == 'money') {
      this.setData({ showXz: true })
    } else if (type == 'area') {
      this.setData({ cityShow: true,cityItem:this.data.copyCityItem})
      // let item=this.data.userInfo.areaInfo
      // wx.navigateTo({
      //     url: `/subpackPage/index/newjdCity/index?city=${JSON.stringify(item)}&step=2`,
      //     events: {
      //         changeAddr: function (data) {
      //             console.log(data.addressDetail)
      //             that.setData({
      //               ['userInfo.cityName']:data.addressDetail.name,
      //               ['userInfo.cityId']:data.addressDetail.id,
      //               cityAllName:data.addressDetail.allName
      //             })
      //         }
      //     }
      // })
    } else if (type == 'status') {
      let list = this.data.statausData
      list.map(res => {
        if (res.name == this.data.ExpType) {
          res.selected = true
        }
      })
      this.setData({
        show: true,
        statausData: list
      })
    }
  },

  changeAddr(data) {
    console.log(data.detail,'返回的数据')
    this.setData({
      ['userInfo.cityName']: data.detail.name,
      ['userInfo.cityId']: data.detail.id,
      cityAllName: data.detail.allName,
      cityShow: false,
      cityItem: ''
    })
  },
  //保存
  async saveData() {
    let that = this
    // if (!this.data.userInfo.jobWantedStatus) { 
    //   showToast('请选择求职状态')
    //   return
    // }
    const params = { ...this.data.userInfo }
    if (params.lowestMoney == '面议') {
      params.lowestMoney = 0
    }
    delete params.areaInfo
    console.log(params, '0000')
    // 接口
    const res = await setSelfJobExpectation(params)
    if (res.code == 200) {
      showToast('保存成功')
      setTimeout(() => {
        const eventChannel = that.getOpenerEventChannel();
        eventChannel.emit('changePostList');
        wx.navigateBack({
          delta: 1 //返回上一级页面
        })
      }, 500)
    }
  },

  onClosecityShow() {
    this.setData({ cityShow: false,cityItem: ''})
  }
})