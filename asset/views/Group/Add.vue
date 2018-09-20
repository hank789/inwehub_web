<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">创建圈子</h1>
    </header>

    <div class="mui-content">
      <div class="foundGroupWrapper">
        <div class="foundGroupImages">
          <img src="../../statics/images/uicon.jpg" alt="">
          <div class="foundGroupIcon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangji1"></use>
            </svg>
          </div>
        </div>
        <div class="headPhotowrapper">
          <div class="headImages">
            <svg class="icon logoImg" aria-hidden="true" v-if="false">
              <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
            </svg>
            <img src="../../statics/images/uicon.jpg" alt="">
            <div class="headPhotograph">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiangji1"></use>
              </svg>
            </div>
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
    position: relative;
    .foundGroupImages {
      height: 149px;
      position: relative;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 100%);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
      }
      .foundGroupIcon {
        font-size: 30px;
        color: #ffffff;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 100;
        .icon {
        }
      }
    }
    .headPhotowrapper {
      position: absolute;
      bottom: -24px;
      left: 17px;
      z-index: 100;
      .headImages {
        width: 56px;
        height: 56px;
        text-align: center;
        background: #E3E3E3;
        border-radius: 4px;
        border: 1px solid #ffffff;
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          object-fit: cover;
        }
        .logoImg {
          color: #8B8B8B;
          font-size: 30px;
          margin-top: 11px;
        }
        .headPhotograph {
          width: 54px;
          height: 54px;
          position: absolute;
          top: 1px;
          left: 1px;
          text-align: center;
          border-radius: 4px;
          background:rgba(0,0,0,0.3);
          .icon {
            font-size: 18px;
            color: #ffffff;
            margin-top: 19px;
          }
        }
      }
    }
  }
</style>
