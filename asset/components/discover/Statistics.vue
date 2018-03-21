<template>
  <div class="statistics">
    <div class="item" :class="{active:isCommented}">
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
      isCommented: {
        type: Boolean,
        default: true
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
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:bookmark:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': this.isCollected ? 'cancel' : 'bookmark',
                'referrer_page': ''
              }
            )
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

          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:support:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': this.isCollected ? 'cancel' : 'support',
                'referrer_page': ''
              }
            )
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
    line-height: 0.533rem;
    color: #b4b4b6;
  }

  .item span {
    font-size: 0.373rem;
    position: relative;
    top: -0.08rem;
  }

  .item .iconWrapper {
    display: inline-block;
    border: 0.026rem solid #dcdcdc;
    width: 1.12rem;
    height: 1.12rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1.12rem;
    font-size: 0.64rem;

  }

  .item.active .iconWrapper {
    border: 0.026rem solid #03aef9;
  }

  .item:nth-child(1) .iconWrapper {
    font-size: 0.533rem;
  }

  .item:nth-child(2) .iconWrapper {
    font-size: 0.64rem;
  }

  .item:nth-child(2) .iconWrapper.showcangWrapper {
    font-size: 0.48rem;
  }

  .item:nth-child(2) .iconWrapper.showcangWrapper .icon {
    position: relative;
    top: -0.026rem;
  }

  .item:nth-child(3) .iconWrapper {
    font-size: 0.48rem;
  }

  .modifyWrapper {
    font-size: 0.426rem !important;
  }

  .modifyWrapper .icon {
    position: relative;
    top: 0rem;
  }

  .statistics {
    padding: 0.533rem 0 0.266rem 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .dianzanWrapper .icon {
    position: relative;
    top: -0.026rem;
  }

  .active {
    color: #03aef9;
  }
</style>
