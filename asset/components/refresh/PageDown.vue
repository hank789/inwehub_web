<template>
  <div id="mescroll">
    <slot></slot>
  </div>
</template>

<script type="text/javascript">

  import MeScroll from 'mescroll.js';
  import 'mescroll.js/mescroll.css';

  export default {
    data () {
      return {
        mescroll:null
      }
    },
    props: {
      downCallback: {
        type: Function,
        default: () => {}
      },
    },
    mounted(){
      this.mescroll = new MeScroll("mescroll", {
        down:{
          auto:false,   //是否在初始化完毕之后自动执行下拉回调callback; 默认true
          mustToTop:false,
          callback: () => {
              this.downCallback(() => {
                this.mescroll.endSuccess();
              });
          },
        },
        up:{
          use:false
        }
      });
    }
  };
</script>

<style scoped="scoped">

</style>
