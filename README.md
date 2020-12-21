# ArRTCWebSDK

anyrtc Miniapp SDK 是基于 anyrtc 专门为微信小程序打造的SDK。能实现基于 anyrtc SD-RTN 的音视频实时通信功能，支持语音通话、视频通话、音频互动直播、视频互动直播等场景。

```shell
npm install ar-rtc-miniapp --save
```

接入指南和使用文档请访问我们的文档站 https://docs.anyrtc.io/rtc-miniapp/

接入过程中，你可以在本仓库参考 anyrtc Miniapp SDK 的 [Demo 源码](./Demo)

![小程序二维码](https://raw.githubusercontent.com/anyRTC/ArMiniappSDK/master/Docs/docs/assets/demo_qrcode.png)

> 如果您在接入 anyrtc miniapp SDK 时遇到问题，或者有任何建议，都可以在本仓库的 Issues 区发帖讨论，我们会尽快处理大家的反馈

## 简介

详细的介绍和文档请访问上面提到的文档站链接，这里我们简单介绍一下 anyrtc Miniapp SDK 的特性

- 支持 Typescript
- 使用 Promise
- 基于 Track 的音视频管理

下面是加入会议并自动发布的代码示例

```js
import ArRTC from "ar-rtc-miniapp"

const client = new ArRTC.client();

async function startCall() {
  // 初始化
  client.init("APPID", () => {
    // 初始化成功, 开始加入频道
    client.join("TOKEN", "CHANNEL", "UID", (uid) => {
      // 加入频道成功， 开始发布
      client.publish(url => {
        // 发布成功，将 url 传入 live-pusher 组件 
      }, () => {

      });
    }, ()=> {
      
    });
  }, () => {
    // init failed
  });
}

```
