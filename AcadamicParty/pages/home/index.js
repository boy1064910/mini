var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrls: [],
    autoplay: true,
    interval: 5000,
    duration: 500,
    swiperHeight: '200rpx',//轮播板块的高度
    teacherLumpWidth: "186.5rpx"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var systemInfo = wx.getSystemInfoSync();
    var swiperHeight = (systemInfo.screenWidth / (16 / 9) * 2) + "rpx";
    var imgUrls = [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ];
    this.setData({
      swiperHeight: swiperHeight,
      imgUrls: imgUrls
    });
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
    var _this = this;
    app.request({
      'url': '/mini/index.shtml',
      'successCallback': function (result) {
        var data = result.data;
        var teacherList = data.teacherList;
        var courseList = data.courseList;
        if (!util.isEmpty(courseList)) {
          for (var i = 0; i < courseList.length; i++) {
            courseList[i].startDate = util.formatDate(new Date(courseList[i].startDate));
            courseList[i].endDate = util.formatDate(new Date(courseList[i].endDate));
            courseList[i].titlePageUrl = courseList[i].titlePageUrl + "/resize,w_150"
          }
        }
        _this.setData({
          teacherList: teacherList,
          courseList: courseList
        });
      }
    });
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
  openCourseDetail: function(e){
    var courseId = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: '/pages/courseDetail/index?id=' + courseId
    });
  },
  openTeacher:function(e){
    var teacherId = e.currentTarget.dataset.teacherid;
    wx.navigateTo({
      url: '/pages/teacher/index?id='+teacherId
    });
  }
})