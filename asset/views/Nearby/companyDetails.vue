<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">企业详情</h1>
    </header>

  <div class="mui-content">
    <RefreshList
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
        <div class="tags"><span v-for="(tags, tagsindex) in datailList.tags" :key="tagsindex">{{ tags }}<i class="line-wall" v-if="tagsindex !== datailList.tags.length - 1"></i></span></div>
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

      <div class="relevantPepole" v-if="type === 2">
        <div class="pepoleList" v-for="(info, infoIndex) in DataPeopleList" :key="infoIndex">
          <div class="pepoleWrapper">
            <div class="userLogo" @tap.stop.prevent="toAvatar(info.uuid)">
              <ImageView :src="info.avatar" width="44" height="44"></ImageView>
              <!--<img src="../../statics/images/uicon.jpg" alt="">-->
              <svg class="icon" aria-hidden="true" v-if="info.is_expert">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </div>
            <div class="userInfo">
              <div class="name">
                <span class="font-family-medium">{{ info.name }}</span>
                <span>{{ info.level }}</span>
                <span>({{ info.status_info }})</span>
              </div>
              <div class="describe">{{ info.description }}</div>
            </div>
            <div class="follow" :class="info.is_followed ? 'active' : ''" @tap.stop.prevent="collectProfessor(info)"> {{ !info.is_followed ? '关注Ta' : '已关注' }}</div>
          </div>
          <div class="line-river-after line-river-after-top"></div>
        </div>

        <div class="noResult increase dianping-search" v-if="DataPeopleList.length === 0">
          <div class="empty-Img">
            <img src="../../statics/images/empty@3x.png">
          </div>
          <div class="noResultText">暂无相关人员~</div>
        </div>

      </div>

    </RefreshList>
    <div class="meTo" v-if="type === 2">
      <div class="bot"></div>
      <div class="text" @tap.stop.prevent="$router.pushPlus('/my/info')">我也是相关人员</div>
    </div>
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
        DataPeopleList: []
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
      Switch (type) {
        this.type = type
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      refreshPageData () {
        this.id = this.$route.params.id
        this.companyInfo()
        this.getDataPeople()
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
      getDataPeople () {
        postRequest('company/dataPeople', {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          this.DataPeopleList = response.data.data.data
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
  .listWrapper{
    bottom: 44px;
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
      position: relative;
      padding: 10px 16px;
      .pepoleWrapper {
        overflow: hidden;
        padding-bottom: 10px;
      }
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
        width: 6rem;
        float: left;
        margin-top: 3px;
        margin-left: 7.5px;
        .name {
          display: flex;
          line-height: 20px;
          span {
            &:nth-of-type(1) {
              color: #565656;
              font-size: 14px;
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
              margin: 3px 5px 0;
            }
            &:nth-of-type(3) {
              font-size: 14px;
            }
          }
        }
        .describe {
          color: #B4B4B6;
          font-size: 11px;
          line-height: 15px;
          margin-top: 3px;
        }
      }
      .follow {
        height: 27px;
        float: right;
        color: #FEFEFE;
        font-size: 14px;
        line-height: 27px;
        padding: 0 10px;
        background: #03AEF9;
        border-radius: 100px;
        margin-top: 8.5px;
        &.active {
          color: #B4B4B6;
          background: #DCDCDC;
        }
      }
    }
  }
  .meTo {
    width: 100%;
    height: 44px;
    position: absolute;
    bottom: 0;
    .bot {
      top: 0;
    }
    .text {
      width: 343px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #ffffff;
      font-size: 16px;
      background: #03AEF9;
      margin: 4px auto 0;
      border-radius: 8px;
    }
  }

</style>
