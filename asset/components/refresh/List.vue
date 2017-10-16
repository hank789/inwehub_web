<template>
  <div class="mui-scroll-wrapper" id="refreshContainer" v-show="!loading">
    <div class="mui-scroll">
      <Empty v-if="nothing===1 && autoShowEmpty"></Empty>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script type="text/javascript">

  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import Empty from '../../components/Empty.vue';

  export default {
    data () {
      return {
        loading: true,
        currentPage: 0,
        list: []
      }
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
      prevSuccessCallback: {
        type: Function,
        default: null
      },
      autoShowEmpty: {
        type: Boolean,
        default: true
      },
      nextSuccessCallback: {
        type: Function,
        default: null
      },
      pageMode: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Empty
    },
    computed: {
      bottomId() {
        var length = this.list.length;
        if (length) {
          return this.list[length - 1].id;
        }
        return 0;
      },
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.list.length ? 0 : 1;
      },
    },
    methods: {
      getPrevList(){
        var param = {};
        param = Object.assign(param, this.prevOtherData);

        postRequest(this.api, param).then(response => {
          var code = response.data.code;

          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
            return;
          }

          var list = response.data.data;

          if (this.pageMode) {
            list = response.data.data.data;
            this.currentPage = response.data.data.current_page;
          }

          if (list) {
            this.list = list;
          }

          this.loading = false;
          if (mui('#refreshContainer').length) {
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
          }

          if (this.prevSuccessCallback) {
            this.prevSuccessCallback();
          }
        });
      },
      getNextList(){

        if (this.pageMode) {
          var param = {
            page: this.currentPage + 1
          }
        } else {
          var param = {
            bottom_id: this.bottomId
          };
        }

        param = Object.assign(param, this.nextOtherData);

        postRequest(this.api, param).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          var list = response.data.data;

          if (this.pageMode) {
            list = response.data.data.data;
            this.currentPage = response.data.data.current_page;
          }

          if (list.length > 0) {
            this.list = this.list.concat(list);
          }

          if (list.length < 10) {
            if (mui('#refreshContainer').length) {
              mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
            }

          } else {
            if (mui('#refreshContainer').length) {
              mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
            }
          }

          this.loading = false;



          if (this.nextSuccessCallback) {
            this.nextSuccessCallback();
          }
        });
      }
    },
    mounted() {
      mui.init({
        pullRefresh: {
          container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down: {
            auto: true,//可选,默认false.首次加载自动下拉刷新一次
            contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: this.getPrevList //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: this.getNextList
          }
        }
      });
    },
    watch: {
      list: function (newValue) {
        this.$emit('input', newValue);
      },
    }
  };
</script>

<style scoped="scoped">

</style>
