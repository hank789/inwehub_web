<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的关注</h1>
    </header>

    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">关注的用户 <i></i></span>
        <span @tap.stop.prevent="$router.replace('/collectQuestion')">关注的问题</span>

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
                :class="{bottomBorder:index !== list.length-1  }">

              <div class="avatar">
                <div class="avatarInner" @tap.stop.prevent="">
                  <img :src="item.avatar_url">

                  <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>

              <div class="textBody ">
                <div class="name mui-ellipsis">{{item.name}} &nbsp;</div>
                <div class="desc mui-ellipsis">{{item.description}} &nbsp;</div>
              </div>

              <div class="ibutton active" v-if="item.is_followed" @tap.stop.prevent="collectProfessor(item.uuid,index)">
                已关注
              </div>
              <div class="ibutton" @tap.stop.prevent="collectProfessor(item.uuid,index)" v-else>关注Ta</div>

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
        lastList: []
      }
    },
    components: {
      Contact
    },
    methods: {
      // 点击关注；
      collectProfessor (id, index) {
        postRequest(`follow/user`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          console.log(this.list[index].is_followed)
          this.list[index].is_followed = this.list[index].is_followed
          window.mui.toast(response.data.data.tip)
        })
      },
      // 数据；
      getList () {
        postRequest(`followed/users`, {}).then(response => {
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
                is_invited: 0,
                uuid: arr[i].uuid

              }
              this.list = this.list.concat(item)
            }
          }
          console.error(this.list)

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
  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
  }

  .menu span {
    display: block;
    width: 50%;
    height: 100%;
    float: left;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    color: #3c95f9;
    position: relative;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 73px;
    height: 1.5px;
    left: 30%;
    bottom: 0.5px;
    background: #3c95f9;
  }

  /**/

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
    margin-top: 45px;
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
</style>
