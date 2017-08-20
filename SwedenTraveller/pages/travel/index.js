//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    emptyInfoDisplay:"none",//无行程信息显示状态
    travelInfoDisplay: "none",//行程信息显示状态
    surfaceHeight:400,
    timePointWidth:50,
    timeDotWidth:30,
    timeEventWidth:200,
    id: 0,
    travel:{}
  },
  onLoad: function (options) {
    this.data.courseId = options.id;
  },
  onShow:function(){
    var timePointWidth = 50;
    var timeDotWidth = 30;
    var timeEventWidth = 200;
    var systemInfo = wx.getSystemInfoSync();
    switch (systemInfo.screenWidth){
      case 320:{
        timePointWidth = 30;
        timeDotWidth = 30;
        timeEventWidth = systemInfo.screenWidth - 60 - 10;
        break;
      }
      case 375: {
        timePointWidth = 45;
        timeDotWidth = 30;
        timeEventWidth = systemInfo.screenWidth - 75 - 10;
        break;
      }
      default:{
        timePointWidth = 50;
        timeDotWidth = 30;
        timeEventWidth = systemInfo.screenWidth - 80 - 10;
      }
    }
    this.setData({
      timeEventWidth: timeEventWidth,
      timePointWidth: timePointWidth,
      timeDotWidth: timeDotWidth,
      surfaceHeight: systemInfo.screenWidth*8/17
    });
    var _this = this;
    app.request({
      'url': '/mini/travel/travelInfo.shtml',
      'params': {
        'id': this.data.courseId
      },
      'successCallback': function (result) {
        if(util.isEmpty(result.data)){
          _this.setData({
            'emptyInfoDisplay' : "block",
            'travelInfoDisplay' : "none"
          });
          return;
        }
        _this.setData({
          'travelInfoDisplay': "block"
        });
        var travel = result.data;
        var currentDate = util.formatDate(new Date(), '%Y-%M-%d');
        var currentTimeValue = new Date().getTime();
        for (var i = 0; i < travel.dateList.length; i++) {
          travel.dateList[i].colorCss = "#3b3b3b";
          travel.dateList[i].travelDate = util.formatDate(new Date(travel.dateList[i].travelDate), '%Y-%M-%d');
          if(travel.dateList[i].isNewPhoto==1){
            travel.dateList[i].newDisPlay = "block";
          }
          else{
            travel.dateList[i].newDisPlay = "none";
          }
          for (var j = 0; j < travel.dateList[i].detailList.length; j++) {
            // var timeEventRowLength = Math.ceil(travel.dateList[i].detailList[j].timeEvent.length * 12 / _this.data.timeEventWidth);
            var timeEventRowLength = Math.ceil(_this.caculateLength(travel.dateList[i].detailList[j].timeEvent) * 12 / _this.data.timeEventWidth);
            if (timeEventRowLength < 2) {
              timeEventRowLength = 2;
            }
            travel.dateList[i].detailList[j].timeEventHeight = timeEventRowLength * 16;
            travel.dateList[i].detailList[j].dotTop = travel.dateList[i].detailList[j].timeEventHeight / 2;            
          }
          for (var j = 0; j < travel.dateList[i].detailList.length; j++) {
            if (j < travel.dateList[i].detailList.length - 1) {
              var timeEventHeight = travel.dateList[i].detailList[j].timeEventHeight;
              var nextTimeEventHeight = travel.dateList[i].detailList[j+1].timeEventHeight;
              travel.dateList[i].detailList[j].timeEventLineHeight = timeEventHeight / 2 + nextTimeEventHeight/2 + 8;
            }
          }
          if (travel.dateList[i].travelDate == currentDate){
            travel.dateList[i].colorCss = "#223db9";
            for (var j = 0; j < travel.dateList[i].detailList.length; j++) {
              travel.dateList[i].detailList[j].colorCss = "#3b3b3b";
              var timePoint = travel.dateList[i].detailList[j].timePoint;
              var timePointValue = new Date(travel.dateList[i].travelDate + " " + timePoint).getTime();
              if (j != travel.dateList[i].detailList.length - 1) {
                var nextTimePoint = travel.dateList[i].detailList[j + 1].timePoint;
                var nextTimePointValue = new Date(travel.dateList[i].travelDate + " " + nextTimePoint).getTime();
                if (currentTimeValue >= timePointValue && currentTimeValue < nextTimePointValue) {
                  travel.dateList[i].detailList[j].colorCss = "#223db9";
                  break;
                }
              }
              else {
                if (currentTimeValue >= timePointValue) {
                  travel.dateList[i].detailList[j].colorCss = "#223db9";
                  break;
                }
              }
            }
          }
        }
        //设置标题栏
        wx.setNavigationBarTitle({
          title: travel.name
        });
        _this.setData({
          'travel': travel
        });
      }
    });
  },
  toAlbums:function(){
    wx.navigateTo({
      url: '/pages/album/index?travelId='+this.data.travel.id
    })
  },
  toAlbumDetail:function(e){
    var travelDateId = e.currentTarget.dataset.travelDateId;
    var photoAlbumName = e.currentTarget.dataset.photoAlbumName;
    wx.navigateTo({
      url: '/pages/albumDetail/index?travelDateId=' + travelDateId + '&albumName=' + photoAlbumName
    });
  },
  toCompany:function(e){
    var companyId = e.currentTarget.dataset.companyId;
    wx.navigateTo({
      url: '/pages/company/index?companyId=' + companyId
    });
  },
  caculateLength:function(val){
    var i = 0;
    var sum = 0;
    while (i < val.length) {
      if (val.charCodeAt(i) > 0 && val.charCodeAt(i) < 255) {
        sum += 0.5;
      }
      else {
        sum += 1;
      }
      i++;
    }
    return sum;
  }
})