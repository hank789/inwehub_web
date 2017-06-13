<template>
  <div id="pay_content">
    <!--<div id="wxpay" class="mui-btn mui-btn-block mui-btn-primary" v-if="wechatPay === '1'" @tap.stop.prevent="pay('wxpay')">微信支付</div>-->
    <!--<div id="alipay" class="mui-btn mui-btn-block mui-btn-primary" v-if="aliPay === '1'"  @tap.stop.prevent="pay('alipay')">支付宝支付</div>-->
    <div id="appleiap" class="mui-btn mui-btn-block mui-btn-primary" v-if="iapPay === '1'" @tap.stop.prevent="pay('appleiap')">确认支付</div>
  </div>
</template>

<script>
  import {apiRequest} from '../../utils/request';

  export default{
    data(){
      return{
        pays:{},
        pay_waiting: null,
        wechatPay:false,
        aliPay:false,
        iapPay:false
      }
    },
    props: ['pay_object_type','pay_money'],
    components:{
    },
    created () {
      apiRequest(`pay/config`,{}).then(response_data => {
        if (response_data === false) {
          return;
        }
        this.wechatPay = response_data.pay_method_weixin;
        this.aliPay = response_data.pay_method_ali;
        this.iapPay = '0';
        if (mui.os.ios) {
          this.iapPay = response_data.pay_method_iap;
        }
      });
    },
    methods: {
      pay(id){

          if (!mui.os.plus) {
              mui.alert('仅支持app');
              return;
          }

          if(this.pay_waiting){return;}//检查是否请求订单中

          var amount = this.pay_money;
          if (amount <= 0) {
            plus.nativeUI.alert('支付金额有误！', null, '支付');
            return;
          }
          // ('----- 请求支付 -----');
          if(id=='alipay'||id=='wxpay'||id=='appleiap'){

          }else{
            plus.nativeUI.alert('当前环境不支持此支付通道！', null, '支付');
            return;
          }
          var appid=plus.runtime.appid;
          if(navigator.userAgent.indexOf('StreamApp')>=0){
            appid='Stream';
          }
          this.pay_waiting=plus.nativeUI.showWaiting();
          // 请求支付订单
          apiRequest(`pay/request`,{app_id: appid, amount: amount, pay_channel: id, pay_object_type: this.pay_object_type}).then(response_data => {
            this.pay_waiting.close();
            this.pay_waiting=null;
            if (response_data !== false){
              var is_debug = response_data.debug;
              console.log(response_data.order_id);
              // 如果是1，则表示绕过支付
              if(is_debug === 1){
                this.$emit('pay_success', response_data.order_id, this.pay_object_type);
                plus.nativeUI.alert('支付成功！',function(){
                },'支付');
              } else {
                if (id==='appleiap') {
                  plus.nativeUI.alert(JSON.stringify(response_data),function(){
                  },'支付');
                  this.requestIapOrder(response_data);
                }else {
                  this.requestPay(id,response_data);
                }
              }
            }
          });
        },
      requestPay(id,response_data) {
        var order = response_data.order_info;
        plus.payment.request(this.pays[id],order,(result) => {
          // console.log(JSON.stringify(result));
          if (id === 'appleiap') {
            // 验证iap支付结果
            apiRequest(`pay/iap_notify`,{orderId: response_data.order_id, result}).then(response_data => {
              this.pay_waiting.close();
              this.pay_waiting=null;
              if (response_data !== false){
                this.$emit('pay_success', response_data.order_id, this.pay_object_type);
                plus.nativeUI.alert('支付成功！',function(){
                },'支付');
              }
            });
          } else {
            this.$emit('pay_success', response_data.order_id, this.pay_object_type);
            plus.nativeUI.alert('支付成功！',function(){
            },'支付');
          }
        },function(e){
          if (e.code == -100){
            plus.nativeUI.alert('', null, '支付已取消');
          }else {
            plus.nativeUI.alert('请联系客服', null, '支付失败');
          }
        });
      },
      requestIapOrder(response_data) {
        this.pay_waiting=plus.nativeUI.showWaiting();
        this.pays['appleiap'].requestOrder(response_data.ids,(e)=>{
          console.log('requestOrder success: '+JSON.stringify(e));
          plus.nativeUI.alert(JSON.stringify(e),function(){
          },'支付');

          this.requestPay('appleiap',response_data);
        },(e)=>{
          console.log('requestOrder failed: '+JSON.stringify(e));
          this.pay_waiting.close();
          this.pay_waiting=null;
          plus.nativeUI.confirm("错误信息："+JSON.stringify(e), (e) => {
            if(e.index==0){
              this.requestIapOrder(response_data.ids);
            }else{

            }
          }, '重新请求支付',['确定','取消']);
        });
      }
    },
    mounted() {
      if (mui.os.plus) {
        mui.plusReady(() => {
          // 获取支付通道
          plus.payment.getChannels((channels) => {
            for (var i in channels) {
              var channel = channels[i];
              if (channel.id == 'qhpay' || channel.id == 'qihoo') {	// 过滤掉不支持的支付通道：暂不支持360相关支付
                continue;
              }
              this.pays[channel.id] = channel;
              //document.getElementById(channel.id).style.display = "block";
              checkServices(channel);
            }
          }, function (e) {
            mui.toast('获取支付通道失败：' + e.message);
          });
        });
      }

      // 检测是否安装支付服务
      function checkServices(pc){
        if(!pc.serviceReady){
          var txt=null;
          switch(pc.id){
            case 'alipay':
              txt='检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？';
              break;
            default:
              txt='系统未安装“'+pc.description+'”服务，无法完成支付，是否立即安装？';
              break;
          }
          plus.nativeUI.confirm(txt, function(e){
            if(e.index==0){
              pc.installService();
            }
          }, pc.description);
        }
      }
    }
  }
</script>
