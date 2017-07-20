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
      if (mui.os.plus) {
        var self = plus.webview.currentWebview();
        var topoffset='44px';
        if(plus.navigator.isImmersedStatusbar()){// 兼容immersed状态栏模式
          topoffset=(Math.round(plus.navigator.getStatusbarHeight())+44)+'px';
        }
        var embed=plus.webview.create(self.id,'embed',{top:topoffset,bottom:'0px',position:'dock',dock:'bottom',bounce:'vertical'});
        self.append(embed);
      }
    },
    methods: {

    },
    watch: {

    }
  }

</script>
