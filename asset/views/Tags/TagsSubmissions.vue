<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">标签详情</h1>
    </header>
    <div class="mui-content absolute">
      <TagsInfo :tagName = tagName></TagsInfo>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/questions')">问答</span>
        <span @tap.stop.prevent=" ">分享 <i></i></span>
        <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/users')">用户 </span>
        <i class="bot"></i>
      </div>
      <!--内容区域-->
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
      <!--活动标签-->
      <div class="activity_tags" v-if="activity_tags.length">
        <p @tap.stop.prevent='addTag(2)' v-if="tagName == activity_tags[2].text" >
          <img src="../../statics/images/tag_detail_suggest@2x.png"/>
        </p>
        <p @tap.stop.prevent='addTag(1)' v-if="tagName == activity_tags[1].text">
          <img src="../../statics/images/tag_detail_work@2x.png"/>
        </p>
        <p @tap.stop.prevent="addTag(0)" v-if="tagName == activity_tags[0].text">
          <img src="../../statics/images/tag_detail_newyewr@2x.png"/>
        </p>
      </div>
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
  import TagsInfo from '../../components/tags/TagsInfo.vue'

  const PublishAnswers = {
    data: () => ({
      tagName: '',
      list: [],
      userId: currentUser.user_id,
      activity_tags: []
    }),
    created () {
      if (this.$route.params.tag) {
        this.tagName = this.$route.params.tag
      }
    },
    computed: {},
    components: {
      RefreshList,
      TextDetail,
      TagsInfo
    },
    methods: {
//      refreshPageData () {
//        if (this.$route.params.tag) {
//          this.tagName = this.$route.params.tag
//        }
//      },
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
      // 获取活动标签
      getTag () {
        postRequest(`tags/getThreeAc`, {}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.tags.length > 0) {
            this.activity_tags = response.data.data.tags
          }
        })
      },
      addTag (num) {
        var arr = []
        arr.push(this.activity_tags[num])
        localEvent.setLocalItem('discover_skill_tags' + this.userId, arr)
        this.$router.pushPlus('/discover/add?from=selecttags')
      }
    },
    mounted () {
      this.getTag()
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
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  /*菜单*/
  .menu{
    width:100%;
    height:3.9rem;
    background: #FFFFFF;
    font-size:1.4rem;
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
    width:2.7rem;
    height:0.15rem;
    border-radius: 5rem;
    background:#03aef9;
    top: 2.8rem;
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
    padding: 1.2rem 1.6rem 0 1.6rem;
    margin-bottom: 1rem;

  }

  ul .Container p:nth-of-type(1) {
    font-size: 1.5rem;
    color: #444444;
    line-height: 2rem;
  }

  ul .Container p:nth-of-type(1) i {
    font-size: 1.2rem;
    color: rgb(180, 180, 182);
  }

  ul .Container .container-image {
    height: 12.4rem;
    margin-top: 1.3rem;
  }

  ul .Container p.timer {
    width: 100%;
    height: 4.4rem;
    font-size: 1.2rem;
    color: #b4b4b6;
    line-height: 4.4rem;
    position: relative;
  }

  ul .Container p.timer a {
    font-size: 1.2rem;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 4rem;
    padding: 0 1.7rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  ul .Container .information p {
    color: #808080;
    position: relative;
    height:4rem;
    display: flex;
    align-items: center;
    padding:0 0.5rem;
  }

  /*举报和删除*/
  .information p:nth-of-type(1) span {
    display: block;
    width: 5rem;
    background: #575857;
    position: absolute;
    top: 2.8rem;
    left: -1.3rem;
    border-radius: 0.4rem;
    z-index: 99;
  }

  .information p:nth-of-type(1) span:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 0.5rem solid transparent;
    border-top: 0.5rem solid #575857;
    border-left: 0.5rem solid #575857;
    transform: rotate(45deg);
    position: absolute;
    top: -0.2rem;
    left: 0;
    right: 0;
    margin: auto;

  }

  .information p:nth-of-type(1) span a {
    display: block;
    text-align: center;
    font-size: 1.3rem;
    color: #FFFFFF;
    padding: 0.3rem 0;
  }

  .information p svg {
    font-size: 1.7rem;
  }

  .information p:nth-of-type(2) svg {
    font-size: 1.8rem;
  }

  .information p:nth-of-type(3) svg {
    font-size: 1.7rem;
    margin-right: 0.3rem;

  }

  .information p:nth-of-type(4) svg {
    font-size: 1.7rem;
    margin-right: 0.3rem;
  }

  /*带定位和图片的样式*/
  .imgContainer {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 1.2rem 1.5rem 0 1.5rem;
    margin-bottom: 1rem;
  }

  .imgContainer:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 1rem;
    background-color: #f3f4f6;
    width: 100%;
  }

  .imgContainer .avatar {
    width: 100%;
    height: 3.4rem;
  }

  .avatar p:nth-of-type(1) {
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    float: left;
    position: relative;
  }

  .avatar p:nth-of-type(1) svg {
    position: absolute;
    font-size: 1.7rem;
    bottom: 0;
    right: -0.6rem;
  }

  .avatar p:nth-of-type(1) img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar p:nth-of-type(2) {
    font-size: 1.3rem;
    color: #808080;
    line-height: 3.4rem;
    margin-left: 0.8rem;
    float: left;
  }

  .textContainer {
    width: 100%;
    font-size: 1.5rem;
    color: #444444;
    line-height: 2rem;
    margin-top: 0.6rem;
  }

  .timeContainer {
    width: 100%;
    height: 4.2rem;
    font-size: 1.2rem;
    line-height: 4.2rem;

  }

  .timeContainer svg {
    font-size: 1.4rem;
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
    margin-top: 1.3rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    /*border:0.1rem solid #000000;*/
  }

  .PublishContainer .container-image {
    width: 10.8rem;
    /*border:0.1rem solid #000000;*/

  }

  .PublishContainer .container-image img {
    width: 100%;
    height: 100%;
  }

  .PublishContainer p:nth-of-type(2), .PublishContainer p:nth-of-type(3) {
    margin-left: 2%;
  }

  #container-image {
    width: 15rem;
    height: 22.6rem;
  }

  /*适配*/
  @media (min-width: 32rem) {
    .PublishContainer .container-image {
      height: 9.2rem;
    }

  }

  @media (min-width: 37.5rem) {
    .PublishContainer .container-image {
      height: 10.8rem;
    }

  }

  @media (min-width: 41.4rem) {
    .PublishContainer .container-image {
      height: 10.8rem;
    }

  }


  .listWrapper{
    top:17.7rem;
  }
  /*活动标签*/
  .activity_tags{
    width:11.4rem;
    overflow: hidden;
    position: absolute;
    right: 4%;
    bottom: 3rem;
    z-index: 2;
  }
  .activity_tags p{
    width:11.4rem;
    height: 4.4rem;
    margin-top: 1rem;
    background: #cccccc;
    border-radius: 5rem;
  }
  .activity_tags p img{
    width:100%;
    height: 100%;
    border-radius: 5rem;
  }
</style>
