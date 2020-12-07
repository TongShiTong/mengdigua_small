// components/category-for-24/category.js
// components/shop-for-23/shop.js
const app = getApp();
const http = require("../../utils/http.js");
import { tapFloor } from "../../utils/navigate";

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
    bgcolor: String
  },

  /**
   * 页面的初始数据
   */
  data: {
    moduleList: [],
    currentModule: null,
  },

  attached() {
    const moduleList = this.data.categoryInfo.moduleList;
    for (let index = 0; index < moduleList.length; index++) {
      const item = moduleList[index];
      item.index = index;
      item.count = 0;
      item.list = [];
      item.reachEnd = false;
    }
    this.setData({
      moduleList: moduleList,
      currentModule: moduleList[0],
    });
    this.getDetails();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap(e) {
      tapFloor(e);
    },
    tapGood(e) {
      console.log(e)
      let param = e.currentTarget.dataset.id
      let shop_id = e.currentTarget.dataset.shop_id
      wx.navigateTo({
        url: "/pages/goodDetail/goodDetail?id=" + param + "&shop_id=" + shop_id,
      });
    },

    switchCurrentModule(e) {
      const item = e.currentTarget.dataset.item;
      const currentModule = this.data.moduleList.find(
        (m) => m.title === item.title
      );
      this.setData({
        currentModule: currentModule,
      });
      this.getDetails();
    },

    loadMore() {
      this.getDetails();
    },

    getDetails() {
      const currentModule = this.data.currentModule;
      const moduleList = this.data.moduleList;

      if (currentModule.reachEnd) {
        return;
      }

      const startPage = currentModule.count / 20;
      const mcids = currentModule.spFenlei;
      const three_sbc_ids = currentModule.spLeimu;

      const self = this;
      http.HttpRequst(
        false,
        "/item/me-item-api/get-recommend-list",
        2,
        "",
        {
          start_page: startPage,
          pages: 20,
          is_more_page: '2',
          mcids: mcids,
          three_sbc_ids: three_sbc_ids,
          token: app.globalData.token,
          token_type: "1",
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            const list = res.data.data.list;

            if (list.length === 0) {
              currentModule.reachEnd = true;
              moduleList[currentModule.index] = currentModule;
              self.setData({
                moduleList: moduleList,
                currentModule: currentModule,
              });
              return;
            } else {
              currentModule.count += 20;
              currentModule.list.push(...list);
              moduleList[currentModule.index] = currentModule;
              self.setData({
                moduleList: moduleList,
                currentModule: currentModule,
              });
            }
          }
        }
      );
    },
  },
});
