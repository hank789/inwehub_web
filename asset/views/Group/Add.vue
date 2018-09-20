<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">创建圈子</h1>
    </header>

    <div class="mui-content">
      <div class="foundGroupWrapper">
        <div class="foundGroupImages">

          <div class="foundGroupIcon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangji1"></use>
            </svg>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data () {}
  }
</script>

<style lang="less" scoped>
  .mui-content {
    background: #ffffff;
  }
  .foundGroupWrapper {
    .foundGroupImages {
      height: 149px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 100%);
      .foundGroupIcon {
        font-size: 34px;
        color: #ffffff;
        text-align: center;
        .icon {
          margin-top: 62px;
        }
      }
    }
  }
</style>
