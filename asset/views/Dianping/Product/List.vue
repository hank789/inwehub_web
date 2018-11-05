<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">点评</h1>
    </header>
    <div class="mui-content">
      <div class="listSelect">
        <div @tap.stop.prevent="showDropdownMenu()">
          <span class="font-family-medium">{{ !category.name?'采购软件': category.name }}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiangxiajiantou"></use>
          </svg>
        </div>
        <div>
          <span class="font-family-medium">好评</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-paixu"></use>
          </svg>
        </div>
      </div>
      <RefreshList
        ref="RefreshList"
        :api="'tags/productList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        v-model="list"
        :autoShowEmpty="false"
        class="listWrapper"
      >
        <div class="list">
          <div class="comment-product" v-for="(item, index) in list" :key="index">
            <div class="product-info">
              <div class="product-img">
                <img class="lazyImg" v-lazy="item.logo" alt="">
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
                <div class="productMark">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shoucangdilantongyi"></use>
                  </svg><span>{{ item.review_average_rate }}分</span>
                  <i></i><span>{{ item.review_count }}条评论</span>
                </div>
              </div>
            </div>
            <div class="line-river-after line-river-after-top"></div>
          </div>
        </div>
        <div class="noData" v-if="!list.length">
          <div class="DataImg">
            <img src="../../../statics/images/empty@3x.png" alt="">
          </div>
          <div class="noDataText">暂时没有数据～</div>
        </div>
      </RefreshList>
    </div>

    <DropDownMenu
      ref="dropdownMenu"
      :tree="categories"
      v-model="category"
    ></DropDownMenu>

  </div>
</template>

<script>
  import DropDownMenu from '../../../components/select/DropDownMenu.vue'
  import { getCategories } from '../../../utils/dianping'
  import RefreshList from '../../../components/refresh/List.vue'
  export default {
    data () {
      return {
        category: {
          id: ''
        },
        categories: [],
        list: []
      }
    },
    components: {
      DropDownMenu,
      RefreshList
    },
    computed: {
      prevOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      },
      nextOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      }
    },
    methods: {
      showDropdownMenu () {
        this.$refs.dropdownMenu.show()
      },
      refreshPageData () {
        getCategories(this, (categories) => {
          this.categories = categories
        })
      }
    },
    mounted () {
    },
    created () {
      this.refreshPageData()
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .listWrapper {
    top: 37px;
  }
  .listSelect {
    height: 0.906rem;
    padding: 0 0.426rem;
    line-height: 0.906rem;
    display: flex;
    justify-content: space-between;
    box-shadow:0rem 0.133rem 0.266rem 0rem rgba(249,249,251,1);
    div {
      color: #444444;
      font-size: 0.346rem;
      &:nth-of-type(1) {
        .icon {
          font-size: 0.186rem;
          margin-bottom: 0.026rem;
        }
      }
      &:nth-of-type(2) {
        .icon {
          font-size: 0.266rem;
        }
      }
    }
  }

  .list {
    margin-top: 0.04rem;
  }
  .comment-product {
    padding: 0.373rem 0.4rem 0;
    .product-info {
      overflow: hidden;
      padding-bottom: 0.426rem;
      .product-img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.106rem;
        }
      }
      .product-detail {
        float: left;
        margin-left: 0.266rem;
        .productName {
          width: 284px;
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
        .productMark {
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
        }
      }
    }
  }
  .noData {
    margin-top: 50px;
    margin-bottom: 50px;
    .DataImg {
      width: 1.626rem;
      height: 2.373rem;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .noDataText {
      color: #C8C8C8;
      font-size: 12px;
      line-height: 16px;
      margin-top: 10px;
      text-align: center;
    }
  }
</style>
