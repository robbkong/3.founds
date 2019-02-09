// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:0,
    index:0,
    history:[],

    // 基金设置中的费率
    default_fee: 0,
    default_least: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 保存传入的参数
    var code = options.code;
    var index = options.index;

    // 获取history记录
    var historys = wx.getStorageSync('FOUNDS');
    //console.log('historys', historys);
    var history;
    for (var i = 0; i < historys.length; ++i) 
    {
      if ((code) == (historys[i].code)) 
      {
        //console.log('historys[i]', historys[i]);
        //history = this.data.historys[i];
        var temp = historys[i];
        //console.log('temp', temp.date[index]);

        history = {
          date: temp.date[index],
          buy: temp.buy[index],
          price: temp.price[index],
          share: temp.share[index],
          fee: temp.fee[index],
          mount: temp.mount[index]
        }
        //console.log('history', history);
      }
    }

    // 获取基金存储中的fee和min
    var founds = historys;
    //console.log('founds', founds);
    var is_default = 0;
    var default_fee = 0;
    var least = 0;
    if (founds) 
    {
      for (var i = 0; i < founds.length; ++i) {
        if (code == founds[i].code) {
          if (founds[i].is_default) {
            is_default = 1;
          }
          else {
            fee = founds[i].fee;
            least = founds[i].least;
          }
        }
      }
    }
    if (is_default) {
      var default_setting = wx.getStorageSync('DEFAULT');
      //console.log('default_setting', default_setting);
      default_fee = default_setting.fee;
      least = default_setting.least;
    }

    this.setData({
      code: code,
      index: index,
      history: history,
      default_fee: default_fee,
      default_least: least
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
  bindDateChange: function(e) {
    this.data.history.date = e.detail.value;

    this.setData({ history: this.data.history })
  },
  getfeemount:function(price, share) {
    // 价格* 份额
    var total = price * share;
    var fee = parseFloat(total * this.data.default_fee) / 10000;

    if (fee < this.data.default_least) {
      fee = this.data.default_least;
    }
    var mount = fee + total;
    fee = fee.toFixed(2);
    mount = mount.toFixed(2);
    this.data.history.fee = fee;
    this.data.history.mount = mount;
    this.setData({history:this.data.history})
  },
  priceChange: function (e) {
    if (this.data.history.share != 0) {
      this.getfeemount(parseFloat(e.detail.value), this.data.history.share);
    }
    this.data.history.price = parseFloat(e.detail.value)
    this.setData({ history: this.data.history })
  },
  shareChange: function (e) {
    if (this.data.history.price != 0) {
      this.getfeemount(this.data.history.price, parseFloat(e.detail.value));
    }
    this.data.history.share = parseFloat(e.detail.value)
    this.setData({ history: this.data.history })
  },
  feeChange: function (e) {
    var fee = parseFloat(e.detail.value);
    if ((this.data.history.price != 0) && (this.data.history.share != 0)) {
      this.data.history.mount = (this.data.history.share * this.data.history.price + fee);
      this.data.history.mount = this.data.history.mount.toFixed(2);
      // console.log('mount', this.data.history.mount);
    }
    this.data.history.fee = fee.toFixed(2);
    // console.log('history', this.data.history);
    this.setData({ history: this.data.history })
  }, 
  formSubmit: function (e) {
    var out = e.detail.value;

    // 获取history记录
    var historys = wx.getStorageSync('FOUNDS');
    for (var i = 0; i < historys.length; ++i) {
      if ((this.data.code) == (historys[i].code)) {
        var temp = historys[i];
        var index = this.data.index;

        temp.date[index] = out.date;
        temp.buy[index] = out.switch;
        temp.price[index] = parseFloat(out.price);
        temp.share[index] = parseFloat(out.share);
        temp.fee[index] = parseFloat(out.fee);
        temp.mount[index] = parseFloat(out.total);

        // console.log('temp', temp);
      }
    }

    wx.setStorageSync("FOUNDS", historys);
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
  del:function()
  {
    // 获取history记录
    var historys = wx.getStorageSync('FOUNDS');
    for (var i = 0; i < historys.length; ++i) {
      if ((this.data.code) == (historys[i].code)) {
        var temp = historys[i];
        var index = this.data.index;
        if(temp.date.length == 1)
        {
          historys.splice(i, 1)
        }
        else
        {
          temp.date.splice(index,1);
          temp.buy.splice(index, 1);
          temp.price.splice(index, 1);
          temp.share.splice(index, 1);
          temp.fee.splice(index, 1);
          temp.mount.splice(index, 1);
        }
      }
    }
    console.log('historys', historys);

    wx.setStorageSync("FOUNDS", historys);
    wx.showToast({
      title: '删除成功',
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