var common = require('../../config/common.js');
var util = require('../../utils/util.js');
const app = getApp()
Page({
    data: {
        knowledgeList: [],//知识点列表
		progressCourse: {},
		isBuyed: true
    },
    onLoad: function (options) {
        app.request({
            'url': common.acadamicService + "/course/chapter/knowledge/list.shtml",
            'params': {
                'chapterId': options.id
            },
            "success": res => {
                var data = res.data;
                var knowledgeList = data.knowledgeList;
				var progressCourse = data.progressCourse;
				var isBuyed = data.isBuyed;
                this.setData({
                    'knowledgeList': knowledgeList,
					'progressCourse': progressCourse,
					'isBuyed': isBuyed
                });
            }
        })
    },
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
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },
	toKnowledgePoint: function (e) {
		if(this.data.isBuyed){
			wx.navigateTo({
				url: '../knowledge/index?knowledgePointId=' + e.currentTarget.id
			})
		}
    }
})