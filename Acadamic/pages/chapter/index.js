var common = require('../../config/common.js');
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
	  knowledgeList:[]//知识点列表
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
			  var progressChapter = data.progressChapter;
			  this.setData({
				  'knowledgeList': knowledgeList
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
  
  }
})