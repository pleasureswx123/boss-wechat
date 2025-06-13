import { dictionaryIndustry, apiSystemVocation } from '../../../http/api'
var app = getApp()
Page({
    data: {
        datalist: [],
        selectTags: [],
        imageUrl: app.globalData.baseImgUrl, //图片路径
        screenType: '',
        tabIndex: "scroll-0",//右边瞄点项,
        skilllist: [], // 当前选择的技能
    },
    goBack() {
        wx.navigateBack()
    },
    onLoad(options) {
        console.log(options, '0000')
        //求职岗位带过来businessId
        if (options.id) {
            this.setData({
                businessIds: options.id && options.id.split(',')
            })
        }
        if (options.skilllist && options.skilllist !== '') {
            this.setData({ skilllist: options.skilllist.split(','), selectTags: options.skilllist.split(',').map(item => { return { name: item } }) })
        }
        if (options.type) {
            this.setData({
                screenType: options.type
            })
        }
        if (options.num) {
            this.setData({
                num: options.num
            })
        }
        if (options.val) {
            this.setData({
                type: options.val
            })
        }
        if (options.val == 'jineng') {
            this.getSystemVocation({ vocation: options.postId })
        } else {
            this.getDictionaryIndustry()
        }
    },
    getSystemVocation(param) {
        apiSystemVocation(param).then(res => {
            if (res.code == 200) {
                // this.setData1(res.data)
                let resdata = res.data
                let _selectTags = this.data.selectTags
                res.data.map((item, index) => {
                    item.num = 0
                    if (!this.data.businessIds && index == 0) {
                        item.selected = true
                    } else {
                        item.selected = false
                    }
                    item.subList.map(sitem => {
                        if (this.data.businessIds && this.data.businessIds.indexOf(String(sitem.code)) >= 0 && type != 1) {
                            sitem.selected = true
                            item.num++
                            _selectTags.push(sitem)
                        } else {
                            sitem.selected = false
                        }
                    })
                })
                this.setData({
                    datalist: resdata,
                    selectTags: _selectTags
                })
                let activeList = []
                console.log(this.data.skilllist, '555')
                if (this.data.skilllist.length > 0) {
                    this.data.skilllist.map(it => {
                        activeList = resdata.map(item => {
                            let subList = item.subList.map(i => {
                                if (i.name == it) {
                                    i.selected = true
                                }
                                return {
                                    ...i
                                }
                            })
                            return {
                                code: item.code,
                                id: item.id,
                                name: item.name,
                                num: item.num,
                                remark: item.remark,
                                selected: item.selected,
                                subList: subList
                            }
                        })
                    })
                    this.setData({
                        datalist: activeList,
                    })
                }

            }
        })
    },
    getDictionaryIndustry() {
        dictionaryIndustry().then(res => {
            if (res.code == 200) {
                this.setData1(res.data)
            }
        })
    },
    //type用于清除是否清除按钮
    setData1(resdata, type) {
        let _selectTags = this.data.selectTags
        resdata.map((item, index) => {
            item.num = 0
            if (!this.data.businessIds && index == 0) {
                item.selected = true
            } else {
                item.selected = false
            }
            item.subList.map(sitem => {
                if (this.data.businessIds && this.data.businessIds.indexOf(String(sitem.code)) >= 0 && type != 1) {
                    sitem.selected = true
                    item.num++
                    _selectTags.push(sitem)
                } else {
                    sitem.selected = false
                }
            })
        })
        this.setData({
            datalist: resdata,
            selectTags: _selectTags
        })
    },
    openBox(e) {
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        let _list = this.data.datalist
        _list[index].selected = !_list[index].selected
        this.setData({
            datalist: _list,
            tabIndex: `scroll-${index}`
        })
    },
    selectTags(e) {
        let sindex = e.currentTarget.dataset.sindex
        let sitem = e.currentTarget.dataset.sitem
        let index = e.currentTarget.dataset.index
        let _list = this.data.datalist
        let _num = this.data.num || 3
        if (this.data.selectTags.length >= _num && !_list[index].subList[sindex].selected) {
            wx.showToast({
                title: '最多选' + _num + '个',
                icon: 'none'
            })
            return
        }
        _list[index].subList[sindex].selected = _list[index].subList[sindex].selected ? false : true
        let _selectTags = this.data.selectTags
        if (_list[index].subList[sindex].selected) {
            _list[index].num = _list[index].num + 1
            _selectTags.push({ name: _list[index].subList[sindex].name, id: _list[index].subList[sindex].code, code: _list[index].subList[sindex].code,isActive:true})
        } else {
            _selectTags = _selectTags.filter(item => item.name != _list[index].subList[sindex].name)
            _list[index].num = _list[index].num - 1
        }
        this.setData({
            datalist: _list,
            selectTags: _selectTags
        })
    },
    clearTab() {
        this.setData1(this.data.datalist, 1)
        this.setData({
            selectTags: []
        })
    },
    clearSingle(e) {
        let litem = e.currentTarget.dataset.item
        let _selectTags = this.data.selectTags
        let _datalist = this.data.datalist
        _selectTags = _selectTags.filter(item => item.name != litem.name)
        _datalist.map((item, index) => {
            item.subList.map(sitem => {
                if (sitem.name == litem.name) {
                    sitem.selected = false
                    item.num--
                }
            })
        })
        this.setData({
            selectTags: _selectTags,
            datalist: _datalist
        })
    },
    goBack() {
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        if (this.data.screenType == 'shaixuan') {
            const eventChannel = this.getOpenerEventChannel();
            // 触发事件并传递数据
            eventChannel.emit('selectTags', { selectTags: this.data.selectTags });
            wx.setStorageSync('selectTags', this.data.selectTags)
        } else {
            if (this.data.type == 'jineng') {
                beforePage.selectedJN(this.data.selectTags);
            } else {
                beforePage.selectedHy(this.data.selectTags);
            }
        }
        wx.navigateBack({
            delta: 1 //返回上一级页面
        })
    }
})