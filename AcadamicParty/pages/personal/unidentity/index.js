var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabView: {
      student_cls: "tab-view-show",
      guardian_cls: 'tab-view-hide',
      teacher_cls: 'tab-view-hide'
    },
    eduArray: ["本科", "硕士", "博士"],
    eduSelectedValue: "请选择学历",
    sexArray:[
      {
        id: -1,
        value: '请选择性别'
      },
      {
        id:0,
        value:'女生'
      },
      {
        id: 1,
        value: '男生'
      }
    ],
    sexIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  chooseView: function (e) {
    var type = e.target.dataset.type;
    var tabView = {};
    for (var i in this.data.tabView) {
      if (i == (type + "_cls")) {
        tabView[i] = 'tab-view-show';
      }
      else {
        tabView[i] = 'tab-view-hide';
      }
    }
    this.setData({
      'tabView': tabView
    });
  },
  sexChangedEvent: function(e){
    this.setData({
      sexIndex: e.detail.value
    })
  },
  studentFormSubmit: function (e) {
    var params = e.detail.value;
    params.sex = this.data.sexArray[this.data.sexIndex].id;
    console.log(params);
    if (util.isEmpty(params.name)){
      wx.showToast({
        title: '请输入姓名',
        // image:'/images/common/tip-error.png',
        duration: 1000
      });
      return;
    }
    if (params.sex==-1) {
      wx.showToast({
        title: '请选择性别',
        duration: 1000
      });
      return;
    }
    if (util.isEmpty(params.school)) {
      wx.showToast({
        title: '请输入在读学校',
        duration: 1000
      });
      return;
    }
    if (util.isEmpty(params.gradeClass)) {
      wx.showToast({
        title: '请输入年级和班级',
        duration: 1000
      });
      return;
    }
    app.request({
      'url': '/mini/personal/identity/studentIdentification.shtml',
      'params': params,
      'method': 'post',
      'successCallback': function (result) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500,
          mask: true,
          success: function () {
            wx.reLaunch({
              url: '/pages/personal/index'
            })
          }
        })
      }
    })
  },
  eduChangedEvent: function (e) {
    this.setData({
      eduSelectedValue: this.data.eduArray[e.detail.value]
    })
  },
  teacherFormSubmit: function (e) {
    var params = e.detail.value;
    params.typeName = "老师";
    params.type = app.constData.USER_TYPE_TEACHER;
    params.eduBackGround = this.data.eduSelectedValue;
    app.request({
      'url': '/mini/personal/identity/teacherIdentification.shtml',
      'params': params,
      'method': 'post',
      'successCallback': function (result) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500,
          mask: true,
          success: function () {
            wx.reLaunch({
              url: '/pages/personal/index'
            })
          }
        })
      }
    })
  }
})