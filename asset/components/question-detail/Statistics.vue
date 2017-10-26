<template>
  <div class="statistics">
    <div class="item">
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
        </svg>
      </div>

      <span>{{ commentNum }}</span>
    </div>


    <div class="item active" v-if="showModifyBtn" @tap.stop.prevent="modify()">
      <div class="iconWrapper modifyWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
      </div>
      <span>修改</span>
    </div>


    <div class="item" :class="{active:isCollected}" @tap.stop.prevent="collect()" v-else-if="showShoucang">
      <div class="iconWrapper showcangWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoucangxingxing"></use>
        </svg>
      </div>
      <span>{{ collectNum }}</span>
    </div>

    <div class="item" v-else>
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gongkai"></use>
        </svg>
      </div>
      <span>{{ seeNum }}</span>
    </div>



    <div class="item" :class="{active:isSupported}" @tap.stop.prevent="support()">
      <div class="iconWrapper dianzanWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg>
      </div>
      <span>{{ supportNum }}</span>
    </div>

  </div>
</template>

<script type="text/javascript">

  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  export default {
    data () {
      return {
      }
    },
    components: {},
    props: {
      commentNum: {
        type: Number,
        default: 0
      },
      questionId: {
        type: Number,
        default: 0
      },
      seeNum: {
        type: Number,
        default: 0
      },
      supportNum: {
        type: Number,
        default: 0
      },
      answerId: {
        type: Number,
        default: 0
      },
      isSupported: {
        type: Boolean,
        default: true
      },
      isCollected: {
        type: Boolean,
        default: true
      },
      collectNum: {
        type: Number,
        default: 0
      },
      showShoucang:{
          type:Boolean,
          default:false
      },
      showModifyBtn:{
        type:Boolean,
        default:false
      }
    },
    created(){
    },
    methods: {
      modify(){
         this.$router.pushPlus('/realAnswer/' + this.questionId+'/'+this.answerId, 'list-detail-page-realAnswer',true,'pop-in','hide',true);
      },
      collect(){
        var data = {
          id: this.answerId
        };

        postRequest(`collect/answer`, data).then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          if (this.isCollected) {
            this.$emit('collectNumDesc');
          } else {
            this.$emit('collectNumAdd');
          }

          this.$emit('setCollectStatus', response.data.data.type);

          mui.toast(response.data.data.tip);
        });
      },
      support(){

        var data = {
          id: this.answerId
        };

        postRequest(`support/answer`, data).then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          if (this.isSupported) {
              this.$emit('supportNumDesc');
          } else {
              this.$emit('supportNumAdd');
          }

          this.$emit('setSupportStatus', response.data.data.type);

          mui.toast(response.data.data.tip);
        });
      },
    },
  };
</script>

<style scoped="scoped">

  .item{
    line-height: 20px;
    color: #b4b4b6;
  }
  .item span {
    font-size: 14px;
    position: relative;
    top:-3px;
  }

  .item .iconWrapper {
    display: inline-block;
    border: 1px solid #dcdcdc;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    text-align: center;
    line-height: 42px;
    font-size: 24px;

  }
  .item.active .iconWrapper{
    border: 1px solid #03aef9;
  }

  .item:nth-child(1) .iconWrapper {
    font-size: 20px;
  }

  .item:nth-child(2) .iconWrapper {
    font-size: 24px;
  }

  .item:nth-child(2) .iconWrapper.showcangWrapper {
    font-size: 18px;
  }

  .item:nth-child(2) .iconWrapper.showcangWrapper .icon{
    position: relative;
    top:-1px;
  }

  .item:nth-child(3) .iconWrapper{
    font-size: 18px;
  }

  .modifyWrapper{
    font-size:16px !important;
  }

  .modifyWrapper .icon{
    position: relative;
    top:0px;
  }

  .statistics {
    padding: 20px 0 10px 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }


  .dianzanWrapper .icon{
    position: relative;
    top:-1px;
  }

  .active{
    color:#03aef9;
  }
</style>
