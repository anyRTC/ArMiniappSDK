---
id: client
title: Class Client
sidebar_label: Class Client
---


## 方法

### destroy

> *destroy(onSuccess: () => void, onFailure: (err?: { code: number; reason: string }) => void): void*

销毁客户端对象。

**参数**

- `onSuccess`: *() => void*

    方法调用成功时执行的回调函数。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

    方法调用失败时执行的回调函数。返回值为错误码和错误信息。

    *参数*

    - *err*
        - *code*: number
        - *reason*: string

    

*返回值* **void**

*`example`*

```
// 销毁客户端对象
client.destroy(() => {
	
}, () => {

});
```

<br />


### init

> *init(appId: string, onSuccess: () => void, onFailure: (err: { code: number; reason: string }) => void): void*

初始化客户端对象。

**参数**

- `appId`: string

    方法调用成功时执行的回调函数。

- `onSuccess`: *() => void*

    方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string



*返回值* **void**

*`example`*

```
// 初始化
client.init("appId", () => {
	
}, () => {

});
```

<br />


### join

> *join(token: string, channel: string, uid: number, onSuccess: (uid: number) => void, onFailure: (err: { code: number; reason: string }) => void): void*

加入频道。

**参数**

- `token`: string

    在 app 服务器端生成的用于鉴权的 Token：

    - 安全要求不高：你可以使用控制台生成的临时 Token，详见获取临时 Token。
    - 安全要求高：将值设为你的服务端生成的正式 Token，详见从服务端生成 Token。

- `token`: string

    频道名，能标识直播频道的字符串。

- `uid`: string

    指定用户的 ID。32 位无符号整数。建议设置范围：1 到 (2^32-1)，并保证唯一性。

- `onSuccess`: *(uid: number) => void*

    方法调用成功时执行的回调函数。无返回值。

    **参数**

    - *uid*: string

- `onFailure`: **(err?: { code: number; reason: string }) => void**

    方法调用失败时执行的回调函数。返回值为错误码和错误信息。

    *参数*

    - *err*
      - *code*: number
      - *reason*: string

    

*返回值* **void**

*`example`*

```
// 加入频道
client.join(undefined, "123456", Math.ceil(Math.random()*Math.pow(10, 6)), (uid) => {
	
}, () => {

});
```

<br />


### leave

> *leave(onSuccess: () => void, onFailure: (err: { code: number; reason: string }) => void): void*

退出频道。

**参数**

- `onSuccess`: *() => void*

    方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

    方法调用失败时执行的回调函数。返回值为错误码和错误信息。

    *参数*

    - *err*
      - *code*: number
      - *reason*: string

*返回值* **void**

*`example`*

```
// 退出频道
client.leave(() => {

}, () => {

});
```

<br />


### mute

> *mute(uid: number, target: string, onSuccess: () => void, onFailure: (err: { code: number; reason: string }) => void): void*

停止接收远端用户的音视频流。

**参数**

- `uid`: string

    远端用户的 ID。

- `target`: string

    选择停止接收哪一种流，有三种选择：

    - audio：本地用户发送的音频流，即声音。
    - video：本地用户发送的视频流，即视频画面。
    - all：本地用户发送的音视频流，即声音和视频画面。

- `onSuccess`: *() => void*

    方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

    方法调用失败时执行的回调函数。返回值为错误码和错误信息。

    *参数*

    - *err*
      - *code*: number
      - *reason*: string

*返回值* **void**

*`example`*

```
// 停止发送本地用户的音视频流
client.mute("远端用户uid", "all", () => {

}, () => {

});
```

<br />


### muteLocal

> *muteLocal(target: string, onSuccess: () => void, onFailure: (err: { code: number; reason: string }) => void): void*

停止发送本地用户的音视频流。

**参数**

- `target`: string

    选择停止接收哪一种流，有三种选择：

    - audio：本地用户发送的音频流，即声音。
    - video：本地用户发送的视频流，即视频画面。
    - all：本地用户发送的音视频流，即声音和视频画面。

- `onSuccess`: *() => void*

    方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

    方法调用失败时执行的回调函数。返回值为错误码和错误信息。

    *参数*

    - *err*
      - *code*: number
      - *reason*: string

*返回值* **void**

*`example`*

```
// 停止发送本地用户的音视频流
client.muteLocal("all", () => {

}, () => {

});
```

<br />


### off

> *off(event: string): void*

取消监听流事件。

**参数**

- `event`:  *EventName*

    想要取消监听的流事件。客户端事件的名称。事件列表请参考 [ClientEvents](./client_events.md) 中的属性名。
    
- `callback`: *Function*

    方法调用失败时执行的回调函数。返回值为错误码和错误信息。

    **参数**

    *(evt: { code: number; reason: string }) => void*

    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 监听远程用户发布媒体流
