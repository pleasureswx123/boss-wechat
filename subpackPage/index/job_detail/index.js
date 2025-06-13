import { getNoLoginPublishPost, apigetPublishPost, doCollect, apiGetResumeNotes, isFirstChat, apiGetDistance, setOneKeyDeliver } from "../../../http/index"
import { resumeFileList } from "../../../http/api"
import { getclassicsPostDetails, getInventedPhone, getCheckIllegal, getEquityAIOrPhone } from '../../../http/versions'
import { getCheckAiOrPhone,getMyPageInfo } from '../../../http/user'
import { showToast, formatDate } from "../../../utils/util"
var amapFile = require('../../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js
var app = getApp()
var markersData = [];
Page({
  data: {
    src: '',
    markers: [], // 高德
    textMap: {},
    latitude: '', // 纬度
    longitude: '', // 经度
    baseImageUrl: app.globalData.baseImgUrl,
    imageUrl: app.globalData.imImages,
    postDuty: [], // 岗位描述信息
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_50', // 图片压缩
    bossUserId: '',
    tagList: [], // 职位描述
    postId: '',
    fullInfo: {}, // 职位详情数据
    postDetailInfo: {}, // 详情数据
    activation: '', // 头像
    scaleList: [], //规模列表
    financingList: [], //融资阶段列表
    experienceList: [], //经验列表
    educationList: [], //学历
    isfirstChat: 1, //true第一次
    distance: null, // 住址距离
    jlShow: false, //一键投递简历
    jlList: [], //简历列表
    deliver: 0,
    collectIcon: 0, //收藏
    lastTapTime: 0,
    firstLook: 0, //首次查看
    showStar: false,
    loginShow: false,
    phoneShow: false, // 展示虚拟电话
    actions: [
      { name: '选项' }
    ],
    isShowContact: false,
    show: false,
    userInfo: {},
    outShow: false, //自定义弹窗
    collectList:[
      {
        name:'你真的是神仙眼光',
        desp:'今天的收藏让你离目标又近了'
      },{
        name:'不愧是你',
        desp:'您这眼光简直堪称一绝'
      },{
        name:'您这眼光稳准狠',
        desp:'钮钴禄来了都要给你点赞'
      },{
        name:'行家出手，必属精品',
        desp:'您这筛选能力堪称一绝～'
      },
    ],
    sjNum:1,
    showCollect:false,
    collectionCount: 0, // 收藏数量
  },
  handleToEntryPage() {
    wx.navigateTo({
      url: '/subpackPage/index/qiyeWx/index',
    })
  },
  setLookVal() {
    this.setData({
      firstLook: 1
    })
    wx.setStorageSync('firstLook', 1)
  },
  weixinOnClose() {
    this.setData({
      loginShow: false
    })
  },
  //添加双击事件
  doubleEvent(e) {
    if (!wx.getStorageSync('token')) return
    // 监听双击事件
    let curTime = e.timeStamp
    if (this.data.lastTapTime > 0) {
      if (curTime - this.data.lastTapTime < 300) {
        console.log("双击屏幕事件");
        if (!this.data.postDetailInfo.collected && (this.data.postDetailInfo.deleted == 1 || this.data.postDetailInfo.sattus !== 0)) {
          this.setData({
            showStar: true
          })
          this.setPostCollect()
          setTimeout(() => {
            this.setData({
              showStar: false
            })
          }, 1000)
        }
      }
    }
    this.setData({
      lastTapTime: curTime
    })
  },
  report() {
    wx.navigateTo({
      url: '/packageIm/pages/report/index?respondent=' + this.data.bossUserId + '&positionId=' + this.data.postId
    })

  },
  // 设置住址
  seeAdd() {
    //未登录状态
    if (!wx.getStorageSync('token')) {
      this.setData({
        loginShow: true
      })
      return
    }
    wx.navigateTo({
      url: `/subpackPage/index/setAddress/index`,
    })
  },
  // 当前招聘者发布的职位
  urlPostDetail(event) {
    let belonger = event.currentTarget.dataset.belonger
    let {
      corporationName,
      outName,
      postName,
      outPost,
      avatar,
      corporationId,
      personal
    } = this.data.postDetailInfo
    wx.navigateTo({
      url: `/subpackPage/index/post_detail/index?belonger=${belonger}&outPost=${outPost}&postName=${postName}&outName=${outName}&corporationName=${corporationName}&avatar=${avatar}&corporationId=${corporationId}&personal=${personal}`,
    })
  },
  // 公司详情
  urlCompany(event) {
    let corporationId = event.currentTarget.dataset.corporationid
    wx.navigateTo({
      url: `/subpackPage/index/corporation_detail/index?corporationId=${corporationId}`,
    })
  },
  numArrayToChinese(numArray) {
    const chineseDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    // 首先对数组进行排序
    const sortedNumArray = numArray.sort((a, b) => a - b);
    // return numArray.map(num => chineseNum[parseInt(num - 1)]).join('');
    // 然后将排序后的数组转换为中文星期
    return sortedNumArray.map(num => chineseDays[parseInt(num - 1)]).join(',');
  },
  //一键投递
  goTouJl() {
    resumeFileList({ type: 0 }).then(res => {
      res.data.map(item => {
        item.size = (item.size / 1048576).toFixed(2)
        item.updateTime = item.updateTime.substr(0, 10)
      })
      this.setData({
        jlList: res.data
      })
      if (res.data.length > 0) {
        this.setData({
          jlShow: true
        })
      } else {
        this.setData({
          outShow: true,
          outShowMsg: '请先去添加附件简历'
        })
        // wx.showModal({
        //   content: '请先去添加附件简历',
        //   success: (res) => {
        //     if (res.confirm) {
        //       wx.navigateTo({
        //         url: '/subpackPage/user/resumeAnnex/resumeAnnex'
        //       })
        //     } else if (res.cancel) {
        //       console.log('用户点击取消');
        //     }
        //   }
        // });
      }
    })
  },
  comfirmFun() {
    wx.navigateTo({
      url: '/subpackPage/user/resumeAnnex/resumeAnnex'
    })
    this.setData({
      outShow: false
    })
  },
  cloneShow() {
    this.setData({
      outShow: false
    })
  },
  // 关闭一件投递
  onClose() {
    this.setData({ jlShow: false, isShowContact: false })
  },
  sendFileFun(e) {
    let fileItem = e.currentTarget.dataset.item
    let param = {
      jobId: this.data.fullInfo.id,
      resumeFileId: fileItem.id
    }
    setOneKeyDeliver(param).then(res => {
      if (res.code == 200) {
        this.setData({
          jlShow: false
        })
        showToast('投递成功')
        this.getPublishPost()
      }
    })
  },
  // 职位详情
  async getPublishPost() {
    let postDetail = {
      postId: this.data.postId,
      bossUserId: this.data.bossUserId
    }
    if (!wx.getStorageSync('token')) {
      const result1 = await getNoLoginPublishPost(postDetail)
      wx.hideLoading()
      if (result1.code == 200) {
        this.setDataFun(result1)
      } else {
        showToast(result1.msg)
      }
    } else {
      // const result = await apigetPublishPost(postDetail)
      const result = await getclassicsPostDetails(postDetail)
      console.log(result, '职位详情')
      wx.hideLoading()
      if (result.code == 200) {
        this.setDataFun(result)
      } else {
        showToast(result.msg)
      }
    }
  },
  setDataFun(result) {
    let list = result.data.publishPostParam.tag.split(',')
    let postDuty = result.data.publishPostParam.postDuty.replaceAll('\n', '<br/>')
    if (result.data.publishPostParam.type == 1 || result.data.publishPostParam.type == 3) {
      if (result.data.publishPostParam.workDays && result.data.publishPostParam.workDays !== '0') {
        result.data.publishPostParam.workDays = this.numArrayToChinese(result.data.publishPostParam.workDays.split(','))
      } else {
        result.data.publishPostParam.workDays = '不限'
      }
      if (result.data.publishPostParam.workTimes && result.data.publishPostParam.workTimes.length > 0) {
        let _work = []
        result.data.publishPostParam.workTimes.map(res => {
          _work.push(res.startTime + '-' + res.endTime)
        })
        result.data.publishPostParam.workTimes = _work.join(' / ')
      } else {
        result.data.publishPostParam.workTimes = '不限'
      }
      result.data.publishPostParam.endTime = formatDate(result.data.publishPostParam.endTime, 'Y-M-D')
    }
    result.data.medias = result.data.medias && result.data.medias.map(item => {
      let type = this.isVideoLink(item.url) ? 2 : 1
      let url = ''
      if (type == 2) {
        url = item.url + '?x-oss-process=video/snapshot,t_1000,m_fast'
      } else {
        url = item.url
      }
      return {
        url,
        type
      }
    })
    this.setData({
      fullInfo: result.data.publishPostParam, // 环信使用
      companyFullName: result.data.companyFullName,
      activitySubsidy: result.data.activitySubsidy,
      postDetailInfo: result.data.publishPostParam,
      mediasList: result.data.medias,
      deliver: result.data.deliver,
      activation: result.data.online ? '在线中' : result.data.activation,
      tagList: list,
      postDuty,
      checkTags: result.data.checkTags && result.data.checkTags.filter((v, i) => i < 2), // 知城核验列表
      contactWay: result.data.contactWay // 联系方式
    })
    if (result.data.contactWay == 1) {
      // 获取AI权益剩余次数
      this.getEquityAI(1)
    }
    if (wx.getStorageSync('token')) {
      this.getDistance()
    }
    var that = this
    var myAmapFun = new amapFile.AMapWX({ key: 'e2aa80247b4bd8dc47dfc12728480744' });
    wx.getSystemInfo({
      success: function (data) {
        var height = 350;
        var width = data.windowWidth;
        var size = width + "*" + height;
        var lon = that.data.postDetailInfo.longitude
        var lat = that.data.postDetailInfo.latitude
        myAmapFun.getStaticmap({
          location: lon + ',' + lat,
          zoom: 14,
          size: '325*150',
          scale: 2,
          markers: `-1,https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/index_img/location1.png,0:` + lon + ',' + lat,
          success: function (data) {
            that.setData({
              src: data.url
            })
          },
          fail: function (info) {
            showToast(info.errMsg)
          }
        })
      }
    })
  },
  // 播放实探视频
  explorationPlay(event) {
    let { playurl, type } = event.currentTarget.dataset
    if (type == 2) {
      wx.navigateTo({
        url: `/subpackPage/playVideo/index/index?url=${playurl}`,
      })
    } else if (type == 1) {
      let _mediasList = this.data.mediasList.map(item=>{
        _mediasList.push(item.url)
        return item.url
      })
      wx.previewImage({
        urls: _mediasList,
        current: playurl
      })
    }
  },
  isVideoLink(path) {
    const videoExtensions = ['mp4', 'mov', 'm4v', 'mkv', 'webm', 'avi', '3gp', 'm2ts', 'flv', 'f4v'];
    const extension = path.split('.').pop().toLowerCase(); // 获取路径中的文件扩展名并转为小写
    // 判断扩展名是否存在于视频格式数组中
    return videoExtensions.includes(extension.toLowerCase());
  },
  // 获取ai权益剩余次数
  async getEquityAI(type) {
    const res = await getEquityAIOrPhone(type)
    if (res.code !== 200) return
    this.setData({ AIEquity: res.data })
  },
  // 收藏职位
  async setPostCollect(event) {
    //未登录状态
    if (!wx.getStorageSync('token')) {
      this.setData({
        loginShow: true
      })
      return
    }
    let type = event ? event.currentTarget.dataset.type : 1
    this.setData({
      collectIcon: 1
    })
    let params = {
      type: 2,
      positionId: this.data.postId,
      status: type
    }
    const { data, code, msg } = await doCollect(params)
    await this.getMyPageInfo()
    if (Number(type) == 1) {
      // showToast('收藏成功')
      wx.showToast({
        title: '收藏成功',
        icon: "none"
      })
      this.setData({
        showCollect:true,
        sjNum:Math.ceil(Math.random() * 4) - 1
      })
      setTimeout(() => {
        this.setData({
          showCollect: false
        })
      }, 5000)
    } else {
      wx.showToast({
        title: '取消收藏',
        icon: "none"
        // https://api.test.guochuanyoupin.com/yp-api/message/messageChatSession/myPageInfo?currentDignity=1&userId=3813

      })
      this.setData({
        showCollect: false
      })
    }
    setTimeout(() => {
      this.getPublishPost()
      this.setData({
        collectIcon: 0
      })
    }, 300)

  },
  closeCollect(){
    this.setData({
      showCollect: false
    })
  },
  // 分享职位
  // 字典数据赋值
  dictionaryData(data) {
    this.setData({
      scaleList: data[5],
      financingList: data[4],
      experienceList: data[33],
      educationList: data[6],
      qzArray: data[39],
      jsfsArr: data[46],
      clearing: data[48]
    })
  },
  // 获取当前设置的地址距离公司的距离]
  async getDistance() {
    let params = {
      lon: this.data.postDetailInfo.longitude,
      lat: this.data.postDetailInfo.latitude
    }
    const { code, data, msg } = await apiGetDistance(params)
    this.setData({
      distance: data && data.distance
    })
  },

  makertap: function (e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },
  // 去地图页面
  location() {
    let param = {
      postAddress: this.data.postDetailInfo.postAddress,
      latitude: this.data.postDetailInfo.latitude,
      longitude: this.data.postDetailInfo.longitude,
      corporationName: this.data.postDetailInfo.corporationName
    }
    wx.navigateTo({
      url: `/subpackPage/index/map/index?param=` + JSON.stringify(param),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('token')
    console.log(options, '传递参数')
    const scene = decodeURIComponent(options.scene)
    let that = this
    wx.showShareMenu({
      withShareTicket: true, // 是否使用带 shareTicket 的转发详情
      menus: ['shareAppMessage', 'shareTimeline'] // 可以自定义分享的类型，如只分享给好友或分享到朋友圈
    });
    if (scene !== 'undefined') {
      this.setData({
        bossUserId: scene.split('&')[1].split('b=')[1],
        postId: scene.split('&')[0].split('p=')[1],
        userId: wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
      })
    } else {
      this.setData({
        bossUserId: options.bossuserid,
        postId: options.postId,
        userId: wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId,
        formType: options.formType
      })
    }

    let dictionary = wx.getStorageSync('dictionary')
    that.dictionaryData(dictionary)

    this.setData({
      firstLook: wx.getStorageSync('firstLook'),
      versions: wx.getStorageSync('versions'),
      token,
      userInfo: wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info
    })
    if (token) {
      this.getCheckIllegal1()
    }
  },
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textMap: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },

  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = "选中 marker 图标的相对路径"; //如：..­/..­/img/marker_checked.png
      } else {
        data[j].iconPath = "未选中 marker 图标的相对路径"; //如：..­/..­/img/marker.png
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  async onShow() {
    await this.getPublishPost()
    this.getIsFirstChat()
    if (this.data.token) {
      this.getCheckIllegal1()
    }
  },
  //沟通过的数量数据
  async getMyPageInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    let params = {
      currentDignity: 1,
      userId: userInfo.info.userId
    }
    const { code, data, msg } = await getMyPageInfo(params)
    if (code != 200) return showToast(msg)
    console.log(data,'沟通过的数量数据')
    let joblist = wx.getStorageSync('dictionary')[34]
    // this.setData({
    //   data: data,
    //   jobName: joblist[data.jobWantedStatus - 1]?.name
    // })
    this.setData({
      collectionCount: data.collectionCount
    })
  },
  //获取是否沟通过
  async getIsFirstChat() {
    if (!wx.getStorageSync('token')) {
      return
    }
    const {
      code,
      data,
      msg
    } = await isFirstChat({
      jobSeekerId: this.data.userId,
      // positionId: this.data.postId, // 之前传递的擦参数配置项
      postId: this.data.postId,
      recruiterId: this.data.bossUserId,
      currentDignity: 1
    })
    // 需要获取到聊天中上一次沟通的岗位,并在聊天页面中的判断是否相同,相同则不提示
    console.log(data, '沟通过')
    if (code == 200) {
      this.setData({
        isfirstChat: data.isFirstChat == true ? 1 : 2,
        greeting: data.greetings,
        chatSessionId: data.chatSessionId
      })
      if (this.data.postId != data.positionId) {
        this.setData({
          changePositionId: data.positionId
        })
      } else {
        this.setData({
          changePositionId: null
        })
      }
    }
  },
  // 立即沟通
  async getResumeInfo() {
    //简历审核不通过
    if (this.data.jlShStatus) {
      this.setData({
        isShowContact: true
      })
      return
    }
    //未登录状态
    if (!wx.getStorageSync('token')) {
      this.setData({
        loginShow: true
      })
      return
    }
    if (this.data.formType == 1) {
      wx.navigateBack()
      return
    }
    let userInfo = wx.getStorageSync('userInfo')
    const {
      code,
      data
    } = await apiGetResumeNotes({
      resumeId: userInfo.info.resumeId,
      jobUserId: userInfo.info.userId
    })

    if (code == 200) {
      this.setData({
        resumeInfo: data
      })
      this.gotoChatRoom(userInfo)
    }
  },
  //立即沟通进入放假
  gotoChatRoom(userInfo) {
    console.log(userInfo.info.hxUname, '发起聊天，立即沟通')
    var my = userInfo.info.hxUname;
    var userid = userInfo.info.userId
    let _jobId = this.data.fullInfo.id
    var nameList = {
      myHx: my,
      your: this.data.fullInfo.userName, //环信id
      targetName: this.data.fullInfo.outName, //招聘者对外昵称
      targetJob: this.data.fullInfo.outPost, //招聘者岗位
      targetCompany: this.data.fullInfo.corporationName, //招聘者公司
      targetAvatar: this.data.fullInfo.avatar, //招聘者头像
      fromUserId: userid, //自己用户id
      targetUserIds: this.data.fullInfo.belonger, //招聘者用户id
      firstChat: this.data.isfirstChat, //是否第一次发起聊天
      changePositionId: this.data.changePositionId, //不是第一次聊天的话弹出是否更换职位
      jobId: _jobId, //岗位id
      dignity: 1,
      resumeId: userInfo.info.resumeId, //简历Id
      greeting: this.data.greeting, //初次打招呼语
      chatId: this.data.chatSessionId, //会话id（如果有的话带上）
      jobCompanyFinancing: this.data.fullInfo.financeStage, //岗位公司融资情况
      jobRedEnvelope: this.data.fullInfo.redPacket, //岗位红包(是否有红包)
      jobSalary: this.data.fullInfo.lowestMoney ? (this.data.fullInfo.lowestMoney + '~' + this.data.fullInfo.maximumMoney + 'K') : '不限', //岗位薪资
      jobTag: this.data.fullInfo.tag, //岗位标签
      jobTitle: this.data.fullInfo.title, //岗位标题
      jobTitleTag: this.data.fullInfo.type, //岗位标题标签(位类型;默认0 社招;1校园应届招聘; 2兼职招聘)
      activitySubsidy: this.data.activitySubsidy //是否汽车岗位
    };
    wx.navigateTo({
      url: "/packageIm/pages/chatroom/chatroom?userInfo=" + JSON.stringify(nameList),
    });
  },
  // 电话沟通
  async phoneCommunicate() {
    //简历审核不通过
    if (this.data.jlShStatus) {
      this.setData({
        isShowContact: true
      })
      return
    }
    if (this.data.AIEquity.status == 2) {
      this.setData({ show: true })
      //状态是2代表都没有去购买

      return
    } else if (this.data.AIEquity.status === 0) {
      //状态是0代表有次数
      let _toUserId = this.data.postDetailInfo.belonger
      let param = {
        postId: this.data.postId,
        toUserId: _toUserId
      }
      const res = await getInventedPhone(param)
      console.log(res, '电话')
      if (res.code != 200) {
        showToast(res.msg)
        return
      }
      let actions = []
      actions.push({ name: res.data.replace("+86", ""), className: 'phoneTitle' })
      this.setData({ phoneShow: true, actions })
    } else if (this.data.AIEquity.status === 1) {
      //状态是1代表没有次数有道具卡需要激活
      let param = {
        postId: this.data.postId,
        type: 'PHONE_JOB_SEEKER',
        belongId: this.data.AIEquity.data.id,
        toUserId: this.data.postDetailInfo.belonger
      }
      getCheckAiOrPhone(param).then(res => {
        if (res.code != 200) showToast(res.msg)
        let actions = []
        actions.push({ name: res.data.replace("+86", ""), className: 'phoneTitle' })
        this.setData({ phoneShow: true, actions })
      })
    }
  },
  // 关闭
  phoneOnClose() {
    this.setData({ phoneShow: false })
  },
  // 拨打虚拟电话
  phoneOnSelect(event) {
    let phone = this.data.actions[0].name
    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        this.setData({ phoneShow: false })
      }
    })
  },
  // 判断是否违规
  async getCheckIllegal1() {
    const res = await getCheckIllegal()
    if (res.code != 200) return showToast(res.msg)
    if (!res.data) {
      this.setData({
        isShowContact: false
      })
    }
    if (res.data) {
      this.setData({
        jlShStatus: res.data,
        jlShInfo: res.data
      })
    }
  },
  // 关闭弹窗
  cancel() {
    this.setData({ show: false })
  },
  // 去充值次数
  gotoRecharge() {
    let that = this
    wx.navigateTo({
      url: `/subpackPage/user/stageBuy/index?type=${9}`,
      success: () => {
        that.cancel()
      }
    })
  },
  tipsFn() {
    showToast('已投递,请务重复操作')
  },
  goCollect(){
    wx.navigateTo({
      url: '/subpackPage/user/collect/collect',
    })
  }
})