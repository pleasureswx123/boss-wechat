import { showToast } from '../../../utils/util'
import { getPostInfoArea,apijobExpectationAdd } from '../../../http/api'
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.baseImgUrl,
    dataInfo: {
      jobType: 0,
      businessName:'不限',
      businessId:'',
      businessStatus:0
    },
    qzArray: [],
    selectedType:null,
    wagesIndex:4,
    selectedValues: [0, 0], // 默认选中的值
    list: [{ value: '面议', label: '面议', children: [''] }],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.postItem){
      this.selectedPost1(JSON.parse(options.postItem))
    }
    if (wx.getStorageSync('dictionary')) {
      let _qzArray = wx.getStorageSync('dictionary')[39]
      this.setData({
        qzArray: _qzArray.splice(0,2)
      })
    }
    this.getSalary()
    let postArea = wx.getStorageSync('postArea')
    this.setData({
      ['dataInfo.jobCityName']: postArea.name
    })
    this.postInfoArea(postArea.id)
  },
   //求职类型
   selectedType(e) {
     let _val = e.currentTarget.dataset.value
    this.setData({
      selectedType:_val,
      ['dataInfo.jobType']: _val
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
    //选择行业
    goDesireindustry(e) {
      let _id = e.currentTarget.dataset.businessid
      wx.navigateTo({
        url: '/subpackPage/user/desireIndustry/desireIndustry?id=' + _id,
      })
    },
     //快速选择
    selectedCity(){
      let that = this
      let currentAddress = JSON.stringify(this.data.currentAddress)
      let addressDetail = wx.getStorageSync('addressDetail')
      let item =addressDetail && addressDetail.filter(item => item.id == this.data.id)[0]
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
  changeData(e) {
    console.log(e, '选择')
    const selectedValues = e.detail.value;
    this.setData({
      selectedValues: selectedValues
    });
    const yindex = e.detail.value[0] || 0,
      mindex = e.detail.value[1] || 0;
    console.log(yindex, mindex, '999')
    this.setData({
      wagesIndex: yindex,
      wagesIndex2: mindex,
      // list1: _list1,
      selArr: e.detail.value,
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
            label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
          })
        }
      } else {
        for (let j = e.value; j < e.value * 2; j++) {
          if (e.value < 40 && (j + 1) % 2 == 0) {
            const value = e.value % 2 == 0 ? j + 1 : j + 2;
            e.children.push({
              value,
              label: value >= 10 ? `${Math.floor(value / 10)}.${value % 10}万` : `${value}千`
            })
          } else if (e.value >= 40 && e.value < 80 && (j + 1) % 5 == 0) {
            e.children.push({
              value: j + 1,
              label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
            })
          } else if (e.value >= 80 && e.value <= 160 && (j + 1) % 10 == 0) {
            e.children.push({
              value: j + 1,
              label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
            })
          }
        }
      }
    })
    this.setData({
      list: listA
    })
    setTimeout(()=>{
      this.customS()
    },300)
  },

    //添加求职期望			
    async getjobExpectationAdd(dataList) {
      let { code, data, msg } = await apijobExpectationAdd(dataList)
      wx.hideLoading()
      if (code !== 200) {
        showToast(msg)
        return
      }
      wx.reLaunch({
          url:`/subpackPage/user/personalInfoNew/step1`
      })
    },
  customS(){
    //给默认值
    let selectedValues = []
    selectedValues[0] = 5
    selectedValues[1] = 2
    let _lowestMoney = `dataInfo.lowestMoney`
    let _maximumMoney = `dataInfo.maximumMoney`
    this.setData({
      wagesIndex:5,
      wagesIndex2: 2,
      selectedValues: selectedValues,
      [_lowestMoney]: 5,
      [_maximumMoney]: 8
    })
  },
  // 保存
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
    if (!this.data.dataInfo.businessName || (!this.data.dataInfo.businessId && this.data.dataInfo.businessStatus!=0)) {
      showToast('请先选择期望行业')
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
      lowestMoney: parseFloat(this.data.dataInfo.lowestMoney),  //最低工资
      maximumMoney: parseFloat(this.data.dataInfo.maximumMoney), //最高工资
    }
    wx.showLoading({
      title: '保存中',
    })
    if (!this.data.id) {
      console.log('没有ID')
      this.getjobExpectationAdd(dataList)
    } else {
      console.log('eID')
      this.getApiUpdate(dataList)
    }
    // const eventChannel = this.getOpenerEventChannel();
    // eventChannel.emit('changeEdit', true);
    // wx.removeStorageSync('postNumItem')
  }
})
