<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答</h1>
    </header>

    <div class="mui-content" v-show="!loading">



    </div>
  </div>
</template>

<script>
  const MajorList = {
    data: () => ({
      loading: 0,
      list: [],
      tags: [],
      sort: 1,
      dataList: {}
    }),
    computed: {
    },
    created () {
      this.dataList = {
        page: 1,
        order_by: this.sort
      }
    },
    components: {

    },
    methods: {
      getStateClass (state) {
        switch (state) {
          case 8:
            return 'component-label-success'
          case 9:
            return 'component-label-fail'
          default:
            return 'component-label-warn'
        }
      },
      toDetail (id, type) {
        this.$router.pushPlus('/ask/offer/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
      },
      textToLink (text) {
      }
    },
    mounted () {
    }
  }
  export default MajorList
</script>

<style scoped>

</style>
