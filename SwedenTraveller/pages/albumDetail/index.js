var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelDateId : 0,
    albumName : '',
    picWidth : 305,
    picList : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.travelDateId = options.travelDateId;
    var systemInfo = wx.getSystemInfoSync();
    console.log((systemInfo.screenWidth - 12) / 3);
    this.setData({
      'albumName': options.albumName,
      'picWidth': (systemInfo.screenWidth - 12)/3
    });

    var _this = this;
    app.request({
      'url': '/mini/travel/travelDateAlbumInfo.shtml',
      'params': {
        'travelDateId': this.data.travelDateId
      },
      'successCallback': function (result) {
        _this.setData({
          'picList' : result.data
        });
      }
    });
  },
  previewPic : function(e){
    var currentPicUrl = e.currentTarget.dataset.picUrl;
    var picUrlList = [];
    for(var i=0;i<this.data.picList.length;i++){
      picUrlList.push(this.data.picList[i].picUrl);
    }
    wx.previewImage({
      current: currentPicUrl, // 当前显示图片的http链接
      urls: picUrlList // 需要预览的图片http链接列表
    })
  }
})