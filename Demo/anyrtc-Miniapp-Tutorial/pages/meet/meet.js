import config from "../../utils/config";
// 引入 RTC
import ArRTC from "ar-rtc-miniapp";
const log = require("../../utils/log.js");

const { PullErrorCode, PushErrorCode } = require("../../utils/errorCode.js")

Page({
  data: {
    // RTC 客户端
    rtcClient: null,
    // RTC 房间号
    roomId: "",
    // 用户 ID
    userId: "weixin" + parseInt(Math.random() * 10000),
    // 显示调试日志
    showDebugLog: false,
    // 美颜相关
    beautyStyle: "nature",
    beauty: 0,
    whiteness: 0,
    // 推流地址
    publishUrl: "",
    // 远程用户
    remoteUsers: [],
    // 是否发布视频
    enableCamera: true,
    // 是否发布音频
    enableAudio: true
  },

  // 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
  // 参考生命周期：https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html
  // 注意：对界面内容进行设置的 API 如wx.setNavigationBarTitle，请在onReady之后进行。
  onReady() {
    log.debug("==onReady");

    // 设置导航标题
    wx.setNavigationBarTitle({
      title: `房间号： ${this.data.roomId}`
    });
    // 初始化 RTC
    this.initRTCClient();
  },

  // 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
  onLoad(options) {
    log.debug("==onLoad", options);

    // 设置房间 ID
    let roomId = "" + options.roomId;
    this.setData({
      roomId
    });
  },

  // 页面卸载时触发。如wx.redirectTo或wx.navigateBack到其他页面时。
  onUnload() {
    log.debug("==onUnload");
    // 销毁 RTC 客户端
    this.destroyClient();
    log.info(`[room-${this.data.roomId}] 用户 ${this.data.userId} 页面卸载`);
  },

  // 页面显示/切入前台时触发。
  onShow() {
    log.debug("==onShow");
    // 设置屏幕常亮
    // this.keepScreenOn(true);
    log.info(`[room-${this.data.roomId}] 用户 ${this.data.userId} 页面显示/切入前台`);
  },

  // 页面隐藏/切入后台时触发
  onHide() {
    log.debug("==onHide");
    log.info(`[room-${this.data.roomId}] 用户 ${this.data.userId} 页面隐藏/切入后台时`);
  },

  // // 每当小程序可能被销毁之前，页面回调函数 onSaveExitState 会被调用，可以进行退出状态的保存。
  // onSaveExitState() {
  //   log.debug("==onSaveExitState", this.data);
  //   // const exitState = { myDataField: 'myData' } // 需要保存的数据
  //   // return {
  //   //   data: exitState,
  //   //   expireTimeStamp: Date.now() + 24 * 60 * 60 * 1000 // 超时时刻
  //   // }
  // },

  // 生命周期函数--监听页面隐藏
  onShareAppMessage: function (res) {
    return {
      title: "快来参加我们的视频会议吧~",
      path: "/pages/meet/meet?roomId=" + this.data.roomId
    };
  },

  // 初始化 
  async initRTCClient() {
    const { userId, roomId } = this.data
    const {
      APPID,
      SERVERAdd,
      PORT,
      WSS
    } = config;
    // 创建 RTC 实例
    const client = new ArRTC.client();
    // 初始化 RTC 实例
    await client.init(APPID);
    // 配置私有云
    if (SERVERAdd && PORT && typeof WSS === "boolean") {
      client.setParameters({
        ConfPriCloudAddr: {
          ServerAdd: SERVERAdd,
          Port: PORT,
          Wss: WSS,
        }
      })
      log.info(`${userId} 配置私有云, 房间号：${roomId}`);
    };
    // 监听远端用户发布媒体流
    client.on('stream-added', (data) => {
      const { uid } = data;

      log.info(`[room-${this.data.roomId}] 用户 ${userId} 开始订阅远端用户 ${uid}，开始获取用户的拉流地址...`);
      // 订阅远端媒体流
      client.subscribe(uid, (url) => {
        log.info(`[room-${this.data.roomId}] 用户 ${userId} 获取 ${uid} 拉流地址成功, 拉流地址：${url}`);
        this._addRemoteUser(uid, url);
      }, (e) => {
        log.error(`[room-${this.data.roomId}] 用户 ${userId} 获取 ${uid} 拉流地址失败, 错误信息：`, e);
        wx.showModal({
          title: '错误',
          content: '订阅远端媒体流失败',
        });
      });
    });
    // 监听远端用户取消发布音媒体流
    client.on('stream-removed', (data) => {
      const { uid } = data;

      log.info(`[room-${this.data.roomId}] 用户 ${userId} 移除远端用户 ${uid} 视频窗口`);
      this._removeRemoteUser(uid);
    });
    // 监听SDK连接状态
    client.on('connection-state-change', (curState, revState, reason) => {
      // 重连处理：重新加入房间、订阅、发布
      if (curState === 'RECONNECTING') {
        // 提示
        wx.showLoading({
          title: '重连中...',
          mask: true,
        });
        // 清空本地人员窗口，本地推流组件
        this.setData({
          publishUrl: "",
          remoteUsers: []
        }, () => {
          // 销毁 SDK 实例
          client.destroy();
          // 加入频道成功立即发布
          this.joinAndPublish();
        });
      }
    });
    // 提示
    wx.showLoading({
      title: '加入房间中...',
      mask: true,
    });
    log.debug(`开始加入房间 ${roomId}...`);
    // 加入 RTC 房间
    this.setData({
      rtcClient: client,
    }, this.joinAndPublish);
  },

  joinAndPublish() {
    if (!this.data.rtcClient) return;
    const { userId, roomId } = this.data
    log.info(`[room-${this.data.roomId}] 用户 ${userId} 加入房间`);
    // 加入 RTC 房间
    this.data.rtcClient.join(
      undefined,
      roomId,
      userId,
      () => {
        log.info(`[room-${this.data.roomId}] 用户 ${userId} 加入房间成功，开始获取推流地址...`);
        wx.hideLoading();
        wx.showLoading({
          title: '获取推流地址...',
          mask: true,
        });
        // 发布本地视频流
        this.data.rtcClient.publish((url) => { // 获取推流地址成功
          wx.hideLoading();
          log.info(`[room-${this.data.roomId}] 用户 ${userId} 获取推流地址成功, 推流地址：${url}`);
          this.setData({
            publishUrl: url
          });
        }, (e) => { // 获取推流地址失败
          wx.hideLoading();
          log.error(`[room-${this.data.roomId}] 用户 ${userId} 获取推流地址失败, 错误信息：`, e);
          wx.showToast({
            icon: 'none',
            title: '获取推流地址失败，请稍后重试',
            mask: true,
            duration: 1500,
            complete: () => {
              this.navBackOrGoHome()
            }
          });
        });
      },
      // 加入房间失败回调
      (e) => {
        log.error(`[room-${this.data.roomId}] 用户 ${userId} 加入房间失败，错误信息：`, e);
        wx.showToast({
          title: '加入房间失败',
          duration: 1500,
          complete: () => {
            this.navBackOrGoHome()
          }
        })
      }
    );
  },

  // 切换摄像头
  switchCamera() {
    wx.createLivePusherContext().switchCamera();
    log.info(`[room-${this.data.roomId}] 用户 ${this.data.userId} 切换了摄像头`);
  },

  // 开启或关闭美颜
  switchBeauty() {
    // 详情参考：https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html#%E5%B1%9E%E6%80%A7%E8%AF%B4%E6%98%8E
    this.setData({
      beautyStyle: this.data.beautyStyle === 'smooth' ? 'nature' : 'smooth',
      beauty: this.data.beauty === 0 ? 9 : 0,
      whiteness: this.data.whiteness === 0 ? 9 : 0,
    }, () => {
      log.info(`[room-${this.data.roomId}] 用户 ${this.data.userId} ${this.data.beauty === 9 ? '开启' : '关闭'}了美颜`);
    });
  },

  // 开关本地音频
  switchAudio() {
    const {
      userId,
      roomId,
      rtcClient: client,
      enableAudio
    } = this.data;
    // 客户端设置音频是否传输
    client[enableAudio ? 'muteLocal' : 'unmuteLocal']('audio', () => {
      this.setData({
        enableAudio: !enableAudio
      }, () => {
        log.info(`[room-${this.data.roomId}] 用户 ${userId} ${enableAudio ? '开启' : '关闭'}了声音`);
      });
    }, (e) => {
      log.error(`[room-${this.data.roomId}] 用户 ${userId} 开/关音频失败, 错误信息：`, e)
    });
  },

  // 是否显示调试窗口
  switchDebug() {
    this.setData({
      showDebugLog: !this.data.showDebugLog
    }, () => {
      log.debug(`[room-${this.data.roomId}] 用户 ${this.data.userId} ${this.data.showDebugLog ? '开启' : '关闭'}了debug`);
    });
  },

  // 设置屏幕是否常亮
  keepScreenOn(bool) {
    wx.setKeepScreenOn({
      keepScreenOn: bool,
      complete: (res) => {
        console.log("设置屏幕是否常亮, ", bool);
      }
    });
  },

  // 返回或者回首页
  navBackOrGoHome() {
    wx.navigateBack({
      delta: 1,
      fail() {
        wx.redirectTo({
          url: '/pages/meet/index/index'
        })
      }
    });
  },

  // 销毁 RTC 客户端
  destroyClient(complete) {
    const {
      rtcClient: client,
      userId,
      roomId
    } = this.data;

    client.destroy(() => {
      log.info(`[room-${this.data.roomId}] 用户 ${userId} 销毁客户端对象成功`);
      complete && complete();
    }, (e) => {
      log.error(`[room-${this.data.roomId}] 用户 ${userId} 销毁客户端对象失败，错误信息：${e}`);
      wx.showToast({
        title: '销毁客户端对象失败',
        icon: 'none',
        mask: true,
        duration: 1500
      });
      complete && complete();
    });
  },

  // 离开房间
  leaveRoom() {
    log.info(`[room-${this.data.roomId}] 用户ID：${this.data.userId} 离开房间`);
    wx.showModal({
      title: "提示",
      content: "确认退出会议？",
      success: (res) => {
        if (res.confirm) {
          this.destroyClient(() => {
            this.navBackOrGoHome();
          });
        }
      }
    });
  },

  _addRemoteUser(uid, url) {
    const remoteUsers = this.data.remoteUsers;
    remoteUsers.push({
      uid,
      pullUrl: url
    });
    this.setData({
      remoteUsers
    }, () => {
      log.info(`[room-${this.data.roomId}] 用户 ${this.data.userId} 开始拉取用户 ${uid} 的媒体流`);
    });
  },

  _removeRemoteUser(uid) {
    const len = this.data.remoteUsers.length - 1;
    const remoteUsers = this.data.remoteUsers;
    for (var i = len; i >= 0; i--) {
      if (remoteUsers[i].uid === uid) {
        log.info(`[room-${this.data.roomId}] 用户 ${this.data.userId} 移除远端用户 ${uid} 的媒体流`);
        remoteUsers.splice(i, 1);
      }
    };
    this.setData({ remoteUsers });
  },

  onPushStateChange(e) {
    const detail = e.detail;
    const dataset = e.target.dataset;

    // iOS 收到电话时，会关闭麦克风
    if (detail.code === 4999) {

    }
    // 安卓或者低版本的苹果手机收到电话时，全部视频会卡死
    else if (detail.code === 5001) {
      wx.showToast({
        title: '媒体通道被占用，请重新加入',
        mask: true,
        duration: 1500,
        complete: () => {
          this.destroyClient(() => {
            this.navBackOrGoHome();
          });
        }
      })
    }
    // 推流：网络断连，且经多次重连抢救无效，更多重试请自行重启推流
    else if (detail.code === -1307) {
      wx.showToast({
        title: '多次推流失败，请退出重试!',
        mask: true,
        duration: 1500,
        complete: () => {
          this.destroyClient(() => {
            this.navBackOrGoHome();
          });
        }
      })
    }

    log.info(`[room-${this.data.roomId}] live-pusher 事件：用户ID：${dataset.uid}, ${PushErrorCode[detail.code]}`);
  },

  // 拉流-播放状态变化事件
  onPullStateChange(e) {
    const detail = e.detail;
    const dataset = e.target.dataset;

    // 拉流：网络断连，且经多次重连无效，请自行重启拉流
    if (detail.code === -2301) {
      log.warn(`多次拉取用户 ${ dataset.uid } 媒体流失败，即将销毁播放器，然后重新添加。`);
    //   const findRemoteUser = this.data.remoteUsers.find(user => user.uid === dataset.uid);
    //   if (findRemoteUser) {
    //     // 先移除
    //     this._removeRemoteUser(dataset.uid);
    //     wx.nextTick(() => {
    //       // 后添加
    //       this._addRemoteUser(findRemoteUser.uid, findRemoteUser.pullUrl);
    //     });
    //   }
    }

    log.info(`[room-${this.data.roomId}] live-player 事件：用户ID：${dataset.uid}, ${PullErrorCode[detail.code]}`);
  },
  // 拉流-网络状态通知
  onPullNetStatus(e) {
    const detail = e.detail;
    // 包含拉流的分辨率、码率、帧率等信息
    // log.info(`live-player 网络事件：`, detail.info)
  },
});