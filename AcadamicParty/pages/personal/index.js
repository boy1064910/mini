var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    id: null,
    head: "/images/tabBar/home.png",//用户头像
    nickName: "",//用户昵称
    account: "",//用户账号
    identityType: null,
    name: "",

    identityType: "未认证",//用户身份
    identityStyle: "identity-no"//认证状态样式
  },
  onLoad: function () {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    var _this = this;
    app.request({
      'url': '/application/personal/index.shtml',
      'params': {
        'account': "admin",
        'pwd': "E10ADC3949BA59ABBE56E057F20F883E"
      },
      'method': 'POST',
      'successCallback': function (result) {
        var style = getIdentityStyle(result.data.identityStatus);
        var typeInfo = getIdentityType(result.data.identityStatus, result.data.type);
        var userInfo = wx.getStorageSync("userInfo");
        _this.setData({
          head: userInfo.head,
          nickName: userInfo.nickName,
          account: userInfo.account,
          identityType: typeInfo,
          identityStyle: style
        });
      }
    });
  },
  register: function (event) {
    wx.navigateTo("pages/register/index");
  },
  toIdentity: function (e) {
    console.log("sss");
    wx.navigateTo({
      url: '/pages/personal/unidentity/index',
    })
  },
  toHtml:function(){
    wx.navigateTo({
      url: 'http://www.baidu.com',
    })
  }
});

function getIdentityStyle(status) {
  if (util.isEmpty(status)) {
    return "identity-no";
  }
  switch (status) {
    case 0: return "identity-waiting";
    case -1: return "identity-no";
    case 1: return "identity-yes";
  }
}

function getIdentityType(status, type) {
  if (util.isEmpty(status)) {
    return "未认证";
  }
  var typeInfo = "";
  switch (type) {
    case app.constData.USER_TYPE_USER_TYPE_STUDENT: {
      typeInfo = "学生身份，";
      break;
    }
    case app.constData.USER_TYPE_USER_TYPE_GUARDIAN: {
      typeInfo = "监护人身份，";
      break;
    }
    case app.constData.USER_TYPE_TEACHER: {
      typeInfo = "教师身份，";
      break;
    }
  }
  switch (status) {
    case 0: {
      typeInfo += "待认证";
      break;
    }
    case -1: {
      typeInfo += "认证不通过";
      break;
    }
    case 1: {
      typeInfo += "认证通过";
      break;
    }
  }
  return typeInfo;
}