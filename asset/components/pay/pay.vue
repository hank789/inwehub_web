<template>
  <div>
    <div id="sheet1" class="mui-popover mui-popover-bottom mui-popover-action ">
      <div class="selectMoney">
        <div class="title">您若问的用心，我将答的精彩</div>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <div class="mui-input-row">
              <div @tap.stop.prevent="selectPayItems" class="mui-navigate-right" :class="{noRightArrow: payItems.length === 1}"><label>付费选项</label><label
                class="mui-pull-right account-setting-field">{{ getSelectMoneyMethod }}</label></div>
            </div>
          </li>
          <li class="mui-table-view-cell">
            <div class="mui-input-row">
              <div><label>支付金额</label><label
                class="mui-pull-right account-setting-field">¥ {{pay_money}}.00</label></div>
            </div>
          </li>
          <li class="mui-table-view-cell padding-left-6">
            <!--<div class="mui-input-row">-->
            <!--<div><label>支付方式</label><label-->
            <!--class="mui-pull-right account-setting-field apple-icon ">-->
            <!--<svg class="icon mui-icon" aria-hidden="true">-->
            <!--<use :xlink:href="getMethodIcon()"></use>-->
            <!--</svg>-->
            <!--</label></div>-->
            <!--</div>-->
            <div class="pay-choice">支付方式</div>
            <div class="pay-swallet" v-if="userTotalMoney > 0" @tap.stop.prevent="selectPayMethod('wallet')"><p><i v-show="useWalletPay"></i></p>钱包支付（{{useWalletPayDesc}}）</div>
            <div class="pay-ios" :class="{active: payMethod === 'appleiap' && !useWalletPay}" v-show="getSupportPayMethods() === 'apple'" @tap.stop.prevent="selectPayMethod('appleiap')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-apple"></use>
              </svg>
              苹果支付
            </div>
            <div class="pay-weChat" :class="{active: payMethod === 'wx_pub' && !useWalletPay}" v-show="getSupportPayMethods() === 'wechat-public'" @tap.stop.prevent="selectPayMethod('wx_pub')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wechat"></use>
              </svg>
              微信支付
            </div>
            <div class="pay-weChat" :class="{active: payMethod === 'wxpay' && !useWalletPay}" v-show="getSupportPayMethods() === 'wechat'" @tap.stop.prevent="selectPayMethod('wxpay')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wechat"></use>
              </svg>
              微信支付
            </div>
          </li>
        </ul>
        <div class="button-wrapper">
          <div id="pay_content">
            <div id="appleiap" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="payConfirmCheck()">
              {{ btnText ? btnText : '确认支付'}}
    </div>
          </div>
        </div>
      </div>
    </div>

    <div id="expert" class="mui-popover mui-popover-action mui-popover-bottom">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell" v-for="(item, index) in payItems">
          <a @tap.stop.prevent="selectMoney(item.value)">{{ item.text }}</a>
        </li>
      </ul>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="selectMoney()"><b>取消</b></a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import { apiRequest } from '../../utils/request'
  import Raven from 'raven-js'

  export default{
    data () {
      return {
        pays: {},
        pay_waiting: null,
        wechatPay: false,
        aliPay: false,
        iapPay: false,
        userTotalMoney: null,  // 用户金额
        payMethod: null, // 支付方式
        useWalletPay: 0 // 是否使用余额支付，0不使用余额支付，1使用余额支付，默认0
      }
    },
    props: [
      'payItems',
      'pay_object_type',
      'pay_object_id',
      'pay_money',
      'btnText'
    ],
    components: {},
    created () {
      this.getPayConfig(() => {})
    },
    computed: {
      useWalletPayDesc () {
        var desc = '余额' + this.userTotalMoney + '元'
        if (this.userTotalMoney < this.pay_money) {
          desc += ', 剩余还需支付' + (parseFloat(this.pay_money - this.userTotalMoney).toFixed(2)) + '元'
        }
        return desc
      },
      getSelectMoneyMethod () {
        for (var i in this.payItems) {
          var item = this.payItems[i]
          if (this.pay_money === item.value) {
            return item.text.replace(/（.*?）/, '')
          }
        }
      }
    },
    methods: {
      getPayConfig (callback) {
        apiRequest(`pay/config`, {}).then(responseData => {
          if (responseData === false) {
            return
          }
          this.wechatPay = responseData.pay_method_weixin
          this.aliPay = responseData.pay_method_ali
          this.iapPay = responseData.pay_method_iap
          this.userTotalMoney = responseData.user_total_money

          if (callback) {
            callback()
          }
        })
      },
      getSupportPayMethods () {
        if (window.mui.os.plus) {
          if (window.mui.os.ios) {
            return 'apple'
          } else {
            return 'wechat'
          }
        }
        return 'wechat-public'
      },
      selectPayMethod (method) {
        switch (method) {
          case 'wallet':
            if (this.userTotalMoney >= this.pay_money) {
              this.payMethod = this.getPayChannel()
            } else {
              if (window.mui.os.plus) {
                this.payMethod = 'wxapp'
              } else {
                this.payMethod = 'wx_pub'
              }
            }
            this.useWalletPay = 1
            break
          default:
            this.payMethod = method
            this.useWalletPay = 0
        }
      },
      selectMoney (money) {
        if (money) {
          this.$emit('payMoneyChange', money)
        }
        window.mui('#expert').popover('toggle')
        this.showSelectMoney()
      },
      selectPayItems () {
        if (this.payItems.length === 1) return

        if (window.mui.os.plus) {
          var options = []
          window.mui.each(this.payItems, function (index, item) {
            options.push({
              title: item.text
            })
          })

          var a = options
          window.plus.nativeUI.actionSheet({
            cancel: '取消',
            buttons: a
          }, (b) => {
            var vIndex = b.index - 1

            if (this.payItems[vIndex]) {
              var money = this.payItems[vIndex].value
              this.$emit('payMoneyChange', money)
            }
          })
        } else {
          window.mui('#expert').popover('toggle')
        }
      },
      showSelectMoney () {
        this.getPayConfig(() => {
          this.setPayMethod()
          window.mui('#sheet1').popover('toggle')
        })
      },
      getAppId () {
        var appid = ''
        if (window.mui.os.plus) {
          appid = window.plus.runtime.appid
        } else {
//          if (amount > 0 && typeof WeixinJSBridge === 'undefined') {
//            window.mui('#sheet1').popover('toggle')
//            window.mui.alert('目前仅支持微信公众号支付，请前往微信公众号访问！')
//            return
//          }
          appid = navigator.userAgent
        }
        return appid
      },
      checkEnv () {
//        if (typeof WeixinJSBridge === 'undefined') {
//          window.mui('#sheet1').popover('toggle')
//          window.mui.alert('目前仅支持微信公众号支付，请前往微信公众号访问！')
//          return false
//        }

        // 小程序支付
        if (window.__wxjs_environment === 'miniprogram') {
          window.mui.confirm('小程序目前不支持微信支付，请点击下载App访问！', '提示', ['下次再说', '前往下载'], (e) => {
            if (e.index === 1) {
              window.location.href = 'https://adsolj.mlinks.cc/' + process.env.DEEP_LINK_KEY
            }
          })
          return false
        }

        return true
      },
      setPayMethod () {
        if (!this.payMethod) {
          if (this.userTotalMoney > 0) {
            if (this.userTotalMoney >= this.pay_money) {
              this.payMethod = this.getPayChannel()
            } else {
              if (window.mui.os.plus) {
                this.payMethod = 'wxapp'
              } else {
                this.payMethod = 'wx_pub'
              }
            }
            this.useWalletPay = 1
          } else {
            this.payMethod = this.getPayChannel()
            this.useWalletPay = 0
          }
        }
      },
      payConfirmCheck () { // 支付前检查
        if (this.useWalletPay) {
          if (this.userTotalMoney >= this.pay_money) {
            document.getElementById('sheet1').style.zIndex = 998
            window.mui.alert('将使用您账户余额' + this.userTotalMoney + '元中的' + this.pay_money + '元进行支付，点击确定进行支付。', null, '确定', () => {
              document.getElementById('sheet1').style.zIndex = 999
              this.pay()
            }, 'div')
          } else if (this.userTotalMoney < this.pay_money) {
            document.getElementById('sheet1').style.zIndex = 998
            var differ = parseFloat(this.pay_money - this.userTotalMoney).toFixed(2)
            window.mui.alert('您的账户余额' + this.userTotalMoney + '元不够支付金额，点击确定将使用微信支付剩余' + differ + '元。', null, '确定', () => {
              document.getElementById('sheet1').style.zIndex = 999
              this.pay()
            }, 'div')
          }
        } else {
          this.pay()
        }
      },
      getPayChannel () {
        var id = ''
        if (window.mui.os.plus) {
          if (window.mui.os.ios && this.iapPay) {
            id = 'appleiap'
          } else {
            id = 'wxpay'
          }
        } else {
          id = 'wx_pub'
        }

        return id
      },
      pay () {
        console.log('pay() fired')
        if (this.pay_waiting) {
          console.log('pay_waiting is true')
          return
        }

        var checkResult = this.checkEnv()
        if (!checkResult) {
          console.log('支付环境不允许提交支付')
          return
        }

        var amount = this.pay_money
        if (amount <= 0 && this.pay_object_type !== 'free_ask') {
          window.mui.toast('支付金额有误！')
          return
        }

        if (!this.payMethod) {
          window.mui.toast('请选择支付方式！')
          return
        }

        this.pay_waiting = 'waiting'
        var payChannel = this.payMethod
        // 请求支付订单
        apiRequest(`pay/request`, {
          app_id: this.getAppId(),
          amount: amount,
          pay_channel: payChannel,
          pay_object_type: this.pay_object_type,
          pay_object_id: this.pay_object_id,
          use_wallet_pay: this.useWalletPay
        }, true).then(responseData => {
          if (responseData !== false) {
            window.mui('#sheet1').popover('hide')

            var isDebug = responseData.debug
            // 如果是1，则表示绕过支付
            if (isDebug === 1) {
              this.pay_waiting = null
              this.$emit('pay_success', responseData.order_id, this.pay_object_type)
            } else {
              if (payChannel === 'appleiap') {
                this.requestIapOrder(responseData)
              } else if (payChannel === 'wx_pub') {
                var wxOrderInfo = JSON.parse(responseData.order_info)
                // h5微信支付
                window.WeixinJSBridge.invoke(
                  'getBrandWCPayRequest', wxOrderInfo,
                  (res) => {
                    this.pay_waiting = null
                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
                      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                      this.$emit('pay_success', responseData.order_id, this.pay_object_type)
                    } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                      window.mui.alert('您已取消支付！')
                    } else {
                      window.mui.alert('支付失败，请稍后再试！')
                    }
                  }
                )
              } else if (payChannel === 'wx_lite') {
                // 微信小程序支付
                window.wx.requestPayment({
                  'timeStamp': responseData.order_info.timeStamp,
                  'nonceStr': responseData.order_info.nonceStr,
                  'package': responseData.order_info.package,
                  'signType': responseData.order_info.signType,
                  'paySign': responseData.order_info.paySign,
                  'success': (res) => {
                    this.pay_waiting = null
                    if (res.errMsg === 'requestPayment:ok') {
                      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                      this.$emit('pay_success', responseData.order_id, this.pay_object_type)
                    } else if (res.errMsg === 'requestPayment:fail cancel') {
                      window.mui.alert('您已取消支付！')
                    } else {
                      window.alert(JSON.stringify(res))
                      window.mui.alert('支付失败，请稍后再试！')
                    }
                  },
                  'fail': (res) => {
                    window.alert(JSON.stringify(res))
                    window.mui.alert('支付失败，请稍后再试！')
                  }}
                )
              } else {
                this.requestPay(payChannel, responseData)
              }
            }
          } else {
            if (payChannel === 'appleiap') {
              window.mui.closeWaiting()
            }
            this.pay_waiting = null
          }
        })
      },
      requestPay (id, responseData) {
        var order = responseData.order_info
        window.mui.waiting()
        window.plus.payment.request(this.pays[id], order, (result) => {
          // console.log(JSON.stringify(result));
          if (id === 'appleiap') {
            // 验证iap支付结果
            apiRequest(`pay/iap_notify`, {
              orderId: responseData.order_id,
              transactionState: result.transactionState,
              payment: result.payment,
              transactionDate: result.transactionDate,
              transactionReceipt: result.transactionReceipt,
              transactionIdentifier: result.transactionIdentifier
            }, false).then(responseDataNotify => {
              window.mui.closeWaiting()
              this.pay_waiting = null
              if (responseDataNotify !== false) {
                this.$emit('pay_success', responseData.order_id, this.pay_object_type)
                window.plus.nativeUI.alert('支付成功！', function () {
                }, '支付')
              }
            })
          } else {
            window.mui.closeWaiting()
            this.pay_waiting = null
            this.$emit('pay_success', responseData.order_id, this.pay_object_type)
            window.plus.nativeUI.alert('支付成功！', function () {
            }, '支付')
          }
        }, (e) => {
          window.mui.closeWaiting()
          this.pay_waiting = null
          if (e.code === -100) {
            window.plus.nativeUI.alert('', null, '支付已取消')
          } else {
            Raven.captureException(JSON.stringify(e))
            window.plus.nativeUI.alert('请联系客服', null, '支付失败')
          }
        })
      },
      requestIapOrder (responseData) {
        this.pay_waiting = 'waiting'
        window.mui.waiting()

        this.pays['appleiap'].requestOrder(responseData.iap_ids, (e) => {
          console.log('requestOrder success: ' + JSON.stringify(e))
          window.mui.closeWaiting()
          this.requestPay('appleiap', responseData)
        }, (e) => {
          console.log('requestOrder failed: ' + JSON.stringify(e))
          window.mui.closeWaiting()
          this.pay_waiting = null
          Raven.captureException(JSON.stringify(e))
          window.plus.nativeUI.confirm('支付失败，请稍后再试', (e) => {
            if (e.index === 0) {
              this.requestIapOrder(responseData)
            } else {

            }
          }, '重新请求支付', ['确定', '取消'])
        })
      }
    },
    updated () {},
    mounted () {
      if (window.mui.os.plus) {
        window.mui.plusReady(() => {
          // 获取支付通道
          window.plus.payment.getChannels((channels) => {
            for (var i in channels) {
              var channel = channels[i]
              if (channel.id === 'qhpay' || channel.id === 'qihoo') { // 过滤掉不支持的支付通道：暂不支持360相关支付
                continue
              }
              this.pays[channel.id] = channel
            }
          }, function (e) {
            window.mui.toast('获取支付通道失败：' + e.message)
          })
        })
      }

      // 检测是否安装支付服务
//      function checkServices (pc) {
//        if (!pc.serviceReady) {
//          var txt = null;
//          switch (pc.id) {
//            case 'alipay':
//              txt = '检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？';
//              break;
//            default:
//              txt = '系统未安装“' + pc.description + '”服务，无法完成支付，是否立即安装？';
//              break;
//          }
//          plus.nativeUI.confirm(txt, function (e) {
//            if (e.index == 0) {
//              pc.installService();
//            }
//          }, pc.description);
//        }
//      }
    }
  }
