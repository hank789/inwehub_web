<template>
  <div id="mescroll">
    <slot></slot>
  </div>
</template>

<script type="text/javascript">



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

    }
  };
</script>

<style scoped="scoped">

</style>
