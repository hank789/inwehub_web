<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">选择用户</h1>
    </header>

    <!--导航栏-->
    <div class="mui-content">
      <!--搜索区域-->
      <Contact :list="list" v-model="lastList" :search="search">

        <div slot="header" class="indexHeader">
          <div class="searchWrapper" v-if="!apperClose">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <input type="text" placeholder="输入用户名" v-model.trim="search">
          </div>
          <!--确定搜索框-->
          <div class="searchContainer" v-if="apperClose">
            <p>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-sousuo"></use>
              </svg>
              <input type="text" placeholder="输入用户名" v-model.trim="search"/>
              <span @tap.stop.prevent="empty()" v-if="search">
                 <svg class="icon" aria-hidden="true">
                   <use xlink:href="#icon-guanbi"></use>
                 </svg>
               </span>
            </p>
            <p @tap.stop.prevent="submitInfo()">确定</p>
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
            <li v-for="(item, index) in list" :data-raw="item.raw" class="index-bar-cell tap-active"
                :class="{bottomBorder:index !== list.length-1  }">

              <div class="avatar">
                <div class="avatarInner" @tap.stop.prevent="">
                  <img :src="item.avatar_url" @tap.stop.prevent="toAvatar(item.uuid)">
                  <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>

              <div class="textBody ">
                <div class="name mui-ellipsis">{{item.name}} &nbsp;</div>
                <div class="desc mui-ellipsis">{{item.description}} &nbsp;</div>
              </div>

              <div class="selectUser" v-if="Selected[key + '_' + index]" @tap.stop.prevent="collectProfessor(key + '_' + index, item)">
                <div class="select active" >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-check-circle"></use>
                  </svg>
                </div>
              </div>
              <div class="selectUser" v-else @tap.stop.prevent="collectProfessor(key + '_' + index, item)">
                <div class="select" ></div>
              </div>
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
  import localEvent from '../../stores/localStorage'
  import Vue from 'vue'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        apperClose: false,
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
        userId: currentUser.user_id,
        Selected: []
      }
    },
    components: {
      Contact
    },
    methods: {
      submitInfo () {
        window.mui.back()
      },
      empty () {
        this.search = ''
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      // 点击选择；
      collectProfessor (index, item) {
        item.listindex = index
        var value = this.Selected[index] ? false : item
        Vue.set(this.Selected, index, value)
        console.log(this.Selected)
        var options = []
        for (var i in this.Selected) {
          if (this.Selected[i]) {
            options.push(this.Selected[i])
          }
        }
//       判断是否有带确定的输入框出现
        if (options.length) {
          this.apperClose = true
        } else {
          this.apperClose = false
        }
        if (this.$route.query.from === 'discover' || this.$route.query.from === 'comment') {
          localEvent.setLocalItem(this.$route.query.from + '_selectUser' + this.userId, options)
        } else {
          return false
        }
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
    activated () {
      this.Selected = []
      if (this.$route.query.from === 'discover' || this.$route.query.from === 'comment') {
        var user = localEvent.getLocalItem(this.$route.query.from + '_selectUser' + this.userId)
        for (var num = 0; num < user.length; num++) {
          this.collectProfessor(user[num].listindex, user[num])
        }
      } else {
        return false
      }
    },
    watch: {},
    mounted () {
      this.getList()
      if (this.$route.query.from === 'discover' || this.$route.query.from === 'comment') {
        var user = localEvent.getLocalItem(this.$route.query.from + '_selectUser' + this.userId)
        for (var num = 0; num < user.length; num++) {
          this.collectProfessor(user[num].listindex, user[num])
        }
      } else {
        return false
      }
    },
    created () {
      console.log(this.lastList)
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>

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
    background-color: #f3f4f6;
    padding: 0.266rem 0.4rem;
    .searchWrapper {
      svg{
        position: absolute;
        left: 0.666rem;
        top: 0.533rem;
        color: #c8c8c8;
      }
      input {
        height: 0.933rem;
        font-size: 0.373rem;
        border-radius: 1.333rem;
        background: #fff;
        border: 0.026rem solid #dcdcdc;
        margin-bottom: 0.133rem;
        padding-left: 0.8rem;
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
  .selectUser{
    float: right;
    position: relative;
    right: 0.133rem;
    width: 0.613rem;
    height: 1.333rem;
  }
  .select{
    width:0.613rem;
    height:0.613rem;
    border-radius: 50%;
    background: #FFFFFF;
    color: #03aef9;
    border: 0.026rem solid #dcdcdc;
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    margin: auto;
  }
  .select.active{
    background:#FFFFFF;
    border: 0.026rem solid #FFFFFF;


  }
  .select.active svg{
    font-size:0.613rem;
    position: absolute;
    color:#03aef9;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    margin: auto;
  }
  /*搜索有确定按钮的*/
  .searchContainer{
    width:100%;
    height:0.933rem;
    background:#f3f4f6;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    margin-bottom: 0.133rem;
  }
  .searchContainer p:nth-of-type(1){
    width: 80%;
    height:0.906rem;
    background: #FFFFFF;
    border-radius: 1.333rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    /*justify-content:space-between;*/
    align-items:center;
    padding:0 0.32rem;
  }
  .searchContainer p:nth-of-type(2){
    width:17%;
    height:0.906rem;
    background:#03aef9;
    border-radius:1.333rem;
    text-align: center;
    line-height: 0.906rem;
    font-size:0.373rem;
    color: #FFFFFF;
  }
  .searchContainer input{
    width:85%;
    height:100%;
    margin: 0;
    border:none;
    padding: 0;
    padding-left: 0;
    font-size:0.373rem;
    color:#444444;
    float: left;
    margin-left: 0.266rem;
  }
  .searchContainer p svg{
    color:#c8c8c8;
    font-size: 0.453rem;
  }
  .searchContainer span{
    width:0.48rem;
    height:0.48rem;
    background: #c8c8c8;
    border-radius: 50%;
    position: relative;
    float:right;
  }
  .searchContainer span svg{
    color: #FFFFFF;
    position: absolute;
    right:0;
    left:0;
    top:0;
    bottom:0;
    margin:auto;
  }
  input::-webkit-input-placeholder { /*WebKit browsers*/
    color:#c8c8c8;
    font-size: 0.373rem;
  }
</style>
