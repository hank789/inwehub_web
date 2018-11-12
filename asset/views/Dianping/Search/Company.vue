<template>
  <div>
    <div class="mui-content">

      <div class="container-search">
        <p class="border-football">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="搜索点评、产品、分类、公司" v-model.trim="searchText" v-on:keydown.enter="enterKeyCode($event)"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShowCancelButton">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p @tap.stop.prevent="back()">取消</p>
      </div>
      <!-- 导航栏 -->
      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/dianping/search/comments?text=' + searchText)">点评</span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/products?text=' + searchText)">产品</span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/categories?text=' + searchText)">分类</span>
        <span class="font-family-medium">公司<i></i></span>
        <i class="bot"></i>
      </div>

      <div class="container-searchCompony">
        <div class="container-searchComponyList">
          <div class="container-componyList">
            <div class="componyImg border-football">
              <img src="../../../statics/images/uicon.jpg">
            </div>
            <i class="bot"></i>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        searchText: '',
        isShowCancelButton: false
      }
    }
  }

</script>

<style scoped lang="less">
  .mui-android .mui-content .menu .bot {
    height: 0.026rem;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content {
    background: #FFFFFF;
    .listWrapper{
      top: 2.24rem;
    }
  }

  .container-searchCompony {
    .container-searchComponyList {
      padding: 0 16px;
      .container-componyList {
        position: relative;
        padding: 15px 0 12.5px;
        .componyImg {
          width: 42px;
          height: 42px;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
          &.border-football {
            &:after {
              border-radius: 8px;
            }
          }
        }
      }
    }
  }
</style>
