<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">标签详情</h1>
    </header>
    <div class="mui-content absolute">
      <div class="tag-title">
        <div class="tag-l" v-if="tagDetail.logo">
          <img :src="tagDetail.logo">
        </div>
        <div class="tag-l bg-grey" v-else>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
          </svg>
        </div>
        <div class="tag-r">
          <p>
            <span>{{tagDetail.name}}</span>
            <span class="grey" v-if="tagDetail.is_followed" @tap.stop.prevent="collectTag(tagDetail.id)">已关注</span>
            <span  v-else @tap.stop.prevent="collectTag(tagDetail.id)">关注</span>
          </p>
          <p class="mui-ellipsis-3">{{tagDetail.summary}}</p>
        </div>
      </div>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/questions')">问答</span>
        <span @tap.stop.prevent=" ">动态 <i></i></span>
        <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/users')">用户 </span>
        <i class="bot"></i>
      </div>
      <!--内容区域-->
      <!--滚动区域-->
      <RefreshList
        v-model="list"
        :api="'tags/submissions'"
        :pageMode="true"
        :prevOtherData="{tag_name:tagName, page: 1}"
        :nextOtherData="{tag_name:tagName}"
        class="listWrapper">
        <ul>
          <template v-for="(hot, index) in list">
            <li class="Container" v-if="hot.type === 'link'" >
              <div @tap.stop.prevent="goDetial(hot)" >
                <p>{{hot.data.title}}<i>{{hot.data.domain}}</i></p>
                <p class="container-image" v-if="hot.data.img">
                  <img :src="hot.data.img">
                </p>
                <p class="timer">
                  <timeago :since="timeago(hot.created_at)" :auto-update="60">
                  </timeago>
                  <a>#{{hot.category_name}}</a>
                  <i class="bot"></i>
                </p>
              </div>
              <div class="information">
                <p>
                  <svg class="icon" aria-hidden="true" @tap.stop.prevent="toggleOptions">
                    <use xlink:href="#icon-gengduo"></use>
                  </svg>
                  <span class="carte" style="display: none;">
                    <a @tap.stop.prevent="report(hot.user_id)" v-if="userId != hot.owner.id">举报</a>
                    <a @tap.stop.prevent="deleterow(hot.id,index)" v-else>删除</a>
                  </span>
                </p>
                <p @tap.stop.prevent="bookmarkuBmission(hot)" :class="hot.is_bookmark ? 'blue':''">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shoucangxingxing"></use>
                  </svg>
                </p>
                <p  @tap.stop.prevent="$router.pushPlus('/c/'+ hot.category_id+'/'+ hot.slug)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-pinglun1"></use>
                  </svg>
                  {{hot.comments_number}}

                </p>
                <p @tap.stop.prevent="downvoteComment(hot)" :class="hot.is_upvoted ? 'blue':''">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dianzan1"></use>
                  </svg>
                  {{hot.upvotes}}

                </p>
              </div>
            </li>
            <!--带图片的样式-->
            <li class="imgContainer" v-else-if="hot.type === 'text'">
              <TextDetail :data="hot" @downvoteComment="downvoteComment"
                          @bookmarkuBmission="bookmarkuBmission"
                          @report="report"
                          @deleterow="deleterow(hot.id, index)"
              ></TextDetail>

            </li>
          </template>
        </ul>
      </RefreshList>

    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'
  import TextDetail from '../../components/discover/TextDetail'
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')
  import { goThirdPartyArticle } from '../../utils/webview'

  const PublishAnswers = {
    data: () => ({
      tagName: '',
      list: [],
      userId: currentUser.user_id,
      tagDetail: {}
    }),
    created () {
      if (this.$route.params.tag) {
        this.tagName = this.$route.params.tag
      }
    },
    computed: {},
    components: {
      RefreshList,
      TextDetail
    },
    methods: {
      goDetial (hot) {
        switch (hot.type) {
          case 'text':
            this.$router.pushPlus('/c/' + hot.category_id + '/' + hot.slug)
            break
          case 'link':
            goThirdPartyArticle(
              hot.data.url,
              hot.id,
              hot.title,
              '/c/' + hot.category_id + '/' + hot.slug,
              hot.data.img
            )
            break
          default:
        }
      },
      hideAllOptions () {
        var list = document.querySelectorAll('.carte')
        for (var i in list) {
          if (!list[i].style) continue
          list[i].style.display = 'none'
        }
      },
      toggleOptions (event) {
        if (event.target.nodeName !== 'svg') return
        var target = event.target.nextElementSibling
        target.style.display = target.style.display === 'none' ? 'block' : 'none'
      },
      report (id) {
        var that = this
        var btnArray = ['取消', '确定']
        window.mui.confirm('确定举报吗？', ' ', btnArray, function (e) {
          if (e.index === 1) {
            that.hideAllOptions()
            window.mui.toast('举报成功')
          }
        })
      },
      deleterow (id, index) {
        var btnArray = ['取消', '确定']
        var list = this.list
        window.mui.confirm('确定删除吗？', ' ', btnArray, (e) => {
          if (e.index === 1) {
            // 进行删除
            postRequest(`article/destroy-submission`, {
              id: id
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.alert(response.data.message)
                window.mui.back()
                return
              }
              if (response.data.data) {
                list.splice(index, 1)
                this.hideAllOptions()
                window.mui.toast('删除成功')
              }
            })
          }
        })
      },
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      // 赞文章
      downvoteComment (hot) {
        postRequest(`article/upvote-submission`, {
          submission_id: hot.id
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            if (response.data.data.type === 'upvote') {
              hot.upvotes += 1
              hot.is_upvoted = 1
            } else {
              hot.is_upvoted = 0
              hot.upvotes -= 1
            }
          }
        })
      },
      // 赞文章
      bookmarkuBmission (hot) {
        postRequest(`article/bookmark-submission`, {
          id: hot.id
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            if (response.data.data.type === 'bookmarked') {
              hot.is_bookmark = 1
            } else {
              hot.is_bookmark = 0
            }
          }
        })
      },
      getTagInfo () {
        postRequest('tags/tagInfo', {
          tag_name: this.tagName
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.tagDetail = response.data.data
          this.loading = 0
        })
      },
      collectTag (id) {
        postRequest(`follow/tag`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.tagDetail.is_followed = !this.tagDetail.is_followed
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
      this.getTagInfo()
      document.addEventListener('tap', () => {

      })
    },
    updated () {

    }
  }
  export default PublishAnswers
