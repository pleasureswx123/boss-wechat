import { resumeFileUpdate } from '../../../http/api'
import { showToast } from '../../../utils/util'
Page({
  data: {
    name: ''
  },
  confirmValue(event) {
    this.setData({
      name: event.detail.value
    })
  },
  clearText() {
    this.setData({
      name: ''
    })
  },
  goBack() {
    let _chagenName = this.data.name + '.' + this.data.extension
    let params = {
      id: this.data.id, 
      fileName: _chagenName
    }
    resumeFileUpdate(params).then(res => {
      if (res.code == 200) {
        showToast('修改成功')
        setTimeout(() => {
          wx.navigateBack()
        }, 500);
      }
    })
  },
  onLoad(options) {
    this.setData({
      id: options.id,
      name: options.name,
      extension: options.extension
    })
  }
})