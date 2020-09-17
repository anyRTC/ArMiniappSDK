import config from  "../../utils/config";
Page({
    data:{
        roomNumber: '',//房间号
    },
    //房间号
    roomNumber(e) {
        const roomNumber = e.detail.value;
        this.setData({roomNumber});
    },
    //加入房间
    loginRoom() {
        const {roomNumber} = this.data;
        const { APPID } = config;
        if ( !APPID ) {
            wx.showToast({
                title: `请在 config.js 中提供正确的 APPID`,
                icon: 'none',
                duration: 5000
            });
            return;
        };
        wx.getNetworkType({
            success (res) {
                if (res.networkType == 'none') {
                    wx.showToast({
                        title : `请连接网络后重试...`,
                        icon : 'none',
                        duration : 5000,
                        mask : true,
                    });
                } else {
                    if(roomNumber == '') return;
                    wx.navigateTo({
                        url: `../room/room?roomNumber=${roomNumber}`,
                    },() => {
                        this.setData({ roomNumber : '' });
                    });
                };
            }
        });
    }
})