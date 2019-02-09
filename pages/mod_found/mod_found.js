// pages/mod_found/mod_found.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否默认选项
    code:0,
    defaulted: 1,
    // 基金
    found:[],
    // 定投方式
    way: [
      "等市值定投",
      "等金额定投",
      "等份额定投",
    ],
    // 定投的选择
    index: 0,

    // 定投金额
    unit: "市值",

    // 止盈

    // 场内/场外
    out: 0,
    items: [
      { name: '场内', value: 0, checked: true },
      { name: '场外', value: 1 },
    ],

    // 手续费

    // 最小单位

    // 设置
    default_setting: [],

    founds: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var code = options.code;
    var found = wx.getStorageSync('FOUNDS');
    for (var i = 0; i < found.length; ++i) 
    {
      this.data.found = found[i];
    }
    if(this.data.found.is_default)
    {
      var default_setting = wx.getStorageSync('DEFAULT');
      if (default_setting) 
      {
        this.setData
          ({
            index: default_setting.way,
            money: default_setting.unit,
            ying: default_setting.ying,
            range: default_setting.range
          })

        this.setData({ out: default_setting.outornot })
        var item = [
          { name: '场内', value: 0, checked: true },
          { name: '场外', value: 1, checked: false },
        ];
        if (default_setting.outornot) {
          item[1].checked = true;
          item[0].checked = false;
        }
        else {
          item[1].checked = false;
          item[0].checked = true;
        }
        this.setData
          ({
            items: item,
            fee: default_setting.fee,
            least: default_setting.least,
            default_setting: default_setting,
          })
      }
    }
    else
    {
      this.setData
      ({
        index: this.data.found.way,
        money: this.data.found.unit,
        ying: this.data.found.ying,
        range: this.data.found.range
      })
      this.setData({ out: this.data.found.outornot })
      var item = [
        { name: '场内', value: 0, checked: true },
        { name: '场外', value: 1, checked: false },
      ];
      if (default_setting.outornot) {
        item[1].checked = true;
        item[0].checked = false;
      }
      else {
        item[1].checked = false;
        item[0].checked = true;
      }
      this.setData
      ({
        items: item,
        fee: this.data.found.fee,
        least: this.data.found.least,
      })
    }

    this.setData({
      code:code,
      found: this.data.found,
    });
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

  // 是否默认设置
  is_default: function (e) {
    var options = {
      code: this.data.code
    }
    this.setData({ defaulted: e.detail.value })
    if (e.detail.value == 0) {
      this.onLoad(options);
    }
  },

  // 默认定投方式
  way_setting: function (e) {
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

  // 场内/场外
  radioChange: function (e) {
    this.setData({ out: e.detail.value })
  },

  formSubmit: function (e) {
    var code = e.detail.value.code;
    var name = e.detail.value.name;
    var is_default = this.data.defaulted;
    console.log('code', code)
    var found;
    var founds = wx.getStorageSync('FOUNDS');
    for (var i = 0; i < founds.length; ++i) 
    {
      if ((this.data.code) == (founds[i].code)) 
      {
        found = founds[i];
      }
    }
    console.log('found', found)

    // 不使用默认值
    if (is_default == 0) 
    {
      var way = this.data.index;
      var unit = parseFloat(e.detail.value.unit);
      if (isNaN(unit)) {
        unit = 1000;
      }
      var ying = parseFloat(e.detail.value.ying);
      if (isNaN(ying)) {
        ying = 1000;
      }
      var range = parseFloat(e.detail.value.range);
      if (isNaN(range)) {
        ying = 1000;
      }
      var outornot = this.data.out;
      var fee = parseFloat(e.detail.value.fee);
      if (isNaN(fee)) {
        fee = 3;
      }
      var least = parseFloat(e.detail.value.least);
      if (isNaN(least)) {
        least = 0.1;
      }
      // 等市值定投
      if (way == 0) 
      {
        next_unit = unit;
        found.code = code;
        found.name = name;
        found.next_unit = next_unit;
        found.is_default = 0;
        found.way = way;
        found.unit = unit;
        found.ying = ying;
        found.range = range;
        found.outornot = outornot;
        found.fee = fee;
        found.least = leas;
      }
      else 
      {
        found.code = code;
        found.name = name;
        found.next_unit = next_unit;
        found.is_default = 0;
        found.way = way;
        found.ying = ying;
        found.range = range;
        found.outornot = outornot;
        found.fee = fee;
        found.least = leas;
      }
    }
    else {
      if (this.data.default_setting.way == 0) {
        var next_unit = this.data.default_setting.unit;
        console.log('found.code', found.code)
        found.code = code;
        found.name = name;
        found.next_unit = next_unit;
        found.is_default = is_default;
      }
      else {
        found.code = code;
        found.name = name;
        found.is_default = is_default;
      }
    }

    for (var i = 0; i < founds.length; ++i) {
      if ((this.data.code) == (founds[i].code)) {
        founds[i] = found;
      }
    }

    wx.setStorageSync("FOUNDS", founds);
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
  }
})