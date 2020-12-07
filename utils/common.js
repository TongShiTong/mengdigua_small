const app = getApp();
const http = require("./http");

function vaildateIdentity(identityValue) {
  var identity = new RegExp(
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  );
  return identity.test(identityValue);
}
// 赞
function zan(self, url, urlTwo, params) {
  // 验证身份证

  if (self.data.zanLoading == false) {
    return;
  }
  self.setData({
    zanLoading: false,
  });
  if (self.data.is_fabulous == 2) {
    wx.request({
      url: app.globalData.baseUrl + url, //
      method: "POST",
      data: params,
      header: {
        "content-type": "application/json", // 默认值
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          getApp().msgShow(self, "点赞成功");
          var old = self.data.articleDetail;
          old.support_num = parseInt(old.support_num) + 1;
          self.setData({
            is_fabulous: 1, //1是 2否
            articleDetail: old,
          });
        } else {
          getApp().msgShow(self, res.data.errmsg);
        }
      },
      complete: function () {
        self.setData({
          zanLoading: true,
        });
      },
    });
  } else {
    wx.request({
      url: app.globalData.baseUrl + urlTwo, //
      method: "POST",
      data: params,
      header: {
        "content-type": "application/json", // 默认值
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          getApp().msgShow(self, "取消点赞");
          var old = self.data.articleDetail;
          old.support_num = parseInt(old.support_num) - 1;
          self.setData({
            is_fabulous: 2, //1是 2否
            articleDetail: old,
          });
        } else {
          getApp().msgShow(self, res.data.errmsg);
        }
      },
      complete: function () {
        self.setData({
          zanLoading: true,
        });
      },
    });
  }
}
// 收藏
function collect(self, url, urlTwo, params) {
  if (self.data.collectLoading == false) {
    return;
  }
  self.setData({
    collectLoading: false,
  });
  if (self.data.is_collection == 2) {
    wx.request({
      url: app.globalData.baseUrl + "url", //
      method: "POST",
      data: params,
      header: {
        "content-type": "application/json", // 默认值
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          getApp().msgShow(self, "收藏成功");
          self.setData({
            is_collection: 1, //1是 2否
          });
        } else {
          getApp().msgShow(self, res.data.errmsg);
        }
      },
      complete: function () {
        self.setData({
          collectLoading: true,
        });
      },
    });
  } else {
    wx.request({
      url: app.globalData.baseUrl + urlTwo, //
      method: "POST",
      data: params,
      header: {
        "content-type": "application/json", // 默认值
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          getApp().msgShow(self, "取消收藏");
          self.setData({
            is_collection: 2, //1是 2否
          });
        } else {
          getApp().msgShow(self, res.data.errmsg);
        }
      },
      complete: function () {
        self.setData({
          collectLoading: true,
        });
      },
    });
  }
}

//获取屏幕高度
function getHight() {
  let self = this;
  wx.getSystemInfo({
    success: function (res) {
      // 可使用窗口宽度、高度
      // 计算主体部分高度,单位为px
      self.setData({
        // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
        second_height: res.windowHeight - 20,
        video_height: res.windowHeight,
      });
    },
  });
}
// 检测主题色
function loadTheme(that, interval_time = 500) {
  const MAX_TIME = 3000;
  let sum = 0;

  that.timer = setInterval(() => {
    let themeInfo = app.globalData.themeInfo;
    if (sum >= MAX_TIME) {
      that.setData({
        theme: 0,
      });
      clearInterval(that.timer);
      return;
    }
    if (app.globalData.hasChangeThem) {
      clearInterval(that.timer);
    } else {
      (that.data.theme || that.data.theme === 0) && clearInterval(that.timer);
    }
    that.setData({
      theme: app.globalData.theme,
    });
    if (themeInfo !== null) {
      if (that.data.bgImg !== void 0) {
        console.log("要会员背景图");
        that.setData({
          bgImg: themeInfo.vip_bg,
          bgImg2: themeInfo.vip_bg2,
        });
      }
      if (that.data.userBg !== void 0) {
        that.setData({
          userBg: themeInfo.user_bg,
        });
      }
    }
    sum += interval_time;
    console.log("主题---" + app.globalData.theme);
  }, interval_time);
}

