<template>
  <div :id="id" class="mui-popover mui-popover-action mui-popover-bottom">
    <div class="allOptions">
      <div class="mui-poppicker-header">
        <button class="mui-btn mui-poppicker-btn-cancel" @tap.stop.prevent="toggle">取消</button>
        <div class="mui-poppicker-clear"></div>
      </div>
      <div class="mui-poppicker-body" v-for="(item, index) in options">
        <div class="option" @tap.stop.prevent="selectItem(item)">{{item}}</div>
      </div>
    </div>
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

<style scoped="">
  .allOptions{
    background:#fff;
  }
  .allOptions .mui-poppicker-body{
    height:auto;
  }
  .allOptions .option{
    text-align: center;
    color:#444;
    height:0.96rem;
    line-height: 0.96rem;
  }
</style>
