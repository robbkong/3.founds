var util = require('../../utils/moment.js')
Page({
  data: {
    list: [
      {
        id: 'dingtou',
        name: '定投中',
        open: false,
        pages: [
        ]
      }, {
        id: 'wangge',
        name: '网格交易中',
        open: false,
        pages: [
        ]
      }, {
        id: 'zhuang',
        name: '装死模式',
        open: false,
        pages: [
        ]
      }
    ],
    //股票数目
    num_found:0,
    input: 0,
    output: 0,
    value: 0, // 市直
    rate: 0,  // 收益率
    share:[],

    // 从网络获取价格
    price:[],

    // 定投提醒
    is_today: false,
    default_setting:{},
    next_day:"",  // 下个定投日
    diff:0,   // 距离下个定投日的间隔日期

    // 定投计算
    found:[],
    way:[],
    unit:[],

    // 定投计算 显示
    cal_share:[],
    fact_share:[],
    fact_value:[],

    // 定投试算
    showed: false,

    // 没有进行定投设置
    no_default: true,

    test:"",
  },

  // 标签折叠（定投中等等……）
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) 
    {
      if (list[i].id == id) 
      {
        if (list[i].url) 
        {
          wx.navigateTo({
            url: 'pages/' + list[i].url
          })
          return
        }
        list[i].open = !list[i].open
      } else 
      {
        list[i].open = false
      }
    }
    this.setData({list: list});
  },

  // 定投试算
  showed:function(e)
  {
    this.setData({showed: e.detail.value});
  },

  // 通过价格和份额来获取总金额：price*share + fee
  getmount: function(price,share,i)
  {
    var total = price * share;
    var fee, least;
    if(this.data.found[i].fee)
    {
      fee = this.data.found[i].fee;
      least = this.data.found[i].least;
    }
    else
    {
      fee = this.data.default_setting.fee;
      least = this.data.default_setting.least;
    }
    var fee = parseFloat(total * fee) / 10000;
    if (fee < least) {
      fee = least;
    }
    var mount = fee + total;
    return mount.toFixed(2);
  },

  // 获取了当前价格之后的操作
  donext: function ()
  {
    // 计算市值
    for (let i = 0; i < this.data.price.length; ++i)
    {
      if (this.data.share[i])
      {
        this.data.value += this.data.price[i] * this.data.share[i];
      }
    }
    this.data.rate = parseFloat((this.data.value + this.data.output) / this.data.input - 1)*100;
    this.data.rate = this.data.rate.toFixed(2);

    // 定投计算
    var len = this.data.way.length;
    // console.log('len', len);
    var cal_share = new Array(len);
    var fact_share = new Array(len);
    var fact_value = new Array(len);
    for (let i = 0; i < len; ++i)
    {
      switch(this.data.way[i])
      {
        // 等市值
        case 0:
          var shizhi = this.data.price[i] * this.data.share[i];
          if(isNaN(shizhi))
          {
            shizhi = 0;
          }
          cal_share[i] = (this.data.found[i].next_unit - shizhi) / this.data.price[i];
          cal_share[i] = cal_share[i].toFixed(2);
          fact_share[i] = (cal_share[i] / 100);
          fact_share[i] = (Math.round(fact_share[i]) * 100);
          fact_value[i] = this.getmount(this.data.price[i],fact_share[i],i);
          break;
        // 等金额
        case 1:
          cal_share[i] = parseInt(this.data.unit[i] / this.data.price[i]);
          fact_share[i] = (cal_share[i]/100);
          fact_share[i] = fact_share[i].toFixed(2) * 100;
          fact_value[i] = this.getmount(this.data.price[i], fact_share[i], i);
          break;
        // 等份额
        case 2:
          cal_share[i] = this.data.unit[i];
          fact_share[i] = this.data.unit[i];
          fact_value[i] = this.getmount(this.data.price[i], fact_share[i], i);
          break;
      }
    }
    //console.log('fact_value', fact_value);

    // 用于显示定投计算的价格
    this.setData
    ({ 
      price: this.data.price, 
      cal_share: cal_share, 
      fact_share: fact_share, 
      fact_value: fact_value
    });

    this.data.price = [];
    this.setData
    ({
      value: this.data.value,
      rate: this.data.rate,
    });
  },

  // 获取基金的价格
  getprice:function(code,len)
  {
    // 从网站获取名字和价格
    var that = this;
    var strs = new Array();
    var price = 0;
    wx.request({
      url: 'https://hq.sinajs.cn/list=sz'+code, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.length > 25) {
          strs = res.data.split(","); //字符分割  
          price = parseFloat(strs[3]);
          
          if (that.data.price.length)
          {
            that.data.price = that.data.price.concat(price);
          }
          else
          {
            that.data.price[0] = price;
          }
          // 最后一个元素时，进行显示
          if ((that.data.price.length) == len)
          {
            that.donext();
          }
        }
        else
        {
          wx.request({
            url: 'https://hq.sinajs.cn/list=sh' + code, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (res.data.length > 25) {
                strs = res.data.split(","); //字符分割  
                price = parseFloat(strs[3]);

                if (that.data.price.length) {
                  that.data.price = that.data.price.concat(price);
                }
                else {
                  that.data.price[0] = price;
                }
                if ((that.data.price.length) == len) {
                  that.donext();
                }
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    // 获取定投的股票数目
    var found = wx.getStorageSync('FOUNDS');
    var default_setting = wx.getStorageSync('DEFAULT');

    // 计算分组
    var groups = new Array(3);
    for (var i = 0; i < found.length; ++i) 
    {
      // groups[found[i].group] 
    }


    var groups_g = wx.getStorageSync('GROUPS');
    if ((groups_g)) {
      if (groups_g[group] == null) {
        groups_g[group] = groups[group];
      }
      else {
        groups_g[group] = groups[group].concat(groups_g[group]);
      }
    } else {
      groups_g = groups;
    }

    // 分组
    var groups_g = wx.getStorageSync('GROUPS');
    var list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) 
    {
      list[i].pages = groups_g[i];
    }

    // 没有进行定投设置
    //console.log('default_setting', default_setting);
    if (default_setting) {
      this.data.no_default = false;
      //console.log('undefined', 0);
    }
    else {
      this.data.no_default = true;
      //console.log('defined', 0);
    }

    // 获取总的投入量和支取量
    var len = found.length;
    var way = new Array(len);
    var unit = new Array(len);
    for (var i = 0; i < len; ++i) 
    {
      if (found[i].input)
      {
        this.data.input += parseFloat(found[i].input);
      }
      if (found[i].output)
      {
        this.data.output += parseFloat(found[i].output);
      }
      if (found[i].share)
      {
        if (this.data.share.length) {
          this.data.share = this.data.share.concat(parseFloat(found[i].share));
        }
        else {
          this.data.share[0] = parseFloat(found[i].share);
        }
      }
      // 定投计算
      {
        // 定投方式
        if (found[i].way)
        {
          way[i] = found[i].way;
        }
        else
        {
          way[i] = default_setting.way;
        }
        // 定投金额
        if(found[i].unit)
        {
          unit[i] = found[i].unit;
        }
        else
        {
          unit[i] = default_setting.unit;
        }
      }
      var price = this.getprice(found[i].code,len);
    }

    // 定投日期提醒
    {
      this.data.default_setting = default_setting;

      // 获取当前时间
      var now = util.getNowFormatDate();
      var date = new Date();
      var diff = ((default_setting.day + 1) + 7 - date.getDay()) % 7;

      // 计算下一个定投日
      var month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var next_day,diff;
      switch (default_setting.cycle)
      {
        // 每天
        case 0: diff = 0; next_day = now; break;
        // 每周
        case 1: diff = ((default_setting.day + 1) + 7 - date.getDay()) % 7;
          next_day = util.add_day(now, diff);break;
        // 每月
        case 2: 
          if (default_setting.day > date.getDate())
          {
            diff = default_setting.day - date.getDate();
          }
          else
          {
            diff = default_setting.day + 1 + (month_day[date.getMonth()] - date.getDate())
          }
          next_day = util.add_day(now, diff); break;
        default: diff = ((default_setting.day + 1) + 7 - date.getDay()) % 7;
          next_day = util.add_day(now, diff); break;
      }
      var showed = false;
      if(diff == 0)
      {
        var showed = true;
      }
    }

    this.setData({
      list: list,
      num_found: found.length,
      input: this.data.input,
      output: this.data.output,
      diff: diff,
      next_day: next_day,
      found: found,
      way: way,
      unit: unit,
      showed: showed,
      no_default: this.data.no_default,
    });
  },
  default_setting:function(){
    var default_setting = {
      way: 0,
      cycle: 1,
      unit: 500,
      day: 0,
      ying: 1000,
      range: 10,
      outornot: 0,
      fee: 3,
      least: 0.1
    };

    var that = this;
    wx.setStorageSync("DEFAULT", default_setting);
    wx.showToast({
      title: '默认设置成功',
      icon: 'success',
      duration: 1000,
      complete: function () {
        that.onLoad();
      }
    });
  },
  go_setting:function(){
    setTimeout(() => {
      wx.navigateTo({
        url: '../default_setting/default_setting'
      })
    }, 500);
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
    this.onLoad();
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

  }
})
