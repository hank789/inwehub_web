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
        <span class="font-family-medium">分类<i></i></span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/companys?text=' + searchText)">公司</span>
        <i class="bot"></i>
      </div>

      <div class="container-searchResult">
        <div class="container-resultList">
          <div class="container-result" v-for="(item, index) in 5" :key="index">
            <span>Marketing Services</span>
            <i class="bot"></i>
          </div>
        </div>
        <div class="noMore">暂无更多</div>
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
  .mui-content{
    background: #ffffff;
    .listWrapper{
      top: 2.24rem;
    }
  }

  .container-searchResult {
    .container-resultList {
      padding: 0 16px;
      .container-result {
        padding: 11px 0 12px;
        position: relative;
        span {
          color: #444444;
          font-size: 15px;
          line-height: 21px;
        }
      }
    }
    .noMore {
      padding: 12.5px 0 28px;
      color: #C8C8C8;
      font-size: 12px;
      text-align: center;
    }
  }
</style>
