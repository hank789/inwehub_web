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

    <div class="item" v-if="!showShoucang">
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gongkai"></use>
        </svg>
      </div>
      <span>{{ seeNum }}</span>
    </div>

    <div class="item" v-else>
      <div class="iconWrapper showcangWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoucangxingxing"></use>
        </svg>
      </div>
      <span>{{ seeNum }}</span>
    </div>

    <div class="item" :class="{active:isSupported}" @tap.stop.prevent="support()">
      <div class="iconWrapper">
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
      showShoucang:{
          type:Boolean,
          default:false
      }
    },
    created(){
    },
    methods: {
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
              this.supportNumLocal--;
          } else {
              this.$emit('supportNumAdd');
              this.supportNumLocal++;
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

  .statistics {
    padding: 20px 0 10px 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }


  .active{
    color:#03aef9;
  }
</style>
