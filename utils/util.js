const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTimeTow = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatMin = value => {
  var theTime = parseInt(value);// 秒 
  var theTime1 = 0;// 分 
  if (theTime >= 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
  }
  if (theTime < 10) {
    theTime = "0" + theTime
  }
  var result = theTime;
  if (theTime1<=0){
    theTime1 = "0" + theTime1
    result =   theTime1+":" + result;
  }
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + ":" + result;
  }
  return result;
}

//秒变成时分秒

const formatSeconds = value => {
  var theTime = parseInt(value);// 秒 
  var theTime1 = 0;// 分 
  var theTime2 = 0;// 小时 
  // alert(theTime); 
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    // alert(theTime1+"-"+theTime); 
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + "分" + result;
  }
  if (theTime2 > 0) {
    result = "" + parseInt(theTime2) + "小时" + result;
  }
  return result;
}

//秒杀倒计时 时分秒

const skill = value => {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分 
  var theTime2 = 0;// 小时 
  if (theTime >= 60) {
    theTime1 = parseInt(theTime / 60);
    // 秒
    if (parseInt(theTime % 60) < 10) {
      theTime = '0' + parseInt(theTime % 60);
    }else {
      theTime = parseInt(theTime % 60);
    }
    // 分
    if (theTime1 < 10) {
      theTime1 = '0' + parseInt(theTime1);
    }else {
      theTime1 = parseInt(theTime1);
    }
    // 时
    if (theTime1 >= 60) {
      if (parseInt(theTime1 / 60) < 10) {
        theTime2 = '0' + parseInt(theTime1 / 60);
      }else {
        theTime2 = parseInt(theTime1 / 60);
      }
      if (parseInt(theTime1 % 60) < 10) {
        theTime1 = '0' + parseInt(theTime1 % 60);
      } else {
        theTime1 = parseInt(theTime1 % 60);
      }
    }else {
      theTime2 = '0' + parseInt(theTime1 / 60);
    }
  }else {
    if (parseInt(theTime % 60) < 10) {
      theTime = '0' + parseInt(theTime % 60);
    } else {
      theTime = parseInt(theTime % 60);
    }
    theTime1 = '0' + parseInt(theTime1);
    theTime2 = '0' + parseInt(theTime1 / 60);
  }
  var result = theTime2 + "时" + theTime1 + "分" + theTime + "秒";
  return result;
}
//秒杀倒计时  天时分秒
const skillTwo = value => {
  const leftSecond = parseInt(value / 1000)
  const Day = Math.floor(leftSecond / (60 * 60 * 24))
  const Hour = Math.floor((leftSecond - Day * 24 * 60 * 60) / 3600)
  const Minute = Math.floor((leftSecond - Day * 24 * 60 * 60 - Hour * 3600) / 60)
  const Second = Math.floor(leftSecond - Day * 24 * 60 * 60 - Hour * 3600 - Minute * 60)
  return {
    'year': '00',
    'monuth': '00',
    'day': String((Day < 10 ? '0' + Day : Day)),
    'hour': String((Hour < 10 ? '0' + Hour : Hour)),
    'minute': String((Minute < 10 ? '0' + Minute : Minute)),
    'second': String((Second < 10 ? '0' + Second : Second))
  }
}
// 时间加函数
const formatTimeThree = date => {
  var data1 = new Date(date);
  var data2 = data1.getTime() + 1000 * 3600 * 24
  var data3 = new Date(data2);
  const year = data3.getFullYear();
  const month = data3.getMonth() + 1
  const day = data3.getDate()
  const hour = data3.getHours()
  const minute = data3.getMinutes()
  const second = data3.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 时间戳转时间
const formatTimeFour = date => {
  var data1 = new Date(date);
  const year = data1.getFullYear();
  const month = data1.getMonth() + 1
  const day = data1.getDate()
  const hour = data1.getHours()
  const minute = data1.getMinutes()
  const second = data1.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}
// 字符串截取
const substrTwo = function (string, long) {
  if ((string + "").length > long) {
    string = (string + "").substring(0, long);
    return string
  } else {
    return string
  }
}
module.exports = {
  formatTime: formatTime,
  formatMin: formatMin,
  formatTimeTow: formatTimeTow,
  formatTimeThree: formatTimeThree,
  formatTimeFour: formatTimeFour,
  formatSeconds : formatSeconds,
  skill: skill,
  substrTwo: substrTwo,
  skillTwo: skillTwo
}
