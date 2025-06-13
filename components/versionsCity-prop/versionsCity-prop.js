import { getAreaData } from '../../http/index'
import { showToast } from '../../utils/util'
import { getPostInfoArea } from '../../http/api'
var app = getApp()
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        versionsCityHeight: {
            type: Number,
            value: 0
        },
        // 区域id
        areaId: {
            type: Number || String,
            observer: function (newVal) {
                this.postInfoArea(newVal)
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight,
        baseImageUrl: app.globalData.baseImgUrl,
        globalBottom: app.globalData.globalBottom,
        addressInfo: {}, // 点击进来的位置信息
        id: 'scroll-street',
        nowindex: '',// 左边颜色项
        // 左边标题
        leftTitle: [
            { name: '省', type: 'province', id: '', num: 0 },
            { name: '市', type: 'city', id: '', num: 1 },
            { name: '县/区', type: 'district', id: '', num: 2 },
            { name: '镇/乡/街道', type: 'street', id: '', num: 3 },
        ],
        districtList: [], // 县/区
        streetList: [], // 镇/乡/街道
        cityList: [], // 市
        provinceList: [], // 省
        selectedList: [], // 选择的区域
        isNumOne: true, // 是否是第一次
        type: '', // 区分求职期望和首页位置选择 (1为求职期望选择地址)
    },
    lifetimes: {
        attached() {
            // let postArea = wx.getStorageSync('postArea')

        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 获取当前点击的求职期望或者添加求职期望获取地址
        async postInfoArea(id) {
            let params = { id }
            const res = await getPostInfoArea(params)
            if (res.code !== 200) return
            this.setData({ addressInfo: res.data })
            console.log(this.data.addressInfo, '000')
            if (this.data.addressInfo) {
                if (this.data.addressInfo.districtId) {
                    this.getAreaList(this.data.addressInfo.districtId, 'street')
                } else if (this.data.addressInfo.cityId) {
                    this.getAreaList(this.data.addressInfo.cityId, 'district')
                } else if (this.data.addressInfo.provinceId) {
                    this.getAreaList(this.data.addressInfo.provinceId, 'city')
                }

                let idList = [
                    { id: this.data.addressInfo.provinceId, type: 'province' }, // 省
                    { id: this.data.addressInfo.cityId, type: 'city' }, // 市
                    { id: this.data.addressInfo.districtId, type: 'district' }, // 县
                    { id: this.data.addressInfo.streetId, type: 'street' }, // 街道
                ]
                let _leftTitle = null
                let _selectedList = []
                idList.map((item, index) => {
                    _leftTitle = this.data.leftTitle.map(i => {
                        if (i.type == item.type) {
                            i.id = item.id
                        }
                        return {
                            ...i
                        }
                    })
                })
                // 初始就追加已选择的内容
                let province = { name: this.data.addressInfo.provinceName, id: this.data.addressInfo.provinceId, type: 'province' }
                let city = { name: this.data.addressInfo.cityName, id: this.data.addressInfo.cityId, type: 'city' }
                let district = { name: this.data.addressInfo.districtName, id: this.data.addressInfo.districtId, type: 'district' }
                let street = { name: this.data.addressInfo.streetName, id: this.data.addressInfo.streetId, type: 'street' }
                if (province.id && province.name) { _selectedList.push(province) }
                if (city.id && city.name) { _selectedList.push(city) }
                if (district.id && district.name) { _selectedList.push(district) }
                if (street.id && street.name) { _selectedList.push(street) }
                this.setData({
                    leftTitle: _leftTitle,
                    selectedList: _selectedList
                })
            } else {
                this.getAreaList(0, 'province')
            }
        },
        // 左边切换
        cutCity(event) {
            let { type, id, index } = event.currentTarget.dataset
            if (index == 0) {
                this.getAreaList(0, this.data.leftTitle[index].type)
            } else {
                if (!this.data.leftTitle[index - 1].id) return showToast(`请先选择${this.data.leftTitle[index - 1].name}`)
                this.getAreaList(this.data.leftTitle[index - 1].id, this.data.leftTitle[index].type)
            }
        },
        // 获取默认
        async getAreaList(id, level) {
            let params = {
                id: id,
                level: level
            }
            const res = await getAreaData(params)
            if (res.code !== 200) return
            // 设置县区的数据
            if (level == 'district') {
                let districtList = this.dispose(res.data, 'district', this.data.leftTitle[2].id)
                this.setData({
                    districtList: districtList,
                    nowindex: level,
                    id: `scroll-${level}`
                })
            } else if (level == 'street') { // 镇/乡/街道
                let streetList = this.dispose(res.data, 'street', this.data.leftTitle[3].id)
                this.setData({
                    streetList: streetList,
                    nowindex: level,
                    id: `scroll-${level}`
                })
            } else if (level == 'city') {
                let cityList = this.dispose(res.data, 'city', this.data.leftTitle[1].id)
                this.setData({
                    cityList: cityList,
                    nowindex: level,
                    id: `scroll-${level}`
                })
            } else if (level == 'province') {
                let provinceList = this.dispose(res.data, 'province', this.data.leftTitle[0].id)
                this.setData({
                    provinceList: provinceList,
                    nowindex: level,
                    id: `scroll-${level}`
                })
            }
        },
        // 关闭弹窗
        back() {
            this.triggerEvent('onClose')
        },
        // 选择省市区街道
        SELECTED(event) {
            let { item, list, nexttype, currenttype, index } = event.currentTarget.dataset
            let _list = this.disposeRight(list, item)
            let _upDataList = currenttype + 'List'
            let _nextList = nexttype + 'List'
            let _leftTitle = []
            _leftTitle = this.data.leftTitle.map(i => {
                if (currenttype == i.type) {
                    i.id = item.id
                }
                if (i.num > index) {
                    i.id = ''
                }
                return {
                    ...i
                }
            })
            this.setData({
                [_upDataList]: _list,
                [_nextList]: [],  // 清除下一层级的数组数据, 防止出现问题
                leftTitle: _leftTitle
            })
            this.addSelectedList(item, currenttype, this.data.isNumOne)
            if (nexttype == 0) return
            this.getAreaList(item.id, nexttype)
        },
        // 处理数据(左边选择省市区街道)
        dispose(typeList, type, id) {
            if (type == 'city' || type == 'district' || type == 'province' || type == 'street') {
                let radio = false
                let disposeList = typeList.map(item => {
                    let subList = item.subList.map(i => {
                        if (i.id == id) {
                            radio = true
                        } else {
                            radio = false
                        }
                        return {
                            ...i,
                            radio: radio,
                            type: type
                        }
                    })
                    return {
                        py: item.py,
                        subList: subList
                    }
                })
                return disposeList
            }
        },
        // 处理数据(右边选择单个)
        disposeRight(arrList, item) {
            let list = null
            let subList = null
            let radio = false
            list = arrList.map((e, index) => {
                subList = e.subList.map(i => {
                    if (i.id == item.id) {
                        radio = true
                    } else {
                        radio = false
                    }
                    return {
                        ...i,
                        radio: radio
                    }
                })
                return {
                    py: e.py,
                    subList: subList
                }
            })
            return list
        },
        // 追加地址
        addSelectedList(item, type, isFlag) {
            if (type == 'street' && isFlag) { // 选择的是镇/乡/街道
                this.data.selectedList = [] // 清空之后再次更新
                let province = { name: this.data.addressInfo.provinceName, id: this.data.addressInfo.provinceId, type: 'province' }
                let city = { name: this.data.addressInfo.cityName, id: this.data.addressInfo.cityId, type: 'city' }
                let district = { name: this.data.addressInfo.districtName, id: this.data.addressInfo.districtId, type: 'district' }
                let street = { name: item.name, id: item.id, type: item.type }
                this.data.selectedList.push(province)
                this.data.selectedList.push(city)
                this.data.selectedList.push(district)
                this.data.selectedList.push(street)
            } else {
                // 如果点击的是除街道之外的位置,则不是第一次点击/再次点击街道时,需要将第一次的状态修改
                this.setData({ isNumOne: false })
                // 点击的不是镇/乡/街道
                // 查找对应的索引
                let selectedIndex = this.data.selectedList.findIndex(e => e.type == item.type)
                console.log(selectedIndex, '是打击挨打')
                if (this.data.selectedList.findIndex(e => e.type == item.type) >= 0) {
                    // 将最新选择的数据追加到已选数组中
                    this.data.selectedList.splice(selectedIndex)
                    this.data.selectedList[selectedIndex] = item
                } else {
                    this.data.selectedList.push(item)
                }
            }
            this.setData({
                selectedList: this.data.selectedList
            })
        },
        // 删除已选择的地址
        delete(event) {
            let { id, type, index } = event.currentTarget.dataset
            this.data.selectedList.splice(index)
            let _leftTitle = []
            _leftTitle = this.data.leftTitle.map(i => {
                if (i.num >= index) {
                    i.id = ''
                }
                return {
                    ...i
                }
            })
            this.setData({
                nowindex: type,
                selectedList: this.data.selectedList,
                leftTitle: _leftTitle
            })
            if (index == 0) {
                this.getAreaList(0, this.data.leftTitle[index].type)
            } else {
                this.getAreaList(this.data.leftTitle[index - 1].id, this.data.leftTitle[index].type)
            }
        },
        // 底部按钮-(清除)
        reset(event) {
            let { type } = event.currentTarget.dataset
            let _leftTitle = []
            _leftTitle = this.data.leftTitle.map(i => {
                if (i.num >= 0) { i.id = '' }
                return { ...i }
            })
            this.setData({
                selectedList: [],
                nowindex: type,
                leftTitle: _leftTitle
            })
            this.getAreaList(0, type)
        },
        // 底部按钮-(确定)
        comfirmScreening() {
            this.triggerEvent('comfirmCity', this.data.selectedList[this.data.selectedList.length - 1])
        },
        onScroll() {

        }
    }
})