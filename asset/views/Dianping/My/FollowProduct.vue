<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">我的关注</h1>
    </header>
    <div class="mui-content">

      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/collectUser')">用户</span>
        <span @tap.stop.prevent="$router.replace('/collectQuestion')">问答</span>
        <span class="font-family-medium">产品服务<i></i></span>
        <i class="bot"></i>
      </div>

      <RefreshList
        ref="refreshlist"
        v-model="list"
        :api="'followed/products'"
        :pageMode="true"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="true"
        class="listWrapper">

        <div class="productList">
          <div class="comment-product" v-for="(item, index) in list" :key="index">
            <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
              <div class="product-img border-football">
                <ImageView :src="item.logo" width="44" height="44"></ImageView>
                <!--<img src="../../../statics/images/uicon.jpg" alt="">-->
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium text-line-1">{{item.name}}</div>
                <div class="productMark">
                  <div class="stars">
                    <StarView :rating="item.review_average_rate"></StarView>
                  </div>
                  <div class="starsText">
                    <span>{{ item.review_average_rate }}分</span>
                    <i></i><span>{{ item.review_count }}条评论</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="line-river-after line-river-after-top"></div>
          </div>
        </div>

      </RefreshList>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../../components/refresh/List.vue'
  import StarView from '../../../components/star-rating/starView.vue'

  export default {
    data () {
      return {
        list: []
      }
    },
    components: {
      RefreshList,
      StarView
    }
  }

</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .listWrapper {
    top: 1.04rem;
  }

  .container-searchMenu {
    margin-top: 0;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }
  .comment-product {
    padding: 0.346rem 0.4rem 0;
    .product-info {
      overflow: hidden;
      border-radius: 0.106rem;
      padding: 0 0 0.4rem;
      background: none;
      .product-img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.106rem;
          object-fit: contain;
        }
      }
      .product-detail {
        float: left;
        margin-left: 0.266rem;
        .productName {
          width: 7.573rem;
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
        .productMark {
          display: flex;
          .icon {
            color: #FCC816;
            font-size: 0.32rem;
          }
          span {
            color: #B4B4B6;
            font-size: 0.293rem;
            line-height: 0.4rem;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 0.08rem;
            }
          }
          i {
            width: 0.053rem;
            height: 0.053rem;
            margin-right: 0.133rem;
            vertical-align: middle;
            border-radius: 50%;
            background: #B4B4B6;
            display: inline-block;
          }
          .stars {
            display: flex;
            div {
              margin-right: 0.08rem;
            }
          }
          .starsText {
          }
        }
      }
    }
  }
</style>
