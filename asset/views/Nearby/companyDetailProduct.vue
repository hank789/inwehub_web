<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">企业详情</h1>
    </header>

    <div class="mui-content">
      <RefreshList
        v-if="loading"
        v-model="list"
        :pageMode="true"
        :api="'company/dataProduct'"
        :prevOtherData="{id:this.id}"
        :nextOtherData="{id:this.id}"
        :autoShowEmpty="false"
        class="listWrapper">
        <div class="companyInfo">
          <div class="companyLogo">
            <ImageView :src="datailList.logo" width="92" height="92" :isLazyload="false"></ImageView>
          </div>
          <div class="interval">距离我<{{ datailList.distance_format }}</div>
          <div class="companyName">{{ datailList.name }}</div>
          <div class="tags"><span v-for="(tags, tagsindex) in datailList.tags" :key="tagsindex" @tap.stop.prevent="toTagDetail(tags)">{{ tags }}<i class="line-wall" v-if="tagsindex !== datailList.tags.length - 1"></i></span></div>
          <div class="address">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dingwei"></use>
            </svg>
            <span>{{ datailList.address_province }}{{ datailList.address_detail }}</span>
          </div>
        </div>
        <div class="switchMenu">
          <span class="font-family-medium">产品服务<i></i></span>
          <span @tap.stop.prevent="$router.replace('/companyDetailPeople/' + id)">相关人员</span>
          <i class="bot"></i>
        </div>

        <div class="productList">
          <div class="comment-product" v-for="(item, index) in list" :key="index">
            <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
              <div class="product-img border-football">
                <ImageView :src="item.logo" width="44" height="44"></ImageView>
                <!--<img src="../../statics/images/uicon.jpg" alt="">-->
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

          <div class="noResult increase dianping-search" v-if="list.length === 0">
            <div class="empty-Img">
              <img src="../../statics/images/empty@3x.png">
            </div>
            <div class="noResultText">暂无结果~</div>
          </div>

        </div>

      </RefreshList>
    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getGeoPosition } from '../../utils/allPlatform'
  import RefreshList from '../../components/refresh/List.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import userAbility from '../../utils/userAbility'
  import StarView from '../../components/star-rating/starView.vue'

  const currentUser = getLocalUserInfo()
  export default {
    data () {
      return {
        user_id: currentUser.user_id,
        datailList: '',
        longt: '',
        lat: '',
        id: '',
        list: [],
        loading: 0
      }
    },
    components: {
      RefreshList,
      StarView
    },
    created () {
      this.id = this.$route.params.id
      getGeoPosition((position) => {
        this.longt = position.longt
        this.lat = position.lat
        this.companyInfo()
      }, () => {
        window.mui.toast('获取当前位置失败')
      })
    },
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      refreshPageData () {
        this.id = this.$route.params.id
        this.companyInfo()
      },
      // 获取企业信息；
      companyInfo () {
        var data = {
          id: this.id,
          page: this.page,
          longitude: this.longt,
          latitude: this.lat
        }
        postRequest('company/dataInfo', data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            this.datailList = response.data.data
            this.loading = 1
          }
        })
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    mounted () {
      this.refreshPageData()
    }
  }
</script>

<style scoped lang="less">
  .mui-content{
    background: #ffffff;
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
          object-fit: cover;
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
