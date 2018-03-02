<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{type?'私信好友':'我的关注'}}</h1>
    </header>



    <div class="mui-content">
      <!--导航栏-->
      <div class="menu" v-if="!type">
        <span @tap.stop.prevent="">用户<i></i></span>
        <span @tap.stop.prevent="$router.replace('/collectQuestion')">问答</span>
        <span @tap.stop.prevent="$router.replace('/collectTags')">标签</span>
        <i class="bot"></i>
      </div>


      <!--搜索区域-->
      <Contact :list="list" v-model="lastList" :search="search">

        <div slot="header" class="indexHeader">
          <div class="searchWrapper">
            <input type="text" placeholder="输入用户名" v-model.trim="search">
          </div>

          <div class="notFound">
            找不到成员？<span>添加新的关注</span>
          </div>

        </div>

        <div class="indexTitle">
          已关注的成员


        </div>

        <div class="groupWrapper">
          <ul v-for="(list, key) in lastList" class="index-bar-group">
            <li :id="key" class="index-bar-cell index-bar-cell-head">{{key}}</li>
            <li v-for="(item, index) in list" :key="index" :data-raw="item.raw" class="index-bar-cell tap-active"
                :class="{bottomBorder:index !== list.length-1  }" @tap.stop.prevent="toChat(item.id)">

              <div class="avatar">
                <div class="avatarInner" @tap.stop.prevent="">
                  <img :src="item.avatar_url" @tap.stop.prevent="toAvatar(item.uuid)">
                  <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>

              <div class="textBody">
                <div class="name mui-ellipsis">{{item.name}} &nbsp;</div>
                <div class="desc mui-ellipsis">{{item.description}} &nbsp;</div>
              </div>

              <div class="ibutton active" v-if="item.is_followed" @tap.stop.prevent="collectProfessor(item.uuid, key, index)">
                已关注
              </div>
              <div class="ibutton" @tap.stop.prevent="collectProfessor(item.uuid,key, index)" v-else>关注Ta</div>

            </li>
          </ul>
        </div>
      </Contact>

    </div>
  </div>
</template>
<script>
  import Contact from '../../components/contact/Index.vue'
  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {
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
        type: ''
      }
    },
    components: {
      Contact
    },
    methods: {
      toChat (id) {
        if (this.type) {
          this.$router.pushPlus('/chat/' + id)
        }
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()))
      },
      // 点击关注；
      collectProfessor (id, key, index) {
        postRequest(`follow/user`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          console.log(index)
          if (response.data.data.type === 'unfollow') {
            this.lastList[key][index].is_followed = 0
          } else {
            this.lastList[key][index].is_followed = 1
          }
          window.mui.toast(response.data.data.tip)
        })
      },
      // 数据；
      getList () {
        postRequest(`followed/searchUsers`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.length > 0) {
            var arr = response.data.data
            for (var i = 0; i < arr.length; i++) {
              var item = {
                id: arr[i].user_id,
                name: arr[i].user_name,
                avatar_url: arr[i].user_avatar_url,
                description: arr[i].description,
                is_expert: arr[i].is_expert,
                is_followed: arr[i].is_followed,
                uuid: arr[i].uuid

              }
              this.list = this.list.concat(item)
            }
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
</style>
