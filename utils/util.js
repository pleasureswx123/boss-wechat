//今天
const isToday = function (date) {
  if (date) {
    var d = new Date(date.toString().replace(/-/g, "/"));
    var todaysDate = new Date();
    if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false
  }
}
// 获取距离当前时间的 (天数/小时数/分钟数)
const timesDiff = (timesData) => {
  var dateBegin = new Date(); //获取当前时间
  var dateEnd = new Date(timesData.replace(/-/g, "/")); //将-转化为/，使用new Date
  var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
  var days = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
  var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
  var diffObj = {
    days: 0,
    hours: 0,
    minutes: 0,
  };

  if (days != 0) {
    diffObj.days = days;
  } else if (days == 0 && hours != 0) {
    diffObj.hours = hours;
    diffObj.minutes = minutes;
  } else if (days == 0 && hours == 0) {
    diffObj.minutes = minutes;
  }

  return diffObj
}
// 计算相差多久
const diffTime = function (d1, d2) {
  d1 = new Date(d1.replace(/-/g, '/')) //结束时间
  d2 = new Date(d2.replace(/-/g, '/')) //开始时间
  if (d1.getTime() < d2.getTime()) {
    console.log('结束日期不能小于开始时间')
    return '结束日期不能小于开始时间'
  }
  var Y1 = d1.getFullYear() // 结束年份
  var Y2 = d2.getFullYear() // 开始年份
  var year = Y1 - Y2 // 相差整年数
  return year
}
// 获取当前系统时间
const getNowTime = function () {
  const yy = new Date().getFullYear()
  const MM = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
  const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  const HH = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
  const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  return yy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss
}
/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}
//获取当前日期函数 YYYY-MM-DD
function getNowFormatDate() {
  let date = new Date(),
    seperator1 = '-', //格式分隔符
    year = date.getFullYear(), //获取完整的年份(4位)
    month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate = date.getDate() // 获取当前日(1-31)
  if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
  if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0

  let currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}

/**
 * 输入Unix时间戳，返回指定时间格式
 */
function calcTimeHeader(time) {
  // 格式化传入时间
  let date = new Date(parseInt(time)),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth(),
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getUTCMinutes()
  // 获取当前时间
  let currentDate = new Date(),
    currentYear = date.getUTCFullYear(),
    currentMonth = date.getUTCMonth(),
    currentDay = currentDate.getDate()
  // 计算是否是同一天
  if (currentYear == year && currentMonth == month && currentDay == day) { //同一天直接返回
    if (hour > 12) {
      return `下午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    } else {
      return `上午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    }
  }
  // 计算是否是昨天
  let yesterday = new Date(currentDate - 24 * 3600 * 1000)
  if (year == yesterday.getUTCFullYear() && month == yesterday.getUTCMonth && day == yesterday.getDate()) { //昨天
    return `昨天 ${hour}:${minute < 10 ? '0' + minute : minute}`
  } else {
    return `${year}-${month + 1}-${day} ${hour}:${minute < 10 ? '0' + minute : minute}`
  }
}
// 格式化金额
function formatAmount(amount, decimalDigits = 2) {
  const amountStr = String(Number(amount).toFixed(decimalDigits))
  const reg = /\B(?=(?:\d{3})+$)/g
  // 是否是小数
  const isDecimal = amountStr.indexOf('.') > -1
  if (isDecimal) {
    // 整数部分
    const integerPart = amountStr.substring(0, amountStr.indexOf('.'))
    // 小数部分
    const decimalPart = amountStr.substring(amountStr.length, amountStr.indexOf('.'))
    return `${integerPart.replace(reg, ',')}${decimalPart}`
  } else {
    return amountStr.replace(reg, ',')
  }
}

// 数字转换为万单位
function formatNumber(num) {
  num = Number(num);
  if (num == 0) {
    return num + '';
  } else
    if (num > 1 && num < 10000) {
      return num + '';
    } else {
      return (num / 10000).toFixed(2) + '万';
    }
}

// 时间戳判断是否为今天昨天甚至更早时间
function checkTime(dataTime, type) {
  // 格式化时间
  let publishTime = dataTime
  if (/-/.test(publishTime)) {
    publishTime = publishTime.replace(/-/g, '/')
  }
  let pmonth = new Date(publishTime).getMonth() + 1
  let pdate = new Date(publishTime).getDate()
  let phour = new Date(publishTime).getHours() //时
  let pminute = new Date(publishTime).getMinutes() //分

  // 不同时间的时间戳
  const twentyFourHours = 24 * 60 * 60 * 1000;

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hour = date.getHours() //时
  let minute = date.getMinutes() //分
  const today = `${year}/${month}/${day}`;
  const todayTime = new Date(today).getTime();

  const yesterdayTime = new Date(todayTime - twentyFourHours).getTime();
  const lastYesterdayTime = new Date(todayTime - twentyFourHours * 2).getTime();
  const lastThreeDays = new Date(todayTime - twentyFourHours * 3).getTime();
  if (pminute < 10) {
    pminute = '0' + pminute
  }
  if (publishTime >= todayTime) {
    return phour + ':' + pminute
  } else if (yesterdayTime <= publishTime && publishTime < todayTime) {
    return '昨天 ';
  } else if (lastYesterdayTime <= publishTime && publishTime < yesterdayTime) {
    return '前天 ';
  } else if (lastThreeDays <= publishTime && publishTime < lastYesterdayTime) {
    return '3天前';
  } else {
    if (type == 'main') {
      return pmonth + '月' + pdate + '日';
    } else {
      return pmonth + '月' + pdate + '日' + '' + phour + ':' + pminute;
    }
  }
};
// 郭海洋 提示框
const showToast = (title, icon) => {
  wx.showToast({
    title,
    icon: icon || "none"
  })
}
//时间格式化
const formatDate = (value, type) => {
  if (!value) return
  let str = type || "Y-M-D h:m:s"
  const
    date = new Date(value.replace(/-/g, '/')),
    obj = {
      Y: date.getFullYear(),
      M: date.getMonth() + 1,
      D: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    }

  function addZero(val) {
    return val < 10 ? `0${val}` : val
  }

  for (let key in obj) {
    if (str.indexOf(key) != -1) {
      str = str.replace(key, addZero(obj[key]))
    }
  }

  return str
}
// 距离位置(单位:km)
const getDistance = (lat1, lng1, lat2, lng2) => {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  // 调用 return的距离单位为km
  return s;
}
const debounce = (func, wait) => {
  var timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}
