var common = require('../../config/common.js');
const app = getApp()

Page({

	data: {
		'course': null,
		'chapterList': null,
		"courseBuyBtnTxt": "购买整个课程",
		"allBuyed":true,
		"unBuyChapterIdArray":[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.loadData(options.id);
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
		this.loadData(this.data.course.id);
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
	payChapter: function (e) {
		var _this = this;
		console.log(_this);
		app.request({
			'url': common.acadamicService + '/order/orderChapter.shtml',
			'method': 'post',
			'params': {
				'chapterId': e.currentTarget.id
			},
			'success': function (result) {
				var data = result.data;
				wx.requestPayment({
					'timeStamp': data.timeStamp,
					'nonceStr': data.nonceStr,
					'package': data.package,
					'signType': data.signType,
					'paySign': data.paySign,
					'success': function (res) {
						_this.loadData(_this.data.course.id);
					},
					'fail': function (res) {
						console.log(res);
					}
				})
			}
		})
	},
	payChapterList:function(e){
		var _this = this;
		app.request({
			'url': common.acadamicService + '/order/orderChapterList.shtml',
			'method': 'post',
			'params': {
				'chapterIds': this.data.unBuyChapterIdArray,
				'allBuyed': this.data.allBuyed,
				'courseId':this.data.course.id
			},
			'success': function (result) {
				var data = result.data;
				wx.requestPayment({
					'timeStamp': data.timeStamp,
					'nonceStr': data.nonceStr,
					'package': data.package,
					'signType': data.signType,
					'paySign': data.paySign,
					'success': function (res) {
						_this.loadData(_this.data.course.id);
					},
					'fail': function (res) {
						console.log(res);
					}
				})
			}
		})
	},
	loadData:function(courseId){
		app.request({
			'url': common.acadamicService + "/course/chapter/list.shtml",
			'params': {
				'courseId': courseId
			},
			"success": res => {
				var data = res.data;

				var allBuyed = true;
				var unBuyChapterIdArray = [];//未购买的章节列表
				var leavePartPriceSum = 0;
				for (var i = 0; i < data.chapterList.length; i++) {
					if (data.chapterList[i].buyed) {
						allBuyed = false;
					}
					else {
						leavePartPriceSum += data.chapterList[i].chapter.price;
						unBuyChapterIdArray.push(data.chapterList[i].chapter.id);
					}
				}
				var courseBuyBtnTxt = "购买整个课程(￥" + data.course.price + ")";
				if (!allBuyed) {
					courseBuyBtnTxt = "购买剩下章节(￥" + leavePartPriceSum + ")";
				}
				this.setData({
					'course': data.course,
					'chapterList': data.chapterList,
					'courseBuyBtnTxt': courseBuyBtnTxt,
					'allBuyed': allBuyed,
					'unBuyChapterIdArray': unBuyChapterIdArray
				});
			}
		})
	}
})