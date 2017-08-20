function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//检查参数是否是undefined
function isUndefined(obj) {
  return (typeof obj == "undefined");
}
//检查参数是否是null
function isNull(obj) {
  return (typeof obj == "object" && !obj);//
}
//检查对象和内容不为空
function isEmpty(obj) {
  return isUndefined(obj) || isNull(obj) || (typeof (obj) == "string" && obj.trim() == "");
}

function formatDate(date, fmt) {
  if (isEmpty(fmt)) {
    fmt = "%Y-%M-%d";
  }
  function pad(value) {
    return (value.toString().length < 2) ? '0' + value : value;
  }
  return fmt.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
    //1927-12-31 00:0:52（-1325664000000）后就没问题
    if (date.getTime() < -1325664000000) {
      date = new Date(date.getTime() + (1325664352000 - 1325664000000));
    };
    switch (fmtCode) {
      case 'Y':
        return date.getFullYear();
      case 'M':
        return pad(date.getMonth() + 1);
      case 'd':
        return pad(date.getDate());
      case 'H':
        return pad(date.getHours());
      case 'm':
        return pad(date.getMinutes());
      case 's':
        return pad(date.getSeconds());
      default:
        console.log("日期格式不支持！");
    }
  });
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  formatDate: formatDate
}


