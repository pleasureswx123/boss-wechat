// 引入request请求
const { request } = require("./http");

module.exports = {
  // ----------------- 首页 -----------------
  // 首页列表
  apiListByHome(params) {
    // return request(`/post/publishPost/${params.path}`, "post", params)
    return request(`post/publishPost/getListByHome`, "post", params);
  },

  // 定位
  apiArea(params) {
    return request(`system/area/list`, 'get', params)
  },

  // 获取求职列表
  apiJobExpectationList(params) {
    return request(
      `resume/jobExpectation/getJobExpectationList`,
      "get",
      params
    );
  },
  // 字典数据
  apiDictionary(params) {
    return request(`system/dictionary/listby/${params}`, "get", params);
  },
  // 未登陆职位详情
  getNoLoginPublishPost(params) {
    return request(`/post/publishPost/getNoLoginPublishPost`, "post", params);
  },
  // 职位详情
  apigetPublishPost(params) {
    return request(`post/publishPost/getPublishPost`, "post", params);
  },
  // 设置收藏
  doCollect(params) {
    return request(`alternately/collect/doCollect`, "post", params);
  },
  // 简历详情计算查看次数
  apiGetResumeNotes(params) {
    return request(`resume/resumeNotes/getResumeNotes`, "post", params);
  },
  // 个人发布的再找岗位列表
  apigetActiveListByUserId(params) {
    return request(`post/publishPost/getActiveListByUserId`, "get", params);
  },
  // 公司详情
  apiDetailCompany(params) {
    return request(`company/view/${params.corporationId}`, "get", params);
  },
  // 公司在招列表
  apigetCorporationPost(params) {
    return request(`post/publishPost/getPostCorporationList`, "get", params);
  },
  /*
   * 企业福利字典(全部)
   * @param {  }
   * @returns promise
   */
  apiNavwelfare(params) {
    return request(`company/welfare/alldict`, "get", params);
  },
  /**
   * 行业信息
   * @param { }
   * @returns promise
   */
  apiIndustry(params) {
    return request(`system/dictionary/industry`, "get", params);
  },
  /**
   * 首页筛选
   * @param {  }
   * @returns promise
   */
  apiSelectorList(params) {
    return request(`post/publishPost/getListBySelector`, "post", params);
  },
  /**
   * 城市信息按字母分组
   * @param {  }
   * @returns promise
   */
  apiRegion(params) {
    return request(`system/dictionary/region`, "get", params);
  },
  /**
   * 求职端搜索职位---模糊匹配职位信息
   * @param {  }
   * @returns promise
   */
  getSratchPostList(name) {
    return request(`company/search`, "get", name);
  },

  //  // 首页列表
  //  apiListByHome(params) {
  //     // return request(`/post/publishPost/${params.path}`, "post", params)
  //     return request(`/post/publishPost/getListByHome`, "post", params);
  // },
  /**
   * 人才库搜索---热门关键词
   * @param {  }
   * @returns promise
   */
  getHotPost(params) {
    return request(`system/dictionary/getHotPost`, "get", params);
  },
  /**
   * 首页搜索
   * @param {  }
   * @returns promise
   */
  apiSearch(param) {
    return request(`post/publishPost/getListBySearch`, "get", param);
  },
  /**
   * 搜索企业
   * @param {  }
   * @returns promise
   */
  apiSearchByPost(param) {
    return request(`company/searchByPost`, "get", param);
  },
  /**
   * 搜索中午i欸
   * @param {  }
   * @returns promise
   */
  getListBySearch(param) {
    return request(`post/publishPost/getListBySearch`, "get", param);
  },
  // 获取当前地址
  apiGetAddress(params) {
    return request(`system/area/getLocation`, "get", params);
  },
  // 搜索当前城市下地址(设置地址)
  apiSetAddress(params) {
    return request(`job/map/search`, "get", params);
  },
  // 保存地址
  apiSaveAddress(params) {
    return request(`user/jobUserAddress/save`, "post", params);
  },
  // 查询当前地址
  apiGetUserAddress(params) {
    return request(`user/jobUserAddress/details`, "get", params);
  },
  // 查询当前地址距离某个公司
  apiGetDistance(params) {
    return request(`user/jobUserAddress/distance`, "get", params);
  },
  //是否第一次沟通
  isFirstChat(params) {
    return request(`message/messageChatSession/isFirstChat`, "get", params);
  },

  // ----------------- 行业图谱 -----------------
  // 热门企业
  apiGetHotEnterprise(params) {
    return request(`atlas/company/hot`, 'get', params)
  },

  // 薪资预览
  apiSalary(params) {
    return request(`atlas/salary/top`, 'get', params)
  },
  // 环比
  apieRlative(params) {
    return request(`atlas/post/chain`, "get", params)
  },
  // 热门乡镇/街道
  apiStreet(params) {
    return request(`atlas/street/hot`, 'get', params)
  },
  // 热门街道下公司推荐
  apiStreetCompanys(params) {
    return request(`atlas/street/companys`, 'get', params)
  },
  // 定位
  apilistBy(params) {
    return request(`system/area/listBy?id=${params.id}`, 'get', params)
  },
  // 获取区域
  getAreaData(params) {
    return request('system/area/getAreaList', 'get', params)
  },
  // 搜索区域
  searchAreaList(params) {
    return request('system/area/areaSearch', 'get', params)
  },

  // 搜索区域
  searchInputtips(params) {
    return request('job/map/inputtips', 'get', params)
  },

  // 精简版首页-热招岗位
  getBriefnessPostList(params) {
    return request(`system/dictionary/hot/posts`, 'get', params)
  },
  // 精简版首页-严选兼职
  getBriefnessAgileList(params) {
    return request(`system/dictionary/flexible/posts`, 'get', params)
  },

  // 获取banner图
  getBannerList(params) {
    return request(`system/banner/list`, 'get', params)
  },

  // 获取精简版职位信息(58)
  getpostsSimple(params) {
    return request(`system/dictionary/posts/simple`, 'get', params)
  },
  //获取精简版职位信息通过type
  getpostsSimpleBy(pid) {
    return request(`system/dictionary/posts/simpleBy/${pid}`, 'get')
  },


  // ----------------- 道具商城 -----------------

  /**
 * 商品列表
 * @param {  } 
 * @returns promise
 */
  apiProductList(params) {
    return request(`api/product/list`, 'get', params)
  },
  // 知豆余额
  apiPropGetBalance(params) {
    return request(`coins/account/getBalance`, 'get', params)
  },
  //未登录状态下可获取首页数据
  getListByHomeNoLogin(params) {
    return request(`post/publishPost/getListByHomeNoLogin`, 'get',params)
  },
  //公司正在招聘类别
  postTypeList: (corporationId) => {
    return request(`post/publishPost/manager/postTypeList`, 'get', { 'corporationId': corporationId })
  },
  //一键投递/message/oneKeyDeliver
  setOneKeyDeliver: (param) => {
    return request(`message/oneKeyDeliver`, 'post', param)
  },
  // 我的地址一系列操作
  seekerCollectAddress(params, index) {
    let pathList = ['list', 'details', 'save', 'update', 'del']
    if (index == 1) {
      return request(`system/seekerCollectAddress/${pathList[index]}/${params.id}`, 'get', params)
    } else if (index == 3) {
      return request(`system/seekerCollectAddress/${pathList[index]}`, 'put', params)
    } else if (index == 2) {
      return request(`system/seekerCollectAddress/${pathList[index]}`, 'post', params)
    } else if (index == 4) {
      return request(`system/seekerCollectAddress/${pathList[index]}/${params.id}`, 'delete', params)
    } else {
      return request(`system/seekerCollectAddress/${pathList[index]}`, 'get', params)
    }

  },
  // 获取经纬度下周边500m的店
  getMaparound(params) {
    return request(`job/map/around`, 'get', params)
  },
  // 新版地址搜索
  getMapinputtips(params) {
    return request('job/map/inputtips', 'get', params)
  },
  // 首页推荐时使用的接口
  getListByRecommend(params) {
    return request(`post/publishPost/getListByRecommend`, 'post', params)
  },
  //至臻版保存个人信息
  savePersonInfo(params){
    return request(`user/userJobDetails/updateInfoStep1`, 'post', params)
  },
};
