<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="back()"></a>
      <h1 class="mui-title">通讯录好友</h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <!--搜索区域-->
      <Contact :list="list" v-model="lastList" :search="search">

        <div slot="header" class="indexHeader">
          <div class="searchWrapper">
            <input type="text" placeholder="输入用户名" v-model.trim="search">
          </div>
        </div>

        <div class="indexTitle">
          已注册好友
        </div>

        <div class="container-list-people">
          <div class="item" v-for="(item, index) in appUsers">
            <div class="component-imageAndText">
              <div class="imageWrapper" @tap.stop.prevent="toAvatar(item.app_user_uuid)"><img :src="item.app_user_avatar"></div>
              <div class="textWrapper">
                <div class="line-1 text-line-1">{{item.app_user_name}}</div>
                <div class="line-2 text-line-1">{{item.display_name}}</div>
              </div>
              <div class="buttonWrapper active" v-if="item.app_user_is_followed === 0" @tap.stop.prevent="collectProfessor(item, index)">
                <div class="button">关注TA</div>
              </div>
              <div class="buttonWrapper" v-if="item.app_user_is_followed === 1" @tap.stop.prevent="collectProfessor(item, index)">
                <div class="button">已关注</div>
              </div>
              <div class="buttonWrapper" v-if="item.app_user_is_followed === 2" @tap.stop.prevent="collectProfessor(item, index)">
                <div class="button">已互关</div>
              </div>
            </div>
            <div class="line-river-direct" v-if="index !== appUsers.length-1"></div>
          </div>
        </div>

        <!--<div class="component-imageAndText">-->
          <!--<div class="imageWrapper"><img :src="item.user_avatar_url"></div>-->
          <!--<div class="textWrapper">-->
            <!--<div class="line-1 text-line-1">{{item.user_name}}</div>-->
            <!--<div class="line-2 text-line-1">{{item.description}}</div>-->
          <!--</div>-->
          <!--<div class="time">{{item.visited_time}}</div>-->
        <!--</div>-->

        <div class="indexTitle">
          已关注的成员
        </div>

        <div class="groupWrapper">

          <Empty v-if="lastList.length === 0"></Empty>

          <ul v-for="(list, key) in lastList" class="index-bar-group">
            <li :id="key" class="index-bar-cell index-bar-cell-head">{{key}}</li>

            <div class="component-textAndButton"  v-for="(item, index) in list" :key="index" :data-raw="item.raw" @tap.stop.prevent="toChat(item.id)">
              <div class="item">
                <div class="left">{{item.name}}</div>
                <div class="right">
                  <div class="buttonWrapper"  @tap.stop.prevent="invite(item.id, key, index)">
                    <div class="button">邀请注册</div>
                  </div>
                </div>
              </div>
              <div class="line-river-direct" v-if="index !== list.length-1"></div>
            </div>
            <!--<li v-for="(item, index) in list" :key="index" :data-raw="item.raw" class="index-bar-cell tap-active"-->
                <!--:class="{bottomBorder:index !== list.length-1  }" @tap.stop.prevent="toChat(item.id)">-->
              <!--<div class="textBody">-->
                <!--<div class="name mui-ellipsis">{{item.name}} &nbsp;</div>-->
              <!--</div>-->

              <!--<div class="ibutton" @tap.stop.prevent="invite(item.id, key, index)">邀请注册</div>-->

            <!--</li>-->
          </ul>
        </div>
      </Contact>

    </div>
  </div>
</template>
<script>
  import Contact from '../../components/contact/Index.vue'
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import Empty from '../../components/Empty.vue'
  import Vue from 'vue'

  export default {
    data () {
      return {
        loading: 1,
        id: 0,
        search: '',
        username: '',
        shareUrl: '',
        shareImg: '',
        answernum: 0,
        followednum: 0,
        title: '',
        list: [],
        lastList: [],
        type: '',
        appUsers: []
      }
    },
    components: {
      Contact,
      Empty
    },
    methods: {
      invite (id, key, index) {
        postRequest(`profile/inviteAddressBookUser`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.toast(response.data.message)
        })
      },
      back () {
        //  清空
        localEvent.clearLocalItem('share')
        window.mui.back()
      },
      toChat (id) {
        if (this.type) {
          this.$router.pushPlus('/chat/' + id)
        }
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()), 'list-detail-page')
      },
      // 点击关注；
      collectProfessor (item, index) {
        postRequest(`follow/user`, {
          id: item.app_user_uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (response.data.data.type === 'unfollow') {
            Vue.set(this.appUsers[index], 'app_user_is_followed', 0)
          } else {
            Vue.set(this.appUsers[index], 'app_user_is_followed', 1)
          }
          window.mui.toast(response.data.data.tip)
        })
      },
      // 数据；
      getList () {
        postRequest(`profile/addressBookList`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          var arr = response.data.data.notAppUsers
          this.appUsers = response.data.data.appUsers
          for (var i = 0; i < arr.length; i++) {
            var item = {
              id: arr[i].id,
              name: arr[i].display_name,
              avatar_url: '',
              description: '',
              is_expert: 0,
              is_followed: 0,
              uuid: 0
            }
            this.list = this.list.concat(item)
          }

          this.loading = 0
        })
      }
    },
    watch: {},
    mounted () {
      this.getList()
    },
    created () {
      this.type = this.$route.query.from
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  /*导航栏的样式*/
  .menu{
    width:100%;
    height:1.04rem;
    font-size:0.373rem;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .menu span:nth-of-type(1){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(1) i{
    position:absolute;
    width:0.72rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.746rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  /**/

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*搜索区域*/

  .indexHeader {
    background-color: #FFFFFF;
    padding: 0.266rem 0.4rem;
    .searchWrapper {
      input {
        height: 0.906rem;
        font-size: 0.373rem;
        border-radius: 1.333rem;
        background: #fff;
        border: 0.026rem solid #dcdcdc;
        margin-bottom: 0.133rem;
        &::placeholder {
          color: #c8c8c8;
        }
      }
    }
    .notFound {
      font-size: 0.346rem;
      color: #808080;
      span {
        color: #03aef9;
      }
    }
  }

  .indexTitle {
    background: #ececee;
    font-size: 0.346rem;
    height: 0.666rem;
    line-height: 0.666rem;
    padding: 0 0.4rem;
    color: #808080;
  }

  .mui-content {
    background: #fff;
  }

  .textBody {
    width: 50%;
  }

  .component-textAndButton{
    padding: 0 0 0 0.426rem;
  }

  .container-list-people .item{
    padding:0.266rem 0 0 0.426rem;
  }
</style>
