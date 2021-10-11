import config from "../../utils/config";
import ArRTC from "../../utils/ArRTCMiniapp@latest";
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
    enableAudio: true,
    timer: null,
  },

  onLoad(options) {
    log.info(`${this.data.userId} 正在发布视频流, 房间号：${options.roomId}`);
    wx.showLoading({
      title: '正在发布视频流，请稍后',
      mask: true,
    });
    const timer = setTimeout(() => {
      wx.hideLoading();
      log.error(`${this.data.userId} 视频流发布失败, 房间号：${options.roomId}`);
      wx.showToast({
        icon: 'none',
        title: '视频流发布失败，请稍后重试',
        mask: true,
      });
      setTimeout(() => {
        wx.hideToast();
        const { data: { client }, clearData } = this;
        wx.navigateBack({ delta: 1 });
        client.destroy(() => {
          clearData();
        }, (e) => {
          log.error(`${this.data.userId} 销毁客户端对象失败, 房间号：${options.roomId}，错误信息：${e}`);
          wx.showToast({
            title: '销毁客户端对象失败',
            icon: 'none',
            mask: true,
          });
        });
      }, 3000);
    }, 15000);
    this.setData({ timer });
    wx.setNavigationBarTitle({ title: `房间号： ${options.roomId}` });

    let roomId = "" + options.roomId;
    this.onScreen();
    this.setData({ roomId }, () => {
      this.init();
    });
  },

  // 初始化 
  async init() {
    const { APPID, SERVERAdd, PORT, WSS } = config;
    var client = new ArRTC.client();  // 生成本地实例
    log.info(`${this.data.userId} 生成本地实例, 房间号：${this.data.roomId}`);
    await client.init(APPID); // 初始化本地实例
    log.info(`${this.data.userId} 初始化本地实例, 房间号：${this.data.roomId}`);
    // 配置私有云
    if (SERVERAdd && PORT && typeof WSS === "boolean") {
      client.setParameters({
        ConfPriCloudAddr: {
          ServerAdd: SERVERAdd,
          Port: PORT,
          Wss: WSS,
        }
      });
      log.info(`${this.data.userId} 配置私有云, 房间号：${this.data.roomId}`);
    };

    // 远端用户发布媒体流
    client.on('stream-added', (data) => {
      const { uid } = data;
      // 订阅远端媒体流
      client.subscribe(uid, (url) => {
        this.data.operationUser.push({
          uid,
          pullUrl: url,
        });
        this.setData({ operationUser: this.data.operationUser }, () => {
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
      const { uid } = data;
      const len = this.data.operationUser.length - 1;
      for (var i = len; i >= 0; i--) {
        if (this.data.operationUser[i].uid === uid) {
          log.info(`${uid}远端用户删除音视频流, 房间号：${options.roomId}`);
          this.data.operationUser.splice(i, 1);
        }
      };
      this.setData({ operationUser: this.data.operationUser });
    });

    // 通知应用程序已更新 Url 地址。 该回调中会包含远端用户的 ID 和更新后的拉流地址
    client.on('update-url', (data) => {
      const { uid, url } = data;
      this.data.operationUser.forEach((item) => {
        if (item.uid == uid) {
          log.info(`${uid} 远端用户已更新 Url 地址, 房间号：${options.roomId}, 更改后的 Url 地址：${url}`);
          item.pullUrl = url;
        }
      });
      this.setData({ operationUser: this.data.operationUser });
    });

    this.setData({ client }, () => {
      this.addChannel();
    });
  },

  bindstatechange(code) {
    console.log(code.detail.message, '-------------', code.detail.code)
  },

  // 加入频道
  addChannel() {
    const { client, userId, roomId, timer } = this.data;
    client.join(undefined, roomId, userId, () => {
      log.info(`${this.data.userId} 加入房间成功, 房间号：${this.data.roomId}`);
      // 发布本地视频流
      client.publish((url) => {
        clearTimeout(timer);
        wx.hideLoading();
        log.info(`${this.data.userId} 视频流发布成功, 房间号：${this.data.roomId}`);
        this.setData({ publishUrl: url });
      }, (e) => {
        wx.hideLoading();
        log.error(`${this.data.userId} 视频流发布失败, 房间号：${this.data.roomId}，错误信息：${e}`);
        wx.showToast({
          icon: 'none',
          title: '视频流发布失败，请稍后重试',
          mask: true,
          duration: 3000
        });
        setTimeout(() => {
          wx.hideToast();
          this.setData({ client: null });
          wx.navigateBack({
            delta: 1,
          });
        }, 3000);
      });
    }, (e) => {
      log.error(`${this.data.userId} 加入房间失败, 房间号：${options.roomId}，错误信息：${e}`);
    });
  },

  // 切换摄像头
  switchCamera() {
    wx.createLivePusherContext().switchCamera();
    log.info(`${this.data.userId} 切换摄像头, 房间号：${options.roomId}`);
  },

  // 切换美颜
  switchBeauty() {
    this.setData({
      beautyStyle: this.data.beautyStyle === 'smooth' ? 'nature' : 'smooth',
      beauty: this.data.beauty === 0 ? 9 : 0,
      whiteness: this.data.whiteness === 0 ? 9 : 0,
    }, () => {
      if (this.data.beauty === 9) {
        log.info(`${this.data.userId} 开启了美颜, 房间号：${this.data.roomId}`);
      } else {
        log.info(`${this.data.userId} 关闭了美颜, 房间号：${this.data.roomId}`);
      }
    });
  },

  // 切换静音
  switchAudio() {
    const { client, enableAudio } = this.data;
    client[enableAudio ? 'muteLocal' : 'unmuteLocal']('audio', () => {
      this.setData({
        enableAudio: !enableAudio,
      }, () => {
        if (this.data.enableAudio) {
          log.info(`${this.data.userId} 开启了声音, 房间号：${this.data.roomId}`);
        } else {
          log.info(`${this.data.userId} 关闭了声音, 房间号：${this.data.roomId}`);
        }
      });
    });
  },

  // 切换 debug
  switchDebug() {
    this.setData({
      debug: !this.data.debug
    }, () => {
      if (this.data.debug) {
        log.info(`${this.data.userId} 开启debug, 房间号：${this.data.roomId}`);
      } else {
        log.info(`${this.data.userId} 关闭debug, 房间号：${this.data.roomId}`);
      }
    });
  },

  // 离开房间
  leaveRoom() {
    const { data: { client }, clearData } = this;
    wx.showModal({
      title: "提示",
      content: "确认退出会议？",
      success(res) {
        if (res.confirm) {
          // 销毁客户端对象
          client.destroy(() => {
            clearData();
            log.info(`${this.data.userId} 销毁客户端对象成功, 房间号：${this.data.roomId}`);
            wx.navigateBack({ delta: 1 });
          }, (e) => {
            log.error(`${this.data.userId} 销毁客户端对象失败, 房间号：${this.data.roomId}，错误信息：${e}`);
            wx.showToast({
              title: '销毁客户端对象失败',
              icon: 'none',
              mask: true,
            });
          });
        }
      }
    });
  },

  // 重置 data
  clearData() {
    this.setData({
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
      enableAudio: true,
      timer: null,
    });
  },

  // 保持屏幕常亮
  onScreen() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
  },

  // 关闭屏幕常亮
  offScreen() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  // 生命周期函数--监听页面隐藏
  onShareAppMessage: function (res) {
    // return custom share data when user share.
    return {
      title: "快来参加我们的视频会议吧~",
      path: "/pages/meet/meet?roomId=" + this.data.roomId
    };
  },

  // 生命周期函数--监听页面卸载
  onUnload() {
    this.offScreen();
    const { data: { client }, clearData } = this;
    if (client == null) return
    client.destroy(() => {
      clearData();
      log.info(`${this.data.userId} 销毁客户端对象成功, 房间号：${this.data.roomId}`);
    }, (e) => {
      log.error(`${this.data.userId} 销毁客户端对象失败, 房间号：${this.data.roomId}，错误信息：${e}`);
      wx.showToast({
        title: '销毁客户端对象失败',
        icon: 'none',
        mask: true,
      });
    });
  },
  
  onHide() {
    this.offScreen();
    const { data: { client }, clearData } = this;
    if (client == null) return
    client.destroy(() => {
      clearData();
      log.info(`${this.data.userId} 销毁客户端对象成功, 房间号：${this.data.roomId}`);
    }, (e) => {
      log.error(`${this.data.userId} 销毁客户端对象失败, 房间号：${this.data.roomId}，错误信息：${e}`);
      wx.showToast({
        title: '销毁客户端对象失败',
        icon: 'none',
        mask: true,
      });
    });
  }
});