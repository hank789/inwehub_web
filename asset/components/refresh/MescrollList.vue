<template>
  <div class='mescrollListWrapper'>
    <div id='downloadTip' class='download-tip'>1条新内容</div>
    <mescroll-vue ref='mescroll' :down='config.down' :up='config.up' @init='mescrollInit'>
      <slot></slot>
    </mescroll-vue>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import 'mescroll.js/mescroll.min.css'
  import { postRequest } from '../../utils/request'

  export default {
    name: 'MescrollList',
    components: {
      MescrollVue
    },
    props: {
      api: {
        type: String,
        default: ''
      },
      prevOtherData: {
        type: Object,
        default: {}
      },
      nextOtherData: {
        type: Object,
        default: {}
      },
      autoShowEmpty: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        list: [],
        mescroll: null,
        response: null,
        config: {
          down: {
            offset: 60,
            htmlContent: '<p class="downwarp-progress"><p>',
            callback: this.downCallback
          },
          up: {
            callback: this.upCallback
          }
        },
        localPrevOtherData: this.prevOtherData
      }
    },
    methods: {
      refreshPageData () {

      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      downCallback (mescroll) {
        this.getData(0, 1, (data) => {
          mescroll.endSuccess()
          this.list = data
          document.querySelector('#downloadTip').style.top = '0px'
          setTimeout(() => {
            document.querySelector('#downloadTip').style.top = '-24px'
          }, 2000)
        }, () => {
          mescroll.endErr()
        })
      },
      upCallback (page, mescroll) {
        console.log('upcALLBACK')
        this.getData(page.num, page.size, (data) => {
          this.list = this.list.concat(data)
          mescroll.endSuccess(data.length)
        }, () => {
          mescroll.endErr()
        })
      },
      getData (pageNum, pageSize, successCallback, errorCallback) {
        try {
          var param = {}
          if (pageNum === 0) {
            param = Object.assign(param, this.localPrevOtherData)
          } else {
            param.page = pageNum
            param = Object.assign(param, this.nextOtherData)
          }
          console.log(param)
          postRequest(this.api, param, false).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            var list = response.data.data.data
            this.list = this.list.concat(list)
            successCallback && successCallback(list)
          })
        } catch (e) {
          console.dir(e)
          errorCallback && errorCallback()
        }
      }
    },
    watch: {
      list: function (newValue) {
        this.$emit('input', newValue)
      },
      prevOtherData: function (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.localPrevOtherData = newValue
          this.refreshPageData(newValue)
        }
      }
    }
  }
</script>

<style>
  /*旋转进度条*/
  .mescroll-downwarp .downwarp-progress,
  .mescroll-upwarp .upwarp-progress {
    width: 24px;
    height: 24px;
    border: none;
    margin: auto;
    background-image: url(../../statics/images/mescroll-progress.jpg);
    background-size: contain;
  }

  /*放大旋转动画*/
  .mescroll-rotate {
    -webkit-animation: animScale 0.6s linear, mescrollRotate 0.6s linear infinite;
    animation: animScale 0.6s linear, mescrollRotate 0.6s linear infinite;
  }

  @-webkit-keyframes animScale {
    0% {
      -webkit-transform: scale(1, 1) rotate(0deg)
    }
    50% {
      -webkit-transform: scale(1.2, 1.2) rotate(180deg)
    }
    100% {
      -webkit-transform: scale(1, 1) rotate(360deg)
    }
  }

  @keyframes animScale {
    0% {
      transform: scale(1, 1) rotate(0deg)
    }
    50% {
      transform: scale(1.2, 1.2) rotate(180deg)
    }
    100% {
      transform: scale(1, 1) rotate(360deg)
    }
  }

  /*下拉刷新回调的提示*/
  .download-tip {
    z-index: 9900;
    position: absolute;
    top: -24px;
    left: 0;
    width: 100%;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    background-color: rgba(80, 175, 85, .7);
    color: white;
    -webkit-transition: top 300ms;
    transition: top 300ms;
  }
</style>

<style scoped="scoped">
  .mescrollListWrapper{
    position: absolute;
    width:100%;
    overflow: hidden;
  }
</style>
