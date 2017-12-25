var common = require('../../config/common.js');
const app = getApp()

Page({

  data: {
    'course':null,
    'chapterList':null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.request({
          'url': common.acadamicService + "/course/chapter/list.shtml",
          'params':{
            'courseId':options.id
          },
          "success": res => {
              var data = res.data;
              this.setData({
                  'course': data.course,
                  'chapterList': data.chapterList
              });
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  },
  payChapter: function(e){
	  app.request({
		  'url': common.acadamicService + '/order/orderChapter.shtml',
		  'method': 'post',
		  'params':{
			  'chapterId':e.currentTarget.id
		  },
		  'success':function(result){
			  var data = result.data;
			  wx.requestPayment({
				  'timeStamp': data.timeStamp,
				  'nonceStr': data.nonceStr,
				  'package': data.package,
				  'signType': data.signType,
				  'paySign': data.paySign,
				  'success': function (res) {
					  console.log(res);
					  wx.navigateTo({
						  url: '../index/index'
					  });
				  },
				  'fail': function (res) {
					  console.log(res);
				  }
			  })
		  }
	  })
  }
})