var common = require('../../config/common.js');
const app = getApp()

Page({
  data: {
    userInfo: {},
	containerDisplay:'none',//页面内容显示开关
	noneCourseBuyDisplay: 'block',//未购买课程提示文案显示开关
	courseBuyDisplay:'none',//已购买的课程显示开关
	noneCourseDisplay: 'block',//平台无课程提示文案显示开关
	courseDisplay:'none',//平台课程列表显示开关
	courseList:[]//课程列表
	
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
				userInfo: res.data,//用户信息
				containerDisplay:true//显示用户课程信息
            });
            //TODO 获取用户已购买的课程信息
			app.request({
				'url': common.acadamicService + "/course/list.shtml",
				"success":res=>{
					console.log(this);
					console.log(res);
					var data = res.data;
					this.setData({
						'courseList':data.courseList,
						'courseDisplay':'block',
						'noneCourseDisplay':'none'
					});
				}
			})
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
