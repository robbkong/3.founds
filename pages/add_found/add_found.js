// pages/add/add.js
var util = require('../../utils/moment.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: 0,  // 基金代码
    month_n: 1, // 输入框个数
    dates: [],  // 日期数组
    is_auto: true,  // 自动填充选择

    // // 存储的历史记录
    // historys: [],

    // 输入框之间的联系
    price:[],
    share:[],
    fee:[],
    mount:[],

    // 基金设置中的费率
    default_fee:0,
    default_least:0,
    default_setting:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取基金代码
    var code = options.code;

    var month_n = 1;
    // 获取当前时间
    var now = util.getNowFormatDate();
    // 将当前时间存储到date中
    this.data.dates.push(now);

    // 获取基金存储中的fee和min
    var founds = wx.getStorageSync('FOUNDS');
    var is_default = 0;
    var default_fee = 0;
    var least = 0;
    if (founds) {
      for (var i = 0; i < founds.length; ++i) {
        if (code == founds[i].code) 
        {
          if(founds[i].is_default)
          {
            is_default = 1;
          }
          else
          {
            default_fee = founds[i].fee;
            least = founds[i].least;
          }
        }
      }
    }
    
    if(is_default)
    {
      var default_setting = wx.getStorageSync('DEFAULT');
      //console.log('default_setting', default_setting);
      default_fee = default_setting.fee;
      least = default_setting.least;
    }
    // 初始化输入框数组内容
    var price = [0];
    var share = [0];
    var fee = [0];
    var mount = [0];

    // 回存数据
    this.setData({
      code: code,
      month_n: month_n,
      dates: this.data.dates,
      default_fee: default_fee,
      default_least: least,
      price: price,
      share: share,
      fee: fee,
      mount: mount,
      default_setting: default_setting,
    })
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
  // 日期的增加
  bindDateChange: function (e) {
    this.data.dates[e.target.id] = e.detail.value;
    if (this.data.is_auto == true) {
      var days = e.detail.value;
      var strs = new Array(); //定义一数组 
      strs = days.split("-"); //字符分割 

      var year, month, day;
      [year, month, day] = strs;

      for (var i = parseInt(e.target.id) + 1; i < this.data.dates.length; i++) {
        var arr = util.monthplus(year, month, day);
        this.data.dates[parseInt(i)] = arr[0];
        year = arr[1];
        month = arr[2];
      }
    }
    this.setData({
      dates: this.data.dates
    })
  },
  // 计算手续费额
  getfeemount:function(id,price,share)
  {
    // 价格* 份额
    var total =price * share;
    var fee = parseFloat(total * this.data.default_fee) / 10000;

    // console.log('total ', total);
    // console.log('fee ', parseFloat(total * this.data.default_fee));
    // console.log('this.data.default_least ', this.data.default_least);

    if (fee < this.data.default_least) {
      fee = this.data.default_least;
    }
    var mount = fee + total;
    fee = fee.toFixed(2);
    mount = mount.toFixed(2);
    this.data.fee[id] = fee;
    this.data.mount[id] = mount;
    this.setData
    ({
      fee: this.data.fee,
      mount: this.data.mount
    })
  },
  priceChange:function(e)
  {
    var id = parseInt(e.currentTarget.id);
    if(this.data.share[id] !=0)
    {
      this.getfeemount(id,parseFloat(e.detail.value), this.data.share[id]);
    }
    this.data.price[id] = parseFloat(e.detail.value)
    this.setData({ price: this.data.price })
  },
  shareChange: function (e) 
  {
    var id = parseInt(e.currentTarget.id);
    if (this.data.price[id] != 0) 
    {
      this.getfeemount(id,this.data.price[id],parseFloat(e.detail.value));
    }
    this.data.share[id] = parseFloat(e.detail.value)
    this.setData({ share: this.data.share })
  },
  feeChange:function(e)
  {
    var id = parseInt(e.currentTarget.id);
    var fee = parseFloat(e.detail.value);
    if ((this.data.price[id] != 0) && (this.data.share[id] != 0)) 
    {
      this.data.mount[id] = this.data.share[id] * this.data.price[id] + fee;
      this.data.mount[id] = this.data.mount[id].toFixed(2);
      this.setData({ mount: this.data.mount})
    }
    fee = fee.toFixed(2);
    this.data.fee[id] = fee;
    this.setData({ fee: this.data.fee })
  },
  add: function () {
    var date = this.data.dates[this.data.dates.length - 1]

    var year, month, day;
    [year, month, day] = util.getdate(date);

    var a_monthplus = new Array();
    a_monthplus = util.monthplus(year, month, day);
    this.data.dates.push(a_monthplus[0]);

    // 初始化输入框数组内容
    var price = this.data.price.concat(0);
    var share = this.data.share.concat(0);
    var fee = this.data.fee.concat(0);
    var mount = this.data.mount.concat(0);

    this.setData
    ({ 
      month_n: this.data.dates.length,
      dates: this.data.dates,
      price: price,
      share: share,
      fee: fee,
      mount: mount
    })
  },
  reduce: function () {
    if (this.data.dates.length>1)
    {
      this.data.dates.pop();
      this.data.price.pop();
      this.data.share.pop();
      this.data.fee.pop();
      this.data.mount.pop();

      this.setData
      ({
        month_n: this.data.dates.length,
        dates: this.data.dates,
        price: this.data.price,
        share: this.data.share,
        fee: this.data.fee,
        mount: this.data.mount
      })
    }
    else
    {
      wx.showModal({
        title: '错误',
        content: '已经是最后一行了!',
      });
    }
  },
  formSubmit: function (e) {
    var out = e.detail.value;
    var a_date = new Array();
    var a_price = new Array();
    var a_switch = new Array();
    var a_share = new Array();
    var a_fee = new Array();
    var a_total = new Array();
    for (var p in out) {
      if (p.indexOf('date') != -1) {
        a_date.push(out[p]);
      }
      if (p.indexOf('price') != -1) {
        a_price.push(parseFloat(out[p]));
      }
      if (p.indexOf('switch') != -1) {
        a_switch.push(out[p]);
      }
      if (p.indexOf('share') != -1) {
        a_share.push(parseFloat(out[p]));
      }
      if (p.indexOf('fee') != -1) {
        a_fee.push(parseFloat(out[p]));
      }
      if (p.indexOf('total') != -1) {
        a_total.push(parseFloat(out[p]));
      }
    }

    var history = [{
      date: a_date,
      buy: a_switch,
      price: a_price,
      share: a_share,
      fee: a_fee,
      mount: a_total
    }];
    var found = wx.getStorageSync('FOUNDS');

    for (var i = 0; i < found.length; ++i)
    {
      if ((this.data.code) == (found[i].code))
      {
        var every_unit;
        if (found[i].unit)
        {
          every_unit = found[i].unit;
        }
        else
        {
          every_unit = this.data.default_setting.unit;
        }
        if(found[i].next_unit)
        {
          for (var j = 0; j < history[0].buy.length; ++j)
          {
            if (history[0].buy.length)
            {
              found[i].next_unit += every_unit;
            }
          }
        }
        if (found[i].date == undefined)
        {
          found[i].date = (history[0].date);
          found[i].buy = (history[0].buy);
          found[i].price = (history[0].price);
          found[i].share = (history[0].share);
          found[i].fee = (history[0].fee);
          found[i].mount = (history[0].mount);
        }
        else
        {
          found[i].date = found[i].date.concat(history[0].date);
          found[i].buy = found[i].buy.concat(history[0].buy);
          found[i].price = found[i].price.concat(history[0].price);
          found[i].share = found[i].share.concat(history[0].share);
          found[i].fee = found[i].fee.concat(history[0].fee);
          found[i].mount = found[i].mount.concat(history[0].mount);
        }
      }
    }
    // console.log('found ', found);
    
    wx.setStorageSync("FOUNDS", found);
    wx.showToast({
      title: '添加成功',
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
  },
  autoChange: function (e) {
    this.setData({ is_auto: e.detail.value })
  },
})