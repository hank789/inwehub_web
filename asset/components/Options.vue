<template>
  <div :id="id" class="mui-popover mui-popover-action mui-popover-bottom">
    <ul class="mui-table-view">
      <li class="mui-table-view-cell" v-for="(item, index) in options" @tap.stop.prevent="selectItem(item)">{{item}}</li>
    </ul>

    <ul class="mui-table-view">
      <li class="mui-table-view-cell" @tap.stop.prevent="toggle">取消</li>
    </ul>

    <!--<div class="allOptions">-->
      <!--<div class="mui-poppicker-header">-->
        <!--<button class="mui-btn mui-poppicker-btn-cancel" @tap.stop.prevent="toggle">取消</button>-->
        <!--<div class="mui-poppicker-clear"></div>-->
      <!--</div>-->
      <!--<div class="mui-poppicker-body" v-for="(item, index) in options">-->
        <!--<div class="option" @tap.stop.prevent="selectItem(item)">{{item}}</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    components: {},
    props: {
      id: {
        type: String,
        default: 'options'
      },
      options: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    created () {

    },

    methods: {
      toggle () {
        window.mui('#' + this.id).popover('toggle')
      },
      selectItem (item) {
        this.$emit('selectedItem', item)
      }
    }
  }
</script>

<style scoped>
  .allOptions{
    background:#fff;
  }
  .allOptions .mui-poppicker-body{
    height:auto;
  }
  .allOptions .option{
    text-align: center;
    color:#444;
    height:1.173rem;
    line-height: 1.173rem;
  }
  .mui-popover.mui-popover-action .mui-table-view {
    border-radius: 0 !important;
    margin: 0 !important;
  }
  .mui-popover.mui-popover-action .mui-table-view:first-child {
    border-top-left-radius: 18px !important;
    border-top-right-radius: 18px !important;
  }
  .mui-popover.mui-popover-action .mui-table-view:last-child .mui-table-view-cell:after {
    height: 0 !important;
  }
  .mui-table-view-cell {
    padding: 15px 0 !important;
    color: #444444 !important;
    font-size: 16px !important;
  }
  .mui-popover.mui-popover-action .mui-table-view:last-child {
    font-family:PingFangSC-Medium;
  }
  .mui-popover .mui-table-view:after {
    height: 1px !important;
  }
  .mui-popover.mui-popover-action .mui-table-view:last-child:after {
    height: 0 !important;
  }
</style>
