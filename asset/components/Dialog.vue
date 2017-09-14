<template>
    <div style="display:none">
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
        options: {
            ok:'test'
        },
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