</script>

<style scoped="scoped">
  /*支付方式样式*/
  .pay-choice{
    margin:0;
    text-align: left;
    font-size: 16px;
    color: #9b9b9b;
    padding-left: 5px;
  }
  .pay-swallet{
    margin:0;
    text-align: left;
    font-size: 14px;
    color: #808080;
    margin-top: 12px;
    padding-left: 5px;
  }
  .pay-swallet p{
    width:16px;
    height:16px;
    border-radius: 9px;
    border:1px solid #c8c8c8;
    float: left;
    margin-top: 1.3px;
    margin-right: 6px;
    position: relative;
  }
  .pay-swallet p i{
    width:6px;
    height:6px;
    border-radius: 9px;
    background:#03aef9;
    display: block;
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    margin:auto;
  }
  .pay-ios{
    margin:0;
    font-size: 14px;
    margin-top: 19px;
    width:167px;
    height:44px;
    border:1px solid #c8c7cc;
    border-radius: 4px;
    text-align: center;
    line-height: 44px;
    margin-left: 5px;
  }
  .pay-ios.active{
    color: #03aef9;
    border:1px solid #03aef9;
  }
  .pay-ios svg{
    color: #808080;
    font-size: 17px;
    margin-bottom: 1px;
    margin-right: -3px;
    padding-left: 5px;
  }
  .pay-weChat{
    margin:0;
    font-size: 14px;
    margin-top: 19px;
    width:167px;
    height:44px;
    border:1px solid #c8c7cc;
    border-radius: 4px;
    text-align: center;
    line-height: 44px;
    margin-left: 5px;
  }
  .pay-weChat.active{
    color: #03aef9;
    border:1px solid #03aef9;
  }

  .pay-weChat svg{
    color: #808080;
    font-size: 20px;
    margin-bottom: -1px;
    margin-right: -2px;
  }

  .selectMoney .title {
    padding: 22px 0;
    margin: 0 8px;
    text-align: center;
    position: relative;
  }

  .selectMoney .title:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .selectMoney .mui-table-view-cell {
    padding: 10px 0;
  }

  .selectMoney .mui-pull-right {
    float: right !important;
    padding-right: 35px;

    color: rgba(74, 144, 226, 100) !important;
    text-align: right;
  }

  .selectMoney .mui-icon {
    color: rgba(138, 138, 138, 100);
    opacity: 0.67;
    font-size: 24px;
  }

  .selectMoney .apple-icon {
    padding: 8px 35px 0 0;
  }

  .selectMoney {
    background: #fff;
  }



  .selectMoney .category span.active, .form-ask .select span.active {
    border: 1px solid #4990E2;
    color: #4990E2;
  }

  .selectMoney .category span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    width: 30%;
    display: inline-block;
    height: 32px;
    margin: 0 3px 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .selectMoney .help {
    margin: 30px 0;
  }

  .form-ask .select span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    padding: 0 10px;
    display: inline-block;
    height: 32px;
    margin-right: 6px;
    margin-bottom: 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .selectMoney .category span input {
    display: inline-block;
    position: relative;
    border: none;
    height: 90%;
    margin-top: -4px;
    width: 90%;
    text-align: center;
  }

  .selectMoney {
    text-align: center;
    padding: 0 15px 15px 15px;
  }

  .selectMoney .payDesc {
    position: relative;
    font-size: 14px;
  }

  .selectMoney .payDesc {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    color: #999;
  }

  .selectMoney .button-wrapper {
    margin: 20px 0 10px;
    padding: 0 30px;
  }

  .selectMoney .payDesc .dash {
    position: relative;
    top: -4px;
    margin: 0 5px;
    display: inline-block;
    border-top: 1px solid #999;
    width: 45px;
  }

  .selectMoney .payDesc .mui-icon {
    margin-right: 5px;
  }


  .mui-popover .mui-table-view {
    background: none !important;
    margin-top: 0 !important;
    border-radius: 0 !important;
    color: rgba(155, 155, 155, 100) !important;
  }

  #expert.mui-popover .mui-table-view {
    background: #fff !important;
    border-radius: 5px !important;
    color: #4990E2 !important;
  }

  #expert.mui-popover .mui-table-view-cell {
    padding: 13px 15px;
  }


  .mui-popover .mui-table-view .mui-table-view-cell:last-child, .mui-popover .mui-table-view .mui-table-view-cell:last-child > a:not(.mui-btn) {
    border-radius: 0 !important;
  }

  .mui-table-view-cell:after {
    left: 0 !important;
  }

  .mui-input-row label {
    padding-left: 5px;
    text-align: left;
  }

  .noRightArrow:after{
    display: none;
  }
</style>
