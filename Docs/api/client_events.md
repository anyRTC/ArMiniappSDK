---
id: client_events
title: ClientEvents
sidebar_label: ClientEvents

---

ClientEvents 实例上的事件类型。 该接口中，函数属性的名称为事件名称，函数的参数为事件监听回调的传入参数。

<br />

**`example`**

```
// 监听远程用户发布媒体流
client.on('stream-added', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />

## 回调方法



### stream-added

> *stream-added: (evt: { uid: number }) => void*

通知应用程序已添加远端音视频流。 该回调中会包含已添加的远端用户 ID。

**参数**

- *evt: { uid: number }*

  远程用户 ID

  - *uid: number*

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



### stream-removed

> *stream-removed: (evt: { uid: number }) => void*

通知应用程序已删除远端音视频流。 该回调中会包含已删除的远端用户 ID。

**参数**

- *evt: { uid: number }*

  远程用户 ID

  - *uid: number*

*返回值* ** void**

*`example`*

```
// 监听远程用户发布媒体流
client.on('stream-removed', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />



### mute-audio

> *mute-audio: (evt: { uid: number }) => void*

通知应用程序已删除远端音频流。 该回调中会包含已删除的远端用户 ID。

**参数**

- *evt: { uid: number }*

  远程用户 ID

  - *uid: number*

*返回值* ** void**

*`example`*

```
// 监听远端音频流关闭
client.on('mute-audio', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />



### mute-video

> *mute-video: (evt: { uid: number }) => void*

通知应用程序已删除远端视频流。 该回调中会包含已删除的远端用户 ID。

**参数**

- *evt: { uid: number }*

  远程用户 ID

  - *uid: number*

*返回值*  **void**

*`example`*

```
// 监听远端视频流关闭
client.on('mute-video', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />

### unmute-audio

> *unmute-audio: (evt: { uid: number }) => void*

通知应用程序已删除远端音频流。 该回调中会包含已删除的远端用户 ID。

**参数**

- *evt: { uid: number }*

  远程用户 ID

  - *uid: number*

*返回值*  **void**

*`example`*

```
// 监听远端音频流打开
client.on('unmute-audio', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />



### unmute-video

> *unmute-video: (evt: { uid: number }) => void*

通知应用程序已删除远端视频流。 该回调中会包含已删除的远端用户 ID。

**参数**

- *evt: { uid: number }*

  远程用户 ID

  - *uid: number*

*返回值*  **void**

*`example`*

```
// 监听远端视频流打开
client.on('unmute-video', function (evt) { 
	// 获取用户id（ES6解构）
	const { uid } = evt;
	// Your code.
});
```

<br />