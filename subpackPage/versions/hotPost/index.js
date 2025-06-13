const app = getApp();
import { getUnreadCount, searchPostHome } from '../../../http/api'
import { getBriefnessPostList, apiGetAddress, getMaparound } from '../../../http/index'
import { getVipExpireAlert, getVipExpireAlertBtn } from '../../../http/user'
import { showToast } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: app.globalData.unReadMessageNum,
    globalBottom: app.globalData.globalBottom,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    locationAddress: '不限', // 显示的地址
    baseImageUrl: app.globalData.baseImgUrl,
    token: null,
    latitude: '',
    longitude: '',
    dataList: [], // 列表数组(职位) 全部
    redPocketPostList: [], // 列表数据 红包
    hrOnlinePostList: [], // 列表数据 hr
    hrEvenArray: [], // hr数组偶数数组
    hrOddArray: [], // hr数组奇数数组
    pageNum: 1, // 职位接口页码
    pageSize: 15, // 职位接口条数
    pageRecommendNum: 1, // 推荐接口页码
    pageRecommendSize: 15, // 推荐接口条数
    loginShow: false, // 微信快速登录弹窗
    showLoading: false, // loading效果 全部
    showLoading_red: false, // loading效果 红包
    showLoading_hr: false, // loading效果 hr
    isShow: false, // 筛选弹窗
    isRefreshing: false,//是否下拉刷新状态
    isFinish: false,//是否加载完全部数据
    isUpload: false, // 推荐数据加载完毕
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    memberProp: null,
    areaIds: [], // 区域id
    simpleId: '', // 职位id
    module_dom: 201,
    total: 0, // 总条数
    totalPages: 0, // 总页数
    topOpacity: 0, // 顶部背景色透明度
    currentHotPost: {
      name: '不限'
    }, // 当前岗位
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const _capsuleData = { ...this.data.capsuleData }
    let token = wx.getStorageSync('token') // 获取token
    let dictionary = wx.getStorageSync('dictionary')
    dictionary[6].unshift({ name: '不限' })
    // 导航栏高度 = 状态栏高度 + 44
    _capsuleData.navBarHeight = systemInfo.statusBarHeight + 44;
    _capsuleData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    _capsuleData.menuTop = menuButtonInfo.top;
    _capsuleData.menuHeight = menuButtonInfo.height;
    _capsuleData.menuWidth = menuButtonInfo.width

    that.setData({
      capsuleData: _capsuleData,
      token: token,
      sufferList: this.mapData(dictionary[33]),
      textData: this.mapData(dictionary[3]),
      scaleList: this.mapData(dictionary[5]),
      financingList: this.mapData(dictionary[4]),
      educationList: this.mapData(dictionary[6]),
      jsList: this.mapData(dictionary[46]),
      typeList: this.mapData(dictionary[39]),
      clearing: this.mapData(dictionary[48]), // 结算方式
      showLoading: true,
      showLoading_red: true,
      showLoading_hr: true
    })

    if (!token) {
      this.getParamsNoLoginFn()
    } else {
      //设置eventbus自定义事件
      wx.$event.on('jbCity', this, this.jbCity)
      this.getParamsFn()
      this.getVipAlert()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    // 监听消息页面未读数
    getApp().watch('unReadMessageNum', function () {
      that.setData({
        count: getApp().globalData.unReadMessageNum
      })
    })
    if (this.data.token) {
      that.getUnread()
    }
  },
  // 未登陆时调用
  async getParamsNoLoginFn() {
    // 先获取经纬度
    await this.getLocationAsync()
    // 登陆时检测获取到热门岗位
    await this.briefnessPostList()
  },
  // 登陆时调用
  async getParamsFn() {
    await this.getLocationAsync() // 先获取定位经纬度
    // 登陆时检测获取到热门岗位
    await this.briefnessPostList()
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
      await this.apiGetAddressFn()
      if (!this.data.token) {
        wx.setStorageSync('nologinLatitude', location.latitude)
        wx.setStorageSync('nologinLongitude', location.longitude)
      }
    } catch (err) {
      // 处理定位失败的情况
      this.setData({
        locationAddress: '不限',
      });
      wx.removeStorageSync('postAddress');
    }
  },
  // 经纬度赋值
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        geocode: true,
        success(res) {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude
          });
        },
        fail(err) {
          reject(err);
        }
      });
    });
  },
  // 根据当前经纬度获取当前定位信息
  async apiGetAddressFn() {
    let params = {
      lon: this.data.longitude,
      lat: this.data.latitude
    }
    const result = await apiGetAddress(params)
    if (result.code != 200) return showToast(result.msg)
    const res = await getMaparound({ location: `${this.data.longitude},${this.data.latitude}`, radius: 500 })
    if (res.code != 200) return showToast(res.msg)
    let addressDetail_hot = wx.getStorageSync('addressDetail_hot')
    if (addressDetail_hot && addressDetail_hot.length > 0) {
      // 修改搜索框展示的名称
      this.setData({
        locationAddress: addressDetail_hot[0].jobCityName || addressDetail_hot[0].name,
        areaIds: Array.isArray(addressDetail_hot[0].jobCityId) ? addressDetail_hot[0].jobCityId : [Number(addressDetail_hot[0].jobCityId)],
      })
    } else {
      wx.setStorageSync('addressDetail_hot', [{ ...res.data[0], jobCityId: result.data.streetId }])
      // 修改搜索框展示的名称
      this.setData({
        locationAddress: res.data[0].name,
        areaIds: [result.data.streetId]
      })
    }
  },
  // 获取热门岗位数据
  async briefnessPostList() {
    const result = await getBriefnessPostList()
    console.log(result, '热门岗位')
    if (result.code !== 200) {
      this.unifyRequset()
      return
    }
    this.setData({
      simpleId: result.data[0].id,
      currentHotPost: result.data[0]
    })
    this.unifyRequset()
  },
  // 获取未读数
  async getUnread() {
    let _usrId = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
    const result = await getUnreadCount({ userId: _usrId })
    if (result.code !== 200) return showToast(result.msg)
    this.setData({
      count: result.data
    })
    getApp().globalData.unReadMessageNum = result.data;
  },
  // 立即沟通按钮
  nowCommunicate(e) {
    let itemObj = e.currentTarget.dataset.item
    // 查看是否登录
    if (!this.data.token) {
      this.setData({ loginShow: true })
      return
    }
    let _itemObj = itemObj
    console.log(_itemObj, '发起聊天，立即沟通')
    let userInfo = wx.getStorageSync('userInfo').info
    var nameList = {
      myHx: userInfo.hxUname,
      your: _itemObj.yourHx, //环信id -
      targetName: _itemObj.outName, //招聘者对外昵称-
      targetJob: _itemObj.outPost, //招聘者岗位-
      targetCompany: _itemObj.companyName, //招聘者公司-
      targetAvatar: _itemObj.avatar, //招聘者头像-
      fromUserId: userInfo.userId, //自己用户id
      targetUserIds: _itemObj.bossUserId, //招聘者用户id-
      firstChat: _itemObj.isfirstChat, //是否第一次发起聊天------
      changePositionId: _itemObj.changePositionId, //不是第一次聊天的话弹出是否更换职位------
      jobId: _itemObj.postId, //岗位id
      dignity: 1,
      resumeId: userInfo.resumeId, //简历Id
      greeting: userInfo.greetings, //初次打招呼语
      chatId: _itemObj.chatSessionId, //会话id（如果有的话带上）--------
      jobCompanyFinancing: _itemObj.financeStage, //岗位公司融资情况
      jobRedEnvelope: _itemObj.isH, //岗位红包(是否有红包)
      jobSalary: _itemObj.lowestMoney ? (_itemObj.lowestMoney + '~' + _itemObj.maximumMoney + 'K') : '不限', //岗位薪资
      jobTag: _itemObj.tag && _itemObj.tag.join(',') || null, //岗位标签
      jobTitle: _itemObj.post, //岗位标题
      jobTitleTag: _itemObj.ptype, //岗位标题标签(位类型;默认0 社招;1校园应届招聘; 2兼职招聘)
      activitySubsidy: _itemObj.activitySubsidy //是否汽车活动补贴岗位-------
    };
    wx.navigateTo({
      url: "/packageIm/pages/chatroom/chatroom?userInfo=" + JSON.stringify(nameList),
    });
  },
  // 选择城市
  gotoCity() {
    // 查看是否登录
    if (!this.data.token) {
      this.setData({ loginShow: true })
      return
    }
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success(res) {
              if (!res.authSetting['scope.userLocation']) {
                // 用户没有授权位置信息，执行相关操作
                showToast('需要开启位置定位授权才能使用地址功能')
              }
            }
          })
        } else {
          wx.navigateTo({
            url: `/subpackPage/index/cityIndexEdition/index?currentAddId=${0}&addressNameNologin=${that.data.locationAddress}&storageType=addressDetail_hot`,
            events: {
              changeCity: function (currentAddId) {
                let addressDetail_hot = wx.getStorageSync('addressDetail_hot')
                that.setData({
                  showLoading: true,
                  showLoading_red: true,
                  showLoading_hr: true,
                  pageNum: 1,
                  dataList: [],
                  locationAddress: addressDetail_hot[currentAddId].jobCityName || addressDetail_hot[currentAddId].name,
                  areaIds: Array.isArray(addressDetail_hot[currentAddId].jobCityId) ? addressDetail_hot[currentAddId].jobCityId : [Number(addressDetail_hot[currentAddId].jobCityId)],
                })
                that.unifyRequset()
              }
            }
          })
        }
      }
    })
  },
  // 让多选地址页面来调用
  jbCity(addIndex) {
    let addressDetail_hot = wx.getStorageSync('addressDetail_hot')
    if (addressDetail_hot) {
      this.setData({
        showLoading: true,
        showLoading_red: true,
        showLoading_hr: true,
        pageNum: 1,
        locationAddress: addressDetail_hot[addIndex].jobCityName || addressDetail_hot[addIndex].name,
        areaIds: Array.isArray(addressDetail_hot[addIndex].jobCityId) ? addressDetail_hot[addIndex].jobCityId : [Number(addressDetail_hot[addIndex].jobCityId)]
      })
      this.unifyRequset()
    }
  },
  // 去热门岗位页面
  gotoHotPostPage() {
    let that = this
    wx.navigateTo({
      url: `/subpackPage/versions/postHot/postHot?type=hot&backType=1`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        setCurrentHotPost: function (data) {
          that.setData({
            showLoading: true,
            showLoading_red: true,
            showLoading_hr: true,
            simpleId: data.id,
            currentHotPost: data
          })
          that.unifyRequset()
        }
      },
    })
  },
  //提示会员过期
  async getVipAlert() {
    const result = await getVipExpireAlert()
    if (result.code !== 200) return showToast(result.msg)
    this.setData({
      memberProp: result.data
    })
  },
  //会员提示关闭或续费
  async closeProp(e) {
    const result = await getVipExpireAlertBtn({ day: this.data.memberProp.day, type: this.data.memberProp.type })
    if (result.code !== 200) return showToast(result.msg)
    if (e.detail == 1) {
      wx.navigateTo({
        url: '/subpackPage/member/equities/index',
      })
    } else if (e.detail == 2) {
      this.setData({
        memberProp: null
      })
    }
  },
  // 获取首页列表(全部岗位)
  async getListByHome(isBeachBottom) {
    let _moudle = 201
    // module值给页面中使用
    this.setData({ module_dom: _moudle })
    let params = {
      edition: 1,
      module: _moudle,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      areaIds: this.data.areaIds,// 区域id数组
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      simpleId: this.data.simpleId, // id
    }
    setTimeout(async () => {
      let result = null
      result = await searchPostHome(params)
      if (result.code !== 200) {
        showToast(result.msg)
        this.setData({ showLoading: false, dataList: [] })
        return
      }
      if (isBeachBottom) {
        this.setData({
          dataList: [...this.data.dataList, ...this.setListData(result.data.list)],
        })
      } else {
        let newArr = result.data.list || []
        this.setData({ dataList: this.setListData(newArr) })
      }
      this.setData({
        isRefreshing: false,//关闭下拉刷新
        // isFinish: this.data.dataList.length >= result.data.total, //全部加载完毕
        isFinish: this.data.pageNum >= result.data.pages,// 全部加载完毕
        showLoading: false,
        total: result.data.total,
        totalPages: result.data.pages
      })
      if (this.data.isFinish && _moudle == 201) {
        // 推荐
        this.getClassicsPostRecommend(false)
      }
    }, 0);
  },
  // 获取首页列表(红包岗位)
  async getRedPocketList() {
    let _moudle = 202
    let params = {
      edition: 1,
      module: _moudle,
      areaIds: this.data.areaIds,// 区域id数组
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      simpleId: this.data.simpleId, // id
    }
    setTimeout(async () => {
      let result = null
      result = await searchPostHome(params)
      if (result.code !== 200) {
        showToast(result.msg)
        this.setData({ showLoading_red: false, redPocketPostList: [] })
        return
      }
      let newArr = result.data.list || []
      this.setData({ redPocketPostList: this.setListData(newArr), showLoading_red: false })
    }, 0);
  },
  // 获取首页列表(hr岗位)
  async getHROnlinePostList() {
    let _moudle = 206
    let params = {
      edition: 1,
      module: _moudle,
      areaIds: this.data.areaIds,// 区域id数组
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      simpleId: this.data.simpleId, // id
    }
    setTimeout(async () => {
      let result = null
      result = await searchPostHome(params)
      if (result.code !== 200) {
        showToast(result.msg)
        this.setData({ showLoading_hr: false, hrOnlinePostList: [] })
        return
      }
      let newArr = result.data.list || []
      this.setData({ hrOnlinePostList: this.setListData(newArr), showLoading_hr: false })
      if (newArr.length >= 4) {
        let arr = this.setListData(newArr)
        let { oddArray, evenArray } = this.splitArrayIntoOddEven(arr)
        this.setData({
          hrEvenArray: evenArray,
          hrOddArray: oddArray
        })
      }
    }, 0);
  },
  // 获取首页推荐接口
  getClassicsPostRecommend(isBeachBottom) {
    let params = {
      edition: 1,
      module: 204,
      pageNum: this.data.pageRecommendNum,
      pageSize: this.data.pageRecommendSize,
      areaIds: this.data.areaIds,// 区域id数组
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      simpleId: this.data.simpleId, // 职位id
    }
    setTimeout(async () => {
      let result = null
      result = await searchPostHome(params)
      if (result.code !== 200) return showToast(result.msg)
      // 创建一个 Set 来存储 dataList 数组中所有元素的 postId
      let aIds = new Set(this.data.dataList.map(item => item.postId));
      // console.log('aIds=', aIds)
      // console.log('aIds1=', result.data.list.filter(item => !aIds.has(item.id)))
      result.data.list = result.data.list.filter(item => !aIds.has(item.id))
      console.log(result.data.list, 'result.data.list')
      if (result.data.list.length == 0 && (this.data.pageRecommendNum < result.data.pages)) {
        console.log(this.data.pageRecommendNum, 'this.data.pageRecommendNum')
        if (this.data.pageRecommendNum == 1) {
          // showToast('暂未找到相关职位，为您推荐以下职位')
          this.setData({ showToastDom: true })
          setTimeout(() => {
            this.setData({ showToastDom: false })
          }, 1500)
        }
        this.setData({
          pageRecommendNum: this.data.pageRecommendNum + 1
        })
        this.getClassicsPostRecommend(true)
        return
      }
      if (isBeachBottom) {
        let arr = this.setListData(result.data.list)
        this.setData({ dataList: [...this.data.dataList, ...arr] })
      } else {
        let newArr = result.data.list || []
        let arr = this.setListData(newArr)
        if (arr.length > 0 && this.data.pageRecommendNum == 1) {
          // showToast('暂未找到相关职位，为您推荐以下职位')
          this.setData({ showToastDom: true })
          setTimeout(() => {
            this.setData({ showToastDom: false })
          }, 1500)
        }
        this.setData({ dataList: [...this.data.dataList, ...arr] })
      }
      // if (this.data.dataList.length >= (result.data.total + this.data.total)) {
      //   this.setData({
      //     isUpload: true, //全部加载完毕
      //   })
      // }
      if ((this.data.pageNum + this.data.pageRecommendNum) >= (result.data.pages + this.data.totalPages)) {
        this.setData({
          isUpload: true, //全部加载完毕
        })
      }
    }, 0);
  },
  // 无token时获取首页数据信息
  async getListByHomeNoLogin(isBeachBottom) {
    let params = {
      dignity: 1,
      module: 10,
      edition: 1,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      areaIds: this.data.areaIds,// 区域id数组
    }
    setTimeout(async () => {
      const result = await searchPostHome(params)
      if (result.code !== 200) {
        this.setData({ dataList: [] })
        showToast(result.msg)
        return
      }
      if (isBeachBottom) {
        this.setData({
          dataList: [...this.data.dataList, ...this.setListData(result.data.list)],
        })
      } else {
        let newArr = result.data.list || []
        this.setData({
          dataList: this.setListData(newArr)
        })
      }
      this.setData({
        isRefreshing: false, // 关闭下拉刷新
        isFinish: this.data.dataList.length >= result.data.total, //全部加载完毕
        showLoading: false,
        total: result.data.total
      })
    }, 0)
  },
  //列表数据结构整理
  setListData(newArr) {
    let activityTagsCopy = true
    return newArr.map(item => {
      // 视频展示
      // let _visitFiles = []
      // if (item.visitFiles && item.visitFiles.length > 0) {
      //   _visitFiles = item.visitFiles.map(i => {
      //     let type = null
      //     let url = null
      //     type = this.isVideoLink(i) ? 2 : 1
      //     if (type == 2) {
      //       url = i + '?x-oss-process=video/snapshot,t_1000,m_fast'
      //     } else {
      //       url = i
      //     }
      //     return {
      //       type,
      //       url
      //     }
      //   })
      // }

      if (item.activityTags.length > 0 && item.activityTags.indexOf(1) > -1) {
        activityTagsCopy = true
      } else {
        activityTagsCopy = false
      }
      return {
        post: item.title,
        num: this.data.typeList[item.type]?.name,
        year: this.data.sufferList[item.experience]?.name || '',
        companyName: item.corporationName,
        city: item.city,
        province: item.province,
        postAddress: item.postAddress,
        tag: item.tag && item.tag.split(','),
        username: item.belonger,
        isH: item.redPacket,
        moneyType: item.moneyType,
        maximumMoney: item.maximumMoney,
        lowestMoney: item.lowestMoney,
        monthMoney: item.monthMoney,
        postId: item.id,
        bossUserId: item.belonger,
        outName: item.outName,
        avatar: item.avatar,
        outPost: item.outPost,
        stage: this.data.financingList[item.financeStage]?.name,
        corporationId: item.corporationId,
        //需要改字段，字段为scale
        scale: this.data.scaleList[item.scale]?.name,
        distance: item.distance,
        clearing: item.settlementUnit && this.data.clearing[item.settlementUnit - 1] ? this.data.clearing[item.settlementUnit - 1].name : '元/时', // 兼职结算方式
        looked: item.looked,
        activation: item.activation || '',
        online: item.online,
        urgent: item.urgent,
        type: 'job', // 用于区分是推荐列表还是职位列表
        // visitFiles: _visitFiles,
        compete: item.compete, // 是否竞招
        bigRedPacket: item.bigRedPacket,
        activityTags: activityTagsCopy,
        logo: item.logo,
        financeStage: item.financeStage,
        jobTitle: item.jobTitle,
        ptype: item.type,
        activitySubsidy: item.activityTags.length > 0 ? 1 : 0,
        isfirstChat: item.firstChat,
        changePositionId: item.changePositionId || null,
        chatSessionId: item.chatSessionId,
        yourHx: item.userName,
        lastDeliveryTime: item.lastDeliveryTime
      }
    })
  },
  // 处理筛选数据的函数
  mapData(data) {
    let add = data.map(item => {
      let isActive = false
      if (item.name == '不限') {
        isActive = true
      } else {
        isActive = false
      }
      return {
        ...item,
        isActive: isActive
      }
    })
    return add
  },
  // 职位详情
  jump(event) {
    // 当前点击的这一项的id和bossid
    let { bossuserid, id, distance } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackPage/index/job_detail/index?postId=${id}&bossuserid=${bossuserid}`,
    })
  },
  // 关闭筛选/登录弹窗
  onClose() {
    this.setData({ isShow: false, loginShow: false })
  },
  // 将hr数组处理成一个二维数组
  convertTo2DArray(data) {
    const result = [];
    for (let i = 0; i < data.length; i += 2) {
      // 如果是最后一个元素并且是奇数个元素，则只添加这一个元素
      if (i === data.length - 1) {
        result.push([data[i]]);
      } else {
        result.push([data[i], data[i + 1]]);
      }
    }
    return result;
  },
  // 将hr数组处理成两个数组
  splitArrayIntoOddEven(arr) {
    let oddArray = []; // 用于存放奇数
    let evenArray = []; // 用于存放偶数
    arr.forEach((item, index) => {
      if ((index + 1) % 2 === 0) {
        // 如果索引是偶数
        evenArray.push(item);
      } else {
        // 如果索引是奇数
        oddArray.push(item);
      }
    })
    return {
      oddArray: oddArray,
      evenArray: evenArray
    };
  },
  //监听scroll滚动事件
  onRefresh() {
    setTimeout(() => {
      this.setData({
        pageNum: 1,
        pageRecommendNum: 1
      })
      if (this.data.simpleId) {
        this.unifyRequset()
      } else {
        this.briefnessPostList()
      }
    }, 500)
  },
  // 上拉
  onLoadMore: function () {
    if (this.data.token) {
      if (this.data.isFinish) {
        if (this.data.isUpload) return
        this.setData({
          pageRecommendNum: this.data.pageRecommendNum + 1,
        })
        this.getClassicsPostRecommend(true)
      } else {
        this.setData({
          pageNum: this.data.pageNum + 1,
        })
        this.getListByHome(true)
      }
    } else {
      if (this.data.isFinish) {
        if (this.data.isUpload) return
        this.setData({
          pageRecommendNum: this.data.pageRecommendNum + 1,
        })
        this.getClassicsPostRecommend(true)
      } else {
        this.setData({
          pageNum: this.data.pageNum + 1,
        })
        this.getListByHomeNoLogin(true)
      }
    }
  },
  // 内层scroll滚动事件
  contentscroll(event) {
    let { scrollTop } = event.detail.detail
    this.setData({
      topOpacity: scrollTop / 200 > 0.9 ? 1 : scrollTop / 200
    })
  },

  // 统一请求
  unifyRequset(){
    // 获取红包岗位列表
    this.getRedPocketList()
    // 获取hr在线岗位列表
    this.getHROnlinePostList()
    if(this.data.token){
      // 根据热门岗位获取岗位列表
      this.getListByHome(false)
    } else {
      this.getListByHomeNoLogin(false)
    }
  }
})