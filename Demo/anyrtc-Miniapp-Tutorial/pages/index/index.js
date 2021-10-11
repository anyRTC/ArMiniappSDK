Page({
  switchMode(e) {
    const type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({url: `../rtmpc/index/index`})
    }else if (type == 0) {
      wx.navigateTo({url: `../meet/index/index`})
    }else if (type == 2) {
      wx.navigateTo({url: `../p2p/index/index`})
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onShareAppMessage (res) {
    // return custom share data when user share.
    return {
      title: '推荐一个好用的实时音视频云给你',
      path: '/pages/index/index'
    }
  },
})
