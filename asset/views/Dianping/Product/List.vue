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
    height: 34px;
    padding: 0 16px;
    line-height: 34px;
    display: flex;
    justify-content: space-between;
    box-shadow:0px 5px 10px 0px rgba(249,249,251,1);
    div {
      color: #444444;
      font-size: 13px;
      &:nth-of-type(1) {
        .icon {
          font-size: 7px;
          margin-bottom: 1px;
        }
      }
      &:nth-of-type(2) {
        .icon {
          font-size: 10px;
        }
      }
    }
  }

  .list {
    margin-top: 1.5px;
  }
  .comment-product {
    padding: 14px 15px 0;
    .product-info {
      overflow: hidden;
      padding-bottom: 16px;
      .product-img {
        width: 44px;
        height: 44px;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
      }
      .product-detail {
        float: left;
        margin-left: 10px;
        .productName {
          width: 284px;
          color: #444444;
          font-size: 16px;
          line-height: 22.5px;
        }
        .productMark {
          .icon {
            color: #FCC816;
            font-size: 12px;
          }
          span {
            color: #B4B4B6;
            font-size: 11px;
            line-height: 15px;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 3px;
            }
          }
          i {
            width: 2px;
            height: 2px;
            margin-right: 5px;
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
