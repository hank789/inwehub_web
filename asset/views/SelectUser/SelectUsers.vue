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

              <div class="select active" v-if="Selected[key + '_' + index]" @tap.stop.prevent="collectProfessor(key + '_' + index, item)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-check-circle"></use>
                </svg>

              </div>
              <div class="select" v-else @tap.stop.prevent="collectProfessor(key + '_' + index, item)">
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
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      // 点击选择；
      collectProfessor (index, item) {
        var value = this.Selected[index] ? false : item
        Vue.set(this.Selected, index, value)
        console.log(this.Selected)
        var options = []
        for (var i in this.Selected) {
          if (this.Selected[i]) {
            options.push(this.Selected[i])
          }
        }
        localEvent.setLocalItem('select_users' + this.userId, options)
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
      console.log(this.lastList)
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*搜索区域*/

  .indexHeader {
    background-color: #FFFFFF;
    padding: 10px 15px;
    .searchWrapper {
      input {
        height: 34px;
        font-size: 14px;
        border-radius: 50px;
        background: #fff;
        border: 1px solid #dcdcdc;
        margin-bottom: 5px;
        &::placeholder {
          color: #c8c8c8;
        }
      }
    }
    .notFound {
      font-size: 13px;
      color: #808080;
      span {
        color: #03aef9;
      }
    }
  }

  .indexTitle {
    background: #ececee;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
    padding: 0 15px;
    color: #808080;
  }

  .mui-content {
    background: #fff;
  }

  .textBody {
    width: 50%;
  }

  .select{
    float: right;
    width:23px;
    height:23px;
    border-radius: 50%;
    background: #FFFFFF;
    color: #03aef9;
    border: 1px solid #dcdcdc;
    position: relative;
    top: 10px;
    margin-right: 5px;
  }
  .select.active{
    background:#FFFFFF;
    border: 1px solid #FFFFFF;


  }
  .select.active svg{
    font-size:23px;
    position: absolute;
    color:#03aef9;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    margin: auto;
  }
</style>
