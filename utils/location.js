const authorization = async () => {
    try{
      //运行定位函数
      //把定位信息return出去
      return await getWxLocation();
    }catch{
      //处理错误 没有开定位权限的处理
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
    //     success: function (res) {
    //       if (res.confirm) {//这里是点击了确定以后
    //         console.log('用户点击确定')
    //         toSetting()
    //       } else {//这里是点击了取消以后
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    }
  }
  

const getWxLocation = () => {
    //提示定位中
    // wx.showLoading({
    //     title: '定位中...',
    //     mask: true,
    // })
    //运用promise 同步接收获取的值
    return new Promise((resolve, reject) => {
        //定义接收定位信息的函数
        let _locationChangeFn = (res) => {
            //当监听到了定位信息的数据
            console.log('location change', res)
            //返回定位数据
            resolve(res)
            wx.hideLoading()
            //关闭监听
            wx.offLocationChange(_locationChangeFn)
        }
        //开启定位服务
        wx.startLocationUpdate({
            type: 'gcj02',
            success: (res) => {
                //开启成功后启动监听 传递回调函数
                wx.onLocationChange(_locationChangeFn)
            },
            fail: (err) => {
                console.log('获取当前位置失败', err)
                // wx.hideLoading()
                //返回错误
                reject()
            }
        })
    })
}

const toSetting = () => {
    return new Promise((resolve, reject) => {
      //调起客户端小程序设置界面，返回用户设置的操作结果
      wx.openSetting({
        success: async (res)=> {
          console.log(res)
          if (res.authSetting["scope.userLocation"]) {
            // res.authSetting["scope.userLocation"]为trueb表示用户已同意获得定位信息，此时调用getlocation可以拿到信息
            let locationRes = await getlocation()
            resolve(locationRes)
          }
        },
        fail(err) {
          reject()
        }
      })
    })
  }
  
  module.exports = {
    authorization
  }