// 获取推手信息
function getHandInfo(callback) {
  // wx.showLoading({
  //   title: '请稍等',
  // })
  http.HttpRequst(
    false,
    "/hand/hand-api/info",
    2,
    "",
    {
      token: app.globalData.token,
    },
    "POST",
    false,
    (res) => {
      if (res.data.errcode == 0) {
        // wx.hideLoading()
        console.log("是个会员");
        app.globalData.handInfo = res.data.data;
        callback(res.data.data);
      } else {
        // wx.hideLoading()
        console.log("不是会员");
        callback("");
      }
    }
  );
}

//生成分享推手链接
function handleShareUrl(that, path) {
  console.log(path);
  if (path === void 0 || path.indexOf("page") === -1) {
    return;
  }
  let share_code = "";
  const { userInfo, handInfo } = app.globalData;
  // handInfo.share_code = ""
  if (userInfo && ~~userInfo.role === 1 && handInfo && handInfo.share_code) {
    share_code = handInfo.share_code;
    if (share_code !== "") {
      if (path.indexOf("?") > -1) {
        path += `&share_code=${share_code}`;
      } else {
        path += `?share_code=${share_code}`;
      }
    }
    that.setData({
      sharePath: path,
    });
    // return path
  } else {
    if (userInfo && ~~userInfo.role === 1) {
      getHandInfo((res) => {
        console.log(res);
        if (res && res.share_code) {
          share_code = res.share_code;
          if (share_code !== "") {
            if (path.indexOf("?") > -1) {
              path += `&share_code=${share_code}`;
            } else {
              path += `?share_code=${share_code}`;
            }
          }
          that.setData({
            sharePath: path,
          });
          // return path
        } else {
          console.log(path);
          that.setData({
            sharePath: path,
          });
          // return path
        }
      });
    } else {
      that.setData({
        sharePath: path,
      });
    }
  }
}
// 保存formId
function saveForm(self) {
  http.HttpRequst(
    false,
    "/notice/notice-api/get-form-id",
    2,
    "",
    {
      token: app.globalData.token,
      form_id: self.data.formId,
    },
    "POST",
    false,
    function (res) {
      if (res.data.errcode == 0) {
      }
    }
  );
}
//
function compareTime(timeStart, timeEnd) {
  var timeNow = new Date().getTime();
  // console.log(timeStart)
  // console.log(new Date(timeStart.replace(/-/g, "/")).getTime())
  // console.log(new Date(2017,6,5,0,12,00))
  var timeStartC = new Date(timeStart.replace(/-/g, "/")).getTime();
  // console.log(timeStartC)
  var timeEndC = new Date(timeEnd.replace(/-/g, "/")).getTime();
  // 未开时

  let timeStatus; //0 未开时 1正秒杀 2秒杀已经结束
  if (timeNow < timeStartC) {
    timeStatus = 0;
  } else if (timeNow >= timeStartC) {
    if (timeNow < timeEndC) {
      // 正在
      timeStatus = 1;
    } else {
      timeStatus = 2;
    }
  }
  return timeStatus;
}
// 获取列表
function getgoodsList(self, url, params, listname) {
  http.HttpRequst(true, url, 2, "", params, "POST", false, function (res) {
    if (res.data.errcode == 0) {
      self.setData({
        [listname]: res.data.data,
      });
    }
  });
}
// 获取海报
function getPoster(self, url, params) {
  params.token = app.globalData.token;
  http.HttpRequst(false, url, 2, "", params, "POST", false, function (res) {
    if (res.data.errcode == 0) {
      self.setData({
        share_img: res.data.data[0].share_img,
      });
    }
  });
}
// 加载更多
function loadMore(self, url, params, listname) {
  if (!self.data[listname]) {
    return false;
  }
  let pages = params.start_page + 1;
  if (pages > Math.ceil(self.data[listname].total_pages / params.pages) - 1) {
    console.log("加载完了");
    return false;
  } else {
    params.start_page = pages;
    self.setData({
      start_page: pages,
    });
    http.HttpRequst(true, url, 2, "", params, "POST", false, function (res) {
      if (res.data.errcode == 0) {
        let listData = listname + ".list";
        let list = res.data.data.list;
        // let newListData = self.data[listname].list.concat(list);
        // self.setData({
        //   [listData]: newListData
        // })
        let index = self.data[listname].list.length;
        let newData = {}; //新变更数据
        list.forEach((item) => {
          newData[listData + "[" + index++ + "]"] = item; //赋值，索引递增
        });
        self.setData(newData);
      }
    });
  }
}

