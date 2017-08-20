var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    'courseCode':null,
    'course':null,
    'chapterList': null
  },
  onLoad: function (options) {
    this.data.courseCode = options.courseCode;
  },
  onShow: function () {
    var _this = this;
    app.request({
      'url': '/mini/course/chapterList.shtml',
      'params' : {
        'courseCode': _this.data.courseCode
      },
      'successCallback': function (result) {
        _this.setData({
          'course': result.data.course,
          'chapterList': result.data.chapterList
        });
      }
    });
  },
  toKnowledge: function (e) {
    var chapterCode = e.currentTarget.dataset.chapterCode;
    wx.navigateTo({
      url: '/pages/course/chapter/knowledge/index?chapterCode=' + chapterCode
    });
  }
});