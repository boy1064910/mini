var app = getApp();
var util = require('../../utils/util.js');
Page({
  data:{
    codeBtnDisabled: false,
    retrySeconds: 60,
    codeBtnHtmler: "获取验证码",

    //前一个页面参数信息字段
    unionId:"",//微信用户unionId
    nickName:"",//微信用户昵称
    head:"",//微信用户头像
    openId:"",

    //表单信息字段
    formValues:{}
  },
  onLoad: function (options) {
    this.setData({
      unionId: options.unionId,
      nickName: options.nickName,
      head: options.head,
      openId: options.openId
    });
  },
  onReady: function () {
    app.globalData.formValues = {};
  },
  changedEvent: function (e) {
    this.data.formValues[e.currentTarget.id] = e.detail.value;
  },
  //获取验证码事件
  getMsgCode:function(event){
    if (this.data.codeBtnDisabled){
      return;
    }
    if (util.isEmpty(this.data.formValues.account)){
      wx.showToast({
        title: '请填写手机号码',
        image:'/images/common/tip-error.png'
      });
      return;
    }
    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(this.data.formValues.account)) {
      wx.showToast({
        title: '手机号码格式错误',
        image: '/images/common/tip-error.png'
      });
      return ;
    }
    this.data.codeBtnDisabled = true;
    this.data.codeBtnHtmler = "60s后重发";
    var _this = this;
    app.request({
      'url': '/application/message/sendCode.shtml',
      'params': {
        'account': _this.data.formValues.account,
        'businessType': "1"
      },
      'method': 'POST',
      'successCallback':function(result){
        wx.showToast({
          title: '验证码发送成功',
          icon: "success"
        });
        //发送验证码成功，60秒倒计时开始
        var interval = setInterval(function () {
          if (_this.data.retrySeconds==0){//倒计时结束
            clearInterval(interval);
            _this.setData({
              codeBtnDisabled : false,
              codeBtnHtmler : "获取验证码"
            });
            return;
          }
          _this.data.retrySeconds--;
          _this.setData({
            codeBtnHtmler: _this.data.retrySeconds+"s后重发"
          });
        },1000);
      },
      'failCallback':function(result){
        _this.setData({
          codeBtnDisabled: false,
          codeBtnHtmler: "获取验证码"
        });
      }
    });
  },
  //绑定手机号数据提交
  bindPhone:function(e){
    var params = {
      'unionId': 　this.data.unionId,
      'nickName': this.data.nickName,
      'head': this.data.head,
      'openId': this.data.openId,
      'account': this.data.formValues.account,
      'name': this.data.formValues.name,
      'code': this.data.formValues.code
    };
    app.request({
      'url': '/mini/entry/bindAccount.shtml',
      'params': params,
      'method': 'POST',
      'successCallback': function (result) {
        var data = result.data;
        //微信unionId登录成功，记录sessionId和用户信息
        wx.setStorageSync("sessionId", data.sessionId);
        var userInfo = {};
        userInfo.account = data.account;
        userInfo.pwd = data.pwd;
        userInfo.nickName = data.nickName;
        userInfo.head = data.head;
        wx.setStorageSync("userInfo", userInfo);
        wx.showToast({
          title: '绑定账号成功',
          icon: 'success',
          mask: true,
          complete: function(){
            wx.navigateBack();
          }
        })
      },
      'failCallback': function(result){

      }
    });
  }
})