</script>

<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  .tag-title{
    width:100%;
    height:133px;
    background: #f3f4f6;
    padding: 0 4%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-l{
    width:92px;
    height:92px;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 4px;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 4px;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 50px;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }
  .tag-r{
    height:92px;
    margin-left: 10px;
  }
  .tag-r p:nth-of-type(1){
    font-size:18px;
    color: #444444;
    font-weight:500;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2){
    float: right;
    width:62px;
    height:27px;
    background: #a8dff7;
    text-align: center;
    line-height: 26px;
    border-radius: 4px;
    font-size:14px;
    color: #235280;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2).grey{
    color: #808080;
    background: #dcdcdc;
  }
  .tag-r p:nth-of-type(2){
    margin-top: 11px;
  }
  /*菜单*/
  .menu{
    width:100%;
    height:39px;
    background: #FFFFFF;
    font-size:14px;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .menu span:nth-of-type(2){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(2) i{
    position:absolute;
    width:27px;
    height:1.5px;
    border-radius: 50px;
    background:#03aef9;
    top: 28px;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*滚动区域*/
  ul {
    width: 100%;
    overflow: hidden;
    background: #F3F4F5;
  }

  ul .Container {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 12px 16px 0 16px;
    margin-bottom: 10px;

  }

  ul .Container p:nth-of-type(1) {
    font-size: 15px;
    color: #444444;
    line-height: 20px;
  }

  ul .Container p:nth-of-type(1) i {
    font-size: 12px;
    color: rgb(180, 180, 182);
  }

  ul .Container .container-image {
    height: 124px;
    margin-top: 13px;
  }

  ul .Container p.timer {
    width: 100%;
    height: 44px;
    font-size: 12px;
    color: #b4b4b6;
    line-height: 44px;
    position: relative;
  }

  ul .Container p.timer a {
    font-size: 12px;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 40px;
    padding: 0 17px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  ul .Container .information p {
    color: #808080;
    position: relative;
    height:40px;
    display: flex;
    align-items: center;
    padding:0 5px;
  }

  /*举报和删除*/
  .information p:nth-of-type(1) span {
    display: block;
    width: 50px;
    background: #575857;
    position: absolute;
    top: 28px;
    left: -13px;
    border-radius: 4px;
    z-index: 99;
  }

  .information p:nth-of-type(1) span:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top: 5px solid #575857;
    border-left: 5px solid #575857;
    transform: rotate(45deg);
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    margin: auto;

  }

  .information p:nth-of-type(1) span a {
    display: block;
    text-align: center;
    font-size: 13px;
    color: #FFFFFF;
    padding: 3px 0;
  }

  .information p svg {
    font-size: 17px;
  }

  .information p:nth-of-type(2) svg {
    font-size: 18px;
  }

  .information p:nth-of-type(3) svg {
    font-size: 17px;
    margin-right: 3px;

  }

  .information p:nth-of-type(4) svg {
    font-size: 17px;
    margin-right: 3px;
  }

  /*带定位和图片的样式*/
  .imgContainer {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 12px 15px 0 15px;
    margin-bottom: 10px;
  }

  .imgContainer:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 10px;
    background-color: #f3f4f6;
    width: 100%;
  }

  .imgContainer .avatar {
    width: 100%;
    height: 34px;
  }

  .avatar p:nth-of-type(1) {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    float: left;
    position: relative;
  }

  .avatar p:nth-of-type(1) svg {
    position: absolute;
    font-size: 17px;
    bottom: 0;
    right: -6px;
  }

  .avatar p:nth-of-type(1) img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar p:nth-of-type(2) {
    font-size: 13px;
    color: #808080;
    line-height: 34px;
    margin-left: 8px;
    float: left;
  }

  .textContainer {
    width: 100%;
    font-size: 15px;
    color: #444444;
    line-height: 20px;
    margin-top: 6px;
  }

  .timeContainer {
    width: 100%;
    height: 42px;
    font-size: 12px;
    line-height: 42px;

  }

  .timeContainer svg {
    font-size: 14px;
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(1) {
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(2) {
    color: #808080;
  }

  /*图片*/
  .PublishContainer {
    width: 100%;
    overflow: hidden;
    margin-top: 13px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    /*border:1px solid #000000;*/
  }

  .PublishContainer .container-image {
    width: 108px;
    /*border:1px solid #000000;*/

  }

  .PublishContainer .container-image img {
    width: 100%;
    height: 100%;
  }

  .PublishContainer p:nth-of-type(2), .PublishContainer p:nth-of-type(3) {
    margin-left: 2%;
  }

  #container-image {
    width: 150px;
    height: 226px;
  }

  /*适配*/
  @media (min-width: 320px) {
    .PublishContainer .container-image {
      height: 92px;
    }

  }

  @media (min-width: 375px) {
    .PublishContainer .container-image {
      height: 108px;
    }

  }

  @media (min-width: 414px) {
    .PublishContainer .container-image {
      height: 108px;
    }

  }




  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 375px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 414px) {
    .tag-r {
      width: 73%;
    }
  }
  .listWrapper{
    top:177px;
  }
</style>
