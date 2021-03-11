var ArRTC = require('../../utils/ArRTCMiniapp@latest');
import config from  '../../utils/config';
Page({
    data: {
        userID: 'weixin' + Math.floor(Math.random() * 10000000),// 本地用户id
        publishUrl: '',// 推流地址
        localAudioMute: false,// 是否禁用本地音频流
        localVideoMute: false,// 是否禁用本地视频流
        operationUser: [],// 远端用户列表
        client: null,// 本地实例对象
        deviceText: '后置摄像头',// 摄像头文字
        roomNumber: '',// 频道地址
        enable: true,//是否开启摄像头
        countdown: null, // 定时器
    },
    onLoad(option) {
        wx.showLoading({
            title: '正在发布视频流，请稍后',
            mask: true,
        })

        this.setData({ roomNumber: option.roomNumber }, () => {
            this.init();
        });

        // 保持手机屏幕常亮
        wx.setKeepScreenOn({ keepScreenOn: true });

        // 监听网络变化
        wx.onNetworkStatusChange((res) => {
            if (res.isConnected) {
                wx.hideToast();
                clearInterval( this.data.countdown );
            } else {
                wx.showToast({
                    title: `网络连接已断开，尝试恢复连接...`,
                    icon: 'none',
                    duration: 30000,
                    mask: true,
                });
                let seconds = 20;
                let countdown = setInterval(() => {
                    seconds -= 1;
                    if (seconds <= 0) {
                        clearInterval( countdown );
                        wx.hideToast();
                        this.setData({ client: null });
                        wx.navigateBack({
                          delta: 1,
                        });
                    };
                }, 1000);
                this.setData({ countdown });
            };
        });
    },
    // 初始化
    async init() {
        const { APPID, SERVERAdd, PORT, WSS } = config;
        var client = new ArRTC.client();  // 生成本地实例
        await client.init(APPID); // 初始化本地实例
        // 配置私有云
        if (SERVERAdd && PORT && WSS) {
            client.setParameters({ 
                ConfPriCloudAddr: { 
                    ServerAdd: SERVERAdd,
                    Port: PORT,
                    Wss: WSS,
                },
            });
        };
        this.setData({ client }, () => {
            this.addChannel();
        });
    },

    // 加入频道
    addChannel() {
        const { client, userID, roomNumber } = this.data;
        client.join(undefined, roomNumber, userID, () => {
            // 发布本地视频流
            client.publish((url) => {
                wx.hideLoading();
                this.setData({ publishUrl: url });
            },() => {
                wx.hideLoading();
                wx.showToast({
                    title: '视频流发布失败，请稍后重试',
                    mask: true,
                });
                setTimeout(() => {
                    wx.hideToast();
                    this.setData({ client: null });
                    wx.navigateBack({
                        delta: 1,
                    });
                });
            });
            // 远端用户发布媒体流
            client.on('stream-added', (data) => {
                const { uid } = data;
                // 订阅远端媒体流
                client.subscribe(uid, (url) => {
                    this.data.operationUser.push({
                        uid,
                        pullUrl: url,
                        isSubscribe: true,
                        isMuteAudio: true,
                        isMuteVideo: true,
                    });
                    this.setData({ operationUser: this.data.operationUser });
                })
            });

            // 远端用户删除音视频流
            client.on('stream-removed', (data) => {
                const { uid } = data;
                this.data.operationUser.forEach((item, index) => {
                    if (item.uid == uid) {
                        this.data.operationUser.splice(index, 1);
                    }
                });
                this.setData({ operationUser: this.data.operationUser });
            });

            // 通知应用程序已更新 Url 地址。 该回调中会包含远端用户的 ID 和更新后的拉流地址
            client.on('update-url', (data) => {
                const { uid, url } = data;
                this.data.operationUser.forEach((item) => {
                    if (item.uid == uid) {
                        item.pullUrl = url;
                    }
                });
                this.setData({ operationUser: this.data.operationUser });
            });
        })
    },

    // 关闭远程用户声音或视频
    mute(e) {
        const { uid, target, index } = e.target.dataset;
        const { client } = this.data;
        client.mute(uid , target);
        if (target == 'audio') {
            this.data.operationUser[index].isMuteAudio = false;
        } else if (target == 'video') {
            this.data.operationUser[index].isMuteVideo = false;
        }
        this.setData({ operationUser: this.data.operationUser })
    },

    // 开启远程用户声音或视频
    unmute(e) {
        const { uid, target, index } = e.target.dataset;
        const { client } = this.data;
        client.unmute(uid, target);
        if (target == 'audio') {
            this.data.operationUser[index].isMuteAudio = true;
        } else if (target == 'video') {
            this.data.operationUser[index].isMuteVideo = true;
        }
        this.setData({ operationUser: this.data.operationUser })
    },

    // 停止发送本地用户的音视频流
    muteLocal(e) {
        const { client } = this.data;
        const { target } = e.target.dataset;
        client.muteLocal(target, () => {
            if (target == 'audio') {
                this.setData({ localAudioMute: true })
            } else {
                this.setData({ localVideoMute: true , enable: false })
            };
        });
    },

    // 恢复发送本地音视频流
    unmuteLocal(e) {
        const { client } = this.data;
        const { target } = e.target.dataset;
        client.unmuteLocal(target, () => {
            if (target == 'audio') {
                this.setData({ localAudioMute: false })
            } else {
                this.setData({ localVideoMute: false , enable: true })
            };
        });
    },

    // 切换摄像头方向
    changeDevice() {
        let { deviceText } = this.data;
        deviceText = deviceText == '后置摄像头' ? '前置摄像头': '后置摄像头';
        let LivePusherContext = wx.createLivePusherContext();
        LivePusherContext.switchCamera();
        this.setData({ deviceText });
    },

    // 离开频道
    async leave() {
        const { client } = this.data;
        // 销毁客户端对象
        client.destroy(() => {
            wx.offNetworkStatusChange();
            wx.navigateBack({ delta: 1 });
        }, () => {
            wx.showToast({
                title: '销毁客户端对象失败',
                icon: 'none',
                mask: true,
            });
        });
    },
    
    // 如果页面被卸载时被执行
    onUnload() {
        // 保持手机屏幕常亮
        wx.setKeepScreenOn({ keepScreenOn: false });
        this.leave();
    },

    // 状态变化事件
    bindpushstatechange(e) {
        console.log(e.detail.code, e.detail.message);
    },

    // 播放状态变化事件
    bindplaystatechange(e) {
        console.log(e.detail.code, e.detail.message);
    },
})