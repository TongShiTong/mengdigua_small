const baseUrl = require('api'); 
const code = require('./code');  //引用AES源码js

module.exports = {
  HttpRequst: HttpRequst,
  wxLogin: wxLogin
}
let queue = {} //请求队列
let waiting = false
let iscode = 0 //0 否 1 是
// const baseUrl = 'http://tmp-api.netmi.com.cn';
// const baseUrl = 'https://merchant-api-f.netmi.com.cn';
// const baseUrl = 'https://merchant-api-test.netmi.com.cn';
// const baseUrl = 'https://shop-api.netmi.com.cn';

 //风格化//ask是是否要进行询问授权，true为要，false为不要
//sessionChoose为1,2,3,4,所以paramSession下标为0的则为空

function HttpRequst(loading, url, sessionChoose, sessionId, params, method, ask, callBack) {
  if (iscode == 1) {
    params = code.Encrypt(JSON.stringify(params)) //请求加密
    var bbbb = JSON.parse(code.Decrypt(params))
  }
  if (loading == true) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }
  var paramSession = [
    {},
    {
      'content-type': 'application/json',
      'Cookie': 'JSESSIONID=' + sessionId
    },
    {
      'content-type': 'application/json'
    },
    {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': 'JSESSIONID=' + sessionId
    },
    {
      'content-type': 'application/x-www-form-urlencoded'
    }
  ];
  var paramSessionTwo = [{},
  {
    'content-type': 'application/json',
    'Cookie': 'JSESSIONID=' + sessionId
  },
  {
    'Content-Type': 'text/aes',
  },
  {
    'content-type': 'application/x-www-form-urlencoded',
    'Cookie': 'JSESSIONID=' + sessionId
  },
  {
    'content-type': 'application/x-www-form-urlencoded'
  }
  ];
  wx.request({
    url: baseUrl + url,
    data: params,
    dataType: "json",
    header: iscode == 1 ? paramSessionTwo[sessionChoose]:paramSession[sessionChoose],
    method: method,
    success: function(res) {
      // 解密
      if (iscode == 1) {
      
        let temRes = JSON.parse(code.Decrypt(res.data))
        res.data = temRes
      }

      if (loading == true) {
        wx.hideLoading(); //隐藏提示框
      }
      //数组内的错误消息不提示
      let errMsg = ['风格还未配置，请联系管理员', '参数项未配置，请联系管理员','商品数组不能为空']
      if (res.data.errcode == 10000 || res.data.errcode == 10001 || res.data.errcode == 10002) {
        wxLogin(loading, url, sessionChoose, sessionId, params, method, ask, callBack);
      } else if (res.data.errcode != 0 && errMsg.includes(res.data.errmsg) == false) {
        if(url=="/shop/me-address-api/default-view"){

        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
        callBack(res)
      } else if (res.data.errcode == 0 && !res.data.data) {
        res.data['data'] = null;
        callBack(res);
      } else {
        callBack(res);
      }
    },
    fail: function() {
      if (loading == true) {
        wx.hideLoading(); //隐藏提示框
      }
    }
  })
}

function wxLogin(loading, url, sessionChoose, sessionId, params, method, ask, callBack) {
  // 将不重复请求推入队列
  if (!(url in queue)) {
    // 请求数据解密
    if (iscode==1){
      arguments[4] = JSON.parse(code.Decrypt(arguments[4]))
    }
    queue[url] = arguments
  }
  if (waiting) {
    return
  }
  waiting = true
  wx.login({
    success: function(res) {
      var code = res.code; //得到code
      HttpRequst(true, "/member/user-api/register", 2, "", {
          js_code: code,
          scenario: 'register_small'
        },
        "POST",
        false,
        function(res) {
          if (res.data.errcode == 0) {
            // let pages = getCurrentPages()
            // let curPage = pages[pages.length - 1]
            // 获取用户数据
            if(wx.getStorageSync('token')){
              getApp().globalData.userInfo = wx.getStorageSync('userInfo');
              getApp().globalData.token = wx.getStorageSync('token');
              getApp().globalData.role = wx.getStorageSync('role');
              getApp().globalData.is_show_shop = wx.getStorageSync('is_show_shop');
            }else{
              getApp().globalData.userInfo = res.data.data;
              getApp().globalData.token = res.data.data.token.token;
              getApp().globalData.role = res.data.data.role;
              getApp().globalData.is_show_shop = res.data.data.is_show_shop;
            }
            
            
            // getApp().globalData.is_show_shop = 1;

            if (getApp().globalData.userInfo.role == 1) {
              getHandInfo()
            }
            // 判断是否需要绑定手机
            if (getApp().globalData.userInfo.is_bind_phone == 0) {
              getApp().globalData.isBindPhone = false;
            } else if (getApp().globalData.userInfo.is_bind_phone == 1) {
              getApp().globalData.isBindPhone = false;
            }
            // curPage.setData({
            //   isBindPhone: res.data.data.is_bind_phone == 0
            // })
            Object.keys(queue).forEach(key => {
              const element = queue[key]
              element[4].token = getApp().globalData.token
              HttpRequst(...element)
            })
            // params.token = res.data.data.token.token;
            // HttpRequst(loading, url, sessionChoose, sessionId, params, method, ask, callBack);
            // 没名字
            if(wx.getStorageSync('token')){
              let header = {
                'content-type': 'application/json'
              }
              header.token = wx.getStorageSync('token')
              wx.request({
                url: baseUrl + '/notice/notice-api/get-num',
                data:{
                  token: wx.getStorageSync('token')
                },
                method:"POST",
                header,
                success(res){
                  if(res.data.errcode==10000  || res.data.errcode == 10001 || res.data.errcode == 10002) {
                    wx.setStorageSync('token','')
                  }
                },
                fail(err){
                  console.log(15152,err)
                }
              })
            }else{
              getApp().globalData.showModal = true;
            }
            // wx.getSetting({
            //   success: res => {
            //     if (res.authSetting['scope.userInfo'] === true && getApp().globalData.userInfo.nickname != '') {
            //       // 已经授权
            //     } else {
            //       // 未授权
            //       // curPage.setData({
            //       //   isShowModal: true
            //       // })
            //       getApp().globalData.showModal = true;
            //     }
            //   }
            // })
          }
          queue = {}
          waiting = false
        })
    }
  })
}

//获取推手信息
var getHandInfo = function() {
  HttpRequst(false, '/hand/hand-api/info', 2, '', {
      token: getApp().globalData.token
    },
    'POST', false,
    (res) => {
      if (res.data.errcode == 0) {
        getApp().globalData.handInfo = res.data.data
      } else {
      }
    }
  )
}