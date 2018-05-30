<template>
<div></div>
</template>

<script type="text/javascript">
  import { selectFileH5 } from '../utils/uploadFile'

  export default {
    data () {
      return {
        files: []
      }
    },
    props: {},
    mounted () {},
    methods: {
      uploadFile: function (type) {
        this.changeAvatarH5(type)
      },
      changeAvatarH5: function (type) {
        selectFileH5(type, (file, base64) => {
          var imgInfo = {
            name: file.name,
            size: file.size,
            base64: base64,
            isNew: true
          }
          this.files.push(imgInfo)
          this.$emit('success', this.files)
        })
      }
    }
  }
</script>

<style scoped="scoped">
</style>
