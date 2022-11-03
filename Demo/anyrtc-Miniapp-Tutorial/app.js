//app.js
App({
  onLaunch: function () {

  },
  globalData: {
    
  },
  onShow() {
    wx.setKeepScreenOn({
      keepScreenOn: true,
      complete: (res) => {
        console.log("设置屏幕是否常亮, ", true);
      }
    });
  }
})