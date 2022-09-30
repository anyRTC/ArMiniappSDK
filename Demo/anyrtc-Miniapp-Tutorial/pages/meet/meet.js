import config from "../../utils/config";
// 引入 RTC
const ArRTC = require("ar-rtc-miniapp");
var log = require('../../utils/log.js');

Page({
    data: {
        enable: true,
        client: null,
        roomId: "",
        userId: "weixin" + parseInt(Math.random() * 10000),
        debug: false,
        beautyStyle: 'nature',
        beauty: 0,
        whiteness: 0,
        publishUrl: "",
        operationUser: [],
        enableAudio: true
    },
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: `房间号： ${options.roomId}`
        });
        wx.showLoading({
            title: '正在发布视频流，请稍后',
            mask: true,
        });
        let roomId = "" + options.roomId;
        this.onScreenChange(true);
        this.setData({
            roomId
        }, () => {
            this.init();
        });
    },

    // 初始化 
    async init() {
        const {
            APPID,
            SERVERAdd,
            PORT,
            WSS
        } = config;
        var client = new ArRTC.client(); // 生成本地实例
        log.info(`${this.data.userId} 生成本地实例, 房间号：${this.data.roomId}`);
        await client.init(APPID); // 初始化本地实例
        console.log("初始化本地实例");
        log.info(`${this.data.userId} 初始化本地实例, 房间号：${this.data.roomId}`);
        // 配置私有云
        if (SERVERAdd && PORT && typeof WSS === "boolean") {
            client.setParameters({
                ConfPriCloudAddr: {
                    ServerAdd: SERVERAdd,
                    Port: PORT,
                    Wss: WSS,
                }
            })

            log.info(`${this.data.userId} 配置私有云, 房间号：${this.data.roomId}`);
        };

        // 远端用户发布媒体流
        client.on('stream-added', (data) => {
            const {
                uid
            } = data;
            // 订阅远端媒体流
            client.subscribe(uid, (url) => {
                this.data.operationUser.push({
                    uid,
                    pullUrl: url
                });
                this.setData({
                    operationUser: this.data.operationUser
                }, () => {
                    log.info(`${this.data.userId} 订阅远端媒体流成功, 房间号：${this.data.roomId}`);
                });
            }, (e) => {
                log.error(`${this.data.userId} 订阅远端媒体流失败, 房间号：${this.data.roomId}，错误信息：${e}`);
                wx.showModal({
                    title: '错误',
                    content: '订阅远端媒体流失败',
                })
            });
        });

        // 远端用户删除音视频流
        client.on('stream-removed', (data) => {
            const {
                uid
            } = data;
            const len = this.data.operationUser.length - 1;
            for (var i = len; i >= 0; i--) {
                if (this.data.operationUser[i].uid === uid) {
                    log.info(`${uid}远端用户删除音视频流, 房间号：${this.data.roomId}`);
                    this.data.operationUser.splice(i, 1);
                }
            };
            this.setData({
                operationUser: this.data.operationUser
            });
        });

        this.setData({
            client
        }, () => {
            this.addChannel();
        });
    },



    // 加入频道
    addChannel() {
        const {
            client,
            userId,
            roomId
        } = this.data;

        client.join(undefined, roomId, userId, () => {

            log.info(`${userId} 加入房间成功, 房间号：${roomId}`);
            // 发布本地视频流
            log.info(`${userId} 正在发布视频流, 房间号：${roomId}`);
            client.publish((url) => {
                log.info(`${userId} 视频流发布成功, 房间号：${roomId}`);
                this.setData({
                    publishUrl: url
                });
            }, (e) => {
                console.log("e******", e);
                log.error(`${userId} 视频流发布失败, 房间号：${roomId}，错误信息：${e}`);
                wx.showToast({
                    icon: 'none',
                    title: '视频流发布失败，请稍后重试',
                    mask: true,
                    duration: 3000
                });
                setTimeout(() => {
                    wx.hideToast();
                    this.setData({
                        client: null
                    });
                    wx.navigateBack({
                        delta: 1
                    });
                }, 3000);
            });
            wx.hideLoading();
        }, (e) => {

            log.error(`${userId} 加入房间失败, 房间号：${roomId}，错误信息：${e}`);
        });
    },

    // 切换摄像头
    switchCamera() {
        wx.createLivePusherContext().switchCamera();
        log.info(`${this.data.userId} 切换了摄像头, 房间号：${options.roomId}`);
    },

    // 切换美颜
    switchBeauty() {
        this.setData({
            beautyStyle: this.data.beautyStyle === 'smooth' ? 'nature' : 'smooth',
            beauty: this.data.beauty === 0 ? 9 : 0,
            whiteness: this.data.whiteness === 0 ? 9 : 0,
        }, () => {
            log.info(`${this.data.userId} ${this.data.beauty === 9? '开启' : '关闭'}了美颜, 房间号：${this.data.roomId}`);
        });
    },

    // 切换静音
    switchAudio() {
        const {
            client,
            enableAudio
        } = this.data;
        client[enableAudio ? 'muteLocal' : 'unmuteLocal']('audio', () => {
            this.setData({
                enableAudio: !enableAudio
            }, () => {
                log.info(`${this.data.userId} ${this.data.enableAudio? '开启' : '关闭'}了声音, 房间号：${this.data.roomId}`);
            });
        });
    },

    // 切换 debug
    switchDebug() {
        this.setData({
            debug: !this.data.debug
        }, () => {
            log.info(`${this.data.userId} ${this.data.debug? '开启' : '关闭'}了debug, 房间号：${this.data.roomId}`);
        });
    },

    // 设置屏幕是否常亮
    onScreenChange(bool) {
        wx.setKeepScreenOn({
            keepScreenOn: bool
        });
    },

    // 生命周期函数--监听页面隐藏
    onShareAppMessage: function (res) {
        return {
            title: "快来参加我们的视频会议吧~",
            path: "/pages/meet/meet?roomId=" + this.data.roomId
        };
    },

    destruction() {
        this.onScreenChange(false);
        const {
            client,
            userId,
            roomId
        } = this.data;
        if (client == null) return
        client.destroy(() => {
            log.info(`${userId} 销毁客户端对象成功, 房间号：${this.data.roomId}， 用户ID：${this.data.userId}`);
            wx.navigateBack({
                delta: 1
            });
        }, (e) => {
            log.error(`${userId} 销毁客户端对象失败, 房间号：${this.data.roomId}， 用户ID：${this.data.userId}，错误信息：${e}`);
            wx.showToast({
                title: '销毁客户端对象失败',
                icon: 'none',
                mask: true,
            });
        });
    },

    // 离开房间
    leaveRoom() {
        const {
            destruction
        } = this;
        log.info(`离开房间：房间号：${this.data.roomId}， 用户ID：${this.data.userId}`);
        wx.showModal({
            title: "提示",
            content: "确认退出会议？",
            success(res) {
                res.confirm && destruction();
            }
        });
    },

    async bindstatechange(code) {
        console.log(code.detail.message, '-------------', code.detail.code);
        log.info(`bindstatechange 事件：${code.detail.message} --- ${code.detail.code}, 房间号：${this.data.roomId}， 用户ID：${this.data.userId}`);
    },

    // 生命周期函数--监听页面卸载
    onUnload() {
        this.destruction();
        log.info(`生命周期函数--页面卸载：房间号：${this.data.roomId}， 用户ID：${this.data.userId}`);
    },

    onHide() {
        this.destruction();
        log.info(`生命周期函数--页面隐藏：房间号：${this.data.roomId}， 用户ID：${this.data.userId}`);
    }
});