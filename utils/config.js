const APPID = "99be5d9871ab4456af8b2e0db9f2ff8c";

if (APPID === "") {
  wx.showToast({
    title: `请在config.js中提供正确的appid`,
    icon: 'none',
    duration: 5000
  });
}

module.exports = {
  APPID: APPID
}
