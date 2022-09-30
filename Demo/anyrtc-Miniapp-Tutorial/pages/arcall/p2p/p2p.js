import {
    RTM,
    Store
} from "../../../utils/arcall/index";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        motto: "",
        peeruid: ""
    },
    // 用户输入
    validCodeChange(e) {
        // 远端用户
        if (e.detail.length == 4) {
            this.setData({
                peeruid: e.detail
            })
            Store.peerUserId = e.detail;
        }
    },
    // 开始呼叫
    async sendCall() {
        if (Store.peerUserId == this.data.motto) {
            wx.showToast({
                title: '不能呼叫自己',
                icon: 'error',
                duration: 2000
            });
            this.setData({
                peeruid: ""
            });
            return false;
        }
        // 查询远端用户是否在线
        const oLine = await RTM.rtmInternal.peerUserQuery(Store.peerUserId);
        if (oLine) {
            wx.showActionSheet({
                itemList: ['视频通话', '语音通话'],
                success(res) {
                    // 发送呼叫邀请
                    RTM.rtmInternal.inviteSend(res.tapIndex);
                },
                fail(res) {
                    console.log(res.errMsg)
                }
            })

        } else {
            this.setData({
                peeruid: ""
            });
            return false;
        }
    },
    // 返回
    goBack() {
        wx.showLoading({
            title: '跳转中',
        })
        wx.reLaunch({
            url: '../index/index',
            success: () => {
                wx.hideLoading()
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            motto: Store.userId
        })
        Store.State = 0;
    },


})