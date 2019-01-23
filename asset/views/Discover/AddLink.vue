<template>
  <div>
    addlink
  </div>
</template>

<script>

  export default {
    data () {
      return {
        loading: 1,
        lists: [],
        listDataConfig: [
          {
            api: 'recommendRead',
            data: {},
            autoShow: true
          },
          {
            api: 'recommendRead',
            data: {},
            autoShow: false
          }
        ]
      }
    },
    components: {
    },
    methods: {
      curNavIndexChange: (index) => {
        console.log('当前页数:' + index)
      }
    }
  }
</script>
