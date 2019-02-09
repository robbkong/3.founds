// pages/found/found.js
var util = require('../../utils/moment.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 基金代码
    code:0,
    group:0,
    // 从网站获取名称和价格
    name:"",
    price:0,
    // 其他基金没有存储的信息
    value:0,
    rate: 0,
    rate_year:0,
    // 基金
    found:[],
    // 历史记录
    date:[],
    buy:[],
    mount:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var found;
    var code = options.code;
    var group = options.group;
    var name;
    var strs = new Array();
    var price = 0;

    // 获取基金相关信息
    var total_share = 0;
    var value = 0;  // 市值 = share * price
    var input = 0;
    var output = 0;
    var rate = 0; // 绝对收益率 output + value / input
    var rate_year = 0;  // 年化收益率
    var a_total2 = new Array();

    var historys = wx.getStorageSync('FOUNDS');
    if ((historys)) {
      for (var i = 0; i < historys.length; ++i) {
        if ((code) == (historys[i].code)) 
        {
          name = historys[i].name;
          if (historys[i].buy)
          {
            for (var j = 0; j < historys[i].buy.length; ++j) {
              if (historys[i].buy[j]) {
                total_share += historys[i].share[j];
                input += historys[i].mount[j];
                a_total2.push(historys[i].mount[j]);
              }
              else {
                total_share -= historys[i].share[j];
                output += historys[i].mount[j];
                a_total2.push(historys[i].mount[j] * -1);
              }
            }
            this.setData({
              date: historys[i].date,
              buy: historys[i].buy,
              mount: historys[i].mount
            });
          }
        }
      }
    }
    found = [{
      code: code,
      total_share: total_share.toFixed(2),
      input: input.toFixed(2),
      output: output.toFixed(2)
    }]

    for (var i = 0; i < historys.length; ++i) 
    {
      if ((code) == (historys[i].code)) {
        historys[i].total_share = parseFloat(found[0].total_share);
        historys[i].input = parseFloat(found[0].input);
        historys[i].output = parseFloat(found[0].output);
      }
    }
    //console.log('historys ', historys);
    wx.setStorageSync("FOUNDS", historys);

    // 从网站获取名字和价格
    var that = this;
    var a_date = this.data.date;
    var now;
    wx.request({
      url: 'https://hq.sinajs.cn/list=sz' + code, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.length > 25) {
          strs = res.data.split(","); //字符分割  
          price = parseFloat(strs[3]);
          value = price * total_share;
          rate = ((output + value - input)/input)*100;
          rate = rate.toFixed(2);
          a_total2.push(value * -1);
          now = util.getNowFormatDate();
          a_date.push(now);
          rate_year = util.XIRR(a_total2, a_date)*100;
          rate_year = rate_year.toFixed(2);
          //console.log('rate_year', rate_year);

          that.setData({
            // name: strs[0].substring(strs[0].indexOf("=") + 2),
            price: parseFloat(strs[3]),
            value: value.toFixed(2),
            rate:rate,
            rate_year: rate_year
          });
        }
        else {
          wx.request({
            url: 'https://hq.sinajs.cn/list=sh' + code, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (res.data.length > 25) {
                // var query_clone = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
                strs = res.data.split(","); //字符分割  
                price = parseFloat(strs[3]);
                value = price * total_share;
                rate = ((output + value - input) / input) * 100;
                rate = rate.toFixed(2);
                a_total2.push(value * -1);
                now = util.getNowFormatDate();
                a_date.push(now);
                rate_year = util.XIRR(a_total2, a_date) * 100;
                rate_year = rate_year.toFixed(2);
                //console.log('rate_year', rate_year);

                that.setData({
                  // name: strs[0].substring(strs[0].indexOf("=") + 2),
                  price: parseFloat(strs[3]),
                  value: value,
                  rate: rate,
                  rate_year: rate_year
                });
              }
              else
              {
                wx.showModal({
                  title: '错误!',
                  content: '没有查找到该代码对应的价格',
                });
              }
            }
          })
        }
      },
    })
    this.setData({ 
      code: code,
      name: name,
      group: group,
      value: value,
      rate_year: rate_year,
      found: found
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
    var options = {
      code: this.data.code,
      group: this.data.group
    }
    this.setData({date:[]});
    this.onLoad(options);
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
  add_found: function () {
    setTimeout(() => {
      wx.navigateTo({
        url: '../add_found/add_found?code='+this.data.code
      })
    }, 500);
  },
  mod_found: function()
  {
    setTimeout(() => {
      wx.navigateTo({
        url: '../mod_found/mod_found?code=' + this.data.code
      })
    }, 500);
  }
})