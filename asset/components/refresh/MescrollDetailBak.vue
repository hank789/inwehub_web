<template>
  <div class='mescrollDetailWrapper'>
    <mescroll-vue ref='mescroll' :down='config.down' @init='mescrollInit'>
      <div v-show="!loading">
        <slot></slot>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import 'mescroll.js/mescroll.min.css'
  import { postRequest } from '../../utils/request'

  export default {
    name: 'MescrollDetail',
    components: {
      MescrollVue
    },
    props: {
      api: {
        type: String,
        default: ''
      },
      data: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        loading: 1,
        detail: {},
        mescroll: null,
        response: null,
        localData: this.data,
        config: {
          down: {
            auto: true,
            offset: 60,
            htmlContent: '<p class="downwarp-progress"><p>',
            callback: this.downCallback
          },
          up: {
            use: false
          }
        }
      }
    },
    methods: {
      refreshPageData (prevData) {
        this.localData = prevData
        this.downCallback(this.mescroll)
      },
      downCallback (mescroll) {
        this.getData((data) => {
          this.detail = data
          this.$emit('prevSuccessCallback', this.detail)
        }, () => {
          mescroll.endErr()
        })
      },
      getData (successCallback, errorCallback) {
        try {
          var param = {}
          param = Object.assign(param, this.data)

          postRequest(this.api, param, false, {}, 0, false).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            this.response = response
            successCallback && successCallback(response.data.data)
          }).catch((e) => {
            errorCallback && errorCallback()
          })
        } catch (e) {
          errorCallback && errorCallback()
        }
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      }
    },
    watch: {
      detail: function (newValue) {
        this.$emit('input', newValue)
      },
      data: function (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.localData = newValue
          this.refreshPageData(newValue)
        }
      }
    }
  }
</script>
<style scoped="scoped">
.mescrollDetailWrapper{

}
</style>