// 获取列表
function getList(self, url, params, listname, callback) {
  http.HttpRequst(true, url, 2, "", params, "POST", false, function (res) {
    if (res.data.errcode == 0) {
      self.setData({
        [listname]: res.data.data,
      });
      callback(res.data.data);
    }
  });
}

// 获取列表
function getListChange(self, url, params, listname, callback) {
  http.HttpRequst(true, url, 2, "", params, "POST", false, function (res) {
    if (res.data.errcode == 0) {
      self.setData({
        [listname]: res.data.data,
      });
      callback(res.data.data);
    }
  });
}

// 加载更多改
function loadMoreChange(
  self,
  url,
  params,
  listname,
  start_page_name,
  callback
) {
  if (!self.data[listname]) {
    return false;
  }
  let pages = params.start_page + 1;
  if (pages > Math.ceil(self.data[listname].total_pages / params.pages) - 1) {
    console.log("加载完了");
    return false;
  } else {
    params.start_page = pages;
    self.setData({
      [start_page_name]: pages,
    });
    http.HttpRequst(true, url, 2, "", params, "POST", false, function (res) {
      if (res.data.errcode == 0) {
        let listData = listname + ".list";
        console.log(listData);
        let list = res.data.data.list;
        // let newListData = self.data[listname].list.concat(list);
        // self.setData({
        //   [listData]: newListData
        // })
        let index = self.data[listname].list.length;
        let newData = {}; //新变更数据
        list.forEach((item) => {
          newData[listData + "[" + index++ + "]"] = item; //赋值，索引递增
        });
        self.setData(newData);
        callback(res.data.data);
      }
    });
  }
}
// 拼团列表
function getGroupList(self, group_team_id, callback) {
  http.HttpRequst(
    false,
    "/item/me-group-team-api/group-team-user",
    2,
    "",
    {
      group_team_id: group_team_id,
      token: app.globalData.token,
    },
    "POST",
    false,
    function (res) {
      if (res.data.errcode == 0) {
        self.setData({
          team_info: res.data.data.team_info,
          user_list: res.data.data.user_list,
        });
        //
        var temObj = res.data.data.team_info;
        let second =
          (new Date(temObj.end_time.replace(/-/g, "/")).getTime() -
            new Date(temObj.now_time.replace(/-/g, "/")).getTime()) /
          1000;
        if (self.data.groupSecondTime != false) {
          11;
          clearInterval(self.data.groupSecondTime);
        }
        self.data.groupSecondTime = setInterval(() => {
          if (second <= 0) {
            clearInterval(self.data.groupSecondTime);
            // wx.showToast({
            //   title: "拼图失败",
            //   icon: 'none',
            //   duration: 2000
            // })
            // setTimeout(()=>{
            //   wx.navigateBack({
            //     delta: 1,
            //     success: function (res) {
            //     }
            //   })
            // },500)
            return;
          }
          second--;
          self.setData({
            groupSecond: second,
          });
        }, 1000);
        callback(res.data.data);
      }
    }
  );
}
// 拼团列表
function getGroupListTwo(self, group_team_id, callback) {
  http.HttpRequst(
    false,
    "/item/me-group-team-api/get-team-order-info",
    2,
    "",
    {
      group_team_id: group_team_id,
      token: app.globalData.token,
    },
    "POST",
    false,
    function (res) {
      if (res.data.errcode == 0) {
        self.setData({
          team_info: res.data.data.team_info,
          user_list: res.data.data.user_list,
        });
        //
        var temObj = res.data.data.team_info;
        let second =
          (new Date(temObj.end_time.replace(/-/g, "/")).getTime() -
            new Date(temObj.now_time.replace(/-/g, "/")).getTime()) /
          1000;
        if (self.data.groupSecondTime != false) {
          clearInterval(self.data.groupSecondTime);
        }
        self.data.groupSecondTime = setInterval(() => {
          if (second <= 0 || self.data.team_info.left_number == 0) {
            clearInterval(self.data.groupSecondTime);
            return;
          }
          second--;
          self.setData({
            groupSecond: second,
          });
        }, 1000);
        callback(res.data.data);
      }
    }
  );
}
// 判断能否进行图片保存
function judePicSave(self, img) {
  if (self.data.showsetModel) {
    self.setData({
      showsetModel: false,
    });
  }
  wx.authorize({
    scope: "scope.writePhotosAlbum",
    success: function (res) {
      console.log("存在授权");
      wx.getImageInfo({
        src: img,
        success(res) {
          console.log(res);
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success(res) {
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 1000,
              });
            },
          });
        },
      });
    },
    fail: function (res) {
      console.log("没有授权");
      self.setData({
        showsetModel: true,
      });
    },
  });
}
// 协议
function getContent(self, typeId, name, callBack) {
  http.HttpRequst(
    true,
    "/content/content-api/view",
    2,
    "",
    {
      type: typeId,
    },
    "POST",
    false,
    function (res) {
      if (res.data.errcode == 0) {
        if (res.data.data && res.data.data.content) {
          self.setData({
            [name]: res.data.data.content,
          });
        }
        callBack(res.data.data);
      }
    }
  );
}
// 解析二維碼
function hrefObj(url) {
  var localarr = url.split("&");
  var tempObj = {};
  for (var i = 0; i < localarr.length; i++) {
    tempObj[localarr[i].split("=")[0]] = localarr[i].split("=")[1];
  }
  return tempObj;
}
// 智齿参数
function servicekeFu(self, shop_id, item_id, type, callBack) {
  type = shop_id == null ? 2 : type;
  http.HttpRequst(
    false,
    "/customer/index-api/token-by-shop-id",
    2,
    "",
    {
      token: app.globalData.token,
      shop_id: shop_id,
      item_id: item_id,
      type: type,
    },
    "POST",
    false,
    function (res) {
      if (res.data.errcode == 0) {
        callBack(res.data.data);
      }
    }
  );
}
// 取最大的过滤
function arraryMax(arr, keyNmae, maxValue) {
  var result = arr.forEach(function (x, index1) {
    if (Number(x[keyNmae]) > maxValue) {
      maxValue = Number(x[keyNmae]);
    }
  });
  return maxValue;
}
// 数组过滤
function arrayFilter(arr, index, munber) {
  var result = arr.filter(function (x, index1) {
    return index1 < index + munber && index1 >= index;
  });
  return result;
}

module.exports = {
  zan: zan,
  collect: collect,
  getList: getList, //获取列表
  getListChange: getListChange, //改
  getHight: getHight,
  loadTheme,
  handleShareUrl,
  saveForm,
  compareTime,
  getgoodsList,
  loadMore,
  loadMoreChange, //查看更多改 起始页可以改参数
  getPoster,
  getGroupList,
  getGroupListTwo,
  judePicSave, //判断图片能否保存
  getContent, //富文本
  vaildateIdentity,
  hrefObj,
  servicekeFu,
  arraryMax, //数组取最大值
  arrayFilter, //数组过滤
};
