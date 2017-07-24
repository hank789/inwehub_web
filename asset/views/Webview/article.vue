<template>
<div>
  <header class="mui-bar mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">InweHub</h1>
  </header>

</div>
</template>


<script>

  export default {
    data: () => ({
      loading:1
    }),
    created () {
      showInwehubWebview();
    },
    methods: {

    },
    watch: {

    },
    mounted(){
      mui.plusReady(() => {
        var ws = plus.webview.currentWebview();
        ws.addEventListener('show',createEmbed(ws),false);

        function createEmbed(ws) {
          var topoffset='44px';
          if(plus.navigator.isImmersedStatusbar()){// 兼容immersed状态栏模式
            topoffset=(Math.round(plus.navigator.getStatusbarHeight())+44)+'px';
          }
          var embed=plus.webview.create(ws.id,'embed',{top:topoffset,bottom:'0px',position:'dock',dock:'bottom',bounce:'vertical'});
          ws.append(embed);
        }
      });

    }
  }

</script>
