var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    courseList : [],
    orderInfoId : '',
    orderNumber: '',
    
    //学生认证相关数据
    sexArray: [
      {
        id: -1,
        value: '请选择性别'
      },
      {
        id: 0,
        value: '女生'
      },
      {
        id: 1,
        value: '男生'
      }
    ],
    sexIndex: 0,

    identityItems:[
      {
        value : 1,
        name : '学生',
        checked : true,
        viewDisplay: "block"
      },
      {
        value: 2,
        name: '家长',
        checked: false,
        viewDisplay : "none"
      }
    ]
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
    app.request({
      'url': '/mini/shopping/car/list.shtml',
      'successCallback':function(result){
        var data = result.data;
        var courseList = data.courseList;
        if (!util.isEmpty(courseList)) {
          for (var i = 0; i < courseList.length; i++) {
            courseList[i].startDate = util.formatDate(new Date(courseList[i].startDate));
            courseList[i].endDate = util.formatDate(new Date(courseList[i].endDate));
            courseList[i].titlePageUrl = courseList[i].titlePageUrl + "/resize,w_150"
          }
        }
        _this.setData({
          courseList: courseList
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
  deleteCourse:function(e){
    var _this = this;
    wx.showModal({
      title: '学术葩提示',
      content: '是否确定移除该课程？',
      success: function (res) {
        if (res.confirm) {
          var index = e.target.dataset.index;
          var shoppingCarId = e.target.dataset.shoppingCarId;
          app.request({
            'url': '/mini/shopping/car/deleteById.shtml',
            'params': {
              'id': shoppingCarId
            },
            'method': 'post',
            'successCallback': function (result) {
              var courseList = _this.data.courseList;
              courseList.splice(index, 1);
              _this.setData({
                courseList: courseList
              });
            }
          });
        } else if (res.cancel) {
          
        }
      }
    });
  },
  wxPay:function(){
    var shoppingCarIds = "";
    for(var i=0;i<this.data.courseList.length;i++){
      shoppingCarIds += this.data.courseList[i].shoppingCarId;
      if(i!=0){
        shoppingCarIds+=",";
      }
    }
    var _this = this;
    app.request({
      'url':'/mini/order/info/generateCourseOrderInfo.shtml',
      'params':{
        'openId': wx.getStorageSync("userInfo").openId,
        'shoppingCarIdStr': shoppingCarIds,
        'orderInfoId': this.data.orderInfoId
      },
      'successCallback':function(result){
        var data = result.data;
        _this.data.orderInfoId = data.orderInfoId;
        _this.data.orderNumber = data.orderNumber;
        wx.requestPayment(
          {
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': 'MD5',
            'paySign': data.paySign,
            'success': function (res) {
              wx.navigateTo({
                url: '/pages/settle/success/index',
              });
             },
            'fail': function (res) {
              console.log(res);
             },
            'complete': function (res) {
              console.log(res);
             }
          }
        ) 
      },
      'failCallback':function(result){
        wx.hideLoading();
      }
    })
  },
  identityChange:function(e){
    var identityItems = this.data.identityItems;
    for(var i in identityItems){
      if(identityItems[i].value == e.detail.value){
        identityItems[i].checked = true;
        identityItems[i].viewDisplay = "block";
      }
      else{
        identityItems[i].checked = false;
        identityItems[i].viewDisplay = "none";
      }
    }
    this.setData({
      identityItems: identityItems
    });
  }
})