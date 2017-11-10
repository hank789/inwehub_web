<template>
  <div>
    <div class="mui-content absolute onlyImage">
      <Images ref="imagesCommponent"></Images>
    </div>
  </div>
</template>

<script>
  import Images from '../../components/invitation/image.vue'
  import { getLocalUserInfo } from '../../utils/user'

  const Index = {
    data: () => ({
      rcCode: '',
      id: 0,
      loading: true
    }),
    mounted () {},
    components: {
      Images
    },
    computed: {},
    methods: {
      getImage () {
        this.$refs.ShareBtn.getImageByServer((url) => {
          this.$refs.imagesCommponent.changeImage(url)
          this.$refs.ShareBtn.share()
        })
      }
    },
    created () {
      var user = getLocalUserInfo()
      this.rcCode = user.rc_code || 0
    }
  }
  export default Index
</script>

<style scoped>
#scaleDivWrapper{
  top:0 !important;
}
</style>
