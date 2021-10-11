// pages/meet/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomId: "",
    version: 'V 4.0.0'
  },
  
  inputChange(e) {
    this.setData({
      roomId: e.detail.value
    });
  },

  btnClick(e) {
    const type = e.currentTarget.dataset.type;
    if (type == "join") {
      if (this.data.roomId) {
        wx.navigateTo({ url: `/pages/meet/meet?roomId=${this.data.roomId}` });
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})