var app = getApp();
var util = require('../../../../utils/util.js');
Page({
  data: {
    'chapterCode': null,
    'chapter': null,
    'knowledgeList': null
  },
  onLoad: function (options) {
    this.data.chapterCode = options.chapterCode;
  },
  onShow: function () {
    var _this = this;
    app.request({
      'url': '/mini/course/chapter/knowledgeList.shtml',
      'params': {
        'chapterCode': _this.data.chapterCode
      },
      'successCallback': function (result) {
        _this.setData({
          'chapter':result.data.chapter,
          'knowledgeList': result.data.knowledgeList
        });
      }
    });
  },
  toVideo: function (e) {
    var knowledgeId = e.currentTarget.dataset.knowledgeId;
    wx.navigateTo({
      url: '/pages/course/chapter/knowledge/video/index?knowledgeId=' + knowledgeId
    });
  }
});