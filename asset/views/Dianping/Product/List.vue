<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">产品服务</h1>
    </header>
    <div class="mui-content">
      <div class="listSelect">
        <div @tap.stop.prevent="showDropdownMenu()">
          <span class="font-family-medium">{{ !category.name ? '选择类型' : category.name }}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiangxiajiantou"></use>
          </svg>
        </div>
        <div @tap.stop.prevent="selectSort()">
          <span class="font-family-medium">{{ orderByName }}</span>
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
        :isShowUpToRefreshDescription="true"
        v-model="list"
        :autoShowEmpty="false"
        class="listWrapper"
      >
        <div class="list">
          <div class="comment-product" v-for="(item, index) in list" :key="index">
            <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
              <div class="product-img border-football">
                <img class="lazyImg" v-lazy="item.logo" alt="">
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
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
    >
      <template slot="dropDownMenuHeader">
        <div class="dianPingListHeader">
          <div class="headerBack" @tap.stop.prevent="goBack">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fanhui"></use>
            </svg>
          </div>
          <div class="headerTitle"><div>产品服务</div></div>
        </div>
      </template>
    </DropDownMenu>

    <Options
      ref="itemOptions"
      :id="'itemOptions'"
      :options="['评分', '热度']"
      @selectedItem="selectedItem"
    ></Options>

  </div>
</template>

<script>
  import DropDownMenu from '../../../components/select/DropDownMenu.vue'
  import { getCategories } from '../../../utils/dianping'
  import RefreshList from '../../../components/refresh/MescrollList.vue'
  import Options from '../../../components/Options.vue'
  import StarView from '../../../components/star-rating/starView.vue'

  export default {
    data () {
      return {
        category: {
          id: '',
          name: ''
        },
        categories: [],
        list: [],
        orderBy: 1
      }
    },
    components: {
      DropDownMenu,
      RefreshList,
      Options,
      StarView
    },
    computed: {
      prevOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      },
      nextOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      },
      orderByName () {
        switch (this.orderBy) {
          case 0:
            return '排序'
          case 1:
            return '评分'
          case 2:
            return '热度'
        }
      }
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
    },
    methods: {
      goBack () {
        window.mui('#dropDownMenuWrapper').popover('toggle')
        window.mui.back()
      },
      selectSort () {
        this.$refs.itemOptions.toggle()
      },
      selectedItem (text) {
        this.$refs.itemOptions.toggle()
        switch (text) {
          case '评分':
            this.orderBy = 1
            break
          case '热度':
            this.orderBy = 2
            break
        }
      },
      showDropdownMenu () {
        this.$refs.dropdownMenu.show()
      },
      refreshPageData () {
        let categoryId = this.$route.params.categoryId

        if (categoryId) {
          this.category.id = categoryId
        }

        let categoryName = this.$route.params.categoryName

        if (categoryName) {
          this.category.name = categoryName
        }

        getCategories(this, (categories) => {
          this.categories = categories
        })
      }
    },
    mounted () {
    },
    created () {
      this.refreshPageData()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .listWrapper {
    top: 0.986rem;
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
          object-fit: contain;
          border-radius: 0.106rem;
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
        }
      }
    }
  }
  .noData {
    margin-top: 1.333rem;
    margin-bottom: 1.333rem;
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
      font-size: 0.32rem;
      line-height: 0.426rem;
      margin-top: 0.266rem;
      text-align: center;
    }
  }
  .dianPingListHeader {
    position: relative;
    height: 1.173rem;
    line-height: 1.173rem;
    background-color: #FFF;
    /*display: flex;*/
    .headerBack {
      font-size: 0.666rem;
      color: #3C3E44;
      margin-left: 0.266rem;
    }
    .headerTitle {
      color: #3C3E44;
      font-size: 0.48rem;
      text-align: center;
      font-family:PingFangSC-Medium;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
