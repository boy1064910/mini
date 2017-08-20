var app = getApp();
var util = require('../../../../../utils/util.js');
Page({
  data: {
    'screenWidth': 375,
    'videoDisplay':'block',
    'knowledgeId': null,
    'knowledge': null,
    'diffLevelList': null,
    'exerciseIndex':0//当前难度级别进度
  },
  onLoad: function (options) {
    this.data.knowledgeId = options.knowledgeId;
  },
  onShow: function () {
    var _this = this;
    app.request({
      'url': '/mini/course/chapter/knowledgeInfo.shtml',
      'params': {
        'knowledgeId': _this.data.knowledgeId
      },
      'successCallback': function (result) {
        wx.setNavigationBarTitle({
          title: result.data.knowledge.name
        });
        var diffLevelList = result.data.diffLevelList;
        var exerciseList = result.data.exerciseList;
        //将数据 难度级别和练习题的关系组合
        if(!util.isEmpty(diffLevelList)){
          for (var i = 0; i < diffLevelList.length;i++){
            diffLevelList[i].exerciseList = [];
            if (i==0){
              diffLevelList[i].displayState = "block";
            }
            else{
              diffLevelList[i].displayState = "none";
            }
            if (!util.isEmpty(diffLevelList)) {
              var diffLevelCode = diffLevelList[i].code;
              for (var j = 0; j < exerciseList.length;j++){
                console.log(exerciseList[j].code.substr(0, 14) + "====" + diffLevelCode);
                if (exerciseList[j].code.substr(0,14)==diffLevelCode){
                  diffLevelList[i].exerciseList.push(exerciseList[j]);
                }
              }
            }
          }
        }
        console.log(diffLevelList);
        _this.setData({
          'knowledge': result.data.knowledge,
          'diffLevelList': diffLevelList
        });
      }
    });
  },
  //练习题图片加载事件
  exerciseLoadEvent:function(e){
    console.log(e);
    var dIndex = e.target.dataset.dIndex;
    var eIndex = e.target.dataset.eIndex;
    var imgWidth = e.detail.width;
    var imgHeight = e.detail.height;

    var newHeight = this.data.screenWidth * 2 * imgHeight / imgWidth - 24;
    this.data.diffLevelList[dIndex].exerciseList[eIndex].imgHeight = newHeight;
    this.setData({
      'diffLevelList': this.data.diffLevelList
    });
  },
  answerTap:function(e){
    //校验答案
    this.data.diffLevelList[this.data.exerciseIndex].displayState = "none";
    this.data.exerciseIndex++;
    this.data.diffLevelList[this.data.exerciseIndex].displayState = "block";
    this.setData({
      'diffLevelList': this.data.diffLevelList
    });
  }
});