client.off('stream-added', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />


### on

> *on(event: EventName, callback: Function): void*

在 client 实例上添加 `listener` 函数到名为 `eventName` 的事件。

**参数**

- `event`:  *EventName*

    客户端事件的名称。事件列表请参考 [ClientEvents](./client_events.md) 中的属性名。

- `callback`: *Function*

    方法调用失败时执行的回调函数。返回值为错误码和错误信息。

    **参数**

    *(evt: { code: number; reason: string }) => void*

    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 监听远程用户发布媒体流
client.on('stream-added', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />

### publish

> *publish(onSuccess: (url: string) => void, onFailure: (err: { code: number; reason: string }) => void): void*

发布本地音视频流。

用户端调用该 API 的用户即默认为主播。

:::note

本方法需要结合 live-pusher 组件一起使用，详情请参考 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)。

:::

**参数**

- `target`: string

  选择停止接收哪一种流，有三种选择：

  - `audio`：本地用户发送的音频流，即声音。
  - `video`：本地用户发送的视频流，即视频画面。
  - `all`：本地用户发送的音视频流，即声音和视频画面。

- `onSuccess`: *() => void*

  方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 发布本地音视频流
client.publish("all", (url) => {
	// 拿到推流地址，传入 live-pusher 组件进行推流
}, () => {

});
```

<br />

### setRole

> *setRole(role: string, onSuccess: () => void, onFailure: (err: { code: number; reason: string }) => void): void*

设置用户角色。

该方法设置用户角色。小程序端的用户角色默认为主播，因此在同时满足以下条件的使用场景中，必须调用该接口将小程序端的用户角色设置为观众再进入频道。

- 小程序 SDK 与 Native SDK 互通
- Native 端频道模式为直播模式
- 小程序作为观众端加入频道

注：如果在主播已 publish 的状态下调用该方法将用户角色设置为 audience，会导致之前的推流地址无效。

**参数**

- `role`: string

  用户角色。选择如下一种角色：

  - broadcaster：(默认) 将用户角色设置为主播。主播可以调用 [publish](#publish) 和 [unpublish](#unpublish) 方法。
  - audience：将用户角色设置为观众。观众不能调用 [publish](#publish) 和 [unpublish](#unpublish) 方法。

- `onSuccess`: *() => void*

  方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 发布本地音视频流
client.setRole("audience", () => {
	
}, () => {

});
```

<br />

### subscribe

> *subscribe(uid: number, onSuccess: (url: string) => void, onFailure: (err: any) => void): void*

订阅远端音视频流。

收到 [`stream-added`](./client_events.md#stream-added) 回调之后，可以选择是否订阅该用户的音视频。

:::note

订阅成功将拉流地址传入 live-player 组件进行拉流，组件`mode`需要设置为 `rtc`。 详情请参考 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)。

:::

**参数**

- `uid`: number

  要订阅的远端用户 ID。

- `onSuccess`: *() => void*

  方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 发布本地音视频流
client.subscribe("远端用户的ID", (url) => {
	// 订阅成功将拉流地址传入 live-player 组件进行拉流
}, () => {

});
```

<br />

### unmute

> *unmute(uid: number, target: string, onSuccess: () => void, onFailure: (err: { code: number; reason: string }) => void): void*

恢复接收远端用户的音视频流。

**参数**

- `uid`: number

  远端用户 ID。

- `target`: string

  选择停止接收哪一种流，有三种选择：

  - `audio`：本地用户发送的音频流，即声音。
  - `video`：本地用户发送的视频流，即视频画面。
  - `all`：本地用户发送的音视频流，即声音和视频画面。

- `onSuccess`: *() => void*

  方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 恢复接收远端用户的音视频流
client.unmute("远端用户的ID", "all", () => {
	
}, () => {

});
```

<br />

### unmuteLocal

> *unmuteLocal(target: string, onSuccess: () => void, onFailure: (err: { code: number; reason: string }) => void): void*

恢复发送本地用户的音视频流。

**参数**

- `target`: string

  选择停止接收哪一种流，有三种选择：

  - `audio`：本地用户发送的音频流，即声音。
  - `video`：本地用户发送的视频流，即视频画面。
  - `all`：本地用户发送的音视频流，即声音和视频画面。

- `onSuccess`: *() => void*

  方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 恢复接收远端用户的音视频流
client.unmuteLocal("all", () => {
	
}, () => {

});
```

<br />

### unpublish

> *unpublish(onSuccess: () => void, onFailure: (err: any) => void): void*

停止发布本地音视频流。

**参数**

- `onSuccess`: *() => void*

  方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 恢复接收远端用户的音视频流
client.unpublish(() => {
	
}, () => {

});
```

<br />

### unsubscribe

> *unsubscribe(uid: number, onSuccess: () => void, onFailure: (err: any) => void): void*

停止订阅远端音视频流。

**参数**

- `uid`: number

  要停止订阅的远端用户 ID。

- `onSuccess`: *() => void*

  方法调用成功时执行的回调函数。无返回值。

- `onFailure`: *(err?: { code: number; reason: string }) => void*

  方法调用失败时执行的回调函数。返回值为错误码和错误信息。

  *参数*

  - *err*
    - *code*: number
    - *reason*: string

*返回值* **void**

*`example`*

```
// 恢复接收远端用户的音视频流
client.unsubscribe("远端用户 ID", () => {
	
}, () => {

});
```

<br />