// components/timeSelect/timeSelect.js
const date = new Date()
const month = date.getMonth()+1;
const nowMonth = date.getMonth()+1;
const day = date.getDate();
const nowDay = date.getDate();
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    years,
    year: date.getFullYear(),
    nowYear: date.getFullYear(),
    nowMonth,
    nowDay,
    months,
    month,
    days,
    day,
    value: [9999, month-1, day-1],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange(e) {
      let selectYear = this.data.years[e.detail.value[0]];
      let selectMonth = this.data.months[e.detail.value[1]];
      let selectDay = this.data.days[e.detail.value[2]];
      let valueYear = 'value[' + 0 + ']';
      let valueMonth = 'value[' + 1 + ']';
      let valueDay = 'value[' + 2 + ']'
      this.setData({
        [valueYear]: e.detail.value[0],
      })
      // 判断是否闰年
      if (selectYear%4 == 0) {
        if (selectMonth > this.data.nowMonth && this.data.nowYear == selectYear) {
          this.setData({
            [valueMonth]: this.data.nowMonth-1
          })
        }else {
          this.setData({
            [valueMonth]: e.detail.value[1]
          })
        }
        if (selectDay > 29) {
          this.setData({
            [valueDay]: 0
          })
        }else {
          this.setData({
            [valueDay]: e.detail.value[2]
          })
        }
      }else {
        // 不是闰年 不得超过28
        if (selectMonth > this.data.nowMonth && this.data.nowYear == selectYear) {
          this.setData({
            [valueMonth]: this.data.nowMonth-1
          })
        }else {
          if (selectMonth == 4 || selectMonth == 6 || selectMonth == 9 || selectMonth == 11) {
            if (selectDay > 30) {
              this.setData({
                [valueDay]: 0,
                [valueMonth]: e.detail.value[1]
              })
            } else {
              this.setData({
                [valueDay]: e.detail.value[2],
                [valueMonth]: e.detail.value[1]
              })
            }
          } else if (selectMonth == 2) {
            if (selectDay > 28) {
              this.setData({
                [valueDay]: 0,
                [valueMonth]: e.detail.value[1]
              })
            } else {
              this.setData({
                [valueDay]: e.detail.value[2],
                [valueMonth]: e.detail.value[1]
              })
            }
          } else {
            this.setData({
              [valueDay]: e.detail.value[2],
              [valueMonth]: e.detail.value[1]
            })
          }
        }
      }
      this.setData({
        year: selectYear,
        month: selectMonth,
        day: selectDay
      })
    },
    //取消
    closePanel() {
      this.setData({
        show: false,
        value: [9999, this.data.month, this.data.day],
      });
      this.triggerEvent('closeTime');
      this.init();
    },
    // 确定
    surePanel() {
      if (this.data.year == this.data.nowYear && (this.data.month > this.data.nowMonth || this.data.day > this.data.nowDay)) {
        return
      }else {
        this.setData({
          show: false,
          value: [9999, this.data.month, this.data.day],
        });
        let eventDetail = {
          year: this.data.year,
          month: this.data.month,
          day: this.data.day
        };
        this.triggerEvent('getTime', eventDetail);
        this.init();
      }
    },
    // 重置
    init() {
      this.setData({
        value: [9999, month - 1, day - 1],
      })
    },
  }
})
