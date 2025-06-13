import { apiJobExpectation, apiUpdate, apijobExpectationAdd, apiRemoveById, getPostInfoArea } from '../../../http/api'
import { apiGetAddress } from '../../../http/index'
import { showToast } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wagesIndex: 0,
    wagesIndex2: 0,
    showXz: false,
    show: false,
    dataInfo: {
      jobType: 0
    },
    list: [{ value: '面议', label: '面议', children: [''] }],
    selectedValues: [0, 0], // 默认选中的值
    middle: false,
    qzArray: [],
    jobWantedType: null,
    currentAddress: {}, // 地址对象
    cityShow: false
  },
  //求职类型
  bindPickerChange(e) {
    this.setData({
      ['dataInfo.jobType']: e.detail.value
    })
  },
  selectedMoney() {
    this.setData({
      showXz: true
    })
  },
  cancel() {
    this.setData({
      showXz: false
    })
  },
  changeData(e) {
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
    const yindex = e.detail.value[0] || 0,
      mindex = e.detail.value[2] || 0;
    this.setData({
      wagesIndex: yindex,
      wagesIndex2: mindex,
      // list1: _list1,
      selArr: e.detail.value,
    })
  },
  confirm() {
    let _lowestMoney = `dataInfo.lowestMoney`
    let _maximumMoney = `dataInfo.maximumMoney`
    let _low = '面议'
    let _max = '面议'
    // if (this.data.selArr) {
    _max = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].value
    _low = this.data.list[this.data.wagesIndex].value
    // _max = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label
    // _low = this.data.list[this.data.wagesIndex].label
    //}
    this.setData({
      showXz: false,
      [_lowestMoney]: _low,
      [_maximumMoney]: _max
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
  goDesireindustry(e) {
    let _id = e.currentTarget.dataset.businessid
    wx.navigateTo({
      url: '/subpackPage/user/desireIndustry/desireIndustry?id=' + _id,
    })
  },
  goPositionType() {
    wx.navigateTo({
      url: '/subpackPage/user/positionType/positionType',
    })
  },
  //取消删除求职期望
  closePop() {
    this.setData({
      show: false
    })
  },
  //确定删除求职期望
  surePop() {
    this.closePop()
    apiRemoveById({ id: this.data.id }).then(res => {
      if (res.code == 200) {
        showToast('删除成功')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  },
  del() {
    this.setData({
      show: true
    })
  },
  changeSex(e) {
    let type = e.currentTarget.dataset.type
    let _lowestMoney = `dataInfo.lowestMoney`
    let _maximumMoney = `dataInfo.maximumMoney`
    this.setData({
      ['dataInfo.jobType']: type,
      [_lowestMoney]: null,
      [_maximumMoney]: null
    })
  },
  //选中期望职位
  selectedPost(item) {
    let _postName = `dataInfo.postName`
    let _postId = `dataInfo.postId`
    this.setData({
      [_postName]: item.name,
      [_postId]: item.code
    })
  },
  //选中期望职位
  selectedPost1(item) {
    let _postName = `dataInfo.postName`
    let _postId = `dataInfo.postId`
    this.setData({
      [_postName]: item.level3Name,
      [_postId]: item.level3
    })
  },
  //选中行业
  selectedHy(item) {
    let _businessName = []
    let _businessId = []
    let id = ''
    item.map(item => {
      id = item.code ? item.code : item.id
      _businessName.push(item.name)
      _businessId.push(id)
    })
    let _businessName1 = `dataInfo.businessName`
    let _businessId1 = `dataInfo.businessId`
    this.setData({
      [_businessName1]: _businessName.join(','),
      [_businessId1]: _businessId.join(',')
    })
    console.log(this.data.dataInfo.business, '111')
  },
  //获取求职期望
  getApiJobExpectation() {
    apiJobExpectation({ id: this.data.id }).then(res => {
      console.log(res.data.data, '求职期望信息')
      res.data.data.businessId = res.data.data.business
      this.setData({
        dataInfo: res.data.data,
        wagesIndex: res.data.data.lowestMoney,
      })
      this.postInfoArea(res.data.data.jobCityId)
      let selectedValues = []
      selectedValues[0] = res.data.data.lowestMoney
      selectedValues[1] = 0
      this.data.list[res.data.data.lowestMoney].children.map((item, index) => {
        if (item.value == res.data.data.maximumMoney) {
          selectedValues[2] = index
          this.setData({
            wagesIndex2: index
          })
        }
      })
      this.setData({
        selectedValues: selectedValues
      })
    })
  },
  //快速选择
  selectedCity() {
    let that = this
    let currentAddress = JSON.stringify(this.data.currentAddress)
    let addressDetail = wx.getStorageSync('addressDetail')
    let item = addressDetail && addressDetail.filter(item => item.id == this.data.id)[0]
    if (!item) {
      this.setData({
        location: addressDetail && addressDetail[0].location
      })
    }
    wx.navigateTo({
      url: `/subpackPage/index/cityIndexEdition/index?step=2&addressInfo=${currentAddress}&location=${this.data.location}`,
      events: {
        changeCity: function (data) {
          console.log(data, '选中地址的最后一级')
          that.setData({
            ['dataInfo.jobCityName']: data.name,
            ['dataInfo.jobCityId']: data.id
          })
          that.postInfoArea(data.id)
        }
      }
    })
  },
  // 求职期望地址
  gotoCity() {
    // let addressDetail = wx.getStorageSync('addressDetail')
    //   let item = addressDetail.filter(item=>item.id == this.data.id)[0]
    //   if(!item) {
    //     this.setData({
    //       location: addressDetail[0].location
    //     })
    //   }
    //   this.setData({cityShow: true})
    let that = this
    let currentAddress = JSON.stringify(this.data.currentAddress)
    let addressDetail = wx.getStorageSync('addressDetail')
    let item = addressDetail.filter(item => item.id == this.data.id)[0]
    if (!item) {
      this.setData({
        location: addressDetail[0].location
      })
    }
    wx.navigateTo({
      url: `/subpackPage/index/city/index?addressInfo=${currentAddress}&type=${1}&location=${this.data.location}`,
      // url: `/subpackPage/index/city/index?type=${1}`,
      events: {
        changeCity: function (data) {
          console.log(data, '选中地址的最后一级')
          that.setData({
            ['dataInfo.jobCityName']: data.name,
            ['dataInfo.jobCityId']: data.id
          })
          that.postInfoArea(data.id)
        }
      }
    })
  },
  // 获取当前点击的求职期望或者添加求职期望获取地址
  async postInfoArea(id) {
    let params = {
      id
    }
    const res = await getPostInfoArea(params)
    console.log(res, '0000,地址')
    if (res.code !== 200) return
    this.setData({
      currentAddress: res.data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '8888::::::::::::::')
    if (options.location) { this.setData({ location: options.location }) }
    if (options.step) { wx.hideHomeButton() }
    this.getSalary()
    //判断如果有求职id获取详情赋值
    if (options.val) { options.id = options.val }
    //添加逻辑当求职期望只有一个不可删除
    if (options.num) { this.setData({ num: Number(options.num) }) }
    if (options.id) {
      this.setData({ id: options.id })
      this.getApiJobExpectation()
    } else {
      // let postAddress = wx.getStorageSync('postAddress')
      // let postAddressId = wx.getStorageSync('postAddressId')
      if (options.step) {
        this.getLocationAsync()
      } else {
        let postArea = wx.getStorageSync('postArea')
        this.setData({
          ['dataInfo.jobCityName']: postArea.name
        })
        this.postInfoArea(postArea.id)
      }
    }
    if (wx.getStorageSync('dictionary')) {
      let _qzArray = wx.getStorageSync('dictionary')[39]
      this.setData({
        qzArray: _qzArray
      })
    }
  },
  // 获取当前经纬度
  async getLocationAsync() {
    try {
      const location = await this.getLocation();
      // 在这里可以继续处理获取到的定位信息
      this.setData({
        latitude: location.latitude,
        longitude: location.longitude
      })
      let params = {
        lon: this.data.longitude,
        lat: this.data.latitude
      }
      const result = await apiGetAddress(params)
      console.log(result, '当前位置')
      if (result.code !== 200) return showToast(result.msg)
      this.setData({
        ['dataInfo.jobCityName']: result.data.streetName
      })
      this.postInfoArea(result.data.streetId)
      wx.setStorageSync('postArea', { name: result.data.streetName, id: result.data.streetId })
    } catch (err) {
      // 处理定位失败的情况
      console.error(err);
      this.setData({
        locationAddress: '不限',
      });
      wx.removeStorageSync('postAddress');
      // wx.removeStorageSync('postAddressId');
    }
  },
  // 获取经纬度
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        geocode: true,
        success(res) {
          console.log(res, '定位位置');
          resolve({
            latitude: res.latitude,
            longitude: res.longitude
          });
        },
        fail(err) {
          console.log(err, '错误');
          reject(err);
        }
      });
    });
  },
  //新增保存求职期望
  submitPost() {
    console.log(parseFloat(this.data.dataInfo.lowestMoney))
    let _expectedMoneyStatus = 1
    if (this.data.dataInfo.lowestMoney == '面议') {
      _expectedMoneyStatus = 0
    }
    if (!this.data.dataInfo.postName || !this.data.dataInfo.postId) {
      showToast('请先选择期望职位')
      return
    }
    let dataList = {
      id: this.data.id,//ID
      business: this.data.dataInfo.businessId, //行业ID
      businessName: this.data.dataInfo.businessName, //行业
      businessStatus: this.data.dataInfo.businessId ? 1 : 0,  //默认
      expectedMoneyStatus: _expectedMoneyStatus,//薪资范围
      jobCityId: this.data.dataInfo.jobCityId || '30890', //城市Id
      jobCityName: this.data.dataInfo.jobCityName || '三河市', //城市名称
      jobType: this.data.dataInfo.jobType,  //求职类型 0 全职 1 是兼职
      postId: this.data.dataInfo.postId, //职位ID
      postName: this.data.dataInfo.postName,  //职位名称
      lowestMoney: 0,//最低工资
      maximumMoney: 0, //最高工资
    }
    if(_expectedMoneyStatus == 1 && this.data.dataInfo.jobType == 0){
      dataList.lowestMoney = parseFloat(this.data.dataInfo.lowestMoney) //最低工资
      dataList.maximumMoney = parseFloat(this.data.dataInfo.maximumMoney) //最高工资
    }
    wx.showLoading({
      title: '保存中',
    })
    if (!this.data.id) {
      console.log('没有ID')
      console.log(dataList, 'dataList')
      // return
      this.getjobExpectationAdd(dataList)
    } else {
      console.log('eID')
      console.log(dataList, 'dataList')
      // return
      this.getApiUpdate(dataList)
    }
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('changeEdit', true);
    wx.removeStorageSync('postNumItem')
  },
  //修改求职期待 保存
  async getApiUpdate(dataList) {
    let { code, data, msg } = await apiUpdate(dataList)
    if (code !== 200) {
      wx.hideLoading()
      showToast(msg)
      return
    }
    wx.hideLoading()
    showToast(msg)
    wx.navigateBack({
      delta: 1
    })
  },
  //添加求职期望			
  async getjobExpectationAdd(dataList) {
    let { code, data, msg } = await apijobExpectationAdd(dataList)
    wx.hideLoading()
    if (code !== 200) {
      showToast(msg)
      return
    }
    let step = wx.getStorageSync('userInfo').step
    if (step) {
      wx.reLaunch({
        url: "/subpackPage/user/personalInfo/personalInfo?step=" + step
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  closeCityShow() {
    this.setData({
      cityShow: false
    })
  },
  changeCity: function (data) {
    console.log(data, '选中地址的最后一级')
    this.setData({
      ['dataInfo.jobCityName']: data.detail.name,
      ['dataInfo.jobCityId']: data.detail.id,
      cityShow: false
    })
    this.postInfoArea(data.detail.id)
  },
  // 关闭选择薪资弹窗
  onClose() {
    this.setData({ showXz: false })
  }
})