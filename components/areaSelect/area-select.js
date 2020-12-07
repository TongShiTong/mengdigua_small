const http = require('../../utils/http.js')
// 父组件调用：<area-select show = "{{show}}" bind: getArea = 'getArea' > </area-select>
Component({

  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: '_init'
    },
  },
  data: {
    cityData: [], //获取到的省市区数据
    provinces: [], //省列表
    citys: [], //市
    countys: [], //区
    values: [0, 0, 0], //选择的值
    value: [0, 0, 0], //picker的值
  },


  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    this.getAddressList()
  }, // 此处attached的声明会被lifetimes字段中的声明覆盖


  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
    hide: function() {},
    resize: function() {},
  },

  methods: {
    //获取省市区
    getAddressList: function() {
      let that = this;
      http.HttpRequst(true, '/base/district-api/index', 2, '',
        {
          upid: 0,
          data_type: 1
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let data = res.data.data;
            var cityData = data;
            that.setData({
              cityData: cityData
            });
            that.reset()
          }
        }
      )
    },
    //重置城市
    reset: function() {
      let cityData = this.data.cityData
      const provinces = [];
      const citys = [];
      const countys = [];
      for (let i = 0; i < cityData.length; i++) {
        provinces.push(cityData[i].name);
      }
      for (let i = 0; i < cityData[0].c_list.length; i++) {
        citys.push(cityData[0].c_list[i].name)
      }
      for (let i = 0; i < cityData[0].c_list[0].d_list.length; i++) {
        countys.push(cityData[0].c_list[0].d_list[i].name)
      }
      this.setData({
        provinces: provinces,
        citys: citys,
        countys: countys
      })
    },
    //滚动省市区
    bindChange: function(e) {
      var val = e.detail.value
      var t = this.data.values;
      var cityData = this.data.cityData;
      if (val[0] != t[0]) {
        const citys = [];
        const countys = [];
        for (let i = 0; i < cityData[val[0]].c_list.length; i++) {
          citys.push(cityData[val[0]].c_list[i].name)
        }
        for (let i = 0; i < cityData[val[0]].c_list[0].d_list.length; i++) {
          countys.push(cityData[val[0]].c_list[0].d_list[i].name)
        }
        this.setData({
          citys: citys,
          countys: countys,
          values: val
        })
        return;
      }
      if (val[1] != t[1]) {
        const countys = [];
        for (let i = 0; i < cityData[val[0]].c_list[val[1]].d_list.length; i++) {
          countys.push(cityData[val[0]].c_list[val[1]].d_list[i].name)
        }
        this.setData({
          countys: countys,
          values: val
        })
        return;
      }
      if (val[2] != t[2]) {
        this.setData({
          values: val
        })
        return;
      }
    },
    //确定选择
    surePanel: function() {
      //省市区中文名
      let p_name = this.data.cityData[this.data.values[0]].name
      let c_name = this.data.cityData[this.data.values[0]].c_list[this.data.values[1]].name
      let d_name = this.data.cityData[this.data.values[0]].c_list[this.data.values[1]].d_list[this.data.values[2]].name
      let nameVal = [p_name, c_name, d_name]
      //省市区id组
      let p_id = this.data.cityData[this.data.values[0]].id
      let c_id = this.data.cityData[this.data.values[0]].c_list[this.data.values[1]].id
      let d_id = this.data.cityData[this.data.values[0]].c_list[this.data.values[1]].d_list[this.data.values[2]].id
      let selectVal = [p_id, c_id, d_id]
      // console.log(selectVal)
      // console.log(nameVal)
      this.setData({
        value: this.data.values,
        show: false,
      });
      let eventDetail = {
        nameVal: nameVal,
        selectVal: selectVal
      }
      this.triggerEvent('getArea', eventDetail)
    },
    //取消
    closePanel: function() {
      this.setData({
        show: false,
        values: [0, 0, 0],
        value: [0, 0, 0]
      });
      this.reset()
    },
    //初始化
    _init: function() {
      if (this.properties.show) {
        // console.log("打开了地区选择器")
      } else {
        // console.log("关闭了")
      }
    }
  }

})