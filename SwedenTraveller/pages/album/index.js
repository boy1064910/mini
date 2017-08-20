// index.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelId : 0,
    travelAlbumList : null,
    albumWidth : 355
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      'albumWidth': (systemInfo.screenWidth - 32) / 2
    });
    this.data.travelId = options.travelId;
  },
  onShow: function () {
    var _this = this;
    app.request({
      'url': '/mini/travel/travelAlbumInfo.shtml',
      'params': {
        'travelId': this.data.travelId
      },
      'successCallback': function (result) {
        _this.setData({
          'travelAlbumList': result.data
        });
      }
    });
  },
  toAlbumDetail:function(e){
    wx.navigateTo({
      url: '/pages/albumDetail/index?travelDateId=' + e.currentTarget.dataset.id + '&albumName=' + e.currentTarget.dataset.albumName
    })
  }
})