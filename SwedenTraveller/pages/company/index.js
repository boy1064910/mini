var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyId : 0,
    company : null,
    imageHeightArray:{},
    screenWidth : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.companyId = options.companyId;
    this.data.screenWidth = wx.getSystemInfoSync().screenWidth;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    app.request({
      'url': '/mini/company/getInfo.shtml',
      'params': {
        'id': this.data.companyId
      },
      'successCallback': function (result) {
        _this.setData({
          'company' : result.data
        });
      }
    });
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
  caculateImageHeight : function(e){
    console.log(e);
    var width = e.detail.width;
    var height = e.detail.height;
    var index = e.currentTarget.dataset.index;
    var imageHeight = height*this.data.screenWidth/width;
    var imageHeightArray = this.data.imageHeightArray;
    imageHeightArray[index] = imageHeight;
    this.setData({
      imageHeightArray: imageHeightArray
    });
  }
})