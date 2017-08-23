<template>
  <div>
    <a @tap.stop.prevent="openApp()">打开app</a>
  </div>
</template>

<script>

  export default {
    mounted(){
    },
    methods: {
      openApp(){
        if (mui.os.wechat) {
          WeixinJSBridge.invoke("launch3rdApp", {appID: "wxe761fc33a7944f44", extInfo: 'action=open'}, function (e) {
            alert(JSON.stringify(e));
          })
        }
      }
    }
  };
</script>

<style scoped="scoped">
  a{
    display: inline-block;
    margin:50px 0 0 50px;
  }
</style>
