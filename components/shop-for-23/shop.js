// components/shop-for-23/shop.js
const app = getApp();
const http = require("../../utils/http.js");
import { tapFloor } from "../../utils/navigate";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopInfo: {
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
   * 页面的初始数据
   */
  data: {
    moduleList: [],
    currentModule: null,
  },

  attached() {
    const moduleList = this.data.shopInfo.moduleList;

    for (let index = 0; index < moduleList.length; index++) {
      const item = moduleList[index];
      item.index = index;
      item.count = 0;
      item.shopDatas = [];
      item.reachEnd = false;
    }
    this.setData({
      moduleList: moduleList,
      currentModule: moduleList[0],
    });
    this.getShop();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap(e) {
      tapFloor(e);
    },

    switchCurrentModule(e){
      const item = e.currentTarget.dataset.item;
      const currentModule = this.data.moduleList.find(m=>m.title === item.title);
      this.setData({
        currentModule: currentModule,
      });
      this.getShop();
    },

    loadMore(){
      this.getShop();
    },

    getShop: function () {
      const currentModule = this.data.currentModule;
      const moduleList = this.data.moduleList;

      if (currentModule.reachEnd) {
        return;
      }

      const index = currentModule.count;
      const shopIds = currentModule.goods_list.slice(index, index + 10);
      if (shopIds.length === 0) {
        currentModule.reachEnd = true;
        moduleList[currentModule.index] = currentModule;
        this.setData({
          moduleList: moduleList,
          currentModule: currentModule,
        });
        return;
      }

      const mcids = currentModule.spFenlei;
      const three_sbc_ids = currentModule.spLeimu;

      let self = this;
      http.HttpRequst(
        true,
        "/shop/shop-api/index",
        2,
        "",
        {
          start_page: 0,
          pages: 10,
          shop_ids: shopIds,
          mcids: mcids,
          three_sbc_ids: three_sbc_ids,
          token: app.globalData.token,
          token_type: "1",
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            const shopList = res.data.data.list;
            currentModule.count += 10;
            for(let i=0;i<shopList.length;i++) {
              if(shopList[i].shop_title==null) {
                shopList[i].shop_title=''
              }else {
                if((typeof shopList[i].shop_title) === 'string') {
                  shopList[i].shop_title=shopList[i].shop_title.split(",")
                }
              }
            }
            currentModule.shopDatas.push(...shopList);
            moduleList[currentModule.index] = currentModule;
            self.setData({
              moduleList: moduleList,
              currentModule: currentModule
            });
          }
        }
      );
    },
  },
});
