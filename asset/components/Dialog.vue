<template>
    <div :style="style">
        <div id="test">
            <div class="test">
            hello content <b>bold</b>
            {{ options.ok?options.ok:'' }}
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {
        style:'display:none',
        options: {
            ok:'test'
        },
      }
    },
    created(){
        if (this.$route.path == '/dialog/list') {
            this.style = ''
        }
    },
    methods: {
      getHtml(id, options, callback) {
          this.options = options;
          this.$nextTick(() => {
            var obj = document.getElementById(id);
            if (obj) {
              callback(obj.innerHTML.toString().trim().replace(/\n/g, ''));
            } else {
              callback('');
            }
          })
      }
    }
  };
</script>

<style scoped="scoped">
    #test{
      width:270px;
      height:300px;
      background-color:green;
    }
    .test{
      color:red;
    }
</style>
