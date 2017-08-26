var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    //页面数据
    courseId: 0,
    courseModel: {},
    //样式数据
    'screenWidth': '200rpx',//屏幕宽度
    'picHeight': '200rpx',
    'teacherDetailWidth': '200rpx',//老师信息明细宽度
    'courseDetailHeight': '568rpx',//课程大纲初始化高度，大纲超过4条数据，则启用展开收缩功能
    'moreDetailImg': 'down.png',
    'addCourseBtnText': '加入清单',
    'addCourseBackColor': '#FF3400',
    'shoppingCountDisplay': 'none'
  },
  onLoad: function (options) {
    this.data.courseId = options.id;
    var systemInfo = wx.getSystemInfoSync();
    //caculate the height of swiper
    this.setData({
      screenWidth: systemInfo.screenWidth,
      picHeight: (systemInfo.screenWidth / (16 / 9) * 2) + "rpx",
      teacherDetailWidth: (systemInfo.screenWidth - 60 - 20) + "rpx"//减去头像宽度+margin（10px）+文字板块的margin（10px）
    });
  },
  onShow:function(){
    var _this = this;
    app.request({
      'url': '/mini/course/courseDetail.shtml',
      'params': {
        'id': _this.data.courseId
      },
      'successCallback': function (result) {
        var courseInfo = result.data;
        //设置标题栏
        wx.setNavigationBarTitle({
          title: courseInfo.name
        });

        courseInfo.titlePageUrl = courseInfo.titlePageUrl + "/resize,w_" + _this.data.screenWidth;//优化图片像素尺寸，提升加载速度
        for (var i = 0; i < courseInfo.detailList.length; i++) {
          var startTime = courseInfo.detailList[i].startTime;
          var endTime = courseInfo.detailList[i].endTime;
          courseInfo.detailList[i].startTime = util.formatDate(new Date(courseInfo.detailList[i].startTime), '%Y-%M-%d %H:%m');
          courseInfo.detailList[i].endTime = util.formatDate(new Date(courseInfo.detailList[i].endTime), '%H:%m');
        }
        _this.setData({ courseModel: courseInfo });
        if (courseInfo.exsitShoppingList) {
          _this.setData({
            addCourseBtnText: '已加入清单',
            addCourseBackColor: '#0B9EDE'
          });
        }
        else{
          _this.setData({
            addCourseBtnText: '加入清单',
            addCourseBackColor: '#FF3400'
          });
        }
        if (courseInfo.shoppingCarLength > 0) {
          _this.setData({
            shoppingCountDisplay: 'block'
          });
        }
        else{
          _this.setData({
            shoppingCountDisplay: 'none'
          });
        }
      }
    })
  },
  toggleCourseDetail: function () {
    var courseDetailHeight = this.data.courseDetailHeight;
    if (courseDetailHeight == "auto") {
      this.setData({
        'courseDetailHeight': '568rpx',
        'moreDetailImg': 'down.png'
      });
    }
    else {
      this.setData({
        'courseDetailHeight': 'auto',
        'moreDetailImg': 'up.png'
      });
    }
  },
  addShoppingList: function (e) {
    var _this = this;
    if (!this.data.courseModel.exsitShoppingList) {
      var courseId = e.target.dataset.courseId;
      app.request({
        'url': '/mini/shopping/car/addCourseIntoShoppingCar.shtml',
        'method': 'post',
        'params': {
          'id': courseId
        },
        'successCallback': function (result) {
          var courseModel = _this.data.courseModel;
          courseModel.exsitShoppingList = true;
          courseModel.shoppingCarLength++;
          _this.setData({
            addCourseBtnText: '已加入清单',
            addCourseBackColor: '#0B9EDE',
            shoppingCountDisplay: 'block',
            courseModel: courseModel
          });
        },
        'failCallback':function(result){
          switch(result.resultCode){
            case 1201:{
              var courseModel = _this.data.courseModel;
              courseModel.exsitShoppingList = true;
              courseModel.shoppingCarLength++;
              _this.setData({
                addCourseBtnText: '已加入清单',
                addCourseBackColor: '#0B9EDE',
                shoppingCountDisplay: 'block',
                courseModel: courseModel
              });
              break;
            }
            default:{
              getApp().toContactService('微信小程序登录异常，错误代码：' + result.resultCode + ',错误原因：' + result.resultCode);
              break;
            }
          }
        }
      });
    }
  },
  //跳转到结算页面
  toSettle: function () {
    wx.navigateTo({
      url: '/pages/settle/detail/index'
    });
  }
})