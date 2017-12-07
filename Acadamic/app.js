var common = require('config/common.js');
//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null
    },
    //微信登录
    wxLogin: function(){
        var _this = this;
        wx.login({
            success: res => {
                console.log(res);
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // wx.getUserInfo({
                //     success: res => {
                //         //获取加密数据
                //         var encryptedData = res.encryptedData;
                //         var iv = res.iv;
                //         _this.request({
                //             'url': common.accountService + '/entry/wxLogin.shtml',
                //             'method':'post',
                //             // 'params':{
                //             //     'code'
                //             // }
                //             'success':result =>{
                //                 console.log(result);
                //             }
                //         })
                //     }
                // });
            },
            fail: res => {
                // TODO 错误提示
            }
        })
    },
    /**
     * config:{
     *  url：请求链接
     *  method：请求方法
     *  params：请求参数，object对象结构
     *  success：成功回调
     *  fail：失败回调
     * }
     */
    request: function (config) {
        var sessionId = wx.getStorageSync("sessionId");
        if (util.isEmpty(sessionId)){//sessionId为空，尚未登录，走微信登录逻辑
            this.wxLogin();
        }
        else{
            
        }
        wx.showLoading();
        //组装请求参数数据，加上session-id
        var _params = util.isEmpty(config.params) ? {} : config.params;
        var sessionId = util.isEmpty() ? '' : wx.getStorageSync("sessionId");
        var _this = this;
        wx.request({
            url: projectName + config.url,
            data: _params,
            method: util.isEmpty(config.method) ? 'GET' : config.method,
            dataType: 'json',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'X-SESSION-ID': sessionId
            },
            success: function (res) {
                var result = res.data;
                switch (result.resultCode) {
                    case 200: {
                        // 数据请求正常后的逻辑操作
                        if (!util.isEmpty(config.successCallback)) {
                            //成功回调方法不为空的情况，执行回调函数
                            config.success(result);
                        }
                        break;
                    }
                    case 2: {
                        wx.showModal({
                            title: '学术葩提示',
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
                            title: '学术葩提示',
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
                            title: '学术葩提示',
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
                        if (!util.isEmpty(config.fail)) {
                            //成功回调方法不为空的情况，执行回调函数
                            config.fail(result);
                        }
                        else {
                            //请求没有配置错误回调，则采用默认的错误处理方式
                            var errorMsg = "小程序服务异常";
                            if (!util.isEmpty(result.msg)) {
                                errorMsg = result.msg;
                            }
                            wx.showModal({
                                title: '学术葩提示',
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
    }
})