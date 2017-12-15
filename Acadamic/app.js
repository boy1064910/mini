var common = require('config/common.js');
var util = require('utils/util.js');
//app.js
App({
    onLaunch: function () {
        
    },
    globalData: {
        userInfo: null
    },
    //微信登录
	wxLogin: function (config){
        wx.showLoading({'title':'正在登陆'});
        var _this = this;
        wx.login({
            success: res => {
                var code = res.code;
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.getUserInfo({
                    success: res => {
                        //获取加密数据
                        var encryptedData = res.encryptedData;
                        var iv = res.iv;
                        wx.request({
                            'url': common.accountService + '/entry/wxLogin.shtml',
                            'method':'post',
                            'data':{
                              'code': code,
                              'encryptedData': encryptedData,
                              'iv': iv
                            },
							'header':{
								'content-type':'application/x-www-form-urlencoded'
							},
							'dataType':'json',
                            'success':function(res){
                                wx.hideLoading();
								var result = res.data;
								var data = result.data;
								var sessionId = data.sessionId;
								var userInfo = data.userInfo;
                                wx.setStorage({
									key: 'sessionId',
									data: sessionId
								});
								_this.request(config);
                            }
                        });
                    }
                });
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
	 *	paramSubmitType：参数提交方式，统一默认为application/x-www-form-urlencoded，如果是post，则使用此参数，可切换为application/json
     *  params：请求参数，object对象结构
     *  success：成功回调
     *  fail：失败回调
     * }
     */
    request: function (config) {
        var sessionId = wx.getStorageSync("sessionId");
        if (util.isEmpty(sessionId)){//sessionId为空，尚未登录，走微信登录逻辑
			this.wxLogin(config);
        }
        else{
			wx.showLoading();
			var params = util.isEmpty(config.params) ? {} : config.params;
			var header = {
				'content-type': 'application/x-www-form-urlencoded',
				'X-Requested-With': 'XMLHttpRequest',
				'xfsw-session': sessionId,
				'content-type': 'application/x-www-form-urlencoded'
			};
			var _this = this;

			wx.request({
				url: config.url,
				data: params,
				method: util.isEmpty(config.method) ? 'GET' : config.method,
				dataType: 'json',
				header: header,
				success: res =>{
                    wx.hideLoading();
					var result = res.data;
					var code = result.code;
					switch(code){
						case 200: {
							// 数据请求正常后的逻辑操作
							if (!util.isEmpty(config.success)) {
								//成功回调方法不为空的情况，执行回调函数
								config.success(result);
							}
							break;
						}
						default:{
							//进行公共错误处理
							_this.failCommonDeal(config,res);
							if (!util.isEmpty(config.fail)) {
								//失败回调方法不为空的情况，执行回调函数
								config.fail(result);
							}
							break;
						}
					}
				},
				fail: function (result) {
                    wx.hideLoading();
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
					
				}
			});
        }
    },
	//请求错误公共处理
	failCommonDeal: function(oldConfig,res){
		var result = res.data;
		var code = result.code;
		switch(code){
			case 1001:{
				this.wxLogin(oldConfig);
				break;
			}
			default:{
				break;
			}
		}
	}
})