var common = require('../../config/common.js');
const app = getApp()

Page({
  data: {
    userInfo: {},
	containerDisplay:'none',
	courseDisplay:'none',
	noneCourseDisplay:'block'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //获取用户信息
    app.request({
        'url': common.accountService + "/account/info.shtml",
        'success':res=>{
            this.setData({
				userInfo: res.data,
				containerDisplay:true
            });
            //TODO 获取用户已购买的课程信息
        }
    });
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
