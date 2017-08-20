var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    'courseList' : null
  },
  onShow: function () {
    var _this = this;
    app.request({
      'url': '/mini/course/list.shtml',
      'successCallback': function (result) {
        _this.setData({
          'courseList': result.data
        });
      }
    });
  },
  toChapter: function(e){
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/course/chapter/index?courseCode=' + code
    });
  }
});