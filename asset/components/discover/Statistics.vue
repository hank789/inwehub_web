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

    <div class="item" :class="{active:isCollected}" @tap.stop.prevent="collect()">
      <div class="iconWrapper showcangWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoucangxingxing"></use>
        </svg>
      </div>
      <span>{{ collectNum }}</span>
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

  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {}
    },
    components: {},
    props: {
      commentNum: {
        type: Number,
        default: 0
      },
      id: {
        type: Number,
        default: 0
      },
      supportNum: {
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
      }
    },
    created () {
    },
    methods: {
      collect () {
        var data = {
          id: this.id
        }

        postRequest(`article/bookmark-submission`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (this.isCollected) {
            this.$emit('collectNumDesc')
          } else {
            this.$emit('collectNumAdd')
          }

          this.$emit('setCollectStatus', response.data.data.type)

          window.mui.toast(response.data.message)
        })
      },
      support () {
        var data = {
          submission_id: this.id
        }

        postRequest(`article/upvote-submission`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (this.isSupported) {
            this.$emit('supportNumDesc')
          } else {
            this.$emit('supportNumAdd')
          }

          this.$emit('setSupportStatus', response.data.data.type)

          window.mui.toast(response.data.message)
        })
      }
    }
  }
</script>

<style scoped="scoped">

  .item {
    line-height: 20px;
    color: #b4b4b6;
  }

  .item span {
    font-size: 14px;
    position: relative;
    top: -3px;
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

  .item.active .iconWrapper {
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

  .item:nth-child(2) .iconWrapper.showcangWrapper .icon {
    position: relative;
    top: -1px;
  }

  .item:nth-child(3) .iconWrapper {
    font-size: 18px;
  }

  .modifyWrapper {
    font-size: 16px !important;
  }

  .modifyWrapper .icon {
    position: relative;
    top: 0px;
  }

  .statistics {
    padding: 20px 0 10px 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .dianzanWrapper .icon {
    position: relative;
    top: -1px;
  }

  .active {
    color: #03aef9;
  }
</style>
