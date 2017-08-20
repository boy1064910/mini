var util = require('utils/util.js')

var projectName = 'https://sweden.materia.mobi/sweden-business-traveller';
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,//微信用户信息
  },
  request: function (config) {
    wx.showLoading();
    //组装请求参数数据，加上session-id
    var _params = util.isEmpty(config.params) ? {} : config.params;
    _params['sessionId'] = wx.getStorageSync("sessionId");
    var _this = this;
    wx.request({
      url: projectName + config.url,
      data: _params,
      method: util.isEmpty(config.method) ? 'GET' : config.method,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'X-REQUESTED-CLIENT': 'WX-MINI'
      },
      success: function (res) {
        var result = res.data;
        switch (result.resultCode) {
          case 200: {
            // 数据请求正常后的逻辑操作
            if (!util.isEmpty(config.successCallback)) {
              //成功回调方法不为空的情况，执行回调函数
              config.successCallback(result);
            }
            break;
          }
          case 2: {
            wx.showModal({
              title: 'Nordux提示',
              content: '系统调用服务超时，如需帮助，请点击按钮在线联系客服或者拨打客服电话',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            });
            break;
          }
          case 102: {
            wx.showModal({
              title: 'Nordux提示',
              content: '业务服务异常，请稍候重试，如需帮助，请点击按钮在线联系客服或者拨打客服电话',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            });
            break;
          }
          case 103: {
            wx.showModal({
              title: 'Nordux提示',
              content: '系统服务异常，请稍候重试，如需帮助，请点击按钮联系客服在线联系客服或者拨打客服电话',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            });
            break;
          }
          case 1001: {
            //调用微信登录接口
            wxLogin(config);
            break;
          }
          case 1002: {
            var data = result.data;
            var unionId = data.unionId;
            var openId = data.openId;
            wx.navigateTo({
              url: '/pages/register/index?unionId=' + unionId + "&nickName=" + _this.globalData.userInfo.nickName + "&head=" + _this.globalData.userInfo.avatarUrl + "&openId=" + openId
            });
            break;
          }
          default: {
            //failCallback回调
            if (!util.isEmpty(config.failCallback)) {
              //成功回调方法不为空的情况，执行回调函数
              config.failCallback(result);
            }
            else {
              //请求没有配置错误回调，则采用默认的错误处理方式
              var errorMsg = "小程序服务异常";
              if (!util.isEmpty(result.msg)) {
                errorMsg = result.msg;
              }
              wx.showModal({
                title: 'Nordux提示',
                content: errorMsg,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
            break;
          }
        }
      },
      fail: function (result) {
        //TODO  微信请求错误后的逻辑操作，先判断网络，如果网络没有问题，则显示是否咨询客服
        wx.getNetworkType({
          success: function (res) {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            // var networkType = res.networkType;
            // wx.navigateTo({
            //   url: '/pages/contactService/index?errMsg=学术葩小程序系统服务更新，暂时不可用，请稍后重试',
            // })
          },
          fail: function (res) {
            wx.showToast({
              title: '当前无网络，请连接网络后重试！',
              icon: 'success',
              duration: 2000
            });
          }
        })
      },
      complete: function (result) {
        wx.hideLoading();
      }
    });
  },
  callService: function () {
    wx.makePhoneCall({
      phoneNumber: '18611108660' //仅为示例，并非真实的电话号码
    })
  },
  toContactService: function (errorMsg) {
    wx.showModal({
      title: '学术葩提示',
      content: errorMsg + '\n联系客服？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/contactService/index?errMsg=' + errorMsg
          });
        }
      }
    })
  }
})


//私有方法
function wxLogin(config) {
  var userInfo = wx.getStorageSync("userInfo");
  console.log(userInfo);
  if (util.isEmpty(userInfo)) {//登录账号不存在，调用为微信登录接口
    wx.navigateTo({
      url: '/pages/login/index',
    });
  }
  else {
    //调用账号密码登录逻辑
    //调用公共请求方法，请求微信小程序账号密码登录接口
    getApp().request({
      url: '/mini/entry/login.shtml',
      params: {
        'account': userInfo.account,
        'pwd': userInfo.pwd
      },
      successCallback: function (result) {
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
        getApp().request(config);//重新进行原来的业务请求
      },
      failCallback: function (result) {
        //处理微信小程序账号密码登录错误逻辑
        switch (result.resultCode) {
          case 1003: {
            //账号密码错误，重新进入微信登录界面
            wx.navigateTo({
              url: '/pages/login/index',
            });
            break;
          }
          case 1004: {
            //账号被禁用
            wx.navigateTo({
              url: '/pages/contactService/index?errMsg=系统检测到您的账号存在异被冻结，无法登录'
            });
            break;
          }
          default: {
            wx.navigateTo({
              url: '/pages/contactService/index?errMsg=微信小程序登录异常，错误代码：' + result.resultCode + ',错误原因：' + result.resultCode + '，请联系客服'
            });
            break;
          }
        }
      }
    });
  }
}

