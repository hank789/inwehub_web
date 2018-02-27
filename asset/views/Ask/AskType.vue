<template>
  <div class="page page-white">
    <div class="page-container">

      <header class="mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">选择问题分类</h1>
      </header>

      <div class="mui-content mui-row mui-fullscreen" v-show="!loading">
        <div class="mui-col-xs-3">
          <div id="segmentedControls"
               class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-vertical">
            <template v-for="(item, index) in types">
              <a class="mui-control-item " :class="index == 0?'mui-active':''" :href="'#' + index">{{ item.text }}</a>
            </template>
          </div>
        </div>
        <div id="segmentedControlContents" class="mui-col-xs-9" style="border-left: 0.026rem solid #c8c7cc;">
          <div :id="index" class="mui-control-content" :class="{'mui-active':index === 0}"
               v-for="(item, index) in types">
            <div class="emptyChildren mui-table-view" v-if="!item.children.length">
              <div class="mui-table-view-cell">小哈。。。敬请期待！</div>
            </div>
            <ul class="mui-table-view" v-else>
              <li class="mui-table-view-cell"
                  @tap.stop.prevent="selectTypeItem(item.text, '全部', item.value, item.value)"
                  v-if="isAddAll && item.value !==0">全部
              </li>
              <li class="mui-table-view-cell"
                  @tap.stop.prevent="selectTypeItem(item.text, itemSub.text, item.value, itemSub.value)"
                  v-for="(itemSub, subIndex) in item.children">{{ itemSub.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { ASK_TYPES_SET, ASK_TYPES, ASK_TYPE_SELECT } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'

  const Ask = {
    data: () => ({
      loading: true,
      isAddAll: false
    }),
    computed: {
      types () {
        var list = this.$store.getters[ASK_TYPES]

        if (this.isAddAll && list.length > 0) {
          var all = {
            text: '全部',
            value: 0,
            children: [
              {
                text: '全部',
                value: 0
              }
            ]
          }
          list.unshift(all)
        }

        return list
      },
      subTypes () {
        // var list = this.$store.getters[ASK_SUB_TYPES]
      }
    },
    methods: {
      selectTypeItem (type, subType, typeValue, subTypeValue) {
        var selectType = type + '-' + subType + ':' + subTypeValue
        this.$store.dispatch(ASK_TYPE_SELECT, selectType)
        this.$router.go(-1)
      }
    },
    created () {
      if (this.$route.query.type && this.$route.query.type === 'majorlist') {
        this.isAddAll = true
      }

      postRequest(`question/request`, {}).then(response => {
        var code = response.data.code
        if (code !== 1000) {
          window.mui.back()
          return
        }

        localEvent.setLocalItem('ask_types2', response.data.data.tags)
        this.$store.dispatch(ASK_TYPES_SET, response.data.data.tags)
        this.loading = 0
      })
    }
  }
  export default Ask
</script>


<style scoped>
  .mui-row.mui-fullscreen > [class*="mui-col-"] {
    height: 100%;
  }

  .mui-col-xs-3,
  .mui-control-content {
    overflow-y: auto;
    height: 100%;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 1.333rem;
    width: 100%;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    background-color: #fff;
  }

  .emptyChildren {
    padding: 0.8rem;
    background: #fff;
    text-align: center;
  }

</style>
