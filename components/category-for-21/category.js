// components/advert/advert.js
const app = getApp();
const http = require("../../utils/http.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categoryInfo: {
      // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    theme: "",
    moduleList:[],
    currentItem: null,
    autoplay: true,
    indicatorDots: true,
    waterFlowRender: null,
    isGone:false
  },
  attached() {
    // 在组件实例进入页面节点树时执行
    const moduleList = this.data.categoryInfo.moduleList;
    moduleList.forEach((m) => {
      m.page = 0;
      m.reachEnd = false;
      m.details = [];
    });
    this.setData({
      theme: getApp().globalData.theme,
      moduleList: moduleList,
      currentItem: moduleList[0],
    });
    const self = this;
    setTimeout(() => {
      const waterFlow = self.selectComponent("#water-flow");
      self.setData({
        waterFlowRender: waterFlow,
      });
      self.renderWaterflow(true);
    }, 200);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setCurrentItem(e) {
      wx.showLoading({
        title: '加载中...',
      })
      if(this.data.isGone) {
        return;
      };
      this.setData({
        isGone: true
      })
      this.tabGone(e)
    },
    tabGone(e) {
      const currentItem = e.currentTarget.dataset.item;
      this.setData({
        currentItem: currentItem,
      });
      this.renderWaterflow(true);
    },
    renderWaterflow(refresh = false) {
      const self = this;
      const moduleList = this.data.moduleList;
      const currentItem = this.data.currentItem;
      if(refresh && currentItem.details.length > 0){
        this.data.waterFlowRender.renderWaterFlow(currentItem.details, true, () => {
          console.log("渲染成功");
          wx.hideLoading()
          self.setData({
            isGone: false
          })
        });
        return;
      }
      if (currentItem.reachEnd) {
        return;
      }
      
      this.getDetails((datas) => {
        if(datas.length === 0){
          currentItem.reachEnd = true;
          self.setData({
            currentItem: currentItem,
          });
          return;
        }
        currentItem.page += 1;
        currentItem.details.push(...datas);

        const index = moduleList.findIndex(
          (m) => m.title === currentItem.title
        );
        moduleList[index] = currentItem;
        self.setData({
          currentItem: currentItem,
          moduleList: moduleList,
        });

        self.data.waterFlowRender.renderWaterFlow(datas, refresh, () => {
          console.log("渲染成功");
          wx.hideLoading()
          self.setData({
            isGone: false
          })
        });
      });
    },
    getDetails(callback) {
      const currentItem = this.data.currentItem;
      const page = currentItem.page;
      http.HttpRequst(
        false,
        "/item/me-item-api/index",
        2,
        "",
        {
          mcid: currentItem.param,
          start_page: page,
          pages: 10,
          token: app.globalData.token,
          token_type: "1",
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            callback(res.data.data.list);
          }
        }
      );
    },
  },
});
