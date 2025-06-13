import {
    baseUrl
} from '../http/http';

// 图片1 文件2
const uploadFile = function (url, id, fileType, name, ossUrl, type, cid) {
    return new Promise(resolve => {
        wx.showLoading({
            title: '上传中···',
        })
        wx.uploadFile({
            url: baseUrl + '/oss/' + ossUrl, //仅为示例，非真实的接口地址
            filePath: url,
            header: {
                "Content-Type": "multipart/form-data",
                'jtzstoken': wx.getStorageSync('jtzstoken')
            },
            name: 'file',
            formData: {
                'fileType': fileType,
                'type': type,
                'lid': id,
                "fileName": name,
                'cid': cid
            },
            success(res) {
                wx.hideLoading({
                  success: (res) => {},
                })
                if (res.statusCode == 200) {
                    const data = JSON.parse(res.data)
                    if (data.code == 200) {
                        if(cid){
                            resolve(data);
                        }else{
                            resolve(true);
                        }
                    } else {
                        wx.showToast({
                            title: '上传失败',
                            icon: 'none'
                        })
                    }
                } else {
                    wx.showToast({
                        title: '上传失败',
                        icon: 'none'
                    })
                }
            },
            fail(err) {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '上传异常',
                    icon: 'none'
                })
            }
        })
    })
}

module.exports = {
    uploadFile: uploadFile
}