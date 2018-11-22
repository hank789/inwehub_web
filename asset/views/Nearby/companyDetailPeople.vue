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
        :api="'company/dataPeople'"
        :prevOtherData="{page: 1, id:this.id}"
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
          <span @tap.stop.prevent="$router.replace('/companyDetailProduct/' + id)">产品服务</span>
          <span class="font-family-medium">相关人员<i></i></span>
          <i class="bot"></i>
        </div>

        <div class="relevantPepole">
          <div class="pepoleList" v-for="(info, infoIndex) in list" :key="infoIndex">
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
                <div class="describe text-line-1">{{ info.description }}</div>
              </div>
              <div class="follow" :class="info.is_followed ? 'active' : ''" @tap.stop.prevent="collectProfessor(info)"> {{ !info.is_followed ? '关注Ta' : '已关注' }}</div>
            </div>
            <div class="line-river-after line-river-after-top"></div>
          </div>

          <div class="noResult increase dianping-search" v-if="list.length === 0">
            <div class="empty-Img">
              <img src="../../statics/images/empty@3x.png">
            </div>
            <div class="noResultText">暂无相关人员~</div>
          </div>

        </div>

      </RefreshList>
      <div class="meTo">
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
      RefreshList
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
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
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
    bottom: 1.173rem;
  }

  .relevantPepole {
    .pepoleList {
      position: relative;
      padding: 0.266rem 0.426rem;
      .pepoleWrapper {
        overflow: hidden;
        padding-bottom: 0.266rem;
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
        width: 5.5rem;
        float: left;
        margin-top: 0.08rem;
        margin-left: 0.2rem;
        .name {
          display: flex;
          line-height: 0.533rem;
          span {
            &:nth-of-type(1) {
              color: #565656;
              font-size: 0.373rem;
            }
            &:nth-of-type(2) {
              width:0.426rem;
              height:0.4rem;
              background: url("../../statics/images/rank.png") no-repeat;
              background-size: 100% 100%;
              color:#FFFFFF;
              font-size:0.266rem;
              line-height: 0.346rem;
              padding-left: 0.08rem;
              margin: 0.08rem 0.133rem 0;
            }
            &:nth-of-type(3) {
              font-size: 0.373rem;
            }
          }
        }
        .describe {
          color: #B4B4B6;
          font-size: 0.293rem;
          line-height: 0.4rem;
          margin-top: 0.08rem;
        }
      }
      .follow {
        height: 0.72rem;
        float: right;
        color: #FEFEFE;
        font-size: 0.373rem;
        line-height: 0.72rem;
        padding: 0 0.266rem;
        background: #03AEF9;
        border-radius: 2.666rem;
        margin-top: 0.226rem;
        &.active {
          color: #B4B4B6;
          background: #DCDCDC;
        }
      }
    }
  }
  .meTo {
    width: 100%;
    height: 1.173rem;
    position: absolute;
    bottom: 0;
    .bot {
      top: 0;
    }
    .text {
      width: 9.146rem;
      height: 0.96rem;
      line-height: 0.96rem;
      text-align: center;
      color: #ffffff;
      font-size: 0.426rem;
      background: #03AEF9;
      margin: 0.106rem auto 0;
      border-radius: 0.213rem;
    }
  }

</style>