//时间格式进行处理
const getTimeFormater = (strtime) => {
  //计算时间差
  let timestr = timesDiff(strtime)
  if (timestr.days == 0) {
    return timestr.hours + '时' + timestr.minutes + '分'
  }

  let date = new Date(strtime.replace(/-/g, "/"));
  // date 预计送达时间戳
  date = Date.parse(date);
  // 转为国际标准时间
  let time = new Date(parseInt(date));
  // 一共相差几天
  let days = parseInt((date - new Date().getTime()) / 86400000);
  // 今天是几号
  let today = new Date().getDate();
  let mouth = time.getMonth() + 1;
  // 预计送达是几号
  let day = time.getDate();
  let hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  let min = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  // offset 面试日期-今天日期差
  let offset = Math.abs(day - today);
  let obj = {
    // 日期
    date: "",
    // 具体时间
    time: hour + ":" + min,
  };
  // 这里双重判断，第一个判断days < 3是验证是否在同一个月，第二个offset < 3是判断是验证相差是几天
  if (days < 3 && offset < 3) {
    if (offset === 0) {
      obj.date = "今天";
    } else if (offset === 1) {
      obj.date = "明天";
    } else if (offset === 2) {
      obj.date = "后天";
    }
  } else {
    obj.date = mouth + "月" + day + "日"
  }
  return obj.date + ' ' + obj.time;
}
// step
const urlBack = (step) => {
  let url = ''
  let versions = wx.getStorageSync('versions')
  switch (step) {
    case 1:
      // 1跳到添加求职期望
      if (versions == 1) {
        url = "/subpackPage/user/editJobExp/editJobExp?step=1"
      } else {
        //添加逻辑，首次添加求职期望要先添加地址
        //url: `/subpackPage/versions/sclectPost/sclectPost`,
        url: "/subpackPage/index/cityIndexEdition/index?step=1"
      }
      break;
    case 16:
      // 16未完善个人信息
      if (versions == 1) {
        let nickName=wx.getStorageSync('userInfo').info.nickName
        let workDate=wx.getStorageSync('userInfo').info.startWorkDate
        if(nickName && !workDate){
          url="/subpackPage/user/personalInfoNew/step2"
        }else if(nickName && workDate){
          url="/subpackPage/user/personalInfoNew/step3"
        }else{
          url="/subpackPage/user/personalInfoNew/step1"
        }
      } else {
        url = "/subpackPage/versions/jobManage/jobManage"
      }
      break;
    default:
      // 0跳到企业招聘者首页
      url = "/pages/index/index"
      break;
  }
  return url
}

// 是否追加 历史记录
const historyListWhether = (historyList, pushItem, type) => {
  if (historyList.length < 20) {
    if (Object.prototype.toString.call(pushItem) == `[object Object]`) {
      historyList.push(pushItem)
    }
    if (Object.prototype.toString.call(pushItem) == `[object String]`) {
      historyList.push({ name: pushItem })
    }
    // wx.setStorageSync('history', historyList)
    wx.setStorageSync(type, historyList)
  }
}

/*函数节流*/
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 1500;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}
function calculateAge(birthDateString) {
  var today = new Date();
  var birthDate = new Date(birthDateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
} 
// 去重
const quchong = (arr) => {
  let newList3 = [];
  let map = new Map()
  arr.forEach((item) => {
    // 如果map.has指定的item不存在，那么就设置key和value 这个item就是当前map里面不存在的key,把这个item添加到新数组
    // 如果下次出现重复的item，那么map.has(item等于ture 取反 !map.has(item)  不执行
    if (!map.has(item)) {
      map.set(item, 'true')
      newList3.push(item)
    }
  })
  console.log('newList3', newList3);
}


module.exports = {
  historyListWhether,
  wxPromisify,
  isToday,
  getNowTime,
  calcTimeHeader,
  diffTime,
  timesDiff,
  getDistance,
  getNowFormatDate,
  formatDate,
  formatAmount,
  formatNumber,
  checkTime,
  showToast,
  getTimeFormater,
  debounce,
  urlBack,
  throttle,
  quchong,
  calculateAge
}