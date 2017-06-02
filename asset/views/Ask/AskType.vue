<template>
  <div class="page page-white">
    <div class="page-container">

      <header class="mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">选择问题分类</h1>
      </header>

      <div class="mui-content mui-row mui-fullscreen" v-show="!loading">
        <div class="mui-col-xs-3">
          <div id="segmentedControls" class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-vertical">
            <template v-for="(item, index) in types">
              <a class="mui-control-item " :class="index == 0?'mui-active':''" :href="'#' + index">{{ item.text }}</a>
            </template>
          </div>
        </div>
        <div id="segmentedControlContents" class="mui-col-xs-9" style="border-left: 1px solid #c8c7cc;">
          <div :id="index" class="mui-control-content mui-active" v-for="(item, index) in types">
            <div class="emptyChildren mui-table-view" v-if="!item.children.length"><div class="mui-table-view-cell">小哈将陆续开放更多的板块！敬请期待！</div> </div>
            <ul class="mui-table-view" v-else>
              <li class="mui-table-view-cell" @tap.stop.prevent="selectTypeItem(item.text, itemSub.text, item.value, itemSub.value)" v-for="(itemSub, subIndex) in item.children">{{ itemSub.text }}</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { NOTICE, ASK_TYPES_SET, ASK_TYPES, ASK_SUB_TYPES, ASK_TYPE_SELECT } from '../../stores/types';
  import { createAPI, addAccessToken, postRequest } from '../../utils/request';
  import localEvent from '../../stores/localStorage';


  const Ask = {
    data: () => ({
      loading:true
    }),
    computed: {
      types () {
          return this.$store.getters[ASK_TYPES];
      },
      subTypes(){
        return this.$store.getters[ASK_SUB_TYPES];
      }
    },
    methods: {
      selectTypeItem (type, subType, typeValue, subTypeValue) {
        var selectType = type + '-' + subType + ':' + subTypeValue;
        this.$store.dispatch(ASK_TYPE_SELECT, selectType);
        this.$router.go(-1);
      },
    },
    created () {

      //var askTypes = localEvent.getLocalItem('ask_types2');

      //if (askTypes.length == 0 && askTypes != 'undefined') {
      postRequest(`question/request`, {}).then(response => {

        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          this.$router.go(-1);
        }

        localEvent.setLocalItem('ask_types2', response.data.data.tags);
        this.$store.dispatch(ASK_TYPES_SET, response.data.data.tags);
        this.loading=0;
      });
      /*
      } else {
          this.$store.dispatch(ASK_TYPES_SET, askTypes);
          this.loading=0;
      }
      */
    }
  }
  export default Ask;
</script>


<style scoped>
  .mui-row.mui-fullscreen>[class*="mui-col-"] {
    height: 100%;
  }
  .mui-col-xs-3,
  .mui-control-content {
    overflow-y: auto;
    height: 100%;
  }
  .mui-segmented-control .mui-control-item {
    line-height: 50px;
    width: 100%;
  }
  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    background-color: #fff;
  }

  .emptyChildren{
    padding:30px;
    background: #fff;
    text-align: center;
  }

</style>
