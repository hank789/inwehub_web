<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">文章分享</h1>
    </header>

    <div class="mui-content" @tap="hideAllOptions()">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">热门 <i></i></span>
        <span @tap.stop.prevent="$router.replace('/discover/newest')">最新 </span>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.replace('/discover/add')">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
      </div>
      <!--滚动区域-->
      <RefreshList
        v-model="list"
        :api="'article/list'"
        :pageMode="true"
        :prevOtherData="{sort:'hot', page: 1}"
        :nextOtherData="{sort:'hot'}"
        class="listWrapper">
        <ul>
          <template v-for="(hot, index) in list">
            <li class="Container" v-if="hot.type === 'link'" >
              <div @tap.stop.prevent="goDetial(hot)" >
                <p>{{hot.data.title}}<i>{{hot.data.domain}}</i></p>
                <p class="container-image" v-if="hot.data.img">
                  <img class="lazyImg" v-lazy="hot.data.img">
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
                <p  @tap.stop.prevent="$router.pushPlus('/c/'+ hot.category_id+'/'+ hot.slug, 'list-detail-page')">
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
  import { openVendorUrl, openAppUrl } from '../../utils/plus'
  import userAbility from '../../utils/userAbility'

  const PublishAnswers = {
    data: () => ({
      list: [],
      userId: currentUser.user_id
    }),
    created () {
    },
    computed: {},
    components: {
      RefreshList,
      TextDetail
    },
    updated () {
      this.$nextTick(() => {
        var eles = this.$el.querySelectorAll('.textContainer')
        for (var i in eles) {
          openVendorUrl(eles[i])
          openAppUrl(eles[i])
        }
      })
    },
    methods: {
      goDetial (hot) {
        switch (hot.type) {
          case 'text':
            this.$router.pushPlus('/c/' + hot.category_id + '/' + hot.slug, 'list-detail-page')
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

          if (code === 6108) {
            userAbility.inviteJoinInGroup(this, response.data.data.group_id)
            return
          }

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
            if (process.env.NODE_ENV === 'production' && window.mixpanel) {
              // mixpanel
              window.mixpanel.track(
                'inwehub:support:success',
                {
                  'app': 'inwehub',
                  'user_device': window.getUserAppDevice(),
                  'page': this.id,
                  'page_name': 'submission',
                  'page_title': hot.is_upvoted ? 'support' : 'cancel',
                  'referrer_page': ''
                }
              )
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

          if (code === 6108) {
            userAbility.inviteJoinInGroup(this, response.data.data.group_id)
            return
          }

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
      }
    },
    mounted () {
      document.addEventListener('tap', () => {

      })
    }
  }
  export default PublishAnswers
</script>
<style scoped>
  .mui-wechat .menu {
    width: 100%;
    height: 1.2rem;
    position: absolute;
    z-index: 10;
    background: #ffffff;
    top: 0;
  }

  .mui-content {
    background: #F3F4F5;
  }

  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 1.2rem;
    position: absolute;
    z-index: 10;
    background: #ffffff;
    padding: 0 0.453rem;
    border-bottom: 0.026rem solid #dcdcdc;
  }

  .menu span {
    display: block;
    height: 100%;
    float: left;
    font-size: 0.373rem;
    color: #444444;
    text-align: center;
    line-height: 1.2rem;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    position: relative;
  }

  .menu span:nth-of-type(2) {
    margin-left: 0.906rem;
  }

  .menu svg {
    float: right;
    color: #03aef9;
    margin-top: 0.346rem;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 0.72rem;
    height: 0.04rem;
    left: 0%;
    bottom: 0.013rem;
    background: #03aef9;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

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
    padding: 0.32rem 0.426rem 0 0.426rem;
    margin-bottom: 0.266rem;

  }

  ul .Container p:nth-of-type(1) {
    font-size: 0.4rem;
    color: #444444;
    line-height: 0.533rem;
  }

  ul .Container p:nth-of-type(1) i {
    font-size: 0.32rem;
    color: rgb(180, 180, 182);
  }

  ul .Container .container-image {
    height: 3.306rem;
    margin-top: 0.346rem;
  }

  ul .Container p.timer {
    width: 100%;
    height: 1.173rem;
    font-size: 0.32rem;
    color: #b4b4b6;
    line-height: 1.173rem;
    position: relative;
  }

  ul .Container p.timer a {
    font-size: 0.32rem;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 1.066rem;
    padding: 0 0.453rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  ul .Container .information p {
    color: #808080;
    position: relative;
    height:1.066rem;
    display: flex;
    align-items: center;
    padding:0 0.133rem;
  }

  /*举报和删除*/
  .information p:nth-of-type(1) span {
    display: block;
    width: 1.333rem;
    background: #575857;
    position: absolute;
    top: 0.746rem;
    left: -0.346rem;
    border-radius: 0.106rem;
    z-index: 99;
  }

  .information p:nth-of-type(1) span:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 0.133rem solid transparent;
    border-top: 0.133rem solid #575857;
    border-left: 0.133rem solid #575857;
    transform: rotate(45deg);
    position: absolute;
    top: -0.053rem;
    left: 0;
    right: 0;
    margin: auto;

  }

  .information p:nth-of-type(1) span a {
    display: block;
    text-align: center;
    font-size: 0.346rem;
    color: #FFFFFF;
    padding: 0.08rem 0;
  }

  .information p svg {
    font-size: 0.453rem;
  }

  .information p:nth-of-type(2) svg {
    font-size: 0.48rem;
  }

  .information p:nth-of-type(3) svg {
    font-size: 0.453rem;
    margin-right: 0.08rem;

  }

  .information p:nth-of-type(4) svg {
    font-size: 0.453rem;
    margin-right: 0.08rem;
  }

  /*带定位和图片的样式*/
  .imgContainer {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 0.32rem 0.4rem 0 0.4rem;
    margin-bottom: 0.266rem;
  }

  .imgContainer:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 0.266rem;
    background-color: #f3f4f6;
    width: 100%;
  }

  .imgContainer .avatar {
    width: 100%;
    height: 0.906rem;
  }

  .avatar p:nth-of-type(1) {
    width: 0.906rem;
    height: 0.906rem;
    border-radius: 50%;
    float: left;
    position: relative;
  }

  .avatar p:nth-of-type(1) svg {
    position: absolute;
    font-size: 0.453rem;
    bottom: 0;
    right: -0.16rem;
  }

  .avatar p:nth-of-type(1) img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar p:nth-of-type(2) {
    font-size: 0.346rem;
    color: #808080;
    line-height: 0.906rem;
    margin-left: 0.213rem;
    float: left;
  }

  .textContainer {
    width: 100%;
    font-size: 0.4rem;
    color: #444444;
    line-height: 0.533rem;
    margin-top: 0.16rem;
  }

  .timeContainer {
    width: 100%;
    height: 1.12rem;
    font-size: 0.32rem;
    line-height: 1.12rem;

  }

  .timeContainer svg {
    font-size: 0.373rem;
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
    margin-top: 0.346rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    /*border:0.026rem solid #000000;*/
  }

  .PublishContainer .container-image {
    width: 2.88rem;
    /*border:0.026rem solid #000000;*/

  }

  .PublishContainer .container-image img {
    width: 100%;
    height: 100%;
  }

  .PublishContainer p:nth-of-type(2), .PublishContainer p:nth-of-type(3) {
    margin-left: 2%;
  }

  #container-image {
    width: 4rem;
    height: 6.026rem;
  }

  /*适配*/
  @media (min-width: 320px) {
    .PublishContainer .container-image {
      height: 2.453rem;
    }

  }

  @media (min-width: 375px) {
    .PublishContainer .container-image {
      height: 2.88rem;
    }

  }

  @media (min-width: 414px) {
    .PublishContainer .container-image {
      height: 2.88rem;
    }

  }

  ul .Container .information p.blue {
    color: #03aef9;
  }

  .listWrapper {
    margin-top: 1.2rem;
  }

</style>
