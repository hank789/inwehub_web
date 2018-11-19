<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">企业详情</h1>
    </header>

  <div class="mui-content">
    <RefreshList
      v-model="list"
      :api="api"
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
        <div class="tags" v-for="(tags, tagsindex) in datailList.tags" :key="tagsindex"><span>{{ tags }}</span><i class="line-wall" v-if="tagsindex !==datailList.tags - 1"></i></div>
        <div class="address">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingwei"></use>
          </svg>
          <span>{{ datailList.address_province }}{{ datailList.address_detail }}</span>
        </div>
      </div>
      <div class="switchMenu">
        <span @tap.stop.prevent="Switch(1)" :class="type === 1 ? 'font-family-medium' : ''">产品服务<i v-if="type === 1"></i></span>
        <span @tap.stop.prevent="Switch(2)" :class="type === 2 ? 'font-family-medium' : ''">相关人员<i v-if="type === 2"></i></span>
        <i class="bot"></i>
      </div>

      <div class="productList" v-if="type === 1">
        <div class="comment-product" v-for="(item, index) in 3" :key="index">
          <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
            <div class="product-img border-football">
              <!--<ImageView :src="item.logo" width="44" height="44"></ImageView>-->
              <img src="../../statics/images/uicon.jpg" alt="">
            </div>
            <div class="product-detail">
              <div class="productName font-family-medium text-line-1">AMETRAS Manual</div>
              <div class="productMark">
                <div class="stars">
                  <StarView :rating="4"></StarView>
                </div>
                <div class="starsText">
                  <span>1分</span>
                  <i></i><span>3条评论</span>
                </div>
              </div>
            </div>
          </div>
          <div class="line-river-after line-river-after-top"></div>
        </div>
      </div>

      <div class="relevantPepole" v-if="type === 2">
        <div class="pepoleList">
          <div class="userLogo">
            <img src="../../statics/images/uicon.jpg" alt="">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="userInfo">
            <div class="name">
              <span>大姐姐</span>
              <span>3</span>
              <span>(离职)</span>
            </div>
            <div class="describe">我是描述</div>
          </div>
          <div class="follow">关注Ta</div>
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
        distance: '',
        type: 1,
        api: ''
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
      if (this.type === 1) {
        this.api = 'company/dataProduct'
      } else {
        this.api = 'company/dataPeople'
      }
    },
    methods: {
      Switch (type) {
        this.type = type
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      refreshPageData () {
        this.id = this.$route.params.id
        this.companyInfo()
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      //  弹窗
      Obtain () {
        var that = this
        var btnArray = ['取消', '确定']
        window.mui.prompt('', '公司名称', '输入公司名称', btnArray, function (e) {
          if (e.index === 1) {
            // 申请添加擅长标签；
            if (e.value) {
              that.applyAddData(e.value)
            }
          }
        }, 'div')
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
          }
//          console.error(response.data.data)
          this.loading = 0
        })
      },
      collectProfessor (item) {
        if (item.id === this.user_id) {
          window.mui.toast('不能关注自己')
        } else {
          postRequest('follow/user',
            {id: item.id}
          ).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            item.is_followed = !item.is_followed
            window.mui.toast(response.data.data.tip)
            this.loading = 0
          })
        }
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
  .companyInfo {
    position: relative;
    background: #ECECEE;
    text-align: center;
    padding: 10px 0 13.5px;
    .companyLogo {
      width: 92px;
      height: 92px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-fit: cover;
      }
    }
    .interval {
      position: absolute;
      right: 15px;
      top: 14px;
      color: #808080;
      font-size: 12px;
    }
    .companyName {
      color: #444444;
      font-size: 16px;
      line-height: 22.5px;
      margin: 12px 0 8px;
    }
    .tags {
      color: #808080;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 8px;
      .line-wall {
        height: 13px;
        margin: 0 11px;
        top: 2px;
      }
    }
    .address {
      color: #808080;
      font-size: 12px;
      .icon {
        color: #B4B4B6;
        font-size: 13px;
      }
    }
  }
  .switchMenu {
    width: 100%;
    height: 39px;
    position: relative;
    line-height: 39px;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    span {
      width: 50%;
      color: #444444;
      font-size: 14px;
      position: relative;
      text-align: center;
      i {
        position: absolute;
        width: 56px;
        height: 0.053rem;
        border-radius: 1.333rem;
        background: #03aef9;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
    }
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

  .relevantPepole {
    .pepoleList {
      .userLogo {
        width: 1.173rem;
        height: 1.173rem;
        position: relative;
        float: left;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }
        .icon {
          position: absolute;
          font-size: 0.453rem;
          bottom: 0;
          right: -0.053rem;
        }
      }
      .userInfo {
        float: left;
        .name {
          display: flex;
          span {
            &:nth-of-type(1) {
              margin-top: 1px;
            }
            &:nth-of-type(2) {
              width:0.426rem;
              height:0.4rem;
              background: url("../../statics/images/rank.png") no-repeat;
              background-size: 100% 100%;
              color:#FFFFFF;
              font-size:0.266rem;
              line-height: 0.346rem;
              padding-left: 3px;
              margin-top: 2px;
            }
          }
        }
      }
      .follow {
        float: right;
      }
    }
  }

</style>
