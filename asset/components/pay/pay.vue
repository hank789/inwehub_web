<template>
  <div id="pay_content">
    <div id="appleiap" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="pay()">
      {{ btnText ? btnText : '确认支付'}}


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
        iapPay: false
      }
    },
    props: ['pay_object_type', 'pay_object_id', 'pay_money', 'btnText'],
    components: {},
    created () {
      apiRequest(`pay/config`, {}).then(responseData => {
        if (responseData === false) {
          return
        }
        this.wechatPay = responseData.pay_method_weixin
        this.aliPay = responseData.pay_method_ali
        this.iapPay = responseData.pay_method_iap
      })
    },
    methods: {
      pay () {
        if (this.pay_waiting) {
          return
        }

        var amount = this.pay_money
        if (amount <= 0 && this.pay_object_type !== 'free_ask') {
          window.mui.toast('支付金额有误！')
          return
        }

        var id = ''
        if (window.mui.os.ios && this.iapPay && window.mui.os.plus) {
          id = 'appleiap'
          window.mui.waiting()
        } else {
          id = 'wxpay'
        }

        this.pay_waiting = 'waiting'
        var appid = ''
        if (window.mui.os.plus) {
          appid = window.plus.runtime.appid
        } else {
          if (amount > 0 && typeof WeixinJSBridge === 'undefined') {
            window.mui('#sheet1').popover('toggle')
            window.mui.alert('目前仅支持微信公众号支付，请前往微信公众号访问！')
            return
          }
          appid = navigator.userAgent
          // 公众号支付
          id = 'wx_pub'
        }
        // 请求支付订单
        apiRequest(`pay/request`, {
          app_id: appid,
          amount: amount,
          pay_channel: id,
          pay_object_type: this.pay_object_type,
          pay_object_id: this.pay_object_id
        }, false).then(responseData => {
          if (responseData !== false) {
            var isDebug = responseData.debug
            // 如果是1，则表示绕过支付
            if (isDebug === 1) {
              this.pay_waiting = null
              if (id === 'appleiap') {
                window.mui.closeWaiting()
              }
              this.$emit('pay_success', responseData.order_id, this.pay_object_type)
            } else {
              if (id === 'appleiap') {
                window.mui.closeWaiting()
                this.requestIapOrder(responseData)
              } else if (id === 'wx_pub') {
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
              } else {
                this.requestPay(id, responseData)
              }
            }
          } else {
            if (id === 'appleiap') {
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
