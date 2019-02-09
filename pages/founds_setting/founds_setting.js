// pages/founds_setting/founds_setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否默认选项
    defaulted : 1,
    // 分组选项
    groups:[
      { name: '定投', value: 0, checked: true },
      { name: '网格交易', value: 1 },
      { name: '装死模式', value: 2 },
    ],
    // 分组的选择
    group:0,

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

    founds:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  // 分组设置
  groupChange:function(e) {
    this.setData({ group: e.detail.value })
  },

  // 是否默认设置
  is_default: function (e) {
    this.setData({ defaulted: e.detail.value })
    if (e.detail.value == 0)
    {
      this.onLoad();
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
    var group = this.data.group;
    var is_default = this.data.defaulted;
    
    var found;
    if(is_default == 0)
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
      if(way == 0)
      {
        next_unit = unit;
        found =
          [{
            code: code,
            name: name,
            group: group,
            next_unit: next_unit,
            is_default: 0,
            way: way,
            unit: unit,
            ying: ying,
            range: range,
            outornot: outornot,
            fee: fee,
            least: least
          }];
      }
      else
      {
        found =
          [{
            code: code,
            name: name,
            group: group,
            is_default: 0,
            way: way,
            unit: unit,
            ying: ying,
            range: range,
            outornot: outornot,
            fee: fee,
            least: least
          }];
      }
    }
    else
    {
      if(this.data.default_setting.way == 0)
      {
        var next_unit = this.data.default_setting.unit;
        found = [{
          code: code,
          name: name,
          group: group,
          next_unit: next_unit,
          is_default: is_default
        }];
      }
      else
      {
        found = [{
          code: code,
          name: name,
          group: group,
          is_default: is_default
        }];
      }
    }
      
    this.data.founds = wx.getStorageSync('FOUNDS');
    if ((this.data.founds)) {
      this.data.founds = found.concat(this.data.founds);
    } else {
      this.data.founds = found;
    }

    var groups = new Array(3);
    groups[group] = [{
      zh: name,
      code: code
    }];

    var groups_g = wx.getStorageSync('GROUPS');
    if ((groups_g)) {
      if (groups_g[group] == null)
      {
        groups_g[group] = groups[group];
      }
      else
      {
        groups_g[group] = groups[group].concat(groups_g[group]);
      }
    } else {
      groups_g = groups;
    }
    wx.setStorageSync("GROUPS", groups_g);

    wx.setStorageSync("FOUNDS", this.data.founds);
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