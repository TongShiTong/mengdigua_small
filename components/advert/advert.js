// components/advert/advert.js
import { tapFloor } from "../../utils/navigate";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    advertInfo: {
      type: Object,
      value: null,
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    theme: "",
    autoplay: true,
    indicatorDots: true,
    module2: null,
    module3: null,
    module4: null,
    module5s: [],
    module6s: [],
    mudule7s: [],
  },
  attached() {
    // 在组件实例进入页面节点树时执行
    const module2 = this.data.advertInfo.moduleList.find((m) => m.type === 2);
    const module3 = this.data.advertInfo.moduleList.find((m) => m.type === 3);
    const module4 = this.data.advertInfo.moduleList.find((m) => m.type === 4);
    const module5s = this.data.advertInfo.moduleList.filter((m) => m.type === 5);
    const module6s = this.data.advertInfo.moduleList.filter((m) => m.type === 6);
    const module7s = this.data.advertInfo.moduleList.filter((m) => m.type === 7);

    this.setData({
      theme: getApp().globalData.theme,
      module2: module2,
      module3: module3,
      module4: module4,
      mudule5s: module5s,
      mudule6s: module6s,
      mudule7s: module7s
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tap(e) {
      tapFloor(e);
    },
  },
});
