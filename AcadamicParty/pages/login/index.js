var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successDisplay: 'none',
    failDisplay: 'none',
    errorDisplay:'none',
    errorInfo:''
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
    var _this = this;
    wx.login({
      success: function (res) {
        _this.wxGetUserInfo(res.code);
      },
      fail: function (res) {
        _this.setData({
          errorDisplay: 'display',
          errorInfo: '调用微信登录接口失败'
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
  wxGetUserInfo:function (code) {
    var _this = this;
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.userInfo = res.userInfo;
        var encryptedData = res.encryptedData;
        var iv = res.iv;
        //请求服务器获取敏感数据（unionId），同时做登录请求
        getApp().request({
          url: '/mini/entry/unionIdLogin.shtml',
          params: {
            'code': code,
            'encryptedData': encryptedData,
            'iv': iv
          },
          successCallback: function (result) {
            _this.setData({
              successDisplay: 'display'
            });
            var data = result.data;
            //微信unionId登录成功，记录sessionId和用户信息
            wx.setStorageSync("sessionId", data.sessionId);
            var userInfo = {};
            userInfo.account = data.account;
            userInfo.pwd = data.pwd;
            userInfo.nickName = data.nickName;
            userInfo.head = data.head;
            userInfo.openId = data.openId;
            userInfo.unionId = data.unionId;
            wx.setStorageSync("userInfo", userInfo);
            wx.navigateBack();//返回上级页面
          },
          failCallback: function (result) {
            switch (result.resultCode) {
              case 1004:{
                _this.setData({
                  errorDisplay: 'display',
                  errorInfo: '系统检测到您的账号存在异常被冻结，无法登录'
                });
                break;
              }
              default:{
                _this.setData({
                  errorDisplay: 'display',
                  errorInfo: '微信小程序登录异常，错误代码：' + result.resultCode + ',错误原因：' + result.resultCode+'，请联系客服'
                });
                break;
              }
            }
          }
        });
      },
      fail: function (res) {
        _this.setData({
          failDisplay: 'display'
        });
      }
    });
  },
  toBack: function(){
    wx.navigateBack();//返回上级页面
  },
  toSettings:function(){
    this.setData({
      failDisplay: 'none'
    });
    wx.openSetting({
      success: (res) => {
        res.authSetting = {
          "scope.userInfo": true
        }
      }
    });
  },
  callService: function () {
    app.callService();
  }
})