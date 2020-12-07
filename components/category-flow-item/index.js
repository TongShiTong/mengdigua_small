// demo.js
import { tapFloor } from "../../utils/navigate";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    tap(e) {
      // console.log(e)
      tapFloor(e);
    },
  },
});
