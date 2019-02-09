// pages/default_setting/default_setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 定投方式
    way: [
      "等市值定投",
      "等金额定投",
      "等份额定投",
    ],
    index: 0,

    // 定投周期
    cycle: ["每天","每周","每月"],
    index1: 1,

    // 定投金额
    unit: "市值",

    // 定投时间
    days: ["周一", "周二", "周三", "周四", "周五"],
    index2:0,

    // 止盈

    // 场内/场外
    out:0,
    items: [
      { name: '场内', value: 0, checked: true },
      { name: '场外', value: 1, checked: false },
    ],

    // 手续费

    // 最小单位

    // 设置
    default_setting:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var default_setting = wx.getStorageSync('DEFAULT');
    //console.log('this.data.default_setting', default_setting);
    if (default_setting) 
    {
      //console.log('this.data.default_setting', default_setting);
      this.setData({ index: default_setting.way })
      this.setData({ index1: default_setting.cycle })
      this.setData({ money: default_setting.unit })
      var day;
      switch (parseInt(default_setting.cycle)) {
        case 0:
          day = ["每天"];
          this.setData({ days: day })
          break;
        case 1:
          day = ["周一", "周二", "周三", "周四", "周五"];
          this.setData({ days: day })
          break;
        case 2:
          day = ["1号", "2号", "3号", "4号", "5号", "6号", "7号", "8号", "9号", "10号",
            "11号", "12号", "13号", "14号", "15号", "16号", "17号", "18号", "19号", "20号",
            "21号", "22号", "23号", "24号", "25号", "26号", "27号", "28号"];
          this.setData({ days: day })
          break;
        default:
          day = ["周一", "周二", "周三", "周四", "周五"];
          this.setData({ days: day })
      }
      this.setData({ index2: default_setting.day})
      this.setData({ ying: default_setting.ying })
      this.setData({ range: default_setting.range })

      this.setData({ out: default_setting.outornot })
      var item = [
        { name: '场内', value: 0, checked: true },
        { name: '场外', value: 1, checked: false},
      ];
      if (parseInt(default_setting.outornot)) {
        item[0].checked = false;
        item[1].checked = true;
      }
      else {
        item[0].checked = true;
        item[1].checked = false;
      }
      //console.log('item', item);
      this.setData({ items: item })

      this.setData({ fee: default_setting.fee })
      this.setData({ least: default_setting.least })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 默认定投方式
  way_setting: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({ index: e.detail.value })
    switch (parseInt(e.detail.value)) {
      case 0:
        this.setData({ unit: "市值" })
        break;
      case 1:
        this.setData({ unit: "金额" })
        break;
      case 2:
        this.setData({ unit: "份数" })
        break;
      default:
        this.setData({ unit: "市值" })
    }
  },

  // 默认定投周期
  cycle_setting: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({ index1: e.detail.value })
    var day;
    switch (parseInt(e.detail.value)) {
      case 0:
        day = ["每天"];
        this.setData({ days: day })
        break;
      case 1:
        day = ["周一", "周二", "周三", "周四", "周五"];
        this.setData({ days: day })
        break;
      case 2:
        day = ["1号", "2号", "3号", "4号", "5号", "6号", "7号", "8号", "9号", "10号",
          "11号", "12号", "13号", "14号", "15号", "16号", "17号", "18号", "19号", "20号",
          "21号", "22号", "23号", "24号", "25号", "26号", "27号", "28号"];
        this.setData({ days: day })
        break;
      default:
        day = ["周一", "周二", "周三", "周四", "周五"];
        this.setData({ days: day })
    }
    // console.log('this.data.days', this.data.days)
    // console.log('this.data.index2', this.data.index2);
    if(this.data.index2 > (day.length - 1))
    {
      this.setData({ index2: 0 })
    }
  },

  day_setting: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({ index2: e.detail.value })
  },

  // 场内/场外
  radioChange: function (e) {
    this.setData({ out: e.detail.value })
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  formSubmit: function (e) {
    var way = this.data.index;
    var cycle = parseInt(this.data.index1);
    var unit = parseFloat(e.detail.value.unit);
    if (isNaN(unit)) 
    {
      unit = 1000;
    }
    var day = this.data.index2;
    var ying = parseFloat(e.detail.value.ying);
    if (isNaN(ying)) {
      ying = 1000;
    }
    var range = parseFloat(e.detail.value.range);
    if (isNaN(range)) {
      range = 10;
    }
    var outornot = this.data.out;
    var fee = parseFloat(e.detail.value.fee);
    if(isNaN(fee)) {
      fee = 3;
    }
    var least = parseFloat(e.detail.value.least);
    if (isNaN(least)) {
      least = 0.1;
    }

    this.data.default_setting = wx.getStorageSync('DEFAULT');
    var default_setting = {
      way: way,
      cycle: cycle,
      unit: unit,
      day: day,
      ying: ying,
      range: range,
      outornot: outornot,
      fee: fee,
      least: least
    };
    //console.log('this.data.default_setting', default_setting);

    this.data.default_setting = default_setting;

    //console.log('this.data.default_setting', this.data.default_setting);

    wx.setStorageSync("DEFAULT", this.data.default_setting);
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1000,
      complete: function () {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 800);
      }
    });
    //console.log('this.data.default_setting', this.data.default_setting);
  }
})