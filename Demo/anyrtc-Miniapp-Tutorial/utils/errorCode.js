// live-pusher 拉流错误码
// 请参考 https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html#%E7%8A%B6%E6%80%81%E7%A0%81
const PushErrorCode = (() => {
  let array = new Array();

  array[10001] = "用户禁止使用摄像头";
  array[10002] = "用户禁止使用录音";
  array[10003] = "背景音资源（BGM）加载失败";
  array[10004] = "等待画面资源（waiting-image）加载失败";
  
  array[1001] = "推流：已经连接推流服务器";
  array[1002] = "推流：已经与服务器握手完毕，开始推流";
  array[1003] = "推流：打开摄像头成功";
  array[1004] = "推流：录屏启动成功";
  array[1005] = "推流：推流动态调整分辨率";
  array[1006] = "推流：推流动态调整码率";
  array[1007] = "推流：首帧画面采集完成";
  array[1008] = "推流：编码器启动";

  array[1018] = "推流：进房成功（ROOM协议特有）";
  array[1019] = "推流：退房成功（ROOM协议特有有）";
  array[1020] = "推流：远端主播列表变化（ROOM协议特有）";
  array[1021] = "推流：网络变更时重进房，WiFi 切换到4G 会触发断线重连（ROOM协议特有）";
  array[1022] = "推流：进入房间失败（ROOM协议特有）";

  array[1031] = "推流：远端主播进房通知（ROOM协议特有）";
  array[1032] = "推流：远端主播退房通知（ROOM协议特有）";
  array[1033] = "推流：远端主播视频状态位变化（RROOM协议特有）";
  array[1034] = "推流：远端主播音频状态位变化（ROOM协议特有）";

  array[1101] = "推流：网络状况不佳：上行带宽太小，上传数据受阻";
  array[1102] = "推流：网络断连, 已启动自动重连";
  array[1103] = "推流：硬编码启动失败, 采用软编码";
  array[1104] = "推流：视频编码失败, 内部会重启编码器";

  array[3001] = "推流：RTMP DNS解析失败";
  array[3002] = "推流：RTMP服务器连接失败";
  array[3003] = "推流：RTMP服务器握手失败";
  array[3004] = "推流：RTMP服务器主动断开，请检查推流地址的合法性或防盗链有效期";
  array[3005] = "推流：RTMP 读/写失败";

  // 主动关闭麦克风
  array[4998] = "Mic状态切换的时候，enable-mic触发(iOS特有)";
  // 被动关闭麦克风
  array[4999] = "mute状态切换的时候，muted 触发(iOS特有)";

  array[5001] = "系统电话打断或者微信音视频电话打断";

  array[10001] = "用户禁止使用摄像头";
  array[10002] = "用户禁止使用录音";
  array[10003] = "背景音资源（BGM）加载失败";
  array[10004] = "等待画面资源（waiting-image）加载失败";

  array[-1301] = "推流：打开摄像头失败";
  array[-1302] = "推流：打开麦克风失败";
  array[-1303] = "推流：视频编码失败";
  array[-1304] = "推流：音频编码失败";
  array[-1305] = "推流：不支持的视频分辨率";
  array[-1306] = "推流：不支持的音频采样率";
  array[-1307] = "推流：网络断连，且经多次重连抢救无效，更多重试请自行重启推流";
  array[-1308] = "推流：开始录屏失败，可能是被用户拒绝";
  array[-1309] = "推流：录屏失败，不支持的 Android 系统版本，需要5.0以上的系统";
  array[-1310] = "推流：录屏被其他应用打断了";
  array[-1311] = "推流：Android Mic打开成功，但是录不到音频数据";
  array[-1312] = "推流：录屏动态切横竖屏失败";

  return array;
})();

// live-player 拉流错误码
// 请参考 https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html#%E7%8A%B6%E6%80%81%E7%A0%81
const PullErrorCode = (() => {
  let array = new Array();

  array[2001] = "拉流：已经连接服务器";
  array[2002] = "拉流：已经连接 RTMP 服务器,开始拉流";
  array[2003] = "拉流：网络接收到首个视频数据包(IDR)";
  array[2004] = "拉流：视频播放开始";
  array[2005] = "拉流：视频播放进度";
  array[2006] = "拉流：视频播放结束";
  array[2007] = "拉流：视频播放Loading";
  array[2008] = "拉流：解码器启动";
  array[2009] = "拉流：视频分辨率改变";

  array[2030] = "音频设备发生改变，即当前的输入输出设备发生改变，比如耳机被拔出";
  array[2032] = "拉流：视频渲染首帧事件";

  array[2101] = "拉流：当前视频帧解码失败";
  array[2102] = "拉流：当前音频帧解码失败";
  array[2103] = "拉流：网络断连, 已启动自动重连";
  array[2104] = "拉流：网络来包不稳：可能是下行带宽不足，或由于主播端出流不均匀";
  array[2105] = "拉流：当前视频播放出现卡顿";
  array[2106] = "拉流：硬解启动失败，采用软解";
  array[2107] = "拉流：当前视频帧不连续，可能丢帧";
  array[2108] = "拉流：当前流硬解第一个 I 帧失败，SDK自动切软解";

  array[3001] = "拉流：RTMP -DNS解析失败";
  array[3002] = "拉流：RTMP服务器连接失败";
  array[3003] = "拉流：RTMP服务器握手失败";
  array[3005] = "拉流：RTMP 读/写失败，之后会发起网络重试";

  array[-2301] = "拉流：网络断连，且经多次重连无效，请自行重启拉流";
  array[-2302] = "拉流：获取拉流地址失败";

  return array;
})();

module.exports = {
  PullErrorCode,
  PushErrorCode
}